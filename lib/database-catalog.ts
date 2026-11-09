import { databases } from "./platforms";

export const dataPurposes = [
  { value: "unknown", label: "还不确定要不要保存数据" },
  { value: "records", label: "保存报名、文章、订单等记录" },
  { value: "accounts", label: "注册登录 + 每个人自己的记录" },
  { value: "files", label: "上传图片、视频或 PDF" },
  { value: "both", label: "既保存记录，也上传文件" },
  { value: "wechat", label: "微信小程序的记录和文件" },
  { value: "vector", label: "让 AI 从资料里找答案" },
  { value: "cache", label: "验证码、缓存或限制访问次数" },
  { value: "none", label: "只展示内容 / 仅在本机处理" },
] as const;
export const existingDatabases = [
  { value: "unknown", label: "已有项目，但不知道用了什么" },
  { value: "new", label: "还没有数据库，准备选方案" },
  { value: "postgres", label: "已使用 PostgreSQL" },
  { value: "mysql", label: "已使用 MySQL" },
  { value: "sqlite", label: "已使用 SQLite / libSQL" },
  { value: "mongodb", label: "已使用 MongoDB" },
  { value: "firestore", label: "已使用 Firebase Firestore" },
  { value: "cloudbase", label: "已使用微信云开发 / CloudBase" },
] as const;
export type DataPurpose = (typeof dataPurposes)[number]["value"];
export type ExistingDatabase = (typeof existingDatabases)[number]["value"];
export const databaseCategories = [
  { value: "all", label: "全部" },
  { value: "records", label: "保存记录" },
  { value: "accounts", label: "登录与数据" },
  { value: "files", label: "图片与文件" },
  { value: "wechat", label: "微信小程序" },
  { value: "cache", label: "缓存与配置" },
  { value: "vector", label: "AI 检索" },
] as const;
export type DatabaseCategory = (typeof databaseCategories)[number]["value"];
export type DatabaseFit = {
  roles: DatabaseCategory[];
  engines: ExistingDatabase[];
  connection: string;
  boundary: string;
};
export const databaseFits: Record<string, DatabaseFit> = {
  "database-0": {
    roles: ["records"],
    engines: ["postgres"],
    connection: "PostgreSQL 连接地址；短请求后端通常需要连接池。",
    boundary:
      "这里比较的是 PostgreSQL 存储额度；额外的登录、对象存储等能力需分别核对配置与用量，不与数据库容量混算。",
  },
  "database-1": {
    roles: ["records", "accounts", "files"],
    engines: ["postgres"],
    connection: "数据库连接，或 Supabase SDK + 项目地址与对应密钥。",
    boundary:
      "登录、数据库、文件有各自的配额与权限。公开客户端密钥和服务端管理密钥用途不同。",
  },
  "database-2": {
    roles: ["records"],
    engines: ["sqlite"],
    connection: "Workers 数据库绑定，例如 env.DB；本地与远程库分开。",
    boundary:
      "不是通用 PostgreSQL / MySQL 地址，也不是所有 SQLite 应用都能原样接入。",
  },
  "database-3": {
    roles: ["records"],
    engines: ["sqlite"],
    connection: "项目支持的 libSQL 客户端、数据库地址与访问令牌。",
    boundary:
      "本地 SQLite 文件不会自动同步上云；要确认驱动、迁移和离线同步方案。",
  },
  "database-4": {
    roles: ["records"],
    engines: ["mysql"],
    connection: "MySQL 兼容驱动与 TLS 加密连接。",
    boundary: "MySQL 兼容不表示所有语法与特性完全相同；先验证现有查询和迁移。",
  },
  "database-5": {
    roles: ["records"],
    engines: ["postgres"],
    connection: "控制台提供的 PostgreSQL 主机、端口与 TLS 配置。",
    boundary: "数据库托管不等于网站托管；登录功能和文件上传仍由应用安排。",
  },
  "database-6": {
    roles: ["records"],
    engines: ["postgres", "mysql", "mongodb"],
    connection: "先创建与项目一致的引擎，再用该引擎的连接方式。",
    boundary:
      "10 MB 更适合连接练习与极小演示；不同数据库引擎之间不能直接替换。",
  },
  "database-7": {
    roles: ["records"],
    engines: ["mongodb"],
    connection: "MongoDB 客户端、连接串、数据库账号及网络访问规则。",
    boundary:
      "不是 SQL 数据库，也不能直接替代 Firestore；数据库用户与网站用户不是同一类账号。",
  },
  "database-8": {
    roles: ["records", "accounts"],
    engines: ["firestore"],
    connection:
      "Firebase SDK 与项目配置；搭配 Authentication 和 Security Rules。",
    boundary:
      "登录服务与 Firestore 分别配置，文件存储另算；实时监听也会产生读取用量。",
  },
  "database-9": {
    roles: ["cache"],
    engines: [],
    connection: "按客户端选择 Redis 连接或 HTTP 地址与令牌。",
    boundary:
      "适合短期数据和限流搭档，不会自动提供业务数据表、登录系统或长期备份。",
  },
  "database-10": {
    roles: ["cache"],
    engines: [],
    connection: "绑定 Workers KV 命名空间。",
    boundary:
      "不同地区可能短暂读到旧值；不要用它做精确限流、库存扣减或余额结算。",
  },
  "database-11": {
    roles: ["cache"],
    engines: [],
    connection: "兼容 Redis 的服务端客户端及连接凭据。",
    boundary:
      "与 Upstash HTTP 接口不同；空间小，重要记录仍要考虑持久化与恢复。",
  },
  "database-12": {
    roles: ["vector"],
    engines: [],
    connection: "Pinecone API Key、索引与向量模型维度。",
    boundary:
      "只解决检索的一部分；模型回答、向量生成和原始 PDF 存放还要单独安排。",
  },
  "database-13": {
    roles: ["vector"],
    engines: [],
    connection: "Qdrant 集群地址、API Key 与集合配置。",
    boundary: "免费单节点适合原型；普通账号记录和原始文件仍需要相应存储。",
  },
  "database-14": {
    roles: ["vector"],
    engines: [],
    connection: "Milvus 兼容客户端、服务地址、令牌与集合。",
    boundary:
      "已有 Milvus 项目先验证版本和索引兼容；向量检索不会自动生成答案。",
  },
  "database-15": {
    roles: ["files"],
    engines: [],
    connection: "Workers R2 绑定或 S3 兼容接口。",
    boundary:
      "它保存文件，不保存订单关系。私人文件应通过鉴权和短期签名链接访问。",
  },
  "database-16": {
    roles: ["files"],
    engines: [],
    connection: "UploadThing 上传组件与服务端文件路由。",
    boundary:
      "仍需自己验证谁能上传、文件大小与类型；文件地址和归属要在应用中管理。",
  },
  "database-17": {
    roles: ["files"],
    engines: [],
    connection: "Cloudinary 上传接口及图片分发地址。",
    boundary:
      "存储、转换与流量共用 credits；多尺寸图片不是零成本生成，上传也要限制权限。",
  },
  "database-18": {
    roles: ["files"],
    engines: [],
    connection: "B2 或 S3 兼容接口，使用限定范围的应用密钥。",
    boundary: "适合文件与备份；备份还要测试恢复，不能只看到上传成功就结束。",
  },
  "database-19": {
    roles: ["records", "accounts", "files", "wechat"],
    engines: ["cloudbase", "postgres"],
    connection:
      "先确认环境 ID、文档库还是 PostgreSQL，再选择 CloudBase SDK 或对应连接。",
    boundary:
      "小程序身份、数据库与文件权限都要配置。免费体验有到期规则，不适合按永久免费规划上线。",
  },
};

