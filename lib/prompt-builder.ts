import { deploymentProfiles, type PromptTemplate } from "./prompt-data";
import {
  getDeploymentRanking,
  getRecommendedPlatform,
  type ProjectUse,
} from "./deployment-ranking";
import { platforms } from "./platforms";
export type PromptAnswers = {
  name: string;
  purpose: string;
  audience: string;
  requirements: string;
  use: ProjectUse;
  platformId: string;
  features: string[];
};
export function buildProjectPrompt(
  template: PromptTemplate,
  answers: PromptAnswers,
) {
  const profile = deploymentProfiles[template.profile];
  const ranking = getDeploymentRanking(template.profile, answers.use);
  const chosen =
    ranking.find((r) => r.platformId === answers.platformId && r.compatible) ||
    getRecommendedPlatform(template.profile, answers.use);
  const platform = platforms.find((p) => p.id === chosen.platformId)!;
  const native = [
    "wechat",
    "miniapp",
    "mobile",
    "desktop",
    "extension",
  ].includes(template.profile);
  const offline = template.profile === "offline";
  const features = answers.features.length
    ? answers.features
    : template.features;
  return [
    "请作为有交付经验的工程师，协助一位不懂编程的用户实现下面的具体项目。先检查已有目录；有代码则沿用已有技术和功能，不要无理由重建。按官方当前稳定版本与实际兼容性实施。",
    "【具体项目】",
    "场景：" + template.title + "。" + template.description,
    "名称：" + (answers.name.trim() || "根据具体用途建议一个名称"),
    "用途：" +
      (answers.purpose.trim() ||
        "尚未填写；请先与我确认具体用途，不要把页面示例当成真实需求"),
    "使用人群：" + (answers.audience.trim() || "待确认，以最小可用版本为起点"),
    "用途性质：" +
      (answers.use === "commercial"
        ? "商业项目；所有平台与依赖需允许此使用方式"
        : "个人非商业学习或展示项目"),
    "【本次功能范围】",
    ...features.map((f, i) => i + 1 + ". " + f),
    "其他明确要求：" +
      (answers.requirements.trim() ||
        "没有补充；合理默认需说明，新增支付、账户或外部服务前先说明必要性"),
    "场景边界：" + template.boundary,
    "功能选择优先：未勾选的功能不自动加入。如果具体要求与场景边界或部署方案冲突，请先指出冲突并确认调整；不要把示例或验收项当作额外功能。",
    "【技术方案】",
    "建议起点：" + template.stack,
    "如果已有项目或用户需求与建议冲突，说明理由并保留合理的已有结构。不要仅因模板出现某技术就引入不必要的数据库或付费服务。",
    "【部署与分发】",
    profile.delivery,
    offline
      ? "本项目先在本地运行，不自动创建云资源。确实需要远程执行时，再独立评估云方案。"
      : native
        ? "以下是可选后端方案，不是客户端的上架或分发渠道。"
        : "以下平台用于本场景的服务部署。",
    ...(offline
      ? []
      : [
          (native ? "需要后端时优先评估：" : "优先评估的部署平台：") +
            platform.name +
            "。",
          "理由：" + chosen.reason,
          "取舍：" + chosen.tradeoff,
          "套餐参考：" +
            (answers.use === "commercial" && platform.id === "cloud-0"
              ? "商业用途需付费方案；Hobby 不适用。"
              : platform.allowance + "。" + platform.limit),
          "官方来源：" + platform.source,
          "先检查是否需要保存用户数据或上传文件；需要时准备兼容的数据服务并验证读写，再部署网站。已有服务先检查并沿用；没有数据需求就不要新增数据库。",
        ]),
    !offline && answers.use === "commercial" && platform.id === "cloud-0"
      ? "明确使用允许商用的付费方案，不能选择 Hobby。"
      : "",
    "【怎样判断完成】",
    ...template.acceptance
      .filter((a) => !a.whenFeature || features.includes(a.whenFeature))
      .map((a, i) => i + 1 + ". " + a.text),
    "完整实现主要操作的加载、空、失败与成功状态；键盘可操作，手机布局可用。以真实流程验证，不用静态演示假装功能完成。",
    "【交付给非程序员】",
    "逐条解释并提供安装、启动、构建和部署步骤：每条终端命令单独一行，标明在哪个文件夹执行、首次还是每次需要、成功后会看到什么。说明如何停止和再次启动。",
    "提供不含真实密钥的配置示例、内容修改入口和官方文档。不要暴露密钥到浏览器或公共仓库。账号、支付、投票与预约等写操作需服务端权限、校验和幂等；按业务验证。",
    "先在本地或开发者工具验证，网站先给预览地址；客户端提供预览/安装步骤。正式发布、收费资源和生产数据迁移前说明影响并确认。模型调用和存储可能另外收费。",
  ]
    .filter(Boolean)
    .join("\n");
}
