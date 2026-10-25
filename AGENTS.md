# AGENTS.md — MedCite 项目 Agent 宪法

## 项目定位

MedCite 是一个面向学生的简单引用生成网站。当前先探索医学生使用英文医学期刊文章的场景。项目负责人是编程初学者；解释技术内容时用清楚、易懂的中文，第一次出现专业词时顺手解释。

这是产品讨论和网站开发并行推进的项目。开始每项工作前，先读本文件、`dev-docs/PROJECT_BRIEF.md` 和 `dev-docs/README.md`，再检查相关代码与项目现状。`PROJECT_BRIEF.md` 记录立项范围和已选技术；`README.md` 记录产品讨论与补充信息。`dev-docs/` 属于项目资料，纳入 Git 版本记录。若用户在对话中明确作出更新决定，以用户最新决定为准，并指出文档需要同步。

## 当前已确认的产品范围

- 首版只处理英文医学期刊文章。
- 用户输入纯 DOI 或 DOI 链接，获取论文书目信息并生成 NLM《Citing Medicine》格式的参考文献。
- 页面重点是 DOI 输入和生成结果；用户应能检查、编辑信息并复制引用。
- 作者、标题、期刊名或年份缺失时提醒用户。提醒只表示字段为空，不代表系统核验了信息真假。
- 查不到记录、查询失败或资料类型不支持时，给出清楚且可操作的提示。
- 产品追求简单、少操作、快速拿到可复制结果。约 5 秒是待实测的暂定目标，不是保证。
- 暂不把批量输入、账号和项目、协作、浏览器插件、Google Docs 深度集成、Zotero/Mendeley 同步、其他来源类型或大量引用格式加入首版，除非用户明确调整范围。
- “简单”是产品定位假设，尚未通过用户研究验证；不要把它描述成已证实的竞争优势。

## 事实来源与决策边界

- 产品目标和已选方案：优先参考 `dev-docs/PROJECT_BRIEF.md`、`dev-docs/README.md` 与用户最新明确决定。
- 项目实际结构、技术栈和可运行方式：以仓库文件和配置为准，不要根据产品说明推断。
- 本文件规定 Agent 的工作方式，不代替产品需求或技术设计。
- 除 `dev-docs/PROJECT_BRIEF.md` 已明确选择的首版技术外，数据来源/API、数据库、登录、部署、测试工具等仍可能尚未确定；先检查已有证据。若新选择会明显影响成本、隐私、迁移或产品范围，再向用户解释并询问。
- 不要把通用模板、占位符或与本项目无关的技术架构规则直接搬进项目。

## 工作流程

1. 先检查 Git 状态、相关文件和已有实现；不要覆盖或删除未检查的内容。
2. 用自己的话说明本次要解决的问题和计划修改的范围。发现需求与现有产品决定冲突时，指出冲突；不要悄悄改产品方向。
3. 先确定最短、完整、可验证的实现路径。每次聚焦一个清楚的小目标，不为了“以后可能用到”而增加功能或复杂架构。
4. 遵循现有项目结构与代码风格。只有仓库证据支持时，才采用特定框架、分层方式、命令或约定。
5. 只修改完成当前任务所需的文件。保留用户已有改动；不要擅自重置、覆盖、删除或整理无关文件。
6. 不要擅自提交、推送、部署、发布，或连接外部服务。不要执行破坏性 Git 操作。
7. 完成后用中文说明改了什么、如何查看或运行、实际执行了哪些检查，以及尚存限制。没有执行的检查不能说成已通过。

## 正确性、安全与交互

- 引用内容应由明确的书目信息和选定的 NLM 规则生成；不要把“字段不为空”说成“信息已核实”。不确定格式细节时查证可靠规范或标注不确定，不要编造规则。
- 错误提示应帮助用户理解下一步，例如检查 DOI、重试，或确认资料类型是否受支持。
- 不把密钥、密码、访问令牌或个人凭证写进源码、日志或 Git。遵循 `.gitignore`，不要输出敏感值。
- 不为未经确认的功能建立账号、收集个人信息或连接外部服务。
- 解释和界面文案优先让初学者与目标学生一眼看懂；避免不必要的术语和复杂选项。
- 如果改动界面，检查实际页面效果；如果当前环境无法运行或查看，明确说明，并提供可执行的查看方式。

## 检查与验收

- 先从仓库已有配置中找出适用的检查命令；没有配置时，不要假装存在固定命令。
- 检查范围应与改动相称。报告具体运行了什么、结果如何；若未运行，说明原因。
- 网站首条完整流程的产品验收方向：打开页面、输入受支持 DOI、生成 NLM 引用、检查/编辑信息、复制结果；查不到、查询失败、类型不支持和关键字段缺失时均有清楚反馈。
- 速度目标需以实际测量为依据。不要只凭代码阅读声称达到约 5 秒目标。

## Git 与项目资料

- `dev-docs/` 是项目文档的一部分，应纳入 Git 版本记录。产品决定更新后，按需同步立项文档和讨论记录。
- 密钥、密码、访问令牌和个人本地配置仍不得提交；遵循 `.gitignore` 中的敏感文件规则。
- 提交前先查看状态和差异。只暂存本次明确相关的文件，不使用 `git add .` 或 `git add -A`。
- 不擅自创建提交；只有用户明确要求时才提交，并先确认暂存内容。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
