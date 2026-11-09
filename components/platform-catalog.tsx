"use client";
import Link from "next/link";
import { ArrowUpRight, Check, Cloud } from "lucide-react";
import { type Platform, availablePlatforms } from "@/lib/platforms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
export function PlatformMark({ platform }: { platform: Platform }) {
  return (
    <span className={"platform-mark " + platform.color} aria-hidden="true">
      {platform.name.includes("Cloudflare") &&
      !platform.name.includes("D1") &&
      !platform.name.includes("R2") &&
      !platform.name.includes("KV") ? (
        <Cloud size={22} fill="currentColor" strokeWidth={1} />
      ) : (
        platform.mark
      )}
    </span>
  );
}
export function FeaturedPlatforms() {
  return (
    <div className="platform-grid">
      {availablePlatforms.slice(0, 3).map((p) => (
        <Card className="platform-card" key={p.id}>
          <div className="platform-card-top">
            <PlatformMark platform={p} />
            <h3>{p.name === "Cloudflare Workers" ? "Cloudflare" : p.name}</h3>
            <ArrowUpRight className="card-external" size={14} />
          </div>
          <p>{p.description}</p>
          <div className="platform-tags">
            {p.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="platform-allowance">
            <Check size={12} />
            <span>
              {p.name === "Cloudflare Workers"
                ? "100,000 次请求 / 天"
                : p.allowance}
            </span>
          </div>
          <Link
            className="platform-detail-link"
            href={"/guide/cloud#" + p.id}
            aria-label={"查看 " + p.name + " 部署指南"}
          />
        </Card>
      ))}
    </div>
  );
}
