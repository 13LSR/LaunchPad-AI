export type CommandHelp = {
  title: string;
  purpose: string;
  when: string;
  success: string;
};
export function explainCommand(command: string): CommandHelp {
  const c = command.trim().replace(/^(?:uv|poetry) run /, "");
  if (command.trim() === "uv sync" || command.trim() === "poetry install")
    return {
      title: "按项目锁文件准备 Python 环境",
      purpose:
        command.trim() === "uv sync"
          ? "uv 根据 pyproject.toml 与 uv.lock 准备项目环境和依赖。"
          : "Poetry 根据 pyproject.toml 与 poetry.lock 安装项目和依赖。",
      when: "第一次运行或依赖变化后执行；先安装项目指定版本的 uv 或 Poetry。",
      success:
        "依赖安装正常结束，再用对应的 run 命令启动；不用另建或激活另一套环境。",
    };
  if (/^(npm|pnpm|yarn|bun) install$/.test(c))
    return {
      title: "安装项目依赖",
      purpose:
        "读取项目的依赖清单和锁文件，把它需要的软件包装到当前项目。依赖不会由 AI 生成代码后自动出现在电脑上。",
      when: "第一次运行、下载新项目或依赖清单改变后执行；平时启动不用重复安装。",
      success:
        "命令结束，终端重新出现可输入的位置；没有以 error / failed 结束，再继续下一步。",
    };
  if (/^(npm run|pnpm|yarn|bun run) (dev|docs:dev|start:dev)$/.test(c))
    return {
      title: "启动开发服务",
      purpose:
        "执行 package.json 里对应的脚本；它通常会启动本地网页或接口，并监听代码改动。",
      when: "每次开始本地开发时执行。先确认 scripts 里确实存在这个名称。",
      success:
        "终端显示本地地址或服务已启动。保持这个终端运行；访问实际输出地址，结束时按 Ctrl+C。",
    };
  if (
    /^(npm|pnpm|yarn|bun) start$/.test(c) ||
    / run serve$/.test(c) ||
    /^(pnpm|yarn) serve$/.test(c)
  )
    return {
      title: "执行项目启动脚本",
      purpose:
        "调用 package.json 的 start 或 serve；某些项目的 start 运行生产产物，需要先完成构建。",
      when: "按项目 scripts 的用途使用，不能把 start 和 dev 当成始终相同。",
      success:
        "看到服务地址或应用窗口；如果提示缺少构建文件，按项目要求先 build。",
    };
  if (c.includes("dev:weapp") || c.includes("dev:mp-weixin"))
    return {
      title: "编译微信小程序并监听修改",
      purpose: "把源代码转换成微信开发者工具能加载的目录，不会自动发布到微信。",
      when: "每次开发微信端时运行，并保持这个进程。",
      success:
        "看到编译成功；把实际输出目录导入微信开发者工具，再点编译或真机预览。",
    };
  if (c.includes("dev:h5"))
    return {
      title: "启动 H5 网页预览",
      purpose: "编译 uni-app 的网页版本；这不是微信小程序版本。",
      when: "需要在浏览器验证 H5 时运行。",
      success: "浏览器可打开终端显示的本地地址；其他端仍需单独构建验证。",
    };
  if (c.includes("tauri dev"))
    return {
      title: "启动 Tauri 桌面应用",
      purpose: "运行前端开发服务并编译 Rust 部分，首次可能较慢。",
      when: "安装 Node、Rust 和系统依赖后，每次开发时执行。",
      success: "终端编译完成并打开桌面窗口；系统工具缺失时看下方对应报错。",
    };
  if (c === "npx expo start")
    return {
      title: "启动 Expo 开发服务",
      purpose: "打包手机应用的 JavaScript，提供真机或模拟器连接入口。",
      when: "每次开发 App 时执行；项目依赖需先安装。",
      success:
        "看到二维码与操作选项；用受支持的 Expo Go 或开发构建连接，保持终端运行。",
    };
  if (c === "npx wrangler dev")
    return {
      title: "在本地模拟 Cloudflare Workers",
      purpose:
        "运行 Worker，并按配置提供本地 D1/KV 等绑定；默认不等于发布云端。",
      when: "开发与测试 Workers 时运行。",
      success:
        "看到本地地址（常见 8787）；打开实际接口路径，密钥与绑定按项目配置。",
    };
  if (c === "npx serve .")
    return {
      title: "把当前文件夹作为本地网站打开",
      purpose:
        "使用静态服务器提供当前目录的 HTML、CSS 与图片；npx 可能首次下载 serve，请确认包来源。",
      when: "预览静态网页时执行；应在 index.html 所在目录。",
      success: "终端输出 Local 地址，浏览器打开后看到网页；关闭服务用 Ctrl+C。",
    };
  if (c === "npx hexo server")
    return {
      title: "启动 Hexo 博客预览",
      purpose: "把 Hexo 文章与主题渲染成本地博客。",
      when: "完成依赖安装后，每次写作预览时执行。",
      success: "访问输出的网址（常见 4000）；修改文章后查看刷新结果。",
    };
  if (c === "npx ng serve")
    return {
      title: "启动 Angular 开发服务",
      purpose: "使用项目 Angular CLI 编译与监听页面。",
      when: "已安装依赖且项目支持 Angular CLI 时使用。",
      success: "构建完成并输出本地地址，通常为 4200。",
    };
  if (c.startsWith("python -m venv") || c.startsWith("python3 -m venv"))
    return {
      title: "为这个项目创建独立 Python 环境",
      purpose:
        "生成 .venv 文件夹，把本项目依赖与其他项目分开；这不会运行项目。",
      when: "每个项目第一次运行时创建一次，已有正常 .venv 不必重建。",
      success: "当前目录出现 .venv 文件夹，接着执行下面的激活命令。",
    };
  if (
    c.includes("Activate.ps1") ||
    c.includes("activate.bat") ||
    c.startsWith("source .venv")
  )
    return {
      title: "激活这个项目的 Python 环境",
      purpose:
        "让当前终端的 python 和 pip 指向 .venv，而不是电脑上其他项目的环境。",
      when: "每次重新打开终端后、安装依赖或运行项目之前执行。",
      success:
        "提示符通常出现 (.venv)；PowerShell 拒绝脚本时看环境说明中的替代方法。",
    };
  if (/python.* -m pip install/.test(c))
    return {
      title: "安装 Python 项目的依赖",
      purpose:
        "按 requirements.txt 下载当前项目使用的库，python -m pip 确保装到刚激活的环境。",
      when: "首次运行或依赖清单更新后执行；没有 requirements.txt 时应按 uv / Poetry 流程。",
      success: "安装正常结束；若出现版本、网络或编译错误，先处理失败项再启动。",
    };
  if (c.includes("-m uvicorn"))
    return {
      title: "启动 FastAPI 接口服务",
      purpose:
        "main:app 表示 main.py 中名为 app 的对象；--reload 用于开发时自动重启。",
      when: "每次本地调试接口时执行，入口按真实文件替换。",
      success:
        "看到 Uvicorn running；打开输出地址的 /docs 试用接口。此开发命令不直接作为生产方案。",
    };
  if (c.includes("-m flask"))
    return {
      title: "启动 Flask 开发服务器",
      purpose: "--app app 指向 app.py 等对应模块；--debug 便于本地调试。",
      when: "每次开发时执行，按真实模块名修改 --app。",
      success:
        "终端给出网址，通常为 localhost:5000；debug 模式不直接暴露到公网。",
    };
  if (c === "python manage.py runserver")
    return {
      title: "启动 Django 开发网站",
      purpose:
        "从 manage.py 读取项目设置并启动开发服务器，不会自动替你准备数据库表。",
      when: "依赖和开发数据库已准备后，每次开发时执行。",
      success:
        "看到 Starting development server；常见地址为 127.0.0.1:8000，缺表时按下方排错处理。",
    };
  if (c.includes("-m streamlit run"))
    return {
      title: "启动 Streamlit 网页",
      purpose:
        "让 Streamlit 解释入口文件并提供交互式页面；不同于直接 python app.py。",
      when: "每次使用数据看板时执行，入口文件名按实际替换。",
      success: "终端出现 Local URL（常见 8501），浏览器可看到数据看板。",
    };
  if (c === "python app.py" || c === "python main.py")
    return {
      title: "执行项目入口文件",
      purpose:
        "运行当前目录里的这个 Python 文件。Gradio 通常会启动网页，普通脚本则处理任务后结束。",
      when: "依赖装好并确认入口文件名后执行。",
      success:
        "Gradio 看输出网址；脚本看完成日志和输出文件，不是每个 Python 项目都有网页。",
    };
  if (c.includes("-m http.server"))
    return {
      title: "用 Python 预览静态网页",
      purpose:
        "在指定端口提供当前目录文件，不能运行 PHP、Node 或 Python Web 后端。",
      when: "电脑已有 Python，且需要预览 HTML 文件夹时执行。",
      success:
        "访问 http://localhost:8000；应看到 index.html，关闭时按 Ctrl+C。",
    };
  if (c === "node src/index.js" || c === "npx tsx src/index.ts")
    return {
      title: "直接运行后端入口",
      purpose:
        "按文件类型使用 Node 或 tsx；路径仅是示例，需替换为项目真实存在的入口。",
      when: "项目没有合适的启动脚本、且 README 明确直接运行入口时使用。",
      success: "看到项目日志或监听地址；如果是 API，根路径没有网页也可能正常。",
    };
  if (c === "deno task dev")
    return {
      title: "运行 Deno 的 dev 任务",
      purpose:
        "读取 deno.json / deno.jsonc 中 tasks.dev 定义的完整命令与权限。",
      when: "每次开发时执行；先确认任务存在。",
      success: "根据任务显示服务地址或运行结果；权限失败时只补必需权限。",
    };
  if (c === "go mod download")
    return {
      title: "下载 Go 依赖",
      purpose: "按 go.mod 和 go.sum 获取依赖，不会启动服务器。",
      when: "首次准备项目或依赖变更后执行。",
      success: "无错误返回输入提示；命令没有大量输出也可能正常。",
    };
  if (c === "go run .")
    return {
      title: "编译并运行当前 Go 主程序",
      purpose: "运行当前包；如果主程序在 cmd 子目录，需要改为项目真实入口。",
      when: "每次开发或测试时执行。",
      success: "出现服务日志或任务结果；网络服务地址以程序配置为准。",
    };
  if (/mvnw/.test(c))
    return {
      title: "通过 Maven 启动 Spring Boot",
      purpose:
        "使用项目附带的 Maven 包装器下载构建依赖并运行应用，不必另外全局安装 Maven。",
      when: "安装匹配 JDK、配置数据库后，每次本地开发时执行。",
      success: "日志出现 Started ...；通常监听 8080，实际看 server.port。",
    };
  if (/gradlew/.test(c))
    return {
      title: "通过 Gradle 启动 Spring Boot",
      purpose: "使用项目附带的 Gradle 包装器完成构建并运行 bootRun 任务。",
      when: "这是 Gradle 项目的分支，不与 Maven 命令一起执行。",
      success: "日志出现应用启动信息；首次下载 Gradle 与依赖可能较慢。",
    };
  if (c === "php -S localhost:8000")
    return {
      title: "启动 PHP 开发服务器",
      purpose: "在当前目录提供网页并解释 PHP 文件，仅用于本地开发。",
      when: "原生 PHP 项目预览时执行；Laravel 使用自己的启动方式。",
      success: "访问 http://localhost:8000，程序输出与错误在终端可见。",
    };
  if (c === "composer install")
    return {
      title: "安装 PHP 依赖",
      purpose:
        "按 composer.lock / composer.json 安装 PHP 库到 vendor，不更换项目依赖版本。",
      when: "首次运行或依赖清单更新后执行。",
      success: "依赖安装结束；遇到 PHP 版本或扩展要求先按错误补齐。",
    };
  if (c === "php artisan serve")
    return {
      title: "启动 Laravel 开发服务",
      purpose:
        "让 Laravel 使用项目配置启动本地网站，需要已准备 .env、APP_KEY 与数据库。",
      when: "完成开发配置后，每次开发时执行。",
      success:
        "出现本地访问地址；缺密钥或数据库配置时按下方排错，不覆盖现有生产配置。",
    };
  if (c === "cargo run")
    return {
      title: "构建并运行 Rust 项目",
      purpose: "Cargo 下载依赖、编译代码并启动默认二进制程序。",
      when: "每次本地运行时使用，后续会复用编译缓存。",
      success:
        "编译完成后出现运行日志或程序结果；第一次耗时较长，关注真正的 error 行。",
    };
  if (c === "bundle install")
    return {
      title: "安装 Ruby 依赖",
      purpose: "Bundler 读取 Gemfile 和锁文件，安装当前 Ruby 项目所需 gem。",
      when: "首次准备项目或依赖改变后执行。",
      success:
        "看到 Bundle complete 或成功结束，接着选 Rails 或 Jekyll 的启动命令。",
    };
  if (c === "bundle exec rails server")
    return {
      title: "启动 Rails 网站",
      purpose: "使用该项目锁定的 Rails 版本，避免与系统其他 gem 混用。",
      when: "Rails 项目已准备配置与开发数据库后执行。",
      success: "终端输出服务器地址，常见 3000；保持服务运行。",
    };
  if (c === "bundle exec jekyll serve")
    return {
      title: "构建并预览 Jekyll 博客",
      purpose: "把文章、模板与静态资源组合成本地网站，并监听修改。",
      when: "每次写作或查看博客时执行。",
      success: "访问输出网址，常见 4000；后端功能不会由 Jekyll 提供。",
    };
  if (c === "flutter pub get")
    return {
      title: "安装 Flutter / Dart 依赖",
      purpose: "按 pubspec.yaml 与锁文件获取库，不会打开应用。",
      when: "首次运行或依赖变更后执行。",
      success: "依赖求解成功；版本冲突时看具体不兼容的包与 SDK 范围。",
    };
  if (c === "flutter run -d chrome")
    return {
      title: "在 Chrome 中预览 Flutter 网页",
      purpose: "编译并运行该项目的 Web 目标；不代表已经打包 Android 或 iOS。",
      when: "需要网页预览且项目启用 Web 支持时执行。",
      success: "Chrome 打开应用；没有设备时先检查 flutter devices。",
    };
  if (c === "docker compose up --build" || c === "docker compose up")
    return {
      title: c.includes("--build")
        ? "构建并启动 Compose 中的服务"
        : "重新启动 Compose 中的服务",
      purpose:
        "按 compose.yaml / docker-compose.yml 启动已定义服务；带 --build 会先构建镜像，不带则复用可用镜像。",
      when: "Docker 引擎已启动、环境变量与数据卷已准备时执行。",
      success:
        "看到各服务日志且主要服务没有反复退出；按 ports 中的宿主端口访问，Ctrl+C 停止前台运行。",
    };
  if (c.startsWith("docker build"))
    return {
      title: "构建应用容器镜像",
      purpose: "按 Dockerfile 打包运行环境和代码，my-ai-app 是本地镜像名称。",
      when: "首次运行或代码/依赖变化后构建。",
      success: "构建成功产生镜像；它还没有启动，接着运行下面一行。",
    };
  if (c.startsWith("docker run"))
    return {
      title: "启动刚构建的容器",
      purpose:
        "-p 左边是电脑访问端口，右边是容器内程序端口。3000 只是示例，按程序实际端口替换。",
      when: "镜像构建成功后执行；按项目要求另配变量和数据卷。",
      success: "容器持续运行并输出日志，浏览器访问左侧宿主端口。",
    };
  return {
    title: "执行项目指定命令",
    purpose:
      "这条命令属于当前项目的工具流程，执行前确认与项目的脚本和文件一致。",
    when: "按上方步骤顺序执行。",
    success: "检查终端的成功结果；出现错误时先处理本步，再继续。",
  };
}
