import type { StrapiApp } from '@strapi/strapi/admin';

// 翻译直接在配置中定义，无需导入外部文件

export default {
  config: {
    // 博客管理后台语言配置
    locales: [
      'zh-Hans', // 简体中文
      'en', // 英文（默认）
    ],
    // 翻译配置 - 直接在这里定义覆盖Strapi默认文案
    translations: {
      'zh-Hans': {
        // 登录页面翻译
        'Auth.form.welcome.title': '欢迎使用博客管理系统！',
        'Auth.form.welcome.subtitle': '请登录您的账户',
        'Auth.form.button.login': '登录',
        'Auth.form.email.label': '邮箱地址',
        'Auth.form.password.label': '密码',
        'Auth.form.rememberMe.label': '记住我',
        'Auth.form.forgot-password.label': '忘记密码？',
        
        // 应用名称和品牌
        'app.name': '博客管理系统',
        'Settings.application.strapiVersion': '博客系统版本',
        'Settings.application.name': '博客管理系统',
        
        // 主页欢迎信息
        'app.components.HomePage.welcome': '欢迎来到博客管理后台',
        'app.components.HomePage.welcome.again': '欢迎回到博客管理后台',
        
        // 导航菜单
        'content-manager.plugin.name': '内容管理',
        'upload.plugin.name': '媒体库',
        'users-permissions.plugin.name': '用户管理',
        
        // 通用术语
        'app.components.ConfirmDialog.title': '确认',
        'app.components.Button.save': '保存',
        'app.components.Button.cancel': '取消',
        'app.components.Button.delete': '删除',
        'app.components.Button.edit': '编辑',
        'app.components.Button.create': '创建',
        
        // 覆盖默认的Strapi品牌
        'strapi': '博客管理系统',
        'global.strapi.description': '专业的博客内容管理系统',
      },
      en: {
        // 英文登录页面翻译
        'Auth.form.welcome.title': 'Welcome to Blog Management System!',
        'Auth.form.welcome.subtitle': 'Sign in to your account',
        'Auth.form.button.login': 'Sign in',
        'Auth.form.email.label': 'Email',
        'Auth.form.password.label': 'Password',
        'Auth.form.rememberMe.label': 'Remember me',
        'Auth.form.forgot-password.label': 'Forgot your password?',
        
        // 应用名称和品牌
        'app.name': 'Blog Management System',
        'Settings.application.strapiVersion': 'Blog System Version',
        'Settings.application.name': 'Blog Management System',
        
        // 主页欢迎信息
        'app.components.HomePage.welcome': 'Welcome to Blog Admin Panel',
        'app.components.HomePage.welcome.again': 'Welcome back to Blog Admin Panel',
        
        // 导航菜单
        'content-manager.plugin.name': 'Content Manager',
        'upload.plugin.name': 'Media Library',
        'users-permissions.plugin.name': 'User Management',
        
        // 通用术语
        'app.components.ConfirmDialog.title': 'Confirm',
        'app.components.Button.save': 'Save',
        'app.components.Button.cancel': 'Cancel',
        'app.components.Button.delete': 'Delete',
        'app.components.Button.edit': 'Edit',
        'app.components.Button.create': 'Create',
        
        // 覆盖默认的Strapi品牌
        'strapi': 'Blog Management System',
        'global.strapi.description': 'Professional Blog Content Management System',
      },
    },
    // 自定义主题配置
    theme: {
      light: {
        colors: {
          // 博客主题的品牌色彩配置
          primary100: '#f0f9ff', // 浅蓝色背景
          primary200: '#e0f2fe',
          primary500: '#0ea5e9', // 主色调：天空蓝
          primary600: '#0284c7',
          primary700: '#0369a1',
          // 自定义博客相关的颜色
          secondary100: '#f3f4f6',
          secondary500: '#6b7280',
          secondary600: '#4b5563',
          // 成功、警告、错误状态色
          success500: '#10b981',
          warning500: '#f59e0b',
          danger500: '#ef4444',
          // 背景和文本
          neutral0: '#ffffff',
          neutral100: '#f9fafb',
          neutral150: '#f3f4f6',
          neutral200: '#e5e7eb',
          neutral300: '#d1d5db',
          neutral400: '#9ca3af',
          neutral500: '#6b7280',
          neutral600: '#4b5563',
          neutral700: '#374151',
          neutral800: '#1f2937',
          neutral900: '#111827',
        },
      },
      dark: {
        colors: {
          // 深色模式配置，适合夜间写作
          primary100: '#1e293b',
          primary200: '#334155',
          primary500: '#0ea5e9',
          primary600: '#0284c7',
          primary700: '#0369a1',
          secondary100: '#1f2937',
          secondary500: '#9ca3af',
          secondary600: '#d1d5db',
          success500: '#10b981',
          warning500: '#f59e0b',
          danger500: '#ef4444',
          neutral0: '#0f172a',
          neutral100: '#1e293b',
          neutral150: '#334155',
          neutral200: '#475569',
          neutral300: '#64748b',
          neutral400: '#94a3b8',
          neutral500: '#cbd5e1',
          neutral600: '#e2e8f0',
          neutral700: '#f1f5f9',
          neutral800: '#f8fafc',
          neutral900: '#ffffff',
        },
      },
    },
    // 博客管理后台头部配置
    head: {
      favicon: '/favicon.png',
      title: '博客管理后台',
    },
    // 菜单logo配置
    menu: {
      logo: '/favicon.png',
    },
    // 登录页面配置
    auth: {
      logo: '/favicon.png',
    },
    // 通知设置
    notifications: {
      releases: false, // 禁用版本更新通知
    },
    // 自定义应用名称和描述
    app: {
      name: '博客管理系统',
      description: '专业的博客内容管理后台',
    },
  },
  bootstrap(app: StrapiApp) {
    console.log('🚀 博客管理系统启动成功！');
    
    // 博客管理后台启动信息
    const systemInfo = {
      title: '博客管理系统',
      subtitle: '专业的内容创作与管理平台',
      version: '1.0.0',
      features: ['文章管理', '分类管理', '标签管理', '用户管理']
    };
    
    console.log('📝 系统信息:', systemInfo);
    
    // 添加自定义样式和脚本
    if (typeof document !== 'undefined') {
      // 设置页面标题
      document.title = '博客管理后台';
      
      // 添加自定义CSS类
      document.body.classList.add('blogger-admin');
    }
  },
};
