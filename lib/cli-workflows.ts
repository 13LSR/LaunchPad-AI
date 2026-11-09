export type CliWorkflow = {
  id: string;
  name: string;
  intro: string;
  url: string;
  steps: { title: string; note?: string; code: string }[];
};
export const cliWorkflows: CliWorkflow[] = [
  {
    id: "cli-vercel",
    name: "Vercel",
    intro:
      "适合 Next.js 等网站。需要项目支持的 Node.js 与包管理器。先关联云项目、配好预览环境变量，再发布预览；预览通过后才更新正式网站。Hobby 限个人非商业用途。",
    url: "https://vercel.com/docs/cli",
    steps: [
      {
        title: "登录并检查构建",
        note: "在项目根目录运行；build 必须是项目实际存在的脚本。",
        code: "npx vercel login\nnpm run build",
      },
      {
        title: "关联云项目，准备预览环境",
        note: "link 会询问账号、项目，首次可能创建项目记录。API_KEY 替换为项目实际需要的变量名；没有这个变量就跳过。预览应使用测试数据服务，值在终端交互输入。",
        code: "npx vercel link\nnpx vercel env add API_KEY --environment preview",
      },
      {
        title: "创建预览部署",
        note: "先配好预览所需变量；部署后打开生成的地址，实际测试按钮、登录和数据保存。",
        code: "npx vercel",
      },
      {
        title: "添加生产环境变量",
        note: "正式环境的值可能与预览不同。API_KEY 换成实际变量名，交互输入私密值。变量更新后需重新部署才会用于新版本。",
        code: "npx vercel env add API_KEY --environment production",
      },
      {
        title: "下载开发环境变量到指定文件",
        note: "确认没有同名文件和本地配置覆盖风险；下载的文件不应提交到 Git。",
        code: "npx vercel env pull .env.vercel.local",
      },
      {
        title: "确认预览正常后，发布生产",
        note: "这一步会更新正式网站。",
        code: "npx vercel --prod",
      },
    ],
  },
  {
    id: "cli-cloudflare",
    name: "Cloudflare",
    intro:
      "Workers 使用 Wrangler 管理。Next.js 需先按官方流程配置 OpenNext。Workers 与 Pages 是不同发布方式；D1、KV、R2 只在项目确实使用时才需要，不是每次上线都要新建。",
    url: "https://developers.cloudflare.com/workers/wrangler/commands/",
    steps: [
      {
        title: "登录并确认当前账号",
        code: "npx wrangler login\nnpx wrangler whoami",
      },
      {
        title: "在本地模拟 Workers",
        code: "npx wrangler dev",
      },
      {
        title: "确认配置与资源后，部署 Workers",
        code: "npx wrangler deploy",
      },
      {
        title: "如果项目是 Pages 静态站",
        note: "只用于已经构建的静态站；dist 换成真实输出目录。确认 Pages 项目与分支，这可能更新正式站点。它不能发布未适配的 Next.js 服务端。",
        code: "npx wrangler pages deploy dist",
      },
      {
        title: "创建 D1 数据库",
        note: "会创建云端资源。随后把返回的数据库 ID 与 binding 名 DB 加入 Wrangler 配置，应用通过绑定访问。",
        code: "npx wrangler d1 create my-app-db",
      },
      {
        title: "先在本地验证已有 SQL",
        note: "DB 是配置中的绑定名，schema.sql 是已审核的 SQL 文件；SQL 可能更改本地表结构。",
        code: "npx wrangler d1 execute DB --local --file=./schema.sql",
      },
      {
        title: "备份并确认后，执行远程 SQL",
        note: "这一步会修改云端数据库。检查 SQL、账号和目标数据库，不能用来盲目修复报错。",
        code: "npx wrangler d1 execute DB --remote --file=./schema.sql",
      },
      {
        title: "创建 KV 命名空间",
        note: "用于键值存储；把返回 ID 配置到 Wrangler 的 KV 绑定中。",
        code: "npx wrangler kv namespace create CACHE",
      },
      {
        title: "创建 R2 存储桶",
        note: "需要开通 R2 并确认计费条件；之后配置绑定与访问权限。",
        code: "npx wrangler r2 bucket create my-app-assets",
      },
      {
        title: "添加私密变量",
        note: "交互输入密钥；不要把值写进命令历史或 Git。",
        code: "npx wrangler secret put API_KEY",
      },
      {
        title: "查看实时日志",
        code: "npx wrangler tail",
      },
    ],
  },
  {
    id: "cli-github",
    name: "GitHub",
    intro:
      "这里负责把代码保存到 GitHub，不会直接开通网站。先安装 Git 与 GitHub CLI（gh）。GitHub Pages 还要配置发布来源或 Actions；免费账号的 Pages 通常需要公开仓库，不要把保存到私有仓库误当成已上线。",
    url: "https://cli.github.com/manual/",
    steps: [
      {
        title: "浏览器授权与状态检查",
        code: "gh auth login\ngh auth status\ngit status",
      },
      {
        title: "只有还不是 Git 仓库时才初始化",
        note: "先配置 .gitignore，排除 .env、node_modules 和构建产物。",
        code: "git init",
      },
      {
        title: "审核改动",
        code: "git status\ngit diff",
      },
      {
        title: "只提交你确认过的文件",
        note: "把 src/ 替换为实际审核过的文件或目录；先用 git diff --cached 看将要提交的内容。",
        code: 'git add src/\ngit diff --cached\ngit commit -m "Prepare deployment"',
      },
      {
        title: "首次创建私有仓库并推送",
        note: "会创建远程仓库；按提示确认名称与归属。已有 origin 时使用后面的推送步骤。",
        code: "gh repo create --source=. --private --push",
      },
      {
        title: "以后更新已经关联的仓库",
        note: "先检查远程与分支，审核提交后再执行推送。",
        code: "git remote -v\ngit branch --show-current\ngit push",
      },
    ],
  },
  {
    id: "cli-prisma",
    name: "Prisma",
    intro:
      "以下是 Prisma ORM 7 的命令，用于项目已经安装该版本的情况。先让 AI 查看 package.json 与锁文件；Prisma ORM 8 改用数据契约和 db migrate，不要混用，也不要为复制命令而升级。DATABASE_URL 必须指向明确环境；生成客户端不会建表。",
    url: "https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production",
    steps: [
      {
        title: "生成应用需要的数据库客户端",
        code: "npx prisma generate",
      },
      {
        title: "查看迁移状态",
        code: "npx prisma migrate status",
      },
      {
        title: "备份后，执行已有迁移",
        note: "先在开发库验证。生产库执行前审核迁移内容并确认目标。",
        code: "npx prisma migrate deploy",
      },
      {
        title: "打开数据查看界面",
        note: "Studio 也有修改数据能力，操作前确认连接的是哪个数据库。",
        code: "npx prisma studio",
      },
    ],
  },
  {
    id: "cli-drizzle",
    name: "Drizzle",
    intro:
      "用于已配置 drizzle.config 与 schema 的项目。先生成可审核的迁移，再执行；不要无条件 push 到生产库。",
    url: "https://orm.drizzle.team/docs/drizzle-kit-migrate",
    steps: [
      {
        title: "生成迁移文件",
        code: "npx drizzle-kit generate",
      },
      {
        title: "审核并备份后，执行迁移",
        note: "先确认配置中的目标数据库，在开发环境测试。",
        code: "npx drizzle-kit migrate",
      },
      {
        title: "打开数据管理界面",
        code: "npx drizzle-kit studio",
      },
    ],
  },
  {
    id: "cli-supabase",
    name: "Supabase",
    intro:
      "需要 Supabase CLI 支持的 Node.js 版本。关联云项目后，数据库迁移与 Edge Functions 部署是两件独立的事。",
    url: "https://supabase.com/docs/reference/cli/introduction",
    steps: [
      {
        title: "登录",
        code: "npx supabase login",
      },
      {
        title: "关联已有项目",
        note: "YOUR_PROJECT_REF 换成控制台里的项目引用 ID。",
        code: "npx supabase link --project-ref YOUR_PROJECT_REF",
      },
      {
        title: "查看本地与远程迁移",
        code: "npx supabase migration list",
      },
      {
        title: "备份并确认后推送迁移",
        note: "修改远程数据库；不会部署网页或 Edge Functions。",
        code: "npx supabase db push",
      },
      {
        title: "单独部署指定 Edge Function",
        note: "FUNCTION_NAME 换成项目中已有函数名，先检查认证与环境变量。",
        code: "npx supabase functions deploy FUNCTION_NAME",
      },
    ],
  },
  {
    id: "cli-railway",
    name: "Railway",
    intro:
      "适合后端与容器项目。先安装 Railway CLI；创建服务、数据库或部署都可能产生费用，先核对套餐与资源。",
    url: "https://docs.railway.com/guides/cli",
    steps: [
      {
        title: "安装并登录",
        code: "npm install -g @railway/cli\nrailway login",
      },
      {
        title: "关联已有项目并检查目标",
        note: "更新项目时优先使用这一组，核对项目、环境和服务，避免发到另一个项目。",
        code: "railway link\nrailway status",
      },
      {
        title: "首次创建项目",
        note: "已有项目应按官方说明使用 railway link 关联，无需重复创建。",
        code: "railway init",
      },
      {
        title: "上传当前项目并部署",
        note: "先确认启动命令、端口、环境变量与磁盘持久化。",
        code: "railway up",
      },
      {
        title: "按需添加数据库",
        note: "交互选择数据库服务，会创建资源并可能计费。",
        code: "railway add",
      },
    ],
  },
  {
    id: "cli-fly",
    name: "Fly.io",
    intro:
      "先按官方说明安装 flyctl（命令名 fly）。适合有 Dockerfile 的应用，确认机器、区域和存储费用。",
    url: "https://fly.io/docs/flyctl/",
    steps: [
      {
        title: "登录",
        code: "fly auth login",
      },
      {
        title: "生成部署配置，暂不部署",
        note: "向导可能创建应用记录，请检查应用名与费用选项。",
        code: "fly launch --no-deploy",
      },
      {
        title: "确认配置后部署",
        code: "fly deploy",
      },
      {
        title: "查看应用日志",
        code: "fly logs",
      },
    ],
  },
  {
    id: "cli-huggingface",
    name: "Hugging Face",
    intro:
      "适合 Gradio 或 Docker 模型演示（Streamlit 需使用 Docker 方案）。普通 Gradio / Docker 创建需要付费计划；免费 ZeroGPU 例外有账号资格限制。先确认自己的 Space 与套餐，并配置 SDK 元数据。",
    url: "https://huggingface.co/docs/huggingface_hub/guides/cli",
    steps: [
      {
        title: "安装当前 Hugging Face CLI",
        code: "python -m pip install --upgrade huggingface_hub",
      },
      {
        title: "登录",
        code: "hf auth login",
      },
      {
        title: "上传 Space 文件",
        note: "YOUR_USERNAME/YOUR_SPACE 换成自己的 Space。检查当前目录，排除 .env、密钥、私有数据与不必要的大文件。",
        code: 'hf upload YOUR_USERNAME/YOUR_SPACE . . --repo-type space --exclude ".env*" ".git/*" ".venv/*" "node_modules/*"',
      },
      {
        title: "只检查当前登录身份",
        note: "whoami 只返回账号信息。要验收作品，请在 Space 页面查看构建与运行日志，等待可用后实际提交一次输入；上传完成不代表应用可用。",
        code: "hf auth whoami",
      },
    ],
  },
];
