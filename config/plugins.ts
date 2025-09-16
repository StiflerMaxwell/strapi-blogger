export default ({ env }) => ({
  // 禁用用户注册功能 - 这是一个博客系统，只需要管理员后台
  'users-permissions': {
    config: {
      register: {
        allowedFields: [], // 空数组表示禁用公开注册
      },
    },
  },
});
