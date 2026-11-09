import Link from "next/link";
import { CommandSteps } from "@/components/command-steps";
import { ArrowUpRight } from "lucide-react";
import { CodeBlock, CopyButton } from "@/components/copy-button";
import { AnimatedDisclosure } from "@/components/animated-disclosure";
import type { GuideSection } from "@/lib/guide-content";
import { LocalRecovery } from "@/components/local-recovery";
export function GuideSections({
  sections,
  collapsible = false,
}: {
  sections: GuideSection[];
  collapsible?: boolean;
}) {
  return sections.map((section) =>
    collapsible ? (
      <details
        className="knowledge-disclosure"
        id={section.id}
        key={section.id}
      >
        <summary>
          {section.title}
          <span>按需了解</span>
        </summary>
        <GuideSections
          sections={[{ ...section, id: section.id + "-content" }]}
        />
      </details>
    ) : (
      <section className="learning-section" id={section.id} key={section.id}>
        <h2>{section.title}</h2>
        {section.paragraphs?.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {section.steps && (
          <ol className="learning-steps">
            {section.steps.map((step, i) => (
              <li key={step.title}>
                <span className="learning-step-number">{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
        {section.table && (
          <div
            className="learning-table-wrap"
            tabIndex={0}
            aria-label={section.title + "对照表"}
          >
            <table className="learning-table">
              <thead>
                <tr>
                  {section.table.headers.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) =>
                      j === 0 ? (
                        <th scope="row" key={j}>
                          {cell}
                        </th>
                      ) : (
                        <td key={j}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {section.id.startsWith("local-help") ? (
          <LocalRecovery />
        ) : (
          section.items && (
            <div className="learning-items">
              {section.items.map((item) => (
                <article
                  key={item.title}
                  className={item.prompt ? "learning-prompt" : "learning-item"}
                >
                  <div className="learning-item-title">
                    <h3>{item.title}</h3>
                    {item.prompt && (
                      <CopyButton text={item.prompt} label="复制给 AI" />
                    )}
                  </div>
                  {item.body && <p>{item.body}</p>}
                  {item.prompt && (
                    <AnimatedDisclosure title="查看这份说明">
                      <p className="whitespace-pre-wrap">{item.prompt}</p>
                    </AnimatedDisclosure>
                  )}
                </article>
              ))}
            </div>
          )
        )}
        {section.codes?.map((c) =>
          section.id.startsWith("local-") ? (
            <div key={c.title}>
              <h3 className="mt-6 font-semibold">{c.title}</h3>
              <CommandSteps code={c.code} />
            </div>
          ) : (
            <CodeBlock key={c.title} title={c.title} code={c.code} />
          ),
        )}
        {section.links && (
          <div className="learning-links">
            {section.links.map((l) => (
              <Link
                key={l.url}
                href={l.url}
                {...(l.url.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {l.label}
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        )}
      </section>
    ),
  );
}
