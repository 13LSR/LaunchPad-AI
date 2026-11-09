"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Search,
} from "lucide-react";
import { availablePlatforms } from "@/lib/platforms";
import { platformFits } from "@/lib/platform-fit";
import { cloudGuides } from "@/lib/cloud-guides";
import {
  cloudCategories,
  cloudDeployHref,
  defaultCloudContext,
  filterCloudPlatforms,
  type CloudContext,
} from "@/lib/cloud-catalog";
import { promptTemplates } from "@/lib/prompt-data";
import { commandEntries } from "@/lib/command-data";
import { useHashTarget } from "@/components/use-hash-target";
import { PlatformMark } from "@/components/platform-catalog";
import { CloudPlanner } from "@/components/cloud-planner";
import { CloudComparison } from "@/components/cloud-comparison";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import "./cloud-catalog.css";

const pageSize = 6;
export function CloudCatalog() {
  const [context, setContext] = useState<CloudContext>(defaultCloudContext);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [recurringOnly, setRecurringOnly] = useState(false);
  const [candidateIds, setCandidateIds] = useState<string[] | undefined>();
  const [page, setPage] = useState(0);
  const [comparison, setComparison] = useState<string[]>([]);
  const resultsTop = useRef<HTMLDivElement>(null);
  const filtered = filterCloudPlatforms(
    query,
    category,
    recurringOnly,
    candidateIds,
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );
  function clearFilters() {
    setQuery("");
    setCategory("全部");
    setRecurringOnly(false);
    setCandidateIds(undefined);
    setPage(0);
  }
  function focusResults() {
    requestAnimationFrame(() => {
      resultsTop.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
      resultsTop.current?.focus({ preventScroll: true });
    });
  }
  function focusComparison() {
    requestAnimationFrame(() => {
      const el = document.getElementById("cloud-compare-title");
      el?.scrollIntoView({ block: "start", behavior: "instant" });
      el?.focus({ preventScroll: true });
    });
  }
  function removeComparison(id: string) {
    setComparison((items) => items.filter((item) => item !== id));
  }
  useHashTarget((id) => {
    const index = availablePlatforms.findIndex((p) => p.id === id);
    if (index >= 0) {
      clearFilters();
      setPage(Math.floor(index / pageSize));
    }
  });
  return (
    <div className="cloud-workspace">
      <CloudPlanner
        context={context}
        onChange={(patch) => {
          setContext((current) => ({ ...current, ...patch }));
          setCandidateIds(undefined);
          setPage(0);
        }}
        onFilter={(ids) => {
          clearFilters();
          setCandidateIds(ids);
          focusResults();
        }}
        onCompare={(ids) => {
          setComparison(ids.slice(0, 3));
          focusComparison();
        }}
      />
      <section
        id="cloud-services"
        className="cloud-services scroll-mt-24"
        aria-labelledby="cloud-services-title"
      >
        <div ref={resultsTop} tabIndex={-1} className="cloud-results-header">
          <h3 id="cloud-services-title">比较云端部署平台</h3>
          <p>
            共 {availablePlatforms.length}{" "}
            个可选平台。先看适用场景和费用条件；想放在一起看，可从卡片加入最多三个平台。
          </p>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3.5 top-3.5 text-muted-foreground"
            size={15}
            aria-hidden="true"
          />
          <input
            className="tool-input !pl-10"
            type="search"
            value={query}
            aria-label="筛选平台"
            placeholder="搜索名称、用途或技术，例如 Python、静态网站、Next.js…"
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="filter-bar" role="group" aria-label="平台分类">
          {cloudCategories.map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              className={"filter-button " + (category === item ? "active" : "")}
              onClick={() => {
                setCategory(item);
                setPage(0);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="cloud-result-count">
          <span role="status">
            找到 {filtered.length} 个平台
            {filtered.length > pageSize
              ? `，第 ${currentPage + 1} / ${pages} 页`
              : ""}
          </span>
          <label>
            <input
              type="checkbox"
              checked={recurringOnly}
              onChange={(e) => {
                setRecurringOnly(e.target.checked);
                setPage(0);
              }}
            />
            只看有持续免费额度
          </label>
        </div>
        {recurringOnly && (
          <p className="cloud-filter-note">
            排除限期试用和依赖特定资格的方案；保留的服务仍有用量、用途或计费账号要求。
          </p>
        )}
        {candidateIds && (
          <div className="cloud-active-filter">
            当前只看上方需求的候选
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                clearFilters();
                focusResults();
              }}
            >
              查看全部平台
            </Button>
          </div>
        )}
        {comparison.length > 0 && (
          <div className="cloud-compare-bar">
            <span>已加入比较 {comparison.length} / 3 个</span>
            <Button variant="secondary" size="sm" onClick={focusComparison}>
              查看比较
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setComparison([])}>
              清空
            </Button>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>没有符合条件的平台</p>
            <p>试着减少关键词，或放宽免费与分类条件。</p>
            <Button variant="link" onClick={clearFilters}>
              清除筛选
            </Button>
          </div>
        ) : (
          <div className="platform-full-grid cloud-platform-grid">
            {visible.map((p) => {
              const guide = cloudGuides[p.id],
                fit = platformFits[p.id];
              const picked = comparison.includes(p.id);
              return (
                <Card
                  id={p.id}
                  key={p.id}
                  className="platform-full-card cloud-platform-card scroll-mt-24"
                >
                  <div className="platform-card-top">
                    <PlatformMark platform={p} />
                    <h3>{p.name}</h3>
                  </div>
                  <div className="cloud-card-badges">
                    <Badge variant="outline">{p.category}</Badge>
                    <Badge
                      variant={
                        guide.cost === "recurring" ? "default" : "secondary"
                      }
                    >
                      {guide.costLabel}
                    </Badge>
                  </div>
                  <div className="cloud-card-use">
                    <h4>适合做什么</h4>
                    <p>{fit.useCases.join("、")}</p>
                  </div>
                  <div className="quota-line">{p.allowance}</div>
                  <p className="platform-limit">{p.limit}</p>
                  <div className="platform-tags">
                    {p.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <details className="cloud-card-details">
                    <summary>怎么上线、会不会休眠、数据放哪里？</summary>
                    <dl>
                      <div>
                        <dt>开始部署</dt>
                        <dd>{guide.start}</dd>
                      </div>
                      <div>
                        <dt>等待与休眠</dt>
                        <dd>{guide.sleep}</dd>
                      </div>
                      <div>
                        <dt>数据与文件</dt>
                        <dd>{guide.storage}</dd>
                      </div>
                      <div>
                        <dt>费用边界</dt>
                        <dd>{guide.billing}</dd>
                      </div>
                    </dl>
                    <div className="learning-links">
                      {promptTemplates
                        .filter((t) => fit.profiles.includes(t.profile))
                        .slice(0, 2)
                        .map((t) => (
                          <Link key={t.id} href={"/guide/prompts#" + t.id}>
                            {t.title}的启动方案
                          </Link>
                        ))}
                      {fit.localIds.slice(0, 2).map((id) => (
                        <Link key={id} href={"/guide/local#" + id}>
                          {
                            commandEntries.find((entry) => entry.id === id)
                              ?.title
                          }
                          运行方法
                        </Link>
                      ))}
                      <Link href="/guide/databases#database-choose">
                        准备数据库与文件存储
                      </Link>
                    </div>
                  </details>
                  <div className="cloud-card-primary-actions">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={cloudDeployHref(p.id, context)}>
                        让 AI 帮我部署到这里 <ArrowRight size={13} />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-pressed={picked}
                      aria-label={(picked ? "移出比较 " : "加入比较 ") + p.name}
                      disabled={!picked && comparison.length >= 3}
                      onClick={() =>
                        picked
                          ? removeComparison(p.id)
                          : setComparison((items) => [...items, p.id])
                      }
                    >
                      {picked
                        ? "已加入比较"
                        : comparison.length >= 3
                          ? "比较已满 3 个"
                          : "加入比较"}
                    </Button>
                  </div>
                  <div className="cloud-card-sources">
                    <a href={p.url} target="_blank" rel="noreferrer">
                      访问官网 <ArrowUpRight size={12} />
                    </a>
                    <a href={p.source} target="_blank" rel="noreferrer">
                      官方套餐 <ExternalLink size={12} />
                    </a>
                    <CopyButton text={p.url} label="复制官网" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {pages > 1 && (
          <nav className="cloud-pagination" aria-label="部署平台分页">
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => {
                setPage(currentPage - 1);
                focusResults();
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
              disabled={currentPage + 1 >= pages}
              onClick={() => {
                setPage(currentPage + 1);
                focusResults();
              }}
            >
              下一页
              <ArrowRight size={15} />
            </Button>
          </nav>
        )}
      </section>
      {comparison.length > 0 && (
        <CloudComparison
          ids={comparison}
          context={context}
          onRemove={removeComparison}
          onClear={() => setComparison([])}
        />
      )}
    </div>
  );
}
