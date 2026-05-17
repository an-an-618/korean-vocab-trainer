# 贡献说明

这个项目目前是个人学习工具，代码以可读、可部署、容易扩展为优先级。

## 开发流程

```bash
npm install
npm run dev
```

提交前至少运行：

```bash
npm run test
npm run build
```

## 代码约定

- 保持 TypeScript 类型清晰，不在组件中混入数据库细节。
- 判题规则集中放在 `src/lib/grading.ts`。
- 词库相关结构集中放在 `src/lib/types.ts` 和 `src/lib/vocabulary.ts`。
- UI 变更优先复用现有 CSS token 和组件结构。
- 不提交 `.env.local`、`.vercel/`、`.next/`、`node_modules/`。

## 数据更新

如果词表更新，通过导入脚本重新生成 `src/data/vocabulary.json`：

```bash
npm run import:vocab -- "D:\path\to\vocabulary.xlsx"
```

导入后需要重新运行测试，确认词条数量和课程范围仍符合预期。
