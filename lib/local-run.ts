import { commandEntries, type CommandEntry } from "./command-data";
import { adaptCommands, type PackageManager } from "./commands";

export type RunStage = "first" | "again";
export type PythonTool = "pip" | "uv" | "poetry";
export type LocalRunOptions = {
  manager: PackageManager;
  os: string;
  stage: RunStage;
  pythonTool: PythonTool;
  variant?: string;
};

export function commandGroup(category: string) {
  return /小程序/.test(category)
    ? "小程序前后端"
    : /Python/.test(category)
      ? "Python"
      : /跨平台/.test(category)
        ? "桌面 / 移动"
        : /Docker/.test(category)
          ? "Docker"
          : /前端|纯静态/.test(category)
            ? "前端 / 全栈"
            : "后端";
}
export function entryCode(entry: CommandEntry, variant?: string) {
  return (
    entry.variants?.find((item) => item.name === variant)?.code ??
    entry.variants?.[0].code ??
    entry.commands
  );
}
export function usesPackageManager(entry: CommandEntry, variant?: string) {
  return /\bnpm (?:install|run|start)\b/.test(entryCode(entry, variant));
}
export function isPythonEntry(entry: CommandEntry) {
  return commandGroup(entry.category) === "Python";
}

export function runCommands(entry: CommandEntry, options: LocalRunOptions) {
  let lines = adaptCommands(
    entryCode(entry, options.variant),
    options.manager,
    options.os,
  )
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  if (isPythonEntry(entry)) {
    const execution = lines.filter(
      (line) => !line.includes(" -m pip install "),
    );
    if (options.pythonTool !== "pip") {
      const prefix = options.pythonTool === "uv" ? "uv" : "poetry";
      return [
        ...(options.stage === "first"
          ? [prefix === "uv" ? "uv sync" : "poetry install"]
          : []),
        ...execution.map((line) => prefix + " run " + line),
      ].join("\n");
    }
    return [
      ...(options.stage === "first"
        ? [(options.os === "Windows" ? "python" : "python3") + " -m venv .venv"]
        : []),
      options.os === "Windows"
        ? ".\\.venv\\Scripts\\Activate.ps1"
        : "source .venv/bin/activate",
      ...(options.stage === "first" ? lines : execution),
    ].join("\n");
  }
  if (options.stage === "again") {
    lines = lines.filter(
      (line) =>
        !/^(?:(?:npm|pnpm|yarn|bun) install|composer install|bundle install|go mod download|flutter pub get)$/.test(
          line,
        ) && !line.startsWith("docker build "),
    );
    lines = lines.map((line) =>
      line === "docker compose up --build" ? "docker compose up" : line,
    );
  }
  if (options.os !== "Windows")
    lines = lines.map((line) =>
      line.replace(/^python -m http\.server/, "python3 -m http.server"),
    );
  return lines.join("\n");
}

const signatures: [string, RegExp][] = [
  ["local-6", /^next\.config\.(?:js|mjs|ts)$/],
  ["local-7", /^vite\.config\.(?:js|mjs|ts|mts)$/],
  ["local-8", /^nuxt\.config\.(?:js|ts)$/],
  ["local-9", /^astro\.config\.(?:js|mjs|ts|mts)$/],
  [
    "local-10",
    /^(?:remix\.config\.(?:js|mjs)|react-router\.config\.(?:js|ts))$/,
  ],
  ["local-11", /^svelte\.config\.(?:js|ts)$/],
  ["local-13", /^angular\.json$/],
  ["local-14", /^(?:docusaurus\.config\.(?:js|ts)|\.vitepress)$/],
  ["local-21", /^manage\.py$/],
  ["local-27", /^nest-cli\.json$/],
  ["local-28", /^wrangler\.(?:toml|json|jsonc)$/],
  ["local-29", /^deno\.(?:json|jsonc)$/],
  ["local-31", /^go\.(?:mod|sum)$/],
  [
    "local-32",
    /^(?:pom\.xml|build\.gradle(?:\.kts)?|mvnw(?:\.cmd)?|gradlew(?:\.bat)?)$/,
  ],
  ["local-33", /^(?:composer\.(?:json|lock)|artisan)$/],
  ["local-34", /^cargo\.(?:toml|lock)$/],
  ["local-35", /^gemfile(?:\.lock)?$/],
  ["local-38", /^(?:src-tauri|tauri\.conf\.json)$/],
  ["local-40", /^pubspec\.(?:yaml|lock)$/],
  ["local-42", /^(?:dockerfile|(?:docker-)?compose(?:\.[\w-]+)?\.ya?ml)$/],
  ["local-wechat", /^(?:project\.config\.json|.*\.(?:wxml|wxss))$/],
  ["local-uniapp", /^pages\.json$/],
  ["local-cloudbase", /^cloudfunctions$/],
];
const locks: [PackageManager, RegExp][] = [
  ["npm", /^package-lock\.json$/],
  ["pnpm", /^pnpm-lock\.yaml$/],
  ["yarn", /^yarn\.lock$/],
  ["bun", /^bun\.lockb?$/],
];

