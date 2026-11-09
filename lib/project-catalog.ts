import guides from "./project-guides.json";

export type Project = {
  id: string;
  name: string;
  repo: string;
  repoUrl: string;
  category: string;
  description: string;
  tags: string[];
  level: "easy" | "setup" | "advanced";
  hosting: "static" | "web" | "server" | "multi" | "local";
  deployment: string;
  dataNeeds: string;
  cost: string;
  adaptation: string;
  acceptance: string;
  docs: string;
  license: string;
  licenseUrl: string;
  localId: string;
  cloudIds: string[];
  scenarioId?: string;
  startMode: "fork" | "starter" | "install";
  quickDeploy?: { label: string; url: string };
};

// IDs preserve existing search links. Display order can change independently.
export const projects = guides as Project[];
export const projectLevels = {
  easy: "新手先试",
  setup: "需要配置",
  advanced: "进阶项目",
} as const;
export const hostingLabels = {
  static: "静态网站 · 通常不用数据库",
  web: "网站应用 · 按功能接服务",
  server: "常驻服务 · 需要持续运行",
  multi: "多项服务 · 需要一起部署",
  local: "本地优先 · 同步再上云",
} as const;
const startingIds = [19, 18, 11, 13, 20, 6].map(
  (i) => "projects-resource-" + i,
);
export const orderedProjects = [
  ...startingIds.map((id) => projects.find((p) => p.id === id)!),
  ...projects.filter((p) => !startingIds.includes(p.id)),
];

export function projectSearchText(project: Project) {
  return [
    project.name,
    project.category,
    project.description,
    ...project.tags,
    project.adaptation,
    project.deployment,
    project.dataNeeds,
    projectLevels[project.level],
  ].join(" ");
}

export function filterProjects(query: string, category: string, level: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return orderedProjects.filter(
    (project) =>
      (category === "全部" || project.category === category) &&
      (level === "all" || project.level === level) &&
      words.every((word) =>
        projectSearchText(project).toLocaleLowerCase().includes(word),
      ),
  );
}

export function buildAdaptationPrompt(project: Project, goal = "") {
  const start = {
    fork: "先阅读源码仓库，检查我是否已有项目副本；需要修改源码时使用我自己的副本，不覆盖原有工作。",
    starter:
      "这是框架或模板入口。按官方入门方式创建实际站点，不要直接把框架仓库当成网站部署。",
    install:
      "先判断能否用官方现成版本完成我的目标；仅在确实需要改源码时再创建项目副本。",
  }[project.startMode];
  return `我是非程序员，请帮我使用并改造 ${project.name}。

官方源码：${project.repoUrl}
安装与部署说明：${project.docs}
项目许可：${project.license}（${project.licenseUrl}）
我的目标：${goal.trim() || project.adaptation}

请先用当前官方文档确认以下项目情况：
- 运行方式：${project.deployment}
- 数据保存：${project.dataNeeds}
- 费用来源：${project.cost}

请按以下方式带我完成：
1. ${start} 阅读 README、LICENSE、依赖和配置示例，说明哪些功能已具备、哪些要新增，以及改造和对外提供服务需要遵守的许可。
2. 先跑通原版。检查我的系统与所需工具版本；每条命令单独列出，写清在哪个目录执行、作用、成功后看到什么。不使用其他技术栈的通用命令代替项目实际命令。
3. 围绕我的目标先完成一个最小版本，保留原有可用功能。需要账号、数据库、文件存储、邮件或模型 API 时，分别解释用途；提供不含真实密钥的配置示例。不要把密钥放到前端或提交到仓库。
4. 上云前先安排数据保存和备份，再选兼容的部署平台。区分免费额度、试用额度和持续费用；需要常驻或持久磁盘的服务不放到临时文件系统上。创建收费资源、迁移或删除远程数据、公开发布前先说明影响并让我确认。
5. 至少完成这项原有能力检查：${project.acceptance} 另外为我的改造目标补充验收步骤。检查手机使用、访问权限与错误提示，告诉我访问地址、停止运行和恢复到可用版本的方法。`;
}
