# LaunchPad-AI · LaunchPad AI

面向不懂编程、正在用 AI 做项目的普通人的实用指南。Next.js 16 App Router + TypeScript + Tailwind CSS 4，使用 shadcn/ui 风格的可编辑 Radix 组件、Sonner Toast、lucide-react 与 framer-motion。

## 本地运行

要求：Node.js 24.x（与 Vercel 保持一致），包管理器使用 npm。仓库固定 Node 主版本，依赖版本由 package-lock.json 锁定，下载使用官方 npm 源。

```bash
npm ci
npm run dev
```

打开 http://localhost:3000。停止服务在终端按 Ctrl+C。

```bash
npm run typecheck
npm test
npm run build
npm start
```

不需要数据库或 API Key；站内搜索与任务说明生成都在本地浏览器运行，媒体模块提供格式选择和优化指引。

## 页面

- /：独立的粉绿介绍落地页，说明用途与完整使用路线；“前往体验”直接进入 AI 启动器
- /guide/prompts：42 个独立场景的分步 Prompt 生成器，含小程序、跨端应用与五档部署推荐
- /guide/projects：已核验开源仓库与部署入口
- /guide/skills：按 Skill / MCP / CLI 区分的技能资源
- /guide/local：35 个技术条目，文件名辅助识别、首次与再次运行、逐行命令解释与复制、带实际报错的 AI 排查任务；支持包管理器、系统和 Python 依赖方式切换
- /guide/databases：按用途与已有类型缩小候选，20 项数据库与文件服务筛选分页；生成带项目阶段、部署位置和真实报错的 AI 接入与排错任务
- /guide/cli：首次上线、更新已有项目与部署排错三类 AI 任务；区分 AI 工具能力、作品类型、数据、商用与预算；生成后聚焦结果，按实际任务验收，九类 CLI 逐组展开、逐行解释与复制
- /guide/cloud：按项目、用途和预算推荐候选；20 个平台每页六项、组合筛选与最多三个平台并排比较，保留官方套餐入口，并携带选择进入 AI 部署任务
- /guide/media：8 类素材对应 7 个外部工具，展示导入、调整、导出步骤和检查方法；接回项目与 5 类问题的 AI 排查默认折叠

## 数据维护

网站直接使用整理后的 TypeScript 与 JSON 数据：lib/data.ts 提供模块导航，lib/guide-content.ts 提供选型表、操作步骤、问题解答和复制说明，lib/command-data.ts 与 lib/prompt-data.ts 提供 35 个运行条目和 42 个场景。构建不读取原始 Markdown。原始八份资料、原文抽取副本和旧抽取工具仅保留在本地，不提交仓库。

当前平台数据在 lib/platforms.ts；2026-11-09 云平台复核依据、运营状态与套餐修正在 lib/platform-reviews.json，早期证据在 lib/sources.json。研究记录保留在数据文件中，页面展示实际用途、额度和官方入口。Zeabur 已公告停运，ClawCloud Run 原入口不可用，两者保留状态记录并移出推荐；访问失败本身不等于证实停运。旧资料中的绝对化说法和过期额度不会直接用于页面。

20 项数据库与文件服务在 lib/database-guides.json，官方依据保存在 lib/database-sources.json；lib/database-catalog.ts 提供兼容方向、能力边界、用途筛选与候选建议，配置和排错任务在 lib/database-tasks.ts。数据库页每页 6 项，保留原 ID 的全局搜索深链接；知识默认折叠，未知技术先检查实际项目。Neon 免费 PostgreSQL 存储还受账号合计 20 GB 限制，CloudBase 体验到期后的停服和销毁规则单独说明。

31 个开源项目定义在 lib/project-guides.json，筛选、排序和改造提示词由 lib/project-catalog.ts 提供；新增项目的官方 README 来源与证据保存在 lib/project-sources.json。18 个技能与扩展定义在 lib/skill-guides.json，安装偏好、筛选与试用提示词由 lib/skill-catalog.ts 提供，官方 README 证据保存在 lib/skill-sources.json。lib/resources.ts 保留统一导出，已有 GitHub 元数据保存在 lib/repos.json。项目页支持用途、关键词与难度筛选，每页 6 个，并保留原有搜索链接。LICENSE 标记不能替代完整许可条款。

lib/platform-fit.ts 统一平台用途与场景、运行、部署入口；lib/deployment-ranking.ts 按部署需求与商业用途提供五档适配推荐，理由不等同免费承诺；lib/prompt-builder.ts 只生成所选功能对应的验收项。lib/command-help.ts 为每种命令解释用途、执行时机与成功表现，新增命令必须同步补充。

lib/local-run.ts 根据阶段、系统、包管理器及 Python 依赖方式生成运行参考；官方依据在 lib/local-sources.json。文件名只用于缩小候选范围，不读取用户文件，也不把 package.json 或 app.py 当作某个框架的证明。多锁文件不自动选工具。真实启动脚本应由项目说明或“实际运行方式检查任务”确认；排错输入仅用于浏览器内复制，不保存或提交。

