"use client";
import Link from "next/link";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deploymentProfiles, type DeploymentProfile } from "@/lib/prompt-data";
import {
  getDeploymentRanking,
  getRecommendedPlatform,
  tiers,
  type ProjectUse,
} from "@/lib/deployment-ranking";
import { platforms } from "@/lib/platforms";

export function DeploymentPicker({
  profile,
  use,
  platformId,
  onSelect,
}: {
  profile: DeploymentProfile;
  use: ProjectUse;
  platformId: string;
  onSelect: (id: string) => void;
}) {
  const ranking = getDeploymentRanking(profile, use);
  const recommended = getRecommendedPlatform(profile, use);
  const selected =
    ranking.find((r) => r.platformId === platformId && r.compatible) ||
    recommended;
  const platform = platforms.find((p) => p.id === selected.platformId)!;
  const native = [
    "wechat",
    "miniapp",
    "mobile",
    "desktop",
    "extension",
  ].includes(profile);
  if (profile === "offline")
    return (
      <section className="starter-plan" aria-labelledby="starter-plan-title">
        <h3 id="starter-plan-title">这个项目先在自己的电脑上运行</h3>
        <p>
          本地文件整理不需要开通云平台或数据库。需求说明会让 AI
          提供先预览、再处理文件的操作步骤。
        </p>
        <p className="starter-plan-note">
          以后需要定时远程运行，再选择云服务。
        </p>
      </section>
    );
  return (
    <section
      className="starter-deployment"
      aria-labelledby="starter-plan-title"
    >
      <h3 id="starter-plan-title">
        {native
          ? "需要联网功能时，后端放哪里？"
          : "以后准备上线，可以先用这个方案"}
      </h3>
      <p className="starter-hint">
        {native
          ? "这里选的是保存数据、处理请求的后台服务。小程序、App 或插件本身要通过对应工具发布。"
          : "云平台负责让别人也能打开你的项目。暂时不懂怎么选，可以先保留推荐方案，开发完成后再验证是否适合。"}
      </p>
      {native && (
        <p className="scenario-boundary">
          {deploymentProfiles[profile].delivery}
        </p>
      )}
      <div className="starter-plan" aria-live="polite">
        <div className="starter-plan-heading">
          <strong>{platform.name}</strong>
          <span>
            {selected.platformId === recommended.platformId
              ? "推荐起点"
              : "你的选择"}
          </span>
        </div>
        <dl>
          <div>
            <dt>适合的原因</dt>
            <dd>{selected.reason}</dd>
          </div>
          <div>
            <dt>费用与额度</dt>
            <dd>
              {use === "commercial" && platform.id === "cloud-0"
                ? "商业用途需要 Vercel 付费方案，不能使用免费的 Hobby。"
                : platform.allowance}
            </dd>
          </div>
          <div>
            <dt>需要留意</dt>
            <dd>{selected.tradeoff}</dd>
          </div>
        </dl>
        <div className="ranking-links">
          <Link href={"/guide/cloud#" + platform.id}>
            查看完整套餐与适用场景 <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <details className="starter-comparison">
        <summary>
          比较其他平台（从夯到拉）
          <ChevronDown size={17} aria-hidden="true" />
        </summary>
        <div className="deployment-ranking" id="scenario-ranking">
          <p>
            按这个项目的兼容性、上手难度、资源限制和商业用途排序。档位只代表当前场景的适合程度，免费额度不等于零成本。
          </p>
          {tiers.map((tier, index) => (
            <section className={"tier-row tier-" + index} key={tier}>
              <span className="tier-name">{tier}</span>
              <div>
                {ranking.filter((r) => r.tier === tier).length === 0 && (
                  <p className="starter-hint">这个场景暂时没有这一档的方案。</p>
                )}
                {ranking
                  .filter((r) => r.tier === tier)
                  .map((choice) => {
                    const p = platforms.find(
                      (p) => p.id === choice.platformId,
                    )!;
                    return (
                      <article className="ranked-platform" key={p.id}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <strong>{p.name}</strong>
                          <Button
                            size="sm"
                            variant={
                              platform.id === p.id ? "default" : "outline"
                            }
                            disabled={!choice.compatible}
                            aria-pressed={platform.id === p.id}
                            onClick={() => onSelect(p.id)}
                          >
                            {!choice.compatible
                              ? "不适合作为完整方案"
                              : platform.id === p.id
                                ? "已选方案"
                                : "选择此方案"}
                          </Button>
                        </div>
                        <p>{choice.reason}</p>
                        <p className="ranking-caveat">
                          <strong>要接受的取舍：</strong>
                          {choice.tradeoff}
                        </p>
                        <div className="ranking-links">
                          <Link href={"/guide/cloud#" + p.id}>
                            查看额度与平台说明{" "}
                            <ArrowRight size={13} aria-hidden="true" />
                          </Link>
                          <a href={p.source} target="_blank" rel="noreferrer">
                            官方说明{" "}
                            <ExternalLink size={12} aria-hidden="true" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </details>
    </section>
  );
}
