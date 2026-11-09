import { modules, commandEntries, promptTemplates } from "@/lib/data";
import { availablePlatforms, databases } from "@/lib/platforms";
import { skills, skillSearchText } from "@/lib/skill-catalog";
import { projects, projectSearchText } from "@/lib/project-catalog";
import { guideContent } from "@/lib/guide-content";
import { cliWorkflows } from "@/lib/cli-workflows";
import { mediaKinds, mediaIssues } from "@/lib/media-guide";
export const searchItems = [
  ...modules.map((m) => ({
    id: m.slug,
    title: m.title,
    description: guideContent[m.slug].intro,
    module: "快速入口",
    href: "/guide/" + m.slug,
  })),
  ...mediaKinds.map((item) => ({
    id: `media-kind-${item.id}`,
    title: item.label + "怎么优化",
    description: item.example + " " + item.format + " " + item.reason,
    module: "媒体资产优化",
    href: "/guide/media#media-kind-" + item.id,
  })),
  ...mediaIssues.map((item) => ({
    id: `media-issue-${item.id}`,
    title: item.label,
    description: item.action + " " + item.advice,
    module: "媒体资产优化",
    href: "/guide/media#media-issue-" + item.id,
  })),
  ...[...availablePlatforms, ...databases].map((p) => ({
    id: p.id,
    title: p.name,
    description:
      p.tags.join(" ") +
      " " +
      p.description +
      " " +
      (p.useCases || []).join(" "),
    module: p.kind === "cloud" ? "云端部署平台" : "云数据库与存储",
    href: "/guide/" + (p.kind === "cloud" ? "cloud" : "databases") + "#" + p.id,
  })),
  ...commandEntries.map((e) => ({
    id: e.id,
    title: e.title,
    description:
      e.feature +
      " " +
      e.description +
      " " +
      e.useCases.join(" ") +
      " " +
      e.issues.map((i) => i.symptom).join(" "),
    module: "本地运行命令",
    href: "/guide/local#" + e.id,
  })),
  ...promptTemplates.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description + " " + t.stack,
    module: "AI 启动器场景",
    href: "/guide/prompts#" + t.id,
  })),
  ...projects.map((project) => ({
    id: project.id,
    title: project.name,
    description: projectSearchText(project),
    module: "开源项目",
    href: "/guide/projects#" + project.id,
  })),
  ...skills.map((resource) => ({
    id: resource.id,
    title: resource.name,
    description: skillSearchText(resource),
    module: "AI 技能与扩展",
    href: "/guide/skills#" + resource.id,
  })),
  ...cliWorkflows.map((w) => ({
    id: w.id,
    title: w.name + " 终端操作",
    description: w.intro + " " + w.steps.map((s) => s.title).join(" "),
    module: "Agent 自动部署",
    href: "/guide/cli#" + w.id,
  })),
  ...modules.flatMap((m) =>
    [
      ...guideContent[m.slug].before,
      ...(guideContent[m.slug].toolSections || []),
      ...guideContent[m.slug].after,
    ].map((s) => ({
      id: s.id,
      title: s.title,
      description: [
        ...(s.paragraphs || []),
        ...(s.steps || []).map((x) => x.title + " " + x.body),
        ...(s.items || []).map((x) => x.title + " " + (x.body || "")),
        ...(s.table?.rows || []).map((x) => x.join(" ")),
      ].join(" "),
      module: m.title,
      href: "/guide/" + m.slug + "#" + s.id,
    })),
  ),
];
