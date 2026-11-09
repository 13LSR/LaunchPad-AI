"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useHashTarget } from "@/components/use-hash-target";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import {
  promptTemplates,
  deploymentProfiles,
  type PromptTemplate,
} from "@/lib/prompt-data";
import {
  getDeploymentRanking,
  getRecommendedPlatform,
  type ProjectUse,
} from "@/lib/deployment-ranking";
import { buildProjectPrompt, type PromptAnswers } from "@/lib/prompt-builder";
import { platforms } from "@/lib/platforms";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { DeploymentPicker } from "@/components/deployment-picker";

const PAGE_SIZE = 8;
const categories = ["全部", ...new Set(promptTemplates.map((t) => t.category))];
function emptyAnswers(template: PromptTemplate): PromptAnswers {
  return {
    name: "",
    purpose: "",
    audience: "",
    requirements: "",
    use: template.defaultUse,
    platformId: "recommended",
    features: [...template.features],
  };
}
export function PromptGenerator() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(promptTemplates[0].id);
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, PromptAnswers>>({});
  const stepAnchor = useRef<HTMLDivElement>(null);
  const listAnchor = useRef<HTMLParagraphElement>(null);
  const shouldReveal = useRef(false);
  const revealPage = useRef(false);
  const pendingScenario = useRef<string | null>(null);
  const reducedMotion = useReducedMotion();
  const template = promptTemplates.find((t) => t.id === selected)!;
  const answers = drafts[selected] || emptyAnswers(template);
  const ranking = getDeploymentRanking(template.profile, answers.use);
  const recommended = getRecommendedPlatform(template.profile, answers.use);
  const platformId = ranking.some(
    (r) => r.platformId === answers.platformId && r.compatible,
  )
    ? answers.platformId
    : recommended.platformId;
  const current = platforms.find((p) => p.id === platformId)!;
  const native = [
    "wechat",
    "miniapp",
    "mobile",
    "desktop",
    "extension",
  ].includes(template.profile);
  const offline = template.profile === "offline";
  const filtered = promptTemplates.filter(
    (t) =>
      (filter === "全部" || t.category === filter) &&
      [t.title, t.description, t.stack]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(pages - 1, 0));
  const visible = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );
  const selectionInResults = filtered.some((t) => t.id === selected);
  const prompt = buildProjectPrompt(template, { ...answers, platformId });

  function updateAnswers(patch: Partial<PromptAnswers>) {
    setDrafts((previous) => ({
      ...previous,
      [selected]: {
        ...(previous[selected] || emptyAnswers(template)),
        ...patch,
      },
    }));
  }
  function goToStep(next: number) {
    pendingScenario.current = null;
    if (next === 0) {
      const index = filtered.findIndex((t) => t.id === selected);
      if (index < 0) {
        setFilter("全部");
        setQuery("");
        setPage(
          Math.floor(
            promptTemplates.findIndex((t) => t.id === selected) / PAGE_SIZE,
          ),
        );
      } else setPage(Math.floor(index / PAGE_SIZE));
    }
    shouldReveal.current = true;
    setStep(next);
  }
  function revealStep() {
    if (pendingScenario.current) {
      const element = document.getElementById(pendingScenario.current);
      if (element) {
        pendingScenario.current = null;
        element.focus({ preventScroll: true });
        element.scrollIntoView({ block: "start", behavior: "instant" });
        return;
      }
    }
    if (!shouldReveal.current) return;
    shouldReveal.current = false;
    stepAnchor.current?.focus({ preventScroll: true });
    stepAnchor.current?.scrollIntoView({
      block: "start",
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }
  useEffect(() => {
    if (!revealPage.current) return;
    revealPage.current = false;
    listAnchor.current?.focus({ preventScroll: true });
    listAnchor.current?.scrollIntoView({
      block: "start",
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [page, reducedMotion]);
  useHashTarget((id) => {
    const index = promptTemplates.findIndex((t) => t.id === id);
    if (index < 0) return;
    if (step !== 0) pendingScenario.current = id;
    setSelected(id);
    setFilter("全部");
    setQuery("");
    setPage(Math.floor(index / PAGE_SIZE));
    setStep(0);
  });
  function clearFilters() {
    setQuery("");
    setFilter("全部");
    setPage(0);
  }

  return (
    <div className="prompt-generator" data-step={step}>
      <div
        className="prompt-steps"
        ref={stepAnchor}
        tabIndex={-1}
        aria-label={step === 2 ? "需求说明已生成" : "需求生成步骤"}
      >
        {["选个场景", "补充想法", "复制给 AI"].map((label, index) => (
          <button
            key={label}
            type="button"
            className={"prompt-step " + (step >= index ? "active" : "")}
            aria-current={step === index ? "step" : undefined}
            disabled={index > step}
            onClick={() => index < step && goToStep(index)}
          >
            <span>
              {step > index ? (
                <Check size={12} aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
            {label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          onAnimationComplete={(definition) => {
            if (
              typeof definition === "object" &&
              "opacity" in definition &&
              definition.opacity === 1
            )
              revealStep();
          }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
          transition={{ duration: reducedMotion ? 0 : 0.16 }}
        >
          {step === 0 ? (
            <>
              <div className="starter-search">
                <Search size={17} aria-hidden="true" />
                <input
                  aria-label="搜索场景"
                  className="tool-input"
                  placeholder="搜索想做的事，例如：小程序、博客、报名…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                  }}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="清除场景搜索"
                    onClick={() => {
                      setQuery("");
                      setPage(0);
                    }}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="filter-bar" aria-label="场景分类">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      "filter-button " + (filter === category ? "active" : "")
                    }
                    aria-pressed={filter === category}
                    onClick={() => {
                      setFilter(category);
                      setPage(0);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p
                className="starter-results-count"
                ref={listAnchor}
                tabIndex={-1}
                aria-live="polite"
              >
                {filtered.length
                  ? "共 " +
                    filtered.length +
                    " 个场景，当前显示 " +
                    (currentPage * PAGE_SIZE + 1) +
                    "–" +
                    Math.min((currentPage + 1) * PAGE_SIZE, filtered.length) +
                    " 个"
                  : "没有找到匹配的场景"}
              </p>
              <div className="prompt-options">
                {visible.map((t) => (
                  <button
                    key={t.id}
                    id={t.id}
                    type="button"
                    className={
                      "prompt-option " + (selected === t.id ? "selected" : "")
                    }
                    aria-pressed={selected === t.id}
                    onClick={() => setSelected(t.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3>{t.title}</h3>
                      {selected === t.id && (
                        <Check
                          size={16}
                          className="mt-1 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p>{t.description}</p>
                  </button>
                ))}
              </div>
              {pages > 1 && (
                <nav className="starter-pagination" aria-label="场景分页">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="上一页场景"
                    disabled={currentPage === 0}
                    onClick={() => {
                      revealPage.current = true;
                      setPage(currentPage - 1);
                    }}
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                    上一页
                  </Button>
                  <span>
                    第 {currentPage + 1} / {pages} 页
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="下一页场景"
                    disabled={currentPage === pages - 1}
                    onClick={() => {
                      revealPage.current = true;
                      setPage(currentPage + 1);
                    }}
                  >
                    下一页
                    <ChevronRight size={16} aria-hidden="true" />
                  </Button>
                </nav>
              )}
              {!filtered.length && (
                <div className="empty-state">
                  <p>
                    试试更短的词，或清除分类后搜索。例如“微信小程序”可以搜“小程序”。
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    查看全部场景
                  </Button>
                </div>
              )}
              <p className="starter-hint">
                不用选得完全一样。找用途最接近的场景，下一步再改成自己的需求。
              </p>
            </>
          ) : step === 1 ? (
            <div className="starter-form">
              <div className="starter-scenario-heading">
                <div>
                  <h3>{template.title}</h3>
                  <p>{template.description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => goToStep(0)}>
                  更换场景
                </Button>
              </div>
              <label className="form-label" htmlFor="scenario-purpose">
                {template.question}
              </label>
              <textarea
                id="scenario-purpose"
                className="tool-input starter-purpose"
                value={answers.purpose}
                maxLength={500}
                onChange={(e) => updateAnswers({ purpose: e.target.value })}
                placeholder={template.placeholder}
                aria-describedby="purpose-hint"
              />
              <p id="purpose-hint" className="starter-hint">
                用自己的话写一句就好。留空时，生成的说明会让 AI
                先问清楚；示例不会被当作你的答案。
              </p>
              <div className="starter-field-pair">
                <div>
                  <label className="form-label" htmlFor="project-name">
                    项目名称（选填）
                  </label>
                  <input
                    id="project-name"
                    className="tool-input"
                    value={answers.name}
                    maxLength={80}
                    onChange={(e) => updateAnswers({ name: e.target.value })}
                    placeholder="给项目起个名字"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="scenario-audience">
                    谁会使用它？（选填）
                  </label>
                  <input
                    id="scenario-audience"
                    className="tool-input"
                    value={answers.audience}
                    maxLength={300}
                    onChange={(e) =>
                      updateAnswers({ audience: e.target.value })
                    }
                    placeholder="例如：自己的团队、社区居民"
                  />
                </div>
              </div>
              <fieldset className="starter-features">
                <legend>第一版需要哪些功能？</legend>
                <p className="starter-hint">
                  已勾选常用功能。不需要的可以取消，先做一个能用的小版本。
                </p>
                <div className="feature-choices">
                  {template.features.map((feature) => (
                    <label key={feature}>
                      <input
                        type="checkbox"
                        checked={answers.features.includes(feature)}
                        onChange={(e) =>
                          updateAnswers({
                            features: e.target.checked
                              ? [...answers.features, feature]
                              : answers.features.filter((f) => f !== feature),
                          })
                        }
                      />
                      {feature}
                    </label>
                  ))}
                </div>
                {!answers.features.length && (
                  <p className="starter-validation" role="status">
                    至少选择一个功能，再生成需求说明。
                  </p>
                )}
              </fieldset>
              <label className="form-label" htmlFor="requirements">
                还有哪些具体要求？（选填）
              </label>
              <textarea
                id="requirements"
                className="tool-input min-h-28 resize-y"
                value={answers.requirements}
                maxLength={4000}
                onChange={(e) =>
                  updateAnswers({ requirements: e.target.value })
                }
                placeholder="例如：粉绿配色，手机上也能用，需要导出 Excel。"
              />
              <label className="form-label" htmlFor="project-use">
                项目会用于商业用途吗？
              </label>
              <select
                id="project-use"
                className="tool-input"
                value={answers.use}
                aria-describedby="use-hint"
                onChange={(e) =>
                  updateAnswers({
                    use: e.target.value as ProjectUse,
                    platformId: "recommended",
                  })
                }
              >
                <option value="personal">个人学习 / 非商业展示</option>
                <option value="commercial">公司、经营、收费或商业用途</option>
              </select>
              <p id="use-hint" className="starter-hint">
                替公司做、接客户项目或用于经营，都按商业用途选择。部分免费套餐只允许个人非商业使用。
              </p>
              <DeploymentPicker
                profile={template.profile}
                use={answers.use}
                platformId={platformId}
                onSelect={(id) => updateAnswers({ platformId: id })}
              />
              <details className="starter-technical">
                <summary>
                  想了解技术和功能边界？
                  <ChevronDown size={17} aria-hidden="true" />
                </summary>
                <p>{template.boundary}</p>
                <p>技术起点：{template.stack}</p>
                <p>
                  这些说明也会写进需求，让 AI
                  根据实际项目判断。你不需要先学会这些技术。
                </p>
                <div className="learning-links">
                  <Link href={"/guide/local#" + template.localId}>
                    查看对应运行方式 <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <Link href="/guide/databases">
                    查看数据库与文件存储{" "}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </details>
            </div>
          ) : (
            <div className="starter-result">
              <div className="starter-result-heading">
                <div>
                  <h3>这次只做：{template.title}</h3>
                  <p>需求说明已生成，可以交给你的 AI 编程助手了。</p>
                </div>
                <CopyButton
                  text={prompt}
                  label="复制需求说明"
                  className="bg-action text-action-foreground hover:bg-action/85"
                />
              </div>
              <dl className="starter-result-summary">
                <div>
                  <dt>具体用途</dt>
                  <dd>
                    {answers.purpose.trim() || "尚未填写，AI 会先向你确认"}
                  </dd>
                </div>
                <div>
                  <dt>第一版功能</dt>
                  <dd>{answers.features.join("、")}</dd>
                </div>
                <div>
                  <dt>
                    {offline ? "运行方式" : native ? "可选后端" : "部署起点"}
                  </dt>
                  <dd>
                    {offline ? "在自己的电脑上运行，无需云平台" : current.name}
                  </dd>
                </div>
              </dl>
              {!answers.purpose.trim() && (
                <p className="starter-missing-purpose">
                  想让 AI 更快理解你？
                  <button type="button" onClick={() => goToStep(1)}>
                    返回补充具体用途
                  </button>
                  ，也可以复制后再和 AI 聊清楚。
                </p>
              )}
              <section
                className="starter-handoff"
                aria-labelledby="starter-handoff-title"
              >
                <h4 id="starter-handoff-title">复制后，放到哪里？</h4>
                <ol>
                  <li>
                    <strong>打开你自己的 AI 编程助手。</strong>
                    新项目先建一个文件夹；已有项目就打开原来的文件夹。
                  </li>
                  <li>
                    <strong>把需求说明粘贴到它的对话框。</strong>让 AI
                    先确认需求，再编写或修改代码。这里只生成说明，不会直接替你创建项目。
                  </li>
                  <li>
                    <strong>等 AI 做出第一版，再在本地试用。</strong>
                    能正常使用后，先检查数据保存，再发布到网上。
                  </li>
                </ol>
              </section>
              <details className="starter-full-prompt">
                <summary>
                  查看完整需求说明
                  <span>
                    {prompt.length.toLocaleString("zh-CN")} 字符{" "}
                    <ChevronDown size={17} aria-hidden="true" />
                  </span>
                </summary>
                <div className="prompt-preview">{prompt}</div>
              </details>
              {native && (
                <p className="starter-hint">
                  {deploymentProfiles[template.profile].delivery}
                </p>
              )}
              <div className="learning-links">
                <Link href={"/guide/local#" + template.localId}>
                  AI 写好后：本地预览与运行{" "}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                {!offline && (
                  <Link href={"/guide/cloud#" + platformId}>
                    了解所选平台 <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="prompt-controls">
        {step > 0 ? (
          <Button variant="outline" onClick={() => goToStep(step - 1)}>
            <ArrowLeft aria-hidden="true" />
            上一步
          </Button>
        ) : (
          <span className="starter-selection">
            {selectionInResults ? (
              <>
                已选：<strong>{template.title}</strong>
              </>
            ) : (
              "请从当前结果中选择一个场景"
            )}
          </span>
        )}
        {step < 2 ? (
          <Button
            disabled={
              step === 0 ? !selectionInResults : !answers.features.length
            }
            onClick={() => goToStep(step + 1)}
          >
            {step === 0 ? "继续，补充想法" : "生成需求说明"}
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : (
          <Button variant="outline" onClick={() => goToStep(0)}>
            <RotateCcw aria-hidden="true" />
            换个场景
          </Button>
        )}
      </div>
    </div>
  );
}
