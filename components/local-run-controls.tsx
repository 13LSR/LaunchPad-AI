"use client";
import type { CommandEntry } from "@/lib/command-data";
import {
  buildLocalInspection,
  isPythonEntry,
  runCommands,
  usesPackageManager,
  type LocalRunOptions,
} from "@/lib/local-run";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { CommandSteps } from "@/components/command-steps";

export function LocalRunControls({
  entry,
  options,
  onChange,
}: {
  entry: CommandEntry;
  options: LocalRunOptions;
  onChange: (options: LocalRunOptions) => void;
}) {
  const python = isPythonEntry(entry);
  const code = runCommands(entry, options);
  if (!code)
    return (
      <p className="local-gui-note">
        这个项目主要在开发工具中打开，按上方步骤预览即可，不需要为了启动而套用
        npm 命令。
      </p>
    );
  return (
    <div className="local-run-controls">
      {entry.variants && (
        <div className="local-variant">
          <label htmlFor={entry.id + "-variant"}>
            按项目文件选择运行方式，只用其中一套
          </label>
          <select
            id={entry.id + "-variant"}
            className="tool-input"
            value={options.variant || entry.variants[0].name}
            onChange={(event) =>
              onChange({ ...options, variant: event.target.value })
            }
          >
            {entry.variants.map((variant) => (
              <option key={variant.name}>{variant.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="command-settings">
        {usesPackageManager(entry, options.variant) && (
          <div>
            <p>沿用项目的包管理器</p>
            <Tabs
              value={options.manager}
              onValueChange={(manager) =>
                onChange({
                  ...options,
                  manager: manager as LocalRunOptions["manager"],
                })
              }
            >
              <TabsList aria-label="包管理器">
                {["npm", "pnpm", "yarn", "bun"].map((manager) => (
                  <TabsTrigger value={manager} key={manager}>
                    {manager}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <span>
              package-lock.json 选 npm；pnpm-lock.yaml 选 pnpm；yarn.lock 选
              Yarn；bun.lock 选 Bun。项目有明确说明时优先按说明。
            </span>
          </div>
        )}
        <div>
          <p>电脑终端</p>
          <Tabs
            value={options.os}
            onValueChange={(os) => onChange({ ...options, os })}
          >
            <TabsList aria-label="操作系统">
              <TabsTrigger value="Windows">Windows</TabsTrigger>
              <TabsTrigger value="macOS / Linux">macOS / Linux</TabsTrigger>
            </TabsList>
          </Tabs>
          <span>Windows 示例使用 PowerShell。</span>
        </div>
        {python && (
          <div className="local-python-tool">
            <label htmlFor={entry.id + "-python-tool"}>
              Python 项目使用哪种依赖文件？
            </label>
            <select
              id={entry.id + "-python-tool"}
              className="tool-input"
              value={options.pythonTool}
              onChange={(event) =>
                onChange({
                  ...options,
                  pythonTool: event.target
                    .value as LocalRunOptions["pythonTool"],
                })
              }
            >
              <option value="pip">requirements.txt：pip + 虚拟环境</option>
              <option value="uv">uv.lock：uv</option>
              <option value="poetry">poetry.lock：Poetry</option>
            </select>
          </div>
        )}
        {usesPackageManager(entry, options.variant) ? (
          <a href="#local-lockfiles">
            npm、pnpm 等工具不知道选哪个？看选择理由
          </a>
        ) : (
          <a href="#local-first">不知道在哪里输入命令？看首次运行准备</a>
        )}
      </div>
      <Tabs
        value={options.stage}
        onValueChange={(stage) =>
          onChange({ ...options, stage: stage as LocalRunOptions["stage"] })
        }
      >
        <TabsList aria-label="运行阶段" className="local-stage-tabs">
          <TabsTrigger value="first">第一次运行</TabsTrigger>
          <TabsTrigger value="again">以后再启动</TabsTrigger>
        </TabsList>
      </Tabs>
      <p className="local-stage-note">
        {options.stage === "first"
          ? "先准备依赖，再启动。已有正常环境可跳过已完成的步骤；每行成功后再继续。"
          : "假设依赖与配置已经准备好，省去重复安装。依赖变更、换电脑或重建环境后，请切回“第一次运行”。"}
      </p>
      {python && (
        <p className="local-python-note">
          {options.pythonTool === "pip"
            ? "虚拟环境将本项目的库与其他项目分开。已有 .venv 时跳过创建；每次新开终端仍需激活。若 PowerShell 拒绝激活，不修改整机策略，让 AI 按当前系统给出直接使用 .venv 中 Python 的方式。"
            : options.pythonTool === "uv"
              ? "先安装 uv，并确认项目有 pyproject.toml / uv.lock。uv sync 准备环境，uv run 在项目环境中运行，无需再手动激活或混用 pip。"
              : "先安装 Poetry，并按 pyproject.toml / poetry.lock 运行。poetry install 准备环境，poetry run 使用该环境，无需再创建另一套 .venv。"}
          {options.pythonTool !== "pip" && (
            <>
              {" "}
              <a
                href={
                  options.pythonTool === "uv"
                    ? "https://docs.astral.sh/uv/getting-started/installation/"
                    : "https://python-poetry.org/docs/#installation"
                }
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                查看 {options.pythonTool === "uv" ? "uv" : "Poetry"}{" "}
                官方安装方法
              </a>
            </>
          )}
        </p>
      )}
      <div className="local-command-context">
        <strong>在项目目录的终端执行</strong>
        <p>
          这里是常见运行方式。脚本名、入口文件和端口必须与项目一致；前后端在不同文件夹时，分别开终端执行对应步骤。
        </p>
        <CopyButton
          text={buildLocalInspection(entry, options)}
          label="不确定？复制实际运行方式检查任务"
        />
        <p>
          复制后发给已打开这个项目的 AI 编程助手，让它根据真实文件整理步骤。
        </p>
      </div>
      <CommandSteps code={code} />
    </div>
  );
}
