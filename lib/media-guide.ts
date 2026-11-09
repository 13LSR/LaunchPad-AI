export const mediaKinds = [
  {
    id: "photo",
    label: "照片 / 大背景",
    example: "产品实拍、封面、人物照",
    format: "先比较 WebP 与 AVIF，按兼容需要保留 JPEG",
    reason:
      "照片有很多颜色和细节，适当舍弃肉眼不易察觉的信息，通常能减小下载体积。实际是否划算，要和原图比较。",
    watch:
      "先按页面显示尺寸缩放；头像不需要下载相机原片。人脸、渐变和暗部要放大检查。",
    instruction:
      "按实际显示尺寸和设备像素密度建议照片导出尺寸。对比 WebP、AVIF 与 JPEG 的体积、肤色、渐变和暗部；按目标浏览器提供备用格式，不预设 AVIF 或 WebP 一定最小。",
    check:
      "手机与电脑上的照片清楚，人物和颜色正常，没有为了缩小体积而出现色块。",
  },
  {
    id: "screenshot",
    label: "带字截图",
    example: "操作教程、聊天记录、界面截图",
    format: "先保留 PNG，再比较无损 WebP",
    reason:
      "截图的小字和细线容易被有损压缩弄糊。无损压缩保留像素细节，但缩小尺寸仍然会影响可读性。",
    watch:
      "把截图裁到需要展示的范围；小字在手机上仍要能读清，不能只看文件变小了多少。",
    instruction:
      "对带文字的截图优先比较 PNG 与无损 WebP，保持文字和细线清楚。不要为了体积盲目降低分辨率或使用强有损压缩；必要时提供点击查看大图。",
    check: "手机上小字可读、细线完整；需要看细节时能打开清晰版本。",
  },
  {
    id: "transparent",
    label: "透明图片",
    example: "抠图、商品贴纸、透明插画",
    format: "比较透明 WebP 与 PNG；复杂插画可试 AVIF",
    reason:
      "这些格式可以保留透明背景。PNG 与无损 WebP 适合精确边缘；复杂色彩可比较 AVIF 的实际效果。",
    watch:
      "JPEG 不支持透明。换格式后要在浅色和深色背景上都检查边缘，避免出现白边或黑底。",
    instruction:
      "保留 alpha 透明通道，对比 PNG、透明 WebP 与适用时的 AVIF，不转成不支持透明的 JPEG。在浅色和深色背景检查毛发、细线与半透明边缘。",
    check: "透明背景仍然透明，浅色和深色页面上没有白边、黑边或缺失细节。",
  },
  {
    id: "vector",
    label: "矢量 Logo / 图标",
    example: "已有 SVG 文件、简单线条图",
    format: "已有 SVG 就先保留 SVG",
    reason:
      "矢量图用形状描述画面，放大仍清楚。把 PNG 后缀改成 SVG，不会变成真正的矢量图。",
    watch:
      "精简文件时保留颜色、渐变和可访问说明。陌生用户上传的 SVG 需要安全处理，不能直接作为页面代码执行。",
    instruction:
      "检查真正的 SVG 矢量素材并按需精简，保留 viewBox、颜色、渐变和必要的可访问说明；不要把位图改后缀伪装成 SVG。对用户上传的 SVG 做安全校验或转成安全的位图，不直接执行其中脚本或外部引用。",
    check:
      "Logo 放大清晰、颜色正确，没有丢失路径或裁切；上传内容不能执行脚本。",
  },
  {
    id: "animation",
    label: "动图 / 短动画",
    example: "表情、循环提示、几秒钟演示",
    format: "比较动态 WebP、APNG；长录屏改用视频",
    reason:
      "GIF 颜色有限，长动画往往很大。动态 WebP 支持有损与无损；APNG 适合需要无损与透明的动画。",
    watch:
      "工具必须支持动画导出，不能压完只剩第一帧。需要声音、暂停和拖动进度时，选择视频。",
    instruction:
      "识别动画帧、时长、循环次数和透明通道，比较动态 WebP、APNG 与必要的 GIF 兼容版本。不要把动画转成单帧。长录屏或需要音轨和进度控制时改用 MP4/WebM，并保留实际播放行为。尊重减少动态效果偏好。",
    check: "动画仍会播放，速度、循环和透明背景正确；减少动态效果时有静态替代。",
  },
  {
    id: "video",
    label: "录屏 / 视频",
    example: "产品演示、课程、短片",
    format: "常用兼容方案：MP4（H.264 + AAC）；按需补 WebM",
    reason:
      "MP4 是装视频和声音的容器，里面的编码也会影响能否播放。WebM 可作为补充，最终要在目标设备上试播。",
    watch:
      "先裁时长、调合适分辨率，再比较画质。配封面、播放按钮和字幕，避免打开网页就下载所有视频。",
    instruction:
      "核对容器与视频/音频编码，优先测试 MP4（H.264 视频 + AAC 音频），按实际设备补 WebM。比较合理分辨率、时长和码率；保留所需音轨、字幕和画面比例。提供封面、可操作的播放器及按需加载，验证手机播放、暂停和拖动进度，不把长视频转成 GIF。",
    check:
      "目标手机能播放、有正确声音与字幕，暂停和拖动可用，未播放时不抢下载整段视频。",
  },
  {
    id: "audio",
    label: "音频 / 播客",
    example: "配音、讲解、背景音乐",
    format: "网页播放先考虑 MP3；需要时比较 Opus",
    reason:
      "MP3 兼容范围广；Opus 适合语音等网络音频，但仍需检查播放环境。WAV / FLAC 更适合保留原件和后期处理。",
    watch:
      "先去掉多余空白，再听人声与音乐。不要一进入网页就自动出声；网页能播放的导出文件不同于编辑工程文件。",
    instruction:
      "保留 WAV/FLAC 等原始母版，按目标设备比较 MP3 与适用的 Opus。先检查静音片段、采样率、声道与码率，不盲目把立体声转单声道或过度降噪。保留所需时长与音质，提供播放/暂停、进度和文字说明，不自动有声播放。",
    check:
      "人声清楚、音乐无明显失真，播放/暂停和进度正常，进入页面不会突然出声。",
  },
  {
    id: "mixed",
    label: "不确定 / 混合素材",
    example: "照片、截图和视频混在一起",
    format: "先盘点，再分别选择格式",
    reason:
      "同一个项目可能有照片、截图、动画和视频，一条“全部转 WebP”的指令会漏掉不同素材的需求。",
    watch:
      "先找实际使用的位置、原尺寸和体积，挑几份样本；未使用的素材也先确认后再清理。",
    instruction:
      "先盘点项目实际引用的照片、截图、透明图、矢量图、动画、视频和音频，按用途分组。不要统一转为 WebP，不要把动画转成单帧，不要仅凭文件后缀判断内容；未使用的文件先列出，不直接删除。每类选择样本比较方案。",
    check: "每类素材都有合适方案，页面没有缺图、丢帧、透明背景消失或音轨丢失。",
  },
] as const;

