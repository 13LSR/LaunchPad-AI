import type { DeploymentProfile } from "./prompt-data";
export type CommandEntry = {
  id: string;
  title: string;
  category: string;
  feature: string;
  description: string;
  address: string;
  commands: string;
  variants?: { name: string; code: string }[];
  relatedLocalIds?: string[];
  useCases: string[];
  profile: DeploymentProfile;
  prerequisite: string;
  docsUrl: string;
  issues: { symptom: string; cause: string; fix: string }[];
  guiSteps?: { title: string; body: string }[];
};
export const commandEntries: CommandEntry[] = [
  {
    id: "local-6",
    title: "Next.js (React 全栈框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature:
      "有 package.json，且包含 next.config.js、next.config.mjs 或 next.config.ts；文件夹内有 app/ 或 pages/ 目录。",
    description:
      "用 React 同时构建页面和服务端功能。适合博客、产品网站和带登录的应用，部署时要区分静态导出与服务端模式。",
    address: "http://localhost:3000",
    commands: "npm install\nnpm run dev",
    useCases: ["博客与文档", "产品网站", "带登录的业务网站"],
    profile: "next",
    prerequisite: "Node.js（按 engines / .nvmrc 选择受支持版本）",
    docsUrl: "https://nodejs.org/en/download",
    issues: [
      {
        symptom: "requires Node.js version",
        cause: "项目要求的 Node 版本与当前版本不兼容。",
        fix: "运行 node --version 对比 package.json 的 engines；安装兼容版本后重开终端，再安装依赖。",
      },
      {
        symptom: "Missing script: dev",
        cause: "当前目录没有 dev 脚本，或你在项目外层。",
        fix: "打开当前 package.json 的 scripts；进入实际应用子目录，再运行其中定义的脚本。",
      },
      {
        symptom: "Missing environment variable / DATABASE_URL",
        cause: "项目启动时需要连接服务，但没有拿到配置。",
        fix: "对照 .env.example 填写服务端变量，确认文件名是项目读取的 .env.local 或 .env，然后重启。",
      },
    ],
  },
  {
    id: "local-7",
    title: "Vite + React / Vue / Svelte (现代纯前端框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature: "有 package.json，且根目录有 vite.config.js 或 vite.config.ts。",
    description:
      "开发 React、Vue 或 Svelte 网页的构建工具。适合交互页面和浏览器内运行的小工具；数据接口通常单独连接。",
    address: "http://localhost:5173",
    commands: "npm install\nnpm run dev",
    useCases: ["交互小工具", "纯前端管理界面", "个人数字名片"],
    profile: "static",
    prerequisite: "Node.js 与项目指定包管理器",
    docsUrl: "https://vite.dev/guide/",
    issues: [
      {
        symptom: "vite 不是内部命令 / command not found",
        cause: "项目依赖没装成功，或直接使用了未安装的全局命令。",
        fix: "在包含 package.json 的目录先安装依赖，再使用项目的 dev 脚本，而不是直接敲 vite。",
      },
      {
        symptom: "页面空白 / Cannot find module",
        cause: "导入路径、文件名大小写或环境变量有误。",
        fix: "查看浏览器控制台第一个错误；核对路径大小写。只有 VITE_ 前缀变量会暴露给前端，不要用它放密钥。",
      },
    ],
  },
  {
    id: "local-8",
    title: "Nuxt.js (Vue 3 全栈框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature: "根目录有 nuxt.config.ts 或 nuxt.config.js。",
    description:
      "基于 Vue 的全栈框架，支持服务端渲染、静态生成和后端接口。适合内容网站与完整 Web 应用。",
    address: "http://localhost:3000",
    commands: "npm install\nnpm run dev",
    useCases: ["Vue 全栈网站", "内容站", "带服务端接口的应用"],
    profile: "next",
    prerequisite: "项目要求的 Node.js 版本",
    docsUrl: "https://nuxt.com/docs/getting-started/installation",
    issues: [
      {
        symptom: "Nuxt could not initialize / prepare 失败",
        cause: "依赖安装或 Nuxt 的生成准备未完成。",
        fix: "先看安装日志第一个失败项；确认网络与 Node 版本，使用项目的安装命令重新完成 prepare。",
      },
      {
        symptom: "找不到 runtimeConfig 变量",
        cause: "本地或云端变量名未按 Nuxt 配置传入。",
        fix: "对照 nuxt.config 与运行配置文档核对 NUXT_ 变量名；私密配置不要放 runtimeConfig.public。",
      },
    ],
  },
  {
    id: "local-9",
    title: "Astro (内容驱动型静态与混合框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature:
      "根目录有 astro.config.mjs，且 src/pages 里有后缀为 .astro 的文件。",
    description:
      "偏重内容展示，默认尽量少发送浏览器 JavaScript。适合博客、文档和公司网站，也可以按需加入交互。",
    address: "http://localhost:4321",
    commands: "npm install\nnpm run dev",
    useCases: ["个人作品集", "博客", "企业介绍页"],
    profile: "static",
    prerequisite: "Node.js；混合渲染另需对应适配器",
    docsUrl: "https://docs.astro.build/en/install-and-setup/",
    issues: [
      {
        symptom: "No adapter installed",
        cause: "项目启用了服务端渲染，却没有配置目标平台适配器。",
        fix: "若全部是静态内容，采用静态输出；确实需要服务端时按目标平台添加 Astro adapter，再构建。",
      },
      {
        symptom: "交互按钮不响应",
        cause: "Astro 组件可能只渲染了 HTML，没有加载客户端交互。",
        fix: "让 AI 检查相关交互组件的 client: 指令和浏览器报错；不是给所有组件无差别加客户端 JS。",
      },
    ],
  },
  {
    id: "local-10",
    title: "Remix / React Router v7 (Web 标准全栈框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature:
      "根目录有 remix.config.js 或 react-router.config.ts，文件夹内有 app/root.tsx。",
    description:
      "围绕路由、数据加载与表单提交组织应用。具体启动方式要看项目采用的 React Router 或 Remix 版本。",
    address: "http://localhost:5173 或 http://localhost:3000",
    commands: "npm install\nnpm run dev",
    useCases: ["表单密集网站", "有数据加载的业务界面", "全栈 Web 应用"],
    profile: "next",
    prerequisite: "Node.js 与匹配项目版本的路由工具",
    docsUrl: "https://reactrouter.com/start/framework/installation",
    issues: [
      {
        symptom: "找不到 remix 或 react-router 命令",
        cause: "项目版本与照抄的命令不匹配。",
        fix: "检查 package.json 里使用的是 Remix 还是 React Router framework mode，运行已有 scripts。",
      },
      {
        symptom: "提交表单后报 405 / loader 报错",
        cause: "对应路由 action、loader 或服务端运行环境未配置正确。",
        fix: "先看服务器日志与出错路由，确认实际部署支持服务端执行，而不是纯静态上传。",
      },
    ],
  },
  {
    id: "local-11",
    title: "SvelteKit (轻量全栈框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature: "根目录有 svelte.config.js，组件后缀名为 .svelte。",
    description:
      "基于 Svelte 的全栈框架，可做静态网页和服务端应用。部署方式取决于项目选用的适配器。",
    address: "http://localhost:5173",
    commands: "npm install\nnpm run dev",
    useCases: ["轻量全栈网站", "表单应用", "交互内容站"],
    profile: "next",
    prerequisite: "Node.js；按部署目标选择 adapter",
    docsUrl: "https://svelte.dev/docs/kit/creating-a-project",
    issues: [
      {
        symptom: "window is not defined",
        cause: "服务端渲染时执行了浏览器专属代码。",
        fix: "将相关代码放入 onMount 或受 browser 检查保护的位置，不能在模块顶层直接访问 window。",
      },
      {
        symptom: "构建时提示 adapter 缺失",
        cause: "项目尚未指定静态或服务器部署方式。",
        fix: "按目标平台选择 SvelteKit adapter；静态适配只适合能预渲染的路由。",
      },
    ],
  },
  {
    id: "local-12",
    title: "Create React App / Vue CLI (传统旧版前端框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature:
      "无 vite.config 文件，但打开 package.json 能看到 react-scripts 或 @vue/cli-service。",
    description:
      "较早一代的 React / Vue 项目工具。维护旧项目时常会遇到，启动脚本和兼容的 Node.js 版本需仔细核对。",
    address: "http://localhost:3000 (React) 或 http://localhost:8080 (Vue)",
    commands: "npm install\nnpm start",
    variants: [
      {
        name: "Create React App",
        code: "npm install\nnpm start",
      },
      {
        name: "Vue CLI",
        code: "npm install\nnpm run serve",
      },
    ],
    useCases: ["维护旧 React 项目", "维护旧 Vue 项目"],
    profile: "static",
    prerequisite: "与旧项目兼容的 Node.js；新项目建议另选当前工具",
    docsUrl: "https://vite.dev/guide/",
    issues: [
      {
        symptom: "Missing script: dev",
        cause: "旧脚手架可能使用 start 或 serve。",
        fix: "React Scripts 项目选 npm start；Vue CLI 项目选 npm run serve，最终以 scripts 为准。",
      },
      {
        symptom: "error:0308010C / OpenSSL unsupported",
        cause: "旧构建依赖与当前 Node/OpenSSL 不兼容。",
        fix: "让 AI 检查受支持的升级路径与兼容 Node 版本；不把长期启用旧加密选项当成修复完成。",
      },
    ],
  },
  {
    id: "local-13",
    title: "Angular (企业级重型前端框架)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature: "根目录有 angular.json。",
    description:
      "提供路由、表单和依赖注入等完整结构，常见于功能较多的业务系统。需要匹配 Angular 与 Node.js 版本。",
    address: "http://localhost:4200",
    commands: "npm install\nnpm start",
    useCases: ["大型业务后台", "复杂表单系统"],
    profile: "static",
    prerequisite: "与 Angular 版本兼容的 Node.js",
    docsUrl: "https://angular.dev/tools/cli/setup-local",
    issues: [
      {
        symptom: "Node.js version is not supported",
        cause: "Angular 工具链对 Node 有版本范围要求。",
        fix: "查看项目 Angular 版本并对照官方兼容表，安装对应受支持版本，重新打开终端。",
      },
      {
        symptom: "NG 错误 / 模块找不到",
        cause: "模板或组件导入缺少依赖声明。",
        fix: "记录第一个 NG 错误和文件行号，让 AI 检查组件 imports，而不是重复安装整个项目。",
      },
    ],
  },
  {
    id: "local-14",
    title: "静态文档与博客生成器 (VitePress / Docusaurus / Hexo)",
    category: "一、 现代前端与全栈框架（Node.js 生态）",
    feature:
      "VitePress：有 .vitepress/config.mts。 Docusaurus：有 docusaurus.config.js。 Hexo：有 _config.yml 且 package.json 含 hexo。",
    description:
      "把 Markdown 文章整理成文档或博客。先识别具体生成器，它们的启动脚本并不相同。",
    address: "以终端输出为准",
    commands: "npm install\nnpm run docs:dev",
    variants: [
      {
        name: "VitePress",
        code: "npm install\nnpm run docs:dev",
      },
      {
        name: "Docusaurus",
        code: "npm install\nnpm start",
      },
      {
        name: "Hexo",
        code: "npm install\nnpx hexo server",
      },
    ],
    useCases: ["产品文档", "技术笔记", "静态博客"],
    profile: "static",
    prerequisite: "Node.js 与具体文档生成器",
    docsUrl: "https://vitepress.dev/guide/getting-started",
    issues: [
      {
        symptom: "Missing script: docs:dev",
        cause: "当前项目不一定是 VitePress，或脚本用了别的名字。",
        fix: "先从配置文件判断生成器，再选下方对应类型；打开 scripts 查看真正命令。",
      },
      {
        symptom: "部署后资源 404",
        cause: "站点部署在子路径，资源基路径未对齐。",
        fix: "核对 VitePress base、Docusaurus baseUrl 或 Hexo root，与实际访问子目录保持一致。",
      },
    ],
  },
  {
    id: "local-16",
    title: "原生 HTML + CSS + JavaScript",
    category: "二、 纯静态与零构建网页",
    feature:
      "文件夹里只有 index.html、style.css、script.js，没有任何 package.json 或语言配置文件。",
    description:
      "浏览器直接理解的网页文件。简单页面可直接打开；读取本地数据或使用模块时，用本地 HTTP 服务更可靠。",
    address:
      "http://localhost:3000 (npx serve) 或 http://localhost:8000 (Python)",
    commands: "npx serve .",
    variants: [
      {
        name: "Node.js 已安装",
        code: "npx serve .",
      },
      {
        name: "Python 已安装",
        code: "python -m http.server 8000",
      },
    ],
    useCases: ["简单活动页", "基础展示页", "不需构建的网页"],
    profile: "static",
    prerequisite: "Node.js 或 Python，二选一用于启动 HTTP 服务",
    docsUrl:
      "https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server",
    issues: [
      {
        symptom: "双击打开后 fetch 失败",
        cause: "file:// 与 HTTP 的安全规则不同。",
        fix: "用下方本地服务器启动后访问 localhost；若是外部接口跨域，还需接口服务允许你的来源。",
      },
      {
        symptom: "看见文件列表而不是首页",
        cause: "启动目录里没有 index.html 或选错文件夹。",
        fix: "进入放着 index.html 的目录，再启动服务；确认大小写与文件扩展名。",
      },
    ],
  },
  {
    id: "local-19",
    title: "FastAPI (现代高性能 Python API 框架)",
    category: "三、 Python 后端、AI 应用与数据看板",
    feature:
      "有 main.py 或 app.py，打开代码里面有 from fastapi import FastAPI，通常没有前端页面，专门提供接口。",
    description:
      "用 Python 提供数据接口，自带交互式 API 文档。适合 AI 服务或网站后端；页面界面可另外搭建。",
    address:
      "接口地址 http://localhost:8000，交互式测试文档地址 http://localhost:8000/docs（强烈推荐打开这个地址看效果）。",
    commands:
      "python -m pip install -r requirements.txt\n# main.py 中应用名为 app 时：\npython -m uvicorn main:app --reload --port 8000",
    useCases: ["Python API", "AI 模型接口", "数据查询服务"],
    profile: "python",
    prerequisite: "Python 与项目独立虚拟环境",
    docsUrl: "https://fastapi.tiangolo.com/tutorial/",
    issues: [
      {
        symptom: "Could not import module main",
        cause: "命令中的 main.py 路径不对应真实入口。",
        fix: "确认入口文件名和 app 变量；例如 api/main.py 应按包结构使用 api.main:app，从项目根目录运行。",
      },
      {
        symptom: "ModuleNotFoundError: uvicorn",
        cause: "当前 Python 环境没有装项目依赖。",
        fix: "先激活 .venv，再用 python -m pip 安装项目依赖；使用 python -m uvicorn 确保启动的是同一环境。",
      },
      {
        symptom: "打开根路径显示 Not Found",
        cause: "项目可能只有 API，没有首页。",
        fix: "试着打开 /docs；若接口文档正常，按实际接口调用，不需要为了 404 重建项目。",
      },
    ],
  },
  {
    id: "local-20",
    title: "Flask (轻量级 Python Web 框架)",
    category: "三、 Python 后端、AI 应用与数据看板",
    feature:
      "有 app.py 或 main.py，代码里有 from flask import Flask，可能有 templates/ 文件夹存放 HTML。",
    description:
      "轻量的 Python Web 框架，适合小网站和接口。入口文件、应用名和启动方式以项目为准。",
    address: "http://localhost:5000",
    commands:
      "python -m pip install -r requirements.txt\npython -m flask --app app run --debug --port 5000",
    useCases: ["轻量 Python 网站", "小型接口", "传统 Web 表单"],
    profile: "python",
    prerequisite: "Python 与项目虚拟环境",
    docsUrl: "https://flask.palletsprojects.com/en/stable/installation/",
    issues: [
      {
        symptom: "Could not import app",
        cause: "--app 指向了错误模块。",
        fix: "找到创建 Flask() 的文件；例如 server.py 应使用 --app server，工厂模式按项目说明指定。",
      },
      {
        symptom: "Address already in use",
        cause: "5000 端口被其他服务使用。",
        fix: "停止原服务，或将示例的 --port 5000 改为未占用端口；访问新端口。",
      },
    ],
  },
  {
    id: "local-21",
    title: "Django (全能型重装 Python 框架)",
    category: "三、 Python 后端、AI 应用与数据看板",
    feature:
      "根目录常见一个叫 manage.py 的文件，且包含 settings.py 和 urls.py。",
    description:
      "带有数据库、用户与管理后台等能力的 Python 框架。首次运行通常需要配置数据库和已有迁移。",
    address: "http://localhost:8000（后台管理地址为 /admin）",
    commands:
      "python -m pip install -r requirements.txt\npython manage.py runserver",
    useCases: ["有后台管理的业务网站", "用户与内容系统"],
    profile: "python",
    prerequisite: "Python；项目规定的开发数据库",
    docsUrl: "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
    issues: [
      {
        symptom: "no such table / relation does not exist",
        cause: "数据库中还没有项目需要的表。",
        fix: "先确认连接的是开发库，然后按迁移流程执行已有迁移；不要在未知生产库上直接操作。",
      },
      {
        symptom: "DisallowedHost",
        cause: "访问主机不在 ALLOWED_HOSTS。",
        fix: "把本地使用的主机加入开发配置；上线填写实际域名，不为方便长期允许所有主机。",
      },
      {
        symptom: "静态文件不显示",
        cause: "开发模式与生产静态文件方式不同。",
        fix: "本地检查 STATIC_URL 与 DEBUG；生产按项目说明收集静态文件并配置服务，不能照搬 runserver。",
      },
    ],
  },
  {
    id: "local-22",
    title: "Streamlit (数据看板与 AI 工具界面神器)",
    category: "三、 Python 后端、AI 应用与数据看板",
    feature: "代码文件里有 import streamlit as st，通常只有一个 app.py。",
    description:
      "用 Python 快速搭建数据看板或交互工具。使用 Streamlit 启动命令，入口文件名按项目替换。",
    address: "http://localhost:8501（运行后会自动弹窗打开浏览器）",
    commands:
      "python -m pip install -r requirements.txt\npython -m streamlit run app.py",
    useCases: ["Excel/CSV 数据看板", "内部数据演示", "Python 交互工具"],
    profile: "streamlit",
    prerequisite: "Python；表格库按项目安装",
    docsUrl: "https://docs.streamlit.io/get-started",
    issues: [
      {
        symptom: "missing ScriptRunContext / 页面没打开",
        cause: "把 Streamlit 程序当普通 Python 脚本启动。",
        fix: "使用 python -m streamlit run app.py；把 app.py 换成真实入口，访问终端输出地址。",
      },
      {
        symptom: "File does not exist",
        cause: "命令目录或入口文件不正确。",
        fix: "在项目中找到带 import streamlit 的入口，再从相应目录运行。",
      },
      {
        symptom: "Excel 上传提示 openpyxl 缺失",
        cause: "读取 xlsx 需要相应解析库。",
        fix: "确认 requirements 中是否声明 openpyxl；让 AI 按实际 Excel 读取方式补齐依赖，再重新安装。",
      },
    ],
  },
  {
    id: "local-23",
    title: "Gradio (大模型与 AI 演示界面首选)",
    category: "三、 Python 后端、AI 应用与数据看板",
    feature: "代码文件里有 import gradio as gr 和 demo.launch()。",
    description:
      "快速给模型、图片、语音处理功能添加网页界面。使用多少计算资源取决于实际模型与依赖。",
    address: "http://localhost:7860",
    commands: "python -m pip install -r requirements.txt\npython app.py",
    useCases: ["模型演示", "图像或语音交互面板"],
    profile: "gradio",
    prerequisite: "Python；模型需要的 CPU/GPU 与内存",
    docsUrl: "https://www.gradio.app/guides/quickstart",
    issues: [
      {
        symptom: "CUDA out of memory",
        cause: "模型或输入超过显存。",
        fix: "先减少输入/批量大小，核对模型最低硬件需求；没有足够 GPU 时选择兼容 CPU 的模型或合适实例。",
      },
      {
        symptom: "模型下载超时 / 401",
        cause: "模型源网络、授权或访问令牌有问题。",
        fix: "确认模型许可和账号访问权限，按模型官方登录方式配置服务端令牌，不写进前端代码。",
      },
      {
        symptom: "本地能开，上云连不到",
        cause: "容器监听地址或端口与平台要求不一致。",
        fix: "按 Gradio 和目标平台说明设置 server_name 与端口，不能只监听容器内部 localhost。",
      },
    ],
  },
  {
    id: "local-24",
    title: "纯 Python 脚本 / 爬虫 / 自动化任务",
    category: "三、 Python 后端、AI 应用与数据看板",
    feature:
      '只有 .py 文件，里面没有 Web 框架引用，结尾通常是 if __name__ == "__main__":。',
    description:
      "在终端执行处理数据、文件或自动化任务，完成后可能直接退出。没有网页界面是正常情况。",
    address: "以终端输出为准",
    commands: "python -m pip install -r requirements.txt\npython main.py",
    useCases: ["文件整理", "表格处理", "一次性自动化"],
    profile: "offline",
    prerequisite: "Python；输入文件和输出目录可访问",
    docsUrl: "https://docs.python.org/3/tutorial/venv.html",
    issues: [
      {
        symptom: "FileNotFoundError",
        cause: "相对路径按终端工作目录解析，不一定是脚本目录。",
        fix: "确认输入文件在哪里，从正确目录运行，或使用项目支持的绝对路径参数。",
      },
      {
        symptom: "PermissionError",
        cause: "文件正在被其他软件占用，或目录没有写权限。",
        fix: "先关闭占用文件的表格/编辑软件，改到自己可写的输出目录；不要默认用管理员权限重跑。",
      },
      {
        symptom: "程序运行后直接退出",
        cause: "脚本已经完成，未必是失败。",
        fix: "查看结束日志和输出目录；若出现 traceback，再从最后一段错误定位。",
      },
    ],
  },
  {
    id: "local-26",
    title: "Express / Fastify / Koa (经典 Node.js 后端)",
    category: "四、 Node.js / TypeScript 后端与边缘计算",
    feature:
      "有 package.json，依赖里有 express、fastify 或 koa，入口通常是 server.js、index.js 或 src/index.ts。",
    description:
      "用于编写 Node.js 数据接口与后端服务。优先运行 package.json 已有的脚本，避免猜测入口文件。",
    address: "以终端输出为准",
    commands: "npm install\nnpm run dev",
    variants: [
      {
        name: "已有 dev 脚本",
        code: "npm install\nnpm run dev",
      },
      {
        name: "JavaScript 入口示例",
        code: "npm install\nnode src/index.js",
      },
      {
        name: "TypeScript 入口示例",
        code: "npm install\nnpx tsx src/index.ts",
      },
    ],
    useCases: ["业务 API", "Webhook 接收", "WebSocket 服务"],
    profile: "realtime",
    prerequisite: "Node.js；数据库按项目准备",
    docsUrl:
      "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
    issues: [
      {
        symptom: "EADDRINUSE",
        cause: "监听端口被占用。",
        fix: "先按 Ctrl+C 停掉原服务，或按项目 PORT 配置换端口，然后使用新地址。",
      },
      {
        symptom: "Cannot GET /",
        cause: "只有接口路由，没有首页。",
        fix: "查看实际路由，例如 /health 或 /api/items；确认接口能返回数据即可，不意味着服务没启动。",
      },
      {
        symptom: "Cannot find module src/index.js",
        cause: "示例入口不存在。",
        fix: "优先运行 package.json scripts；仅在真实文件存在时使用直接入口命令。",
      },
    ],
  },
  {
    id: "local-27",
    title: "NestJS (企业级 TypeScript 后端框架)",
    category: "四、 Node.js / TypeScript 后端与边缘计算",
    feature:
      "根目录有 nest-cli.json，代码里有大量的 @Module、@Controller 装饰器。",
    description:
      "组织复杂 Node.js / TypeScript 后端的模块化框架。常见开发命令是 start:dev，仍需核对 scripts。",
    address: "http://localhost:3000",
    commands: "npm install\nnpm run start:dev",
    useCases: ["模块化业务后端", "复杂 API 系统"],
    profile: "python",
    prerequisite: "Node.js；项目数据库及环境变量",
    docsUrl: "https://docs.nestjs.com/first-steps",
    issues: [
      {
        symptom: "Nest can't resolve dependencies",
        cause: "模块没有提供或导入所需服务。",
        fix: "按报错中的模块和参数位置检查 providers/imports/exports，让 AI 修正依赖关系，而不是重装全部依赖。",
      },
      {
        symptom: "Missing script: start:dev",
        cause: "脚本名不同或所在目录错误。",
        fix: "查看 scripts，确认当前是 Nest 项目目录；工作区项目还要看具体应用脚本。",
      },
    ],
  },
  {
    id: "local-28",
    title: "Cloudflare Workers / Hono (边缘计算与 Serverless API)",
    category: "四、 Node.js / TypeScript 后端与边缘计算",
    feature:
      "常见 wrangler.toml / wrangler.jsonc；代码使用 Hono 或 Worker 的 fetch 入口。",
    description:
      "Workers 是 Cloudflare 的运行环境，Hono 是可用于多种环境的轻量框架。Wrangler 可在本地模拟 Workers。",
    address: "http://localhost:8787",
    commands: "npm install\nnpx wrangler dev",
    useCases: ["轻量 API", "短链接", "Webhook 与定时任务"],
    profile: "edge",
    prerequisite: "Node.js；Wrangler 配置文件",
    docsUrl: "https://developers.cloudflare.com/workers/get-started/guide/",
    issues: [
      {
        symptom: "binding is undefined",
        cause: "代码使用了 D1/KV/R2 绑定，但配置缺失或名字不一致。",
        fix: "对照 env.DB / env.CACHE 与 Wrangler binding 名；本地资源和远程资源分别确认。",
      },
      {
        symptom: "Missing secret / API_KEY",
        cause: "本地密钥文件未提供对应变量。",
        fix: "按 Wrangler 说明把本地值放入 .dev.vars 等支持的配置；部署时另外设置 secret，别提交密钥。",
      },
      {
        symptom: "Node API 不支持",
        cause: "依赖用了运行环境不支持的能力。",
        fix: "检查 nodejs_compat 与当前兼容日期；仍不支持的原生模块应替换或放到容器后端。",
      },
    ],
  },
  {
    id: "local-29",
    title: "Deno 原生项目",
    category: "四、 Node.js / TypeScript 后端与边缘计算",
    feature: "根目录常见 deno.json / deno.jsonc；也可能同时存在 package.json。",
    description:
      "可运行 JavaScript 和 TypeScript 的运行时。按 deno.json 的 tasks 启动，并只授予程序需要的权限。",
    address: "以终端输出为准",
    commands: "deno task dev",
    useCases: ["TypeScript API", "脚本与轻量服务"],
    profile: "edge",
    prerequisite: "Deno；查看 deno.json tasks",
    docsUrl: "https://docs.deno.com/runtime/getting_started/installation/",
    issues: [
      {
        symptom: "PermissionDenied",
        cause: "Deno 默认限制文件、网络或环境访问。",
        fix: "根据错误只授予需要的 --allow-net、--allow-read 等权限，不直接使用全部权限 -A。",
      },
      {
        symptom: "Task not found: dev",
        cause: "deno.json 没有名为 dev 的任务。",
        fix: "打开 tasks 看名称；若没有任务，按实际入口与所需权限编写运行命令。",
      },
    ],
  },
  {
    id: "local-31",
    title: "Go 语言 (Gin / Fiber / Echo / 原生后端)",
    category: "五、 其他主流后端语言（Go / Java / PHP / Rust / Ruby）",
    feature: "根目录有 go.mod 和 go.sum，以及 main.go。",
    description:
      "编译型语言，常用于网络服务和命令行工具。需要先安装 Go，入口有时在 cmd 子目录中。",
    address: "常见为 http://localhost:8080",
    commands: "go mod download\ngo run .",
    useCases: ["高并发 API", "网络服务", "命令行工具"],
    profile: "python",
    prerequisite: "Go；版本按 go.mod 要求",
    docsUrl: "https://go.dev/doc/install",
    issues: [
      {
        symptom: "no Go files / not a main package",
        cause: "根目录不是可运行入口。",
        fix: "检查是否在 cmd/server 等目录，按 README 运行对应包，例如 go run ./cmd/server。",
      },
      {
        symptom: "go version 不满足要求",
        cause: "当前 Go 工具链版本低于项目声明。",
        fix: "用 go version 对比 go.mod 的 go/toolchain 字段，按官方方式安装兼容版本。",
      },
    ],
  },
  {
    id: "local-32",
    title: "Java (Spring Boot)",
    category: "五、 其他主流后端语言（Go / Java / PHP / Rust / Ruby）",
    feature:
      "Maven 项目：根目录有 pom.xml 和 mvnw 文件。 Gradle 项目：根目录有 build.gradle 和 gradlew 文件。",
    description:
      "Java 后端框架，常用于业务接口。先按项目要求安装 JDK，再选择 Maven 或 Gradle 包装器。",
    address: "http://localhost:8080",
    commands: "./mvnw spring-boot:run",
    variants: [
      {
        name: "Maven（pom.xml）",
        code: "./mvnw spring-boot:run",
      },
      {
        name: "Gradle（build.gradle）",
        code: "./gradlew bootRun",
      },
    ],
    useCases: ["企业业务 API", "复杂后端系统"],
    profile: "python",
    prerequisite: "JDK；查看 Maven 或 Gradle 要求",
    docsUrl: "https://spring.io/guides/gs/spring-boot",
    issues: [
      {
        symptom: "JAVA_HOME / UnsupportedClassVersionError",
        cause: "没有找到 JDK，或编译版本高于当前 Java。",
        fix: "运行 java -version；核对构建配置要求的 JDK，配置正确后重开终端。",
      },
      {
        symptom: "Failed to configure a DataSource",
        cause: "数据库连接、驱动或配置缺失。",
        fix: "检查 application.yml、启用的 profile 与变量；确认数据库类型、地址和账号，不自动假定必须安装 MySQL。",
      },
      {
        symptom: "mvnw / gradlew 权限错误",
        cause: "系统命令格式或可执行权限不同。",
        fix: "Windows 选 .cmd/.bat 包装器；macOS/Linux 按仓库说明设置包装器执行权限，不下载陌生替代脚本。",
      },
    ],
  },
  {
    id: "local-33",
    title: "PHP (原生脚本 / Laravel 框架)",
    category: "五、 其他主流后端语言（Go / Java / PHP / Rust / Ruby）",
    feature:
      "大量 .php 文件；如果是 Laravel 框架，根目录会有 composer.json 和一个名为 artisan 的文件。",
    description:
      "PHP 用于网页与后端，Laravel 提供更完整的应用结构。需要 PHP；Laravel 还需要 Composer 与项目配置。",
    address: "http://localhost:8000",
    commands: "php -S localhost:8000",
    variants: [
      {
        name: "原生 PHP",
        code: "php -S localhost:8000",
      },
      {
        name: "Laravel",
        code: "composer install\nphp artisan serve",
      },
    ],
    useCases: ["Laravel 业务网站", "传统 PHP 网站"],
    profile: "python",
    prerequisite: "PHP；Laravel 另需 Composer 与配置",
    docsUrl: "https://laravel.com/docs/installation",
    issues: [
      {
        symptom: "No application encryption key",
        cause: "Laravel 缺少应用密钥。",
        fix: "仅在新建开发环境按项目说明生成 APP_KEY；不要覆盖已有生产密钥，否则可能无法解密旧数据。",
      },
      {
        symptom: "could not find driver",
        cause: "PHP 未启用数据库驱动扩展。",
        fix: "检查项目所用数据库，对照 php -m 输出启用对应扩展；修改的是当前命令行 PHP 的配置。",
      },
      {
        symptom: "composer install 版本冲突",
        cause: "PHP 版本或扩展与锁文件不兼容。",
        fix: "阅读 Composer 错误中列出的平台要求，安装对应版本/扩展，不用忽略平台要求强行安装。",
      },
    ],
  },
  {
    id: "local-34",
    title: "Rust (Axum / Actix-web 后端或系统工具)",
    category: "五、 其他主流后端语言（Go / Java / PHP / Rust / Ruby）",
    feature: "根目录常见 Cargo.toml 和 src/main.rs。",
    description:
      "用于网络服务、命令行和系统工具的编译型语言。Cargo 负责构建与依赖，首次编译通常需要更多时间。",
    address: "以终端输出为准",
    commands: "cargo run",
    useCases: ["Rust API", "系统工具", "高性能命令行"],
    profile: "python",
    prerequisite: "Rust/Cargo；Windows 可能需要 C++ 构建工具",
    docsUrl: "https://www.rust-lang.org/tools/install",
    issues: [
      {
        symptom: "linker not found / link.exe 缺失",
        cause: "系统链接工具尚未安装。",
        fix: "按 Rust 官方安装指引补齐目标系统工具链；Windows 通常需要匹配的 Visual Studio C++ Build Tools。",
      },
      {
        symptom: "failed to run custom build command",
        cause: "依赖需要系统库或原生编译工具。",
        fix: "查看失败包名与首个缺失库提示，安装它要求的系统依赖；不要随意移除 Cargo.lock。",
      },
    ],
  },
  {
    id: "local-35",
    title: "Ruby (Ruby on Rails / Jekyll 静态博客)",
    category: "五、 其他主流后端语言（Go / Java / PHP / Rust / Ruby）",
    feature: "根目录常见 Gemfile。",
    description:
      "Rails 构建完整网站，Jekyll 生成静态博客。安装 Ruby 后按 Gemfile 准备依赖，启动命令各不相同。",
    address: "以终端输出为准",
    commands: "bundle install\nbundle exec rails server",
    variants: [
      {
        name: "Rails",
        code: "bundle install\nbundle exec rails server",
      },
      {
        name: "Jekyll",
        code: "bundle install\nbundle exec jekyll serve",
      },
    ],
    useCases: ["Rails 全栈网站", "Jekyll 静态博客"],
    profile: "python",
    prerequisite: "Ruby、Bundler；按 .ruby-version 选择",
    docsUrl: "https://www.ruby-lang.org/en/documentation/installation/",
    issues: [
      {
        symptom: "Your Ruby version is ... but Gemfile specified ...",
        cause: "项目要求不同 Ruby 版本。",
        fix: "对照 .ruby-version 与 Gemfile 安装相同兼容版本，再执行 bundle install。",
      },
      {
        symptom: "Could not find gem",
        cause: "依赖未安装到当前 Ruby 环境。",
        fix: "从 Gemfile 所在目录执行 bundle install，再用 bundle exec 启动，避免调用其他版本的 gem。",
      },
      {
        symptom: "Jekyll 与 Rails 命令混用",
        cause: "它们是不同类型的 Ruby 项目。",
        fix: "有 _config.yml 的静态博客选 Jekyll；Rails 应有 config/application.rb，按项目类型切换。",
      },
    ],
  },
  {
    id: "local-37",
    title: "Electron (桌面软件框架)",
    category: "六、 跨平台桌面客户端与手机 App",
    feature:
      "package.json 依赖里有 electron，通常包含 main.js（主进程）和 preload.js。",
    description:
      "用网页技术构建桌面应用，适合需要桌面能力的产品。启动后可能打开应用窗口，而不是浏览器网址。",
    address: "以终端输出为准",
    commands: "npm install\nnpm run dev",
    useCases: ["离线桌面软件", "系统托盘工具", "需要 Node 能力的客户端"],
    profile: "desktop",
    prerequisite: "Node.js；安装包还需目标系统构建工具",
    docsUrl:
      "https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app",
    issues: [
      {
        symptom: "Electron failed to install correctly",
        cause: "安装依赖时 Electron 二进制下载未成功。",
        fix: "检查安装日志和网络，使用可信来源完成对应版本下载，再执行项目的安装步骤。",
      },
      {
        symptom: "应用打开但白屏",
        cause: "渲染入口地址或文件没有加载。",
        fix: "查看桌面窗口开发者工具和主进程日志，确认开发服务器已启动、loadURL/loadFile 指向真实入口。",
      },
    ],
  },
  {
    id: "local-38",
    title: "Tauri (轻量级 Rust + 前端桌面框架)",
    category: "六、 跨平台桌面客户端与手机 App",
    feature:
      "根目录有一个名为 src-tauri 的文件夹，且外层有前端的 package.json。",
    description:
      "结合网页界面与 Rust 的桌面框架，通常还需要系统构建工具。先阅读官方环境准备说明。",
    address: "以终端输出为准",
    commands: "npm install\nnpm run tauri dev",
    useCases: ["本地文件工具", "轻量桌面应用"],
    profile: "desktop",
    prerequisite: "Node.js、Rust 与系统先决条件",
    docsUrl: "https://v2.tauri.app/start/prerequisites/",
    issues: [
      {
        symptom: "cargo not found",
        cause: "Rust 工具链未安装或终端尚未更新 PATH。",
        fix: "按 Tauri 官方 prerequisites 安装 Rust，重开终端，用 cargo --version 检查。",
      },
      {
        symptom: "WebView2 / 系统库缺失",
        cause: "Tauri 依赖系统 WebView 和编译库。",
        fix: "按操作系统安装官方 prerequisites；Windows 检查 WebView2，Linux 对照 WebKitGTK 等依赖。",
      },
      {
        symptom: "tauri 脚本不存在",
        cause: "不是所有项目都定义 npm run tauri。",
        fix: "检查 package.json 的 scripts；下方命令只适用于定义了 tauri 脚本的项目，使用项目实际命令。",
      },
    ],
  },
  {
    id: "local-39",
    title: "React Native + Expo (跨平台手机 App)",
    category: "六、 跨平台桌面客户端与手机 App",
    feature: "package.json 里有 expo 和 react-native，根目录有 app.json。",
    description:
      "用 React 构建手机应用。Expo 可用开发服务器连接真机；部分原生能力需要开发构建，不能只靠 Expo Go。",
    address: "以终端输出为准",
    commands: "npm install\nnpx expo start",
    useCases: ["Android/iOS 原型", "手机工具", "跨平台移动界面"],
    profile: "mobile",
    prerequisite: "Node.js；Expo Go 或开发构建与真机",
    docsUrl: "https://docs.expo.dev/get-started/set-up-your-environment/",
    issues: [
      {
        symptom: "扫码后无法连接",
        cause: "手机与开发服务器网络不通。",
        fix: "电脑与手机连接同一局域网并检查防火墙；必要时按 Expo 官方文档使用 tunnel，留意额外依赖。",
      },
      {
        symptom: "Native module is missing",
        cause: "当前原生模块不包含在 Expo Go 中。",
        fix: "按模块要求创建 development build，不能靠刷新 JS 补出原生功能。",
      },
      {
        symptom: "SDK version incompatible",
        cause: "手机客户端与项目 SDK 不匹配。",
        fix: "按 Expo 推荐版本协调依赖；不要把 react-native 单独升级到任意版本。",
      },
    ],
  },
  {
    id: "local-40",
    title: "Flutter (Google 跨平台开发框架)",
    category: "六、 跨平台桌面客户端与手机 App",
    feature: "根目录常见 pubspec.yaml，代码存放在 lib/main.dart。",
    description:
      "用 Dart 编写跨平台界面。需安装 Flutter SDK，并准备目标平台需要的浏览器、模拟器或构建工具。",
    address: "以终端输出为准",
    commands:
      "flutter pub get\n# 直接在 Chrome 浏览器里作为网页运行预览（最省事）：\nflutter run -d chrome",
    useCases: ["跨端手机应用", "Flutter 网页预览", "桌面客户端"],
    profile: "mobile",
    prerequisite: "Flutter SDK；目标平台工具链",
    docsUrl: "https://docs.flutter.dev/get-started/install",
    issues: [
      {
        symptom: "No supported devices connected",
        cause: "Flutter 没有发现可运行设备。",
        fix: "用 flutter devices 查看设备；网页预览需可用 Chrome，手机则连接真机或启动模拟器。",
      },
      {
        symptom: "Android license / SDK 报错",
        cause: "Android 工具或许可未准备好。",
        fix: "先运行 flutter doctor 按报告安装对应 SDK 与确认许可，不必为网页预览盲目安装全部目标平台。",
      },
      {
        symptom: "依赖版本冲突",
        cause: "pubspec 中约束与当前 SDK 不兼容。",
        fix: "看 flutter pub get 的版本求解错误，按项目 SDK 范围调整，不删除锁文件碰运气。",
      },
    ],
  },
  {
    id: "local-42",
    title: "Docker / Docker Compose 项目",
    category: "七、 终极保姆容器：Docker 一键运行",
    feature:
      "根目录有 Dockerfile、以及 docker-compose.yml（或 compose.yaml）。",
    description:
      "按配置把应用与依赖放进容器。先启动 Docker，再确认端口、环境变量和持久化数据卷。",
    address: "以终端输出为准",
    commands: "docker compose up --build",
    variants: [
      {
        name: "有 compose.yaml / docker-compose.yml",
        code: "docker compose up --build",
      },
      {
        name: "只有 Dockerfile",
        code: "docker build -t my-ai-app .\n# 示例：程序监听 3000，按实际端口替换\ndocker run -p 3000:3000 my-ai-app",
      },
    ],
    useCases: ["已有 Docker 部署方案", "多服务应用", "统一开发环境"],
    profile: "container",
    prerequisite: "已启动的 Docker 引擎；足够内存",
    docsUrl: "https://docs.docker.com/get-started/get-docker/",
    issues: [
      {
        symptom: "Cannot connect to Docker daemon",
        cause: "Docker 引擎未启动或当前连接错误。",
        fix: "启动 Docker Desktop/服务，等待引擎可用；用 docker info 查看连接，不只是安装客户端。",
      },
      {
        symptom: "port is already allocated",
        cause: "宿主机映射端口被占用。",
        fix: "检查 compose ports 左侧宿主端口，换一个空闲端口；右侧容器端口必须匹配程序监听。",
      },
      {
        symptom: "重启后上传文件消失",
        cause: "文件只写在临时容器层。",
        fix: "把需要保留的数据放命名卷或对象存储，并验证重建容器后仍存在；不要随意执行 down -v。",
      },
    ],
  },
  {
    id: "local-wechat",
    title: "微信原生小程序",
    category: "小程序前后端",
    feature:
      "app.json、app.js / app.ts、pages/，通常还有 project.config.json；页面文件为 .wxml 与 .wxss。",
    description:
      "在微信内运行的应用。原生页面不由 npm run dev 打开，需要微信开发者工具编译与真机预览。",
    address: "微信开发者工具模拟器 / 手机扫码预览",
    commands: "",
    useCases: ["社区服务", "预约报名", "微信内工具"],
    profile: "wechat",
    prerequisite:
      "微信开发者工具、自己的小程序 AppID；纯界面学习可按工具支持范围使用测试方式",
    docsUrl:
      "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html",
    guiSteps: [
      {
        title: "导入项目",
        body: "安装并打开微信开发者工具，选择包含 project.config.json 的项目目录，填写自己的 AppID；如配置了 miniprogramRoot，工具会定位实际小程序目录。",
      },
      {
        title: "按项目情况构建依赖",
        body: "纯原生小程序不一定需要 npm。如果有 package.json，按项目说明安装依赖，再在开发者工具里执行「工具 → 构建 npm」。",
      },
      {
        title: "点击编译与预览",
        body: "先在模拟器验证，再点击预览用手机微信扫码。正式发布需上传版本并到小程序平台提交审核，不是把代码放到静态网站。",
      },
    ],
    issues: [
      {
        symptom: "AppID 无效 / 无项目权限",
        cause: "AppID 与当前登录开发者账号或项目不匹配。",
        fix: "在小程序平台确认真实 AppID，并给当前账号添加开发者权限；不要复制教程作者的 AppID。",
      },
      {
        symptom: "request:fail url not in domain list",
        cause: "请求地址未配置为该小程序允许的服务器域名。",
        fix: "在小程序后台配置合法 HTTPS 域名，检查实际请求的子域名；开发工具的临时跳过校验不能代替正式配置。",
      },
      {
        symptom: "云函数找不到 / environment not found",
        cause: "云环境 ID 不一致或函数尚未部署。",
        fix: "核对 wx.cloud.init 的环境 ID，将对应函数部署到同一环境，再检查云端日志与权限。",
      },
    ],
    relatedLocalIds: ["local-cloudbase", "local-26", "local-19"],
  },
  {
    id: "local-taro",
    title: "Taro 多端小程序",
    category: "小程序前后端",
    feature:
      "package.json 包含 @tarojs/*，config/ 配置构建，src/app.config.ts 声明页面。",
    description:
      "用 React 等方式编写多端应用，先编译为目标小程序文件，再用平台开发者工具预览。",
    address: "构建输出目录导入微信开发者工具，通常为 dist；以 outputRoot 为准",
    commands: "npm install\nnpm run dev:weapp",
    useCases: ["React 团队开发小程序", "微信与 H5 共用业务逻辑"],
    profile: "miniapp",
    prerequisite: "项目兼容的 Node.js、包管理器与微信开发者工具",
    docsUrl: "https://docs.taro.zone/docs/GETTING-STARTED",
    issues: [
      {
        symptom: "Missing script: dev:weapp",
        cause: "当前项目采用不同脚本命名或没有配置微信端。",
        fix: "打开 package.json scripts，查找 weapp 对应脚本；按项目支持的目标端运行，不直接添加未知脚本。",
      },
      {
        symptom: "开发者工具提示找不到 app.json",
        cause: "导入了源码目录而不是编译输出目录。",
        fix: "先完成微信端构建，查看 Taro 的 outputRoot 和 project.config.json，再导入包含生成 app.json 的目录。",
      },
      {
        symptom: "某组件只在 H5 有效",
        cause: "使用了不支持该小程序端的 Web/DOM 能力。",
        fix: "查 Taro 组件与 API 支持表，替换浏览器专属代码，分别验证微信端和 H5。",
      },
    ],
    relatedLocalIds: ["local-cloudbase", "local-26", "local-19"],
  },
  {
    id: "local-uniapp",
    title: "uni-app (Vue 多端应用)",
    category: "小程序前后端",
    feature:
      "pages.json、manifest.json，可能包含 src/ 和 @dcloudio 依赖；HBuilderX 项目结构有所不同。",
    description:
      "用 Vue 编写 H5、小程序或 App。先区分 CLI 工程与 HBuilderX 工程，再选择目标端运行方式。",
    address: "微信端看开发者工具；H5 看终端输出网址",
    commands: "npm install\nnpm run dev:mp-weixin",
    variants: [
      {
        name: "CLI：微信小程序",
        code: "npm install\nnpm run dev:mp-weixin",
      },
      {
        name: "CLI：H5 网页",
        code: "npm install\nnpm run dev:h5",
      },
    ],
    useCases: ["Vue 开发者的小程序", "需要 H5 与 App 的业务界面"],
    profile: "miniapp",
    prerequisite: "CLI 工程需 Node.js；HBuilderX 工程使用 HBuilderX 的运行菜单",
    docsUrl: "https://uniapp.dcloud.net.cn/quickstart-cli.html",
    guiSteps: [
      {
        title: "如果没有 package.json",
        body: "可能是 HBuilderX 工程。用 HBuilderX 导入，在「运行」菜单选择微信开发者工具或浏览器，不要强套下面的 CLI 命令。",
      },
      {
        title: "微信端预览",
        body: "CLI 构建后把实际输出目录（常见 dist/dev/mp-weixin）导入开发者工具，并配置自己的 AppID。",
      },
    ],
    issues: [
      {
        symptom: "Missing script: dev:mp-weixin",
        cause: "工程类型或脚本名称与示例不一致。",
        fix: "没有 package.json 时用 HBuilderX 的运行菜单；CLI 工程则查看 scripts 中的目标端名称。",
      },
      {
        symptom: "小程序 AppID 未配置",
        cause: "manifest.json 的微信小程序设置未填写真实 AppID。",
        fix: "在对应 mp-weixin 配置中填写自己的 AppID，并核对开发者工具登录权限。",
      },
      {
        symptom: "App 端插件不可用",
        cause: "H5、小程序与原生 App 的能力并不相同。",
        fix: "检查插件支持的端与原生打包要求，使用条件编译或替代能力，不只在浏览器中验收。",
      },
    ],
    relatedLocalIds: ["local-cloudbase", "local-26", "local-19"],
  },
  {
    id: "local-extension",
    title: "Chrome 浏览器扩展",
    category: "六、 跨平台桌面客户端与手机 App",
    feature:
      "manifest.json 包含 manifest_version: 3、permissions 和 service_worker 或 action。",
    description:
      "由浏览器加载的扩展。纯原生扩展可直接加载；有 TypeScript 等构建工具时先生成扩展目录。",
    address: "chrome://extensions → 加载已解压的扩展程序",
    commands: "",
    useCases: ["网页内容提取", "侧边栏助手", "浏览器快捷操作"],
    profile: "extension",
    prerequisite: "Chrome 或兼容浏览器；构建型项目另需 Node.js",
    docsUrl:
      "https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world",
    guiSteps: [
      {
        title: "准备可以加载的目录",
        body: "纯原生项目直接用包含 manifest.json 的目录；构建型项目先运行 scripts 中的 build，找到生成的 manifest.json 所在目录。",
      },
      {
        title: "加载并测试",
        body: "打开 chrome://extensions，启用开发者模式，点击「加载已解压的扩展程序」。更新代码后在此点击重新加载，再刷新要测试的网页。",
      },
    ],
    issues: [
      {
        symptom: "Manifest file is missing or unreadable",
        cause: "选错目录或 manifest.json 语法无效。",
        fix: "选择包含最终 manifest.json 的目录；构建项目通常是 dist，检查 JSON 格式与必填字段。",
      },
      {
        symptom: "Refused to load script / CSP",
        cause: "扩展试图加载远程脚本或使用不允许的执行方式。",
        fix: "将代码和样式本地打包，按 Manifest V3 CSP 修改，不要用放宽安全策略加载未知远程脚本。",
      },
      {
        symptom: "Cannot access contents of url",
        cause: "未获授权访问当前网页，或目标页面禁止注入。",
        fix: "检查 activeTab/host_permissions 与用户授权；Chrome 内部页面不支持普通内容脚本注入。",
      },
    ],
  },
  {
    id: "local-cloudbase",
    title: "微信云开发后端（CloudBase 云函数）",
    category: "小程序前后端",
    feature:
      "cloudfunctions/、云函数目录内 package.json，前端调用 wx.cloud.callFunction",
    description:
      "小程序页面是前端；云函数是在腾讯云里替你查数据、验证权限和处理业务的后端。两部分分别调试与发布。",
    address: "微信开发者工具的调试结果与云开发控制台的函数日志",
    commands: "",
    profile: "wechat",
    useCases: [
      "微信登录后的业务处理",
      "预约、订单与用户数据",
      "小程序图片上传与权限校验",
    ],
    prerequisite:
      "安装微信开发者工具，使用自己的 AppID，确认云开发环境和套餐。没有后端需求的小程序不用强行开通。",
    docsUrl:
      "https://docs.cloudbase.net/quick-start/frameworks/wechat-miniprogram",
    relatedLocalIds: ["local-wechat", "local-taro", "local-uniapp"],
    guiSteps: [
      {
        title: "先确认前后端分别在哪",
        body: "前端页面一般在 miniprogram/；后端常在 cloudfunctions/，以 project.config.json 的真实目录设置为准。让 AI 说明每个函数负责什么。",
      },
      {
        title: "选择自己的开发环境",
        body: "在云开发控制台选择环境，确认前端 wx.cloud.init 使用的是这个环境 ID。不要误连正式用户数据库。",
      },
      {
        title: "只准备要调试的函数",
        body: "检查该函数目录的 package.json。使用工具支持的本地调试，或上传到自己的开发环境测试；上传会修改云端函数，先核对目标与费用。",
      },
      {
        title: "从小程序触发真实操作",
        body: "在开发者工具点一次预约、保存或上传，查看 callFunction 结果和函数日志，再确认数据写进正确环境。最终还要真机预览。",
      },
    ],
    issues: [
      {
        symptom: "Function not found / 找不到云函数",
        cause: "调用名、上传环境或函数目录不一致。",
        fix: "比对 callFunction 的 name、控制台函数名称和环境 ID；先部署目标函数到开发环境，再调用。",
      },
      {
        symptom: "云函数能调用，但查不到数据",
        cause: "前端与函数连接不同环境，或集合名称、安全规则不匹配。",
        fix: "检查环境 ID、集合名和当前用户身份；在开发环境用测试记录验证，不能直接放开全部数据权限。",
      },
      {
        symptom: "保存成功，但另一个用户也看到了我的记录",
        cause: "只在页面隐藏数据，没有在后端校验记录归属。",
        fix: "让 AI 在函数内按已验证的用户身份过滤并检查写入权限，用两个测试账号分别读写验证。",
      },
    ],
  },
];
