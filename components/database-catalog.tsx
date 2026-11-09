"use client";
import "./database-catalog.css";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { databases, availablePlatforms } from "@/lib/platforms";
import {
  databaseCategories,
  databaseFits,
  filterDatabases,
  orderedDatabases,
  type DatabaseCategory,
} from "@/lib/database-catalog";
import {
  defaultDatabaseContext,
  buildDatabaseSetupTask,
  type DatabaseTaskContext,
} from "@/lib/database-tasks";
import { promptTemplates } from "@/lib/prompt-data";
import { useHashTarget } from "@/components/use-hash-target";
import { DatabasePlanner } from "@/components/database-planner";
import { DatabaseTaskPanel } from "@/components/database-task-panel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

const pageSize = 6;
export function DatabaseCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DatabaseCategory>("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [candidateIds, setCandidateIds] = useState<string[] | undefined>();
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState("unknown");
  const [context, setContext] = useState<DatabaseTaskContext>(
    defaultDatabaseContext,
  );
  const resultsTop = useRef<HTMLDivElement>(null);
  const filtered = filterDatabases(query, category, freeOnly, candidateIds);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );
  function clearFilters() {
    setQuery("");
    setCategory("all");
    setFreeOnly(false);
    setCandidateIds(undefined);
    setPage(0);
  }
  function showResults() {
    requestAnimationFrame(() => {
      resultsTop.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
      resultsTop.current?.focus({ preventScroll: true });
    });
  }
  function selectService(id: string) {
    setSelectedId(id);
    requestAnimationFrame(() => {
      const target = document.getElementById("database-connect");
      target?.scrollIntoView({ block: "start", behavior: "instant" });
      document.getElementById("data-service")?.focus({ preventScroll: true });
    });
  }
  useHashTarget((id) => {
    const index = orderedDatabases.findIndex((service) => service.id === id);
    if (index >= 0) {
      clearFilters();
      setPage(Math.floor(index / pageSize));
    }
  });
  return (
    <div className="database-workspace">
      <DatabasePlanner
        purpose={context.purpose}
        existing={context.existing}
        onChange={(purpose, existing) => {
          setContext((current) => ({ ...current, purpose, existing }));
          setCandidateIds(undefined);
          setPage(0);
        }}
        onCompare={(ids) => {
          clearFilters();
          setCandidateIds(ids);
          showResults();
        }}
      />
      <section className="database-list" id="database-services">
        <div ref={resultsTop} tabIndex={-1} className="database-results-header">
          <h3>比较数据库与文件存储</h3>
          <p>
            先看是否适合项目，再看额度。免费方案也可能限制读写次数、休眠或备份；有免费用量的付费服务，超额仍会计费。
          </p>
        </div>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            className="tool-input !pl-10"
            aria-label="搜索数据服务"
            placeholder="搜索用途、数据库类型或名称，如报名、PostgreSQL、R2…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="filter-bar" role="group" aria-label="按数据用途筛选">
          {databaseCategories.map((item) => (
            <button
              key={item.value}
              className={
                "filter-button " + (category === item.value ? "active" : "")
              }
              aria-pressed={category === item.value}
              onClick={() => {
                setCategory(item.value);
                setPage(0);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="database-result-count">
          <span role="status">
            找到 {filtered.length} 个服务
            {filtered.length > pageSize
              ? `，当前第 ${currentPage + 1} / ${pages} 页`
              : ""}
          </span>
          <label>
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(event) => {
                setFreeOnly(event.target.checked);
                setPage(0);
              }}
            />{" "}
            只看含免费额度的方案
          </label>
        </div>
        {candidateIds && (
          <div className="database-active-filter">
            仅比较上方需求的候选
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setCandidateIds(undefined);
                setPage(0);
              }}
            >
              取消候选限制
            </Button>
          </div>
        )}
        {visible.length ? (
          <div className="database-grid">
            {visible.map((service) => {
              const fit = databaseFits[service.id];
              return (
                <Card
                  key={service.id}
                  id={service.id}
                  className="database-service-card"
                >
                  <div className="database-card-heading">
                    <h4>{service.name}</h4>
                    <Badge
                      variant={
                        service.plan === "免费额度" ? "default" : "outline"
                      }
                    >
                      {service.plan === "免费额度"
                        ? "含免费额度"
                        : "限时体验 / 付费"}
                    </Badge>
                  </div>
                  <div className="platform-tags">
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p>{service.description}</p>
                  <div className="database-use">
                    <strong>适合用它做什么</strong>
                    <ul>
                      {service.useCases?.map((use) => (
                        <li key={use}>{use}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="database-quota">
                    <strong>额度怎么算</strong>
                    <p>{service.allowance}</p>
                  </div>
                  <p className="database-limit">
                    <strong>使用边界：</strong>
                    {service.limit}
                  </p>
                  <details className="database-service-details">
                    <summary>接入方式、适用边界与相关指南</summary>
                    <dl>
                      <dt>连接方式</dt>
                      <dd>{fit.connection}</dd>
                      <dt>先分清这些边界</dt>
                      <dd>{fit.boundary}</dd>
                      <dt>交给 AI 时说明</dt>
                      <dd>{service.setupHint}</dd>
                    </dl>
                    <CopyButton
                      text={buildDatabaseSetupTask(service, context)}
                      label={"直接复制 " + service.name + " 接入任务"}
                    />
                    <div className="learning-links">
                      {service.scenarioIds?.map((id) => {
                        const scenario = promptTemplates.find(
                          (item) => item.id === id,
                        );
                        return scenario ? (
                          <Link key={id} href={"/guide/prompts#" + id}>
                            {scenario.title}的需求说明
                          </Link>
                        ) : null;
                      })}
                      {service.cloudIds?.slice(0, 2).map((id) => {
                        const platform = availablePlatforms.find(
                          (item) => item.id === id,
                        );
                        return platform ? (
                          <Link key={id} href={"/guide/cloud#" + id}>
                            了解 {platform.name} 部署
                          </Link>
                        ) : null;
                      })}
                      {fit.roles.includes("files") && (
                        <Link href="/guide/media#media-storage">
                          文件存放与图片优化
                        </Link>
                      )}
                      {fit.roles.includes("wechat") && (
                        <Link href="/guide/local#local-cloudbase">
                          微信云开发怎么调试
                        </Link>
                      )}
                    </div>
                  </details>
                  <div className="database-card-actions">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => selectService(service.id)}
                    >
                      生成我的接入说明 <ArrowRight size={14} />
                    </Button>
                    <a
                      className="source-link"
                      href={service.source}
                      target="_blank"
                      rel="noreferrer"
                    >
                      官网与套餐 <ArrowUpRight size={12} />
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h4>还没有符合这些条件的服务</h4>
            <p>试试更短的关键词，或清除用途、免费额度和候选范围的限制。</p>
            <Button variant="secondary" onClick={clearFilters}>
              查看全部数据服务
            </Button>
          </div>
        )}
        {pages > 1 && (
          <nav className="database-pagination" aria-label="数据服务分页">
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => {
                setPage(currentPage - 1);
                showResults();
              }}
            >
              <ArrowLeft size={15} />
              上一页
            </Button>
            <span>
              第 {currentPage + 1} / {pages} 页
            </span>
            <Button
              variant="outline"
              disabled={currentPage + 1 === pages}
              onClick={() => {
                setPage(currentPage + 1);
                showResults();
              }}
            >
              下一页
              <ArrowRight size={15} />
            </Button>
          </nav>
        )}
      </section>
      <DatabaseTaskPanel
        key={selectedId}
        selectedId={selectedId}
        context={context}
        onSelect={setSelectedId}
        onChange={setContext}
      />
    </div>
  );
}
