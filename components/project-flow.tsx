import { ArrowDown, ArrowRight, CornerUpLeft } from "lucide-react";
import styles from "./project-flow.module.css";

function BranchConnector({
  merge = false,
  toRelease = false,
}: {
  merge?: boolean;
  toRelease?: boolean;
}) {
  return (
    <div
      className={`${merge ? styles.merge : styles.split} ${toRelease ? styles.releaseMerge : ""}`}
      aria-hidden="true"
    >
      <span />
      <span />
      {merge ? (
        <ArrowDown size={18} />
      ) : (
        <>
          <ArrowDown size={18} />
          <ArrowDown size={18} />
        </>
      )}
    </div>
  );
}

export function ProjectFlow() {
  return (
    <figure className={styles.flow} aria-labelledby="project-flow-caption">
      <figcaption id="project-flow-caption" className={styles.caption}>
        场景启动和开源改造可以同时进行；数据服务按需准备，技能与图片优化随时加入。
      </figcaption>
      <div className={styles.diagram}>
        <div className={styles.main}>
          <div className={styles.parallel}>
            <div className={`${styles.node} ${styles.origin}`}>
              <h3>场景启动</h3>
              <p>把想法说清楚，明确要做什么</p>
            </div>
            <div className={`${styles.node} ${styles.origin}`}>
              <h3>开源改造</h3>
              <p>寻找现成项目，边参考边改造</p>
            </div>
            <span className={styles.parallelLabel}>
              可同时进行，也可任选起点
            </span>
          </div>
          <BranchConnector merge />
          <div className={`${styles.node} ${styles.core}`}>
            <h3>开发与本地运行</h3>
            <p>让 AI 帮你实现功能，在电脑上反复验证</p>
          </div>
          <BranchConnector />
          <div className={styles.branches}>
            <div className={styles.node}>
              <h3>需要保存数据或上传文件</h3>
              <p>
                <strong>数据库 / 文件存储选型</strong>
                <br />
                准备好服务，并验证读写
              </p>
            </div>
            <div className={`${styles.node} ${styles.skip}`}>
              <h3>不需要额外数据服务</h3>
              <p>
                例如只展示固定内容
                <br />
                直接进入上线准备
              </p>
            </div>
          </div>
          <BranchConnector merge toRelease />
          <div className={styles.release}>
            <div className={`${styles.node} ${styles.destination}`}>
              <h3>云平台选择</h3>
              <p>看项目支持、免费额度与费用</p>
            </div>
            <ArrowRight
              size={20}
              className={styles.releaseArrow}
              aria-hidden="true"
            />
            <div className={`${styles.node} ${styles.destination}`}>
              <h3>终端自动化部署</h3>
              <p>让 AI 协助发布，再验收线上功能</p>
            </div>
          </div>
          <p className={styles.feedback}>
            <CornerUpLeft size={18} aria-hidden="true" />
            上线后有新想法或发现问题，随时回到开发与本地验证
          </p>
        </div>
        <aside className={styles.support} aria-label="随时可用的辅助能力">
          <h3>需要时，随时加入</h3>
          <p>开发、调试或上线前后，都可以用。</p>
          <div>
            <h4>Agent 技能包</h4>
            <p>给 AI 增加设计、查文档、测试等专长。</p>
          </div>
          <div>
            <h4>媒体图片优化</h4>
            <p>选合适的格式、压缩图片，让页面加载更快。</p>
          </div>
        </aside>
      </div>
    </figure>
  );
}
