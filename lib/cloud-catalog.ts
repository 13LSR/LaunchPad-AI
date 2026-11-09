import { availablePlatforms, type Platform } from "./platforms";
import { cloudGuides } from "./cloud-guides";
import { platformFits } from "./platform-fit";
import {
  getDeploymentRanking,
  type DeploymentChoice,
} from "./deployment-ranking";
import type { DeploymentProfile } from "./prompt-data";
import type { DeploymentTaskAnswers } from "./deployment-task";

export const cloudNeeds = [
  {
    id: "unknown",
    label: "不知道项目是哪一种",
    note: "先让 AI 看实际项目，确认网页、后端和数据分别是什么；不凭名称猜平台。",
  },
  {
    id: "static",
    label: "展示网页 / 浏览器工具（静态文件）",
    profile: "static",
    note: "适合已生成网页文件的作品集、文档和浏览器工具。有表单保存、登录或私密 API Key 时，还需要后端。",
  },
  {
    id: "next",
    label: "Next.js 网站（含服务端功能）",
    profile: "next",
    note: "React 不等于 Next.js。先看项目是否使用 Next.js，再确认服务端功能、框架适配和数据服务。",
  },
  {
    id: "python",
    label: "Python 接口（FastAPI 等）",
    profile: "python",
    note: "这是处理请求的后端，需要支持 Python 进程或容器的平台；前端可能要单独发布。",
  },
  {
    id: "flask",
    label: "Python 网站（Flask / Django）",
    note: "沿用项目的 Python 环境与实际启动方式；不要为了免费平台重新换框架。",
  },
  {
    id: "streamlit",
    label: "Streamlit 数据看板",
    profile: "streamlit",
    note: "适合分析和演示；对外使用前检查数据隐私、内存与休眠是否能接受。",
  },
  {
    id: "gradio",
    label: "Gradio / 模型交互演示",
    profile: "gradio",
    note: "模型所需内存和 GPU 决定成本；能运行网页不等于有足够算力运行模型。",
  },
  {
    id: "container",
    label: "已有 Docker / Java / Go 等后端",
    profile: "container",
    note: "先确认 Dockerfile、内存、端口与磁盘持久性，再选能够运行完整服务的平台。",
  },
  {
    id: "edge",
    label: "轻量 JavaScript / TypeScript 接口",
    profile: "edge",
    note: "短时接口可考虑边缘函数；依赖操作系统、原生模块或长任务时需要重新确认兼容性。",
  },
  {
    id: "automation",
    label: "离开电脑后仍自动执行的任务",
    profile: "automation",
    note: "需要真正的定时调度与执行环境；免费方案可能没有 Cron，长任务也不能硬塞进短时函数。",
  },
  {
    id: "wechat",
    label: "微信小程序的后端",
    profile: "wechat",
    note: "小程序前端通过微信开发者工具与平台审核发布；这里选择云函数、接口和数据的运行位置。",
  },
  {
    id: "client",
    label: "手机 / 桌面应用或浏览器扩展",
    note: "客户端需要打包或上架，云平台不能代替这一步。若有后端，请按后端实际技术重新选择。",
  },
  {
    id: "offline",
    label: "只在自己电脑使用的工具",
    note: "可以先不上云。需要分享文件、安装包或让别人运行时，再考虑对应的交付方式。",
  },
] as const satisfies readonly {
  id: string;
  label: string;
  note: string;
  profile?: DeploymentProfile;
}[];
export type CloudNeed = (typeof cloudNeeds)[number]["id"];
export type CloudContext = {
  need: CloudNeed;
  purpose: "unknown" | "personal" | "commercial";
  budget: "free" | "review";
  data: DeploymentTaskAnswers["data"];
};
export const defaultCloudContext: CloudContext = {
  need: "unknown",
  purpose: "unknown",
  budget: "free",
  data: "unknown",
};
export const cloudCategories = [
  "全部",
  "全栈 / 前端",
  "静态网站",
  "边缘计算",
  "Python / AI",
  "容器 / 后端",
  "云服务器",
  "小程序后端",
];
export function hasRecurringCloudAllowance(id: string) {
  return cloudGuides[id]?.cost === "recurring";
}

