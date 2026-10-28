# MedCite 产品讨论与立项草案（v0.2）

> 项目整体说明和已选技术栈见 [PROJECT_BRIEF.md](PROJECT_BRIEF.md)。本文保留较详细的产品讨论记录。

更新时间：2026-10-25
阶段：产品讨论与立项设计已完成首版范围；前后端首版链路已实现，正在进行后端验收。

## 1. 产品想法

做一个帮助学生和研究者生成规范引用的网站。先从一个范围很小、容易理解的场景开始：医学生输入英文医学期刊文章的 DOI，获得可检查、可复制的参考文献。

## 2. 目标用户假设

- 首批目标用户：需要用英文医学期刊文章完成课程论文或小型作业的医学生。
- 这是一个待验证的切入点，不代表产品以后只服务医学生。
- 用户看重省事和速度；产品的设计原则是简单、清楚、少操作。

## 3. 首版范围（MVP）

### 输入

- 接受纯 DOI，例如 `10.xxxx/xxxxx`。
- 接受 DOI 链接，例如 `https://doi.org/10.xxxx/xxxxx`。

### 支持的资料

- 第一版只生成英文医学期刊文章的参考文献。
- 如果 DOI 指向书籍、预印本、数据集等其他类型，提示暂不支持，不套用期刊文章格式。

### 引用格式

- 使用 NLM《Citing Medicine》作为第一版的参考文献格式基准。
- 产品文案明确标注 NLM；不承诺覆盖所有医学期刊的特殊投稿要求。

### 结果信息与编辑

- 展示论文标题、作者、期刊名、出版年份，以及查到的卷号、期号、页码。
- 展示 NLM 格式的引用，提供“复制引用”和“编辑信息”操作。
- 用户编辑论文信息后，引用预览随之更新。
- 自动生成的信息可能来自元数据来源；产品不承诺自动判断内容是否真实正确。

### 缺失信息提醒

- 系统只检查关键信息是否为空，不判断已有信息是否真实准确。
- 作者、文章标题、期刊名或出版年份缺失时提醒用户。
- 卷号、期号、页码单独缺失时不一定提醒，因为部分文章没有传统卷期页信息。
- 信息齐全时直接显示引用；发现上述关键信息为空时显示提醒。

## 4. 页面与用户流程

首版采用一个页面、上下排列的两个主要区域：

1. **输入区域**：DOI 输入框，接受纯 DOI 或 DOI 链接；下方放“生成引用”按钮。
2. **结果区域**：成功生成后显示 NLM 引用和“复制引用”按钮。论文详细信息可通过“编辑信息”展开，编辑后引用预览同步更新。

流程：

1. 用户打开首页，粘贴 DOI 或 DOI 链接。
2. 点击“生成引用”。
3. 系统查询论文书目信息。
4. 成功时展示论文信息和 NLM 引用预览。
5. 用户直接复制，或按需编辑信息后复制。
6. 查不到记录时提示检查 DOI 或重试；如果资料不是期刊文章，提示首版暂不支持。
7. 查询失败时在输入区域附近解释原因；只有查询成功后才显示引用结果区域。

## 5. 首页文案与定位

产品名工作名称：**MedCite**。正式使用前还需确认名称是否可用。

首屏主标题：**Simple medical citations**
副标题：`Paste a DOI to create an NLM-style reference for a medical journal article.`

- 输入框：`Paste a DOI or DOI link`
- 主按钮：`Generate reference`
- 结果区标题：`Your NLM reference`
- 复制按钮：`Copy reference`
- 编辑按钮：`Edit details`
- 缺少信息：`Some required details weren’t found. Please review the article information.`
- 查不到记录：`We couldn’t find article details for this DOI. Check the DOI and try again.`
- 不支持的资料类型：`This DOI doesn’t appear to be a journal article. This version supports journal articles only.`

产品优势假设：简单、少步骤，让用户尽快得到可复制的引用。需要通过实际使用验证“简单”是否比现有替代工具更省事。

## 6. 验收方向

- 从打开页面、输入 DOI、生成引用，到复制结果，主要流程能完整跑通。
- 常见且受支持的 DOI 能生成可复制的 NLM 参考文献。
- 缺少关键信息、查不到记录或资料类型不支持时，页面能给出清楚提醒。
- 速度是首版重点。暂定的性能目标建议为：正常网络下，常见 DOI 点击生成后约 5 秒内显示结果；如果实现后不稳定，再根据实测调整。超过预期时要有明确的查询中状态，不能让页面像卡住一样。

## 7. 暂不纳入第一版

- 批量输入 DOI
- 账号、项目管理和多人协作
- 浏览器插件
- Google Docs 深度集成
- Zotero、Mendeley 同步
- 大量引用格式
- 图书、网页、视频、报纸等其他来源类型

