# 韩语版百词斩（入门）

一个面向《韩国语（1）》入门词表的网页背词应用。它把固定词库、随机闪卡、课程练习、错词单词本、登录同步和可视化字幕瀑布整合在一起，适合个人复习，也方便继续扩展成更完整的语言学习工具。

线上访问：[korean-vocab-trainer.vercel.app](https://korean-vocab-trainer.vercel.app)

## 功能概览

- **随机闪卡**：从全部 520 个词条中随机抽卡。
- **课程单词**：按 `2과` 到 `9과` 筛选词条，每轮随机打乱且已答词不重复出现。
- **单词本复习**：答题中可把薄弱词加入单词本，支持全局复习或按课程复习。
- **双向考察**：支持“看中文写韩文”和“看韩文写中文”。
- **即时判题**：提交后展示正误、标准答案、发音/备注等补充信息。
- **学习进度**：闪卡区域展示本轮进度，跳过或答题都会推进队列。
- **云端同步**：通过 Sign in with Vercel 登录，个人单词本和答题统计存入 Postgres。
- **视觉体验**：全屏韩语字幕瀑布背景，玻璃质感主界面，答对后触发背景涟漪。

## 技术栈

- **Framework**：Next.js App Router
- **UI**：React + TypeScript + 原生 CSS
- **Icon**：lucide-react
- **Auth**：Sign in with Vercel（OAuth / OIDC）
- **Database**：Postgres（推荐 Neon via Vercel Marketplace）
- **Data**：Excel 一次性导入为版本化静态 JSON
- **Test**：Vitest
- **Deploy**：Vercel

## 项目结构

```text
.
├── db/
│   └── schema.sql                 # Postgres 表结构
├── scripts/
│   └── import-vocabulary.mjs       # Excel -> vocabulary.json 导入脚本
├── src/
│   ├── app/                        # Next.js App Router 页面和 API 路由
│   ├── components/                 # 学习界面与字幕瀑布组件
│   ├── data/
│   │   ├── vocabulary.json         # 固定词库，随代码发布
│   │   └── vocabulary.test.ts      # 词库完整性测试
│   └── lib/                        # 判题、会话、数据库、类型定义
├── .env.example
├── package.json
└── README.md
```

## 本地运行

```bash
npm install
npm run dev
```

Windows PowerShell 如果禁止执行 `npm.ps1`，可以使用：

```powershell
npm.cmd install
npm.cmd run dev
```

默认访问：`http://localhost:3000`

## 环境变量

复制 `.env.example` 为 `.env.local`，再填入实际值：

```bash
NEXT_PUBLIC_VERCEL_APP_CLIENT_ID=
VERCEL_APP_CLIENT_SECRET=
SESSION_SECRET=
POSTGRES_URL=
DATABASE_URL=
```

说明：

- `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID` / `VERCEL_APP_CLIENT_SECRET`：来自 Vercel Integration Console。
- `SESSION_SECRET`：用于签名本地 session cookie，生产环境必须配置足够长的随机字符串。
- `POSTGRES_URL` 或 `DATABASE_URL`：Postgres 连接串。项目会优先读取 `POSTGRES_URL`，也兼容 `DATABASE_URL`。
- OAuth 回调地址需要配置为：`https://你的域名/api/auth/callback`。本地开发可额外加入：`http://localhost:3000/api/auth/callback`。

## 数据库

在 Neon SQL Editor、Vercel Postgres 控制台或任意 Postgres 客户端中执行：

```sql
\i db/schema.sql
```

如果客户端不支持 `\i`，直接复制 [db/schema.sql](./db/schema.sql) 的内容执行即可。

数据库只保存个人学习状态；词库本身不入库，而是作为 `src/data/vocabulary.json` 随代码版本化发布。

## 更新词库

当前仓库已经包含导入后的 `src/data/vocabulary.json`。如果需要从新的 Excel 重新导入：

```bash
npm run import:vocab -- "D:\path\to\vocabulary.xlsx"
```

也可以使用环境变量：

```bash
VOCAB_SOURCE_PATH="D:\path\to\vocabulary.xlsx" npm run import:vocab
```

导入脚本默认读取 Excel 的 `Sheet1`，字段为：`词汇 / 发音 / 词性 / 词义 / 课 / 备注`。重复韩文词会按课程和释义保留为独立词条。

## 验证

```bash
npm run test
npm run build
```

测试覆盖：

- 词库总量、必填字段、课程范围。
- 韩文答案空格归一化。
- 中文答案按释义片段匹配。

## 部署到 Vercel

1. 将仓库导入 Vercel。
2. 在 Vercel Marketplace 创建或连接 Neon Postgres。
3. 配置 `.env.example` 中列出的环境变量。
4. 在 Vercel OAuth 应用中加入 Production 和 Preview 的 callback URL。
5. 部署后执行 `db/schema.sql` 初始化数据库。

## 设计取向

这个项目的目标不是做一个营销页，而是把学习流程放在第一屏：

- 菜单可以折叠，让用户专注于一张闪卡。
- 主体界面采用半透明玻璃面板，背景字幕瀑布保持存在感但不抢答题区。
- 单词本不作为独立大页外显，而是在学习 tab 中选择复习范围后进入闪卡流。
- 先记录正确/错误次数和最近练习时间，不引入复杂间隔复习算法。

## License

MIT
