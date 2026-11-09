"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CliCommands } from "@/components/cli-commands";
import { cliWorkflows } from "@/lib/cli-workflows";
import { useHashTarget } from "@/components/use-hash-target";
import { availablePlatforms } from "@/lib/platforms";
import { platformFits } from "@/lib/platform-fit";
import {
  artifactLabels,
  buildDeploymentTask,
  deploymentChecks,
  deploymentContextFromSearch,
  deploymentModes,
  failureLabels,
  type DeploymentMode,
  type DeploymentTaskAnswers,
} from "@/lib/deployment-task";
import "./cli-guide.css";

const workflowPlatforms: Record<string, string> = {
  "cli-vercel": "cloud-0",
  "cli-cloudflare": "cloud-1",
  "cli-railway": "cloud-11",
  "cli-fly": "cloud-12",
  "cli-huggingface": "cloud-7",
};

export function CliGuide() {
  const [active, setActive] = useState(cliWorkflows[0].id);
  const [advanced, setAdvanced] = useState(false);
  const [answers, setAnswers] = useState<DeploymentTaskAnswers>({
    mode: "launch",
    platformId: "unknown",
    stage: "unknown",
    data: "unknown",
    budget: "free",
    assistant: "unknown",
    purpose: "unknown",
    artifact: "unknown",
    goal: "",
    operation: "",
    logs: "",
    failure: "unknown",
  });
  const [task, setTask] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const result = useRef<HTMLHeadingElement>(null);
  const mode = answers.mode ?? "launch";
  const config = deploymentModes[mode];
  const selected = availablePlatforms.find((p) => p.id === answers.platformId);
  const fit = selected ? platformFits[selected.id] : undefined;
  const checklist = deploymentChecks(answers);

  function update(patch: Partial<DeploymentTaskAnswers>) {
    setAnswers((previous) => ({ ...previous, ...patch }));
    setTask(null);
    setDone([]);
  }
  useHashTarget((id) => {
    if (cliWorkflows.some((w) => w.id === id)) {
      setActive(id);
      setAdvanced(true);
      if (workflowPlatforms[id]) update({ platformId: workflowPlatforms[id] });
    }
    if (id === "cli-commands") setAdvanced(true);
    if (
      id.startsWith("deploy-") &&
      availablePlatforms.some((p) => p.id === id.slice(7))
    ) {
      const platformId = id.slice(7);
      update({
        platformId,
        mode: "launch",
        ...deploymentContextFromSearch(location.search),
      });
      setAdvanced(false);
      const workflow = platformFits[platformId]?.workflow;
      if (workflow) setActive(workflow);
    }
  });
  useEffect(() => {
    if (!task) return;
    const frame = requestAnimationFrame(() => {
      result.current?.focus({ preventScroll: true });
      result.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [task, generation]);

  return (
    <div className="deployment-assistant">
      <section
        id="cli-task"
        className="scroll-mt-24"
        aria-labelledby="cli-task-heading"
      >
        <h3 id="cli-task-heading">这次想让 AI 帮你做什么？</h3>
        <Tabs
          value={mode}
          onValueChange={(value) => update({ mode: value as DeploymentMode })}
        >
          <TabsList className="deployment-modes" aria-label="部署任务类型">
            {Object.entries(deploymentModes).map(([id, item]) => (
              <TabsTrigger key={id} value={id}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="deployment-mode-description">
          {config.description} 不确定的选项可以保留，让 AI 先检查项目。
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setDone([]);
            setTask(buildDeploymentTask(answers));
            setGeneration((count) => count + 1);
          }}
        >
          <div
            id={selected ? "deploy-" + selected.id : "deploy-start"}
            className="scroll-mt-24 deployment-fields"
          >
            <label>
              你做的是什么作品？
              <select
                className="tool-input"
                value={answers.artifact}
                onChange={(e) =>
                  update({
                    artifact: e.target
                      .value as DeploymentTaskAnswers["artifact"],
                  })
                }
              >
                {Object.entries(artifactLabels).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              准备部署到哪里？
              <select
                className="tool-input"
                value={answers.platformId}
                onChange={(e) => {
                  update({ platformId: e.target.value });
                  const workflow = platformFits[e.target.value]?.workflow;
                  if (workflow) setActive(workflow);
                }}
              >
                <option value="unknown">
                  {mode === "launch"
                    ? "还没选，让 AI 根据项目推荐"
                    : "不清楚，让 AI 识别原来的平台"}
                </option>
                {availablePlatforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              要保存用户或业务数据吗？
              <select
                className="tool-input"
                value={answers.data}
                onChange={(e) =>
                  update({
                    data: e.target.value as DeploymentTaskAnswers["data"],
                  })
                }
              >
                <option value="unknown">
                  不清楚，让 AI 检查登录、数据和上传
                </option>
                <option value="none">只展示内容或在本机处理</option>
                <option value="needed">需要，还没准备数据库或文件存储</option>
                <option value="existing">已有数据库或文件存储</option>
              </select>
            </label>
            <label>
              你用的 AI 能操作项目吗？
              <select
                className="tool-input"
                value={answers.assistant}
                onChange={(e) =>
                  update({
                    assistant: e.target
                      .value as DeploymentTaskAnswers["assistant"],
                  })
                }
              >
                <option value="unknown">不清楚，先让它说明能力</option>
                <option value="agent">可以读取文件、修改代码和运行命令</option>
                <option value="chat">只有聊天窗口，需要我自己动手</option>
              </select>
            </label>
          </div>
          {answers.artifact === "miniapp" && (
            <p className="deployment-context-note">
              小程序前端需要微信开发者工具和后台审核；这里的云平台用于它需要的后端。
              <Link href="/guide/local#local-wechat">
                查看小程序运行方法 <ArrowRight size={13} />
              </Link>
            </p>
          )}
          {answers.artifact === "script" && (
            <p className="deployment-context-note">
              只在自己电脑上使用的脚本可以不上云。需要离开电脑后仍自动运行时，再让
              AI 选择定时任务或后台服务。
            </p>
          )}
          {selected && (
            <details className="knowledge-disclosure deployment-platform-info">
              <summary>{selected.name} 适合什么？费用怎么计算？</summary>
              <p>
                {fit?.reason} {fit?.tradeoff}
              </p>
              <p>
                {selected.allowance}。{selected.limit}
              </p>
              <Link href={"/guide/cloud#" + selected.id}>
                查看平台详情 <ArrowRight size={13} />
              </Link>
            </details>
          )}
          <details className="knowledge-disclosure deployment-options">
            <summary>
              补充项目情况与预算<span>默认优先免费，不会自动购买</span>
            </summary>
            <div className="deployment-fields">
              <label>
                项目在电脑上跑起来了吗？
                <select
                  className="tool-input"
                  value={answers.stage}
                  onChange={(e) =>
                    update({
                      stage: e.target.value as DeploymentTaskAnswers["stage"],
                    })
                  }
                >
                  <option value="unknown">不确定 / 还有报错</option>
                  <option value="ready">已跑通主要功能</option>
                </select>
              </label>
              <label>
                费用怎么考虑？
                <select
                  className="tool-input"
                  value={answers.budget}
                  onChange={(e) =>
                    update({
                      budget: e.target.value as DeploymentTaskAnswers["budget"],
                    })
                  }
                >
                  <option value="free">优先免费，不够用先告诉我</option>
                  <option value="review">可以付费，先给我价格再决定</option>
                </select>
              </label>
              <label>
                项目会用于商业用途吗？
                <select
                  className="tool-input"
                  value={answers.purpose}
                  onChange={(e) =>
                    update({
                      purpose: e.target
                        .value as DeploymentTaskAnswers["purpose"],
                    })
                  }
                >
                  <option value="unknown">不确定，让 AI 帮我判断</option>
                  <option value="personal">个人学习 / 非商业作品</option>
                  <option value="commercial">接单 / 收费 / 企业业务</option>
                </select>
              </label>
            </div>
          </details>
          <label className="deployment-text-field">
            {mode === "update"
              ? "这次改了什么？（可选）"
              : "希望完成什么？（可选）"}
            <textarea
              className="tool-input"
              rows={2}
              maxLength={1500}
              value={answers.goal}
              placeholder={
                mode === "update"
                  ? "例如：报名网站新增了上传图片，希望更新后旧报名记录还能正常查看。"
                  : "例如：让别人能打开我的报名网站，提交信息后我能查看记录。"
              }
              onChange={(e) => update({ goal: e.target.value })}
            />
          </label>
          {mode === "repair" && (
            <div className="deployment-repair">
              <h4>把真正遇到的问题带给 AI</h4>
              <label className="deployment-text-field">
                卡在哪一步？
                <select
                  className="tool-input"
                  value={answers.failure}
                  onChange={(e) =>
                    update({
                      failure: e.target
                        .value as DeploymentTaskAnswers["failure"],
                    })
                  }
                >
                  {Object.entries(failureLabels).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="deployment-text-field">
                你做了什么操作？（可选）
                <textarea
                  className="tool-input"
                  rows={2}
                  maxLength={1500}
                  value={answers.operation}
                  placeholder="例如：点了报名表的提交按钮，一直转圈，后台没有新增记录。也可以填写实际执行的命令。"
                  onChange={(e) => update({ operation: e.target.value })}
                />
              </label>
              <label className="deployment-text-field">
                报错内容（可选，先去掉密钥与个人信息）
                <textarea
                  className="tool-input"
                  rows={4}
                  maxLength={6000}
                  value={answers.logs}
                  aria-describedby="deployment-log-help"
                  placeholder="粘贴第一处错误及其前后几行。没有日志也能生成任务，让 AI 告诉你去哪找。"
                  onChange={(e) => update({ logs: e.target.value })}
                />
              </label>
              <p id="deployment-log-help">
                这里的内容仅用于在浏览器内生成任务，不保存。复制前去掉密码、Token
                和完整数据库连接串；保留变量名与错误码。
              </p>
            </div>
          )}
          <div className="deployment-generate">
            <Button type="submit">
              生成{config.action}任务 <ArrowRight size={16} />
            </Button>
            <span>生成后复制给你的 AI，本站不会代你发布。</span>
          </div>
        </form>
        <div className="learning-links">
          <Link href="/guide/local">
            先在电脑上跑通 <ArrowRight size={14} />
          </Link>
          <Link href="/guide/databases#database-choose">
            准备数据库与文件存储 <ArrowRight size={14} />
          </Link>
          <Link href="/guide/cloud">
            比较平台和费用 <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      {task && (
        <section
          className="deployment-result"
          aria-labelledby="deployment-result-heading"
        >
          <h3 id="deployment-result-heading" ref={result} tabIndex={-1}>
            你的{config.action}任务已准备好
          </h3>
          <p>
            {selected
              ? selected.name
              : mode === "launch"
                ? "由 AI 检查项目后推荐平台"
                : "先确认已有平台与项目"}{" "}
            · {answers.budget === "free" ? "优先免费" : "费用确认后再操作"}
          </p>
          <CopyButton
            key={task}
            label={`复制${config.action}任务给 AI`}
            text={task}
          />
          <details className="knowledge-disclosure deployment-task-preview">
            <summary>查看完整任务内容</summary>
            <p className="whitespace-pre-wrap">{task}</p>
          </details>
          <ol className="learning-steps deployment-handoff">
            <li>
              <span className="learning-step-number">1</span>
              <div>
                <h4>
                  {answers.assistant === "chat"
                    ? "粘贴到你的 AI 聊天窗口"
                    : "在 AI 编程工具里打开项目，再粘贴任务"}
                </h4>
                <p>
                  {answers.assistant === "chat"
                    ? "按 AI 提示提供需要的文件片段，它会一步一步指导你操作。不要发送密钥或完整 .env 文件。"
                    : "确认打开的是这次要操作的项目文件夹。AI 会先确认自己能否读文件、运行终端，再检查实际项目。"}
                </p>
              </div>
            </li>
            <li>
              <span className="learning-step-number">2</span>
              <div>
                <h4>配合登录，确认项目和费用</h4>
                <p>
                  在平台官方页面完成登录或授权。让 AI
                  指明账号、项目和下一步影响；出现费用、正式数据修改或正式发布时，先看清具体方案再决定。
                </p>
              </div>
            </li>
            <li>
              <span className="learning-step-number">3</span>
              <div>
                <h4>
                  {mode === "repair"
                    ? "重做出错的操作，确认真的修好了"
                    : "拿到作品后，亲自试一次"}
                </h4>
                <p>
                  测试地址和正式发布是不同状态。让 AI
                  说明当前交付的是什么，再按下方清单体验主要功能。
                </p>
              </div>
            </li>
          </ol>
          <fieldset className="deployment-checklist">
            <legend>我已亲自验证</legend>
            {checklist.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={done.includes(item)}
                  onChange={(e) =>
                    setDone((items) =>
                      e.target.checked
                        ? [...items, item]
                        : items.filter((x) => x !== item),
                    )
                  }
                />
                {item}
              </label>
            ))}
            <p aria-live="polite">
              已勾选 {done.length} / {checklist.length}{" "}
              项。修改上面的条件后，需要重新生成任务并验收。
            </p>
          </fieldset>
        </section>
      )}
      <details
        id="cli-commands"
        className="knowledge-disclosure cli-technical scroll-mt-24"
        open={advanced}
        onToggle={(e) => setAdvanced(e.currentTarget.open)}
      >
        <summary>
          我想了解具体命令（进阶参考）<span>按操作展开，不用全部执行</span>
        </summary>
        <p className="deployment-command-intro">
          先让 AI
          根据项目确认工具版本、目录和参数。下面每组只解决一件事，复制一行、执行一行。保存代码、部署网站和修改数据库是不同操作。
        </p>
        {selected && !fit?.workflow && (
          <p className="deployment-context-note">
            {selected.name}{" "}
            没有本站整理的命令卡片。使用上面的任务，按这个平台自己的控制台或官方工具操作。
            <a href={selected.source} target="_blank" rel="noreferrer">
              打开 {selected.name} 官方说明 <ExternalLink size={13} />
            </a>
          </p>
        )}
        <CliCommands active={active} onSelect={setActive} />
      </details>
    </div>
  );
}