这些功能可以在最小流程清楚、可用后再评估。

## 8. 竞争与机会观察

已看到的替代产品包括 PubMed 的 Cite 功能、ZoteroBib、Scribbr、MyBib 和 Zotero。DOI 输入、NLM 或其他格式生成、编辑及复制已有免费替代方案，因此第一版的“简单”是产品定位假设，不是已经验证的独特优势。

后续如果考虑扩大产品，应先了解学生在现有工具里的具体麻烦，再决定是否投入批量输入、课程/期刊格式预设或其他功能。

## 9. 参考规范与资料来源

- ICMJE 投稿建议：<https://icmje.org/recommendations/browse/manuscript-preparation/preparing-for-submission.html>
- NLM 样例和格式说明：<https://www.nlm.nih.gov/bsd/uniform_requirements.html?lang=en>
- NLM《Citing Medicine》：<https://www.ncbi.nlm.nih.gov/books/NBK7256/>
- Crossref REST API 文档（后续技术方案参考）：<https://www.crossref.org/documentation/retrieve-metadata/rest-api/>
- NCBI API 文档（后续技术方案参考）：<https://www.ncbi.nlm.nih.gov/home/develop/api/>
- PubMed Cite 功能：<https://pubmed.ncbi.nlm.nih.gov/help/>
- ZoteroBib 功能说明：<https://github.com/zotero/zoterobib/blob/master/src/html/faq.md>
- Scribbr Citation Generator：<https://www.scribbr.com/citation/generator/>
- MyBib 功能说明：<https://www.mybib.com/premium-features>

> 说明：这是产品讨论草案，不是技术实现说明。医学期刊可能有各自的投稿要求；NLM 是首版的格式基准，不承诺适用于所有期刊的特殊格式。

## 10. 后端框架讨论（2026-10-25）

本节记录已确认的首版后端方向，具体格式引擎和性能是否达标留待实现验收。

### 已确认

- 首版只支持英文医学期刊论文，输入纯 DOI 或 DOI 链接。
- PubMed 是主要书目信息来源；Crossref 作为备用来源，在 PubMed 未找到记录或关键信息不足时再查询。
- 备用来源的 DOI 必须与用户输入的 DOI 相符。来源字段冲突时不静默拼接，首版以 PubMed 信息为主。
- 以 NLM《Citing Medicine》生成期刊论文参考文献。格式引擎和样例验证留到实现验收阶段；如果不够准确，再调整。
- 查不到记录时给友好说明，不生成伪造引用，也不展示空白手动表单。字段缺失时只提醒，不声称已核实字段真实性。
- 用户编辑后的书目信息和预览暂存在页面中，刷新后不保留；温和提醒用户对照原文检查修改内容。
- 首版不做数据库、账号、服务端保存、项目管理或协作。
- 约 5 秒是待实测的速度目标。若实现后验收未达标，再调整。

### 暂定服务端流程

校验并规范化 DOI → 查询 PubMed → 必要时按规则回退查询 Crossref → 确认 DOI 匹配并规范化论文元数据 → 确认资料类型并检查作者、标题、期刊名、年份等关键字段 → 生成 NLM 引用 → 将引用、论文信息、字段缺失提醒和查询来源返回前端。

接口暂定为 `POST /api/citations/lookup`，由 Next.js Route Handler 提供。具体返回字段、超时数值和上游 API 请求细节在实现前再根据官方接口文档确定。查询失败、超时、DOI 无效、无匹配记录、资料类型不支持等情况应分别给出清楚提示。

### 后续再决定

- NLM 格式引擎及真实论文样例的验收清单。
- 具体性能测量方法；不在未测量前承诺速度。
- 部署、缓存、公开服务后的限流，以及未来保存书目所需的数据库和账号方案。

## 11. 实施验收资料

后端验收规则、目录责任、最小链路、11 个接口场景、运行命令和 Git 归档约束，统一见 [IMPLEMENTATION_SOURCE_OF_TRUTH.md](IMPLEMENTATION_SOURCE_OF_TRUTH.md)。

## 12. Cloudflare 部署讨论（2026-10-26）

用户确认先将网站部署到已登录的 Cloudflare 账号。检查发现账号中已有 `refine-bibliography` Pages 项目，但其公网地址显示服务暂停，且项目没有连接 Git 仓库；该项目的手动上传入口只接受静态 HTML、CSS 和 JS，不能承载当前 Next.js 的 DOI 查询接口。

因此首版采用 Cloudflare Workers + vinext 适配现有 Next.js 16 项目。首版不启用缓存、KV/数据库或图片优化。兼容性检查显示当前 App Router、页面、布局和 Route Handler 为 100% compatible；本地 vinext 构建和接口验证通过后，再进行公开部署。
