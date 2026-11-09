import type { Platform } from "./platforms";
import { availablePlatforms } from "./platforms";
import {
  dataPurposes,
  existingDatabases,
  type DataPurpose,
  type ExistingDatabase,
} from "./database-catalog";
export type DatabaseTaskContext = {
  purpose: DataPurpose;
  existing: ExistingDatabase;
  stage: "local" | "online" | "both";
  deploymentId: string;
};
export const defaultDatabaseContext: DatabaseTaskContext = {
  purpose: "unknown",
  existing: "unknown",
  stage: "local",
  deploymentId: "unknown",
};
function contextText(context: DatabaseTaskContext) {
  const deployment = availablePlatforms.find(
    (platform) => platform.id === context.deploymentId,
  );
  return [
    "我想完成：" +
      dataPurposes.find((item) => item.value === context.purpose)?.label,
    "现有项目：" +
      existingDatabases.find((item) => item.value === context.existing)?.label,
    "这次处理：" +
      {
        local: "先在电脑上接通，暂不创建云端部署",
        online: "网站已部署，配置或修复线上环境",
        both: "本地接通后再配置线上环境",
      }[context.stage],
    "网站部署位置：" +
      (deployment
        ? deployment.name +
          "；需验证运行时、网络与连接方式是否兼容，不把选择当成已部署。"
        : "尚未确定，不自动假定是 Vercel 或 Cloudflare。"),
  ].join("\n");
}
export function buildDatabaseSetupTask(
  platform?: Pick<
    Platform,
    "name" | "source" | "setupHint" | "allowance" | "limit"
  >,
  context?: DatabaseTaskContext,
) {
  return [
    "我不懂编程，请帮我把当前项目的数据服务配置好。先读取项目文件，不要只给通用教程，也不要假定所有服务都使用 DATABASE_URL。",
    ...(context ? [contextText(context)] : []),
    platform
      ? "我准备使用：" +
        platform.name +
        "。官方说明：" +
        platform.source +
        "。接入重点：" +
        platform.setupHint
      : "请从项目依赖、配置示例和数据访问代码识别实际服务与数据库类型；不清楚的地方只问我必要的问题。",
    "1. 用日常话告诉我项目保存哪些记录、哪些文件，用到哪一种服务；已有数据库时先沿用，不要随意换类型。如果所选服务与现有数据库类型或部署方式不兼容，先说明冲突和可行选项，停止接入，不自动迁移。",
    ...(platform
      ? [
          "所选套餐参考：" +
            platform.allowance +
            "。主要限制：" +
            platform.limit +
            "。按预期存储、读写和流量说明费用，免费额度不代表自动限制所有账单。",
        ]
      : []),
    "2. 找到真正使用的变量名和配置文件。区分本地开发与上线环境，说明我应打开哪个官方控制台页面、复制哪个字段、填到哪里。连接串、访问令牌和数据库密码不要发到聊天里；由我在本地配置或平台的安全输入框填写。",
    "3. PostgreSQL / MySQL 按驱动选择连接方式，区分应用连接池与建表用的连接；D1 使用绑定，Firebase / CloudBase 等按其 SDK 和环境配置，不强行生成 DATABASE_URL。",
    "4. 如需创建数据表，先确认是独立开发库，说明将新增或修改什么。不要覆盖、清空现有数据；正式库迁移先备份并等待我确认。私密凭据不能进入浏览器或公开仓库。",
    context?.stage === "online"
      ? "5. 在本次线上环境用独立测试账号和可识别测试数据验证原操作：记录保存后重新读取，文件上传后刷新访问；不同账号只能看到被允许的数据，不改动真实业务记录。"
      : "5. 在本地写入一条可识别的测试记录，重新读取；需要登录时验证不同账号只能看到允许的数据。上传文件则测试上传、刷新和权限。",
    context?.stage === "local"
      ? "6. 本次只验证开发环境；列出将来上线需要设置的变量名或绑定，不替我创建部署或付费资源。"
      : "6. 告诉我上线平台需填写的变量名或绑定；开发和正式环境可使用不同的值。配置后重新部署并验证同一操作。失败时读取脱敏日志，修复后再试。",
    "只需要文件上传时，不强行新增关系数据库；已有存储可复用。只需要本机处理时，先确认是否根本不用云服务。向量检索另确认原始文件、模型维度与生成费用。若不能读取项目，请先索取必要的非敏感文件。",
    "交付：配置位置和变量名清单（不含秘密值）、实际通过的测试、下一步操作。每次只让我做一个具体动作，说明完成后应该看到什么。",
  ].join("\n");
}
export const databaseTroubleshootingTask = [
  "我的项目在电脑上能连接数据服务，上线后却失败。请检查真实项目和部署日志，帮我找出原因并修复，不要只让我重新检查环境变量。",
  "失败的操作：[例如登录、提交报名、保存记录或上传文件]。线上报错：[粘贴已删除密码、密钥和个人信息的报错；没有报错时先帮我找到日志]。",
  "先确认部署平台、实际数据库/存储服务、运行方式和错误发生在哪一步。比较本地与云端的变量名、环境与绑定是否一致，不显示变量的秘密值。检查配置是否已用于本次部署。",
  "再按错误证据检查：连接地址和凭据格式、TLS/SSL 加密要求、IP 访问规则、部署网络、数据库暂停或额度耗尽、连接池及连接数、运行时和驱动兼容性、表结构与用户权限。文件上传另查大小限制、存储权限、跨域设置和临时地址是否过期。",
  "给出最可能原因和对应证据，做最小修复。不要通过永久公开数据库、关闭鉴权或删除全部数据来绕过错误；涉及付费资源或正式数据修改先说明影响并等待确认。",
  "修复后实际执行一次原本失败的操作；保存数据后刷新读取，有登录时检查用户隔离。最后用我能看懂的话说明哪里错了、改了什么、线上验证结果，以及我是否还需要点哪个按钮。",
].join("\n");