export function cloudCandidates(context: CloudContext): DeploymentChoice[] {
  const need = cloudNeeds.find((item) => item.id === context.need)!;
  let choices: DeploymentChoice[] = [];
  if (context.need === "flask") {
    choices = [
      "cloud-8",
      "cloud-9",
      "cloud-11",
      "cloud-10",
      "cloud-14",
      "cloud-20",
    ].map((id) => ({
      platformId: id,
      tier: platformFits[id].tier,
      compatible: true,
      reason: platformFits[id].reason,
      tradeoff: platformFits[id].tradeoff,
    }));
  } else if ("profile" in need) {
    choices = getDeploymentRanking(
      need.profile,
      context.purpose === "personal" ? "personal" : "commercial",
    );
  }
  return choices.filter((choice) => {
    if (
      !choice.compatible ||
      !availablePlatforms.some((p) => p.id === choice.platformId)
    )
      return false;
    if (context.budget === "free") {
      if (!hasRecurringCloudAllowance(choice.platformId)) return false;
      if (choice.platformId === "cloud-0" && context.purpose !== "personal")
        return false;
      if (choice.platformId === "cloud-11" && context.need === "automation")
        return false;
      if (
        context.purpose === "commercial" &&
        ["cloud-10"].includes(choice.platformId)
      )
        return false;
    }
    return true;
  });
}

export function filterCloudPlatforms(
  query: string,
  category: string,
  recurringOnly: boolean,
  candidateIds?: string[],
): Platform[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filtered = availablePlatforms.filter((p) => {
    const text = [
      p.name,
      p.category,
      p.description,
      ...p.tags,
      ...platformFits[p.id].useCases,
      cloudGuides[p.id].costLabel,
      cloudGuides[p.id].start,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (category === "全部" || p.category === category) &&
      (!recurringOnly || hasRecurringCloudAllowance(p.id)) &&
      (!candidateIds || candidateIds.includes(p.id)) &&
      tokens.every((token) => text.includes(token))
    );
  });
  return candidateIds
    ? filtered.sort(
        (a, b) => candidateIds.indexOf(a.id) - candidateIds.indexOf(b.id),
      )
    : filtered;
}

export function cloudDeployHref(id: string, context: CloudContext) {
  const artifact =
    context.need === "wechat"
      ? "miniapp"
      : context.need === "automation" || context.need === "offline"
        ? "script"
        : context.need === "client"
          ? "app"
          : context.need === "unknown"
            ? "unknown"
            : "website";
  const params = new URLSearchParams({
    artifact,
    purpose: context.purpose,
    budget: context.budget,
    data: context.data,
  });
  return `/guide/cli?${params.toString()}#deploy-${id}`;
}

export function buildCloudSelectionTask(
  context: CloudContext,
  ids: string[] = [],
) {
  const need = cloudNeeds.find((item) => item.id === context.need)!;
  const selected = ids
    .map((id) => availablePlatforms.find((p) => p.id === id))
    .filter((p): p is Platform => Boolean(p));
  return [
    "我不懂编程，请帮我为当前项目选择部署方式，先检查再决定。若你不能读取本地项目，先告诉我需要提供哪些不含密钥的文件片段，不要假装已经检查。",
    "项目方向：" + need.label + "。" + need.note,
    "用途：" +
      {
        unknown: "尚不确定，先确认是否涉及接单、收费或企业业务。",
        personal: "个人非商业作品。",
        commercial: "商业用途，需要套餐明确允许。",
      }[context.purpose],
    "预算：" +
      (context.budget === "free"
        ? "优先有持续免费额度的方案；不要把限期试用当长期免费。若做不到，说明费用与差距，等我决定。"
        : "可以考虑付费，但先解释币种、固定费、按量费和停止计费的方法。"),
    "数据情况：" +
      {
        unknown: "不清楚，请识别登录、记录保存和文件上传。",
        none: "我认为不需要外部数据，请按代码确认。",
        needed: "需要但还没配置，先安排兼容的数据库和文件存储。",
        existing:
          "已有数据服务，请沿用并确认连接权限，不擅自换库、覆盖或迁移数据。",
      }[context.data],
    selected.length
      ? "我正在比较的候选：\n" +
        selected
          .map(
            (p) =>
              `${p.name}：${p.source}\n额度：${p.allowance}。限制：${p.limit}\n费用边界：${cloudGuides[p.id].billing}`,
          )
          .join("\n\n")
      : "还没有确定候选，请根据真实项目推荐最多三个。不要选已公告停运或当前入口不可用的平台。",
    "先识别框架版本、锁文件、构建/启动脚本、运行时、数据库与上传文件、长任务和 GPU 需求。现有项目优先兼容，不为了迎合平台重写技术栈。",
    "比较候选的实际运行能力、免费条件、商用、冷启动、资源上限、地区访问、超额行为，以及数据库/存储/模型 API 的独立费用。请阅读官方套餐与运营公告，用可理解的理由说明推荐与排除原因。",
    "给出一个推荐和一个备选、准确的部署设置、需要我注册或配置的项目、测试步骤与回退方式。小程序/客户端单独说明打包、预览或审核；仅本地使用的项目允许不上云。",
    "本次先给选型结论与准备步骤，不创建远程资源、不购买套餐、不发布正式版本，也不要索取或输出完整密钥。确认方案后再给我能交给 AI 执行的上线任务。",
  ].join("\n\n");
}