export type MediaKind = (typeof mediaKinds)[number]["id"];
export const mediaIssues = [
  {
    id: "size",
    label: "文件太大，想保持清楚又小一点",
    action: "先处理尺寸，再对比样本",
    advice:
      "保留原件，只处理几个样本。比较体积与实际观感，再决定是否批量替换。",
    instruction:
      "先记录原始体积、尺寸或时长，按页面需求告诉我如何用工具导出少量样本，在可接受的观感下比较体积；不要承诺固定压缩比例。",
  },
  {
    id: "loading",
    label: "网页打开慢，或加载时内容乱跳",
    action: "先找真正拖慢页面的请求",
    advice:
      "慢可能来自文件过大，也可能是重复下载、远程连接或加载方式。首屏大图要及时出现，下面的素材再按需加载。",
    instruction:
      "先测实际页面的网络请求与首屏瓶颈，不把所有慢都归因于文件体积。检查重复请求、缓存、远程延迟、合适尺寸与宽高占位；首屏关键图片及时加载，非首屏按需加载，不把所有素材都预加载或都懒加载。",
  },
  {
    id: "quality",
    label: "压完变糊、透明背景没了，或不动了",
    action: "用原件定位丢失了什么",
    advice:
      "检查尺寸、透明背景、动画帧和导出设置。已经压糊的文件再转成无损格式，不能还原丢掉的细节。",
    instruction:
      "对比原件与当前版本，定位尺寸缩小、压缩、透明通道、动画帧或编码造成的变化。告诉我从原件重新导出的设置，不声称把模糊文件转成无损就能恢复细节；必要时先回退上一个可用版本。",
  },
  {
    id: "broken",
    label: "本地能看，上线却缺图或无法播放",
    action: "先查路径、权限和响应",
    advice:
      "404 常见于文件路径或大小写不匹配；403 常见于访问权限或链接过期。文件能下载却不能播放，还要核对编码。",
    instruction:
      "区分 HTTP 404、403 和文件可下载但不可播放。检查构建产物、路径大小写、基础路径、HTTPS、远程域名规则、响应内容类型、权限、签名链接期限及真实编码；只在证据表明跨域受限时配置精确的 CORS，不用公开私有文件或关闭鉴权来解决。",
  },
  {
    id: "lost",
    label: "用户上传过，重新部署后文件却没了",
    action: "先查文件是否写进临时目录",
    advice:
      "上传文件要独立保存，不能依赖一次运行的临时磁盘。先查现有文件、存储记录和备份，再修复保存方式。",
    instruction:
      "先核对现存文件、数据库记录和备份，检查是否把用户上传写入临时磁盘或构建目录。查明实际丢失原因，不能承诺恢复已丢失的数据。迁移到现有持久存储或提出候选，更新引用并验证重新部署后仍可访问。",
  },
] as const;
export type MediaIssue = (typeof mediaIssues)[number]["id"];
export const mediaStorage = [
  {
    id: "unknown",
    label: "还不清楚文件存在哪里",
    title: "先确认来源和谁能看",
    advice:
      "固定配图、用户上传和私密文件需要不同的保存方式。让 AI 读项目配置，优先复用已有服务。",
    instruction:
      "先识别文件来源、现有存储及访问权限，不把所有素材默认公开。固定配图、用户上传、私密文件分别说明；优先复用已有服务，不擅自开通新平台。",
    href: "/guide/databases",
    link: "了解数据库与文件存储的区别",
  },
  {
    id: "fixed",
    label: "我准备的固定配图 / 素材",
    title: "少量固定素材随网站发布",
    advice:
      "公开 Logo、配图可放项目 public 等静态目录。大量视频、音频或频繁更新的文件，可放独立存储，减少重复构建和传输。",
    instruction:
      "少量公开固定素材使用项目约定的静态目录（如 public），检查构建后的真实路径。大体积视频/音频结合下载流量评估独立存储，不机械地把所有文件打包进代码仓库。",
    href: "/guide/cloud",
    link: "查看网站托管与流量限制",
  },
  {
    id: "uploads",
    label: "用户会持续上传头像 / 附件",
    title: "上传文件放持久文件存储",
    advice:
      "R2、UploadThing、Cloudinary 等服务可独立保存文件。数据库记录文件位置和所属用户；图片处理和视频转码能力要另看。",
    instruction:
      "用户上传使用持久对象存储或文件服务，不能写入临时运行磁盘；数据库记录文件位置和所属用户。限制类型和大小，校验上传、读取和删除权限，验证重新部署后仍可访问。",
    href: "/guide/databases#database-15",
    link: "比较文件存储平台",
  },
  {
    id: "private",
    label: "私密照片 / 合同 / 付费内容",
    title: "文件保持私有，访问时验证身份",
    advice:
      "不要放 public，也不要发永久公开链接。由网站检查当前用户是否有权限，再提供短期可用的访问方式。",
    instruction:
      "私密文件保持私有，不放 public，不以永久公开链接访问。服务端检查身份与文件归属，按业务使用短期签名链接或受控下载；验证未登录和其他账号不能访问，不把密钥暴露到前端或聊天。",
    href: "/guide/databases#database-15",
    link: "选择支持权限控制的文件服务",
  },
] as const;
export type MediaStorage = (typeof mediaStorage)[number]["id"];
export const mediaEnvironments = [
  {
    id: "unknown",
    label: "不知道，让 AI 检查",
    instruction:
      "先读依赖、构建脚本与部署配置，确认真实框架、版本、素材路径和托管方式，不凭目录名猜测。",
  },
  {
    id: "next",
    label: "Next.js 网站",
    instruction:
      "检查当前 Next.js 版本与真实部署能力，再决定是否使用 next/image。核对 remotePatterns、sizes、宽高、首屏加载方式和图片优化服务费用；静态导出不能依赖默认服务端图片优化，按实际情况采用自定义 loader/已有图片服务或预先优化的静态文件。",
  },
  {
    id: "static",
    label: "普通网页 / 静态站",
    instruction:
      "检查构建后的资源路径，按需使用 picture/srcset/sizes、尺寸占位与延后加载；静态站没有自动运行的图片处理后端，预先生成文件或使用已有的图片服务。",
  },
  {
    id: "mini",
    label: "微信等小程序",
    instruction:
      "先识别小程序平台和基础库版本，查该平台官方文档中的图片/音视频组件、支持格式、包体积和合法域名要求；在开发工具与真机验证。不要套用浏览器专用的 next/image、picture 或 DOM 方案，也不假定浏览器支持就代表小程序支持。",
  },
] as const;
export type MediaEnvironment = (typeof mediaEnvironments)[number]["id"];
export type MediaContext = {
  kind: MediaKind;
  issue: MediaIssue;
  storage: MediaStorage;
  environment: MediaEnvironment;
  detail: string;
};
export const defaultMediaContext: MediaContext = {
  kind: "photo",
  issue: "size",
  storage: "unknown",
  environment: "unknown",
  detail: "",
};

