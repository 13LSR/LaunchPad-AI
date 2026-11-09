import { test, expect } from "@playwright/test";

test("cloud data preparation gives a different action for each answer", async ({
  page,
}) => {
  await page.goto("/guide/cloud");
  await page.locator(".cloud-data-options > summary").click();
  const answer = page.locator(".cloud-data-answer");
  const select = page.getByLabel("你的项目现在属于哪一种？");
  await expect(answer).toContainText("先让 AI 查清楚");
  await page.getByRole("button", { name: "复制数据检查任务给 AI" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "哪些是上传文件",
  );
  await select.selectOption("none");
  await expect(answer).toContainText("可以先跳过");
  await expect(answer.getByRole("link")).toHaveAttribute(
    "href",
    "#cloud-services",
  );
  await select.selectOption("needed");
  await expect(answer).toContainText("先准备数据服务");
  await expect(answer.getByRole("link")).toHaveAttribute(
    "href",
    "/guide/databases#database-choose",
  );
  await select.selectOption("existing");
  await expect(answer).toContainText("沿用已有服务");
  await expect(answer).toContainText("连接与备份");
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  for (const name of ["Zeabur", "ClawCloud Run"]) {
    await page.getByRole("combobox").fill(name);
    await expect(
      page.getByRole("option").filter({ hasText: name }),
    ).toHaveCount(0);
  }
});

test("cloud planner distinguishes unknown, offline, business and paid project routes", async ({
  page,
}) => {
  await page.goto("/guide/cloud");
  for (const id of ["cloud-choose", "cloud-types", "cloud-billing"])
    await expect(page.locator("#" + id)).not.toHaveAttribute("open", "");
  await expect(page.locator(".cloud-suggestions")).toHaveCount(0);
  await page.getByRole("button", { name: "复制项目检查任务" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "不凭名称猜平台",
  );
  await page.getByLabel("你要部署的是什么？").selectOption("offline");
  await expect(page.locator(".cloud-direction")).toContainText("可以先不上云");
  await page.getByLabel("你要部署的是什么？").selectOption("next");
  await page.getByLabel("这个项目用来做什么？").selectOption("personal");
  await expect(page.locator(".cloud-suggestions li").first()).toContainText(
    "Vercel",
  );
  await page.getByLabel("这个项目用来做什么？").selectOption("commercial");
  await expect(
    page.locator(".cloud-suggestions li > strong"),
  ).not.toContainText(["Vercel"]);
  await page.getByLabel("费用怎么考虑？").selectOption("review");
  await expect(page.locator(".cloud-suggestions")).toContainText(
    "商业项目不能使用 Hobby",
  );
  await page.getByRole("button", { name: "复制选型任务给 AI" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("商业用途");
  expect(copied).toContain("可以考虑付费");
  expect(copied).toContain("Next.js");
});

test("cloud list supports pagination, multiple search terms, free conditions and hash recovery", async ({
  page,
}) => {
  await page.goto("/guide/cloud");
  await expect(page.locator(".cloud-platform-card")).toHaveCount(6);
  await page
    .getByRole("navigation", { name: "部署平台分页" })
    .getByRole("button", { name: "下一页" })
    .click();
  await expect(page.locator(".cloud-results-header")).toBeFocused();
  await expect(page.locator(".cloud-result-count")).toContainText(
    "第 2 / 4 页",
  );
  await page.getByRole("searchbox", { name: "筛选平台" }).fill("Python Flask");
  await expect(page.locator(".cloud-platform-card")).toHaveCount(1);
  await expect(page.locator("#cloud-8")).toBeVisible();
  await page.getByRole("searchbox", { name: "筛选平台" }).fill("Fly.io");
  await page.getByRole("checkbox", { name: "只看有持续免费额度" }).check();
  await expect(
    page.getByText("没有符合条件的平台", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "清除筛选" }).click();
  await page.evaluate(() => {
    location.hash = "cloud-21";
  });
  await expect(page.locator("#cloud-21")).toBeInViewport();
  await expect(page.locator(".cloud-result-count")).toContainText(
    "第 4 / 4 页",
  );
  await page
    .getByRole("searchbox", { name: "筛选平台" })
    .fill("no result qwerty");
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Sealos");
  await page
    .getByRole("option")
    .filter({ hasText: "云端部署平台" })
    .first()
    .click();
  await expect(page.locator("#cloud-20")).toBeInViewport();
  await expect(page.getByRole("searchbox", { name: "筛选平台" })).toHaveValue(
    "",
  );
  await page.goto("/guide/cloud#cloud-13");
  await expect(page.locator("#withdrawn-platforms")).toHaveCount(0);
  await expect(page.locator("#cloud-13")).toHaveCount(0);
});

test("cloud comparison preserves choices across pages, limits selection and copies only selected services", async ({
  page,
}) => {
  await page.goto("/guide/cloud");
  await page
    .getByRole("button", { name: "加入比较 Vercel", exact: true })
    .click();
  await page
    .getByRole("button", { name: "加入比较 Cloudflare Workers", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "部署平台分页" })
    .getByRole("button", { name: "下一页" })
    .click();
  await page
    .getByRole("button", { name: "加入比较 Render", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "加入比较 Koyeb", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "查看比较", exact: true }).click();
  await expect(page.locator("#cloud-compare-title")).toBeFocused();
  await expect(page.locator("#cloud-compare-title")).toBeInViewport();
  await expect(page.locator(".cloud-comparison table")).toContainText(
    "15 分钟",
  );
  await expect(page.locator(".cloud-comparison table")).toContainText(
    "不要把上传文件存在函数本地",
  );
  await page.getByRole("button", { name: "复制这组平台的比较任务" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Vercel");
  expect(copied).toContain("Render");
  expect(copied).not.toContain("Koyeb");
  await page.getByRole("button", { name: "移除 Render", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "加入比较 Koyeb", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "清空比较", exact: true }).click();
  await expect(page.locator(".cloud-comparison")).toHaveCount(0);
});

test("cloud choices carry miniapp, business, budget and existing data into deployment", async ({
  page,
}) => {
  await page.goto("/guide/cloud");
  await page.getByLabel("你要部署的是什么？").selectOption("wechat");
  await page.getByLabel("这个项目用来做什么？").selectOption("commercial");
  await page.getByLabel("费用怎么考虑？").selectOption("review");
  await page.locator(".cloud-data-options summary").click();
  await page.getByLabel("你的项目现在属于哪一种？").selectOption("existing");
  await page.getByRole("searchbox", { name: "筛选平台" }).fill("CloudBase");
  await page
    .locator("#cloud-21")
    .getByRole("link", { name: "让 AI 帮我部署到这里" })
    .click();
  await expect(page.getByLabel("准备部署到哪里？")).toHaveValue("cloud-21");
  await expect(page.getByLabel("你做的是什么作品？")).toHaveValue("miniapp");
  await expect(page.getByLabel("要保存用户或业务数据吗？")).toHaveValue(
    "existing",
  );
  await page.getByRole("button", { name: "生成上线任务" }).click();
  await page.getByRole("button", { name: "复制上线任务给 AI" }).click();
  const task = await page.evaluate(() => navigator.clipboard.readText());
  expect(task).toContain("商业用途");
  expect(task).toContain("可以付费");
  expect(task).toContain("微信开发者工具");
  expect(task).toContain("已有数据服务");
});

test("cloud recommendations and comparison work on mobile without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guide/cloud");
  await page.getByLabel("你要部署的是什么？").selectOption("static");
  await page.getByLabel("这个项目用来做什么？").selectOption("personal");
  await page.getByRole("button", { name: "并排比较这 3 个方案" }).click();
  await expect(page.locator("#cloud-compare-title")).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: /查看全部 \d+ 个候选/ }).click();
  await expect(page.locator(".cloud-active-filter")).toBeVisible();
  const summary = page.locator(".cloud-platform-card summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator(".cloud-platform-card details").first(),
  ).toHaveAttribute("open", "");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
