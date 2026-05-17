# 部署指南

## 1. 准备 GitHub 仓库

将项目推送到 GitHub 后，在 Vercel 中选择该仓库导入。

## 2. 准备 Postgres

推荐使用 Vercel Marketplace 中的 Neon Postgres。创建数据库后，Vercel 会自动注入连接环境变量；如果变量名不是 `POSTGRES_URL`，也可以使用 `DATABASE_URL`。

初始化表结构：

```sql
\i db/schema.sql
```

## 3. 配置 Sign in with Vercel

在 Vercel Integration Console 中创建 OAuth 应用，并配置 callback URL：

```text
https://你的生产域名/api/auth/callback
https://你的预览域名/api/auth/callback
http://localhost:3000/api/auth/callback
```

生产部署至少需要：

```text
NEXT_PUBLIC_VERCEL_APP_CLIENT_ID
VERCEL_APP_CLIENT_SECRET
SESSION_SECRET
POSTGRES_URL 或 DATABASE_URL
```

## 4. Vercel 构建设置

默认设置即可：

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

## 5. 部署后检查

```bash
npm run test
npm run build
```

线上检查：

- 首页返回 `200`。
- OAuth 登录可跳转并回调成功。
- 加入/移出单词本后刷新页面仍保留。
- 课程模式进度条不会重复出现已答卡片。
- 手机端闪卡、菜单折叠、字幕瀑布都不溢出。
