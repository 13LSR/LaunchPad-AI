"use client";
import { useState } from "react";
import { CodeBlock } from "@/components/copy-button";
import "./local-recovery.css";

const runtimes = [
  {
    id: "node",
    name: "node / npm（网页项目）",
    command: "node",
    url: "https://nodejs.org/en/download",
    note: "Node.js 安装程序同时提供 npm。按项目要求选择 Node.js 版本，安装后重开终端。",
  },
  {
    id: "python",
    name: "Python",
    command: "python",
    url: "https://www.python.org/downloads/",
    note: "Windows 安装时按官方说明启用命令入口；macOS / Linux 通常使用 python3。不要把系统自带 Python 当成项目所需版本。",
  },
  {
    id: "pnpm",
    name: "pnpm",
    command: "pnpm",
    url: "https://pnpm.io/installation",
    note: "使用项目 packageManager 指定的版本；不要因为找不到 pnpm 就换成 npm 安装另一份锁文件。",
  },
  {
    id: "yarn",
    name: "Yarn",
    command: "yarn",
    url: "https://yarnpkg.com/getting-started/install",
    note: "Yarn 版本按项目要求安装，旧版与新版的安装方式有区别。",
  },
  {
    id: "bun",
    name: "Bun",
    command: "bun",
    url: "https://bun.sh/docs/installation",
    note: "按操作系统选择官方安装方式，装好后重开终端。",
  },
  {
    id: "java",
    name: "Java",
    command: "java",
    url: "https://adoptium.net/temurin/releases/",
    note: "Java 项目需要匹配的 JDK。按 README 的版本要求选择，不能只安装浏览器插件。",
  },
  {
    id: "go",
    name: "Go",
    command: "go",
    url: "https://go.dev/doc/install",
    note: "按 go.mod 和 README 里的版本要求安装 Go。",
  },
  {
    id: "docker",
    name: "Docker",
    command: "docker",
    url: "https://docs.docker.com/get-started/get-docker/",
    note: "安装命令工具后，还要启动 Docker Desktop 或 Docker Engine；显示版本号不代表引擎已运行。",
  },
] as const;

