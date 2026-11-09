import { platformFits } from "./platform-fit";
import { platforms } from "./platforms";
import type { DeploymentProfile } from "./prompt-data";
export const tiers = ["夯暴了", "顶级", "人上人", "NPC", "拉完了"] as const;
export type Tier = (typeof tiers)[number];
export type DeploymentChoice = {
  platformId: string;
  tier: Tier;
  reason: string;
  tradeoff: string;
  compatible: boolean;
};
export type ProjectUse = "personal" | "commercial";
const rankingRows: Record<
  DeploymentProfile,
  [string, Tier, string, string, boolean][]
> = {
  static: [
    [
      "cloud-3",
      "夯暴了",
      "只需发布静态文件，Cloudflare Pages 的构建与静态托管正好覆盖需求，少维护一个服务器。",
      "适合静态导出；表单保存、登录与订单仍需后端。",
      true,
    ],
    [
      "cloud-2",
      "顶级",
      "静态站与预览部署顺手，已有 Netlify 工作流时接入成本较低。",
      "免费 credits 同时覆盖多种用量，需查看消耗。",
      true,
    ],
    [
      "cloud-0",
      "人上人",
      "部署个人展示站很方便，但纯静态内容未必需要它的完整全栈能力。",
      "Hobby 只适合个人非商业用途。",
      true,
    ],
    [
      "cloud-4",
      "NPC",
      "已有 GitHub 仓库的个人文档可以用，部署路径和静态输出需配置好。",
      "不运行后端，且有商业用途限制；购买前核对官方使用规则。",
      true,
    ],
    [
      "cloud-15",
      "拉完了",
      "为一个静态页面自行配置云资源，账号、账单和运维工作明显多于收益。",
      "这里评价新手做当前项目的投入；AWS 本身也有适合其他需求的服务。",
      true,
    ],
  ],
  next: [
    [
      "cloud-0",
      "夯暴了",
      "Next.js 的框架集成与预览流程省步骤，适合先跑通完整页面和服务端功能。",
      "这里的免费起点是非商业 Hobby；商用需改用合适付费方案。",
      true,
    ],
    [
      "cloud-1",
      "顶级",
      "能同时接入 D1、R2 和边缘 API，适合愿意让 AI 完成适配的项目。",
      "Next.js 需要 OpenNext；检查 Node 库兼容性和 CPU 额度。",
      true,
    ],
    [
      "cloud-2",
      "人上人",
      "支持 Next.js 部署与预览，是可用的替代方案。",
      "需核对当前框架支持情况与 credits 消耗。",
      true,
    ],
    [
      "cloud-11",
      "NPC",
      "容器能承载完整 Node 服务，适合项目后来出现常驻任务时使用。",
      "对普通 Next.js 起步项目多了一层容器与付费资源管理。",
      true,
    ],
    [
      "cloud-4",
      "拉完了",
      "纯静态托管不能运行本场景需要的登录、数据库写入或服务端接口。",
      "只能发布静态导出部分，不能替代整个全栈应用。",
      false,
    ],
  ],
  edge: [
    [
      "cloud-1",
      "夯暴了",
      "原生运行 Hono / Workers，D1 与 R2 可直接绑定，轻量事件处理少绕路。",
      "CPU、请求和存储分别有额度；复杂计算不适合 Free。",
      true,
    ],
    [
      "cloud-5",
      "顶级",
      "Web 标准接口与 TypeScript 运行方式接近，适合依赖兼容的轻量 API。",
      "需要改用 Deno 支持的数据连接，不能直接复用 Workers 绑定。",
      true,
    ],
    [
      "cloud-0",
      "人上人",
      "短时 HTTP 接口可以运行，适合同时已有 Vercel 网站的项目。",
      "需要改写部署入口；Hobby 非商业且函数有时间限制。",
      true,
    ],
    [
      "cloud-11",
      "NPC",
      "用 Node 容器也能完成，但轻量事件不一定值得维护常驻资源。",
      "若改为长任务或长连接，容器的价值会提高；预算另算。",
      true,
    ],
    [
      "cloud-4",
      "拉完了",
      "只提供静态网页，无法保护服务端密钥、处理 Webhook 或写数据库。",
      "网页可以放这里，但本场景的核心 API 必须另找平台。",
      false,
    ],
  ],
  python: [
    [
      "cloud-11",
      "夯暴了",
      "容器和环境变量集中管理，适合把标准 Python API 连同数据库依赖一起部署。",
      "这是省步骤优先的推荐，不承诺永久免费；先看套餐与运行费用。",
      true,
    ],
    [
      "cloud-9",
      "顶级",
      "Web Service 模型适合常见 Python 后端，构建与启动配置直观。",
      "免费实例若可用可能休眠，规格与套餐在控制台复核。",
      true,
    ],
    [
      "cloud-10",
      "人上人",
      "支持容器和 Python，小型接口可先做验证。",
      "Free 内存 512 MB、CPU 较少，官方不建议用于生产。",
      true,
    ],
    [
      "cloud-14",
      "NPC",
      "容器可按请求启动，控制能力较强。",
      "计费账户、镜像仓库、区域和网络配置对新手更复杂。",
      true,
    ],
    [
      "cloud-3",
      "拉完了",
      "静态托管不运行你的 FastAPI / Flask 常驻进程。",
      "仅可承载分离后的前端，不能直接上传 Python 项目启动。",
      false,
    ],
  ],
  streamlit: [
    [
      "cloud-6",
      "夯暴了",
      "直接围绕 Streamlit 的入口、依赖和分享流程设计，最少改变原项目。",
      "资源、休眠和数据公开范围需确认；不适合任意后端服务。",
      true,
    ],
    [
      "cloud-7",
      "顶级",
      "Docker Space 可承载数据应用，也方便与模型演示放在一起。",
      "按当前支持的 SDK / Docker 方式配置；免费硬件与休眠待核对。",
      true,
    ],
    [
      "cloud-11",
      "人上人",
      "容器可以完整运行 Streamlit，便于增加其他后台服务。",
      "对简单个人看板而言，多了容器和持续资源成本。",
      true,
    ],
    [
      "cloud-10",
      "NPC",
      "技术上可运行小型看板，但免费实例的内存和 CPU 较紧。",
      "较大表格与模型处理容易超资源，不作为生产保证。",
      true,
    ],
    [
      "cloud-0",
      "拉完了",
      "Streamlit 需要自己的持续运行服务，普通 Vercel 前端/函数部署不能直接承载。",
      "若重写成 Next.js 前端加独立 Python 后端，已经是另一种架构。",
      false,
    ],
  ],
  gradio: [
    [
      "cloud-7",
      "夯暴了",
      "围绕模型演示设计，Gradio 接入自然，硬件选择与模型社区在同一处。",
      "先核对模型需要的 GPU、内存、许可证与当前套餐，不能假设 CPU 免费够用。",
      true,
    ],
    [
      "cloud-11",
      "顶级",
      "可通过容器管理 Python 依赖和持久数据，适合调用外部模型的界面。",
      "需要自备模型服务或确认 CPU 适配；不默认包含 GPU。",
      true,
    ],
    [
      "cloud-9",
      "人上人",
      "可托管轻量 Gradio Web 服务或外部模型接口的演示。",
      "资源与休眠约束影响体验，不适合默认加载大模型。",
      true,
    ],
    [
      "cloud-10",
      "NPC",
      "可做很轻的验证，但 Free 512 MB 对多数本地模型太紧张。",
      "仅在明确模型与依赖能装入资源范围时考虑。",
      true,
    ],
    [
      "cloud-3",
      "拉完了",
      "静态站不能加载 Python 模型和启动 Gradio 推理服务。",
      "可以展示宣传页，无法执行这个项目的核心功能。",
      false,
    ],
  ],
  container: [
    [
      "cloud-11",
      "夯暴了",
      "同项目管理 Web 与任务服务，适合有后台队列、数据库和文件处理的应用。",
      "后台工作需要持续资源预算；先确认任务服务和卷的费用。",
      true,
    ],
    [
      "cloud-9",
      "顶级",
      "容器与后台服务模型适合分离长任务和网页请求。",
      "后台任务对应服务通常需付费；不能把免费 Web 实例当长期工作进程。",
      true,
    ],
    [
      "cloud-12",
      "人上人",
      "Machines 与持久卷能支持自定义运行方式。",
      "需要多一些网络、区域和机器管理知识，先明确计费。",
      true,
    ],
    [
      "cloud-14",
      "NPC",
      "容器服务与 Jobs 可覆盖任务，但需要区分请求服务和批处理。",
      "账号、权限、镜像与任务重试配置较多，不是直接复制启动命令即可。",
      true,
    ],
    [
      "cloud-3",
      "拉完了",
      "没有持续的后台任务运行环境。",
      "仅托管前端不能完成音频解析、队列和长时间计算。",
      false,
    ],
  ],
  realtime: [
    [
      "cloud-11",
      "夯暴了",
      "常驻 Node 容器更贴近现成 WebSocket 协作服务，迁移时改动较少。",
      "生产服务需要资源预算，连接状态仍需持久化和恢复设计。",
      true,
    ],
    [
      "cloud-12",
      "顶级",
      "Machines 适合自定义长连接进程和区域部署。",
      "运维与计费理解成本更高，需处理连接分配和状态同步。",
      true,
    ],
    [
      "cloud-1",
      "人上人",
      "Durable Objects 等能力可做实时协作，适合愿意采用平台架构的项目。",
      "这不是把普通 Node WebSocket 服务器原样上传，需要专门实现并核算用量。",
      true,
    ],
    [
      "cloud-9",
      "NPC",
      "Web Service 可运行长连接后端，已有项目可考虑。",
      "会休眠的免费实例会影响多人会话，正式使用应选相应计划。",
      true,
    ],
    [
      "cloud-0",
      "拉完了",
      "普通函数不能作为本项目的常驻 WebSocket 服务端。",
      "可放前端或使用第三方实时服务，但不能替代当前协作后端。",
      false,
    ],
  ],
  wechat: [
    [
      "cloud-21",
      "夯暴了",
      "微信云开发把小程序身份、云函数、数据与存储接在一起，少配置一套独立后端。",
      "只推荐后端；小程序前端仍需开发者工具上传和平台审核，套餐与资质单独核对。",
      true,
    ],
    [
      "cloud-11",
      "顶级",
      "已有可用的 Node / Python 后端时，容器部署便于复用接口。",
      "需要 HTTPS 合法域名、服务端微信凭据及实际用户所在地访问测试，资源通常收费。",
      true,
    ],
    [
      "cloud-1",
      "人上人",
      "轻量 HTTPS API 可以承载小程序的部分服务端逻辑。",
      "不原生提供小程序发布；需合法域名、登录交换与国内网络实测，不能假定访问稳定。",
      true,
    ],
    [
      "cloud-14",
      "NPC",
      "完整容器后端能复用，但为小型小程序配置云账号和基础设施步骤较多。",
      "区域、网络、账单和域名均要单独准备。",
      true,
    ],
    [
      "cloud-3",
      "拉完了",
      "把小程序前端目录放到静态网站平台，无法变成可在微信发布的小程序。",
      "H5 页面可以另行托管，但不能替代小程序审核与后端。",
      false,
    ],
  ],
  miniapp: [
    [
      "cloud-21",
      "夯暴了",
      "以微信为首发端时，云函数、数据和身份接入更集中。",
      "排名针对微信首发的后端；其他端需核对 SDK 与登录接入，前端分别打包审核。",
      true,
    ],
    [
      "cloud-11",
      "顶级",
      "独立 REST API 容易被多个客户端复用，适合跨端业务。",
      "需要自己设计多端登录，配置各端合法域名，并准备容器预算。",
      true,
    ],
    [
      "cloud-1",
      "人上人",
      "轻量跨端 API 与静态 H5 可组合部署。",
      "小程序前端仍由各平台分发，平台 SDK、区域访问和绑定要验证。",
      true,
    ],
    [
      "cloud-17",
      "NPC",
      "可承载 H5 输出或受支持的边缘接口，适合需要大陆访问方案时评估。",
      "不能直接发布小程序；函数兼容、地区与域名备案条件按当前方案核对。",
      true,
    ],
    [
      "cloud-4",
      "拉完了",
      "只能发布静态 H5，不能替代小程序前端分发和业务后端。",
      "仅有 H5 展示需求时可单独评估，不作为此多端方案的完整落点。",
      false,
    ],
  ],
  mobile: [
    [
      "cloud-21",
      "夯暴了",
      "需要云端数据与身份时，可以评估集成式后端，减少自己维护服务的工作。",
      "先核对 Expo/原生客户端支持的 SDK 与认证方式；App 安装包需另行构建分发。",
      true,
    ],
    [
      "cloud-11",
      "顶级",
      "支持自定义 API 和数据库，适合已明确需要后端的手机 App。",
      "容器成本与网络区域需单独评估，不是免费 App 上架服务。",
      true,
    ],
    [
      "cloud-1",
      "人上人",
      "轻量同步接口与对象存储可以组合，适合小请求、小计算。",
      "客户端需适配 API 与身份校验；重任务应交给其他服务。",
      true,
    ],
    [
      "cloud-15",
      "NPC",
      "资源丰富，但为手机原型配置权限和基础设施学习成本较高。",
      "首次本地原型甚至可能完全不需要云服务；免费金是限期计划。",
      true,
    ],
    [
      "cloud-4",
      "拉完了",
      "静态网页托管不能生成或上架 Android/iOS 原生应用，也不是完整业务 API。",
      "可做宣传页，不是 App 本身的发布渠道。",
      false,
    ],
  ],
  desktop: [
    [
      "cloud-1",
      "夯暴了",
      "只在需要同步或在线验证时，轻量 API 能为本地桌面应用补充云功能。",
      "优先先做本地可用版本；安装包、签名与自动更新要单独设计。",
      true,
    ],
    [
      "cloud-11",
      "顶级",
      "需要复杂在线业务时，可复用完整 Node / Python 后端。",
      "有持续资源费用；纯离线桌面工具无需为此开通服务。",
      true,
    ],
    [
      "cloud-21",
      "人上人",
      "需要集成数据或存储时可评估，但需先确认桌面 SDK/HTTP 接入方式。",
      "不要把云端身份与本地文件权限混在一起。",
      true,
    ],
    [
      "cloud-15",
      "NPC",
      "能构建配套服务，但对单机工具增加了大量配置与账单理解成本。",
      "仅有明确的云能力需求时采用。",
      true,
    ],
    [
      "cloud-4",
      "拉完了",
      "纯静态 GitHub Pages 不运行桌面应用需要的同步 API 或身份校验后端。",
      "可以发布下载说明页；同步服务与桌面安装包需要分别准备。",
      false,
    ],
  ],
  extension: [
    [
      "cloud-1",
      "夯暴了",
      "适合给扩展提供轻量、受保护的 API 代理，密钥可留在服务端。",
      "扩展前端仍需本地打包或商店发布；代理必须鉴权限流。",
      true,
    ],
    [
      "cloud-0",
      "顶级",
      "已有 Next.js 服务时可用其后端接口，开发流程接近常规网站。",
      "Hobby 限非商业；扩展密钥不应放到公开客户端。",
      true,
    ],
    [
      "cloud-11",
      "人上人",
      "适合代理之外还需要长期处理或复杂依赖的扩展后端。",
      "简单扩展可能不需要持续付费容器。",
      true,
    ],
    [
      "cloud-14",
      "NPC",
      "能运行容器接口，但小型扩展的配置与账单步骤较多。",
      "先明确必要后端，再考虑云资源。",
      true,
    ],
    [
      "cloud-3",
      "拉完了",
      "静态托管既不能保护 API 私密密钥，也不能替代浏览器扩展发布流程。",
      "可以托管介绍页，无法完成扩展核心服务。",
      false,
    ],
  ],
  automation: [
    [
      "cloud-1",
      "夯暴了",
      "轻量定时事件可使用正式 Cron Triggers，适合小计算量的数据汇总。",
      "核对调度时区、调用预算与执行限制；长任务另设工作服务。",
      true,
    ],
    [
      "cloud-11",
      "顶级",
      "有 Python 或容器依赖时，按平台任务能力部署更容易复用代码。",
      "任务资源与执行时间计费，先确认调度配置和上一轮结束规则。",
      true,
    ],
    [
      "cloud-14",
      "人上人",
      "Cloud Run Jobs 配合调度适合容器批处理。",
      "需要设置调度、身份和重试，不能只部署一个 HTTP 服务就当定时任务。",
      true,
    ],
    [
      "cloud-0",
      "NPC",
      "可用受计划限制的 Cron 触发短任务。",
      "频率、用途与函数时长受方案约束，不适合默认长期运行任务。",
      true,
    ],
    [
      "cloud-3",
      "拉完了",
      "静态网页本身不会在无人打开时持续执行定时工作。",
      "需要正式调度服务，不用访问网页保活代替。",
      false,
    ],
  ],
  offline: [
    [
      "cloud-11",
      "夯暴了",
      "未来确实需要远程定时运行时，容器能复用现有 Python 脚本。",
      "当前场景首选本地执行、无需上云；云端必须先解决文件上传和费用。",
      true,
    ],
    [
      "cloud-14",
      "顶级",
      "未来批量云任务可用 Jobs 方式，不依赖网页请求保持连接。",
      "需配置存储、任务权限和预算，当前本地任务无需开通。",
      true,
    ],
    [
      "cloud-12",
      "人上人",
      "Machines 可运行自定义脚本并挂载存储。",
      "要自己管理文件输入、卷和任务结束后的资源释放。",
      true,
    ],
    [
      "cloud-15",
      "NPC",
      "云服务可完成，但对一次性本地文件整理投入过大。",
      "上传私人文件、权限和账单会增加不必要复杂性。",
      true,
    ],
    [
      "cloud-3",
      "拉完了",
      "静态网站无法代替本地 Python 脚本操作你的电脑目录。",
      "如改为浏览器文件工具，需要重新设计权限和文件操作范围。",
      false,
    ],
  ],
};
export function getDeploymentRanking(
  profile: DeploymentProfile,
  use: ProjectUse,
): DeploymentChoice[] {
  const rows = rankingRows[profile].map(
    ([platformId, tier, reason, tradeoff, compatible]) => ({
      platformId,
      tier,
      reason,
      tradeoff,
      compatible,
    }),
  );
  for (const p of platforms) {
    const fit = platformFits[p.id];
    if (
      p.availability === "listed" &&
      fit?.profiles.includes(profile) &&
      !rows.some((r) => r.platformId === p.id)
    )
      rows.push({
        platformId: p.id,
        tier: fit.tier,
        reason: fit.reason,
        tradeoff: fit.tradeoff,
        compatible: true,
      });
  }
  for (const row of rows) {
    if (row.platformId === "cloud-7")
      row.tradeoff =
        "普通 Gradio / Docker Space 创建需付费计划；符合条件的免费个人账号最多 2 个 ZeroGPU Gradio Space。CPU Basic 无小时费用不等于无需付费账号。";
    if (row.platformId === "cloud-11")
      row.tradeoff += " Free 每月 $1 额度可能不足，正式 Free 不包含 Cron。";
  }
  if (use === "commercial") {
    for (const r of rows) {
      if (r.platformId === "cloud-0" && r.compatible) {
        r.tradeoff =
          "商业项目不能使用 Hobby。需选择允许商用的 Vercel 付费方案并确认预算。";
        if (profile === "next") {
          r.tier = "顶级";
          r.reason = "Next.js 集成仍然省步骤，但商业项目需要承担对应方案费用。";
        } else r.tier = "NPC";
      }
      if (r.platformId === "cloud-4" && r.compatible) {
        r.tier = "拉完了";
        r.compatible = false;
        r.reason =
          "GitHub Pages 不面向在线业务、电商或商业 SaaS 托管；本次商业用途不把它作为默认部署落点。";
        r.tradeoff =
          "个人或开源文档可以另行评估，商业站请选择明确支持该用途的平台。";
      }
    }
    if (profile === "next") {
      const cf = rows.find((r) => r.platformId === "cloud-1")!;
      cf.tier = "夯暴了";
      cf.reason =
        "商业 Next.js 项目若能通过适配验证，Workers 可组合静态资源与服务端用量，适合先控制资源成本。";
      cf.tradeoff =
        "不是零配置：先验证 OpenNext 和依赖兼容；Free 10 ms CPU 可能不足以处理动态页面，可能需要 Workers 付费方案。若更重视少配置，可选 Vercel 商用方案。";
    }
  }
  return rows
    .filter((r) =>
      platforms.some(
        (p) => p.id === r.platformId && p.availability === "listed",
      ),
    )
    .sort((a, b) => tiers.indexOf(a.tier) - tiers.indexOf(b.tier));
}
export function getRecommendedPlatform(
  profile: DeploymentProfile,
  use: ProjectUse,
) {
  return getDeploymentRanking(profile, use).find(
    (r) => r.compatible && platforms.some((p) => p.id === r.platformId),
  )!;
}