export function getMediaAdvice(context: MediaContext) {
  const kind = mediaKinds.find((item) => item.id === context.kind)!;
  const issue = mediaIssues.find((item) => item.id === context.issue)!;
  const selectedStorage = mediaStorage.find(
    (item) => item.id === context.storage,
  )!;
  const storage =
    context.issue === "lost" && context.storage === "fixed"
      ? {
          ...selectedStorage,
          title: "先确认：真的是固定素材吗？",
          advice:
            "你选了固定素材，但问题是用户上传丢失。先让 AI 核对实际来源；如果是用户持续上传，就应使用独立文件存储，不能依赖 public 或临时目录。",
          href: "/guide/databases#database-15",
          link: "比较文件存储平台",
        }
      : selectedStorage;
  const checks = [
    kind.check,
    context.issue === "lost"
      ? "用测试文件验证重新部署后的读取；无法恢复的文件如实列出。"
      : context.issue === "broken"
        ? "在真实预览地址打开素材，检查路径、权限和播放结果。"
        : "记录样本处理前后的体积与尺寸或时长；收益不明显就保留更合适的版本。",
    context.storage === "private"
      ? "未登录和其他账号都无法读取、修改或删除这份私密文件。"
      : context.storage === "uploads"
        ? "测试上传、刷新读取、重新部署和删除，确认文件不会丢失。"
        : "替换引用后没有缺图或播放错误，保留原件与恢复方法。",
  ];
  return { kind, issue, storage, checks };
}

