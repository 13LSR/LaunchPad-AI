"use client";
import { ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/copy-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cliWorkflows } from "@/lib/cli-workflows";
import { explainCliCommand } from "@/lib/cli-command-help";

export function CliCommands({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const workflow = cliWorkflows.find((item) => item.id === active)!;
  return (
    <>
      <Tabs value={active} onValueChange={onSelect}>
        <TabsList className="cli-command-tabs" aria-label="选择命令工具">
          {cliWorkflows.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div
        key={workflow.id}
        id={workflow.id}
        className="cli-workflow scroll-mt-24"
      >
        <p className="cli-workflow-description">{workflow.intro}</p>
        {workflow.steps.map((step) => (
          <details className="cli-step" key={step.title}>
            <summary>{step.title}</summary>
            {step.note && <p>{step.note}</p>}
            {step.code
              .split(/\r?\n/)
              .filter(Boolean)
              .map((line) => {
                const help = explainCliCommand(line);
                return (
                  <div key={line} className="cli-command-line">
                    <p>{help?.purpose}</p>
                    <CodeBlock
                      title="在项目目录执行 · 单独复制这一行"
                      code={line}
                    />
                    <p className="cli-command-success">
                      <strong>执行后看这里：</strong>
                      {help?.success}
                    </p>
                  </div>
                );
              })}
          </details>
        ))}
        <a
          className="source-link"
          href={workflow.url}
          target="_blank"
          rel="noreferrer"
        >
          查看 {workflow.name} 官方操作说明 <ExternalLink size={12} />
        </a>
        {workflow.id === "cli-github" && (
          <a
            className="source-link"
            href="https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site"
            target="_blank"
            rel="noreferrer"
          >
            继续配置 GitHub Pages 网站发布 <ExternalLink size={12} />
          </a>
        )}
      </div>
    </>
  );
}
