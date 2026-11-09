"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "./copy-button";
export function DataDecision() {
  const [choice, setChoice] = useState("unknown");
  return (
    <section className="data-decision" id="local-data-next">
      <h2>跑通之后，先看看数据放在哪里</h2>
      <p>
        网页上线和保存数据是两件事。需要登录、保存报名、订单或跨设备同步的项目，通常还要准备数据库；用户上传的图片通常要对象存储。
      </p>
      <div className="filter-bar">
        {[
          ["unknown", "我还不确定"],
          ["yes", "要保存用户数据"],
          ["no", "只展示内容 / 本地处理"],
        ].map(([v, l]) => (
          <button
            key={v}
            aria-pressed={choice === v}
            className={"filter-button " + (choice === v ? "active" : "")}
            onClick={() => setChoice(v)}
          >
            {l}
          </button>
        ))}
      </div>
      {choice === "unknown" ? (
        <div>
          <p>
            先让 AI 查看现有代码。不要只凭页面长什么样，就判断要不要数据库。
          </p>
          <CopyButton
            label="复制数据检查任务给 AI"
            text="请检查当前项目，把它用到的数据分成：浏览器本地保存、服务端数据库、上传文件。列出真实配置文件和所需变量名（不输出密钥值），说明本地与上线分别需要准备什么。若没有外部存储需求请明确说明，不新增数据库；若已有数据库则沿用兼容类型，先准备独立开发库并验证读取与保存，再选择网站部署平台。"
          />
          <div className="learning-links">
            <Link href="/guide/databases#database-choose">
              看看数据库怎么选
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : choice === "yes" ? (
        <div>
          <p>
            先选与项目兼容的数据服务，准备自己的开发数据库、连接配置和数据表，再验证能保存、刷新后能读回。
          </p>
          <Link className="source-link" href="/guide/databases#database-choose">
            先准备数据库与文件存储
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div>
          <p>
            如果文章来自项目文件、图片随网站打包，或工具只在浏览器处理数据，可以先部署网站。本地保存的数据通常不会在不同设备间同步。
          </p>
          <Link className="source-link" href="/guide/cloud">
            不需要云数据库，直接选择部署平台
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
