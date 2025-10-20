/**
 * article router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
});
