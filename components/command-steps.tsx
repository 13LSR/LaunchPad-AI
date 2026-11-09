import { CodeBlock } from "@/components/copy-button";
import { explainCommand } from "@/lib/command-help";
export function CommandSteps({ code }: { code: string }) {
  const lines = code
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x && !x.startsWith("#"));
  return (
    <ol className="command-steps">
      {lines.map((line, i) => {
        const h = explainCommand(line);
        return (
          <li key={i} className="command-step-item">
            <div className="command-step-title">
              <span>{i + 1}</span>
              <h4>{h.title}</h4>
            </div>
            <p>{h.purpose}</p>
            <p>
              <strong>什么时候执行：</strong>
              {h.when}
            </p>
            <CodeBlock code={line} title="复制这一行 → 粘贴到终端 → 按回车" />
            <p className="command-success">
              <strong>成功后：</strong>
              {h.success}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
