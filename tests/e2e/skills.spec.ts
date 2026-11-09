import { test, expect } from "@playwright/test";

test("extensions support purpose, type, search and pagination without losing installation preferences", async ({
  page,
}) => {
  await page.goto("/guide/skills");
  await expect(page.locator("#skills-types")).not.toHaveAttribute("open", "");
  await expect(page.locator(".skill-card")).toHaveCount(6);
  await expect(page.locator(".skill-results-heading")).toContainText(
    "18 个扩展可选",
  );
  await page.getByLabel("你正在用哪个 AI 工具？").selectOption("cursor");
  const pager = page.getByRole("navigation", { name: "扩展分页" });
  await expect(pager.getByRole("button", { name: "上一页" })).toBeDisabled();
  await pager.getByRole("button", { name: "下一页" }).click();
  await expect(pager).toContainText("第 2 / 3 页");
  await expect(page.locator(".skill-results-heading h3")).toBeInViewport();
  await page.getByRole("searchbox", { name: "搜索技能与扩展" }).fill("Word");
  await expect(page.locator(".skill-card h3")).toHaveText(
    "Anthropic Document Skills",
  );
  await page.getByRole("combobox", { name: "扩展形式" }).selectOption("CLI");
  await expect(
    page.getByText("暂时没找到匹配的扩展", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "查看全部扩展", exact: true }).click();
  await expect(page.getByLabel("你正在用哪个 AI 工具？")).toHaveValue("cursor");
  await page
    .getByRole("group", { name: "按要解决的问题筛选" })
    .getByRole("button", { name: "项目协作", exact: true })
    .click();
  await expect(page.locator(".skill-card h3")).toHaveText("GitHub MCP");
  await expect(page.locator(".skill-pagination")).toHaveCount(0);
});

test("installation and trial tasks copy selected context and extension-specific acceptance", async ({
  page,
}) => {
  await page.goto("/guide/skills");
  await page.getByLabel("你正在用哪个 AI 工具？").selectOption("codex");
  await page.locator(".skill-preferences > summary").click();
  await page
    .getByRole("combobox", { name: "电脑系统", exact: true })
    .selectOption("windows");
  await page
    .getByRole("combobox", { name: "安装范围", exact: true })
    .selectOption("global");
  const card = page.locator("#skills-resource-14");
  await card.getByRole("button", { name: "复制安装说明", exact: true }).click();
  const install = await page.evaluate(() => navigator.clipboard.readText());
  expect(install).toContain("Agent 名称：Codex");
  expect(install).toContain("电脑系统：Windows");
  expect(install).toContain("安装范围：我的所有项目");
  expect(install).toContain("https://github.com/pbakaus/impeccable");
  await card.locator(".skill-install-preview > summary").click();
  await expect(card.locator(".skill-install-preview pre")).toHaveText(install);
  await card.locator(".skill-details > summary").click();
  await card.getByRole("button", { name: "复制试用任务", exact: true }).click();
  const trial = await page.evaluate(() => navigator.clipboard.readText());
  expect(trial).toContain("保留现有品牌配色和功能");
  expect(trial).toContain("检查是否完成");
  expect(trial).not.toContain("安装范围：");
  await page.getByLabel("你正在用哪个 AI 工具？").selectOption("web");
  await expect(page.locator(".skill-web-hint")).toBeVisible();
  await card.getByRole("button", { name: "复制安装说明", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "不要假定网页能读写本地项目或运行终端",
  );
});

test("extension deep links reveal later pages and legacy names reach current official entries", async ({
  page,
}) => {
  await page.goto("/guide/skills#skills-resource-13");
  await expect(page.locator("#skills-resource-13 h3")).toHaveText(
    "Awesome Cursor Rules",
  );
  await expect(page.locator("#skills-resource-13")).toBeInViewport();
  await page
    .getByRole("searchbox", { name: "搜索技能与扩展" })
    .fill("不应该有结果XYZ");
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Magic MCP");
  await page.getByRole("option").filter({ hasText: "21st MCP" }).click();
  await expect(page).toHaveURL(/skills#skills-resource-2$/);
  const card = page.locator("#skills-resource-2");
  await expect(card).toBeInViewport();
  await expect(
    page.getByRole("searchbox", { name: "搜索技能与扩展" }),
  ).toHaveValue("");
  await expect(
    card.getByRole("link", { name: "官方指南", exact: true }),
  ).toHaveAttribute("href", "https://21st.dev/mcp");
  await card.locator(".skill-details > summary").click();
  await expect(card).toContainText("旧 Magic API Key 已重置");
});

test("mobile extension controls and concrete troubleshooting work with keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/guide/skills");
  await page.getByLabel("你正在用哪个 AI 工具？").selectOption("other");
  await page.getByLabel("工具名称（选填）").fill("Windsurf");
  const card = page.locator(".skill-card").first();
  await card.locator(".skill-details > summary").focus();
  await page.keyboard.press("Enter");
  await expect(card.locator(".skill-details")).toHaveAttribute("open", "");
  await card.getByRole("button", { name: "复制安装说明", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Agent 名称：Windsurf",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page
    .getByRole("searchbox", { name: "搜索技能与扩展" })
    .fill("没有结果XYZ");
  await page.locator('.skill-empty a[href="#skills-assembly"]').click();
  await expect(page.locator("#skills-assembly")).toHaveAttribute("open", "");
  const troubleshooting = page
    .locator("#skills-assembly .learning-prompt")
    .filter({ hasText: "提示未授权、密钥错误或额度不足" });
  await troubleshooting
    .getByRole("button", { name: "复制给 AI", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "不要默认升级付费套餐",
  );
  expect(errors).toEqual([]);
});
