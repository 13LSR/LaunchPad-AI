"use client";
import "./local-run.css";
import { LocalFileFinder } from "@/components/local-file-finder";
import { LocalRunControls } from "@/components/local-run-controls";
import { LocalTroubleshooting } from "@/components/local-troubleshooting";
import {
  commandGroup,
  runCommands,
  type RunStage,
  type PythonTool,
} from "@/lib/local-run";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useHashTarget } from "@/components/use-hash-target";
import { AnimatedDisclosure } from "@/components/animated-disclosure";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileCode2,
  Search,
} from "lucide-react";
import { commandEntries } from "@/lib/command-data";
import { promptTemplates } from "@/lib/prompt-data";
import { getDeploymentRanking } from "@/lib/deployment-ranking";
import { platforms } from "@/lib/platforms";
import type { PackageManager } from "@/lib/commands";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export function CommandCheatsheet() {
  const [activeId, setActiveId] = useState(commandEntries[0].id);
  const deckTop = useRef<HTMLDivElement>(null);
  function selectCard(id: string, reveal = false) {
    setActiveId(id);
    setStage("first");
    if (reveal)
      requestAnimationFrame(() =>
        deckTop.current?.scrollIntoView({
          block: "start",
          behavior: "instant",
        }),
      );
  }
  const [stage, setStage] = useState<RunStage>("first");
  const [pythonTools, setPythonTools] = useState<Record<string, PythonTool>>(
    {},
  );
  const [category, setCategory] = useState("全部"),
    [manager, setManager] = useState<PackageManager>("npm"),
    [os, setOs] = useState("Windows"),
    [query, setQuery] = useState(""),
    [variants, setVariants] = useState<Record<string, string>>({});
  useHashTarget((id) => {
    if (commandEntries.some((e) => e.id === id)) {
      setQuery("");
      setCategory("全部");
      setActiveId(id);
      setStage("first");
    }
  });
  const categories = [
    "全部",
    "前端 / 全栈",
    "Python",
    "后端",
    "小程序前后端",
    "桌面 / 移动",
    "Docker",
  ];
  const group = commandGroup;
  const filtered = useMemo(
    () =>
      commandEntries.filter(
        (e) =>
          (category === "全部" || group(e.category) === category) &&
          [e.title, e.feature, e.description, ...e.useCases]
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [query, category],
  );
  const activeIndex = Math.max(
    0,
    filtered.findIndex((e) => e.id === activeId),
  );
  const visibleEntries = filtered.slice(activeIndex, activeIndex + 1);
  return (
    <>
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-3.5 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setStage("first");
          }}
          placeholder="搜索框架、想做的事或文件名，如微信小程序、博客、manage.py…"
          aria-label="搜索技术栈"
          className="tool-input !pl-10"
        />
      </div>
      <div className="filter-bar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setStage("first");
            }}
            className={"filter-button " + (c === category ? "active" : "")}
            aria-pressed={c === category}
          >
            {c}
          </button>
        ))}
      </div>
      <LocalFileFinder
        onChoose={(id, selectedManager, pythonTool, files = "") => {
          setQuery("");
          setCategory("全部");
          if (selectedManager) setManager(selectedManager);
          if (pythonTool)
            setPythonTools((current) => ({ ...current, [id]: pythonTool }));
          if (id === "local-42")
            setVariants((current) => ({
              ...current,
              [id]: /compose/i.test(files)
                ? "有 compose.yaml / docker-compose.yml"
                : "只有 Dockerfile",
            }));
          if (id === "local-32")
            setVariants((current) => ({
              ...current,
              [id]:
                /gradle/i.test(files) && !/pom.xml/i.test(files)
                  ? "Gradle（build.gradle）"
                  : "Maven（pom.xml）",
            }));
          selectCard(id, true);
        }}
      />
      {!filtered.length ? (
        <div className="empty-state">
          <p>没有找到匹配项目，试试文件名或更短的词。</p>
          <Button
            variant="link"
            onClick={() => {
              setQuery("");
              setCategory("全部");
            }}
          >
            查看全部
          </Button>
        </div>
      ) : (
        <div
          className="command-deck"
          ref={deckTop}
          role="region"
          aria-label="技术栈卡片"
          aria-roledescription="轮播"
        >
          <div className="deck-controls">
            <Button
              variant="outline"
              disabled={activeIndex === 0}
              onClick={() => selectCard(filtered[activeIndex - 1].id)}
              aria-label="上一个技术栈"
            >
              <ArrowLeft />
              上一个
            </Button>
            <span aria-live="polite">
              {activeIndex + 1} / {filtered.length}
            </span>
            <Button
              variant="outline"
              disabled={activeIndex === filtered.length - 1}
              onClick={() => selectCard(filtered[activeIndex + 1].id)}
              aria-label="下一个技术栈"
            >
              下一个
              <ArrowRight />
            </Button>
          </div>
          <label htmlFor="stack-select" className="form-label">
            直接选择技术栈
          </label>
          <select
            id="stack-select"
            className="tool-input mb-5"
            value={visibleEntries[0]?.id || ""}
            onChange={(e) => selectCard(e.target.value)}
          >
            {filtered.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          {visibleEntries.map((e) => {
            const options = {
              manager,
              os,
              stage,
              pythonTool: pythonTools[e.id] || ("pip" as PythonTool),
              variant: variants[e.id] || e.variants?.[0].name,
            };
            const code = runCommands(e, options);
            const directScenarios = promptTemplates.filter(
              (t) => t.localId === e.id,
            );
            const scenarios = directScenarios.length
              ? directScenarios
              : promptTemplates.filter((t) =>
                  e.relatedLocalIds?.includes(t.localId),
                );
            const deploy = getDeploymentRanking(e.profile, "personal")
              .filter((r) => r.compatible)
              .slice(0, 2);
            return (
              <Card className="command-card" key={e.id} id={e.id}>
                <div className="flex items-start justify-between gap-3">
                  <h3>{e.title}</h3>
                  <Badge>{group(e.category)}</Badge>
                </div>
                <p className="command-description">{e.description}</p>
                <div className="stack-use-cases">
                  <strong>适合做什么</strong>
                  <div>
                    {e.useCases.map((u) => (
                      <Badge key={u} variant="outline">
                        {u}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="command-feature">
                  <FileCode2 size={14} className="mr-1.5 inline" />
                  <strong>怎么认出它：</strong>
                  {e.feature}
                </p>
                <p className="stack-prerequisite">
                  <strong>先准备：</strong>
                  {e.prerequisite}{" "}
                  <a href={e.docsUrl} target="_blank" rel="noreferrer">
                    官方安装说明 <ExternalLink size={12} />
                  </a>
                </p>
                {e.guiSteps && (
                  <ol className="learning-steps">
                    {e.guiSteps.map((s, i) => (
                      <li key={s.title}>
                        <span className="learning-step-number">{i + 1}</span>
                        <div>
                          <h4 className="font-semibold">{s.title}</h4>
                          <p>{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                <LocalRunControls
                  entry={e}
                  options={options}
                  onChange={(next) => {
                    setManager(next.manager);
                    setOs(next.os);
                    setStage(next.stage);
                    setPythonTools((current) => ({
                      ...current,
                      [e.id]: next.pythonTool,
                    }));
                    if (next.variant)
                      setVariants((current) => ({
                        ...current,
                        [e.id]: next.variant!,
                      }));
                  }}
                />
                <div className="command-address">
                  <ExternalLink size={13} />
                  <span>在哪里看结果：</span>
                  <code>{e.address}</code>
                </div>
                <AnimatedDisclosure
                  title={"常见问题与处理（" + e.issues.length + " 项）"}
                >
                  <LocalTroubleshooting
                    key={e.id}
                    entry={e}
                    options={options}
                  />
                </AnimatedDisclosure>
                <div className="local-after-run">
                  <strong>能打开，还要试一次真实操作</strong>
                  <p>
                    {e.profile === "offline"
                      ? "检查输出文件或终端结果，任务正常结束并不代表失败。脚本不一定有网页。"
                      : e.guiSteps
                        ? "按上面的预览入口验证功能；能编译不等于数据、登录和上传都已可用。"
                        : "地址是常见示例，以本次终端输出为准。试一次提交、查询或保存；需要前后端的项目，应同时启动它们。"}
                  </p>
                  {code && (
                    <p>
                      结束使用时回到运行它的终端按
                      Ctrl+C；下次打开项目目录，切到“以后再启动”。localhost
                      只指向你自己的电脑，不能把它当上线地址发给别人。
                    </p>
                  )}
                  <a href="#local-data-next">
                    跑通了？先确认数据保存，再安排上线 <ArrowRight size={14} />
                  </a>
                </div>
                <details className="local-related-disclosure">
                  <summary>相关场景、其他运行入口与部署参考</summary>
                  <div className="stack-related">
                    <h4>按项目需要连接这些部分</h4>
                    <div className="learning-links">
                      {e.relatedLocalIds?.map((id) => {
                        const entry = commandEntries.find((x) => x.id === id)!;
                        return (
                          <Link key={id} href={"/guide/local#" + id}>
                            {entry.title}
                            <ArrowRight size={13} />
                          </Link>
                        );
                      })}
                    </div>
                    <div className="learning-links">
                      {scenarios.slice(0, 3).map((t) => (
                        <Link key={t.id} href={"/guide/prompts#" + t.id}>
                          做{t.title}
                          <ArrowRight size={13} />
                        </Link>
                      ))}
                      {!scenarios.length && (
                        <Link href="/guide/prompts">
                          先选一个具体使用场景
                          <ArrowRight size={13} />
                        </Link>
                      )}
                      {deploy.map((r) => {
                        const p = platforms.find((p) => p.id === r.platformId)!;
                        return (
                          <Link key={p.id} href={"/guide/cloud#" + p.id}>
                            {[
                              "desktop",
                              "mobile",
                              "wechat",
                              "miniapp",
                              "extension",
                            ].includes(e.profile)
                              ? "可选后端："
                              : e.profile === "offline"
                                ? "需要远程运行时："
                                : "部署参考："}
                            {p.name}
                            <ArrowRight size={13} />
                          </Link>
                        );
                      })}
                    </div>
                    <p>
                      {e.profile === "static"
                        ? "只有静态文件可直接托管；加入后端后要重新评估。"
                        : e.profile === "offline"
                          ? "本地脚本通常不需要上云。"
                          : [
                                "desktop",
                                "mobile",
                                "wechat",
                                "miniapp",
                                "extension",
                              ].includes(e.profile)
                            ? "客户端需按对应平台预览、打包或审核；云平台只解决可选后端。"
                            : "正式部署前确认运行时、内存、持久数据、环境变量与费用；不是把开发命令原样暴露公网。"}
                    </p>
                    <Link
                      href="/guide/databases#database-choose"
                      className="text-primary text-sm inline-flex items-center gap-1 mt-3"
                    >
                      需要保存数据？查看数据选型
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </details>
              </Card>
            );
          })}
          <div className="deck-controls deck-controls-bottom">
            <Button
              variant="outline"
              disabled={activeIndex === 0}
              onClick={() => selectCard(filtered[activeIndex - 1].id, true)}
            >
              <ArrowLeft />
              上一张卡片
            </Button>
            <Button
              variant="outline"
              disabled={activeIndex === filtered.length - 1}
              onClick={() => selectCard(filtered[activeIndex + 1].id, true)}
            >
              下一张卡片
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
