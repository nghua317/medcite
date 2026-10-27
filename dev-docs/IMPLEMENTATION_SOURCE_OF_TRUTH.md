# MedCite《实施真源文档》

更新时间：2026-10-27
验收范围：多类型来源查询与医学期刊 NLM 引用生成链路
Git 基准：本文件归档提交完成后，以 `git log -1` 显示的提交为准

> 本文记录当前实现的实际行为，是本次验收和运行依据。未来计划不视为已实现功能。

## 1. 验收结论总览

| 验收项 | 结论 | 证据或限制 |
| --- | --- | --- |
| 1. 验规则 | 通过（文档化） | 第 2 节列出来源、文件和验证方式 |
| 2. 目录责任 | 通过 | `app`、`features/citation`、`components` 边界清楚 |
| 3. 最小模块演练 | 通过（线上基本流程） | DOI 查询、生成、编辑和复制链路 |
| 4. 接口返回样例 | 通过（契约样例） | 第 5 节列出 11 个场景 |
| 5. 框架复用 | 通过 | 使用 Next.js Route Handler、`fetch`、`Response.json`、`AbortSignal.timeout(10000)` |
| 6. 固定运行证据包 | 通过（命令已确定） | 第 7 节；首版没有数据库连接 |
| 7. 实施真源文档 | 已建立 | 当前文件 |
| 8. Git 归档基准版本 | 待本次提交完成 | 最终回复给出提交短哈希 |

## 2. 验收规则、来源、文件与验证方式

| 规则 | 规则来源 | 实现文件 | 验证方式 | 当前结果 |
| --- | --- | --- | --- | --- |
| 只接受 DOI 或 DOI 链接 | `PROJECT_BRIEF.md` 最新确认范围 | `features/citation/doi-workspace.tsx`、`app/api/citations/lookup/route.ts` | 表单只显示 DOI 输入；API 拒绝标题搜索请求 | 本地回归测试 |
| DOI 优先查询 PubMed，必要时以 Crossref 补充 | `PROJECT_BRIEF.md` 后端方案 | `features/citation/server/lookup.ts`、`providers.ts` | provider 测试和 DOI 查询验收 | 通过 |
| 首页 HTML 不缓存过期客户端脚本引用 | 线上 Chrome Console 404 证据 | `next.config.ts` | 验证首页 `Cache-Control: no-store`、脚本返回 200，并实测输入类型和 DOI 查询 | 线上首页返回 `no-store, must-revalidate`，当前引用的 9 个脚本全部 HTTP 200；Codex 内置浏览器已切换全部 5 种输入类型并成功查询真实 DOI、生成 NLM 引用；用户 Chrome 的旧页面需强制刷新后复测 |
| 接受纯 DOI 或 DOI 链接 | `PROJECT_BRIEF.md` 首版范围 | `features/citation/server/doi.ts` | 检查 `normalizeDoi`；用合法/非法请求验证 | 线上 DOI 与 DOI 链接均通过 |
| 无效 DOI 返回可操作提示 | `AGENTS.md` 正确性与交互 | `doi.ts`、`app/api/citations/lookup/route.ts` | 检查错误类型到 HTTP 400 的映射 | 通过 |
| PubMed 首选，Crossref 备用 | `PROJECT_BRIEF.md` 后端方案 | `features/citation/server/lookup.ts`、`providers.ts` | 检查调用顺序和回退条件 | 通过 |
| 备用 DOI 必须匹配输入 | `PROJECT_BRIEF.md` 后端方案 | `providers.ts` | 检查 Crossref DOI 精确比较 | 通过 |
| 只为英文医学期刊文章生成引用 | `AGENTS.md`、`PROJECT_BRIEF.md` | `providers.ts`、`lookup.ts` | 检查语言、类型判断和 422 分支 | 线上英文医学期刊样例通过；网页和图书格式未支持 |
| 关键字段为空只提醒 | `AGENTS.md`、`PROJECT_BRIEF.md` | `format-nlm.ts`、`lookup.ts`、结果组件 | 检查 `missingFields` 和页面文案 | 通过 |
| 关键字段缺失不生成伪造引用 | `PROJECT_BRIEF.md` | `format-nlm.ts` | 检查缺失时返回空引用 | 通过 |
| 以 NLM 规则生成期刊引用 | `PROJECT_BRIEF.md` NLM 决策 | `features/citation/format-nlm.ts` | 检查作者、标题、期刊、日期、卷期页码、DOI、PMID | 初步通过；需官方样例逐条复核 |
| 错误类型分开返回 | `AGENTS.md`、`PROJECT_BRIEF.md` | `lookup.ts`、`route.ts` | 检查错误码和 HTTP 状态映射 | 通过 |
| 首版不使用数据库和账号 | `PROJECT_BRIEF.md` 技术栈 | `package.json`、后端目录 | 检查无数据库依赖、连接配置和持久化调用 | 通过 |

