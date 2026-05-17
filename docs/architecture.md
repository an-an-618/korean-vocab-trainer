# 架构说明

## 核心边界

项目把“固定词库”和“个人学习状态”明确分离：

- `src/data/vocabulary.json`：静态词库，随代码发布，不写入数据库。
- Postgres：只保存用户、单词本、答题统计。

这样做的好处是部署简单、版本可追踪，也避免每次启动都依赖数据库读取词库。

## 主要模块

```text
src/app/
├── page.tsx                     # 首页，直接进入学习工具
├── api/auth/*                   # Vercel OAuth 登录流程
├── api/progress/route.ts        # 拉取单词本和统计
├── api/stats/route.ts           # 写入答题正确/错误次数
└── api/wordbook/route.ts        # 加入/移出单词本

src/components/
├── study-app.tsx                # 学习主流程和 UI 状态
└── word-waterfall.tsx           # Canvas 韩语字幕瀑布

src/lib/
├── db.ts                        # Postgres 查询封装
├── grading.ts                   # 判题规则
├── session.ts                   # Cookie session 签名与校验
├── types.ts                     # 共享类型
└── vocabulary.ts                # 词库导出和课程列表
```

## 学习流程

1. 根据模式生成 `activePool`：
   - 全局随机：全部词库。
   - 课程：筛选当前课程。
   - 单词本：筛选用户已收藏词，可再按课程过滤。
2. 切换模式或课程后，将词池随机打乱成队列。
3. 当前卡片来自 `queue[0]`。
4. 提交后只显示反馈，不立即移出队列。
5. 点击“下一张”或“跳过”才推进队列，确保进度可控。

## 判题规则

- 韩文：去首尾空格，合并连续空格后与标准 `word` 全等。
- 中文：去空格和常见标点，允许匹配任一释义片段。
- 答错不会自动加入单词本，用户可以手动加入。

## 云端同步

登录流程使用 Sign in with Vercel：

1. `/api/auth/authorize` 生成 OAuth state / nonce / PKCE verifier。
2. Vercel 回调 `/api/auth/callback` 后换 token。
3. 读取 Vercel userinfo。
4. `users` 表中按 `vercel_user_id` upsert。
5. 签发本应用自己的 HttpOnly session cookie。

应用 API 通过 session cookie 识别用户，并以 `user_id` 隔离个人数据。

## 字幕瀑布

`WordWaterfall` 使用 Canvas 2D 渲染词表中的韩文：

- 桌面端更高密度，手机端降低 DPR 和节点数量。
- 鼠标移动会对附近词产生扰动。
- 长悬停展示词义 tooltip。
- 答对时通过 `rippleSignal` 触发背景涟漪。
- `prefers-reduced-motion` 下减少持续运动。

## 后续可扩展方向

- 增加间隔复习算法。
- 为每个词维护熟练度状态。
- 支持上传新 Excel 并生成个人词库。
- 增加听写模式和音频资源。
- 增加导出学习记录功能。