端口排错只生成命令，不读取或终止访客电脑上的进程。用户填写查询结果中的 PID，先核对程序再复制停止命令；切换系统或端口时清空旧编号，防止复制过期目标。

更新平台时同步修改额度、边界、来源和核验日期。网站不会实时自动更新套餐。

lib/media-guide.ts 提供素材格式、外部工具操作步骤，以及可选的接入和排错任务；官方依据在 lib/media-sources.json。主流程为选素材、去工具中处理、导出检查；本站不接收或转换文件。工具按类型筛选，SVG 与动画有各自的工具，不把静态图片工具用于动图。网站引用接入与故障排查默认收起，任务不混用；缺图和上传丢失先排查路径、权限及持久保存。选择变化清除旧排错任务，生成后聚焦结果。知识区与素材/问题搜索深链接继续有效。

lib/cloud-guides.ts 补充各部署平台的费用类型、休眠、数据持久性与上线入口；lib/cloud-catalog.ts 复用启动器适配结果，提供商业用途和持续额度过滤、多关键词搜索、选型提示词与部署跳转参数。未知技术先检查，本地工具与客户端不强行推荐网站托管。数据库选择分别给出判断、跳过、准备和沿用服务的下一步，并带入部署任务。比较最多三个平台，跨页保留；有效 cloud-* 深链接自动定位。已移出推荐的平台不再展示或进入全站搜索，内部状态记录仍用于防止推荐回流。部署页只接受白名单选项参数，不通过网址传递用户文本或凭据。平台新证据与停运公告保存在 lib/platform-reviews.json。

lib/deployment-task.ts 生成三种部署任务与对应验收清单；表单修改或平台深链接变化会清空旧任务和验收勾选。小程序、客户端与脚本使用各自交付方式，普通聊天工具不假装能访问本机。lib/cli-workflows.ts 和 lib/cli-command-help.ts 提供命令、执行条件、用途与成功表现；官方核验依据在 lib/cli-sources.json。Prisma 命令限定 ORM 7，Vercel 分别配置 Preview / Production，GitHub 推送与 Hugging Face 身份查询不作为部署完成证明。

## 部署

本项目部署到 Vercel，首页和八个模块会静态预渲染，不需要数据库、API Key 或付费集成。

1. 将本项目推送到 GitHub。在 Vercel 的 Add New → Project 中导入仓库。
2. Framework Preset 选 **Next.js**，Root Directory 使用仓库根目录（有 package.json 的目录）。
3. Node.js 使用 **24.x**，仓库的 engines 会固定这个主版本。Build Command 使用 **npm run build**，Install Command 可填写 **npm ci**，Output Directory 保持框架默认，不要改成 out。
4. Environment Variables 留空即可。先查看部署生成的预览地址，再绑定正式域名。

提交时保留源码、lib/ 中的网站数据、package-lock.json 与 .npmrc。构建直接运行 next build，不需要原始资料。docx/、原文抽取副本、旧抽取工具、node_modules、.next、.tmp、测试报告和 .vercel 已被忽略，不用上传。

Vercel 会根据 Next.js 自动配置路由，无需额外 vercel.json、重写规则或手动上传构建目录。部署后检查首页、八个模块、搜索、复制、深链接刷新和手机导航。Hobby 仅限个人非商业用途；商业使用应选择适用套餐。

官方依据：[Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)、[Node.js 版本配置](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)。

## 验证

npm test 检查当前 42 个场景、35 个运行条目的引用、逐行命令说明、平台推荐、数据服务选型和提示词范围。无需原始 Markdown 资料。
npm run test:e2e 使用 Playwright 测试全部路由、搜索、复制、生成器、筛选、系统命令、移动导航、主题、数据库接入任务与媒体指南。

首次运行浏览器测试：

```bash
npx playwright install chromium
npm run test:e2e
```

已有 Chromium 可设置 PLAYWRIGHT_CHROMIUM_EXECUTABLE；TEST_BASE_URL 可指向其他本地实例。

lib/search-index.ts 只索引实际显示的内容；搜索深链接会重置相关筛选或选择对应 CLI / 提示词场景。导航在工具内直接从 AI 启动器开始。

## 设计

遵循用户指定参考图的樱花粉与浅草绿，默认暖白浅色界面，也提供深色主题。键盘 Ctrl/Cmd+K 搜索；按钮与弹窗使用原生可访问语义，尊重减少动态效果设置。PRODUCT.md 和 DESIGN.md 记录产品与视觉约束。

本地技术卡片以左右按钮和选择器切换，不包含嵌套滚动区。入门知识默认折叠，深链接会自动展开。运行后的默认路线为数据库 → 云平台 → AI 部署；无外部数据需求可直接跳过数据库。
