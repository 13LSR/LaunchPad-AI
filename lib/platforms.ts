import reviews from "./platform-reviews.json";
import databaseGuides from "./database-guides.json";
export type Platform = {
  useCases?: string[];
  setupHint?: string;
  scenarioIds?: string[];
  cloudIds?: string[];
  checkedAt: string;
  availability: "listed" | "unconfirmed" | "retiring" | "unavailable";
  availabilityNote: string;
  id: string;
  name: string;
  kind: "cloud" | "database";
  category: string;
  tags: string[];
  description: string;
  allowance: string;
  limit: string;
  url: string;
  source: string;
  verified: boolean;
  plan: "免费额度" | "试用 / 付费" | "待复核";
  mark: string;
  color: string;
};
type Row = [
  string,
  string,
  string[],
  string,
  string,
  string,
  string,
  string,
  boolean,
  string?,
];
const cloud: Row[] = [
  [
    "Vercel",
    "全栈 / 前端",
    ["Next.js", "React", "Nuxt", "静态网站"],
    "Next.js 的顺手搭档，Git 推送即可触发构建与预览。",
    "Hobby：100 GB 数据传输 / 月",
    "仅个人非商业用途。服务端函数有资源和时长限制，不能直接当作常驻服务器。",
    "https://vercel.com",
    "https://vercel.com/docs/plans/hobby",
    true,
    "▲",
  ],
  [
    "Cloudflare Workers",
    "边缘计算",
    ["TypeScript", "Hono", "Next.js", "静态网站"],
    "从静态网站到边缘 API，连接 D1、KV 和 R2 的轻量部署组合。",
    "动态请求 100,000 次 / 天",
    "Free 每次调用 10 ms CPU；静态资源请求免费且不限量。Next.js 需框架适配，检查兼容功能。",
    "https://workers.cloudflare.com",
    "https://developers.cloudflare.com/workers/platform/pricing/",
    true,
    "☁",
  ],
  [
    "Netlify",
    "全栈 / 前端",
    ["React", "Vue", "Astro", "Next.js"],
    "支持分支预览与函数，把前端仓库快速发布到全球 CDN。",
    "Free：300 credits / 月",
    "构建发布、带宽、请求与计算共享 credits。旧版流量和构建额度不适用于所有账户。",
    "https://www.netlify.com",
    "https://www.netlify.com/pricing/",
    true,
    "N",
  ],
  [
    "Cloudflare Pages",
    "静态网站",
    ["Astro", "Vite", "Vue", "静态网站"],
    "适合静态内容站和现有 Pages 项目；函数按 Workers 计量。",
    "Free：500 次构建 / 月",
    "单文件大小与文件数受限。新全栈项目同时评估 Workers。",
    "https://pages.cloudflare.com",
    "https://developers.cloudflare.com/pages/platform/limits/",
    true,
    "P",
  ],
  [
    "GitHub Pages",
    "静态网站",
    ["HTML", "Jekyll", "Vite", "静态网站"],
    "从 GitHub 仓库发布博客、文档或作品集。",
    "查看官方 Pages 使用限制",
    "只托管静态输出，不运行 Python、Java 或 Next.js 服务端；遵守站点使用限制。",
    "https://pages.github.com",
    "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits",
    false,
    "G",
  ],
  [
    "Deno Deploy",
    "边缘计算",
    ["TypeScript", "JavaScript", "Deno"],
    "以 Deno 为核心的 JavaScript / TypeScript 云运行环境。",
    "Free：100 万请求 / 月",
    "带宽、CPU 和内存另有限额；检查目标项目的运行时兼容性。",
    "https://deno.com/deploy",
    "https://deno.com/deploy/pricing",
    true,
    "D",
  ],
  [
    "Streamlit Community Cloud",
    "Python / AI",
    ["Python", "Streamlit"],
    "从 GitHub 发布交互式数据应用，适合分析看板和教学演示。",
    "官方提供免费社区托管",
    "面向 Streamlit 应用；存在资源与休眠约束，不是通用 Python 容器。",
    "https://streamlit.io/cloud",
    "https://docs.streamlit.io/deploy/streamlit-community-cloud",
    true,
    "S",
  ],
  [
    "Hugging Face Spaces",
    "Python / AI",
    ["Python", "Gradio", "Docker"],
    "发布模型演示与 Gradio 应用，也支持 Docker Spaces。",
    "当前免费硬件与休眠规则待复核",
    "付费 GPU 与持久化存储单独计费。磁盘持久性和容器端口须按官方文档配置。",
    "https://huggingface.co/spaces",
    "https://huggingface.co/docs/hub/spaces-overview",
    false,
    "H",
  ],
  [
    "PythonAnywhere",
    "Python / AI",
    ["Python", "Flask", "Django"],
    "在浏览器中管理 Python 代码和 Web 应用，适合轻量入门。",
    "Limited 免费账户：1 个 Web 应用",
    "免费账户网络访问、CPU 与磁盘受限；非任意 Docker 运行环境。",
    "https://www.pythonanywhere.com",
    "https://www.pythonanywhere.com/pricing/",
    true,
    "Py",
  ],
  [
    "Render",
    "容器 / 后端",
    ["Python", "Node.js", "Java", "Go", "Docker"],
    "支持 Web 服务、静态站与多种后端语言。",
    "免费实例与时数待复核",
    "免费服务可能休眠；本地文件系统不作为持久数据库。上线前复核实例规格。",
    "https://render.com",
    "https://render.com/docs/free",
    false,
    "R",
  ],
  [
    "Koyeb",
    "容器 / 后端",
    ["Docker", "Python", "Go", "Node.js"],
    "通过 Git 或容器镜像部署 Web 服务。",
    "1 个 Free 实例：512 MB RAM",
    "0.1 vCPU、2 GB SSD；官方明确用于测试与个人项目，不建议用于生产。",
    "https://www.koyeb.com",
    "https://www.koyeb.com/docs/reference/instances",
    true,
    "K",
  ],
  [
    "Railway",
    "容器 / 后端",
    ["Docker", "Node.js", "Python", "Java"],
    "项目化管理应用、数据库与环境变量。",
    "试用与持续使用费用待复核",
    "不承诺长期免费。数据库卷、网络和计算分别纳入费用考量。",
    "https://railway.com",
    "https://railway.com/pricing",
    false,
    "R",
  ],
  [
    "Fly.io",
    "容器 / 后端",
    ["Docker", "Go", "Rust", "Python"],
    "以 Machines 为单位运行容器，支持多区域部署。",
    "按用量计费；试用条件待复核",
    "不要将历史免费额度理解为新账户默认方案。持久卷与公网地址可能计费。",
    "https://fly.io",
    "https://fly.io/docs/about/pricing/",
    false,
    "F",
  ],
  [
    "Zeabur",
    "容器 / 后端",
    ["Docker", "Node.js", "Python"],
    "把代码和多项服务放在同一个项目中管理。",
    "方案与免费试用待复核",
    "托管资源与自有服务器方案不同；先确认账单和地区。",
    "https://zeabur.com",
    "https://zeabur.com/pricing",
    false,
    "Z",
  ],
  [
    "Google Cloud Run",
    "容器 / 后端",
    ["Docker", "Python", "Java", "Go"],
    "请求驱动的容器托管，可缩容到零。",
    "地区与计费方式相关额度待复核",
    "需计费账户；构建、制品存储和出站流量可能产生独立费用。",
    "https://cloud.google.com/run",
    "https://cloud.google.com/run/pricing",
    false,
    "G",
  ],
  [
    "AWS Free Tier",
    "云服务器",
    ["Docker", "Node.js", "Python", "Java"],
    "云服务组合，适合需要更多基础设施控制的项目。",
    "新用户最多 $200 credits / 6 个月",
    "当前新账户 Free Plan 为限期计划；额度来自注册和指定活动，不等于所有服务永久免费。",
    "https://aws.amazon.com/free/",
    "https://aws.amazon.com/free/",
    true,
    "aws",
  ],
  [
    "Oracle Cloud",
    "云服务器",
    ["Linux", "Docker", "Java", "Python"],
    "虚拟机与数据库服务，需要自行管理运行环境。",
    "Always Free 资格与可用容量待复核",
    "区域容量、账户审核和闲置回收规则影响可用性。",
    "https://www.oracle.com/cloud/free/",
    "https://www.oracle.com/cloud/free/",
    false,
    "O",
  ],
  [
    "EdgeOne Makers / Pages",
    "全栈 / 前端",
    ["React", "Vue", "静态网站"],
    "腾讯 EdgeOne 的网站与应用部署平台，Pages 入口已扩展到 Makers。",
    "官网提供 Free Plan",
    "具体函数与存储额度以账户计划为准；中国大陆加速需确认域名与备案条件。",
    "https://edgeone.ai/products/pages",
    "https://edgeone.ai/products/pages",
    true,
    "E",
  ],
  [
    "阿里云 ESA Pages",
    "全栈 / 前端",
    ["JavaScript", "静态网站"],
    "边缘站点与函数部署入口，适合阿里云生态项目。",
    "套餐与区域条件待复核",
    "确认全栈框架适配、函数限制与域名要求。",
    "https://www.aliyun.com/product/esa",
    "https://www.aliyun.com/product/esa",
    false,
    "A",
  ],
  [
    "ClawCloud Run",
    "容器 / 后端",
    ["Docker", "Node.js", "Python"],
    "面向应用的容器化部署与服务管理。",
    "账户资格与试用额度待复核",
    "免费资格随注册方式和活动变化；不要把推广额度当成长期承诺。",
    "https://run.claw.cloud",
    "https://run.claw.cloud",
    false,
    "C",
  ],
  [
    "Sealos",
    "容器 / 后端",
    ["Docker", "Python", "Java"],
    "集成应用、数据库与容器管理的云开发环境。",
    "地区与活动额度待复核",
    "确认所在区域的价格、存储和资源释放策略。",
    "https://sealos.io",
    "https://sealos.io/pricing",
    false,
    "S",
  ],
];
cloud.push([
  "腾讯云 CloudBase / 微信云开发",
  "小程序后端",
  ["微信小程序", "云函数", "数据库", "云存储"],
  "为小程序与应用提供云函数、身份接入、数据库和文件存储；客户端仍需单独发布。",
  "套餐与试用条件以云开发控制台为准",
  "不承诺长期免费；小程序 AppID、类目、隐私声明、备案与审核按微信要求准备。",
  "https://cloudbase.net/",
  "https://docs.cloudbase.net/",
  false,
  "CB",
]);
const colors = [
  "neutral",
  "orange",
  "teal",
  "orange",
  "neutral",
  "neutral",
  "red",
  "yellow",
  "blue",
  "violet",
  "teal",
];
function make(rows: Row[], kind: Platform["kind"]): Platform[] {
  return rows.map((r, i) => ({
    checkedAt: "2026-11-08",
    availability: "listed",
    availabilityNote: "",
    id: kind + "-" + i,
    name: r[0],
    kind,
    category: r[1],
    tags: r[2],
    description: r[3],
    allowance: r[4],
    limit: r[5],
    url: r[6],
    source: r[7],
    verified: r[8],
    plan:
      r[0] === "AWS Free Tier" ? "试用 / 付费" : r[8] ? "免费额度" : "待复核",
    mark: r[9] || r[0][0],
    color:
      kind === "cloud"
        ? colors[i % colors.length]
        : ["green", "green", "orange", "teal", "red"][i % 5],
  }));
}
type Review = {
  checkedAt: string;
  availability: Platform["availability"];
  availabilityNote: string;
  quotaVerified: boolean;
  source: string;
  allowance?: string;
  limit?: string;
};
export const platforms: Platform[] = make(cloud, "cloud").map((p) => {
  const r = (reviews as Record<string, Review>)[p.id];
  return {
    ...p,
    checkedAt: r.checkedAt,
    availability: r.availability,
    availabilityNote: r.availabilityNote,
    verified: r.quotaVerified,
    source: r.source,
    allowance: r.allowance || p.allowance,
    limit: r.limit || p.limit,
    plan: ["cloud-7", "cloud-12", "cloud-15", "cloud-20", "cloud-21"].includes(
      p.id,
    )
      ? "试用 / 付费"
      : r.quotaVerified
        ? "免费额度"
        : "待复核",
  };
});
export const availablePlatforms = platforms.filter(
  (p) => p.availability === "listed",
);
export const withdrawnPlatforms = platforms.filter(
  (p) => p.availability !== "listed",
);
export const databases: Platform[] = databaseGuides.map((d, i) => ({
  ...d,
  id: "database-" + i,
  kind: "database",
  checkedAt: "2026-11-09",
  availability: "listed",
  availabilityNote: "",
  verified: true,
  plan: d.plan === "试用 / 付费" ? "试用 / 付费" : "免费额度",
  url: d.source,
  mark: [
    "N",
    "S",
    "D1",
    "T",
    "Ti",
    "A",
    "Fi",
    "M",
    "F",
    "U",
    "KV",
    "R",
    "P",
    "Q",
    "Z",
    "R2",
    "UT",
    "C",
    "B2",
    "CB",
  ][i],
  color: ["green", "green", "orange", "teal", "red"][i % 5],
}));
export const allPlatforms = [...platforms, ...databases];