export function buildMediaTask(context: MediaContext) {
  const { kind, issue, storage, checks } = getMediaAdvice(context);
  const diagnostic = context.issue === "broken" || context.issue === "lost";
  const environment = mediaEnvironments.find(
    (item) => item.id === context.environment,
  )!;
  return [
    "我不懂编程，请检查素材放进项目后遇到的问题，用普通话解释实际原因、最小修复与验收方法。不要假定我已经压缩、上传或转换过文件。",
    `素材：${kind.label}。\n遇到的问题：${issue.label}。\n文件来源：${storage.label}。\n项目环境：${environment.label}。`,
    context.detail.trim()
      ? `补充情况（用户描述，实际原因仍请核对）：\n${context.detail.trim().slice(0, 1200)}`
      : "没有补充文件位置，请先检查项目实际引用，不要编造文件名或网络测试结果。",
    "如果你能访问项目，请先读取代码、素材引用和配置；如果只是聊天工具，请先告诉我需要提供哪些文件位置、配置片段或去除凭据后的错误，不能假装已经读取或改好了项目。不要让我把密码、密钥或私密下载链接粘贴进聊天。",
    `先解决当前问题：${issue.instruction}`,
    diagnostic
      ? `本次先修复访问或保存问题，不为排错顺手批量转格式。只有证据表明当前格式或编码造成兼容问题时，才参考以下素材规则：${kind.instruction}`
      : `素材检查规则（如需重新导出，说明原因和工具步骤，先让我处理样本）：${kind.instruction}`,
    `保存与权限：${storage.instruction}`,
    context.issue === "lost" && context.storage === "fixed"
      ? "我虽然选择了固定素材，但描述的是上传丢失：先核对真实来源；实际属于用户上传时不要放 public 或构建目录，应使用持久文件存储。"
      : "",
    `适配项目：${environment.instruction}`,
    diagnostic
      ? "保留现存文件、记录与备份，用测试文件验证最小修复。不覆盖原件，不删除丢失文件的记录；迁移前备份并保留恢复方法，不擅自上传私密素材到第三方。"
      : "保留原件与现有可用版本，不覆盖原始目录。先检查真实文件和引用，不要只改文件后缀或擅自批量转换；需要重新导出时告诉我具体工具与设置，让我先比较样本。处理素材前确认使用权，不移除必要版权信息；不擅自上传私密素材到第三方。",
    "复用已有工具与文件服务。若确实需要新增服务，说明保存容量、下载流量、转换/转码和请求如何计费，以及额度耗尽后行为；获得确认后再开通收费资源或发布到线上。",
    "完成后请给我：修改的文件与引用、样本前后体积/尺寸或时长、实际执行的验证结果，以及恢复原版本的方法。无法测试的设备或项目访问限制要明确说明，不承诺固定压缩比例或性能分数。",
    "我可以这样验收：\n" +
      checks.map((item, index) => `${index + 1}. ${item}`).join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildMediaIntegrationTask(kindId: MediaKind) {
  const kind = mediaKinds.find((item) => item.id === kindId)!;
  return `我已在外部工具里准备好要使用的${kind.label}，请帮我接回当前项目，不要重新压缩或转换。
先确认新文件放在哪、替换页面上的哪份素材、文件是否公开，以及当前框架和部署方式。如果你看不到项目或文件，告诉我需要提供哪些文件位置或代码片段，不能假装已经改好。
固定的公开素材沿用项目静态目录（如 public）；持续上传的文件使用已有持久文件存储；私密文件不能放 public 或永久公开链接。不要把本机 C:\\ 等绝对路径写进网页。
核对真实文件名、大小写、格式、尺寸或时长，再更新组件、样式、封面和相关引用。保留原文件和恢复方法，不覆盖原始目录，不自动删除仍被引用的素材。
按实际框架处理加载与尺寸占位；Next.js 静态导出不依赖默认图片优化服务器，小程序要按其组件和真机能力测试。不自动公开私密素材、开通收费资源或发布正式站点。
完成后告诉我修改了哪些引用、如何在本地查看，以及发布后应检查哪些地址。验收重点：${kind.check}。真实页面不能有缺图、错误路径、丢失动画帧或音轨；无法验证的项目明确说明。`;
}

type MediaTool = {
  id: string;
  name: string;
  use: string;
  environment: string;
  kinds: readonly MediaKind[];
  note: string;
  url: string;
  steps: readonly { title: string; body: string }[];
};
export const mediaTools: readonly MediaTool[] = [
  {
    id: "squoosh",
    name: "Squoosh",
    use: "几张照片或截图，直接在网页里处理",
    environment: "无需安装 · 图片在浏览器内处理",
    kinds: ["photo", "screenshot", "transparent", "mixed"],
    url: "https://squoosh.app/",
    note: "可以边调参数边比较原图和结果。照片可先试 WebP；带字截图试 PNG / 无损 WebP；透明图保留透明背景。",
    steps: [
      {
        title: "打开图片",
        body: "把电脑里的图片拖进页面，或点击选择图片。原图先保留一份。",
      },
      {
        title: "调整并比较",
        body: "在 Compress 中选格式；Quality 是画质，Lossless 是无损。需要缩尺寸时打开 Resize 并保持比例，拖动对比线检查文字、人物和边缘。",
      },
      {
        title: "下载新文件",
        body: "查看优化后的体积，确认清楚且更小，再点击下载图标。另存新文件，不覆盖原图；收益不明显就保留原格式。",
      },
    ],
  },
  {
    id: "caesium",
    name: "Caesium",
    use: "很多图片，一次批量处理",
    environment: "需安装 · Windows / macOS",
    kinds: ["photo", "screenshot", "transparent", "mixed"],
    url: "https://saerasoft.com/caesium/",
    note: "照片多时更方便。先用两三张试设置，确认画质后再处理整批；桌面下载与官网在线入口是两种方式。",
    steps: [
      {
        title: "安装并添加图片",
        body: "从官网选择对应系统的桌面版，打开后添加图片文件或文件夹。",
      },
      {
        title: "设置输出目录",
        body: "选择新的输出文件夹，再按素材设置格式、质量与尺寸。透明图不要导出成 JPEG。",
      },
      {
        title: "先处理样本再批量",
        body: "先比较几张的体积和预览，满意后压缩整批。检查输出数量，避免漏掉文件。",
      },
    ],
  },
  {
    id: "imageoptim",
    name: "ImageOptim",
    use: "用 Mac，想保持原格式压小一点",
    environment: "需安装 · macOS",
    kinds: ["photo", "screenshot", "transparent", "mixed"],
    url: "https://imageoptim.com/mac",
    note: "默认侧重无损优化，也可开启有损设置。先复制原文件再拖入；移除元数据时按需要保留版权信息。不是所有格式都能用它互转。",
    steps: [
      {
        title: "复制要处理的文件",
        body: "先建立副本，避免直接改到唯一的原图。",
      },
      {
        title: "把副本拖进应用",
        body: "等待优化完成，查看每张图减少的体积。希望保留画质时先用默认无损设置。",
      },
      {
        title: "检查并保存结果",
        body: "重新打开图片检查细节。不要仅看压缩百分比；体积变化很小也可能是原图已经优化过。",
      },
    ],
  },
  {
    id: "svgomg",
    name: "SVGOMG",
    use: "已有 SVG Logo / 图标，精简文件",
    environment: "网页工具 · 针对 SVG",
    kinds: ["vector", "mixed"],
    url: "https://jakearchibald.github.io/svgomg/",
    note: "只适用于真正的 SVG。它不是把照片变成矢量图的工具，也不能作为陌生上传内容的安全检测器。",
    steps: [
      { title: "打开 SVG", body: "点击 Open SVG 选中已有文件，保留原文件。" },
      {
        title: "比较前后效果",
        body: "先用默认设置并切换 Show original 对比。颜色、渐变和形状出错时撤回相关选项；保留项目需要的标题、说明和 viewBox。",
      },
      {
        title: "下载并在页面检查",
        body: "下载精简版本，在实际显示尺寸和放大时各看一次，确认没有裁切或丢失线条。",
      },
    ],
  },
  {
    id: "ezgif",
    name: "Ezgif",
    use: "GIF / 动态 WebP / APNG，保留动画处理",
    environment: "在线工具 · 注意文件上传方式",
    kinds: ["animation", "mixed"],
    url: "https://ezgif.com/",
    note: "按原格式进入 GIF、WebP 或 APNG 工具，可缩尺寸、优化或转换动画。部分功能提供本地处理；普通上传会把文件发送到服务端，私密素材先确认处理方式。",
    steps: [
      {
        title: "选对动画入口",
        body: "按现有文件格式选择工具，再导入文件。GIF 可以从 Optimize 开始；不要拿静态图片压缩器直接处理动图。",
      },
      {
        title: "先缩尺寸或适度压缩",
        body: "小幅调整后预览完整动画；减少帧数会影响流畅度，不要只看第一帧。",
      },
      {
        title: "保存并播放一遍",
        body: "点 Save 下载结果，检查动画时长、循环、透明背景和速度。长录屏改为视频更合适。",
      },
    ],
  },
  {
    id: "handbrake",
    name: "HandBrake",
    use: "录屏或视频太大，导出网页播放版本",
    environment: "需安装 · 电脑端",
    kinds: ["video", "mixed"],
    url: "https://handbrake.fr/",
    note: "先试一小段。MP4 搭配 H.264 视频和 AAC 音频是常用兼容方案；保留原视频、字幕和所需音轨。",
    steps: [
      {
        title: "打开视频",
        body: "导入原视频，选通用预设作为起点，输出文件用新名字。不要把低清原片放大到更高分辨率。",
      },
      {
        title: "检查格式和内容",
        body: "选择 MP4，核对视频编码、分辨率、音轨和字幕。先导出一小段，看画面和声音是否符合预期。",
      },
      {
        title: "导出并真机试播",
        body: "确认样本后导出整段，在手机上播放并拖动进度。另备一张封面，放到网站后点击再播放。",
      },
    ],
  },
  {
    id: "audacity",
    name: "Audacity",
    use: "配音 / 播客，剪掉空白并导出轻量版本",
    environment: "需安装 · Windows / macOS / Linux",
    kinds: ["audio", "mixed"],
    url: "https://www.audacityteam.org/",
    note: "网页播放可先导出 MP3。保留原始录音和编辑工程，上传到网站的是导出的音频文件。",
    steps: [
      {
        title: "导入录音",
        body: "打开音频，先备份原件，剪掉不需要的空白或片段。",
      },
      {
        title: "导出播放文件",
        body: "使用 Export Audio 导出音频，选择 MP3 等播放格式，指定新文件名；保存工程不等于导出音频。",
      },
      {
        title: "听完关键片段",
        body: "检查开头、结尾和人声，确认没有截断、失真或过度降噪，再比较文件大小。",
      },
    ],
  },
];
