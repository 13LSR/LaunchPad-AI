"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { availablePlatforms } from "@/lib/platforms";
import { cloudGuides } from "@/lib/cloud-guides";
import { platformFits } from "@/lib/platform-fit";
import {
  cloudDeployHref,
  buildCloudSelectionTask,
  type CloudContext,
} from "@/lib/cloud-catalog";

export function CloudComparison({
  ids,
  context,
  onRemove,
  onClear,
}: {
  ids: string[];
  context: CloudContext;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const selected = ids.map((id) =>
    availablePlatforms.find((p) => p.id === id)!,
  );
  return (
    <section
      id="cloud-compare"
      className="cloud-comparison scroll-mt-24"
      aria-labelledby="cloud-compare-title"
    >
      <div className="cloud-section-heading">
        <h3 id="cloud-compare-title" tabIndex={-1}>
          把候选放在一起看
        </h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          清空比较
        </Button>
      </div>
      <p>
        已选 {ids.length} / 3
        个平台。先看能不能运行你的项目，再比较费用与等待时间。
      </p>
      {ids.length === 1 && (
        <p>还可以从下方卡片加入两个平台；跨页选择会保留。</p>
      )}
      <div
        className="cloud-comparison-scroll"
        tabIndex={0}
        role="region"
        aria-label="部署平台比较表，可横向滚动"
      >
        <table>
          <caption className="sr-only">
            候选部署平台的费用、运行与数据保存方式
          </caption>
          <thead>
            <tr>
              <th scope="col">比较什么</th>
              {selected.map((p) => (
                <th scope="col" key={p.id}>
                  <span>{p.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={"移除 " + p.name}
                    onClick={() => onRemove(p.id)}
                  >
                    <X size={14} />
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: "适合用来做什么",
                value: (id: string) => platformFits[id].useCases.join("；"),
              },
              {
                label: "费用从哪里开始",
                value: (id: string) =>
                  cloudGuides[id].costLabel + "。" + cloudGuides[id].billing,
              },
              {
                label: "包含的额度",
                value: (id: string) =>
                  availablePlatforms.find((p) => p.id === id)!.allowance,
              },
              {
                label: "要不要等待唤醒",
                value: (id: string) => cloudGuides[id].sleep,
              },
              {
                label: "记录与图片放哪里",
                value: (id: string) => cloudGuides[id].storage,
              },
              {
                label: "上线从哪里开始",
                value: (id: string) => cloudGuides[id].start,
              },
            ].map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {selected.map((p) => (
                  <td key={p.id}>{row.value(p.id)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">选好之后</th>
              {selected.map((p) => (
                <td key={p.id}>
                  <Link href={cloudDeployHref(p.id, context)}>
                    让 AI 帮我部署到 {p.name}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <CopyButton
        label="复制这组平台的比较任务"
        text={buildCloudSelectionTask(context, ids)}
      />
    </section>
  );
}
