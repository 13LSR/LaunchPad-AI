"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileImage,
  Film,
  Music2,
  Sparkles,
} from "lucide-react";
import { AnimatedDisclosure } from "@/components/animated-disclosure";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { useHashTarget } from "@/components/use-hash-target";
import {
  buildMediaIntegrationTask,
  buildMediaTask,
  defaultMediaContext,
  getMediaAdvice,
  mediaEnvironments,
  mediaIssues,
  mediaKinds,
  mediaStorage,
  mediaTools,
  type MediaContext,
} from "@/lib/media-guide";
import "./media-guide.css";

export function MediaGuide() {
  const [context, setContext] = useState<MediaContext>(defaultMediaContext);
  const [task, setTask] = useState("");
  const [generation, setGeneration] = useState(0);
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  const result = useRef<HTMLHeadingElement>(null);
  const { kind, issue, storage, checks } = getMediaAdvice(context);

  function update(patch: Partial<MediaContext>) {
    setContext((previous) => ({ ...previous, ...patch }));
    setTask("");
  }

  useHashTarget((id) => {
    const target = mediaKinds.find((item) => id === `media-kind-${item.id}`);
    if (target) update({ kind: target.id });
    const problem = mediaIssues.find((item) => id === `media-issue-${item.id}`);
    if (problem) {
      setDiagnosisOpen(true);
      update({ issue: problem.id });
    }
  });

  useEffect(() => {
    if (!generation) return;
    result.current?.focus({ preventScroll: true });
    result.current?.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [generation]);

  return (
    <div className="media-guide">
      <section id="media-plan" aria-label="选择素材和处理工具">
        <fieldset className="media-kind-field">
          <legend>你要处理哪种素材？</legend>
          <div className="media-kinds">
            {mediaKinds.map((item) => (
              <label
                key={item.id}
                id={`media-kind-${item.id}`}
                className="media-kind"
              >
                <input
                  type="radio"
                  name="media-kind"
                  value={item.id}
                  checked={context.kind === item.id}
                  onChange={() => update({ kind: item.id })}
                />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.example}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div
          className="media-format-advice"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3>{kind.format}</h3>
          <p>{kind.reason}</p>
          <p>
            <strong>处理时留意：</strong>
            {kind.watch}
          </p>
          <Link href="#media-format">
            看懂这些格式的区别 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section
        className="media-tool-library"
        id="media-tools"
        aria-labelledby="media-tools-title"
      >
        <div className="media-tool-library-heading">
          <div>
            <h3 id="media-tools-title">选一个工具，照着步骤处理</h3>
            <p>
              {context.kind === "mixed"
                ? "先把图片、动图、视频和音频分开，再按下面的用途选工具。"
                : "按你的电脑系统和用途，选下面一个合适的工具即可。"}
              先留好原文件，处理两三份样本；确认清晰、体积合适后，再处理其余素材。
            </p>
          </div>
        </div>
        <ul className="media-tool-list">
          {mediaTools
            .filter((tool) => tool.kinds.includes(context.kind))
            .map((tool) => {
              const Icon =
                tool.id === "handbrake"
                  ? Film
                  : tool.id === "audacity"
                    ? Music2
                    : FileImage;
              return (
                <li key={tool.id}>
                  <div className="media-tool-heading">
                    <Icon size={19} />
                    <h3>{tool.name}</h3>
                    <span>{tool.environment}</span>
                  </div>
                  <h4>{tool.use}</h4>
                  <p>{tool.note}</p>
                  <div className="media-tool-actions">
                    <a href={tool.url} target="_blank" rel="noreferrer">
                      打开 {tool.name} 官网 <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <ol className="media-tool-instructions">
                    {tool.steps.map((step) => (
                      <li key={step.title}>
                        <strong>{step.title}</strong>
                        <p>{step.body}</p>
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
        </ul>
        <p>
          网站有持续上传、需要自动生成多种尺寸时，再了解{" "}
          <Link href="/guide/databases#database-17">Cloudinary 等媒体服务</Link>
          。自己准备网站配图，可以先用上面的工具。
        </p>
      </section>

      <section className="media-finish" aria-labelledby="media-finish-title">
        <h3 id="media-finish-title">导出后，先自己看一遍</h3>
        <ul className="media-checks">
          <li>
            <Check size={17} />
            <span>{kind.check}</span>
          </li>
          <li>
            <Check size={17} />
            <span>
              对比原件和新文件的大小。没有明显收益，就保留更清楚或更合适的版本，不必强行换格式。
            </span>
          </li>
          <li>
            <Check size={17} />
            <span>
              把新文件放到单独的文件夹，保留原件；之后替换网站素材时，确认实际页面能正常显示或播放。
            </span>
          </li>
        </ul>
        <details className="media-options" id="media-integrate">
          <summary>
            文件处理好了，不知道怎么放回项目？<span>可选 · 让 AI 修改引用</span>
          </summary>
          <p>
            先把导出的文件放进项目文件夹，再在能读取项目的 AI
            编程工具里粘贴下面的任务，告诉它文件位置和要替换的素材。它会帮你更新页面引用；正式发布前，先在本地看效果。
          </p>
          <CopyButton
            text={buildMediaIntegrationTask(context.kind)}
            label="复制接回项目的任务"
          />
          <AnimatedDisclosure title="查看接入任务内容">
            <p className="media-task-text">
              {buildMediaIntegrationTask(context.kind)}
            </p>
          </AnimatedDisclosure>
          <div className="media-result-links">
            <Link href="/guide/local">
              先在本地看效果 <ArrowRight size={14} />
            </Link>
            <Link href="/guide/cli">
              把修改发布到网站 <ArrowRight size={14} />
            </Link>
          </div>
        </details>
      </section>

      <details
        className="media-options media-diagnosis"
        id="media-diagnosis"
        open={diagnosisOpen}
        onToggle={(event) => setDiagnosisOpen(event.currentTarget.open)}
      >
        <summary>
          放进网站后有问题？<span>可选 · 缺图、变糊、加载慢或上传丢失</span>
        </summary>
        <p>
          先选你遇到的情况。找不到文件不一定是格式问题，不用为了排错重新压缩一遍。
        </p>
        <div className="media-fields">
          <label>
            现在最想解决什么？
            <select
              className="tool-input"
              value={context.issue}
              onChange={(e) =>
                update({ issue: e.target.value as MediaContext["issue"] })
              }
            >
              {mediaIssues.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            这些文件属于哪一种？
            <select
              className="tool-input"
              value={context.storage}
              onChange={(e) =>
                update({ storage: e.target.value as MediaContext["storage"] })
              }
            >
              {mediaStorage.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="media-direction" aria-live="polite">
          <div id={`media-issue-${issue.id}`}>
            <h3>{issue.action}</h3>
            <p>{issue.advice}</p>
          </div>
          <div>
            <h3>{storage.title}</h3>
            <p>{storage.advice}</p>
            <Link href={storage.href}>
              {storage.link} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <details className="media-options">
          <summary>
            补充项目情况，让 AI 更容易定位 <span>选填</span>
          </summary>
          <label>
            这个素材用在什么项目里？
            <select
              className="tool-input"
              value={context.environment}
              onChange={(e) =>
                update({
                  environment: e.target.value as MediaContext["environment"],
                })
              }
            >
              {mediaEnvironments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            文件用在哪里？具体有什么异常？
            <textarea
              className="tool-input"
              rows={3}
              maxLength={1200}
              value={context.detail}
              onChange={(e) => update({ detail: e.target.value })}
              placeholder="例如：首页产品演示视频约 40 MB，手机点播放要等很久。"
              aria-describedby="media-detail-help"
            />
          </label>
          <p id="media-detail-help">
            不清楚技术就保持默认。这里只整理你填写的文字；不要粘贴密码、密钥或私密下载链接。
          </p>
        </details>
        <div className="media-generate">
          <Button
            size="lg"
            onClick={() => {
              setTask(buildMediaTask(context));
              setGeneration((value) => value + 1);
            }}
          >
            <Sparkles size={16} />
            生成排查任务
          </Button>
          <p>复制给能读取项目的 AI，先找出原因，再修复当前问题。</p>
        </div>
        {task && (
          <section
            className="media-result"
            aria-labelledby="media-result-title"
            key={generation}
          >
            <div className="media-result-heading">
              <h3 id="media-result-title" tabIndex={-1} ref={result}>
                排查任务已准备好
              </h3>
              <CopyButton text={task} label="复制媒体排查任务" />
            </div>
            <p className="media-result-context">
              {kind.label} · {issue.label}
            </p>
            <p>
              在 AI
              编程工具中打开项目，粘贴任务。它会检查引用、路径和加载方式；如果用普通聊天工具，让它先说明需要哪些文件。
            </p>
            <AnimatedDisclosure title="查看完整任务内容">
              <p className="media-task-text">{task}</p>
            </AnimatedDisclosure>
            <h4>怎么知道处理好了？</h4>
            <ul className="media-checks">
              {checks.map((item) => (
                <li key={item}>
                  <Check size={17} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="media-result-links">
              <Link href="/guide/local">
                先在本地看效果 <ArrowRight size={14} />
              </Link>
              <Link href="/guide/cli">
                把修改发布到网站 <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}
      </details>
    </div>
  );
}
