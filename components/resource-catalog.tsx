"use client";

import "./skill-catalog.css";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  skills,
  orderedSkills,
  filterSkills,
  extensionKinds,
  agentChoices,
  systemChoices,
  defaultInstallPreferences,
  buildInstallTask,
  buildSkillTrial,
  type InstallPreferences,
} from "@/lib/skill-catalog";
import { useHashTarget } from "@/components/use-hash-target";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

const pageSize = 6;
const categories = [...new Set(skills.map((skill) => skill.category))];

export function ResourceCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [kind, setKind] = useState("all");
  const [page, setPage] = useState(0);
  const [preferences, setPreferences] = useState<InstallPreferences>(
    defaultInstallPreferences,
  );
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const matched = filterSkills(query, category, kind);
  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
  const visible = matched.slice(page * pageSize, (page + 1) * pageSize);
  const filtered = query !== "" || category !== "全部" || kind !== "all";

  function resetFilters() {
    setQuery("");
    setCategory("全部");
    setKind("all");
    setPage(0);
  }
  useHashTarget((id) => {
    const index = orderedSkills.findIndex((skill) => skill.id === id);
    if (index < 0) return;
    resetFilters();
    setPage(Math.floor(index / pageSize));
  });
  function changePage(next: number) {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
  }

  return (
    <div className="skill-catalog">
      <div className="skill-setup">
        <div className="skill-agent-choice">
          <label htmlFor="skill-agent">你正在用哪个 AI 工具？</label>
          <select
            id="skill-agent"
            value={preferences.agent}
            onChange={(event) =>
              setPreferences({
                ...preferences,
                agent: event.target.value as InstallPreferences["agent"],
              })
            }
          >
            {Object.entries(agentChoices).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {preferences.agent === "other" && (
          <label className="skill-custom-agent">
            工具名称（选填）
            <input
              maxLength={100}
              value={preferences.customAgent}
              placeholder="例如 Windsurf、Gemini CLI"
              onChange={(event) =>
                setPreferences({
                  ...preferences,
                  customAgent: event.target.value,
                })
              }
            />
          </label>
        )}
        <p className="skill-setup-hint">
          复制时会带上你的选择。不确定也没关系，安装说明会让 AI
          先帮你识别；是否兼容可看每项的“适用工具”。
        </p>
        {preferences.agent === "web" && (
          <p className="skill-web-hint">
            聊天网页与 AI
            编程工具的能力不同。先检查网页是否支持所需的连接器或技能，不能直接套用本地安装命令。
          </p>
        )}
        <details className="skill-preferences">
          <summary>电脑系统与安装范围（选填）</summary>
          <div className="skill-preference-fields">
            <label>
              电脑系统
              <select
                value={preferences.system}
                onChange={(event) =>
                  setPreferences({
                    ...preferences,
                    system: event.target.value as InstallPreferences["system"],
                  })
                }
              >
                {Object.entries(systemChoices).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              安装范围
              <select
                value={preferences.scope}
                onChange={(event) =>
                  setPreferences({
                    ...preferences,
                    scope: event.target.value as InstallPreferences["scope"],
                  })
                }
              >
                <option value="project">优先只给当前项目用</option>
                <option value="global">给我的所有项目用</option>
              </select>
            </label>
          </div>
          <p>
            默认从当前项目开始，方便试用和撤回。部分工具仅支持全局安装，AI
            会先解释范围；账号访问权限仍需单独设置。
          </p>
        </details>
      </div>

      <div className="skill-filter-controls">
        <label className="skill-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            aria-label="搜索技能与扩展"
            placeholder="想解决什么？试试页面设计、测试、数据库…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </label>
        <select
          aria-label="扩展形式"
          value={kind}
          onChange={(event) => {
            setKind(event.target.value);
            setPage(0);
          }}
        >
          <option value="all">全部形式</option>
          {Object.entries(extensionKinds).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div
        className="skill-category-filter"
        role="group"
        aria-label="按要解决的问题筛选"
      >
        {["全部", ...categories].map((value) => (
          <button
            key={value}
            className={"filter-button " + (value === category ? "active" : "")}
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
      <div className="skill-results-heading">
        <h3 ref={resultsHeading} tabIndex={-1}>
          {filtered
            ? "找到 " + matched.length + " 个扩展"
            : "先选一个，解决眼前的问题"}
        </h3>
        {filtered ? (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X size={14} />
            清除筛选
          </Button>
        ) : (
          <span>{skills.length} 个扩展可选</span>
        )}
      </div>
      <p className="skill-results-hint">
        先复制安装说明；能调用后，再复制试用任务，检查它是否帮上了忙。
      </p>
      <span role="status" className="sr-only">
        共 {matched.length} 个扩展，第 {page + 1} 页，共 {pageCount} 页
      </span>
      {!matched.length ? (
        <div className="skill-empty">
          <h4>暂时没找到匹配的扩展</h4>
          <p>试试“文档”“浏览器”等用途词，或清除分类和形式限制。</p>
          <Button variant="secondary" onClick={resetFilters}>
            查看全部扩展
          </Button>
          <a href="#skills-assembly">
            不知道该用什么？复制诊断任务给 AI <ArrowUpRight size={14} />
          </a>
        </div>
      ) : (
        <div className="resource-list skill-grid">
          {visible.map((skill) => (
            <Card
              className="resource-card skill-card"
              key={skill.id}
              id={skill.id}
            >
              <div className="skill-card-heading">
                <h3>{skill.name}</h3>
                <Badge>{extensionKinds[skill.kind]}</Badge>
              </div>
              <p className="skill-purpose">{skill.description}</p>
              <dl className="skill-summary">
                <dt>什么时候用</dt>
                <dd>{skill.fit}</dd>
                <dt>适用工具</dt>
                <dd>{skill.compatibility}</dd>
              </dl>
              <details className="skill-details">
                <summary>准备什么、是否花钱、怎么验证</summary>
                <dl>
                  <dt>先准备什么</dt>
                  <dd>{skill.setup}</dd>
                  <dt>账号与费用</dt>
                  <dd>{skill.cost}</dd>
                  <dt>它能接触什么</dt>
                  <dd>{skill.access}</dd>
                  <dt>哪些事别指望它</dt>
                  <dd>{skill.limit}</dd>
                  <dt>看到什么才算能用</dt>
                  <dd>{skill.verification}</dd>
                </dl>
                <div className="skill-example">
                  <div>
                    <strong>装好后这样试</strong>
                    <CopyButton
                      text={buildSkillTrial(skill)}
                      label="复制试用任务"
                    />
                  </div>
                  <p>{skill.example}</p>
                </div>
                <p className="skill-license">使用许可：{skill.license}</p>
                <div className="skill-related-links">
                  {skill.related.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                      <ArrowUpRight size={13} />
                    </Link>
                  ))}
                </div>
              </details>
              <div className="skill-card-actions">
                <CopyButton
                  text={buildInstallTask(skill, preferences)}
                  label="复制安装说明"
                  className="skill-primary-copy"
                />
                <div>
                  <a href={skill.docs} target="_blank" rel="noreferrer">
                    官方指南
                    <ArrowUpRight size={13} />
                  </a>
                  <a href={skill.repoUrl} target="_blank" rel="noreferrer">
                    源码
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
              <details className="skill-install-preview">
                <summary>预览安装说明</summary>
                <pre>{buildInstallTask(skill, preferences)}</pre>
              </details>
            </Card>
          ))}
        </div>
      )}
      {matched.length > pageSize && (
        <nav className="skill-pagination" aria-label="扩展分页">
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
    </div>
  );
}
