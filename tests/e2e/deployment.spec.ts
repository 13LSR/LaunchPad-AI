import { test, expect } from "@playwright/test";

test("update and repair tasks keep context, reset stale results and copy actual evidence", async ({
  page,
}) => {
  await page.goto("/guide/cli");
  await page.getByRole("tab", { name: "更新已有项目", exact: true }).click();
  await page.getByLabel("准备部署到哪里？").selectOption("cloud-0");
  await page.getByLabel("你用的 AI 能操作项目吗？").selectOption("chat");
  await page.getByLabel("这次改了什么？（可选）").fill("新增报名图片上传");
  await page.locator(".deployment-options summary").click();
  await page.getByLabel("项目会用于商业用途吗？").selectOption("commercial");
  await page.getByRole("button", { name: "生成更新任务" }).click();
  await page.getByRole("button", { name: "复制更新任务给 AI" }).click();
  const update = await page.evaluate(() => navigator.clipboard.readText());
  expect(update).toContain("新增报名图片上传");
  expect(update).toContain("不能直接读取我的本地文件或执行终端命令");
  expect(update).toContain("不重新创建网站、数据库或仓库");
  expect(update).toContain("商业项目不能为了免费使用 Hobby");
  await page.locator(".deployment-checklist input").first().check();
  await expect(page.locator(".deployment-checklist")).toContainText("已勾选 1");
  await page.getByLabel("费用怎么考虑？").selectOption("review");
  await expect(page.locator(".deployment-result")).toHaveCount(0);
  await page.getByRole("button", { name: "生成更新任务" }).click();
  await expect(page.locator(".deployment-checklist input:checked")).toHaveCount(
    0,
  );
  await page.getByRole("tab", { name: "部署失败排查", exact: true }).click();
  await expect(page.locator(".deployment-result")).toHaveCount(0);
  await page.getByLabel("卡在哪一步？").selectOption("data");
  await page
    .getByLabel("你做了什么操作？（可选）")
    .fill("提交报名后列表没有记录");
  await page
    .getByLabel("报错内容（可选，先去掉密钥与个人信息）")
    .fill("DATABASE_URL missing");
  await page.getByRole("button", { name: "生成排错任务" }).click();
  await page.getByRole("button", { name: "复制排错任务给 AI" }).click();
  const repair = await page.evaluate(() => navigator.clipboard.readText());
  expect(repair).toContain("提交报名后列表没有记录");
  expect(repair).toContain("DATABASE_URL missing");
  expect(repair).not.toContain("请按以下顺序完成首次上线");
  await page.getByRole("tab", { name: "第一次上线", exact: true }).click();
  await page.getByRole("button", { name: "生成上线任务" }).click();
  await page.getByRole("button", { name: "复制上线任务给 AI" }).click();
  expect(
    await page.evaluate(() => navigator.clipboard.readText()),
  ).not.toContain("DATABASE_URL missing");
});

test("miniapp acceptance, platform hash and command copy work without stale state", async ({
  page,
}) => {
  await page.goto("/guide/cli");
  await page.getByLabel("你做的是什么作品？").selectOption("miniapp");
  await expect(
    page.getByRole("link", { name: "查看小程序运行方法" }),
  ).toHaveAttribute("href", "/guide/local#local-wechat");
  await page.getByLabel("要保存用户或业务数据吗？").selectOption("none");
  await page.getByRole("button", { name: "生成上线任务" }).click();
  await expect(page.locator(".deployment-checklist")).toContainText("真机预览");
  await expect(page.locator(".deployment-checklist")).not.toContainText(
    "需要保存的数据",
  );
  await page.locator(".deployment-checklist input").first().check();
  await page.evaluate(() => {
    location.hash = "deploy-cloud-17";
  });
  await expect(page.getByLabel("准备部署到哪里？")).toHaveValue("cloud-17");
  await expect(page.locator(".deployment-result")).toHaveCount(0);
  await expect(page.locator("#deploy-cloud-17")).toBeInViewport();
  await page.locator(".cli-technical > summary").click();
  await expect(page.locator(".cli-technical")).toContainText(
    "没有本站整理的命令卡片",
  );
  await page.getByRole("tab", { name: "GitHub", exact: true }).click();
  await page
    .locator("#cli-github summary")
    .filter({ hasText: "审核改动" })
    .click();
  await page
    .locator("#cli-github .code-block")
    .filter({ hasText: "git diff" })
    .getByRole("button", { name: "复制内容" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "git diff",
  );
  await expect(page.locator("#cli-github")).toContainText(
    "新文件需要单独打开审阅",
  );
});

test("deployment form fits a phone and task tabs work with the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guide/cli");
  const first = page.getByRole("tab", { name: "第一次上线", exact: true });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "更新已有项目", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "生成更新任务" }).click();
  await expect(page.locator("#deployment-result-heading")).toBeInViewport();
  await expect(page.locator("#deployment-result-heading")).toBeFocused();
  await page.locator(".deployment-task-preview summary").click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "生成更新任务" }).click();
  await expect(page.locator("#deployment-result-heading")).toBeInViewport();
});
