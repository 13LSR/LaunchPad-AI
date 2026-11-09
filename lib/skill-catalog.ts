import guides from "./skill-guides.json";

export type Extension = {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  kind: "Skill" | "MCP" | "CLI" | "Workflow" | "Rules" | "Plugin";
  description: string;
  fit: string;
  compatibility: string;
  setup: string;
  cost: string;
  access: string;
  limit: string;
  example: string;
  verification: string;
  docs: string;
  repo: string;
  repoUrl: string;
  license: string;
  related: { label: string; href: string }[];
};

export const skills = guides as Extension[];
export const extensionKinds = {
  Skill: "方法技能包 · Skill",
  MCP: "连接外部工具 · MCP",
  CLI: "终端工具 · CLI",
  Workflow: "开发工作流",
  Rules: "项目规则",
  Plugin: "插件组合包",
} as const;
export const agentChoices = {
  unknown: "还不确定",
  codex: "Codex",
  claude: "Claude Code",
  cursor: "Cursor",
  copilot: "VS Code / GitHub Copilot",
  web: "ChatGPT / Claude 网页聊天",
  other: "其他编程工具",
} as const;
export const systemChoices = {
  auto: "让 AI 识别",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
} as const;
export type InstallPreferences = {
  agent: keyof typeof agentChoices;
  customAgent: string;
  system: keyof typeof systemChoices;
  scope: "project" | "global";
};
export const defaultInstallPreferences: InstallPreferences = {
  agent: "unknown",
  customAgent: "",
  system: "auto",
  scope: "project",
};

// Keep original IDs stable so existing search links continue to work.
const first = [14, 4, 8, 16, 15, 17].map((i) => "skills-resource-" + i);
export const orderedSkills = [
  ...first.map((id) => skills.find((skill) => skill.id === id)!),
  ...skills.filter((skill) => !first.includes(skill.id)),
];

export function skillSearchText(skill: Extension) {
  return [
    skill.name,
    ...skill.aliases,
    skill.category,
    extensionKinds[skill.kind],
    skill.description,
    skill.fit,
    skill.compatibility,
    skill.example,
  ].join(" ");
}
export function filterSkills(query: string, category: string, kind: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return orderedSkills.filter(
    (skill) =>
      (category === "全部" || skill.category === category) &&
      (kind === "all" || skill.kind === kind) &&
      words.every((word) =>
        skillSearchText(skill).toLocaleLowerCase().includes(word),
      ),
  );
}

export function buildInstallTask(
  skill: Extension,
  preferences: InstallPreferences = defaultInstallPreferences,
) {
  const agent =
    preferences.agent === "other"
      ? preferences.customAgent.trim() || "其他编程工具，名称待我提供"
      : agentChoices[preferences.agent];
  const clientInstruction =
    preferences.agent === "web"
      ? "我目前使用聊天网页。先确认它是否提供该扩展所需的连接器或自定义技能入口；不要假定网页能读写本地项目或运行终端。若不支持，说明需要换到哪种编程工具，不要假装已经安装。"
      : preferences.agent === "unknown" ||
          (preferences.agent === "other" && !preferences.customAgent.trim())
        ? "先向我确认正在使用的 AI 工具与版本，说明在哪里查看；不要猜测配置目录或直接执行别的工具的安装命令。"
        : "先检查这个工具的版本和扩展能力，按它自己的官方方式安装，不照搬其他工具的配置文件。";
  const scope =
    preferences.scope === "project"
      ? "优先仅当前项目；如果该工具只能全局安装，先解释影响，让我选择，不要自动改成全局。"
      : "我的所有项目；先解释全局配置位置与影响范围，保留已有配置，不覆盖同名扩展。";
  return `我是非程序员，请协助我安装并验证 ${skill.name}。

Agent 名称：${agent}
电脑系统：${systemChoices[preferences.system]}
安装范围：${scope}
官方安装说明：${skill.docs}
官方源码：${skill.repoUrl}
扩展形式：${extensionKinds[skill.kind]}
用途：${skill.fit}

${clientInstruction}
兼容条件：${skill.compatibility}
准备事项：${skill.setup}
账号与费用：${skill.cost}
访问范围：${skill.access}
能力边界：${skill.limit}
使用许可：${skill.license}

请按以下顺序完成：
1. 阅读当前官方说明，检查已经安装的同类能力。已有能力足够就先验证它，不重复安装。只装当前任务所需的扩展或子技能。
2. 核对系统、依赖与安装范围，说明将增加或修改哪些文件。保留现有配置，先读安装脚本内容。需要登录时由我操作；密钥只放在工具的凭据配置中，不让我粘贴进聊天或提交到代码仓库。
3. 按这个 AI 工具的真实安装方式执行。需要我操作时，一行一条命令，说明在哪里运行、作用和成功表现；设置界面则给出具体入口。暂时不能安装要说明原因，不假报成功。
4. 按官方方式重新加载或开启新会话，确认 AI 能发现该技能或工具。使用下面的小任务验证，给出实际结果和失败原因。
试用任务：${skill.example}
通过标准：${skill.verification}
5. 告诉我平时怎样调用、如何停用或卸载。配置位置与内容分别说明，只移除这次新增项。连接云账号不等于允许创建收费资源、改生产数据或公开发布，这些操作需要单独说明影响并确认。`;
}

export function buildSkillTrial(skill: Extension) {
  return `请先确认你已能使用 ${skill.name}；如果尚未安装或无法调用，明确说明缺少什么，不要声称已用该扩展完成任务。

${skill.example}

检查是否完成：${skill.verification}
能力边界：${skill.limit}
官方说明：${skill.docs}

需要具体网址、项目路径或测试文件时先向我获取。请报告实际调用与检查结果。`;
}
