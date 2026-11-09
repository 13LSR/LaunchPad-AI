"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { availablePlatforms } from "@/lib/platforms";
import {
  buildCloudSelectionTask,
  cloudCandidates,
  cloudNeeds,
  type CloudContext,
  type CloudNeed,
} from "@/lib/cloud-catalog";

export function CloudPlanner({
  context,
  onChange,
  onFilter,
  onCompare,
}: {
  context: CloudContext;
  onChange: (patch: Partial<CloudContext>) => void;
  onFilter: (ids: string[]) => void;
  onCompare: (ids: string[]) => void;
}) {
  const need = cloudNeeds.find((item) => item.id === context.need)!;
  const candidates = cloudCandidates(context);
  const top = candidates.slice(0, 3);
  const noCloud = context.need === "offline" || context.need === "client";
  return (
    <section
      id="cloud-match"
      className="cloud-planner scroll-mt-24"
      aria-labelledby="cloud-match-title"
    >
      <h3 id="cloud-match-title">先找到适合你项目的落脚点</h3>
      <p className="cloud-section-description">
        按已有项目选择，不用先背技术名。还不清楚时，让 AI 先检查项目就好。
      </p>
      <div className="cloud-fields">
        <label>
          你要部署的是什么？
          <select
            className="tool-input"
            value={context.need}
            onChange={(e) => onChange({ need: e.target.value as CloudNeed })}
          >
            {cloudNeeds.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          这个项目用来做什么？
          <select
            className="tool-input"
            value={context.purpose}
            onChange={(e) =>
              onChange({ purpose: e.target.value as CloudContext["purpose"] })
            }
          >
            <option value="unknown">还不确定是否属于商业用途</option>
            <option value="personal">个人学习 / 非商业作品</option>
            <option value="commercial">接单 / 收费产品 / 企业业务</option>
          </select>
        </label>
        <label>
          费用怎么考虑？
          <select
            className="tool-input"
            value={context.budget}
            onChange={(e) =>
              onChange({ budget: e.target.value as CloudContext["budget"] })
            }
          >
            <option value="free">先看有持续免费额度的方案</option>
            <option value="review">可以付费，先比较适合程度</option>
          </select>
        </label>
      </div>
      <p className="cloud-need-note">{need.note}</p>
      {context.need === "unknown" || noCloud ? (
        <div className="cloud-direction">
          <h4>
            {context.need === "offline"
              ? "这类项目可以先不上云"
              : context.need === "client"
                ? "先分清客户端和后端"
                : "不确定技术，也能选对方向"}
          </h4>
          <p>
            {context.need === "unknown"
              ? "复制下面的检查任务，放进你正在用的 AI 编程工具。它会确认项目实际需要什么，再帮你选平台。"
              : "先让 AI 确认交付方式。只有需要别人远程访问的服务，才继续选择云平台。"}
          </p>
          <CopyButton
            label="复制项目检查任务"
            text={buildCloudSelectionTask(context)}
          />
          {noCloud && (
            <Link href="/guide/local">
              查看本地运行与客户端预览 <ArrowRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        <div className="cloud-suggestions">
          <h4>
            {top.length ? "可以先比较这些方案" : "当前条件下没有直接匹配的方案"}
          </h4>
          {context.purpose === "unknown" && (
            <p>
              用途未确定，先避开限制非商业的免费方案；确认是个人作品后，可以切换用途。
            </p>
          )}
          {!top.length && (
            <p>
              免费额度不一定覆盖这个项目。可以切换到“可以付费”，或先让 AI
              核对实际资源需求。
            </p>
          )}
          <ul>
            {top.map((choice) => (
              <li key={choice.platformId}>
                <strong>
                  {
                    availablePlatforms.find((p) => p.id === choice.platformId)!
                      .name
                  }
                </strong>
                <p>{choice.reason}</p>
                <span>{choice.tradeoff}</span>
              </li>
            ))}
          </ul>
          {context.budget === "free" && (
            <p>
              这里筛选的是有持续额度的候选，不代表项目一定能零费用运行。模型调用、数据库和文件存储也要一起算。
            </p>
          )}
          <div className="cloud-actions">
            {top.length > 1 && (
              <Button
                variant="secondary"
                onClick={() => onCompare(top.map((item) => item.platformId))}
              >
                并排比较这 {top.length} 个方案
              </Button>
            )}
            {candidates.length > 0 && (
              <Button
                variant="outline"
                onClick={() =>
                  onFilter(candidates.map((item) => item.platformId))
                }
              >
                查看全部 {candidates.length} 个候选 <ArrowRight size={14} />
              </Button>
            )}
            <CopyButton
              label="复制选型任务给 AI"
              text={buildCloudSelectionTask(
                context,
                top.map((item) => item.platformId),
              )}
            />
          </div>
        </div>
      )}
      <details className="knowledge-disclosure cloud-data-options">
        <summary>
          项目要不要数据库或文件存储？<span>先选清楚，再进入部署</span>
        </summary>
        <p>
          选择后会给出对应的准备步骤。点击平台卡片上的「让 AI
          帮我部署到这里」，也会把这个选择带入上线任务。
        </p>
        <label>
          你的项目现在属于哪一种？
          <select
            className="tool-input"
            value={context.data}
            onChange={(e) =>
              onChange({ data: e.target.value as CloudContext["data"] })
            }
          >
            <option value="unknown">我不清楚，想先判断</option>
            <option value="none">只展示内容，不保存用户数据</option>
            <option value="needed">要登录 / 保存 / 上传，但还没准备</option>
            <option value="existing">已经有数据库或文件存储</option>
          </select>
        </label>
        {context.data === "unknown" && (
          <div className="cloud-data-answer">
            <h4>先让 AI 查清楚项目实际需要什么</h4>
            <p>
              登录、报名、订单、收藏等记录需要数据库；头像、图片、视频等上传文件需要文件存储。只看页面外观无法判断。
            </p>
            <CopyButton
              label="复制数据检查任务给 AI"
              text="请检查当前项目的真实代码和配置，用普通话告诉我：哪些内容保存在浏览器本地，哪些需要数据库，哪些是上传文件。列出实际读取的环境变量名称和配置文件路径，但不要输出密钥值。告诉我本地开发和上线分别要准备什么；如果不需要外部服务，请明确说可以跳过数据库和文件存储。"
            />
          </div>
        )}
        {context.data === "none" && (
          <div className="cloud-data-answer">
            <h4>可以先跳过数据库和文件存储</h4>
            <p>
              适合个人介绍、文档、作品展示或只在浏览器本地处理的工具。固定 Logo
              和公开配图随网站发布即可；如果以后增加登录、保存或上传，再补数据服务。
            </p>
            <Link href="#cloud-services">
              直接比较部署平台 <ArrowRight size={14} />
            </Link>
          </div>
        )}
        {context.data === "needed" && (
          <div className="cloud-data-answer">
            <h4>先准备数据服务，再部署网站</h4>
            <p>
              先确认项目需要的是数据库、文件存储，还是两者都要。先在开发环境验证登录、保存、刷新读取、上传和删除，再到部署平台填写正式环境对应的配置；测试数据与正式数据分开。
            </p>
            <Link href="/guide/databases#database-choose">
              开始选择数据库与文件存储 <ArrowRight size={14} />
            </Link>
          </div>
        )}
        {context.data === "existing" && (
          <div className="cloud-data-answer">
            <h4>沿用已有服务，先核对连接与备份</h4>
            <p>
              不要因为换托管平台就重新建库或迁移。先确认数据库和文件存储的地址、权限、备份及跨域设置，再在部署平台添加同名环境变量；发布前用测试账号验证读写和上传。
            </p>
            <Link href="/guide/databases#database-choose">
              检查已有数据服务 <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </details>
    </section>
  );
}