export function identifyLocalFiles(input: string) {
  const tokens = input
    .toLocaleLowerCase()
    .replaceAll("\\", "/")
    .split(/[\s,，、;；"'`]+/)
    .flatMap((token) => token.split("/"))
    .filter(Boolean);
  const exact = signatures
    .filter(([, pattern]) => tokens.some((token) => pattern.test(token)))
    .map(([id]) => id);
  const managers = locks
    .filter(([, pattern]) => tokens.some((token) => pattern.test(token)))
    .map(([manager]) => manager);
  const pythonTools = [
    ...(tokens.includes("requirements.txt") ? ["pip" as const] : []),
    ...(tokens.includes("uv.lock") ? ["uv" as const] : []),
    ...(tokens.includes("poetry.lock") ? ["poetry" as const] : []),
  ];
  const genericPython = tokens.some((token) =>
    /^(?:requirements\.txt|pyproject\.toml|uv\.lock|poetry\.lock|.*\.py)$/.test(
      token,
    ),
  );
  const genericNode = tokens.includes("package.json") || managers.length > 0;
  let candidates = commandEntries.filter((entry) => exact.includes(entry.id));
  let note =
    "根据文件名缩小范围，仍需对照项目说明；同一个仓库也可能包含前端、后端或 Docker 等多种运行入口。";
  if (!candidates.length && genericPython) {
    candidates = commandEntries.filter(isPythonEntry);
    note =
      "这些文件能说明项目使用 Python，但不能仅凭 app.py 或依赖清单确定框架。再看 README 或让 AI 检查代码中的导入。";
  } else if (!candidates.length && genericNode) {
    candidates = commandEntries.filter((entry) => usesPackageManager(entry));
    note =
      "只有 package.json 或锁文件还不能确定框架。打开 package.json 看 dependencies 和 scripts，或复制识别任务交给 AI。";
  } else if (!candidates.length && tokens.includes("index.html")) {
    candidates = commandEntries.filter((entry) => entry.id === "local-16");
    note =
      "如果没有构建配置和 package.json，可以查看原生静态网页。Vite 等项目也会有 index.html，不能只凭它判断。";
  } else if (!candidates.length && input.trim()) {
    note =
      "还不能仅凭这些文件名判断。可补充配置文件名，或让 AI 查看真实项目；例如 manifest.json 也可能属于不同类型的项目。";
  }
  return { candidates, exact: exact.length > 0, note, managers, pythonTools };
}

export function buildLocalInspection(
  entry?: CommandEntry,
  options?: LocalRunOptions,
  clues = "",
) {
  return `我是非程序员，请检查当前项目，整理一份我以后能自己照着运行的说明。
${entry ? "我正在参考的技术栈：" + entry.title : "我还不知道项目的技术栈。"}
${clues.trim() ? "我看到的文件名：" + clues.trim() : "请从项目真实文件判断，不要猜测框架。"}
${options ? "电脑终端：" + options.os + (options.os === "Windows" ? "（PowerShell）" : "") + "。" : "先确认我使用的操作系统和终端。"}
先只检查，不运行安装脚本或修改配置。找出 README、依赖清单、锁文件、版本要求、实际启动脚本和需要的环境变量名称，不读取或输出真实密钥。若是多目录项目，分别说明前端、后端、数据库从哪个目录启动、哪些需要同时运行。
不要只因存在 package.json 就认定是 Next.js，也不要只因存在 app.py 就认定是 Flask。以真实依赖、入口和作者说明为依据；多个锁文件先解释各自属于哪个目录，不直接删除。
输出：首次准备步骤、以后每次启动步骤、每条命令的执行目录与作用、成功后的地址或结果、怎样停止，以及哪些配置缺失会阻止运行。命令一行一条，使用项目真实脚本名与入口，不套用模板。若需要数据库，先说明开发数据库和配置，不擅自迁移生产库。
最后把准确步骤整理为可保存的 RUN_LOCAL.md 内容，注明需要我填写的值和验证方法。`;
}

export function buildLocalTroubleshooting(
  entry: CommandEntry,
  options: LocalRunOptions,
  symptom = "",
  command = "",
  error = "",
) {
  const issue = entry.issues.find((item) => item.symptom === symptom);
  const issues = issue ? [issue] : entry.issues;
  return `请诊断当前项目的 ${entry.title} 运行问题。
电脑终端：${options.os}${options.os === "Windows" ? "（PowerShell）" : ""}
运行阶段：${options.stage === "first" ? "第一次准备并运行" : "已经准备过，这次重新启动"}
${usesPackageManager(entry, options.variant) ? "选择的包管理器：" + options.manager + "；需对照真实锁文件确认。\n" : ""}${isPythonEntry(entry) ? "Python 依赖方式：" + options.pythonTool + "。\n" : ""}${options.variant ? "项目分支：" + options.variant + "。\n" : ""}页面提供的参考命令（不代表我已执行）：
${runCommands(entry, options) || "本项目按开发工具界面操作，没有通用终端启动命令。"}
我实际执行的命令：${command.trim() || "尚未提供，请先向我确认"}
我遇到的现象：${symptom || "尚未提供，请先向我确认"}
完整报错（已去除凭据）：${error.trim() || "尚未提供，请先向我索取必要日志，不要猜测原因"}

请根据实际项目验证这些排查方向：
${issues.map((item) => item.symptom + "：可能因为" + item.cause + "；处理方向：" + item.fix).join("\n")}
先核对所在目录、真实入口、工具版本与当前环境，再给最小修复。不要直接重建项目、删除锁文件、清空数据库或修改整机执行策略。按一行一条命令解释作用与成功表现，修复后验证实际页面或任务结果，不以命令没有输出就认定失败。`;
}
