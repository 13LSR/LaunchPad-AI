"use client";

import "./project-catalog.css";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  projects,
  orderedProjects,
  projectLevels,
  hostingLabels,
  filterProjects,
  buildAdaptationPrompt,
  type Project,
} from "@/lib/project-catalog";
import { availablePlatforms } from "@/lib/platforms";
import { useHashTarget } from "@/components/use-hash-target";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const pageSize = 6;
const categories = [...new Set(projects.map((project) => project.category))];

export function ProjectCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [goal, setGoal] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const matched = filterProjects(query, category, level);
  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
  const visible = matched.slice(page * pageSize, (page + 1) * pageSize);
  const filtered = !!query || category !== "全部" || level !== "all";

  function resetFilters() {
    setQuery("");
    setCategory("全部");
    setLevel("all");
    setPage(0);
  }
  useHashTarget((id) => {
    const index = orderedProjects.findIndex((project) => project.id === id);
    if (index < 0) return;
    resetFilters();
    setPage(Math.floor(index / pageSize));
  });
  function changePage(next: number) {
    setPage(next);
    resultHeading.current?.focus({ preventScroll: true });
    resultHeading.current?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
  }

  return (
    <div className="project-catalog">
      <div className="project-filters">
        <div className="project-search-row">
          <label className="project-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              aria-label="搜索开源项目"
              placeholder="想做什么？试试博客、食谱、问卷…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
            />
          </label>
          <label className="project-level-select">
            <SlidersHorizontal size={16} aria-hidden="true" />
            <select
              aria-label="上手难度"
              value={level}
              onChange={(event) => {
                setLevel(event.target.value);
                setPage(0);
              }}
            >
              <option value="all">全部难度</option>
              {Object.entries(projectLevels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div
          className="project-category-filter"
          role="group"
          aria-label="按用途筛选"
        >
          {["全部", ...categories].map((value) => (
            <button
              className={
                "filter-button " + (category === value ? "active" : "")
              }
              key={value}
              aria-pressed={category === value}
              onClick={() => {
                setCategory(value);
                setPage(0);
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="project-results-header">
        <h3 ref={resultHeading} tabIndex={-1}>
          {filtered
            ? "找到 " + matched.length + " 个项目"
            : projects.length + " 个项目，先从简单的开始"}
        </h3>
        {filtered && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X size={14} />
            清除筛选
          </Button>
        )}
      </div>
      <p className="project-reading-hint">
        先看用途与部署方式。选中后，复制改造说明给你正在使用的 AI 编程助手。
      </p>
      <span className="sr-only" role="status">
        共 {matched.length} 个项目，第 {page + 1} 页，共 {pageCount} 页
      </span>
      {matched.length === 0 ? (
        <div className="project-empty">
          <Search size={26} aria-hidden="true" />
          <h4>还没有找到这样的项目</h4>
          <p>试试更短的用途词，或清除分类和难度限制。</p>
          <Button variant="secondary" onClick={resetFilters}>
            查看全部项目
          </Button>
          <Link href="/guide/prompts">
            没有合适的现成项目？用 AI 启动器描述你的想法{" "}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="resource-list project-grid">
          {visible.map((project) => (
            <Card
              className="resource-card project-card"
              key={project.id}
              id={project.id}
            >
              <div className="project-card-heading">
                <span className="project-category">{project.category}</span>
                <Badge
                  className={"project-level project-level-" + project.level}
                >
                  {projectLevels[project.level]}
                </Badge>
              </div>
              <h3>{project.name}</h3>
              <p className="project-purpose">{project.description}</p>
              <div className="project-deployment-summary">
                <strong>{hostingLabels[project.hosting]}</strong>
                <p>{project.deployment}</p>
              </div>
              <p className="project-adaptation">
                <span>可以这样改</span>
                {project.adaptation}
              </p>
              <details className="project-details">
                <summary>看数据、费用与部署选择</summary>
                <dl>
                  <dt>数据怎么存</dt>
                  <dd>{project.dataNeeds}</dd>
                  <dt>钱可能花在哪</dt>
                  <dd>{project.cost}</dd>
                  <dt>本项目怎么上手</dt>
                  <dd>
                    <Link href={"/guide/local#" + project.localId}>
                      查看对应的本地运行方法 <ArrowUpRight size={13} />
                    </Link>
                  </dd>
                  <dt>再选上线平台</dt>
                  <dd className="project-related-links">
                    {project.cloudIds.map((id) => {
                      const platform = availablePlatforms.find(
                        (item) => item.id === id,
                      );
                      return (
                        platform && (
                          <Link key={id} href={"/guide/cloud#" + id}>
                            {platform.name}
                            <ArrowUpRight size={12} />
                          </Link>
                        )
                      );
                    })}
                  </dd>
                </dl>
                <p className="project-platform-hint">
                  先按上面的部署要求准备所需服务，再比较平台额度与配置；这些链接不是一键安装包。
                </p>
                <div className="project-related-links">
                  {project.hosting !== "static" && (
                    <Link href="/guide/databases">
                      数据库与文件存储
                      <ArrowUpRight size={12} />
                    </Link>
                  )}
                  {project.scenarioId && (
                    <Link href={"/guide/prompts#" + project.scenarioId}>
                      细化相关场景需求
                      <ArrowUpRight size={12} />
                    </Link>
                  )}
                  <Link href="/guide/cli">
                    让 AI 协助上线
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
                <p className="project-license">
                  使用许可：
                  <a href={project.licenseUrl} target="_blank" rel="noreferrer">
                    {project.license}
                    <ArrowUpRight size={12} />
                  </a>
                </p>
              </details>
              <div className="project-card-footer">
                <div className="project-official-links">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">
                    项目源码
                    <ArrowUpRight size={13} />
                  </a>
                  <a href={project.docs} target="_blank" rel="noreferrer">
                    官方安装指南
                    <ArrowUpRight size={13} />
                  </a>
                  {project.quickDeploy && (
                    <a
                      href={project.quickDeploy.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.quickDeploy.label}
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
                <div className="project-copy-actions">
                  <CopyButton
                    text={buildAdaptationPrompt(project)}
                    label="复制改造说明"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setGoal("");
                      setSelected(project);
                    }}
                  >
                    先写我的目标
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {matched.length > pageSize && (
        <nav className="project-pagination" aria-label="项目分页">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => changePage(page - 1)}
          >
            <ChevronLeft size={16} />
            上一页
          </Button>
          <span>
            第 {page + 1} / {pageCount} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount - 1}
            onClick={() => changePage(page + 1)}
          >
            下一页
            <ChevronRight size={16} />
          </Button>
        </nav>
      )}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="project-prompt-dialog">
          <div className="space-y-2">
            <DialogTitle>把 {selected?.name} 改成你的作品</DialogTitle>
            <DialogDescription>
              写下你想改什么。复制后粘贴到 AI 编程助手，由它带你运行和修改。
            </DialogDescription>
          </div>
          <label htmlFor="project-goal">我想做什么（选填）</label>
          <textarea
            id="project-goal"
            className="tool-input"
            rows={3}
            maxLength={2000}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder={selected?.adaptation}
          />
          <p className="text-xs text-muted-foreground">
            不填写时使用卡片里的改造方向，填写后以你的目标为准。
          </p>
          <details className="project-prompt-preview">
            <summary>预览将要复制的说明</summary>
            <pre>{selected && buildAdaptationPrompt(selected, goal)}</pre>
          </details>
          {selected && (
            <CopyButton
              text={buildAdaptationPrompt(selected, goal)}
              label="复制我的改造说明"
              className="project-copy-primary"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
