# Cloudflare 部署适配实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 让当前带有 Next.js Route Handler 的 MedCite 应用具备 Cloudflare Workers 部署所需的配置，并在发布前完成本地构建验证。

**Architecture:** 保留现有 Next.js App Router、前端和 `/api/citations/lookup` 接口。使用 Cloudflare 官方当前推荐的 vinext 适配路径，将 Next.js 应用转换为 Workers 可运行的产物；不改产品功能，不加入数据库或账号。

**Tech Stack:** Next.js 16、TypeScript、React、Mantine、vinext、Cloudflare Wrangler。

**Spec:** `dev-docs/PROJECT_BRIEF.md` 的已选技术栈与后端边界；Cloudflare Next.js 部署指南。

## Global Constraints

- 首版只处理英文医学期刊 DOI，并保留现有 PubMed 优先、Crossref 备用逻辑。
- 不把密钥、密码、令牌写进代码或提交到 Git。
- 保留工作区已有的引用逻辑修改，不重置无关改动。
- 发布到 Cloudflare 前必须先完成本地构建验证，并在最终发布按钮前停下确认。

## Review Focus

- Cloudflare 构建产物必须包含页面和服务端 Route Handler。
- `POST /api/citations/lookup` 的运行时不能被静态导出误删。
- 现有 `npm run dev`、`npm run build` 和 `npm run typecheck` 不应被破坏。
- Cloudflare 配置不能依赖本地未提交的密钥或个人配置。

---

### Task 1: 检查适配工具与现有构建边界

**Files:**
- Read: `package.json`, `next.config.ts`, `app/api/citations/lookup/route.ts`

- [ ] 确认当前 Next.js 版本、路由运行时和现有构建命令。
- [ ] 确认 vinext 当前可用的初始化方式，避免手写不兼容的 Wrangler 配置。

### Task 2: 添加 Cloudflare Workers 适配

**Files:**
- Modify: `package.json`
- Create/Modify: Cloudflare 适配生成的配置文件

- [ ] 使用 vinext 的现有项目初始化方式添加最小部署配置和脚本。
- [ ] 保留原有 `next dev`、`next build` 和类型检查脚本。
- [ ] 不增加数据库、认证或额外业务封装。

### Task 3: 本地验证

**Files:**
- No additional production files unless the adapter requires them.

- [ ] 运行 `npm run typecheck`。
- [ ] 运行 `npm run build`。
- [ ] 运行 Cloudflare 适配构建命令，确认生成 Workers 产物。
- [ ] 检查 Git 差异，确认只包含本次部署适配和已有工作区修改。

### Task 4: Cloudflare 部署准备

**Files:**
- Update: `dev-docs/PROJECT_BRIEF.md` only if the deployment choice becomes confirmed.

- [ ] 在 Cloudflare 控制台确认目标项目和部署方式。
- [ ] 发布前检查生产环境变量需求，当前首版不需要数据库密钥。
- [ ] 在最终 Deploy/发布动作前向用户展示准备结果并请求确认。
