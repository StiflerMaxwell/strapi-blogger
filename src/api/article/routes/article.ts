/**
 * article router
 */

import { factories } from '@strapi/strapi';

// 默认路由
const defaultRouter = factories.createCoreRouter('api::article.article');

// 自定义路由
const customRoutes = [
  {
    method: 'POST',
    path: '/articles/:id/increment-view',
    handler: 'article.incrementView',
    config: {
      auth: false, // 公开接口，不需要认证
    },
  },
];

// 合并并导出路由
export default {
  routes: [
    ...(typeof defaultRouter.routes === 'function' ? defaultRouter.routes() : defaultRouter.routes),
    ...customRoutes,
  ],
};