export function LocalRecovery() {
  const [os, setOs] = useState("windows");
  const [runtimeId, setRuntimeId] = useState("node");
  const [port, setPort] = useState("3000");
  const [processId, setProcessId] = useState("");
  const [framework, setFramework] = useState("node");
  const runtime = runtimes.find((item) => item.id === runtimeId)!;
  const executable =
    runtime.id === "python" && os !== "windows" ? "python3" : runtime.command;
  const version =
    executable +
    (runtime.id === "go"
      ? " version"
      : runtime.id === "java"
        ? " -version"
        : " --version");
  const valid =
    /^\d{1,5}$/.test(port) && Number(port) >= 1 && Number(port) <= 65535;
  const nextPort = Number(port) === 65535 ? 65534 : Number(port) + 1;
  const inspection =
    os === "windows"
      ? `Get-NetTCPConnection -LocalPort ${Number(port)} -State Listen -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess`
      : `lsof -nP -iTCP:${Number(port)} -sTCP:LISTEN`;
  const validProcess =
    /^\d{1,10}$/.test(processId) &&
    Number(processId) > 1 &&
    Number(processId) <= 2147483647;
  const terminate =
    os === "windows"
      ? `Stop-Process -Id ${Number(processId)}`
      : `kill -TERM ${Number(processId)}`;
  const alternative =
    framework === "node"
      ? `npm run dev -- --port ${nextPort}`
      : `${os === "windows" ? "python" : "python3"} -m http.server ${nextPort} --bind 127.0.0.1`;
  return (
    <div className="local-recovery">
      <label>
        你用的电脑终端
        <select
          className="tool-input"
          value={os}
          onChange={(e) => {
            setOs(e.target.value);
            setProcessId("");
          }}
        >
          <option value="windows">Windows · PowerShell</option>
          <option value="unix">macOS / Linux · 终端</option>
        </select>
      </label>
      <article>
        <h3>command not found / 不是内部或外部命令</h3>
        <p>
          先看报错里找不到的是哪个工具。下面每次只复制一行，粘贴到终端后按回车。
        </p>
        <label>
          报错里提到的工具
          <select
            className="tool-input"
            value={runtimeId}
            onChange={(e) => setRuntimeId(e.target.value)}
          >
            {runtimes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <h4>先看版本号</h4>
        <CodeBlock code={version} title="检查是否可以调用" />
        <p>
          出现版本号，说明当前终端能找到它。
          {runtime.id === "node" && "如果是 npm 找不到，再单独检查 npm："}
        </p>
        {runtime.id === "node" && (
          <CodeBlock code="npm --version" title="检查随 Node.js 安装的 npm" />
        )}
        <h4>仍然报错，就检查安装位置</h4>
        <CodeBlock
          code={
            os === "windows"
              ? `where.exe ${executable}`
              : `command -v ${executable}`
          }
          title="查看当前终端能找到的程序路径"
        />
        <p>
          没有路径：先安装工具，或按官方说明修复
          PATH（终端查找程序的位置列表）。{runtime.note}
        </p>
        <a href={runtime.url} target="_blank" rel="noreferrer">
          打开 {runtime.name} 官方安装说明
        </a>
        <p>
          安装完成后关闭终端，再打开一个新终端，重新复制上面的版本命令。
          {runtime.id === "python" &&
            os === "windows" &&
            "Windows 已装 Python 但入口不同，也可以试："}
        </p>
        {runtime.id === "python" && os === "windows" && (
          <CodeBlock code="py --version" title="检查 Windows Python 启动入口" />
        )}
        <p>
          如果找不到的是 vite、next
          或其他项目依赖，先回到项目根目录安装依赖，再用项目的启动脚本；不要把所有依赖都装到全局。
        </p>
      </article>
      <article>
        <h3>端口已被占用（EADDRINUSE / Address already in use）</h3>
        <p>
          端口就是本地地址最后的数字，例如 localhost:3000 中的
          3000。可能是上次启动的网页还没关。
        </p>
        <label>
          报错中的端口号
          <input
            className="tool-input"
            inputMode="numeric"
            value={port}
            maxLength={5}
            onChange={(e) => {
              setPort(e.target.value);
              setProcessId("");
            }}
            aria-invalid={!valid}
            aria-describedby={!valid ? "port-error" : undefined}
          />
        </label>
        {!valid ? (
          <p id="port-error" role="alert">
            请输入 1–65535 之间的整数，再复制命令。
          </p>
        ) : (
          <>
            <CodeBlock code={inspection} title="只查看占用情况，不会关闭程序" />
            <p>
              {os === "windows"
                ? "OwningProcess 是占用端口的进程编号。"
                : "COMMAND 是程序名，PID 是进程编号。"}
              没有结果通常表示没查到监听者。
              {os !== "windows" &&
                "若提示 lsof 不存在，先按系统方式安装该工具。"}
            </p>
            <details className="local-kill-process">
              <summary>找不到旧终端？结束占用端口的进程</summary>
              <p>
                先运行上面的查看命令，把结果里的{" "}
                {os === "windows" ? "OwningProcess" : "PID"}{" "}
                数字填到下面。进程就是正在运行的程序；结束进程会停止这个本地服务，不会删除项目文件。确认它是你要关闭的开发服务，先保存未保存的内容。
              </p>
              <label>
                查到的进程编号（PID）
                <input
                  className="tool-input"
                  inputMode="numeric"
                  value={processId}
                  maxLength={10}
                  placeholder="填写查看结果中的数字"
                  onChange={(e) => setProcessId(e.target.value)}
                  aria-invalid={!!processId && !validProcess}
                  aria-describedby="process-help"
                />
              </label>
              <p id="process-help">
                {processId && !validProcess
                  ? "请填写大于 1 的有效整数编号，不能填端口号、程序名或多条编号。"
                  : "如果有多条记录，先核对程序，逐个处理；不要填示例数字。"}
              </p>
              {validProcess && (
                <>
                  <CodeBlock
                    key={`inspect-${os}-${processId}`}
                    code={
                      os === "windows"
                        ? `Get-Process -Id ${Number(processId)} | Select-Object Id, ProcessName, Path`
                        : `ps -p ${Number(processId)} -o pid=,comm=`
                    }
                    title="先核对这个编号对应的程序"
                  />
                  <CodeBlock
                    key={terminate}
                    code={terminate}
                    title={`确认程序后，结束进程 ${Number(processId)}`}
                  />
                  <p>
                    执行后再运行端口查看命令。没有监听记录，表示端口已释放，可以重新启动项目。若提示找不到进程，重新查端口；若提示权限不足，先正常退出对应软件，不要盲目提升权限。
                  </p>
                  {os !== "windows" && (
                    <details className="local-force-process">
                      <summary>
                        确认是同一个卡住的开发进程，仍然关不掉？
                      </summary>
                      <p>
                        先重新查端口和进程编号。只有编号仍对应同一个开发服务时，才使用下面的强制命令；它不给程序保存或收尾的机会。
                      </p>
                      <CodeBlock
                        key={`force-${processId}`}
                        code={`kill -KILL ${Number(processId)}`}
                        title="最后手段：强制结束已核对的进程"
                      />
                    </details>
                  )}
                </>
              )}
            </details>
            <h4>最容易的办法：回到旧终端停止服务</h4>
            <p>
              找到之前显示网页地址的终端，按 <kbd>Ctrl</kbd> + <kbd>C</kbd>
              。等它回到可输入状态，再复制项目原来的启动命令。Ctrl+C
              是键盘操作，不需要输入成文字。
            </p>
            <details className="local-alternative-port">
              <summary>找不到旧终端？用另一个端口启动</summary>
              <label>
                确认你的项目类型
                <select
                  className="tool-input"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                >
                  <option value="node">
                    Next.js / Vite，使用 npm，启动脚本叫 dev
                  </option>
                  <option value="static">
                    纯 HTML 静态文件夹，已有 Python
                  </option>
                </select>
              </label>
              <p>
                {framework === "node"
                  ? "仅适用于 package.json 的 dev 确实启动 Next.js 或 Vite 的项目；先按该项目要求安装依赖。其他后端不能直接套这条命令。"
                  : "在存放公开网页文件的目录中执行；这个命令只预览静态文件，不能运行后端。"}
              </p>
              <CodeBlock
                code={alternative}
                title={`尝试改用 ${nextPort} 端口`}
              />
              <p>
                成功后保持终端运行，打开本次输出的网址（通常是 http://localhost:
                {nextPort}）。新端口仍被占用时，换一个空闲端口再试。
              </p>
            </details>
          </>
        )}
      </article>
      <article>
        <h3>安装依赖失败或其他错误</h3>
        <p>
          回到上方对应技术卡片里的“常见问题与处理”，选择现象并补充实际命令和完整错误。那里会生成包含当前系统、工具和入口的排错说明。
        </p>
      </article>
      <article>
        <h3>终端怎么停？命令输错了怎么办？</h3>
        <p>
          按 Ctrl+C 停止当前任务，按 ↑ 找回上一条命令，按 Tab
          尝试补全路径。这些是键盘操作，不用输入成文字。关闭运行中的终端，也可能让本地网页停止服务。
        </p>
      </article>
    </div>
  );
}
