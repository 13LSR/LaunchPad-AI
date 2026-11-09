"use client";
import { useState } from "react";
import {
  identifyLocalFiles,
  buildLocalInspection,
  type PythonTool,
} from "@/lib/local-run";
import type { PackageManager } from "@/lib/commands";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

const examples = [
  "next.config.ts, pnpm-lock.yaml",
  "package.json",
  "manage.py, requirements.txt",
  "uv.lock",
  "project.config.json",
  "compose.yaml",
  "pom.xml",
];
export function LocalFileFinder({
  onChoose,
}: {
  onChoose: (
    id: string,
    manager?: PackageManager,
    pythonTool?: PythonTool,
    files?: string,
  ) => void;
}) {
  const [files, setFiles] = useState("");
  const [selected, setSelected] = useState("");
  const result = identifyLocalFiles(files);
  const chosen = result.candidates.some((entry) => entry.id === selected)
    ? selected
    : result.candidates.length === 1
      ? result.candidates[0].id
      : "";
  function change(value: string) {
    setFiles(value);
    setSelected("");
  }
  return (
    <details className="local-file-finder">
      <summary>不知道技术栈？用项目里的文件名找一找</summary>
      <div>
        <p>
          在编辑器左侧看文件名，输入或点选下面的例子。这里只匹配你提供的名称，不会读取你的电脑文件；不用粘贴密钥或文件内容。
        </p>
        <label htmlFor="local-files">我在项目里看到了</label>
        <input
          id="local-files"
          className="tool-input"
          value={files}
          onChange={(event) => change(event.target.value)}
          maxLength={1500}
          placeholder="例如 next.config.ts、pnpm-lock.yaml"
        />
        <div className="local-file-examples" aria-label="文件名示例">
          {examples.map((example) => (
            <button key={example} onClick={() => change(example)}>
              {example}
            </button>
          ))}
        </div>
        {!!files.trim() && (
          <div className="local-file-result">
            <p role="status">{result.note}</p>
            {result.managers.length === 1 && (
              <p>
                <strong>锁文件对应：</strong>
                {result.managers[0]}
                。选择卡片后会切换相应命令；项目说明明确指定了其他工具时，先核对原因。
              </p>
            )}
            {result.managers.length > 1 && (
              <p>
                <strong>发现多种锁文件：</strong>
                可能属于不同子项目，先确认所在目录，不自动替你选工具。
              </p>
            )}
            {result.candidates.length > 0 && (
              <div className="local-file-choice">
                <label htmlFor="local-file-candidate">可能对应的项目</label>
                <select
                  id="local-file-candidate"
                  className="tool-input"
                  value={chosen}
                  onChange={(event) => setSelected(event.target.value)}
                >
                  <option value="">对照项目说明，选择一项</option>
                  {result.candidates.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.title}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  disabled={!chosen}
                  onClick={() =>
                    onChoose(
                      chosen,
                      result.managers.length === 1
                        ? result.managers[0]
                        : undefined,
                      result.pythonTools.length === 1
                        ? result.pythonTools[0]
                        : undefined,
                      files,
                    )
                  }
                >
                  查看这张运行卡片
                </Button>
              </div>
            )}
          </div>
        )}
        <CopyButton
          text={buildLocalInspection(undefined, undefined, files)}
          label="复制项目识别任务给 AI"
        />
        <p className="local-copy-help">
          复制后，粘贴给已打开这个项目的 AI
          编程助手。网页聊天看不到本地文件，需要你提供
          README、依赖清单等必要内容；不要提供真实密钥。
        </p>
      </div>
    </details>
  );
}
