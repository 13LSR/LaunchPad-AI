export const modules = [
  {
    slug: "prompts",
    number: "04",
    title: "AI 启动器",
    short: "把想法变成 AI 看得懂的需求",
    description: "选择一个想做的项目，生成可以复制给 AI 编程助手的需求说明。",
    icon: "Sparkles",
    tag: "从这里开始",
  },
  {
    slug: "projects",
    number: "05",
    title: "宝藏开源项目",
    short: "好项目，不必从零开始",
    description: "找一个已经做好的开源项目，让 AI 帮你安装、运行和修改。",
    icon: "Package",
    tag: "开源精选",
  },
  {
    slug: "skills",
    number: "07",
    title: "AI 技能与扩展",
    short: "给你的 AI 装上专业技能",
    description:
      "给 AI 增加设计、测试和办公能力，知道每种扩展能帮你做什么、怎样安装。",
    icon: "Puzzle",
    tag: "能力扩展",
  },
  {
    slug: "local",
    number: "01",
    title: "本地运行速查",
    short: "认出项目，按步骤运行",
    description:
      "不知道项目怎么打开？对照文件名找到运行方法，每次复制一行命令。",
    icon: "Terminal",
    tag: "35 类项目",
  },
  {
    slug: "databases",
    number: "03",
    title: "云数据库与存储",
    short: "为数据找一个合适的家",
    description:
      "账号、报名、订单、照片分别怎么保存？看具体用途，复制接入任务给 AI。",
    icon: "Database",
    tag: "选型指南",
  },
  {
    slug: "cli",
    number: "06",
    title: "Agent 自动部署",
    short: "让 AI 帮你走完上线最后一公里",
    description: "填写项目情况，复制上线任务给 AI，再按清单亲自试用结果。",
    icon: "Bot",
    tag: "自动化",
  },
  {
    slug: "cloud",
    number: "02",
    title: "云端部署平台",
    short: "找到适合你的那片云",
    description: "比较平台能运行什么、适合什么项目，以及免费额度和使用条件。",
    icon: "Cloud",
    tag: "重点推荐",
  },
  {
    slug: "media",
    number: "08",
    title: "媒体资产优化",
    short: "素材更轻，网站更快",
    description: "按图片、动画、视频和音频选择格式，解决体积、加载和存放问题。",
    icon: "Image",
    tag: "性能优化",
  },
] as const;
export type ModuleSlug = (typeof modules)[number]["slug"];
export const verifiedDate = "2026-11-08";
export const githubUrl = "https://github.com/13LSR/LaunchPad-AI";
export { commandEntries } from "./command-data";
export { promptTemplates } from "./prompt-data";
export const safetyAppendix =
  "\n\n【上线与交付约束】\n1. 先检查当前项目、依赖与官方文档，输出可复现的本地启动、构建和部署命令，以及 .env.example。\n2. 密钥只在服务端读取；禁止在浏览器或 NEXT_PUBLIC_ 变量暴露私密凭据。用户输入必须校验，接口添加合理的鉴权与限流。\n3. 涉及余额、积分、投票、预约时，在服务端使用事务、唯一约束和幂等控制；localStorage 不能作为安全边界。后台必须有服务端鉴权。\n4. 免费套餐、商业用途、休眠与账单以平台当前官方说明为准。Vercel Hobby 仅适用于个人非商业用途。外部 AI API 可能单独收费。\n5. 先做预览部署并验证；生产发布、收费资源创建、远程数据库迁移与删除前明确说明影响并等待确认。不为规避平台休眠发起保活流量。\n6. 若使用 Chrome 扩展，打包本地脚本和样式，遵守 Manifest V3 CSP；不使用远程执行代码或 CDN Tailwind 运行脚本。\n7. 为界面实现键盘操作、移动布局、错误与空状态；完成类型检查和生产构建。";
