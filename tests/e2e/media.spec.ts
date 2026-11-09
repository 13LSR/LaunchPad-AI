import { test, expect } from "@playwright/test";

test("media choices generate a targeted task, focus the result and clear stale output", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/guide/media");
  for (const id of [
    "media-integrate",
    "media-diagnosis",
    "media-format",
    "media-basics",
    "media-batch",
    "media-storage",
    "media-ai",
  ])
    await expect(page.locator(`#${id}`)).not.toHaveAttribute("open", "");
  await page.getByRole("radio", { name: /录屏 \/ 视频/ }).check();
  await expect(page.locator(".media-format-advice")).toContainText(
    "H.264 + AAC",
  );
  await expect(page.locator("#media-tools")).toContainText("HandBrake");
  await expect(page.locator(".media-tool-instructions")).toContainText(
    "导出并真机试播",
  );
  await expect(page.locator("#media-tools button")).toHaveCount(0);
  await page.locator("#media-diagnosis > summary").click();
  await page.getByLabel("现在最想解决什么？").selectOption("broken");
  await page.getByLabel("这些文件属于哪一种？").selectOption("private");
  await expect(page.locator(".media-direction")).toContainText("不要放 public");
  await expect(page.locator("#media-tools")).toContainText("HandBrake");
  await page.locator("#media-diagnosis .media-options > summary").click();
  await page.getByLabel("这个素材用在什么项目里？").selectOption("mini");
  await page
    .getByLabel("文件用在哪里？具体有什么异常？")
    .fill("付费课程视频在手机上返回 403");
  await page.getByRole("button", { name: "生成排查任务" }).click();
  await expect(page.locator("#media-result-title")).toBeFocused();
  await expect(page.locator("#media-result-title")).toBeInViewport();
  await page.getByRole("button", { name: "复制媒体排查任务" }).click();
  const task = await page.evaluate(() => navigator.clipboard.readText());
  for (const text of [
    "付费课程视频在手机上返回 403",
    "小程序",
    "签名链接期限",
    "H.264 视频 + AAC 音频",
    "不为排错顺手批量转格式",
    "不放 public",
  ])
    expect(task).toContain(text);
  await expect(page.locator(".media-result .copy-button")).toHaveAttribute(
    "aria-label",
    "已复制",
  );
  await expect(page.locator(".media-result .copy-button")).toHaveClass(
    /text-emerald-500/,
  );
  await expect(page.locator(".media-result .media-checks")).toContainText(
    "其他账号都无法读取",
  );
  await page.getByLabel("文件用在哪里？具体有什么异常？").fill("换了一份素材");
  await expect(page.locator(".media-result")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("media search deep links select the requested material and problem and reveal knowledge", async ({
  page,
}) => {
  await page.goto("/guide/media#media-kind-audio");
  await expect(page.getByRole("radio", { name: /音频 \/ 播客/ })).toBeChecked();
  await expect(page.locator("#media-kind-audio")).toBeInViewport();
  await page.getByRole("button", { name: "搜索全站", exact: true }).click();
  await page.getByRole("combobox").fill("重新部署后文件");
  await page.getByRole("option").filter({ hasText: "用户上传过" }).click();
  await expect(page.getByLabel("现在最想解决什么？")).toHaveValue("lost");
  await expect(page.locator("#media-issue-lost")).toBeInViewport();
  await page.getByLabel("这些文件属于哪一种？").selectOption("fixed");
  await expect(page.locator(".media-direction")).toContainText(
    "真的是固定素材吗",
  );
  await page.getByRole("link", { name: "看懂这些格式的区别" }).click();
  await expect(page.locator("#media-format")).toHaveAttribute("open", "");
  await expect(
    page
      .locator("#media-format")
      .getByRole("rowheader", { name: "MP4 / WebM", exact: true }),
  ).toBeVisible();
  await page.goto("/guide/media#media-tools");
  await expect(page.locator("#media-tools")).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "复制 HandBrake 官网链接" }),
  ).toHaveCount(0);
  await page
    .locator("#media-tools")
    .getByRole("link", { name: "Cloudinary 等媒体服务" })
    .click();
  await expect(page.locator("#database-17")).toBeInViewport();
});

test("media task works with keyboard on a narrow screen and knowledge tables stay contained", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/guide/media");
  const photo = page.getByRole("radio", { name: /照片 \/ 大背景/ });
  await photo.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: /带字截图/ })).toBeChecked();
  await expect(page.locator(".media-format-advice")).toContainText("无损 WebP");
  await page.locator("#media-integrate > summary").focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "复制接回项目的任务" }).click();
  const task = await page.evaluate(() => navigator.clipboard.readText());
  expect(task).toContain("带字截图");
  expect(task).toContain("不要重新压缩或转换");
  await page.getByRole("button", { name: "查看接入任务内容" }).click();
  await expect(page.locator("#media-integrate .media-task-text")).toBeVisible();
  for (const id of ["media-format", "media-storage"])
    await page.locator(`#${id} > summary`).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  const duplicates = await page.locator("[id]").evaluateAll((nodes) => {
    const ids = nodes.map((node) => node.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicates).toEqual([]);
});

test("media tools follow the material and show concrete export steps before optional AI help", async ({
  page,
}) => {
  await page.goto("/guide/media");
  await expect(
    page.getByRole("link", { name: "打开 Squoosh 官网" }),
  ).toHaveAttribute("href", "https://squoosh.app/");
  await expect(page.locator(".media-tool-instructions").first()).toContainText(
    "Compress",
  );
  for (const [kind, tool, step] of [
    ["vector", "SVGOMG", "Open SVG"],
    ["animation", "Ezgif", "Save"],
    ["video", "HandBrake", "手机上播放"],
    ["audio", "Audacity", "Export Audio"],
  ]) {
    await page.locator(`input[value="${kind}"]`).check();
    await expect(page.locator(".media-tool-list > li")).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: `打开 ${tool} 官网` }),
    ).toBeVisible();
    await expect(page.locator(".media-tool-instructions")).toContainText(step);
    await expect(
      page.getByRole("link", { name: "打开 Squoosh 官网" }),
    ).toHaveCount(0);
  }
  await expect(
    page.locator('input[type="checkbox"], input[type="file"]'),
  ).toHaveCount(0);
  await expect(page.locator("#media-integrate")).not.toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator("#media-diagnosis")).not.toHaveAttribute(
    "open",
    "",
  );
  await page.goto("/guide/media#media-integrate");
  await expect(page.locator("#media-integrate")).toHaveAttribute("open", "");
  await expect(page.locator("#media-integrate")).toBeInViewport();
});