export const orderedDatabases = [
  1, 0, 2, 19, 15, 16, 3, 4, 5, 7, 8, 17, 18, 9, 10, 11, 12, 13, 14, 6,
].map((index) => databases[index]);
export function filterDatabases(
  query: string,
  category: DatabaseCategory,
  freeOnly: boolean,
  ids?: string[],
) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return orderedDatabases.filter((service) => {
    const fit = databaseFits[service.id];
    const haystack = [
      service.name,
      service.description,
      ...service.tags,
      ...(service.useCases || []),
      fit.connection,
    ]
      .join(" ")
      .toLocaleLowerCase();
    return (
      (category === "all" || fit.roles.includes(category)) &&
      (!freeOnly || service.plan === "免费额度") &&
      (!ids || ids.includes(service.id)) &&
      words.every((word) => haystack.includes(word))
    );
  });
}

export type DatabaseAdvice = {
  title: string;
  body: string;
  groups: { label: string; ids: string[]; reason: string }[];
};
export function getDatabaseAdvice(
  purpose: DataPurpose,
  existing: ExistingDatabase,
): DatabaseAdvice {
  if (purpose === "none")
    return {
      title: "可能不需要额外开通数据服务",
      body: "文章和图片随网站发布，或数据仅在浏览器、本机处理时，可以先选网站部署平台。若以后需要跨设备同步、用户提交或上传，再补数据服务。",
      groups: [],
    };
  if (purpose === "unknown")
    return {
      title: "先让 AI 看看项目实际保存了什么",
      body: "页面有输入框，不代表一定需要云数据库。让 AI 分清浏览器本地数据、服务端记录与上传文件，避免多开一个用不到的服务。",
      groups: [],
    };
  if (existing === "unknown" && !["files", "cache"].includes(purpose))
    return {
      title: "已有项目，先确认它支持哪种数据库",
      body: "把下面的检查任务发给能读取项目的 AI。得到数据库类型后，再回来选择；PostgreSQL、MySQL、MongoDB 的连接信息不能互换。文件、登录和向量检索也要分别确认。",
      groups: [],
    };
  const groups: DatabaseAdvice["groups"] = [];
  if (["records", "accounts", "both", "wechat"].includes(purpose)) {
    const ids =
      existing === "new"
        ? purpose === "wechat"
          ? ["database-19"]
          : purpose === "accounts"
            ? ["database-1"]
            : ["database-0", "database-1"]
        : orderedDatabases
            .filter(
              (service) =>
                databaseFits[service.id].engines.includes(existing) &&
                service.id !== "database-6" &&
                (service.id !== "database-19" || existing === "cloudbase"),
            )
            .map((service) => service.id);
    groups.push({
      label: "保存记录的候选",
      ids,
      reason:
        existing === "new"
          ? purpose === "wechat"
            ? "云开发适合把小程序身份、函数、记录与文件一起接入；上线前计算体验到期后的费用。"
            : purpose === "accounts"
              ? "Supabase 可将登录与 PostgreSQL 一起准备，仍需为每个人的私密数据配置权限。"
              : "Neon 适合只需要 PostgreSQL；还要一起准备登录与文件时，可比较 Supabase。"
          : "先沿用现有数据库类型。这里是兼容方向，仍需核对驱动、版本和迁移；网站登录不一定由数据库提供。",
    });
  }
  if (purpose === "files" || purpose === "both")
    groups.push({
      label: "保存文件的候选",
      ids:
        existing === "cloudbase"
          ? ["database-19", "database-15"]
          : ["database-15", "database-16", "database-17"],
      reason:
        "R2 适合通用文件空间；UploadThing 帮你接上传流程；Cloudinary 适合图片裁剪和分发。已有 Supabase / CloudBase 文件空间时，可先复用，不必再开一个。",
    });
  if (purpose === "vector")
    groups.push({
      label: "资料检索的候选",
      ids:
        existing === "postgres"
          ? ["database-1", "database-0", "database-13"]
          : ["database-13", "database-12", "database-14"],
      reason:
        existing === "postgres"
          ? "先让 AI 评估现有 PostgreSQL 的 pgvector 能否满足规模，避免多维护一套服务；需要独立向量服务时再比较 Qdrant。原始文件与模型费用另算。"
          : "Qdrant、Pinecone 和 Zilliz 负责查找相关片段。先核对项目使用的客户端与模型维度；原始文件、账号记录和模型回答不是同一种服务。",
    });
  if (purpose === "cache")
    groups.push({
      label: "短期数据的候选",
      ids: ["database-9", "database-11"],
      reason:
        "先看项目使用 HTTP 还是 Redis 客户端，并设置过期时间。Workers KV 适合少改多读的配置，不作为精确限流方案。",
    });
  return {
    title: "先比较这些方向，不用全部开通",
    body:
      purpose === "both"
        ? "记录与文件通常分开保存。数据库记文件的归属、对象标识和必要信息；私人文件访问链接按需生成。"
        : "候选按你选择的用途和已有技术缩小范围，最后用项目实际代码验证。已有数据时先备份，再讨论迁移。",
    groups,
  };
}

export function buildDatabaseInspection(
  purpose: DataPurpose,
  existing: ExistingDatabase,
) {
  return `我是非程序员，请只读检查当前项目的数据需求，不先创建服务或改代码。
我的用途：${dataPurposes.find((item) => item.value === purpose)?.label}。
目前情况：${existingDatabases.find((item) => item.value === existing)?.label}。
根据真实依赖、数据访问代码和配置示例，区分：浏览器本地保存、业务记录、登录、用户上传文件、缓存、向量检索。指出实际使用的数据库类型、客户端、配置文件与变量名称，不读取或输出秘密值。
若不需要云数据库请明确说；已有服务优先沿用，不把本地 SQLite 文件、PostgreSQL、MySQL、MongoDB 当作可随意换地址的同一种数据库。检查文件是否会因重新部署丢失，跨设备是否需要共享数据。
告诉我本地开发与上线分别要准备什么、哪些服务可复用、免费额度计算哪些用量。先用一条测试记录或文件验证保存、刷新读取和权限，不修改正式数据。
最后用普通话给出必要服务清单、选择理由、下一步一个具体动作。若无法访问我的项目，请先说明需要我提供哪些不含凭据的文件。`;
}
