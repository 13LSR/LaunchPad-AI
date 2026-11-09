import { test, expect } from "@playwright/test";

test("recovery commands adapt to the terminal, tool and port and copy one usable command", async ({
  page,
}) => {
  await page.goto("/guide/local#local-help");
  const recovery = page.locator(".local-recovery");
  await expect(recovery).toBeVisible();
  await expect(recovery.locator("pre").first()).toHaveText("node --version");
  await expect(recovery.locator("pre").nth(2)).toHaveText("where.exe node");
  const versionCopy = recovery
    .locator(".code-block")
    .first()
    .getByRole("button");
  await versionCopy.click();
  await expect(versionCopy).toHaveAttribute("aria-label", "已复制");
  await recovery.getByLabel("报错里提到的工具").selectOption("python");
  await expect(versionCopy).toHaveAttribute("aria-label", "复制内容");
  await expect(recovery.locator("pre").first()).toHaveText("python --version");
  await expect(recovery).toContainText("py --version");
  await recovery.getByLabel("你用的电脑终端").selectOption("unix");
  await expect(recovery.locator("pre").first()).toHaveText("python3 --version");
  await expect(recovery.locator("pre").nth(1)).toHaveText("command -v python3");
  await recovery.getByLabel("报错中的端口号").fill("5173");
  await expect(recovery.locator("pre").nth(2)).toHaveText(
    "lsof -nP -iTCP:5173 -sTCP:LISTEN",
  );
  await recovery.locator(".local-kill-process > summary").click();
  const processInput = recovery.getByLabel("查到的进程编号（PID）");
  await expect(recovery.locator(".local-kill-process pre")).toHaveCount(0);
  await processInput.fill("1");
  await expect(processInput).toHaveAttribute("aria-invalid", "true");
  await expect(recovery.locator(".local-kill-process pre")).toHaveCount(0);
  await processInput.fill("12345");
  await expect(recovery.locator(".local-kill-process pre").nth(1)).toHaveText(
    "kill -TERM 12345",
  );
  await recovery
    .locator(".local-kill-process .code-block")
    .nth(1)
    .getByRole("button", { name: "复制内容" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "kill -TERM 12345",
  );
  await recovery
    .getByRole("button", { name: "复制内容", exact: true })
    .nth(2)
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "lsof -nP -iTCP:5173 -sTCP:LISTEN",
  );
  await recovery.locator(".local-alternative-port > summary").click();
  await expect(recovery.locator("pre").last()).toHaveText(
    "npm run dev -- --port 5174",
  );
  await recovery.getByLabel("确认你的项目类型").selectOption("static");
  await expect(recovery.locator("pre").last()).toHaveText(
    "python3 -m http.server 5174 --bind 127.0.0.1",
  );
  await recovery.getByLabel("报错中的端口号").fill("65536");
  await expect(recovery.getByRole("alert")).toContainText("1–65535");
  await expect(recovery.locator("pre")).toHaveCount(2);
  await recovery.getByLabel("报错中的端口号").fill("3000");
  await recovery.getByLabel("你用的电脑终端").selectOption("windows");
  await expect(processInput).toHaveValue("");
  await expect(
    recovery.locator("article").nth(1).locator("pre").first(),
  ).toHaveText(
    "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess",
  );
  await recovery.locator(".local-kill-process > summary").click();
  await processInput.fill("54321");
  await expect(recovery.locator(".local-kill-process pre").last()).toHaveText(
    "Stop-Process -Id 54321",
  );
  await recovery.getByLabel("报错中的端口号").fill("3001");
  await expect(processInput).toHaveValue("");
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("file clues select the right card and manager without guessing ambiguous projects", async ({
  page,
}) => {
  await page.goto("/guide/local");
  const finder = page.locator(".local-file-finder");
  await expect(finder).not.toHaveAttribute("open", "");
  await finder.locator("summary").click();
  await page.getByLabel("我在项目里看到了").fill("package.json");
  await expect(finder).toContainText("还不能确定框架");
  await expect(
    page.getByRole("button", { name: "查看这张运行卡片" }),
  ).toBeDisabled();
  await page
    .getByLabel("我在项目里看到了")
    .fill("next.config.ts、pnpm-lock.yaml");
  await page.getByRole("button", { name: "查看这张运行卡片" }).click();
  await expect(page.locator(".command-card")).toHaveAttribute("id", "local-6");
  await expect(page.locator(".command-step-item pre")).toHaveText([
    "pnpm install",
    "pnpm dev",
  ]);
  await page.getByRole("tab", { name: "以后再启动", exact: true }).click();
  await expect(page.locator(".command-step-item pre")).toHaveText(["pnpm dev"]);
  await page
    .locator(".command-step-item")
    .getByRole("button", { name: "复制内容", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "pnpm dev",
  );
  await page
    .getByLabel("我在项目里看到了")
    .fill("next.config.ts package-lock.json yarn.lock");
  await expect(finder).toContainText("发现多种锁文件");
  await page.getByRole("button", { name: "查看这张运行卡片" }).click();
  await expect(
    page.getByRole("tab", { name: "pnpm", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("tab", { name: "第一次运行", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await finder.getByRole("button", { name: "复制项目识别任务给 AI" }).click();
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).toContain("package-lock.json yarn.lock");
  expect(prompt).toContain("RUN_LOCAL.md");
});

test("Python repeat runs retain activation and uv or Poetry use one environment", async ({
  page,
}) => {
  await page.goto("/guide/local#local-22");
  const card = page.locator("#local-22");
  await expect(card).toBeVisible();
  await expect(card.getByRole("tablist", { name: "包管理器" })).toHaveCount(0);
  await card.getByRole("tab", { name: "以后再启动", exact: true }).click();
  await expect(card.locator(".command-step-item pre")).toHaveText([
    ".\\.venv\\Scripts\\Activate.ps1",
    "python -m streamlit run app.py",
  ]);
  await page.getByRole("tab", { name: "macOS / Linux", exact: true }).click();
  await expect(card.locator(".command-step-item pre").first()).toHaveText(
    "source .venv/bin/activate",
  );
  await page.getByLabel("Python 项目使用哪种依赖文件？").selectOption("uv");
  await expect(card.locator(".command-step-item pre")).toHaveText([
    "uv run python -m streamlit run app.py",
  ]);
  await page.getByRole("tab", { name: "第一次运行", exact: true }).click();
  await expect(card.locator(".command-step-item pre")).toHaveText([
    "uv sync",
    "uv run python -m streamlit run app.py",
  ]);
  await page.getByLabel("Python 项目使用哪种依赖文件？").selectOption("poetry");
  await expect(card.locator(".command-step-item pre")).toHaveText([
    "poetry install",
    "poetry run python -m streamlit run app.py",
  ]);
  await expect(
    card.getByRole("link", { name: "查看 Poetry 官方安装方法" }),
  ).toHaveAttribute("href", "https://python-poetry.org/docs/#installation");
  await card
    .getByRole("button", { name: "不确定？复制实际运行方式检查任务" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "电脑终端：macOS / Linux",
  );
});

test("troubleshooting copies the actual command, error and current context without crossing cards", async ({
  page,
}) => {
  await page.goto("/guide/local#local-22");
  const card = page.locator("#local-22");
  await page.getByLabel("Python 项目使用哪种依赖文件？").selectOption("uv");
  await page.getByRole("tab", { name: "以后再启动", exact: true }).click();
  await card.getByRole("button", { name: /常见问题与处理/ }).click();
  await card.getByLabel("你遇到了哪种情况？").selectOption({ index: 1 });
  await expect(card.locator(".stack-issues article")).toHaveCount(1);
  await card.locator(".local-error-input summary").click();
  await card
    .getByLabel("实际执行的命令", { exact: true })
    .fill("uv run python -m streamlit run report.py");
  await card
    .getByLabel("报错内容", { exact: true })
    .fill("ModuleNotFoundError: pandas");
  await card.getByRole("button", { name: "复制针对本项目的排错说明" }).click();
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).toContain("report.py");
  expect(prompt).toContain("ModuleNotFoundError: pandas");
  expect(prompt).toContain("Windows（PowerShell）");
  expect(prompt).toContain("Python 依赖方式：uv");
  expect(prompt).toContain("已经准备过，这次重新启动");
  await page.getByLabel("直接选择技术栈").selectOption("local-19");
  const fastapi = page.locator("#local-19");
  await fastapi.getByRole("button", { name: /常见问题与处理/ }).click();
  await fastapi.locator(".local-error-input summary").click();
  await expect(fastapi.getByLabel("报错内容", { exact: true })).toHaveValue("");
  await expect(
    fastapi.getByLabel("实际执行的命令", { exact: true }),
  ).toHaveValue("");
  await fastapi
    .getByRole("button", { name: "复制针对本项目的排错说明" })
    .click();
  const fresh = await page.evaluate(() => navigator.clipboard.readText());
  expect(fresh).not.toContain("report.py");
  expect(fresh).toContain("第一次准备并运行");
});

test("search deep links reset filters and repeat stage while GUI cards use tool instructions", async ({
  page,
}) => {
  await page.goto("/guide/local#local-22");
  await page.getByRole("textbox", { name: "搜索技术栈" }).fill("Streamlit");
  await page.getByRole("tab", { name: "以后再启动", exact: true }).click();
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Next.js");
  await page
    .getByRole("option")
    .filter({ hasText: "本地运行" })
    .first()
    .click();
  await expect(page.locator(".command-card")).toHaveAttribute("id", "local-6");
  await expect(page.getByRole("textbox", { name: "搜索技术栈" })).toHaveValue(
    "",
  );
  await expect(
    page.getByRole("tab", { name: "第一次运行", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByLabel("直接选择技术栈").selectOption("local-wechat");
  const card = page.locator("#local-wechat");
  await expect(card.locator("pre")).toHaveCount(0);
  await expect(card.getByRole("tablist", { name: "包管理器" })).toHaveCount(0);
  await expect(card).toContainText("微信开发者工具");
  await card
    .getByRole("link", { name: "跑通了？先确认数据保存，再安排上线" })
    .click();
  await expect(page.locator("#local-data-next h2")).toBeInViewport();
});

test("local controls work by keyboard and expanded content stays within mobile width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guide/local");
  const finder = page.locator(".local-file-finder");
  await finder.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(finder).toHaveAttribute("open", "");
  await page.getByLabel("我在项目里看到了").fill("manage.py, requirements.txt");
  await page.getByRole("button", { name: "查看这张运行卡片" }).click();
  await expect(page.locator(".command-card")).toHaveAttribute("id", "local-21");
  const first = page.getByRole("tab", { name: "第一次运行", exact: true });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "以后再启动", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page
    .locator(".command-card")
    .getByRole("button", { name: /常见问题与处理/ })
    .click();
  await page.locator(".local-error-input summary").click();
  await page.getByLabel("报错内容", { exact: true }).fill("x".repeat(1000));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "下一张卡片", exact: true }).click();
  await expect(page.locator(".deck-controls").first()).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
