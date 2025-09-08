阿里云 ECS 生产环境部署权威指南
🎯 最终架构
云服务器: 阿里云 ECS (Ubuntu 22.04 LTS 推荐)
应用代码: 通过 Git 从代码仓库拉取
进程管理: PM2 (确保 Strapi 服务 7x24 小时运行)
Web 服务器: Nginx (作为反向代理，处理外部流量和 SSL)
数据库: 远程连接到您已部署好的 Supabase 实例
前提条件 (Checklist)
在开始之前，请确保您的运维人员已准备好以下信息：
✅ 阿里云 ECS 实例: 已创建并正在运行。推荐至少 2核 CPU / 2GB RAM 配置。
✅ ECS 公网 IP 地址: [IP_OF_ALIYUN_ECS]
✅ 域名: 一个专用于 Strapi 后台的域名（例如 api.yourdomain.com），并已通过 DNS 解析到上述 ECS 公网 IP。
✅ SSH 访问权限: 能够以 root 或 sudo 用户身份通过 SSH 登录到 ECS 实例。
✅ Git 仓库地址: 您的 Strapi 项目的 Git URL。
✅ Supabase 数据库连接信息: Host, Port, Database Name, Username, Password。
阶段一：服务器基础环境配置
您的运维人员可以快速完成这一步。
SSH 登录服务器
code
Bash
ssh root@[IP_OF_ALIYUN_ECS]
安装核心依赖 (Node.js, PM2, Nginx)
code
Bash
# 更新软件包列表
sudo apt-get update

# 安装 Node.js v18 (Strapi 推荐)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2 全局
sudo npm install pm2 -g

# 安装 Nginx
sudo apt-get install -y nginx
验证安装: node -v, npm -v, pm2 -v
阶段二：配置阿里云安全组 (防火墙)
这是云服务器部署的关键一步。我们需要允许外部流量访问特定端口。
登录阿里云控制台。
进入 ECS 管理控制台 -> 实例 -> 找到您的实例。
点击实例 ID，进入详情页，选择 安全组 标签页。
点击 配置规则 -> 入方向 -> 手动添加。
添加以下三条规则：
规则 1 (SSH): 授权策略 允许, 协议类型 TCP, 端口范围 22, 授权对象 0.0.0.0/0 (或者为了安全，只填入您运维人员的 IP)。
规则 2 (HTTP): 授权策略 允许, 协议类型 TCP, 端口范围 80, 授权对象 0.0.0.0/0。
规则 3 (HTTPS): 授权策略 允许, 协议类型 TCP, 端口范围 443, 授权对象 0.0.0.0/0。
❗重要: 不要将 Strapi 的 1337 端口暴露在公网上。所有流量都应该通过 Nginx 的 80 和 443 端口进入。
阶段三：部署应用代码
从 Git 拉取项目
code
Bash
# 推荐在 /var/www 目录下创建项目文件夹
sudo mkdir -p /var/www/
cd /var/www/

# 克隆您的项目
sudo git clone [YOUR_GIT_REPOSITORY_URL] strapi-production
cd strapi-production

# 更改文件所有权，以便非 root 用户可以操作
# (假设您有一个名为 `ubuntu` 的用户)
sudo chown -R $USER:$USER .
安装项目依赖
code
Bash
npm install
阶段四：配置生产环境变量
创建生产环境 .env 文件
在项目根目录 (/var/www/strapi-production) 下，创建 .env 文件：
code
Bash
nano .env
填入生产配置
将以下模板粘贴进去，并替换所有占位符。安全密钥必须重新生成。
code
Env
# /var/www/strapi-production/.env

HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# --- 关键: 必须为生产环境重新生成新的安全密钥 ---
APP_KEYS="[新生成的APP_KEY_1],[新生成的APP_KEY_2]"
API_TOKEN_SALT="[新生成的SALT]"
ADMIN_JWT_SECRET="[新生成的ADMIN_JWT_SECRET]"
JWT_SECRET="[新生成的JWT_SECRET]"

# --- 数据库连接 (连接到您的线上Supabase) ---
DATABASE_CLIENT=postgres
DATABASE_HOST=[IP_OF_YOUR_SUPABASE_SERVER]
DATABASE_PORT=5432
DATABASE_NAME=[YOUR_DB_NAME]
DATABASE_USERNAME=[YOUR_DB_USERNAME]
DATABASE_PASSWORD=[YOUR_DB_PASSWORD]
DATABASE_SSL=true # 确认您的 Supabase 是否需要 SSL
如何生成新密钥？ 在服务器上运行 openssl rand -base64 32 四次，分别填入。
阶段五：构建并使用 PM2 启动应用
构建 Strapi 管理后台
code
Bash
NODE_ENV=production npm run build
使用 PM2 启动
code
Bash
pm2 start npm --name "strapi-prod" -- run start
--name "strapi-prod": 为进程命名，方便管理。
设置开机自启
code
Bash
pm2 startup
# 根据提示执行系统命令
pm2 save
```    **验证状态**: `pm2 list`，应显示 `strapi-prod` 状态为 `online`。
阶段六：配置 Nginx 反向代理
创建 Nginx 配置文件
code
Bash
sudo nano /etc/nginx/sites-available/api.yourdomain.com
粘贴 Nginx 配置
替换 api.yourdomain.com 为您的真实域名。
code
Nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_pass_request_headers on;
    }
}
启用该配置
code
Bash
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置是否正确
sudo systemctl restart nginx
阶段七：配置 HTTPS (使用 Let's Encrypt)
安装 Certbot
code
Bash
sudo apt-get install -y certbot python3-certbot-nginx
自动获取并配置证书
code
Bash
sudo certbot --nginx -d api.yourdomain.com
根据提示输入邮箱、同意条款，Certbot 将自动完成所有配置。
🎉 部署完成
现在，您的 Strapi 应用已经成功、安全地部署在阿里云 ECS 上。
管理后台访问地址: https://api.yourdomain.com/admin
API 访问地址: https://api.yourdomain.com/api/...
后续更新流程
当有代码更新时，您的运维人员只需执行以下简单流程：
ssh 登录服务器
cd /var/www/strapi-production
git pull
npm install (如果依赖有更新)
NODE_ENV=production npm run build
pm2 restart strapi-prod