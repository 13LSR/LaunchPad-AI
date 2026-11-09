"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  buildDatabaseInspection,
  dataPurposes,
  existingDatabases,
  getDatabaseAdvice,
  type DataPurpose,
  type ExistingDatabase,
} from "@/lib/database-catalog";
import { databases } from "@/lib/platforms";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";

export function DatabasePlanner({
  purpose,
  existing,
  onChange,
  onCompare,
}: {
  purpose: DataPurpose;
  existing: ExistingDatabase;
  onChange: (purpose: DataPurpose, existing: ExistingDatabase) => void;
  onCompare: (ids: string[]) => void;
}) {
  const advice = getDatabaseAdvice(purpose, existing);
  const ids = [...new Set(advice.groups.flatMap((group) => group.ids))];
  return (
    <section id="database-choose" className="database-planner">
      <h3>先回答：你的项目要保存什么？</h3>
      <p>
        不需要先学会数据库。按自己的需求选择；已经写好的项目，优先沿用它支持的类型。
      </p>
      <div className="database-form-grid">
        <div>
          <label htmlFor="data-purpose">我想实现的功能</label>
          <select
            id="data-purpose"
            className="tool-input"
            value={purpose}
            onChange={(event) =>
              onChange(event.target.value as DataPurpose, existing)
            }
          >
            {dataPurposes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {purpose !== "none" && (
          <div>
            <label htmlFor="data-existing">项目现在用的数据库</label>
            <select
              id="data-existing"
              className="tool-input"
              value={existing}
              onChange={(event) =>
                onChange(purpose, event.target.value as ExistingDatabase)
              }
            >
              {existingDatabases.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="database-advice" aria-live="polite">
        <h4>{advice.title}</h4>
        <p>{advice.body}</p>
        {advice.groups.map((group) => (
          <div className="database-advice-group" key={group.label}>
            <strong>
              {group.label}：
              {group.ids
                .map(
                  (id) => databases.find((service) => service.id === id)!.name,
                )
                .join(" / ")}
            </strong>
            <p>{group.reason}</p>
          </div>
        ))}
        {purpose === "none" ? (
          <Link className="source-link" href="/guide/cloud">
            先选择网站部署平台 <ArrowRight size={14} />
          </Link>
        ) : (
          <div className="database-advice-actions">
            {ids.length > 0 && (
              <Button size="sm" onClick={() => onCompare(ids)}>
                只比较这些候选 <ArrowRight size={14} />
              </Button>
            )}
            <CopyButton
              text={buildDatabaseInspection(purpose, existing)}
              label="复制数据需求检查任务给 AI"
            />
          </div>
        )}
      </div>
      <p className="database-help">
        检查任务发给能读取项目的 AI 编程助手。网页聊天看不到本地代码，需要你提供
        README、依赖清单等必要内容，不要提供密钥。
      </p>
    </section>
  );
}
