/**
 * increment view route
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/articles/:documentId/increment-view',
      handler: 'article.incrementViewCount',
      config: {
        auth: false,
      },
    },
  ],
};