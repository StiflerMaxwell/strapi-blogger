/**
 * article service
 */

import { factories } from '@strapi/strapi';

// 用于防止短时间内重复计数的缓存
const viewCountCache = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟

export default factories.createCoreService('api::article.article', ({ strapi }) => ({
  /**
   * 增加文章浏览量
   * @param articleId - 文章ID
   * @param clientIdentifier - 客户端标识（通常是IP地址）
   * @returns 更新后的文章数据
   */
  async incrementViewCount(articleId: number, clientIdentifier: string) {
    // 生成缓存key
    const cacheKey = `${articleId}-${clientIdentifier}`;
    const now = Date.now();
    
    // 检查缓存，防止短时间内重复计数
    const lastViewTime = viewCountCache.get(cacheKey);
    if (lastViewTime && now - lastViewTime < CACHE_DURATION) {
      // 在缓存时间内，不增加计数，但返回当前文章数据
      const article = await strapi.entityService.findOne('api::article.article', articleId, {
        populate: '*',
      });
      return article;
    }

    // 获取当前文章
    const article = await strapi.entityService.findOne('api::article.article', articleId, {
      fields: ['view_count'],
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // 增加浏览量
    const currentCount = article.view_count || 0;
    const updatedArticle = await strapi.entityService.update('api::article.article', articleId, {
      data: {
        view_count: currentCount + 1,
      },
      populate: '*',
    });

    // 更新缓存
    viewCountCache.set(cacheKey, now);

    // 清理过期的缓存条目（简单的内存管理）
    if (viewCountCache.size > 10000) {
      const keysToDelete: string[] = [];
      viewCountCache.forEach((time, key) => {
        if (now - time > CACHE_DURATION) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => viewCountCache.delete(key));
    }

    return updatedArticle;
  },
}));
