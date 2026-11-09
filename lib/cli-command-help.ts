export type CliCommandHelp = { purpose: string; success: string };

// Keys are the exact copyable lines in cli-workflows.ts; missing entries fail tests.
const help: Record<string, [string, string]> = {
  "npx vercel login": [
    "授权这台电脑使用你的 Vercel 账号。",
    "浏览器完成登录，终端提示认证成功；这一步还没有发布网站。",
  ],
  "npm run build": [
    "执行 package.json 中真实存在的 build 脚本，检查项目能否构建。使用其他包管理器的项目沿用原工具。",
    "构建结束且没有错误；本地构建通过后还要验证云端配置。",
  ],
  "npx vercel link": [
    "把当前文件夹关联到 Vercel 的云项目。",
    "确认了正确团队和项目，目录中生成 .vercel 关联配置。",
  ],
  "npx vercel env add API_KEY --environment preview": [
    "给预览版本配置一个实际需要的变量；API_KEY 是占位名。",
    "终端提示变量已添加到 Preview；新预览部署才能使用。",
  ],
  "npx vercel": [
    "上传当前项目并创建预览版本，供你先试用。",
    "构建成功并返回预览网址；打开它验证关键功能。",
  ],
  "npx vercel env add API_KEY --environment production": [
    "给正式网站配置一个实际需要的变量，值在终端提示后输入。",
    "变量已添加到 Production；重新发布后验证相关功能。",
  ],
  "npx vercel env pull .env.vercel.local": [
    "把 Development 环境变量下载到指定本地文件。先检查该文件与 Git 忽略规则。",
    "文件已写入。它不一定被框架自动读取，让 AI 按项目加载；不要公开文件内容。",
  ],
  "npx vercel --prod": [
    "把当前代码发布到正式环境，会影响正式网址的用户。",
    "正式部署完成；用正式地址重新测试关键功能与数据。",
  ],
  "npx wrangler login": [
    "通过浏览器授权 Wrangler 访问 Cloudflare。",
    "浏览器授权完成，终端提示已登录。",
  ],
  "npx wrangler whoami": [
    "查看现在使用的 Cloudflare 账号和权限。",
    "显示的是你打算使用的账号；不代表任何服务已发布。",
  ],
  "npx wrangler dev": [
    "在本机启动 Workers 开发服务，模拟运行项目。",
    "显示本地网址，访问后功能正常；按 Ctrl+C 停止。",
  ],
  "npx wrangler deploy": [
    "按 Wrangler 配置上传并发布 Worker。",
    "返回部署版本与访问入口；请求接口或网页后检查实际结果。",
  ],
  "npx wrangler pages deploy dist": [
    "上传已构建的静态文件；把 dist 换成实际输出目录。",
    "返回 Pages 部署地址；打开子页面和图片确认资源路径正常。",
  ],
  "npx wrangler d1 create my-app-db": [
    "新建名为 my-app-db 的云端 D1 数据库；已有数据库就不需要新建。",
    "返回数据库 ID；还需把它配置为项目绑定后才能使用。",
  ],
  "npx wrangler d1 execute DB --local --file=./schema.sql": [
    "在本地 D1 执行已审核 SQL；DB 是绑定名，文件须真实存在。",
    "SQL 执行成功，检查本地表与测试数据；不会自动同步到云端。",
  ],
  "npx wrangler d1 execute DB --remote --file=./schema.sql": [
    "把已验证 SQL 应用于远程 D1，会修改线上数据或表结构。",
    "远程执行成功，复验线上读写；不是单纯的连接检查。",
  ],
  "npx wrangler kv namespace create CACHE": [
    "新建 KV 键值存储空间，用于项目实际需要的缓存或配置。",
    "返回命名空间 ID；将它加入项目绑定后再验证读写。",
  ],
  "npx wrangler r2 bucket create my-app-assets": [
    "新建 R2 文件桶，需要先开通 R2 并确认计费。",
    "控制台能看到存储桶；访问权限与上传功能仍需配置和测试。",
  ],
  "npx wrangler secret put API_KEY": [
    "交互输入 Worker 的私密变量；会创建新版本并可能立即部署。",
    "终端确认变量已上传，核对目标环境并测试相关接口。",
  ],
  "npx wrangler tail": [
    "持续查看当前 Worker 的实时日志。",
    "触发一次请求后能看到对应记录；Ctrl+C 只停止看日志。",
  ],
  "gh auth login": [
    "通过引导登录 GitHub CLI，选择自己的账号与授权方式。",
    "提示认证成功；不要把验证码或令牌发给别人。",
  ],
  "gh auth status": [
    "确认 GitHub CLI 当前登录的账号。",
    "显示正确账号已登录；不表示仓库或网站已创建。",
  ],
  "git status": [
    "查看哪些文件新增或修改，以及是否已加入待提交区。",
    "能看到当前分支和改动清单；没有改动时显示工作区干净。",
  ],
  "git init": [
    "仅在当前文件夹还不是 Git 仓库时，创建本地版本记录目录。",
    "出现仓库初始化提示；还没有向网络上传文件。",
  ],
  "git diff": [
    "查看已跟踪文件中还没加入待提交区的差异；新文件需要单独打开审阅。",
    "显示具体修改或空输出；确认其中没有密钥与私人数据。",
  ],
  "git add src/": [
    "把已审核的文件加入待提交区；src/ 要换成实际文件路径。",
    "git status 能看到将要提交的文件；此时尚未上传。",
  ],
  "git diff --cached": [
    "再检查一次这次提交将包含的改动。",
    "显示的全部内容都是你希望保存的修改。",
  ],
  'git commit -m "Prepare deployment"': [
    "把待提交区保存成一个本地版本。",
    "返回提交编号；没有自动发布到 GitHub 或云平台。",
  ],
  "gh repo create --source=. --private --push": [
    "新建私有 GitHub 仓库并推送当前本地记录；已有 origin 时跳过。",
    "返回仓库地址，能查看刚推送的提交；网站还需另外部署。",
  ],
  "git remote -v": [
    "查看本地项目关联的远程仓库地址。",
    "origin 指向预期仓库；分享输出前检查地址是否带凭据。",
  ],
  "git branch --show-current": [
    "查看当前分支，避免推送到错误发布分支。",
    "输出预期分支名；若为空，让 AI 检查当前 Git 状态。",
  ],
  "git push": [
    "把本地提交推送到已关联的远程分支；若平台已连接 Git，可能触发自动部署。",
    "推送成功；仍需查看云平台构建结果并体验线上功能。",
  ],
  "npx prisma generate": [
    "为 Prisma ORM 7 项目按现有 schema 生成数据库客户端代码。",
    "提示生成完成；这一步不会给数据库新建表。",
  ],
  "npx prisma migrate status": [
    "比较 Prisma ORM 7 的本地迁移记录与目标数据库状态。",
    "明确看到是否有待执行、失败或不一致的迁移。",
  ],
  "npx prisma migrate deploy": [
    "在 Prisma ORM 7 项目中执行已有的待应用迁移，会修改目标数据库。",
    "迁移应用成功；随后验证数据读写和已有记录。",
  ],
  "npx prisma studio": [
    "打开 Prisma ORM 7 的数据浏览与编辑界面。",
    "浏览器能打开 Studio；编辑数据前确认连接环境。",
  ],
  "npx drizzle-kit generate": [
    "按已配置的数据结构生成 SQL 迁移文件，供审核。",
    "迁移目录产生文件，或提示没有结构变更；尚未修改远程数据库。",
  ],
  "npx drizzle-kit migrate": [
    "执行已经生成并审核的 Drizzle SQL 迁移。",
    "应用完成且迁移记录更新；复验应用读写，不能只看终端退出。",
  ],
  "npx drizzle-kit studio": [
    "按项目配置打开数据库查看与编辑界面。",
    "界面可连接目标数据库；编辑会影响真实数据。",
  ],
  "npx supabase login": [
    "登录 Supabase CLI，以管理自己的云项目。",
    "终端确认登录；尚未关联具体项目。",
  ],
  "npx supabase link --project-ref YOUR_PROJECT_REF": [
    "将本地项目与控制台中的现有 Supabase 项目关联，替换引用 ID。",
    "提示关联完成，核对是测试项目还是正式项目。",
  ],
  "npx supabase migration list": [
    "查看本地与关联云项目的迁移记录。",
    "列出两边的迁移版本，能发现尚未同步的部分。",
  ],
  "npx supabase db push": [
    "将本地待应用迁移推送到关联数据库，会修改云端结构。",
    "迁移成功后验证读写与权限；不会发布网页。",
  ],
  "npx supabase functions deploy FUNCTION_NAME": [
    "部署项目中指定的 Edge Function；替换实际函数名。",
    "函数部署完成，再用符合权限的请求测试返回结果。",
  ],
  "npm install -g @railway/cli": [
    "在这台电脑安装 Railway 命令行工具，需要 Node.js。",
    "安装成功，railway 命令可用；还没有创建云服务。",
  ],
  "railway login": [
    "通过浏览器登录 Railway。",
    "账号认证完成；接下来仍需核对目标项目。",
  ],
  "railway link": [
    "把当前目录关联到已经存在的 Railway 项目与环境。",
    "选择了正确项目、环境和服务，之后用 status 核对。",
  ],
  "railway status": [
    "查看当前目录关联的项目、环境与服务。",
    "输出与你要更新的目标一致。",
  ],
  "railway init": [
    "首次使用时创建 Railway 项目；已有项目选 link。",
    "项目已创建并关联；资源运行还涉及套餐与费用。",
  ],
  "railway up": [
    "上传当前目录并触发部署，目标取决于已关联项目与环境。",
    "构建和启动通过，再从控制台取得访问方式并测试功能。",
  ],
  "railway add": [
    "按引导添加所需服务；选择数据库会创建可能计费的资源。",
    "服务出现在正确项目中；仍需配置应用连接和数据权限。",
  ],
  "fly auth login": ["通过浏览器登录 Fly.io。", "认证成功，使用的是预期账号。"],
  "fly launch --no-deploy": [
    "生成应用部署配置，暂不部署；向导可能创建应用记录。",
    "生成 fly.toml；核对区域、机器和存储，不把配置生成当作上线。",
  ],
  "fly deploy": [
    "按 fly.toml 构建并发布应用，机器与存储可能开始计费。",
    "部署与健康检查通过，用应用地址验证真实功能。",
  ],
  "fly logs": [
    "查看应用运行日志，定位启动或请求错误。",
    "能看到与复现操作对应的日志；Ctrl+C 停止查看。",
  ],
  "python -m pip install --upgrade huggingface_hub": [
    "给当前 Python 环境安装或更新 Hugging Face 工具；先确认项目允许的版本。",
    "安装完成，当前环境能使用 hf 命令。",
  ],
  "hf auth login": [
    "在交互引导中登录 Hugging Face，使用需要的账号权限。",
    "认证完成；凭据只在官方授权页面或终端提示中输入。",
  ],
  'hf upload YOUR_USERNAME/YOUR_SPACE . . --repo-type space --exclude ".env*" ".git/*" ".venv/*" "node_modules/*"':
    [
      "把当前目录上传到你已有的 Space，替换账号与 Space 名。排除规则不代表目录里一定没有私密文件，先逐项审核。",
      "返回上传记录；等待 Space 构建与启动后，再实际提交一次演示输入。",
    ],
  "hf auth whoami": [
    "只查看目前登录的 Hugging Face 用户。",
    "显示正确用户名；这个结果不能证明 Space 已运行。",
  ],
};

export function explainCliCommand(command: string): CliCommandHelp | undefined {
  const item = help[command];
  return item ? { purpose: item[0], success: item[1] } : undefined;
}
