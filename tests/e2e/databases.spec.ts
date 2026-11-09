import { test, expect } from "@playwright/test";

test("data planner preserves existing databases, separates files and can skip unnecessary services", async ({
  page,
}) => {
  await page.goto("/guide/databases");
  await expect(page.locator("#database-types")).not.toHaveAttribute("open", "");
  await page.getByLabel("我想实现的功能").selectOption("records");
  await expect(page.locator(".database-advice")).toContainText(
    "先确认它支持哪种数据库",
  );
  await expect(
    page.getByRole("button", { name: "只比较这些候选" }),
  ).toHaveCount(0);
  await page.getByLabel("项目现在用的数据库").selectOption("mysql");
  await expect(page.locator(".database-advice")).toContainText("TiDB Cloud");
  await expect(page.locator(".database-advice")).not.toContainText("Neon");
  await page.getByRole("button", { name: "只比较这些候选" }).click();
  await expect(page.locator(".database-service-card")).toHaveCount(1);
  await expect(page.locator("#database-4")).toBeVisible();
  await expect(page.locator(".database-results-header")).toBeFocused();
  await expect(page.locator(".database-results-header h3")).toBeInViewport();
  await page.getByLabel("我想实现的功能").selectOption("both");
  await expect(page.locator(".database-advice-group")).toHaveCount(2);
  await page.getByRole("button", { name: "只比较这些候选" }).click();
  await expect(page.locator(".database-service-card")).toHaveCount(4);
  await page.getByRole("button", { name: "复制数据需求检查任务给 AI" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("已使用 MySQL");
  expect(copied).toContain("既保存记录，也上传文件");
  await page.getByLabel("我想实现的功能").selectOption("none");
  await expect(
    page.getByRole("link", { name: "先选择网站部署平台" }),
  ).toHaveAttribute("href", "/guide/cloud");
  await expect(page.getByLabel("项目现在用的数据库")).toHaveCount(0);
});

test("database service pagination, combined filters and empty recovery keep all entries reachable", async ({
  page,
}) => {
  await page.goto("/guide/databases");
  const seen = new Set<string>();
  const pagination = page.getByRole("navigation", { name: "数据服务分页" });
  for (let index = 0; index < 4; index++) {
    for (const id of await page
      .locator(".database-service-card")
      .evaluateAll((nodes) => nodes.map((node) => node.id)))
      seen.add(id);
    if (index < 3)
      await pagination
        .getByRole("button", { name: "下一页", exact: true })
        .click();
  }
  expect(seen.size).toBe(20);
  await expect(
    pagination.getByRole("button", { name: "下一页", exact: true }),
  ).toBeDisabled();
  await page.getByRole("searchbox", { name: "搜索数据服务" }).fill("报名");
  await expect(page.locator("#database-0")).toBeVisible();
  await page
    .getByRole("group", { name: "按数据用途筛选" })
    .getByRole("button", { name: "AI 检索", exact: true })
    .click();
  await expect(page.getByText("还没有符合这些条件的服务")).toBeVisible();
  await page.getByRole("button", { name: "查看全部数据服务" }).click();
  await expect(page.locator(".database-service-card")).toHaveCount(6);
  await page
    .getByRole("group", { name: "按数据用途筛选" })
    .getByRole("button", { name: "图片与文件", exact: true })
    .click();
  await expect(page.locator("#database-1")).toBeVisible();
  await expect(page.locator("#database-19")).toBeVisible();
});

test("data tasks carry selected deployment and errors reset when the service changes", async ({
  page,
}) => {
  await page.goto("/guide/databases#database-2");
  const card = page.locator("#database-2");
  await card.getByRole("button", { name: "生成我的接入说明" }).click();
  await expect(page.getByLabel("这次接入或排查哪个服务？")).toHaveValue(
    "database-2",
  );
  await expect(page.getByLabel("这次接入或排查哪个服务？")).toBeFocused();
  await expect(page.locator("#database-connect h3")).toBeInViewport();
  await page.getByLabel("这次处理到哪一步？").selectOption("online");
  await page
    .getByLabel("网站准备部署 / 已部署到哪里？")
    .selectOption("cloud-1");
  await page.getByRole("button", { name: "复制我的接入说明" }).click();
  const setup = await page.evaluate(() => navigator.clipboard.readText());
  expect(setup).toContain("Cloudflare D1");
  expect(setup).toContain("Cloudflare Workers");
  expect(setup).toContain("网站已部署");
  await page.getByLabel("我遇到的情况").selectOption("save");
  await page.locator(".database-error-details summary").click();
  await page.getByLabel("点了什么 / 执行了什么？").fill("提交新的读书会报名");
  await page
    .getByLabel("已经去掉秘密信息的报错")
    .fill("D1_ERROR: no such table: registrations");
  await page.getByRole("button", { name: "复制我的排错说明" }).click();
  const diagnostic = await page.evaluate(() => navigator.clipboard.readText());
  expect(diagnostic).toContain("提交新的读书会报名");
  expect(diagnostic).toContain("no such table");
  expect(diagnostic).toContain("Cloudflare Workers");
  await page.getByLabel("这次接入或排查哪个服务？").selectOption("database-15");
  await expect(page.getByLabel("这次处理到哪一步？")).toHaveValue("online");
  await expect(page.getByLabel("我遇到的情况")).toHaveValue("unknown");
  await page.locator(".database-error-details summary").click();
  await expect(page.getByLabel("已经去掉秘密信息的报错")).toHaveValue("");
  await page.getByRole("button", { name: "复制我的排错说明" }).click();
  const fresh = await page.evaluate(() => navigator.clipboard.readText());
  expect(fresh).toContain("Cloudflare R2");
  expect(fresh).not.toContain("registrations");
});

test("search links reveal later database pages and knowledge links expand their target", async ({
  page,
}) => {
  await page.goto("/guide/databases#database-14");
  await expect(page.locator("#database-14")).toBeInViewport();
  await page
    .getByRole("searchbox", { name: "搜索数据服务" })
    .fill("no-matches");
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("Filess.io");
  await page
    .getByRole("option")
    .filter({ hasText: "Filess.io" })
    .first()
    .click();
  await expect(page.locator("#database-6")).toBeInViewport();
  await expect(
    page.getByRole("searchbox", { name: "搜索数据服务" }),
  ).toHaveValue("");
  await page.locator('.right-rail a[href="#database-budget"]').click();
  await expect(page.locator("#database-budget")).toHaveAttribute("open", "");
  await expect(page.locator("#database-budget")).toContainText(
    "提醒本身不一定会阻止扣费",
  );
});

test("database choices and expanded tasks fit mobile and support keyboard disclosure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guide/databases");
  await page.getByLabel("我想实现的功能").selectOption("both");
  await page.getByLabel("项目现在用的数据库").selectOption("new");
  await page.getByRole("button", { name: "只比较这些候选" }).click();
  const card = page.locator(".database-service-card").first();
  await card.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(card.locator("details")).toHaveAttribute("open", "");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await card.getByRole("button", { name: "生成我的接入说明" }).click();
  await page.getByRole("button", { name: "复制前看看完整说明" }).click();
  await expect(page.locator(".database-task-preview")).toBeVisible();
  await page.locator(".database-error-details summary").click();
  await page.getByLabel("已经去掉秘密信息的报错").fill("error".repeat(200));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
