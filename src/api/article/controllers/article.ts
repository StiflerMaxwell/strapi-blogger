/**
 * article controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // 自定义find方法，支持website过滤和分页
  async find(ctx) {
    try {
      const { query } = ctx;
      
      // 支持 lang 参数过滤
      if (query.lang) {
        if (!query.filters) {
          query.filters = {};
        }
        (query.filters as any).lang = query.lang;
        delete query.lang;
      }
      
      // 检查是否有website过滤条件
      if (query.filters && (query.filters as any).website) {
        const websiteFilter = (query.filters as any).website;
        
        // 如果过滤条件是identifier
        if (websiteFilter.identifier && websiteFilter.identifier.$eq) {
          // 先查找匹配的website
          const websites = await strapi.entityService.findMany('api::website.website', {
            filters: { identifier: websiteFilter.identifier.$eq },
            fields: ['id']
          });
          
          if (websites.length === 0) {
            return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
          }
          
          // 使用website的id进行过滤
          const websiteIds = websites.map(w => w.id);
          (query.filters as any).website = { id: { $in: websiteIds } };
        }
      }
      
      // 解析分页参数
      const pagination = query.pagination as any || {};
      const page = pagination.page || 1;
      const pageSize = pagination.pageSize || 25;
      
      // 先查询总数（用于计算总页数）
      const total = await strapi.entityService.count('api::article.article', {
        filters: query.filters || {},
      });
      
      // 计算分页数据
      const pageCount = Math.ceil(total / pageSize);
      
      // 计算 start 和 limit（Strapi 使用 start 和 limit 进行分页）
      const start = (page - 1) * pageSize;
      const limit = pageSize;
      
      // 优化 populate：排除 reading_records（oneToMany关系，数据量大且列表查询不需要）
      // 如果用户传入 populate=*，使用优化的 populate 对象而不是加载所有数据
      let populate = query.populate;
      if (!populate || populate === '*') {
        // 使用优化的默认 populate，排除 reading_records
        populate = {
          website: {
            fields: ['id', 'identifier', 'name', 'url', 'cnName'], // 只加载必要字段
          },
          cover_image: {
            // 不限制 fields，加载完整的 media 对象（包括 formats），前端需要访问 formats.large 等
          },
          // 不加载 reading_records，减少数据量和查询时间
        };
      }
      
      // 查询分页数据
      const data = await strapi.entityService.findMany('api::article.article', {
        filters: query.filters || {},
        populate,
        sort: query.sort || ['createdAt:desc'],
        start,
        limit,
      });
      
      // 构造返回格式
      const meta = {
        pagination: {
          page,
          pageSize,
          pageCount,
          total,
        }
      };
      
      return { data, meta };
    } catch (error) {
      console.error('Article find error:', error);
      return ctx.badRequest('查询文章失败', { error: error.message });
    }
  },

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
