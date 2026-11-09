import { DataDecision } from "@/components/data-decision";
import { DatabaseCatalog } from "@/components/database-catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { modules } from "@/lib/data";
import { guideContent } from "@/lib/guide-content";
import { GuideSections } from "@/components/guide-sections";
import { CloudCatalog } from "@/components/cloud-catalog";
import { PromptGenerator } from "@/components/prompt-generator";
import { CommandCheatsheet } from "@/components/command-cheatsheet";
import { ProjectCatalog } from "@/components/project-catalog";
import { ResourceCatalog } from "@/components/resource-catalog";
import { CliGuide } from "@/components/cli-guide";
import { MediaGuide } from "@/components/media-guide";
export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = modules.find((m) => m.slug === slug);
  return {
    title: m?.title || "未找到内容",
    description: m ? guideContent[m.slug].intro : undefined,
  };
}
export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = modules.find((m) => m.slug === slug);
  if (!m) notFound();
  const g = guideContent[m.slug];
  return (
    <>
      <header className="module-header">
        <h1>{m.title}</h1>
        <p>{g.intro}</p>
        <div className="guide-outcome">
          <Check size={17} />
          <span>{g.outcome}</span>
        </div>
        {g.before.length > 0 && (
          <a className="guide-tool-jump" href="#module-tools">
            直接打开
            {m.slug === "local"
              ? "命令速查"
              : m.slug === "cloud"
                ? "平台列表"
                : m.slug === "databases"
                  ? "数据服务列表"
                  : m.slug === "projects"
                    ? "项目列表"
                    : m.slug === "skills"
                      ? "扩展列表"
                      : "上线任务"}
            <ArrowRight size={15} />
          </a>
        )}
      </header>
      <GuideSections
        sections={g.before}
        collapsible={
          slug === "local" ||
          slug === "cloud" ||
          slug === "cli" ||
          slug === "projects" ||
          slug === "databases" ||
          slug === "skills"
        }
      />
      <section id="module-tools" className="guide-tool-section">
        <h2>{g.toolTitle}</h2>
        <p className="guide-tool-description">{g.toolDescription}</p>
        {slug === "cloud" ? (
          <CloudCatalog />
        ) : slug === "databases" ? (
          <DatabaseCatalog />
        ) : slug === "prompts" ? (
          <PromptGenerator />
        ) : slug === "local" ? (
          <CommandCheatsheet />
        ) : slug === "projects" ? (
          <ProjectCatalog />
        ) : slug === "skills" ? (
          <ResourceCatalog />
        ) : slug === "cli" ? (
          <CliGuide />
        ) : slug === "media" ? (
          <MediaGuide />
        ) : (
          <GuideSections sections={g.toolSections || []} />
        )}
      </section>
      {slug === "local" && <DataDecision />}
      <GuideSections
        sections={g.after}
        collapsible={
          slug === "local" ||
          slug === "cloud" ||
          slug === "cli" ||
          slug === "prompts" ||
          slug === "projects" ||
          slug === "databases" ||
          slug === "skills" ||
          slug === "media"
        }
      />
      <Link className="guide-next" href={"/guide/" + g.next.slug}>
        <div>
          <span>下一步</span>
          <strong>{g.next.label}</strong>
        </div>
        <ArrowRight size={22} />
      </Link>
    </>
  );
}
