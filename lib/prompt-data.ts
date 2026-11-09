export type DeploymentProfile =
  | "static"
  | "next"
  | "edge"
  | "python"
  | "container"
  | "streamlit"
  | "gradio"
  | "realtime"
  | "wechat"
  | "miniapp"
  | "mobile"
  | "desktop"
  | "extension"
  | "automation"
  | "offline";
export type PromptTemplate = {
  id: string;
  title: string;
  category: string;
  description: string;
  profile: DeploymentProfile;
  localId: string;
  features: string[];
  acceptance: { text: string; whenFeature?: string }[];
  defaultUse: "personal" | "commercial";
  boundary: string;
  question: string;
  placeholder: string;
  index: number;
  stack: string;
};
export const deploymentProfiles: Record<
  DeploymentProfile,
  { label: string; stack: string; delivery: string }
> = {
  static: {
    label: "静态网页",
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    delivery:
      "生成网站构建产物并部署到静态托管。默认不创建数据库；需要表单或同步时再明确后端。",
  },
  next: {
    label: "全栈网站",
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    delivery:
      "需要支持服务端功能的平台；云端环境变量、认证回调和数据库分别配置。Cloudflare Workers 需当前 OpenNext 适配。",
  },
  edge: {
    label: "轻量事件与 API",
    stack:
      "TypeScript + Hono + Cloudflare Workers；结构化状态优先 D1，文件按需 R2。",
    delivery:
      "按事件或请求运行，检查 CPU 时间和外部 API 超时。长期任务交给队列或后台工作服务。",
  },
  python: {
    label: "Python API",
    stack: "受支持的 Python + FastAPI + Uvicorn；持久数据使用云数据库。",
    delivery:
      "部署容器或兼容的 Python 服务，配置 0.0.0.0、平台端口、环境变量与健康检查。",
  },
  container: {
    label: "后台处理服务",
    stack:
      "Python + FastAPI + 独立任务处理进程；任务队列与持久存储按规模选择。",
    delivery:
      "前端与后台任务可分开部署；长任务不能依赖浏览器保持在线，临时磁盘不保存唯一副本。",
  },
  streamlit: {
    label: "Streamlit 数据应用",
    stack:
      "Python + Streamlit + pandas + Plotly；Excel 支持按需加入 openpyxl。",
    delivery:
      "优先 Streamlit 社区托管；设置入口文件和依赖。上传数据与 secrets 权限必须明确。",
  },
  gradio: {
    label: "模型演示",
    stack: "Python + Gradio + 模型所需运行库；先验证 CPU/GPU 与内存。",
    delivery:
      "按模型硬件需求部署 Space 或容器；公开演示的代码、模型授权与存储需要独立检查。",
  },
  realtime: {
    label: "实时服务",
    stack:
      "TypeScript 前端 + 支持长连接的 Node.js 服务；协作协议与持久化按需求选择。",
    delivery:
      "普通 HTTP 函数不能替代常驻 WebSocket 服务。若使用 Workers，需重新设计为 Durable Objects 等受支持架构。",
  },
  wechat: {
    label: "微信原生小程序",
    stack:
      "微信原生小程序 TypeScript / JavaScript + WXML + WXSS；默认评估微信云开发 / CloudBase。",
    delivery:
      "小程序前端在微信开发者工具预览、上传并提交审核。云平台只承载后端或云函数，不能把小程序目录上传到 Vercel 当成小程序发布。",
  },
  miniapp: {
    label: "多端小程序",
    stack:
      "按所选 Taro 或 uni-app 的当前稳定工具链，分别配置目标端的 SDK 与构建脚本。",
    delivery:
      "各小程序端用对应开发者工具预览和审核；H5 构建可放静态平台，App 部分需原生打包；后端独立选择。",
  },
  mobile: {
    label: "手机原生应用",
    stack:
      "Expo + React Native + TypeScript；先做本地可用版本，需要同步时再加后端。",
    delivery:
      "Expo 开发构建或 EAS 等工具生成安装包，按平台规则签名与上架。下方平台排名仅比较可选后端，不是 App 分发平台。",
  },
  desktop: {
    label: "桌面应用",
    stack: "按所选 Tauri 或 Electron 生态组织前端、系统能力与安全边界。",
    delivery:
      "为目标操作系统生成安装包，按需求签名。云平台只用于可选同步/API/下载站，不能替代桌面构建与分发。",
  },
  extension: {
    label: "浏览器扩展",
    stack:
      "Manifest V3 + TypeScript + 本地打包的界面样式，按能力申请最少权限。",
    delivery:
      "先通过加载已解压扩展验证，再按浏览器商店规则提交。需要 AI API 时单独部署服务端代理，不能内置共享密钥。",
  },
  automation: {
    label: "定时任务",
    stack:
      "轻量任务可用 TypeScript + Workers Cron；长任务或 Python 依赖采用专用任务容器。",
    delivery:
      "明确触发频率、时区、重试、幂等和通知授权。确认套餐支持调度，不用网页保活替代调度。",
  },
  offline: {
    label: "本地脚本",
    stack: "受支持的 Python；用标准库优先，按文件格式增加依赖。",
    delivery:
      "默认无需部署到云端。在自己的电脑执行预览、处理与恢复操作；下方平台只是在未来需要定时远程运行时的比较。",
  },
};
export const promptTemplates: PromptTemplate[] = [
  {
    id: "prompts-3",
    title: "个人作品集",
    category: "个人展示",
    description: "向招聘方或客户展示你的作品与能力。",
    profile: "static",
    localId: "local-9",
    features: ["作品列表与独立案例页", "个人介绍与技能", "联系方式与社交链接"],
    acceptance: [
      {
        text: "项目卡片进入对应案例",
        whenFeature: "作品列表与独立案例页",
      },
      {
        text: "手机能清楚查看作品与联系入口",
        whenFeature: "联系方式与社交链接",
      },
    ],
    boundary: "展示真实作品，不自动加入价格表、购买入口或虚构客户评价。",
    question: "你做哪类工作？",
    placeholder: "例如：插画师，希望接品牌插画项目",
    index: 1,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "scenario-product-landing",
    title: "产品落地页",
    category: "个人展示",
    description: "介绍一个具体产品，让访问者试用、预约或购买。",
    profile: "static",
    localId: "local-9",
    features: ["产品价值与功能演示", "常见问题", "一个明确的转化入口"],
    acceptance: [
      {
        text: "主按钮到达实际试用或联系地址",
        whenFeature: "一个明确的转化入口",
      },
      {
        text: "功能与价格只使用已提供的信息",
      },
    ],
    boundary:
      "围绕单个产品与目标用户，不把个人经历当作主内容；收集表单需要真实后端或表单服务。",
    question: "这个产品解决什么问题？",
    placeholder: "例如：帮自由职业者整理发票，目标是预约演示",
    index: 2,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "scenario-company",
    title: "企业与工作室官网",
    category: "个人展示",
    description: "介绍业务、服务范围和联系途径。",
    profile: "static",
    localId: "local-9",
    features: ["服务介绍", "已授权的案例", "联系与地理信息"],
    acceptance: [
      {
        text: "每项服务能找到对应介绍",
        whenFeature: "服务介绍",
      },
      {
        text: "联系入口可实际使用",
        whenFeature: "联系与地理信息",
      },
    ],
    boundary: "未经提供，不编造公司规模、地址、资质与客户。",
    question: "提供什么服务？",
    placeholder: "例如：摄影工作室，提供婚礼与商业拍摄",
    index: 3,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "commercial",
  },
  {
    id: "prompts-6",
    title: "个人数字名片",
    category: "个人展示",
    description: "把社交账号、联系方法和作品链接放在一个手机页面。",
    profile: "static",
    localId: "local-7",
    features: ["头像与个人介绍", "可管理的链接列表", "分享与二维码展示"],
    acceptance: [
      {
        text: "所有链接可打开",
        whenFeature: "可管理的链接列表",
      },
      {
        text: "二维码图片可清晰查看",
        whenFeature: "分享与二维码展示",
      },
    ],
    boundary: "不添加假认证、虚假在线状态或不需要的登录系统。",
    question: "希望别人最先点哪个链接？",
    placeholder: "例如：先看作品，再联系我的邮箱",
    index: 4,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "prompts-4",
    title: "个人博客",
    category: "内容与社区",
    description: "发表文章，按分类和标签组织自己的内容。",
    profile: "static",
    localId: "local-9",
    features: ["文章列表与详情", "分类标签与搜索", "阅读目录与文章元数据"],
    acceptance: [
      {
        text: "示例文章可阅读与筛选",
        whenFeature: "分类标签与搜索",
      },
      {
        text: "新增文章后能重新构建",
        whenFeature: "文章列表与详情",
      },
    ],
    boundary: "默认以本地 Markdown 管理内容，不自动扩展为多人知识库。",
    question: "主要写什么？",
    placeholder: "例如：旅行记录，按城市和年份分类",
    index: 5,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "scenario-docs",
    title: "产品使用文档",
    category: "内容与社区",
    description: "给用户一套能查到答案的产品教程。",
    profile: "static",
    localId: "local-14",
    features: ["分层目录", "全文搜索", "代码或步骤复制"],
    acceptance: [
      {
        text: "目录与页面对应",
        whenFeature: "分层目录",
      },
      {
        text: "关键词能找到相关教程",
        whenFeature: "全文搜索",
      },
    ],
    boundary: "结构围绕安装、使用、排错，不套用博客时间线。",
    question: "为哪个产品写文档？",
    placeholder: "例如：一个图片整理工具，需要安装与操作教程",
    index: 6,
    stack: "VitePress + TypeScript + Markdown；以文档目录和全文搜索组织内容。",
    defaultUse: "personal",
  },
  {
    id: "prompts-5",
    title: "网址导航",
    category: "内容与社区",
    description: "按主题整理值得访问的网站。",
    profile: "static",
    localId: "local-7",
    features: ["分类与标签", "模糊搜索", "外部链接与收藏"],
    acceptance: [
      {
        text: "组合筛选准确",
        whenFeature: "分类与标签",
      },
      {
        text: "每个网址与描述对应",
        whenFeature: "模糊搜索",
      },
    ],
    boundary: "数据集中管理；提交新网站若无后端，明确为外部表单或暂不提供。",
    question: "整理哪个领域的网站？",
    placeholder: "例如：设计师常用的配色、字体与素材网站",
    index: 7,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "scenario-forum",
    title: "小型社区论坛",
    category: "内容与社区",
    description: "让一群用户发帖、评论与交流。",
    profile: "next",
    localId: "local-6",
    features: ["用户登录", "帖子与评论", "举报与内容管理"],
    acceptance: [
      {
        text: "不同用户权限隔离",
        whenFeature: "用户登录",
      },
      {
        text: "删除内容后列表及时更新",
        whenFeature: "帖子与评论",
      },
    ],
    boundary: "包含审核与限流，不把匿名 localStorage 当账号体系。",
    question: "谁会在这里交流？",
    placeholder: "例如：本地跑步社群，讨论路线和活动",
    index: 8,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "personal",
  },
  {
    id: "prompts-19",
    title: "产品反馈投票墙",
    category: "内容与社区",
    description: "收集某个产品的反馈，并显示处理进度。",
    profile: "next",
    localId: "local-6",
    features: ["发布反馈", "赞同与排序", "管理员状态管理"],
    acceptance: [
      {
        text: "同一身份重复投票受到限制",
        whenFeature: "赞同与排序",
      },
      {
        text: "普通用户不能改处理状态",
        whenFeature: "管理员状态管理",
      },
    ],
    boundary: "不与匿名树洞混为一谈；投票限制须在服务端完成。",
    question: "为哪个产品收集意见？",
    placeholder: "例如：记账 App，希望分类为建议和故障",
    index: 9,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "personal",
  },
  {
    id: "scenario-anonymous",
    title: "匿名留言板",
    category: "内容与社区",
    description: "允许用户不展示姓名地留言，并提供审核机制。",
    profile: "next",
    localId: "local-6",
    features: ["匿名投稿", "审核后公开", "举报与管理"],
    acceptance: [
      {
        text: "待审核内容不公开",
        whenFeature: "审核后公开",
      },
      {
        text: "管理页面需登录",
        whenFeature: "举报与管理",
      },
    ],
    boundary: "匿名不等于无约束；限制刷帖与敏感数据收集，不默认显示投票排行。",
    question: "想收集哪种留言？",
    placeholder: "例如：读者对文章的匿名反馈",
    index: 10,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "personal",
  },
  {
    id: "scenario-json",
    title: "JSON 格式化工具",
    category: "效率工具",
    description: "粘贴 JSON，检查错误并整理格式。",
    profile: "static",
    localId: "local-7",
    features: ["格式化与压缩", "语法错误定位", "复制与下载"],
    acceptance: [
      {
        text: "合法 JSON 格式化前后语义一致",
        whenFeature: "格式化与压缩",
      },
      {
        text: "错误输入不让页面崩溃",
        whenFeature: "语法错误定位",
      },
    ],
    boundary: "所有处理留在浏览器，不需要数据库、账户或 AI API。",
    question: "主要处理什么内容？",
    placeholder: "例如：接口返回数据，常用 2 空格缩进",
    index: 11,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "scenario-qr",
    title: "二维码生成器",
    category: "效率工具",
    description: "把文本或网址转换成可下载的二维码。",
    profile: "static",
    localId: "local-7",
    features: ["内容输入", "尺寸与配色设置", "PNG / SVG 导出"],
    acceptance: [
      {
        text: "导出的码可以扫码读取",
        whenFeature: "PNG / SVG 导出",
      },
      {
        text: "超长内容与低对比颜色有提示",
        whenFeature: "尺寸与配色设置",
      },
    ],
    boundary: "在浏览器生成，二维码不能自行追踪访问；追踪需额外短链服务。",
    question: "主要生成哪类二维码？",
    placeholder: "例如：活动海报上的报名网址",
    index: 12,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "prompts-9",
    title: "文字海报生成器",
    category: "效率工具",
    description: "把一段文字排版成可分享的图片。",
    profile: "static",
    localId: "local-7",
    features: ["文字与作者输入", "版式与尺寸选择", "高清图片导出"],
    acceptance: [
      {
        text: "长文本不会越界",
        whenFeature: "文字与作者输入",
      },
      {
        text: "导出和预览一致",
        whenFeature: "高清图片导出",
      },
    ],
    boundary: "这是文字排版工具，不默认混入代码高亮或 AI 生图。",
    question: "想做什么风格的海报？",
    placeholder: "例如：读书摘抄卡，柔和配色，竖版",
    index: 13,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "scenario-code-image",
    title: "代码截图美化",
    category: "效率工具",
    description: "把代码做成带语法高亮的分享图片。",
    profile: "static",
    localId: "local-7",
    features: ["代码与语言选择", "主题与行号", "图片导出"],
    acceptance: [
      {
        text: "代码缩进和换行保留",
        whenFeature: "代码与语言选择",
      },
      {
        text: "长代码可处理且导出清楚",
        whenFeature: "图片导出",
      },
    ],
    boundary: "不执行输入的代码，不将输入上传到第三方。",
    question: "主要分享哪种代码？",
    placeholder: "例如：Python 教程片段，需要行号",
    index: 14,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "prompts-10",
    title: "每日习惯打卡",
    category: "效率工具",
    description: "记录目标的完成情况和连续打卡。",
    profile: "static",
    localId: "local-7",
    features: ["习惯与每日记录", "日历与连续天数", "本地备份导入导出"],
    acceptance: [
      {
        text: "按用户时区计算日期",
        whenFeature: "日历与连续天数",
      },
      {
        text: "刷新后数据保留",
        whenFeature: "习惯与每日记录",
      },
    ],
    boundary: "默认单设备本地存储，不承诺多设备同步，不自动加入团队看板。",
    question: "想坚持什么习惯？",
    placeholder: "例如：阅读、跑步，每天各打卡一次",
    index: 15,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "scenario-kanban",
    title: "个人任务看板",
    category: "效率工具",
    description: "把任务放进待处理、进行中和已完成三栏。",
    profile: "static",
    localId: "local-7",
    features: ["任务增删改", "状态流转与优先级", "本地备份"],
    acceptance: [
      {
        text: "键盘也能移动任务状态",
        whenFeature: "状态流转与优先级",
      },
      {
        text: "重载后任务仍在",
        whenFeature: "任务增删改",
      },
    ],
    boundary: "默认个人使用；团队协作需要账户与服务端存储，另行设计。",
    question: "管理哪类任务？",
    placeholder: "例如：每周内容创作，按优先级推进",
    index: 16,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "prompts-11",
    title: "短链接与点击统计",
    category: "效率工具",
    description: "生成短网址并查看访问数据。",
    profile: "edge",
    localId: "local-28",
    features: ["短码生成与跳转", "受保护的管理入口", "点击统计"],
    acceptance: [
      {
        text: "并发创建不会覆盖他人短码",
        whenFeature: "短码生成与跳转",
      },
      {
        text: "跳转目标仅允许合法网址",
        whenFeature: "短码生成与跳转",
      },
    ],
    boundary: "D1 唯一约束或一致性机制管理短码；精确计数不使用 KV 读改写。",
    question: "短链接用于什么？",
    placeholder: "例如：给社交媒体上的作品链接做统计",
    index: 17,
    stack:
      "TypeScript + Hono + Cloudflare Workers；结构化状态优先 D1，文件按需 R2。",
    defaultUse: "personal",
  },
  {
    id: "scenario-pwa",
    title: "可离线使用的 PWA",
    category: "效率工具",
    description: "把网页做成可安装、可离线访问的小工具。",
    profile: "static",
    localId: "local-7",
    features: ["安装说明与 manifest", "离线缓存", "版本更新提示"],
    acceptance: [
      {
        text: "断网后核心页面可打开",
        whenFeature: "离线缓存",
      },
      {
        text: "有新版本时不会静默丢失本地数据",
        whenFeature: "版本更新提示",
      },
    ],
    boundary: "先说明离线边界；PWA 不等同原生 App，浏览器能力存在差异。",
    question: "离线时必须能做什么？",
    placeholder: "例如：查看旅行清单，编辑本地待办",
    index: 18,
    stack:
      "Astro 或 Vite + TypeScript；内容驱动优先 Astro，交互工具优先 Vite。",
    defaultUse: "personal",
  },
  {
    id: "prompts-13",
    title: "垂直 AI 聊天助手",
    category: "AI 应用",
    description: "让 AI 围绕一个具体领域与你对话。",
    profile: "next",
    localId: "local-6",
    features: ["角色与主题约束", "流式回答与停止", "会话管理"],
    acceptance: [
      {
        text: "密钥不会进入浏览器",
      },
      {
        text: "失败和额度不足可恢复",
      },
    ],
    boundary: "不承诺专业结论正确；调用外部模型的费用单独说明。",
    question: "助手服务谁、解决什么？",
    placeholder: "例如：帮助英语学习者练习面试表达",
    index: 19,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "personal",
  },
  {
    id: "prompts-14",
    title: "文档知识库问答",
    category: "AI 应用",
    description: "让 AI 根据你上传的资料回答，并标明出处。",
    profile: "next",
    localId: "local-6",
    features: ["文档解析与切块", "向量检索", "回答与引用"],
    acceptance: [
      {
        text: "引用可追溯到原始内容",
        whenFeature: "回答与引用",
      },
      {
        text: "不同用户资料互相隔离",
      },
    ],
    boundary: "先限制文件类型与大小；检索不到内容要明确说明，不捏造来源。",
    question: "知识库里是什么资料？",
    placeholder: "例如：产品说明和常见问题，支持 PDF 与 Markdown",
    index: 20,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "personal",
  },
  {
    id: "prompts-15",
    title: "结构化文案生成器",
    category: "AI 应用",
    description: "填写主题、受众和语气，生成指定格式的文字。",
    profile: "next",
    localId: "local-6",
    features: ["用途与参数表单", "结构化生成结果", "复制与历史记录"],
    acceptance: [
      {
        text: "结果字段按约定解析",
        whenFeature: "结构化生成结果",
      },
      {
        text: "模型返回异常时有重试提示",
        whenFeature: "结构化生成结果",
      },
    ],
    boundary: "依据用途设计输入项，不把周报、翻译和广告全部当成同一任务。",
    question: "具体生成哪一种文字？",
    placeholder: "例如：把工作要点整理成每周项目进度报告",
    index: 21,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "personal",
  },
  {
    id: "prompts-16",
    title: "AI 图片生成工作台",
    category: "AI 应用",
    description: "输入描述或参考图，调用图片模型生成结果。",
    profile: "next",
    localId: "local-6",
    features: ["参数与参考图输入", "异步任务状态", "结果预览与下载"],
    acceptance: [
      {
        text: "长任务状态可恢复",
        whenFeature: "异步任务状态",
      },
      {
        text: "失败任务不会重复扣费",
        whenFeature: "异步任务状态",
      },
    ],
    boundary: "按供应商 API 设计任务轮询或回调；不要在短时函数里无限等待。",
    question: "图片主要用于什么？",
    placeholder: "例如：给产品拍摄准备背景图方案",
    index: 22,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "personal",
  },
  {
    id: "scenario-audio",
    title: "音频转写与会议纪要",
    category: "AI 应用",
    description: "上传录音，得到文字、要点和待办。",
    profile: "container",
    localId: "local-19",
    features: ["音频上传与限制", "转写任务队列", "摘要与时间戳"],
    acceptance: [
      {
        text: "长音频能后台处理",
        whenFeature: "转写任务队列",
      },
      {
        text: "原始音频可删除",
        whenFeature: "音频上传与限制",
      },
    ],
    boundary:
      "明确音频隐私和存储期限；异步任务不假装一次 HTTP 请求就能处理完。",
    question: "录音来自什么场景？",
    placeholder: "例如：一小时项目会议，需要责任人与待办",
    index: 23,
    stack:
      "Python + FastAPI + 独立任务处理进程；任务队列与持久存储按规模选择。",
    defaultUse: "personal",
  },
  {
    id: "scenario-ai-image-demo",
    title: "本地模型演示界面",
    category: "AI 应用",
    description: "给现成的 Python 模型加上传、参数和结果界面。",
    profile: "gradio",
    localId: "local-23",
    features: ["模型加载状态", "输入与推理", "结果展示"],
    acceptance: [
      {
        text: "硬件不够时清楚提示",
        whenFeature: "模型加载状态",
      },
      {
        text: "并发和文件大小受控",
        whenFeature: "输入与推理",
      },
    ],
    boundary: "先核算模型内存与 GPU 需求，不承诺免费 CPU 能跑任意模型。",
    question: "使用哪个模型与输入？",
    placeholder: "例如：开源图片分类模型，上传一张照片预测",
    index: 24,
    stack: "Python + Gradio + 模型所需运行库；先验证 CPU/GPU 与内存。",
    defaultUse: "personal",
  },
  {
    id: "prompts-18",
    title: "订阅会员 SaaS",
    category: "业务系统",
    description: "提供用户登录、付费方案和受权限控制的功能。",
    profile: "next",
    localId: "local-6",
    features: ["账号与组织", "订阅权益", "使用额度与账单入口"],
    acceptance: [
      {
        text: "支付回调验签且幂等",
        whenFeature: "订阅权益",
      },
      {
        text: "用户无法越权读取数据",
        whenFeature: "账号与组织",
      },
    ],
    boundary:
      "先做一个核心业务，支付使用测试模式；不伪造支付或把客户端余额当真实余额。",
    question: "用户为什么付费？",
    placeholder: "例如：订阅后每月生成 100 份报告",
    index: 25,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "commercial",
  },
  {
    id: "prompts-20",
    title: "咨询预约排期",
    category: "业务系统",
    description: "让用户选择服务、时间段并预约。",
    profile: "next",
    localId: "local-6",
    features: ["服务与时段", "预约与取消", "后台日历"],
    acceptance: [
      {
        text: "并发预约同一时段只能成功一次",
        whenFeature: "预约与取消",
      },
      {
        text: "时区、取消和通知状态正确",
        whenFeature: "预约与取消",
      },
    ],
    boundary: "预约记录包含个人信息，需权限和保留期限；不与普通报名问卷合并。",
    question: "预约时长与规则？",
    placeholder: "例如：45 分钟咨询，每周一至五，提前一天预约",
    index: 26,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "commercial",
  },
  {
    id: "scenario-form",
    title: "活动报名表单",
    category: "业务系统",
    description: "收集活动报名，导出并管理名额。",
    profile: "next",
    localId: "local-6",
    features: ["可配置报名项", "名额与去重", "审核与导出"],
    acceptance: [
      {
        text: "超出名额时不能继续占位",
        whenFeature: "名额与去重",
      },
      {
        text: "只有管理员能导出个人信息",
        whenFeature: "审核与导出",
      },
    ],
    boundary: "表单提交需真实保存与成功反馈；不默认做预约日历。",
    question: "活动与必填信息是什么？",
    placeholder: "例如：30 人工作坊，需要姓名和联系邮箱",
    index: 27,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "commercial",
  },
  {
    id: "prompts-21",
    title: "数字商品售卖",
    category: "业务系统",
    description: "展示并交付电子书、模板或自己的数字作品。",
    profile: "next",
    localId: "local-6",
    features: ["商品详情", "可信支付或人工审核", "受保护的文件交付"],
    acceptance: [
      {
        text: "未付款用户不能获取私有下载",
        whenFeature: "受保护的文件交付",
      },
      {
        text: "支付重试不重复发货",
        whenFeature: "可信支付或人工审核",
      },
    ],
    boundary: "使用真实支付提供商和签名下载；展示示例价格必须标注。",
    question: "卖什么、怎么交付？",
    placeholder: "例如：设计模板，付款后提供限时下载链接",
    index: 28,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "commercial",
  },
  {
    id: "scenario-admin",
    title: "内部管理后台",
    category: "业务系统",
    description: "管理客户、库存或业务记录。",
    profile: "next",
    localId: "local-6",
    features: ["身份与角色", "表格筛选和编辑", "导入导出与审计"],
    acceptance: [
      {
        text: "不同角色权限生效",
        whenFeature: "身份与角色",
      },
      {
        text: "批量操作有确认和失败报告",
        whenFeature: "导入导出与审计",
      },
    ],
    boundary: "先明确单一业务，不凭一个仪表盘代替真实数据流程。",
    question: "管理哪种数据？",
    placeholder: "例如：小店商品库存，需要入库、出库与盘点",
    index: 29,
    stack:
      "当前稳定版 Next.js App Router + TypeScript；服务端数据优先 PostgreSQL，按需要选择 Supabase 或 Neon。",
    defaultUse: "commercial",
  },
  {
    id: "scenario-realtime",
    title: "实时协作白板",
    category: "业务系统",
    description: "让多人同时编辑同一块画布或文档。",
    profile: "realtime",
    localId: "local-26",
    features: ["房间与权限", "实时同步", "断线重连与持久化"],
    acceptance: [
      {
        text: "两个客户端修改能一致显示",
        whenFeature: "实时同步",
      },
      {
        text: "断线重连不丢掉已确认的数据",
        whenFeature: "断线重连与持久化",
      },
    ],
    boundary:
      "需要支持长连接或专用协作服务，不能把普通短时函数当常驻 WebSocket 服务。",
    question: "多人共同编辑什么？",
    placeholder: "例如：团队头脑风暴，便签与连接线",
    index: 30,
    stack:
      "TypeScript 前端 + 支持长连接的 Node.js 服务；协作协议与持久化按需求选择。",
    defaultUse: "commercial",
  },
  {
    id: "prompts-23",
    title: "表格数据分析看板",
    category: "数据与自动化",
    description: "上传 CSV 或 Excel，筛选数据并看图表。",
    profile: "streamlit",
    localId: "local-22",
    features: ["数据导入与字段识别", "筛选与可视化", "明细和结果导出"],
    acceptance: [
      {
        text: "无文件时有标明模拟的示例",
        whenFeature: "数据导入与字段识别",
      },
      {
        text: "异常字段和大文件可处理",
        whenFeature: "数据导入与字段识别",
      },
    ],
    boundary: "图表匹配实际字段，不编造业务结论；敏感表格不随意公开。",
    question: "表格里有哪些字段？",
    placeholder: "例如：订单日期、地区、商品和金额",
    index: 31,
    stack:
      "Python + Streamlit + pandas + Plotly；Excel 支持按需加入 openpyxl。",
    defaultUse: "personal",
  },
  {
    id: "prompts-24",
    title: "网页采集与查询 API",
    category: "数据与自动化",
    description: "采集允许访问的信息，并提供查询接口。",
    profile: "python",
    localId: "local-19",
    features: ["来源配置与采集", "去重存储", "分页查询接口"],
    acceptance: [
      {
        text: "超时可重试且有限流",
        whenFeature: "来源配置与采集",
      },
      {
        text: "不会通过用户输入访问内网地址",
        whenFeature: "来源配置与采集",
      },
    ],
    boundary:
      "遵守来源规则，不绕过访问控制；采集任务与接口分离，大任务异步执行。",
    question: "需要采集什么来源？",
    placeholder: "例如：自己的公开文章列表，每天更新一次",
    index: 32,
    stack: "受支持的 Python + FastAPI + Uvicorn；持久数据使用云数据库。",
    defaultUse: "personal",
  },
  {
    id: "scenario-files",
    title: "本地文件整理脚本",
    category: "数据与自动化",
    description: "批量整理文件名、目录或表格。",
    profile: "offline",
    localId: "local-24",
    features: ["预览改动", "按规则处理", "结果日志与恢复记录"],
    acceptance: [
      {
        text: "先预演再修改文件",
        whenFeature: "预览改动",
      },
      {
        text: "不会覆盖同名文件",
        whenFeature: "按规则处理",
      },
    ],
    boundary:
      "默认在本地运行，不上传文件；批量删除与覆盖前确认，不为了脚本搭建网站。",
    question: "要处理什么文件？",
    placeholder: "例如：按拍摄日期整理照片，保留原文件",
    index: 33,
    stack: "受支持的 Python；用标准库优先，按文件格式增加依赖。",
    defaultUse: "personal",
  },
  {
    id: "scenario-scheduled",
    title: "定时报告与通知",
    category: "数据与自动化",
    description: "定时收集数据并生成报告或提醒。",
    profile: "automation",
    localId: "local-28",
    features: ["调度规则", "数据处理", "通知与执行记录"],
    acceptance: [
      {
        text: "重复触发不会重复发送",
        whenFeature: "通知与执行记录",
      },
      {
        text: "失败可追踪并有限次重试",
        whenFeature: "通知与执行记录",
      },
    ],
    boundary:
      "使用平台正式调度服务；明确时区、授权通知对象与费用，不靠访问网页保活。",
    question: "什么时候发什么报告？",
    placeholder: "例如：工作日早上九点汇总自己的站点访问数据",
    index: 34,
    stack:
      "轻量任务可用 TypeScript + Workers Cron；长任务或 Python 依赖采用专用任务容器。",
    defaultUse: "personal",
  },
  {
    id: "scenario-webhook",
    title: "Webhook 消息机器人",
    category: "数据与自动化",
    description: "收到服务的事件后自动处理并回复。",
    profile: "edge",
    localId: "local-28",
    features: ["事件接收与验签", "幂等处理", "响应与日志"],
    acceptance: [
      {
        text: "伪造请求被拒绝",
        whenFeature: "事件接收与验签",
      },
      {
        text: "重复事件只处理一次",
        whenFeature: "幂等处理",
      },
    ],
    boundary:
      "按对应平台开放接口接入，密钥只在服务端；不默认长轮询或常驻进程。",
    question: "连接哪个服务？",
    placeholder: "例如：GitHub 有新 Issue 时通知我",
    index: 35,
    stack:
      "TypeScript + Hono + Cloudflare Workers；结构化状态优先 D1，文件按需 R2。",
    defaultUse: "personal",
  },
  {
    id: "scenario-wechat",
    title: "微信小程序",
    category: "小程序与跨端",
    description: "在微信中提供服务、内容或轻量业务。",
    profile: "wechat",
    localId: "local-wechat",
    features: ["小程序页面与导航", "微信登录与用户数据", "业务操作与云函数"],
    acceptance: [
      {
        text: "开发者工具与真机均能预览",
      },
      {
        text: "合法域名与权限配置明确",
        whenFeature: "业务操作与云函数",
      },
    ],
    boundary:
      "不是普通网页：原生小程序优先，AppID、隐私声明、类目、备案与审核按官方要求准备。支付须满足主体资质，不自动加入。",
    question: "小程序主要帮用户做什么？",
    placeholder: "例如：社区活动报名，查看活动并提交报名",
    index: 36,
    stack:
      "微信原生小程序 TypeScript / JavaScript + WXML + WXSS；默认评估微信云开发 / CloudBase。",
    defaultUse: "personal",
  },
  {
    id: "scenario-taro",
    title: "Taro 多端小程序",
    category: "小程序与跨端",
    description: "用 React/TypeScript 维护需要多端发布的小程序。",
    profile: "miniapp",
    localId: "local-taro",
    features: ["目标平台配置", "共享业务页面", "平台能力适配"],
    acceptance: [
      {
        text: "选定平台均能构建预览",
        whenFeature: "目标平台配置",
      },
      {
        text: "差异功能有明确降级",
        whenFeature: "平台能力适配",
      },
    ],
    boundary:
      "先列清目标平台，不承诺一次开发所有端完全一致；每个平台分别注册与审核。",
    question: "需要发布到哪些端？",
    placeholder: "例如：微信小程序与 H5，优先微信体验",
    index: 37,
    stack:
      "按所选 Taro 或 uni-app 的当前稳定工具链，分别配置目标端的 SDK 与构建脚本。",
    defaultUse: "personal",
  },
  {
    id: "scenario-uniapp",
    title: "uni-app 多端应用",
    category: "小程序与跨端",
    description: "用 Vue 做需要小程序、H5 或 App 的业务。",
    profile: "miniapp",
    localId: "local-uniapp",
    features: ["Vue 页面与导航", "目标端构建", "平台差异处理"],
    acceptance: [
      {
        text: "在用户实际选择的目标端逐一验证核心流程，不强制额外增加平台",
        whenFeature: "目标端构建",
      },
      {
        text: "原生插件适配范围明确",
        whenFeature: "平台差异处理",
      },
    ],
    boundary:
      "先确定目标端，区分 HBuilderX 项目与 CLI 项目；云部署只解决网页或后端部分。",
    question: "你最优先发布哪个端？",
    placeholder: "例如：微信小程序优先，后续扩展安卓",
    index: 38,
    stack:
      "按所选 Taro 或 uni-app 的当前稳定工具链，分别配置目标端的 SDK 与构建脚本。",
    defaultUse: "personal",
  },
  {
    id: "prompts-25",
    title: "Chrome 浏览器插件",
    category: "小程序与跨端",
    description: "在浏览器中提取内容或提供快捷操作。",
    profile: "extension",
    localId: "local-extension",
    features: ["Manifest V3 与权限", "侧边栏或弹窗", "内容脚本与本地存储"],
    acceptance: [
      {
        text: "最小权限可完成任务",
        whenFeature: "Manifest V3 与权限",
      },
      {
        text: "加载已解压扩展后可实际操作",
      },
    ],
    boundary:
      "使用本地脚本与样式，遵守扩展 CSP；浏览器商店发布与云后端部署分开。",
    question: "插件要在哪些网页上做什么？",
    placeholder: "例如：在阅读文章时提取标题与正文到笔记",
    index: 39,
    stack:
      "Manifest V3 + TypeScript + 本地打包的界面样式，按能力申请最少权限。",
    defaultUse: "personal",
  },
  {
    id: "prompts-26",
    title: "Expo 手机 App",
    category: "小程序与跨端",
    description: "做一个在 Android 和 iOS 上体验的手机应用。",
    profile: "mobile",
    localId: "local-39",
    features: ["页面导航", "核心业务与本地数据", "设备权限与状态"],
    acceptance: [
      {
        text: "真机验证主要流程",
      },
      {
        text: "离线与权限拒绝时行为清楚",
        whenFeature: "设备权限与状态",
      },
    ],
    boundary:
      "原型可从 Expo Go 开始，涉及不支持的原生模块需开发构建；App 上架不能由网页托管代替。",
    question: "手机 App 的核心用途？",
    placeholder: "例如：个人记账，收入支出和分类统计",
    index: 40,
    stack:
      "Expo + React Native + TypeScript；先做本地可用版本，需要同步时再加后端。",
    defaultUse: "personal",
  },
  {
    id: "scenario-tauri",
    title: "Tauri 桌面工具",
    category: "小程序与跨端",
    description: "把网页界面做成轻量桌面应用。",
    profile: "desktop",
    localId: "local-38",
    features: ["桌面窗口", "本地文件处理", "安装包与权限"],
    acceptance: [
      {
        text: "目标桌面系统可运行",
        whenFeature: "桌面窗口",
      },
      {
        text: "文件选择取消不会报错",
        whenFeature: "本地文件处理",
      },
    ],
    boundary:
      "需要 Rust 与系统工具；目标平台分别构建签名，不把安装包当普通云网站部署。",
    question: "桌面端需要什么系统能力？",
    placeholder: "例如：批量重命名图片，Windows 优先",
    index: 41,
    stack: "按所选 Tauri 或 Electron 生态组织前端、系统能力与安全边界。",
    defaultUse: "personal",
  },
  {
    id: "scenario-electron",
    title: "Electron 桌面应用",
    category: "小程序与跨端",
    description: "使用 Node.js 能力构建较完整的桌面软件。",
    profile: "desktop",
    localId: "local-37",
    features: ["主进程与界面", "受限 IPC", "打包与升级策略"],
    acceptance: [
      {
        text: "渲染进程不能任意执行系统命令",
        whenFeature: "受限 IPC",
      },
      {
        text: "目标系统安装后能打开应用并完成选定的主要操作",
        whenFeature: "打包与升级策略",
      },
    ],
    boundary:
      "启用上下文隔离，避免对远程内容开放 Node 能力；说明体积与更新成本。",
    question: "为什么需要桌面应用？",
    placeholder: "例如：离线笔记，需要本地数据库和系统托盘",
    index: 42,
    stack: "按所选 Tauri 或 Electron 生态组织前端、系统能力与安全边界。",
    defaultUse: "personal",
  },
];