## 3. 目录责任验收

| 目录/文件 | 类型 | 唯一职责 |
| --- | --- | --- |
| `app/` | Next.js 框架目录 | 页面路由、布局、Route Handler 入口 |
| `app/api/citations/lookup/route.ts` | 框架入口 + 薄适配 | 读请求、调用业务服务、转 HTTP 响应 |
| `features/citation/` | 业务目录 | 多类型来源查询、引用展示、格式化和服务端业务模块 |
| `features/citation/server/doi.ts` | 业务模块 | DOI 规范化和校验 |
| `features/citation/server/providers.ts` | 外部来源适配 | PubMed、Crossref 请求和数据转换 |
| `features/citation/server/lookup.ts` | 业务编排 | 来源优先级、回退、类型判断、结果组装 |
| `features/citation/server/types.ts` | 业务类型 | 元数据、成功响应、错误码和来源 |
| `features/citation/format-nlm.ts` | 业务规则 | NLM 格式化和关键字段缺失判断 |
| `components/` | 可复用界面目录 | 跨功能视觉组件，不承载查询规则 |
| `dev-docs/` | 项目资料目录 | 产品决定、技术方案、验收和运行证据 |

框架入口没有直接写 PubMed 或 Crossref 请求；业务逻辑集中在 `features/citation`。`route.ts` 保留请求体大小和 JSON 解析，因为它们属于 HTTP 边界责任。

## 4. 最小模块演练

`POST /api/citations/lookup` 的链路：

1. `app/api/citations/lookup/route.ts` 接收请求，限制 2,000 字符并解析 JSON。
2. `lookupCitation` 调用 `normalizeDoi` 规范化和校验 DOI。
3. `findInPubMed` 查询 PubMed；无记录或关键字段不足时才调用 `findInCrossref`。
4. 来源适配器输出统一的 `MetadataProviderResult`。
5. `lookupCitation` 判断资料类型、按规则补齐字段并记录来源。
6. `getMissingCitationFields` 生成提醒，`formatNlmCitation` 生成引用。
7. Route Handler 使用 `Response.json` 返回成功或错误 JSON。

这验证了 HTTP 边界 → 业务编排 → 来源适配 → 格式规则 → HTTP 响应的分层。

## 5. 接口返回样例（11 个场景）

接口：`POST /api/citations/lookup`；请求体：`{"doi":"..."}`。成功样例中的论文值是契约示例，不是联网证据。

### 成功和提醒

**场景 1：纯 DOI 成功（HTTP 200）**

```json
{"ok":true,"doi":"10.1000/example.1","metadata":{"doi":"10.1000/example.1","title":"Example medical article","authors":["Smith J","Lee A"],"journal":"Example Medical Journal","journalAbbreviation":"Example Med J","year":"2024","publicationDate":"2024 Jan","electronicPublicationDate":"","pubmedId":"12345678","volume":"12","issue":"3","pages":"101-108","language":"eng","publicationTypes":["Journal Article"],"source":"pubmed"},"missingFields":[],"citation":"Smith J, Lee A. Example medical article. Example Med J. 2024;12(3):101-108. doi: 10.1000/example.1. PMID: 12345678.","formattingStatus":"ready"}
```

**场景 2：DOI 链接成功（HTTP 200）**

请求 `{"doi":"https://doi.org/10.1000/example.1"}`；响应结构同场景 1，`doi` 规范化为 `10.1000/example.1`。

**场景 3：PubMed 不完整、Crossref 补齐（HTTP 200）**

响应结构同场景 1，`metadata.source` 为 `"pubmed+crossref"`，`missingFields` 只列出合并后仍为空的关键字段。

**场景 4：成功但缺作者（HTTP 200）**

```json
{"ok":true,"doi":"10.1000/incomplete.1","metadata":{"doi":"10.1000/incomplete.1","title":"Article with incomplete metadata","authors":[],"journal":"Example Medical Journal","journalAbbreviation":"Example Med J","year":"2024","publicationDate":"2024","electronicPublicationDate":"","pubmedId":"12345679","volume":"","issue":"","pages":"","language":"eng","publicationTypes":["Journal Article"],"source":"pubmed"},"missingFields":["authors"],"citation":"","formattingStatus":"ready"}
```

