export type CloudGuide = {
  cost: "recurring" | "trial" | "conditional";
  costLabel: string;
  sleep: string;
  storage: string;
  billing: string;
  start: string;
};

export const cloudGuides: Record<string, CloudGuide> = {
  "cloud-0": {
    cost: "recurring",
    costLabel: "免费额度 · 仅非商业",
    sleep: "按请求执行函数，可能有冷启动；不适合持续运行的程序。",
    storage: "不要把上传文件存在函数本地；数据库与文件服务另外接入。",
    billing: "Hobby 超额通常暂停相应功能，等待额度恢复；商业用途需选付费方案。",
    start: "导入代码仓库，选项目目录与框架，分别配置预览和正式环境变量。",
  },
  "cloud-1": {
    cost: "recurring",
    costLabel: "每日免费额度",
    sleep: "按请求运行，没有供你一直开着的传统服务器；CPU 时间有限。",
    storage: "持久数据使用 D1、KV、R2 或外部服务，各有独立用量。",
    billing:
      "免费动态请求按天重置；付费计划按请求和 CPU 计量。静态资源与动态请求分开算。",
    start:
      "先确认 Workers 兼容性；Next.js 通过 OpenNext 适配，再配置数据绑定和变量。",
  },
  "cloud-2": {
    cost: "recurring",
    costLabel: "每月免费额度",
    sleep: "静态网页直接分发；函数按请求运行，不提供通用常驻进程。",
    storage: "文件上传、登录与数据库需要对应服务；构建输出不是用户数据存储。",
    billing:
      "Free 的 300 credits 由发布、请求、带宽等共享；耗尽可能暂停账号下全部项目。",
    start: "导入仓库，确认构建命令与输出目录；带后台的框架需使用对应适配。",
  },
  "cloud-3": {
    cost: "recurring",
    costLabel: "免费额度 · 静态托管",
    sleep:
      "静态页面无需唤醒后端；若加 Pages Functions，按 Workers 的限制运行。",
    storage:
      "只存放部署好的网页文件；用户上传、登录和记录保存需单独的数据服务。",
    billing: "Free 每月 500 次构建；函数请求另外占用 Workers 额度。",
    start:
      "连接仓库或上传构建输出。Vite 常见输出是 dist，实际目录以项目配置为准。",
  },
  "cloud-4": {
    cost: "recurring",
    costLabel: "免费额度 · 静态托管",
    sleep: "不运行后端进程，静态站无需唤醒；不能托管 Python 服务。",
    storage: "适合公开的网页素材，不适合保存表单、账户或私密数据。",
    billing: "免费账号使用公开仓库；有站点大小、带宽软限制和用途限制。",
    start:
      "把代码放进自己的仓库，在 Pages 配置发布来源或 Actions；推送成功不等于网站已发布。",
  },
  "cloud-5": {
    cost: "recurring",
    costLabel: "每月免费额度",
    sleep: "空闲应用会自动停止实例，后续请求再启动；不要当作永久驻留进程。",
    storage:
      "Deno KV 或外部数据库保存记录，文件另选存储服务；与 Workers 绑定不能直接互换。",
    billing:
      "Free 包含 100 万请求、20 GiB 出站与 10 小时活跃 CPU；其他维度也有限额。",
    start: "先检查 Deno 与依赖兼容性，按官方项目设置关联仓库和环境变量。",
  },
  "cloud-6": {
    cost: "recurring",
    costLabel: "免费社区托管",
    sleep: "社区应用存在休眠和资源限制，适合允许等待唤醒的数据演示。",
    storage:
      "本地临时文件不作为唯一数据来源；需要保存的记录和图片接到外部服务。",
    billing: "社区托管免费；模型 API、外部数据库和其他调用方仍可能收费。",
    start: "连接 GitHub，选择仓库、分支与 Streamlit 入口，准备依赖和 Secrets。",
  },
  "cloud-7": {
    cost: "conditional",
    costLabel: "按作品与账号资格",
    sleep: "硬件与套餐决定休眠、启动等待和可用内存；GPU 不是默认免费的。",
    storage: "运行目录不能作为唯一持久存储；按 Space 方案接外部存储或持久卷。",
    billing:
      "静态 Space 免费；普通 Gradio / Docker 创建需付费计划。免费 ZeroGPU 有账号资格与数量限制。",
    start:
      "先选 Static、Gradio 或 Docker，确认账号资格与硬件；上传后看构建和运行日志。",
  },
  "cloud-8": {
    cost: "recurring",
    costLabel: "免费额度 · Python 入门",
    sleep: "免费账号不含 always-on 任务；Web 应用与后台任务是不同资源。",
    storage: "免费磁盘 512 MB，适合小型项目；先确认数据库和外部网络访问限制。",
    billing:
      "Beginner 免费账号有一个 Web 应用，出站访问受限；自定义域名等能力需要付费计划。",
    start:
      "适合现成 Flask / Django 网站，配置 Python 环境与 WSGI；FastAPI 不要照搬这个流程。",
  },
  "cloud-9": {
    cost: "recurring",
    costLabel: "每月免费额度 · 会休眠",
    sleep: "免费 Web 服务 15 分钟无流量后休眠，重新唤醒约需一分钟。",
    storage:
      "免费 Web 的本地文件会在重启或休眠后丢失；免费 Postgres 30 天到期。",
    billing:
      "750 小时由工作区共享，耗尽后当月免费 Web 服务暂停；带宽、构建等另有额度与计费规则。",
    start:
      "选 Web Service 或静态站，配置构建/启动命令、PORT 和环境变量，再验证健康检查。",
  },
  "cloud-10": {
    cost: "recurring",
    costLabel: "免费额度 · 测试实例",
    sleep: "Free 实例一小时无流量后缩容到零，下一次访问需要唤醒。",
    storage: "Free 不能挂载持久卷；用户文件和数据库需接外部服务。",
    billing:
      "每组织一个 Free 实例，512 MB / 0.1 vCPU；不支持 Worker Service，官方不建议用于生产。",
    start:
      "导入 Git 仓库或容器镜像，确认启动端口与健康检查；先看内存是否够用。",
  },
  "cloud-11": {
    cost: "recurring",
    costLabel: "试用后仍有小额免费用量",
    sleep: "可按服务配置运行方式；每月 $1 并不保证常驻程序能跑满整月。",
    storage: "数据库或上传目录需要持久卷，计算、卷和出站共同消耗预算。",
    billing:
      "先有 $5 / 30 天试用，之后 Free 每月 $1；Hobby 最低 $5/月，超过包含额度另计。Free 不含 Cron。",
    start:
      "一个项目中关联应用、数据库和变量；更新时沿用已有服务，不要重新创建数据库。",
  },
  "cloud-12": {
    cost: "trial",
    costLabel: "限期试用 → 按量付费",
    sleep: "Machines 可持续运行或配置自动停启；配置和费用由你管理。",
    storage: "持久卷单独计费；机器停止后，卷和根文件系统仍可能产生存储费用。",
    billing:
      "新组织没有常规免费计算层；$1 / 7 天试用结束后，使用计费资源需要付款方式。",
    start:
      "准备 Dockerfile 与 fly.toml，选择地区、机器和卷，再部署并检查健康状态。",
  },
  "cloud-14": {
    cost: "recurring",
    costLabel: "计费账号内的免费层",
    sleep: "服务可缩容到零，可能冷启动；持续后台计算与 Jobs 使用不同设置。",
    storage: "容器本地文件不持久；数据库、对象存储、镜像与构建是独立服务。",
    billing:
      "必须启用结算账号；免费层按账号汇总。超过额度及构建、镜像、流量等关联费用会计费。",
    start:
      "把项目构建为容器，配置身份、区域、端口与变量；需要定时执行时选择 Jobs 与调度。",
  },
  "cloud-15": {
    cost: "trial",
    costLabel: "新账号限期试用金",
    sleep: "AWS 是一组云服务，是否常驻、自动停启取决于实际选择的服务。",
    storage: "计算、数据库、磁盘和对象存储分别配置与计费，需要自行规划备份。",
    billing:
      "新账号先得 $100，完成指定活动最多再得 $100；Free Plan 最长六个月或额度用尽即结束。",
    start:
      "先让 AI 明确要用哪项服务和总费用；它不是一个导入代码就通用发布的网站。",
  },
  "cloud-16": {
    cost: "recurring",
    costLabel: "部分服务 Always Free",
    sleep: "虚拟机由你维护；账号闲置与资源回收规则、区域容量会影响可用性。",
    storage:
      "选用持久磁盘或数据服务并自己备份，别把免费容量理解成所有资源免费。",
    billing:
      "$300 / 30 天试用与 Always Free 是两回事。注册需身份和付款卡验证；付费账号超免费量会计费。",
    start:
      "适合会管理 Linux、网络与 Docker 的人；普通展示网站通常没必要先租虚拟机。",
  },
  "cloud-17": {
    cost: "recurring",
    costLabel: "Makers 免费计划",
    sleep:
      "静态站与云函数分开理解；云函数按平台运行限制执行，不是通用常驻服务器。",
    storage:
      "数据库、用户上传文件和函数能力分别确认；不能用构建目录保存业务数据。",
    billing:
      "Makers 有 Free 计划；不要将 CDN 套餐额度套给函数、数据库或其他产品。",
    start:
      "选择官方支持的框架和发布入口；面向大陆访问时还要确认加速区域与备案条件。",
  },
  "cloud-18": {
    cost: "conditional",
    costLabel: "个人测试免费方案",
    sleep: "边缘函数有运行限制，不能直接替代常驻 Python / Java 服务器。",
    storage: "业务记录和文件需要实际的数据服务，不自动包含在站点加速里。",
    billing:
      "免费测试套餐限购一个、新购续费免费；函数与增值项单独计量，不能等同完整业务免费。",
    start:
      "先确认函数 Pages 支持的框架、域名和地区，再关联仓库并配置环境变量。",
  },
  "cloud-20": {
    cost: "trial",
    costLabel: "七天试用 → 套餐付费",
    sleep:
      "容器可持续运行，资源占用与套餐一起考虑；不要靠删除代码判断是否停止计费。",
    storage: "持久卷与数据库需要明确挂载和备份；删除应用前先导出所需数据。",
    billing:
      "新用户七天试用；首购价与常规价不同，计算、内存、存储、流量按套餐范围使用。",
    start:
      "选择应用或容器镜像，配置端口、环境变量与持久卷，核对所在区域的套餐。",
  },
  "cloud-21": {
    cost: "trial",
    costLabel: "开发体验 · 上线后限期",
    sleep:
      "这是小程序等应用的后端，客户端另行发布；体验到期会停服，隔离期后可能销毁环境。",
    storage:
      "数据库、云函数、文件等共享资源点；做好权限与备份，按环境类型接入。",
    billing:
      "3000 资源点/月；小程序发布后第 15 天到期，长期运行需转付费。控制台体验续期不等同微信体验版。",
    start: "确认 AppID、云开发环境与账号套餐，再连接云函数、数据库和文件存储。",
  },
};