export const databaseSymptoms = [
  {
    value: "unknown",
    label: "还不清楚，先帮我定位",
    check: "先找到失败操作对应的请求与日志，不凭猜测更换数据库。",
  },
  {
    value: "connect",
    label: "连接失败 / 超时",
    check:
      "检查本次部署生效的变量或绑定、网络与 TLS、运行时驱动及连接池，不只重复填写密码。",
  },
  {
    value: "save",
    label: "能打开网页，但保存失败",
    check: "检查表或集合是否存在、迁移是否用于正确环境、写入权限与字段约束。",
  },
  {
    value: "permission",
    label: "登录后看不到数据 / 权限错误",
    check:
      "检查当前用户身份、行级访问规则或安全规则，以及服务端与客户端密钥的用途；不要直接关闭权限。",
  },
  {
    value: "upload",
    label: "图片或附件上传失败",
    check:
      "检查上传大小、类型、服务端鉴权、存储权限、CORS 和签名过期时间；不要把私人文件改成公开。",
  },
  {
    value: "lost",
    label: "刷新 / 重新部署后数据不见了",
    check:
      "确认是否误用临时磁盘、浏览器本地保存、不同环境或不同数据库；先找回原数据，不覆盖或重建。",
  },
  {
    value: "quota",
    label: "有时能用，或提示额度不足",
    check:
      "核对实际限额、闲置暂停、连接数和请求重试，区分恢复、优化和升级，不自动购买套餐。",
  },
] as const;
export type DatabaseSymptom = (typeof databaseSymptoms)[number]["value"];
export function buildDatabaseDiagnostic(
  context: DatabaseTaskContext,
  platform: Platform | undefined,
  symptom: DatabaseSymptom,
  operation: string,
  error: string,
) {
  const selected = databaseSymptoms.find((item) => item.value === symptom)!;
  return [
    "我是非程序员，请根据真实项目和错误证据排查数据问题，不先假定本地已经成功。",
    contextText(context),
    "数据服务：" +
      (platform
        ? platform.name +
          "；接入重点：" +
          platform.setupHint +
          "；官方资料：" +
          platform.source
        : "尚未确定，请从实际代码和配置识别。"),
    "遇到的情况：" + selected.label,
    "我做了什么：" + (operation.trim() || "尚未提供，请先问我失败的是哪一步。"),
    "脱敏后的报错：" +
      (error.trim() || "尚未提供，请先引导我找到必要日志，不猜测具体原因。"),
    "优先检查：" + selected.check,
    "比较开发与线上环境的变量名和绑定，不展示秘密值；验证实际选中的数据服务是否与代码、部署运行时兼容。列出最可能原因及证据，每次给我一个明确动作和成功表现。不要删除数据、公开所有文件或关闭鉴权来绕过错误。",
    "修复后实际执行原本失败的操作，确认保存后能重新读取；涉及登录时验证不同用户的访问边界，上传文件时验证权限与持久保存。若无法读项目或日志，请说明需要哪些非敏感材料。",
  ].join("\n");
}
