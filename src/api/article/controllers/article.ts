/**
 * article controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  /**
   * 增加文章浏览量的自定义接口
   */
  async incrementView(ctx) {
    try {
      const { id } = ctx.params;

      // 验证ID
      if (!id || isNaN(Number(id))) {
        return ctx.badRequest('Invalid article ID');
      }

      // 获取客户端IP地址
      const clientIp = ctx.request.ip || 
                       ctx.request.headers['x-forwarded-for'] || 
                       ctx.request.headers['x-real-ip'] || 
                       'unknown';

      // 调用service增加浏览量
      const updatedArticle = await strapi
        .service('api::article.article')
        .incrementViewCount(Number(id), clientIp);

      if (!updatedArticle) {
        return ctx.notFound('Article not found');
      }

      // 返回更新后的view_count
      return ctx.send({
        data: {
          id: updatedArticle.id,
          view_count: updatedArticle.view_count,
        },
      });
    } catch (error) {
      strapi.log.error('Error incrementing view count:', error);
      return ctx.internalServerError('Failed to increment view count');
    }
  },
}));
