/**
 * article controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // 增加阅读量接口
  async incrementViewCount(ctx) {
    try {
      const { documentId } = ctx.params as { documentId: string };
      const clientIP = ctx.request.ip || ctx.request.socket?.remoteAddress || 'unknown';
      
      // 获取今天的日期（YYYY-MM-DD格式）
      const today = new Date().toISOString().split('T')[0];
      
      // 检查今天是否已经有该IP的阅读记录
      // 先根据 documentId 定位该文档的所有记录（已发布 + 草稿）
      const candidates = await strapi.entityService.findMany('api::article.article' as any, {
        filters: { documentId },
        fields: ['id','view_count','publishedAt'],
        sort: ['updatedAt:desc'],
        limit: -1,
      });
      if (!candidates || candidates.length === 0) {
        return ctx.notFound ? ctx.notFound('文章不存在') : ctx.badRequest('文章不存在');
      }
      // 优先选择已发布的记录
      const published = (candidates as any[]).find(a => !!a.publishedAt);
      const chosen = published ?? (candidates as any[])[0];
      const id = chosen.id as number;
      const allIds: number[] = (candidates as any[]).map(a => a.id as number);
      const existingRecord = await strapi.entityService.findMany('api::reading-record.reading-record' as any, {
        filters: {
          ip_address: clientIP,
          article: { documentId } as any,
          read_date: today,
        },
      });
      
      // 如果今天已经有记录，直接返回当前阅读量
      if (existingRecord && existingRecord.length > 0) {
        const article = await strapi.entityService.findOne('api::article.article', id, {
          fields: ['id', 'view_count']
        });
        if (!article) {
          return ctx.notFound ? ctx.notFound('文章不存在') : ctx.badRequest('文章不存在');
        }
        return {
          success: true,
          message: '今天已经记录过阅读量',
          documentId,
          view_count: article.view_count || 0,
          already_read: true
        };
      }
      
      // 创建新的阅读记录
      await strapi.entityService.create('api::reading-record.reading-record' as any, {
        data: {
          ip_address: clientIP,
          article: id,
          read_date: today
        }
      });
      
      // 将该 documentId 下的所有记录（已发布 + 草稿）view_count 都加一
      for (const rid of allIds) {
        const current = await strapi.entityService.findOne('api::article.article', rid, {
          fields: ['id', 'view_count']
        });
        if (current) {
          const next = (current.view_count || 0) + 1;
          await strapi.entityService.update('api::article.article', rid, { data: { view_count: next } });
        }
      }
      const updatedArticle = await strapi.entityService.findOne('api::article.article', id, {
        fields: ['id', 'view_count']
      });
      if (!updatedArticle) {
        return ctx.badRequest('更新后查询文章失败');
      }
      
      return {
        success: true,
        message: '阅读量增加成功',
        documentId,
        view_count: updatedArticle.view_count,
        already_read: false
      };
      
    } catch (error) {
      console.error('增加阅读量时出错:', error);
      return ctx.badRequest('增加阅读量失败', { error: error.message });
    }
  }
}));
