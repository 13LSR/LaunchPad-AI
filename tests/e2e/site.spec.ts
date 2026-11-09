import { test, expect } from "@playwright/test";
const slugs = [
  "prompts",
  "projects",
  "skills",
  "local",
  "databases",
  "cli",
  "cloud",
  "media",
];

test("project catalog filters, paginates and recovers from empty results", async ({
  page,
}) => {
  await page.goto("/guide/projects");
  await expect(page.locator(".project-card")).toHaveCount(6);
  await expect(page.locator(".project-results-header")).toContainText(
    "31 个项目",
  );
  await expect(page.locator("#projects-route")).not.toHaveAttribute("open", "");
  await page
    .getByRole("navigation", { name: "项目分页" })
    .getByRole("button", { name: "下一页" })
    .click();
  await expect(page.locator(".project-pagination")).toContainText(
    "第 2 / 6 页",
  );
  await expect(page.locator(".project-results-header h3")).toBeInViewport();
  await page.getByRole("searchbox", { name: "搜索开源项目" }).fill("食谱");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card h3")).toHaveText("Mealie");
  await page.getByRole("combobox", { name: "上手难度" }).selectOption("easy");
  await expect(
    page.getByText("还没有找到这样的项目", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "查看全部项目", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(6);
  await page
    .getByRole("group", { name: "按用途筛选" })
    .getByRole("button", { name: "收藏与阅读" })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await expect(page.locator(".project-card h3")).toHaveText([
    "linkding",
    "FreshRSS",
  ]);
});

test("project search links reveal off-page cards and custom goals copy correctly", async ({
  page,
}) => {
  await page.goto("/guide/projects#projects-resource-25");
  await expect(page.locator("#projects-resource-25 h3")).toHaveText(
    "Formbricks",
  );
  await expect(page.locator("#projects-resource-25")).toBeInViewport();
  await page
    .getByRole("searchbox", { name: "搜索开源项目" })
    .fill("没有结果XYZ");
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Mealie");
  await page.getByRole("option").filter({ hasText: "开源项目" }).click();
  await expect(page).toHaveURL(/#projects-resource-27$/);
  const card = page.locator("#projects-resource-27");
  await expect(card).toBeInViewport();
  await expect(
    page.getByRole("searchbox", { name: "搜索开源项目" }),
  ).toHaveValue("");
  await card.locator("summary").click();
  await expect(card).toContainText("照片存储");
  await expect(
    card.getByRole("link", { name: "数据库与文件存储" }),
  ).toHaveAttribute("href", "/guide/databases");
  await card.getByRole("button", { name: "先写我的目标" }).click();
  await page
    .getByLabel("我想做什么（选填）")
    .fill("做一个两人家庭的低糖食谱本");
  await page
    .getByRole("button", { name: "复制我的改造说明", exact: true })
    .click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("我的目标：做一个两人家庭的低糖食谱本");
  expect(copied).toContain("mealie-recipes/mealie");
  expect(copied).toContain("重启后图片和记录仍在");
  expect(copied).not.toContain("我的目标：做一个家庭食谱本");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("project catalog fits mobile and supports keyboard disclosure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guide/projects");
  const card = page.locator(".project-card").first();
  await card.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(card.locator("details")).toHaveAttribute("open", "");
  await expect(card).toContainText("钱可能花在哪");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await card.getByRole("button", { name: "先写我的目标" }).click();
  await expect(page.getByRole("dialog")).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "复制我的改造说明" }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
test("landing explains its purpose and routes each project stage", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("让 AI 写的项目，真正上线。");
  await expect(page).toHaveTitle(/LaunchPad AI/);
  await expect(page.locator(".brand")).toContainText("LaunchPad AI");
  await expect(page.locator(".landing-explanation")).toContainText("非程序员");
  await expect(page.locator(".left-sidebar")).toHaveCount(0);
  await expect(page.locator(".right-rail")).toHaveCount(0);
  await expect(page.locator(".landing-journey li")).toHaveCount(4);
  await expect(page.locator(".landing-start-links > a")).toHaveCount(3);
  await expect(page.locator(".landing-actions")).toBeInViewport();
  for (const slug of slugs) {
    expect(
      await page.locator('main a[href="/guide/' + slug + '"]').count(),
      slug,
    ).toBeGreaterThan(0);
  }
  for (const href of [
    "/guide/prompts",
    "/guide/local",
    "/guide/local#local-data-next",
  ]) {
    await expect(
      page.locator('.landing-start-links a[href="' + href + '"]'),
    ).toBeVisible();
  }
  await page
    .locator('.landing-start-links a[href$="#local-data-next"]')
    .click();
  await expect(page).toHaveURL("/guide/local#local-data-next");
  await expect(page.locator("#local-data-next h2")).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "复制数据检查任务给 AI", exact: true }),
  ).toBeVisible();
  await page.goto("/");
  const question = page.locator(".landing-faq details").nth(1);
  await question.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("open", "");
  await expect(question.locator("p")).toContainText("自己的 AI 编程助手");
  await page.keyboard.press("Enter");
  await expect(question).not.toHaveAttribute("open", "");
  await page
    .locator(".landing-actions")
    .getByRole("link", { name: "从想法开始" })
    .click();
  await expect(page).toHaveURL("/guide/prompts");
  await expect(page.locator("h1")).toHaveText("AI 启动器");
  await expect(page.getByText("开始探索", { exact: true })).toHaveCount(0);
});
test("all guides show product content and all local navigation anchors exist", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const slug of slugs) {
    const r = await page.goto("/guide/" + slug);
    expect(r?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".guide-outcome")).toContainText(
      /你会(?:得到|知道)/,
    );
    if (
      ![
        "local",
        "cli",
        "cloud",
        "prompts",
        "projects",
        "skills",
        "databases",
        "media",
      ].includes(slug)
    )
      await expect(page.locator(".learning-section").first()).toBeVisible();
    expect(await page.locator("main").innerText()).not.toMatch(
      /完整资料与命令|模块原始资料|原始全文|原始资料：|历史资料|\.md[）)]/,
    );
    await expect(page.locator(".archive-group,#full-guide")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(
      await page
        .locator(".right-rail .toc a")
        .evaluateAll((links) =>
          links.every(
            (a) =>
              !!document.getElementById((a as HTMLAnchorElement).hash.slice(1)),
          ),
        ),
    ).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
test("Chinese input confirmation does not navigate until composition has finished", async ({
  page,
}) => {
  await page.goto("/guide/local");
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  const search = page.getByRole("combobox", { name: "搜索关键词" });
  await search.fill("数据库");
  await search.dispatchEvent("keydown", {
    key: "Enter",
    code: "Enter",
    isComposing: true,
  });
  await expect(
    page.getByRole("dialog", { name: "搜索全站内容" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/guide\/local$/);
  await search.press("Enter");
  await expect(page.getByRole("dialog", { name: "搜索全站内容" })).toHaveCount(
    0,
  );
  await expect(page).not.toHaveURL(/\/guide\/local$/);
});

test("fuzzy search reaches visible command and curated guide content", async ({
  page,
}) => {
  await page.goto("/guide/prompts");
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await expect(page.getByRole("combobox")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("Vercle");
  await expect(page.getByRole("option").first()).toContainText("Vercel");
  await page.getByRole("combobox").press("Enter");
  await expect(page).toHaveURL(/guide\/cloud#cloud-0/);
  await expect(page.locator("#cloud-0")).toBeInViewport();
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Streamlit");
  await page.getByRole("option").filter({ hasText: "本地运行命令" }).click();
  await expect(page).toHaveURL(/guide\/local#local-22/);
  await expect(page.locator("#local-22")).toBeInViewport();
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("免费");
  await page.getByRole("option").filter({ hasText: "究竟免了什么" }).click();
  await expect(page.locator("#cloud-billing")).toBeInViewport();
});
test("search reveals a result hidden by an existing catalog filter", async ({
  page,
}) => {
  await page.goto("/guide/cloud");
  await page.getByRole("searchbox", { name: "筛选平台" }).fill("Python");
  await expect(page.locator("#cloud-0")).toHaveCount(0);
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Vercel");
  await page
    .getByRole("option")
    .filter({ hasText: "云端部署平台" })
    .first()
    .click();
  await expect(page.locator("#cloud-0")).toBeInViewport();
});
test("catalog filters and empty state work", async ({ page }) => {
  await page.goto("/guide/cloud");
  await page.getByRole("searchbox", { name: "筛选平台" }).fill("Python");
  await page.getByRole("checkbox", { name: "只看有持续免费额度" }).check();
  expect(await page.locator(".platform-full-card").count()).toBeGreaterThan(0);
  await expect(
    page.locator(".platform-full-card").filter({ hasText: /免费/ }),
  ).toHaveCount(await page.locator(".platform-full-card").count());
  await page.getByRole("searchbox", { name: "筛选平台" }).fill("zzzz-no-match");
  await expect(page.getByText("没有符合条件的平台")).toBeVisible();
  await page.getByRole("button", { name: "清除筛选" }).click();
  await expect(page.locator(".platform-full-card")).toHaveCount(6);
  await expect(page.locator(".cloud-result-count")).toContainText(
    "找到 20 个平台",
  );
});
test("prompt generation uses one scenario, real requirements and explained deployment tiers", async ({
  page,
}) => {
  await page.goto("/guide/prompts");
  await page.getByRole("textbox", { name: "搜索场景" }).fill("短链接");
  await page
    .locator(".prompt-option")
    .filter({ hasText: "短链接与点击统计" })
    .click();
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await page.getByLabel("项目名称（选填）").fill("短链花园");
  await page.locator("#scenario-purpose").fill("统计我的设计作品访问量");
  await page
    .getByLabel("还有哪些具体要求？（选填）")
    .fill("柔和粉绿配色，支持自定义短链");
  await expect(page.locator(".starter-comparison")).not.toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator(".starter-plan")).toContainText(
    "Cloudflare Workers",
  );
  await page.locator(".starter-comparison summary").click();
  await expect(page.locator(".tier-name")).toHaveText([
    "夯暴了",
    "顶级",
    "人上人",
    "NPC",
    "拉完了",
  ]);
  const worker = page
    .locator(".ranked-platform")
    .filter({ hasText: "Cloudflare Workers" });
  await expect(worker.getByRole("button")).toHaveText("已选方案");
  await expect(worker.locator(".ranking-caveat")).toContainText("额度");
  const pages = page
    .locator(".ranked-platform")
    .filter({ hasText: "GitHub Pages" });
  await expect(pages.getByRole("button")).toBeDisabled();
  await page.getByRole("button", { name: "生成需求说明" }).click();
  await expect(page.locator(".prompt-preview")).toContainText("短链花园");
  await expect(page.locator(".prompt-preview")).toContainText(
    "Cloudflare Workers",
  );
  await expect(page.locator(".prompt-preview")).toContainText(
    "统计我的设计作品访问量",
  );
  await page.getByRole("button", { name: "复制需求说明", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "柔和粉绿配色",
  );
  await expect(page.getByText("已复制", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "换个场景" }).click();
  await expect(page.locator(".prompt-option.selected")).toContainText(
    "短链接与点击统计",
  );
  await page.getByRole("textbox", { name: "搜索场景" }).fill("微信小程序");
  await page
    .locator(".prompt-option")
    .filter({ hasText: "微信小程序", hasNotText: "Taro" })
    .click();
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(page.getByLabel("项目名称（选填）")).toHaveValue("");
  await expect(page.locator("#scenario-purpose")).toHaveValue("");
  await expect(page.getByLabel("还有哪些具体要求？（选填）")).toHaveValue("");
  await page.getByRole("button", { name: "生成需求说明" }).click();
  await expect(page.locator(".prompt-preview")).toContainText("微信开发者工具");
  await expect(page.locator(".prompt-preview")).toContainText(
    "以下是可选后端方案",
  );
  await expect(page.locator(".prompt-preview")).not.toContainText("短链花园");
});
test("commercial use changes recommendation and removed features stay removed", async ({
  page,
}) => {
  await page.goto("/guide/prompts#prompts-18");
  await expect(page.locator(".prompt-option.selected")).toContainText(
    "订阅会员 SaaS",
  );
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(page.getByLabel("项目会用于商业用途吗？")).toHaveValue(
    "commercial",
  );
  await expect(page.locator(".starter-plan")).toContainText(
    "Cloudflare Workers",
  );
  await page.locator(".starter-comparison summary").click();
  await expect(page.locator(".tier-0")).toContainText("Cloudflare Workers");
  const vercel = page
    .locator(".ranked-platform")
    .filter({ has: page.locator("strong").filter({ hasText: /^Vercel$/ }) });
  await expect(vercel).toContainText("商业项目不能使用 Hobby");
  await page.getByLabel("项目会用于商业用途吗？").selectOption("personal");
  await expect(page.locator(".tier-0")).toContainText("Vercel");
  await page.goto("/guide/prompts#prompts-3");
  await expect(page.locator(".prompt-option.selected")).toContainText(
    "个人作品集",
  );
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await page.getByRole("checkbox", { name: "作品列表与独立案例页" }).uncheck();
  await page.getByRole("checkbox", { name: "个人介绍与技能" }).uncheck();
  await page.getByRole("checkbox", { name: "联系方式与社交链接" }).uncheck();
  await expect(
    page.getByRole("button", { name: "生成需求说明" }),
  ).toBeDisabled();
  await page.getByRole("checkbox", { name: "联系方式与社交链接" }).check();
  await page.getByRole("button", { name: "生成需求说明" }).click();
  await expect(page.locator(".prompt-preview")).not.toContainText(
    "项目卡片进入对应案例",
  );
  await expect(page.locator(".prompt-preview")).toContainText(
    "联系方式与社交链接",
  );
  await expect(page.locator(".prompt-preview")).toContainText("尚未填写");
});
test("commands copy one explained line and respect manager, system and alternatives", async ({
  page,
}) => {
  await page.goto("/guide/local");
  await page.locator("#local-lockfiles summary").click();
  await expect(page.locator("#local-lockfiles")).toContainText(
    "全新项目且没有要求：小白先用 npm",
  );
  await expect(page.locator("#local-lockfiles")).toContainText("共享存储");
  await page.getByRole("textbox", { name: "搜索技术栈" }).fill("Next.js");
  await page.getByRole("tab", { name: "pnpm", exact: true }).click();
  const next = page.locator("#local-6");
  await expect(next.locator(".command-step-item pre")).toHaveText([
    "pnpm install",
    "pnpm dev",
  ]);
  await expect(next).toContainText("什么时候执行");
  await expect(next).toContainText("成功后");
  for (const [index, command] of ["pnpm install", "pnpm dev"].entries()) {
    await next
      .locator(".command-step-item")
      .nth(index)
      .getByRole("button", { name: "复制内容", exact: true })
      .click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      command,
    );
  }
  await next.locator(".local-related-disclosure summary").click();
  await expect(
    next.getByRole("link", { name: "部署参考：Vercel" }),
  ).toHaveAttribute("href", "/guide/cloud#cloud-0");
  await page.getByRole("textbox", { name: "搜索技术栈" }).fill("Spring Boot");
  const card = page.locator("#local-32");
  await expect(card.locator("pre")).toContainText(
    ".\\mvnw.cmd spring-boot:run",
  );
  await expect(card.locator("pre")).not.toContainText("gradlew");
  await card.getByRole("combobox").selectOption("Gradle（build.gradle）");
  await expect(card.locator("pre")).toContainText(".\\gradlew.bat bootRun");
  await page.getByRole("tab", { name: "macOS / Linux", exact: true }).click();
  await expect(card.locator("pre")).toContainText("./gradlew bootRun");
});
test("WeChat shows developer-tool steps and Python errors have concrete recovery", async ({
  page,
}) => {
  await page.goto("/guide/local#local-wechat");
  const wechat = page.locator("#local-wechat");
  await expect(wechat).toContainText("微信开发者工具");
  await expect(wechat.locator("pre")).toHaveCount(0);
  await wechat.locator(".local-related-disclosure summary").click();
  await expect(
    wechat.getByRole("link", { name: "做微信小程序", exact: true }),
  ).toHaveAttribute("href", "/guide/prompts#scenario-wechat");
  await page.getByRole("textbox", { name: "搜索技术栈" }).fill("Streamlit");
  const streamlit = page.locator("#local-22");
  await streamlit.getByRole("button", { name: /常见问题与处理/ }).click();
  await expect(streamlit.locator(".stack-issues")).toContainText("streamlit");
  await expect(streamlit.locator(".stack-issues article")).toHaveCount(3);
  await streamlit
    .getByRole("button", { name: "复制针对本项目的排错说明" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Streamlit",
  );
  await expect(streamlit.locator(".command-step-item pre")).toHaveText([
    "python -m venv .venv",
    ".\\.venv\\Scripts\\Activate.ps1",
    "python -m pip install -r requirements.txt",
    "python -m streamlit run app.py",
  ]);
});
test("deployment tasks speak to beginners and retain optional command deep links", async ({
  page,
}) => {
  await page.goto("/guide/cli");
  await expect(page.locator(".cli-technical")).not.toHaveAttribute("open", "");
  await page.getByLabel("准备部署到哪里？").selectOption("cloud-17");
  await page.getByLabel("要保存用户或业务数据吗？").selectOption("needed");
  await page.getByRole("button", { name: "生成上线任务" }).click();
  await expect(page.locator("#deployment-result-heading")).toBeInViewport();
  await expect(page.locator("#deployment-result-heading")).toBeFocused();
  await page.getByRole("button", { name: "复制上线任务给 AI" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("EdgeOne");
  expect(copied).toContain("先按已有技术选择开发数据库");
  expect(copied).toContain("不要自动购买或升级");
  await page.goto("/guide/cli#cli-huggingface");
  await expect(
    page.getByRole("tab", { name: "Hugging Face", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page
    .locator("#cli-huggingface summary")
    .filter({ hasText: /^登录$/ })
    .click();
  await expect(page.locator("#cli-huggingface")).toContainText("hf auth login");
  await page.getByRole("tab", { name: "Cloudflare", exact: true }).click();
  await page
    .locator("#cli-cloudflare summary")
    .filter({ hasText: "先在本地验证已有 SQL" })
    .click();
  await expect(page.locator("#cli-cloudflare")).toContainText(
    "wrangler d1 execute DB --local",
  );
  await page
    .locator("#cli-cloudflare summary")
    .filter({ hasText: "创建 R2 存储桶" })
    .click();
  await expect(page.locator("#cli-cloudflare")).toContainText(
    "wrangler r2 bucket create",
  );
});
test("resource guidance and followup prompts are copyable product content", async ({
  page,
}) => {
  await page.goto("/guide/projects");
  await page
    .locator(".resource-card")
    .first()
    .getByRole("button", { name: "复制改造说明" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "https://github.com/",
  );
  await page.locator("#projects-customize > summary").click();
  await page
    .locator("#projects-customize .learning-prompt")
    .first()
    .getByRole("button", { name: "复制给 AI" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "先跑通原版",
  );
  await page.goto("/guide/skills");
  await page
    .locator(".resource-card")
    .first()
    .getByRole("button", { name: "复制安装说明" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Agent 名称",
  );
});
test("media guide compares formats and explains manual batches without an upload tool", async ({
  page,
}) => {
  await page.goto("/guide/media");
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "转换为 WebP" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: /复制 .*官网链接/ }),
  ).toHaveCount(0);
  await expect(page.locator("#media-format")).not.toHaveAttribute("open", "");
  await page.locator("#media-format > summary").click();
  for (const format of ["JPEG / JPG", "WebP", "AVIF", "PNG", "SVG", "JPEG XL"])
    await expect(
      page
        .locator("#media-format")
        .getByRole("rowheader", { name: format, exact: true }),
    ).toBeVisible();
  await page.locator("#media-batch > summary").click();
  await expect(page.locator("#media-batch")).toContainText("Caesium");
  await expect(page.locator("#media-batch")).toContainText("选新的输出文件夹");
  await page.locator("#media-storage > summary").click();
  await page
    .locator("#media-storage")
    .getByRole("button", { name: "复制给 AI" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "私密文件",
  );
  await page
    .locator("#media-storage")
    .getByRole("link", { name: "比较文件存储平台" })
    .click();
  await expect(page.locator("#database-15")).toBeInViewport();
});
test("database catalog explains uses and copies targeted setup and diagnostic tasks", async ({
  page,
}) => {
  await page.goto("/guide/databases");
  await expect(page.locator(".database-service-card")).toHaveCount(6);
  expect(await page.locator("main").innerText()).not.toMatch(
    /套餐说明已核对|额度尚待确认|待复核|待核验/,
  );
  await expect(page.locator(".database-use")).toHaveCount(6);
  await page.getByRole("searchbox", { name: "搜索数据服务" }).fill("报名");
  await expect(page.locator("#database-0")).toBeVisible();
  await page.getByRole("searchbox", { name: "搜索数据服务" }).fill("D1");
  await page.locator("#database-2 summary").click();
  await page
    .getByRole("button", { name: "直接复制 Cloudflare D1 接入任务" })
    .click();
  const setup = await page.evaluate(() => navigator.clipboard.readText());
  expect(setup).toContain("Cloudflare D1");
  expect(setup).toContain("数据库绑定");
  await page
    .locator("#database-2")
    .getByRole("button", { name: "生成我的接入说明" })
    .click();
  await expect(page.getByLabel("这次接入或排查哪个服务？")).toHaveValue(
    "database-2",
  );
  await page.getByRole("button", { name: "复制我的接入说明" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "不要假定所有服务都使用 DATABASE_URL",
  );
  await page.getByRole("button", { name: "复制我的排错说明" }).click();
  const diagnostic = await page.evaluate(() => navigator.clipboard.readText());
  expect(diagnostic).toContain("错误证据");
  expect(diagnostic).toContain("修复后实际执行");
  await page.getByRole("searchbox", { name: "搜索数据服务" }).fill("CloudBase");
  await page.getByRole("checkbox", { name: "只看含免费额度的方案" }).check();
  await expect(page.locator("#database-19")).toHaveCount(0);
  await page.getByRole("checkbox", { name: "只看含免费额度的方案" }).uncheck();
  await expect(page.locator("#database-19")).toContainText("15 天");
  await page.locator("#database-19 summary").click();
  await page
    .locator("#database-19")
    .getByRole("link", { name: "微信小程序的需求说明" })
    .click();
  await expect(page).toHaveURL(/guide\/prompts#scenario-wechat/);
  await expect(page.locator("#scenario-wechat")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
test("mobile entry, navigation and persistent theme work without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("link", { name: "找到起点", exact: true }).click();
  await expect(page.locator("#start-title")).toBeInViewport();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .locator(".landing-actions")
    .getByRole("link", { name: "从想法开始" })
    .click();
  await page.getByRole("button", { name: "打开导航菜单" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "云端部署平台", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL("/guide/cloud");
  await page.getByRole("button", { name: "切换深色模式" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  for (const slug of ["", ...slugs.map((s) => "guide/" + s)]) {
    await page.goto("/" + slug);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      slug,
    ).toBeTruthy();
  }
});

test("generated requirements move into view and all five tiers have distinct colors", async ({
  page,
}) => {
  await page.goto("/guide/prompts");
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(page.locator(".tier-name")).toHaveCount(5);
  const colors = await page
    .locator(".tier-name")
    .evaluateAll((nodes) =>
      nodes.map((n) => getComputedStyle(n).backgroundColor),
    );
  expect(new Set(colors).size).toBe(5);
  await page.getByRole("button", { name: "生成需求说明" }).click();
  await expect(
    page.getByRole("heading", { name: /这次只做/ }),
  ).toBeInViewport();
  await expect(page.locator(".prompt-steps")).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "上一步", exact: true }).click();
  await page.getByRole("button", { name: "生成需求说明" }).click();
  await expect(
    page.getByRole("heading", { name: /这次只做/ }),
  ).toBeInViewport();
});
test("local knowledge starts closed and the deck switches by button, filter and hash", async ({
  page,
}) => {
  await page.goto("/guide/local");
  for (const id of ["local-first", "local-lockfiles"]) {
    await expect(page.locator("#" + id)).not.toHaveAttribute("open", "");
    await expect(
      page.locator("#" + id + " .learning-section"),
    ).not.toBeVisible();
  }
  await expect(page.locator("#module-tools h2")).toBeInViewport();
  await expect(page.locator(".command-card")).toHaveCount(1);
  await expect(page.locator(".command-card")).toHaveAttribute("id", "local-6");
  await page.getByRole("button", { name: "下一个技术栈", exact: true }).click();
  await expect(page.locator(".command-card")).toHaveAttribute("id", "local-7");
  await page.getByRole("button", { name: "上一个技术栈", exact: true }).click();
  await expect(page.locator(".command-card")).toHaveAttribute("id", "local-6");
  expect(
    await page
      .locator(".command-deck")
      .evaluate((el) => getComputedStyle(el).overflowY),
  ).toBe("visible");
  await page.getByRole("button", { name: "小程序前后端", exact: true }).click();
  await page.getByLabel("直接选择技术栈").selectOption("local-cloudbase");
  await expect(page.locator(".command-card")).toContainText("微信云开发后端");
  await page.locator(".local-related-disclosure summary").click();
  await page
    .locator("#local-cloudbase .stack-related")
    .getByRole("link", { name: "微信原生小程序", exact: true })
    .click();
  await expect(page.locator(".command-card")).toHaveAttribute(
    "id",
    "local-wechat",
  );
  await page
    .getByRole("textbox", { name: "搜索技术栈" })
    .fill("zzzz-no-result");
  await expect(
    page.getByText("没有找到匹配项目，试试文件名或更短的词。"),
  ).toBeVisible();
  await page.goto("/guide/local#local-22");
  await expect(page.locator(".command-card")).toHaveAttribute("id", "local-22");
  await page.locator(".command-settings a").click();
  await expect(page.locator("#local-first")).toHaveAttribute("open", "");
  await expect(page.locator(".guide-next")).toHaveAttribute(
    "href",
    "/guide/databases",
  );
  await page
    .getByRole("button", { name: "只展示内容 / 本地处理", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "不需要云数据库，直接选择部署平台" }),
  ).toHaveAttribute("href", "/guide/cloud");
});
test("withdrawn services stay out of the user facing platform catalog", async ({
  page,
}) => {
  await page.goto("/guide/cloud");
  await expect(
    page.locator(".platform-full-card#cloud-13,.platform-full-card#cloud-19"),
  ).toHaveCount(0);
  await expect(page.locator("#withdrawn-platforms")).toHaveCount(0);
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Zeabur");
  await expect(page.getByRole("option")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.goto("/guide/cloud#cloud-7");
  await expect(page.locator("#cloud-7")).toContainText(
    "普通 Gradio / Docker 创建需付费计划",
  );
  await page.goto("/guide/cloud#cloud-17");
  await page
    .locator("#cloud-17")
    .getByRole("link", { name: "让 AI 帮我部署到这里" })
    .click();
  await expect(page.getByLabel("准备部署到哪里？")).toHaveValue("cloud-17");
  await expect(page.locator("#deploy-cloud-17")).toBeInViewport();
  await page.goto("/guide/prompts#prompts-3");
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(
    page.locator(".ranked-platform").filter({ hasText: "EdgeOne" }),
  ).toHaveCount(1);
  await expect(
    page.locator(".ranked-platform").filter({ hasText: "Zeabur" }),
  ).toHaveCount(0);
});

test("starter pagination, empty search and scenario drafts stay coherent", async ({
  page,
}) => {
  await page.goto("/guide/prompts");
  await expect(page.locator(".prompt-option")).toHaveCount(8);
  expect(
    await page
      .locator(".prompt-options")
      .evaluate((el) => getComputedStyle(el).overflowY),
  ).toBe("visible");
  const seen = new Set<string>();
  for (let index = 0; index < 6; index++) {
    for (const id of await page
      .locator(".prompt-option")
      .evaluateAll((nodes) => nodes.map((node) => node.id)))
      seen.add(id);
    if (index < 5)
      await page
        .getByRole("button", { name: "下一页场景", exact: true })
        .click();
  }
  expect(seen.size).toBe(42);
  await expect(
    page.getByRole("button", { name: "下一页场景", exact: true }),
  ).toBeDisabled();
  await page.getByRole("textbox", { name: "搜索场景" }).fill("zzzz-missing");
  await expect(
    page.getByRole("button", { name: "继续，补充想法" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "查看全部场景", exact: true }).click();
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await page.getByLabel("项目名称（选填）").fill("我的插画作品");
  await page.locator("#scenario-purpose").fill("给品牌客户展示插画作品");
  await page.getByRole("checkbox", { name: "个人介绍与技能" }).uncheck();
  await page.getByRole("button", { name: "更换场景", exact: true }).click();
  await page.locator(".prompt-option.selected").click();
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(page.getByLabel("项目名称（选填）")).toHaveValue("我的插画作品");
  await expect(
    page.getByRole("checkbox", { name: "个人介绍与技能" }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "更换场景", exact: true }).click();
  await page.getByRole("textbox", { name: "搜索场景" }).fill("报名");
  await page
    .locator(".prompt-option")
    .filter({ hasText: "活动报名表单" })
    .click();
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(page.getByLabel("项目名称（选填）")).toHaveValue("");
  await page.getByLabel("项目名称（选填）").fill("周末读书会");
  await page.getByRole("button", { name: "更换场景", exact: true }).click();
  await page.getByRole("textbox", { name: "搜索场景" }).fill("作品集");
  await page
    .locator(".prompt-option")
    .filter({ hasText: "个人作品集" })
    .click();
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(page.locator("#scenario-purpose")).toHaveValue(
    "给品牌客户展示插画作品",
  );
  await page.locator(".starter-comparison summary").click();
  await page
    .locator(".ranked-platform")
    .filter({ hasText: "Netlify" })
    .getByRole("button", { name: "选择此方案", exact: true })
    .click();
  await expect(page.locator(".starter-plan-heading")).toContainText("Netlify");
  await page.getByRole("button", { name: "生成需求说明" }).click();
  await expect(page.locator(".starter-result-summary")).toContainText(
    "Netlify",
  );
  await expect(
    page.getByRole("heading", { name: "复制后，放到哪里？" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "复制需求说明", exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("我的插画作品");
  expect(copied).toContain("Netlify");
  expect(copied).not.toContain("周末读书会");
  expect(copied).not.toContain("个人介绍与技能");
  await page.locator(".starter-full-prompt summary").click();
  await expect(page.locator(".prompt-preview")).toBeVisible();
  expect(
    await page
      .locator(".prompt-preview")
      .evaluate((el) => getComputedStyle(el).overflowY),
  ).toBe("visible");
});

test("offline starter avoids cloud choices and knowledge opens from its anchor", async ({
  page,
}) => {
  await page.goto("/guide/prompts#scenario-files");
  await expect(page.locator(".prompt-option.selected")).toContainText(
    "本地文件整理脚本",
  );
  await page.getByRole("button", { name: "继续，补充想法" }).click();
  await expect(page.locator(".starter-plan")).toContainText("不需要开通云平台");
  await expect(page.locator(".starter-comparison")).toHaveCount(0);
  await page.getByRole("button", { name: "生成需求说明" }).click();
  await page.getByRole("button", { name: "复制需求说明", exact: true }).click();
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).toContain("不自动创建云资源");
  expect(prompt).not.toContain("套餐参考");
  await expect(page.getByRole("link", { name: "了解所选平台" })).toHaveCount(0);
  for (const id of ["prompt-howto", "prompt-followups", "prompt-choose"]) {
    await expect(page.locator("#" + id)).not.toHaveAttribute("open", "");
  }
  await page.locator('.right-rail a[href="#prompt-choose"]').click();
  await expect(page.locator("#prompt-choose")).toHaveAttribute("open", "");
});