### 请求和查询错误

**场景 5：请求体不是 JSON（HTTP 400）**

```json
{"ok":false,"error":{"code":"INVALID_REQUEST","message":"Send a JSON body containing a DOI."}}
```

**场景 6：缺少 `doi` 或字段类型错误（HTTP 400）**

```json
{"ok":false,"error":{"code":"INVALID_DOI","message":"Enter a valid DOI or DOI link."}}
```

**场景 7：DOI 格式无效（HTTP 400）**

```json
{"ok":false,"error":{"code":"INVALID_DOI","message":"Enter a valid DOI or DOI link."}}
```

**场景 8：请求体超过 2,000 字符（HTTP 413）**

```json
{"ok":false,"error":{"code":"INVALID_REQUEST","message":"Request is too large."}}
```

**场景 9：没有匹配记录（HTTP 404）**

```json
{"ok":false,"error":{"code":"NOT_FOUND","message":"We couldn’t find article details for this DOI. Check the DOI and try again."}}
```

**场景 10：不是英文医学期刊文章（HTTP 422）**

```json
{"ok":false,"error":{"code":"UNSUPPORTED_TYPE","message":"This DOI doesn’t appear to be a journal article. This version supports journal articles only."}}
```

**场景 11：上游数据库无法访问（HTTP 502）**

```json
{"ok":false,"error":{"code":"UPSTREAM_FAILURE","message":"We couldn’t reach the article databases. Please try again in a moment."}}
```

当前产品只接受 DOI 和 DOI 链接。标题、关键词、普通 URL 和 ISBN 不属于当前查询流程；API 在缺少有效 DOI 时返回 `INVALID_DOI`。错误边界场景仍按上表测试计划逐项补充。

## 6. 框架复用验收

- 使用 Next.js App Router 的 Route Handler，没有另起 Express/Fastify 服务。
- 使用运行时原生 `fetch`，没有为简单 HTTP 请求添加额外 SDK。
- 使用 `Response.json` 返回 JSON，使用 `AbortSignal.timeout(10000)` 控制上游超时。
- 使用 TypeScript 类型定义统一元数据和错误码。
- `CitationLookupError` 是必要的业务错误类型，用于把业务错误映射到 HTTP 状态。
- 首版没有数据库、账号、缓存或队列，不为它们提前添加目录和客户端。

## 7. 固定运行证据包

### 安装和开发启动

```powershell
cd "C:\Users\ASUS\Documents\ChatGPT\scribbr citation generator2"
npm install
npm run dev
```

默认页面：`http://localhost:3000`；接口：`POST http://localhost:3000/api/citations/lookup`。

### 生产构建和启动

```powershell
npm run build
npm run start
```

### 已执行检查

- `npm run typecheck`：通过。
- `npm run build`：通过；输出包含 `/api/citations/lookup` 动态路由。
- `git diff --check`：通过。
- 没有 `lint` 或自动化测试脚本，不声称 lint 或端到端测试通过。

### 数据库和外部连接

- 数据库：**N/A（首版明确不使用数据库）**。
- 账号/认证：**N/A（首版明确不使用账号）**。
- 外部数据源：PubMed E-utilities，必要时 Crossref REST API。
- 当前环境无法稳定访问外部服务，真实 DOI 成功、无记录和上游失败场景需联网环境复测。
- 不需要配置 API 密钥；不得把个人凭证写入源码、日志或 Git。

## 8. Git 归档基准

文档同步后只提交本次验收相关资料：

```powershell
git status --short
git diff --check
git diff -- dev-docs
git add dev-docs/PROJECT_BRIEF.md dev-docs/README.md dev-docs/IMPLEMENTATION_SOURCE_OF_TRUTH.md
git commit -m "docs: archive backend acceptance baseline"
git status --short --branch
```

归档时不提交 `.env`、密钥、构建产物或用户本地配置。提交完成后以该提交作为本轮后端验收的 Git 基准版本，短哈希在验收回复中记录。

## 9. 当前遗留项

1. 在可联网环境用固定真实 PubMed DOI 实测 200、404、422、502 和 Crossref 回退。
2. 用 NLM 官方样例逐条复核作者、日期、页码、电子出版日期和 PMID。
3. 记录一次真实查询耗时，再判断约 5 秒暂定目标。
4. 以后若增加数据库、账号或保存项目，先更新立项文档和本文档，再设计数据模型和权限。
