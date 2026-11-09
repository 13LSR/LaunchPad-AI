"use client";
import { useState } from "react";
import type { CommandEntry } from "@/lib/command-data";
import {
  buildLocalTroubleshooting,
  type LocalRunOptions,
} from "@/lib/local-run";
import { CopyButton } from "@/components/copy-button";

export function LocalTroubleshooting({
  entry,
  options,
}: {
  entry: CommandEntry;
  options: LocalRunOptions;
}) {
  const [symptom, setSymptom] = useState("");
  const [command, setCommand] = useState("");
  const [error, setError] = useState("");
  const issues = symptom
    ? entry.issues.filter((issue) => issue.symptom === symptom)
    : entry.issues;
  return (
    <div className="local-troubleshooting">
      <label htmlFor={entry.id + "-symptom"}>你遇到了哪种情况？</label>
      <select
        id={entry.id + "-symptom"}
        className="tool-input"
        value={symptom}
        onChange={(event) => setSymptom(event.target.value)}
      >
        <option value="">还不确定，查看全部常见问题</option>
        {entry.issues.map((issue) => (
          <option key={issue.symptom}>{issue.symptom}</option>
        ))}
      </select>
      <div className="stack-issues">
        {issues.map((issue) => (
          <article key={issue.symptom}>
            <h4>{issue.symptom}</h4>
            <p>
              <strong>通常原因：</strong>
              {issue.cause}
            </p>
            <p>
              <strong>你可以这样做：</strong>
              {issue.fix}
            </p>
          </article>
        ))}
      </div>
      <details className="local-error-input">
        <summary>补充实际命令和报错（选填）</summary>
        <p>
          先去掉密钥、数据库密码和私人信息。内容只用于本页生成待复制的说明，不会保存或提交。
        </p>
        <label htmlFor={entry.id + "-command"}>实际执行的命令</label>
        <input
          id={entry.id + "-command"}
          className="tool-input"
          value={command}
          maxLength={1000}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="粘贴刚才在终端执行的那一行"
        />
        <label htmlFor={entry.id + "-error"}>报错内容</label>
        <textarea
          id={entry.id + "-error"}
          className="tool-input"
          rows={4}
          value={error}
          maxLength={12000}
          onChange={(event) => setError(event.target.value)}
          placeholder="从第一个错误开始，保留相关上下文"
        />
      </details>
      <CopyButton
        label="复制针对本项目的排错说明"
        text={buildLocalTroubleshooting(
          entry,
          options,
          symptom,
          command,
          error,
        )}
      />
      <p className="local-copy-help">
        把说明发给帮你开发这个项目的 AI，再按它针对实际报错给出的步骤处理。
      </p>
    </div>
  );
}
