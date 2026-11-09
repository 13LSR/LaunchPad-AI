export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export function adaptCommands(
  code: string,
  manager: PackageManager,
  os: string,
) {
  let result = code
    .replace(/\\#/g, "#")
    .replace(/go env -w GOPROXY=.*\n?/g, "")
    .replace(/# 设置国内代理加速下载依赖（仅需执行一次）\n?/g, "");
  // A read-only local guide never silently runs database schema changes.
  result = result.replace(/^.*(?:prisma db push|drizzle-kit push).*\n?/gm, "");
  if (manager !== "npm")
    result = result
      .replace(/\bnpm install\b/g, manager + " install")
      .replace(
        /\bnpm run /g,
        manager === "pnpm"
          ? "pnpm "
          : manager === "yarn"
            ? "yarn "
            : "bun run ",
      )
      .replace(/\bnpm start\b/g, manager + " start");
  if (os === "Windows")
    result = result
      .replace(/\.\/mvnw /g, ".\\mvnw.cmd ")
      .replace(/\.\/gradlew /g, ".\\gradlew.bat ")
      .replace(/^cp \.env\.example \.env$/gm, "Copy-Item .env.example .env");
  return result.trim();
}
export const quickCommands: Record<
  string,
  { install: string; run: string; feature: string; address: string }
> = {
  "Next.js": {
    install: "npm install",
    run: "npm run dev",
    feature: "next.config.* + package.json",
    address: "http://localhost:3000",
  },
  "Vite / React": {
    install: "npm install",
    run: "npm run dev",
    feature: "vite.config.* + package.json",
    address: "http://localhost:5173",
  },
  Python: {
    install: "python -m pip install -r requirements.txt",
    run: "python -m uvicorn main:app --reload",
    feature: "main.py 内包含 FastAPI；先激活虚拟环境",
    address: "http://localhost:8000",
  },
  Docker: {
    install: "docker compose build",
    run: "docker compose up -d",
    feature: "compose.yaml / docker-compose.yml；先启动 Docker",
    address: "以 compose 文件的 ports 为准",
  },
};
