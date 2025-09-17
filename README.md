# Vertu VPS Blogger CMS

基于 Strapi 构建的现代化博客内容管理系统，为 Vertu VPS 旗下网站提供统一的内容管理解决方案。

## 📚 项目文档

欢迎来到项目文档中心。

- [**运营人员后台操作手册**](./operations-manual.md)
- [**开发人员 API 对接指南**](./developer-guide.md)

---

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- PostgreSQL 数据库
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run develop
# 或
yarn develop
```

开发服务器将在 `http://localhost:1337` 启动，管理面板地址为 `http://localhost:1337/admin`。

### 生产环境部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
```

## 🔧 系统配置

- **数据库**: PostgreSQL
- **认证**: JWT + 用户权限系统
- **API**: RESTful API + GraphQL
- **管理面板**: Strapi Admin Panel

## 📖 Strapi 官方文档

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>