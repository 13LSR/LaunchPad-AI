import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
// Exercise the actual pure TypeScript modules without maintaining duplicate fixtures.
const directory = await mkdtemp(join(tmpdir(), "launchpad-unit-"));
for (const name of [
  "prompt-data",
  "command-data",
  "command-help",
  "commands",
  "local-run",
  "platforms",
  "database-tasks",
  "database-catalog",
  "platform-fit",
  "cloud-guides",
  "cloud-catalog",
  "deployment-task",
  "cli-workflows",
  "cli-command-help",
  "deployment-ranking",
  "prompt-builder",
  "guide-content",
  "project-catalog",
  "skill-catalog",
  "media-guide",
]) {
  const source = await readFile(
    new URL("../lib/" + name + ".ts", import.meta.url),
    "utf8",
  );
  await writeFile(
    join(directory, name + ".cjs"),
    ts
      .transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
      })
      .outputText.replace(
        /require\("\.\/(.*?)"\)/g,
        (_, name) =>
          'require("./' + name + (name.endsWith(".json") ? "" : ".cjs") + '")',
      ),
  );
}
for (const name of [
  "platform-reviews.json",
  "database-guides.json",
  "project-guides.json",
  "skill-guides.json",
]) {
  await writeFile(
    join(directory, name),
    await readFile(new URL("../lib/" + name, import.meta.url)),
  );
}
const require = createRequire(join(directory, "entry.cjs"));
const { promptTemplates, deploymentProfiles } = require("./prompt-data.cjs");
const { commandEntries } = require("./command-data.cjs");
const { explainCommand } = require("./command-help.cjs");
const { adaptCommands } = require("./commands.cjs");
const {
  runCommands,
  identifyLocalFiles,
  buildLocalTroubleshooting,
  buildLocalInspection,
  usesPackageManager,
} = require("./local-run.cjs");
const {
  platforms,
  databases,
  availablePlatforms,
  withdrawnPlatforms,
} = require("./platforms.cjs");
const {
  getDeploymentRanking,
  getRecommendedPlatform,
  tiers,
} = require("./deployment-ranking.cjs");
const { buildProjectPrompt } = require("./prompt-builder.cjs");
const { guideContent } = require("./guide-content.cjs");
const {
  skills,
  orderedSkills,
  filterSkills,
  buildInstallTask,
  buildSkillTrial,
  defaultInstallPreferences,
} = require("./skill-catalog.cjs");
const {
  projects,
  orderedProjects,
  filterProjects,
  buildAdaptationPrompt,
} = require("./project-catalog.cjs");
after(() => rm(directory, { recursive: true, force: true }));
const {
  mediaKinds,
  mediaIssues,
  mediaStorage,
  mediaEnvironments,
  defaultMediaContext,
  getMediaAdvice,
  buildMediaTask,
  buildMediaIntegrationTask,
} = require("./media-guide.cjs");

test("media integration uses prepared files while diagnosis does not assume prior conversion", () => {
  const integration = buildMediaIntegrationTask("animation");
  assert.match(integration, /不要重新压缩或转换/);
  assert.match(integration, /更新组件、样式、封面和相关引用/);
  assert.match(integration, /私密文件不能放 public/);
  const diagnosis = buildMediaTask({ ...defaultMediaContext, issue: "broken" });
  assert.match(diagnosis, /不要假定我已经压缩/);
  assert.ok(!diagnosis.includes("我已在外部工具里准备好"));
});

test("media tasks preserve the qualities that distinguish each asset type", () => {
  const expectations = {
    photo: /肤色、渐变和暗部/,
    screenshot: /PNG 与无损 WebP/,
    transparent: /透明通道/,
    vector: /不直接执行其中脚本/,
    animation: /不要把动画转成单帧/,
    video: /H\.264 视频 \+ AAC 音频/,
    audio: /不自动有声播放/,
    mixed: /不要统一转为 WebP/,
  };
  for (const kind of mediaKinds) {
    const task = buildMediaTask({ ...defaultMediaContext, kind: kind.id });
    assert.match(task, expectations[kind.id], kind.id);
    assert.match(task, /不覆盖原始目录/);
    assert.match(task, /不能假装已经读取/);
  }
});

test("media diagnosis prioritizes evidence and keeps private files protected", () => {
  const broken = buildMediaTask({
    ...defaultMediaContext,
    issue: "broken",
    storage: "private",
    detail: "订单附件返回 403",
  });
  for (const expected of [
    "订单附件返回 403",
    "路径大小写",
    "签名链接期限",
    "不放 public",
    "其他账号不能访问",
    "不为排错顺手批量转格式",
  ])
    assert.ok(broken.includes(expected), expected);
  assert.ok(!broken.includes("再批量替换"));
  const context = { ...defaultMediaContext, issue: "lost", storage: "fixed" };
  assert.match(getMediaAdvice(context).storage.advice, /你选了固定素材/);
  assert.match(buildMediaTask(context), /不能承诺恢复已丢失的数据/);
  assert.match(buildMediaTask(context), /实际属于用户上传时不要放 public/);
  assert.match(
    buildMediaTask({ ...defaultMediaContext, issue: "loading" }),
    /不把所有素材都预加载或都懒加载/,
  );
  assert.match(
    buildMediaTask({ ...defaultMediaContext, issue: "quality" }),
    /不声称把模糊文件转成无损就能恢复细节/,
  );
});

test("media environments avoid assuming browser or server image features", () => {
  const next = buildMediaTask({ ...defaultMediaContext, environment: "next" });
  assert.match(next, /静态导出不能依赖默认服务端图片优化/);
  const mini = buildMediaTask({ ...defaultMediaContext, environment: "mini" });
  assert.match(mini, /开发工具与真机验证/);
  assert.match(mini, /不要套用浏览器专用/);
  const staticTask = buildMediaTask({
    ...defaultMediaContext,
    environment: "static",
  });
  assert.match(staticTask, /静态站没有自动运行的图片处理后端/);
  assert.ok(!mini.includes("配置 remotePatterns"));
});

test("media combinations produce usable tasks and storage links resolve to real services", () => {
  for (const kind of mediaKinds)
    for (const issue of mediaIssues)
      for (const storage of mediaStorage)
        for (const environment of mediaEnvironments) {
          const task = buildMediaTask({
            kind: kind.id,
            issue: issue.id,
            storage: storage.id,
            environment: environment.id,
            detail: "",
          });
          assert.ok(!/undefined|\[object Object\]/.test(task));
          assert.ok(task.includes(kind.label) && task.includes(issue.label));
        }
  for (const storage of mediaStorage) {
    if (storage.href.includes("#"))
      assert.ok(
        databases.some(
          (database) => database.id === storage.href.split("#")[1],
        ),
      );
  }
  assert.ok(
    !buildMediaTask({
      ...defaultMediaContext,
      detail: "x".repeat(1300),
    }).includes("x".repeat(1201)),
  );
});
const scenario = (id) => promptTemplates.find((t) => t.id === id);
const answers = (template, extra = {}) => ({
  name: "",
  purpose: "",
  audience: "",
  requirements: "",
  use: template.defaultUse,
  platformId: "recommended",
  features: template.features,
  ...extra,
});

test("project recommendations preserve existing links and resolve related guides", () => {
  assert.equal(projects.length, 31);
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  assert.equal(new Set(orderedProjects.map((p) => p.id)).size, projects.length);
  const existingNames = [
    "LobeHub",
    "NextChat",
    "Dify",
    "FastGPT",
    "GPT Academic",
    "NotionNext",
    "Tailwind Nextjs Starter Blog",
    "Blinko",
    "Memos",
    "Next.js SaaS Starter",
    "Open SaaS",
    "WebStack",
    "Reactive Resume",
    "IT-Tools",
    "Excalidraw",
    "Sink",
    "Umami",
    "Uptime Kuma",
  ];
  for (const [index, name] of existingNames.entries()) {
    assert.equal(
      projects.find((p) => p.id === "projects-resource-" + index)?.name,
      name,
    );
  }
  for (const p of projects) {
    assert.ok(
      commandEntries.some((e) => e.id === p.localId),
      p.name,
    );
    if (p.scenarioId)
      assert.ok(
        promptTemplates.some((e) => e.id === p.scenarioId),
        p.name,
      );
    for (const id of p.cloudIds)
      assert.ok(
        availablePlatforms.some((e) => e.id === id),
        p.name + " " + id,
      );
    for (const key of [
      "deployment",
      "dataNeeds",
      "cost",
      "adaptation",
      "acceptance",
    ])
      assert.ok(p[key]?.length > 12, p.name + " " + key);
    for (const key of ["repoUrl", "docs", "licenseUrl"])
      assert.equal(new URL(p[key]).protocol, "https:");
  }
});

test("extension catalog keeps deep links and connects to actual product guides", () => {
  assert.equal(skills.length, 18);
  assert.equal(new Set(orderedSkills.map((s) => s.id)).size, skills.length);
  const original = [
    "UI/UX Pro Max",
    "Anthropic Frontend Design",
    "21st MCP",
    "shadcn/ui",
    "Context7",
    "Firecrawl",
    "Supabase MCP",
    "Stripe 官方扩展",
    "Playwright MCP",
    "Anthropic Document Skills",
    "Sequential Thinking",
    "Superpowers",
    "BMAD Method",
    "Awesome Cursor Rules",
  ];
  for (const [index, name] of original.entries())
    assert.equal(
      skills.find((s) => s.id === "skills-resource-" + index)?.name,
      name,
    );
  for (const skill of skills) {
    for (const link of skill.related) {
      const [route, anchor] = link.href.split("#");
      assert.ok(guideContent[route.split("/").at(-1)], link.href);
      if (anchor)
        assert.ok(
          [...commandEntries, ...promptTemplates, ...availablePlatforms].some(
            (entry) => entry.id === anchor,
          ),
          link.href,
        );
    }
    assert.equal(new URL(skill.docs).protocol, "https:");
    const install = buildInstallTask(skill);
    const trial = buildSkillTrial(skill);
    for (const field of [
      "name",
      "docs",
      "setup",
      "access",
      "compatibility",
      "cost",
      "verification",
    ])
      assert.ok(install.includes(skill[field]), skill.name + " " + field);
    assert.ok(trial.includes(skill.example), skill.name);
    assert.ok(trial.includes(skill.verification), skill.name);
    assert.ok(!/undefined|\[object Object\]/.test(install + trial));
  }
});

test("extension search recognizes old names and respects purpose and type filters", () => {
  assert.deepEqual(
    filterSkills("Magic MCP", "全部", "all").map((s) => s.name),
    ["21st MCP"],
  );
  assert.deepEqual(
    filterSkills("Stripe AI", "全部", "all").map((s) => s.name),
    ["Stripe 官方扩展"],
  );
  assert.ok(
    filterSkills("Word", "测试与办公", "Skill").some(
      (s) => s.name === "Anthropic Document Skills",
    ),
  );
  assert.equal(filterSkills("Word", "测试与办公", "CLI").length, 0);
  assert.equal(filterSkills("zz没有这个扩展", "全部", "all").length, 0);
  assert.equal(filterSkills("   ", "全部", "all").length, skills.length);
});

test("installation tasks respect the selected tool, system and scope without assuming local access", () => {
  const skill = skills.find((s) => s.name === "Context7");
  const custom = buildInstallTask(skill, {
    agent: "other",
    customAgent: "Windsurf",
    system: "windows",
    scope: "global",
  });
  assert.ok(custom.includes("Agent 名称：Windsurf"));
  assert.ok(custom.includes("电脑系统：Windows"));
  assert.ok(custom.includes("安装范围：我的所有项目"));
  const selected = buildInstallTask(skill, {
    agent: "codex",
    customAgent: "不应使用的旧名称",
    system: "macos",
    scope: "project",
  });
  assert.ok(selected.includes("Agent 名称：Codex"));
  assert.ok(!selected.includes("不应使用的旧名称"));
  assert.ok(selected.includes("不要自动改成全局"));
  const browser = buildInstallTask(skill, {
    ...defaultInstallPreferences,
    agent: "web",
  });
  assert.ok(browser.includes("不要假定网页能读写本地项目或运行终端"));
  assert.ok(
    buildInstallTask(skill).includes("先向我确认正在使用的 AI 工具与版本"),
  );
});

test("project filtering matches everyday purposes and respects combined filters", () => {
  assert.ok(
    filterProjects("食谱", "全部", "all").some((p) => p.name === "Mealie"),
  );
  assert.deepEqual(
    filterProjects("AStrO WIND", "网站与博客", "easy").map((p) => p.name),
    ["AstroWind"],
  );
  assert.equal(filterProjects("食谱", "全部", "easy").length, 0);
  assert.equal(filterProjects("不存在的项目XYZ", "全部", "all").length, 0);
  assert.equal(filterProjects("  ", "全部", "all").length, projects.length);
});

test("adaptation prompts carry project requirements and replace example goals", () => {
  for (const p of projects) {
    const prompt = buildAdaptationPrompt(p);
    for (const field of [
      "repoUrl",
      "docs",
      "dataNeeds",
      "cost",
      "adaptation",
      "acceptance",
    ])
      assert.ok(prompt.includes(p[field]), p.name + " " + field);
    assert.ok(!/undefined|\[object Object\]/.test(prompt));
    const custom = buildAdaptationPrompt(p, "  我想做宠物资料站  ");
    assert.ok(custom.includes("我的目标：我想做宠物资料站"));
    assert.ok(!custom.includes("我的目标：" + p.adaptation));
  }
  assert.ok(
    buildAdaptationPrompt(
      projects.find((p) => p.name === "Starlight"),
    ).includes("不要直接把框架仓库"),
  );
  assert.ok(
    buildAdaptationPrompt(
      projects.find((p) => p.name === "Actual Budget"),
    ).includes("官方现成版本"),
  );
});

test("all scenarios and technical guides resolve to real local and cloud content", () => {
  assert.equal(promptTemplates.length, 42);
  assert.equal(commandEntries.length, 35);
  assert.equal(platforms.length, 22);
  for (const list of [promptTemplates, commandEntries, platforms])
    assert.equal(new Set(list.map((x) => x.id)).size, list.length);
  for (const t of promptTemplates) {
    assert.ok(
      commandEntries.some((e) => e.id === t.localId),
      t.id,
    );
    assert.ok(deploymentProfiles[t.profile], t.id);
    for (const a of t.acceptance)
      assert.ok(!a.whenFeature || t.features.includes(a.whenFeature), t.id);
    const prompt = buildProjectPrompt(t, answers(t));
    assert.ok(prompt.includes(t.title));
    assert.ok(
      !prompt.includes(t.placeholder),
      t.id + " injected a placeholder",
    );
    assert.ok(!/undefined|\[object Object\]/.test(prompt), t.id);
  }
});
test("portfolio and product landing page produce separate scopes", () => {
  const portfolio = scenario("prompts-3"),
    product = scenario("scenario-product-landing");
  const first = buildProjectPrompt(portfolio, answers(portfolio));
  const second = buildProjectPrompt(product, answers(product));
  assert.ok(first.includes("作品列表与独立案例页"));
  assert.ok(!first.includes("一个明确的转化入口"));
  assert.ok(second.includes("一个明确的转化入口"));
  assert.ok(!second.includes("作品列表与独立案例页"));
});
test("deselected features do not return through acceptance requirements", () => {
  const t = scenario("prompts-3");
  const prompt = buildProjectPrompt(
    t,
    answers(t, { features: [t.features[2]], purpose: "联系我的设计工作室" }),
  );
  assert.ok(prompt.includes("联系方式与社交链接"));
  assert.ok(!prompt.includes("作品列表与独立案例页"));
  assert.ok(!prompt.includes("项目卡片进入对应案例"));
  assert.ok(prompt.includes("联系我的设计工作室"));
});
test("mini programs and offline scripts get the correct delivery route", () => {
  const wechat = scenario("scenario-wechat");
  const p = buildProjectPrompt(wechat, answers(wechat));
  assert.ok(p.includes("微信开发者工具预览、上传并提交审核"));
  assert.ok(p.includes("以下是可选后端方案"));
  assert.ok(!commandEntries.find((e) => e.id === wechat.localId).commands);
  assert.ok(
    commandEntries.find((e) => e.id === wechat.localId).guiSteps.length >= 2,
  );
  const local = scenario("scenario-files");
  const offlinePrompt = buildProjectPrompt(local, answers(local));
  assert.ok(offlinePrompt.includes("不自动创建云资源"));
  assert.ok(!offlinePrompt.includes("套餐参考："));
  assert.ok(!offlinePrompt.includes("优先评估的部署平台："));
});
test("commercial recommendations cannot present Hobby as a commercial plan", () => {
  const t = scenario("prompts-18");
  assert.equal(t.defaultUse, "commercial");
  assert.equal(
    getRecommendedPlatform("next", "personal").platformId,
    "cloud-0",
  );
  assert.equal(
    getRecommendedPlatform("next", "commercial").platformId,
    "cloud-1",
  );
  const p = buildProjectPrompt(t, answers(t, { platformId: "cloud-0" }));
  assert.ok(p.includes("不能选择 Hobby"));
  assert.ok(p.includes("付费方案"));
});
test("rankings resolve, explain tradeoffs, and reject technical nonfits", () => {
  for (const profile of Object.keys(deploymentProfiles))
    for (const use of ["personal", "commercial"]) {
      const rows = getDeploymentRanking(profile, use);
      assert.equal(new Set(rows.map((r) => r.platformId)).size, rows.length);
      assert.ok(
        rows.some((r) => r.compatible),
        profile,
      );
      for (const row of rows) {
        assert.ok(
          platforms.some((p) => p.id === row.platformId),
          row.platformId,
        );
        assert.ok(tiers.includes(row.tier));
        assert.ok(
          row.reason.trim().length > 0 && row.tradeoff.trim().length > 0,
          profile,
        );
      }
    }
  const t = scenario("scenario-realtime");
  const p = buildProjectPrompt(t, answers(t, { platformId: "cloud-0" }));
  assert.ok(p.includes("优先评估的部署平台：Railway"));
  assert.ok(!p.includes("选择：Vercel"));
});
test("mini program prompts carry actual shared CloudBase allowance and expiry", () => {
  const t = scenario("scenario-wechat");
  const p = buildProjectPrompt(t, answers(t));
  assert.ok(p.includes("3,000 资源点"));
  assert.ok(p.includes("15 天到期"));
  assert.ok(
    p.includes("https://cloud.tencent.com/document/product/876/127357"),
  );
  assert.ok(!/当前套餐待复核|本站于/.test(p));
});
test("every shown command has specific purpose, timing and success guidance", () => {
  const codes = commandEntries.flatMap((e) => [
    e.commands,
    ...(e.variants || []).map((v) => v.code),
  ]);
  codes.push(
    ...[...guideContent.local.before, ...guideContent.local.after].flatMap(
      (s) => (s.codes || []).map((c) => c.code),
    ),
  );
  codes.push(
    "python -m venv .venv",
    "python3 -m venv .venv",
    ".\\.venv\\Scripts\\Activate.ps1",
    "source .venv/bin/activate",
  );
  for (const code of codes)
    for (const manager of ["npm", "pnpm", "yarn", "bun"])
      for (const os of ["Windows", "macOS / Linux"]) {
        for (const line of adaptCommands(code, manager, os)
          .split(/\r?\n/)
          .filter((l) => l.trim() && !l.startsWith("#"))) {
          const help = explainCommand(line);
          assert.notEqual(help.title, "执行项目指定命令", line);
          assert.ok(
            help.purpose.length > 15 &&
              help.when.length > 10 &&
              help.success.length > 10,
            line,
          );
        }
      }
});
test("technical guides carry usable examples and distinct failure diagnoses", () => {
  for (const entry of commandEntries) {
    assert.ok(entry.useCases.length >= 2, entry.id);
    assert.ok(
      entry.prerequisite.length > 10 && entry.docsUrl.startsWith("https://"),
      entry.id,
    );
    assert.ok(entry.issues.length >= 2, entry.id);
    for (const issue of entry.issues)
      assert.ok(
        issue.symptom && issue.cause && issue.fix.length > 15,
        entry.id,
      );
    assert.ok(
      !JSON.stringify(entry.issues).includes(
        "记录你执行的命令与完整报错，再让 AI",
      ),
    );
  }
  const next = commandEntries.find((e) => e.id === "local-6");
  const streamlit = commandEntries.find((e) => e.id === "local-22");
  assert.notDeepEqual(next.issues, streamlit.issues);
});

const { platformFits } = require("./platform-fit.cjs");
const { buildDeploymentTask } = require("./deployment-task.cjs");
test("withdrawn platforms never become deploy recommendations", () => {
  assert.equal(availablePlatforms.length, 20);
  assert.deepEqual(withdrawnPlatforms.map((p) => p.id).sort(), [
    "cloud-13",
    "cloud-19",
  ]);
  assert.equal(
    platforms.find((p) => p.id === "cloud-13").availability,
    "retiring",
  );
  assert.match(
    platforms.find((p) => p.id === "cloud-13").availabilityNote,
    /2026-12-31/,
  );
  for (const profile of Object.keys(deploymentProfiles))
    for (const use of ["personal", "commercial"]) {
      const choices = getDeploymentRanking(profile, use);
      assert.ok(
        choices.every((c) =>
          availablePlatforms.some((p) => p.id === c.platformId),
        ),
      );
    }
});
test("every available platform explains use cases and links to real technical guides", () => {
  for (const p of availablePlatforms) {
    const fit = platformFits[p.id];
    assert.ok(fit?.useCases.length, p.id);
    for (const id of fit.localIds)
      assert.ok(
        commandEntries.some((e) => e.id === id),
        id,
      );
    for (const profile of fit.profiles)
      assert.ok(
        getDeploymentRanking(profile, "personal").some(
          (c) => c.platformId === p.id,
        ),
        p.id,
      );
    assert.ok(fit.profiles.length || fit.reason.includes("Flask"));
  }
  for (const e of commandEntries)
    for (const id of e.relatedLocalIds || [])
      assert.ok(
        commandEntries.some((c) => c.id === id),
        id,
      );
  assert.ok(
    getDeploymentRanking("static", "personal").some(
      (c) => c.platformId === "cloud-17",
    ),
  );
  assert.ok(
    getDeploymentRanking("next", "commercial").some(
      (c) => c.platformId === "cloud-18",
    ),
  );
  assert.ok(
    getDeploymentRanking("container", "personal").some(
      (c) => c.platformId === "cloud-20",
    ),
  );
});
test("local route prepares data before website deployment", () => {
  assert.equal(guideContent.local.next.slug, "databases");
  assert.equal(guideContent.databases.next.slug, "cloud");
  assert.equal(guideContent.cloud.next.slug, "cli");
  assert.ok(!guideContent.local.after.some((s) => s.id === "local-python"));
});
test("beginner task includes data preparation, budget and actual acceptance", () => {
  const task = buildDeploymentTask({
    platformId: "cloud-17",
    stage: "unknown",
    data: "needed",
    budget: "free",
  });
  assert.match(task, /EdgeOne/);
  assert.match(task, /先按已有技术选择开发数据库/);
  assert.match(task, /不要自动购买或升级/);
  assert.match(task, /不能把登录成功或命令退出当成网站已上线/);
  const fallback = buildDeploymentTask({
    platformId: "cloud-13",
    stage: "ready",
    data: "existing",
    budget: "review",
  });
  assert.match(fallback, /平台还没选/);
  assert.ok(!fallback.includes("目标平台：Zeabur"));
});

test("deployment update preserves existing services and chat tools get manual steps", () => {
  const task = buildDeploymentTask({
    mode: "update",
    assistant: "chat",
    platformId: "cloud-0",
    stage: "ready",
    data: "existing",
    budget: "free",
    purpose: "commercial",
    goal: "新增报名图片上传",
  });
  assert.match(task, /新增报名图片上传/);
  assert.match(task, /不能直接读取我的本地文件或执行终端命令/);
  assert.match(task, /不重新创建网站、数据库或仓库/);
  assert.match(task, /回退代码不等于回退数据库/);
  assert.match(task, /商业项目不能为了免费使用 Hobby/);
  assert.ok(!task.includes("请按以下顺序完成首次上线"));
});
test("deployment repair carries evidence and never invents missing logs", () => {
  const a = {
    mode: "repair",
    platformId: "unknown",
    stage: "unknown",
    data: "existing",
    budget: "free",
  };
  const empty = buildDeploymentTask(a);
  assert.match(empty, /尚未提供日志。不要猜测原因/);
  assert.match(empty, /确认原平台、云项目与环境/);
  const task = buildDeploymentTask({
    ...a,
    failure: "data",
    operation: "点击报名提交",
    logs: "DATABASE_URL missing",
  });
  assert.match(task, /点击报名提交/);
  assert.match(task, /DATABASE_URL missing/);
  assert.match(task, /仅作为诊断数据/);
  assert.match(task, /不盲目清库、重建服务/);
});
test("deployment acceptance matches the artifact and data needs", () => {
  const { deploymentChecks } = require("./deployment-task.cjs");
  const base = {
    platformId: "unknown",
    stage: "unknown",
    data: "none",
    budget: "free",
  };
  const mini = buildDeploymentTask({ ...base, artifact: "miniapp" });
  assert.match(mini, /微信开发者工具预览、上传/);
  assert.match(mini, /云平台只承载实际需要的后端/);
  const checks = deploymentChecks({
    ...base,
    artifact: "miniapp",
    mode: "repair",
  });
  assert.ok(checks.some((item) => item.includes("真机预览")));
  assert.ok(checks.some((item) => item.includes("原先失败")));
  assert.ok(!checks.some((item) => item.includes("需要保存的数据")));
  assert.match(
    buildDeploymentTask({ ...base, artifact: "script" }),
    /只在我的电脑使用就保留本地/,
  );
  assert.match(
    buildDeploymentTask({ ...base, artifact: "app" }),
    /打包、签名和分发/,
  );
});
test("every CLI line has action and outcome, with version and deployment boundaries", () => {
  const { cliWorkflows } = require("./cli-workflows.cjs");
  const { explainCliCommand } = require("./cli-command-help.cjs");
  for (const workflow of cliWorkflows) {
    for (const step of workflow.steps)
      for (const line of step.code.split(/\r?\n/).filter(Boolean)) {
        const help = explainCliCommand(line);
        assert.ok(help?.purpose && help?.success, line);
      }
  }
  const vercel = cliWorkflows.find((item) => item.id === "cli-vercel");
  assert.ok(
    vercel.steps.some((step) => step.code.includes("--environment preview")),
  );
  assert.match(
    explainCliCommand("hf auth whoami").success,
    /不能证明 Space 已运行/,
  );
  assert.match(
    cliWorkflows.find((item) => item.id === "cli-prisma").intro,
    /Prisma ORM 7/,
  );
  assert.match(
    cliWorkflows.find((item) => item.id === "cli-github").intro,
    /不会直接开通网站/,
  );
});

const {
  buildDatabaseSetupTask,
  databaseTroubleshootingTask,
} = require("./database-tasks.cjs");
test("database suggestions link to real scenarios and copy the matching connection task", () => {
  assert.equal(databases.length, 20);
  for (const p of databases) {
    assert.ok(p.useCases.length >= 2, p.id);
    assert.ok(!/待复核|待核验|待确认/.test(p.allowance + p.limit), p.id);
    for (const id of p.scenarioIds)
      assert.ok(
        promptTemplates.some((t) => t.id === id),
        id,
      );
    for (const id of p.cloudIds)
      assert.ok(
        availablePlatforms.some((c) => c.id === id),
        id,
      );
    const task = buildDatabaseSetupTask(p);
    assert.ok(
      task.includes(p.name) &&
        task.includes(p.source) &&
        task.includes(p.setupHint),
      p.id,
    );
    assert.ok(!/undefined|\[object Object\]/.test(task));
  }
  assert.match(buildDatabaseSetupTask(), /不是|不要假定所有服务/);
  assert.match(databaseTroubleshootingTask, /错误证据/);
  assert.match(databases[19].limit, /15 天/);
  assert.match(platforms.find((p) => p.id === "cloud-21").limit, /15 天/);
});

const localEntry = (id) => commandEntries.find((entry) => entry.id === id);
const runOptions = {
  manager: "npm",
  os: "Windows",
  stage: "first",
  pythonTool: "pip",
};

test("local first and repeat commands keep the right preparation for each environment", () => {
  const next = localEntry("local-6");
  assert.equal(runCommands(next, runOptions), "npm install\nnpm run dev");
  assert.equal(
    runCommands(next, { ...runOptions, manager: "pnpm", stage: "again" }),
    "pnpm dev",
  );
  const streamlit = localEntry("local-22");
  assert.deepEqual(runCommands(streamlit, runOptions).split("\n"), [
    "python -m venv .venv",
    ".\\.venv\\Scripts\\Activate.ps1",
    "python -m pip install -r requirements.txt",
    "python -m streamlit run app.py",
  ]);
  assert.deepEqual(
    runCommands(streamlit, { ...runOptions, stage: "again" }).split("\n"),
    [".\\.venv\\Scripts\\Activate.ps1", "python -m streamlit run app.py"],
  );
  assert.ok(
    runCommands(streamlit, { ...runOptions, os: "macOS / Linux" }).startsWith(
      "python3 -m venv .venv\nsource .venv/bin/activate",
    ),
  );
  for (const [tool, install] of [
    ["uv", "uv sync"],
    ["poetry", "poetry install"],
  ]) {
    assert.equal(
      runCommands(streamlit, { ...runOptions, pythonTool: tool }),
      install + "\n" + tool + " run python -m streamlit run app.py",
    );
    assert.equal(
      runCommands(streamlit, {
        ...runOptions,
        pythonTool: tool,
        stage: "again",
      }),
      tool + " run python -m streamlit run app.py",
    );
  }
  assert.equal(
    runCommands(localEntry("local-42"), { ...runOptions, stage: "again" }),
    "docker compose up",
  );
  assert.ok(
    !runCommands(localEntry("local-42"), {
      ...runOptions,
      stage: "again",
      variant: "只有 Dockerfile",
    }).includes("docker build"),
  );
  assert.equal(
    runCommands(localEntry("local-32"), {
      ...runOptions,
      variant: "Gradle（build.gradle）",
    }),
    ".\\gradlew.bat bootRun",
  );
  assert.equal(
    runCommands(localEntry("local-16"), {
      ...runOptions,
      os: "macOS / Linux",
      variant: "Python 已安装",
    }),
    "python3 -m http.server 8000",
  );
  for (const id of ["local-wechat", "local-cloudbase", "local-extension"]) {
    assert.equal(runCommands(localEntry(id), runOptions), "");
    assert.equal(usesPackageManager(localEntry(id)), false);
  }
});

test("file clues narrow choices without inventing a framework or resolving conflicting locks", () => {
  const next = identifyLocalFiles(
    "D:\\My Project\\next.config.ts、pnpm-lock.yaml",
  );
  assert.deepEqual(
    next.candidates.map((entry) => entry.id),
    ["local-6"],
  );
  assert.deepEqual(next.managers, ["pnpm"]);
  const conflict = identifyLocalFiles(
    "next.config.ts package-lock.json yarn.lock",
  );
  assert.deepEqual(conflict.managers, ["npm", "yarn"]);
  const generic = identifyLocalFiles("package.json");
  assert.equal(generic.exact, false);
  assert.ok(generic.candidates.length > 1);
  const python = identifyLocalFiles("app.py requirements.txt");
  assert.equal(python.exact, false);
  assert.ok(python.candidates.length > 1);
  assert.deepEqual(identifyLocalFiles("uv.lock").pythonTools, ["uv"]);
  assert.deepEqual(
    identifyLocalFiles("poetry.lock requirements.txt").pythonTools,
    ["pip", "poetry"],
  );
  assert.equal(identifyLocalFiles("manifest.json").candidates.length, 0);
  assert.equal(identifyLocalFiles("unknown-file").candidates.length, 0);
  const multi = identifyLocalFiles(
    "web/next.config.ts api/manage.py compose.yaml",
  );
  assert.deepEqual(
    multi.candidates.map((entry) => entry.id),
    ["local-6", "local-21", "local-42"],
  );
  for (const sample of [
    "project.config.json",
    "pom.xml",
    "tauri.conf.json",
    "pages.json",
    "cloudfunctions",
    "go.mod",
    "pubspec.yaml",
  ])
    assert.ok(identifyLocalFiles(sample).candidates.length > 0, sample);
});

test("all generated local commands have specific single-line explanations", () => {
  for (const entry of commandEntries)
    for (const variant of entry.variants?.map((item) => item.name) || [
      undefined,
    ])
      for (const manager of ["npm", "pnpm", "yarn", "bun"])
        for (const os of ["Windows", "macOS / Linux"])
          for (const stage of ["first", "again"])
            for (const pythonTool of ["pip", "uv", "poetry"])
              for (const command of runCommands(entry, {
                manager,
                os,
                stage,
                pythonTool,
                variant,
              })
                .split("\n")
                .filter(Boolean)) {
                const help = explainCommand(command);
                assert.notEqual(
                  help.title,
                  "执行项目指定命令",
                  entry.id + ": " + command,
                );
                assert.ok(
                  help.purpose.length > 15 &&
                    help.when.length > 10 &&
                    help.success.length > 10,
                  command,
                );
              }
});

test("local AI tasks carry actual context, selected symptom and unprovided-input boundaries", () => {
  const entry = localEntry("local-22");
  const options = {
    ...runOptions,
    stage: "again",
    pythonTool: "uv",
    os: "macOS / Linux",
  };
  const issue = entry.issues[0];
  const prompt = buildLocalTroubleshooting(
    entry,
    options,
    issue.symptom,
    "uv run python -m streamlit run report.py",
    "ModuleNotFoundError: pandas",
  );
  for (const text of [
    entry.title,
    "macOS / Linux",
    "已经准备过",
    "依赖方式：uv",
    issue.cause,
    issue.fix,
    "report.py",
    "ModuleNotFoundError: pandas",
    "不代表我已执行",
  ])
    assert.ok(prompt.includes(text), text);
  assert.ok(!prompt.includes(entry.issues[1].fix));
  assert.ok(!prompt.includes("选择的包管理器"));
  assert.ok(
    buildLocalTroubleshooting(entry, options).includes(
      "尚未提供，请先向我索取必要日志",
    ),
  );
  const inspect = buildLocalInspection(entry, options, "uv.lock");
  for (const text of [
    "uv.lock",
    "先只检查",
    "RUN_LOCAL.md",
    "前端、后端、数据库",
    "不读取或输出真实密钥",
  ])
    assert.ok(inspect.includes(text), text);
});

const {
  databaseFits,
  orderedDatabases,
  filterDatabases,
  getDatabaseAdvice,
  buildDatabaseInspection,
} = require("./database-catalog.cjs");
const {
  buildDatabaseDiagnostic,
  defaultDatabaseContext,
} = require("./database-tasks.cjs");
test("database candidates preserve existing engines and separate files, cache and semantic search", () => {
  assert.equal(getDatabaseAdvice("records", "unknown").groups.length, 0);
  assert.equal(getDatabaseAdvice("none", "new").groups.length, 0);
  assert.deepEqual(getDatabaseAdvice("records", "mysql").groups[0].ids, [
    "database-4",
  ]);
  assert.deepEqual(getDatabaseAdvice("records", "mongodb").groups[0].ids, [
    "database-7",
  ]);
  assert.deepEqual(getDatabaseAdvice("records", "firestore").groups[0].ids, [
    "database-8",
  ]);
  const both = getDatabaseAdvice("both", "postgres");
  assert.equal(both.groups.length, 2);
  assert.ok(
    both.groups[0].ids.every((id) =>
      databaseFits[id].engines.includes("postgres"),
    ),
  );
  assert.ok(
    both.groups[1].ids.every((id) => databaseFits[id].roles.includes("files")),
  );
  assert.deepEqual(getDatabaseAdvice("wechat", "new").groups[0].ids, [
    "database-19",
  ]);
  assert.ok(
    !getDatabaseAdvice("cache", "new").groups[0].ids.includes("database-10"),
  );
  assert.match(
    getDatabaseAdvice("vector", "postgres").groups[0].reason,
    /pgvector/,
  );
  for (const purpose of [
    "records",
    "accounts",
    "both",
    "wechat",
    "files",
    "vector",
    "cache",
  ])
    for (const existing of [
      "new",
      "postgres",
      "mysql",
      "sqlite",
      "mongodb",
      "firestore",
      "cloudbase",
      "unknown",
    ])
      for (const group of getDatabaseAdvice(purpose, existing).groups)
        for (const id of group.ids)
          assert.ok(
            databases.some((item) => item.id === id),
            id,
          );
});
test("database search and purpose filters include multi-purpose services without duplicating records", () => {
  assert.equal(orderedDatabases.length, 20);
  assert.equal(new Set(orderedDatabases.map((item) => item.id)).size, 20);
  for (const service of databases) {
    assert.ok(databaseFits[service.id].connection.length > 10);
    assert.ok(databaseFits[service.id].boundary.length > 15);
  }
  assert.ok(
    filterDatabases("", "files", false).some(
      (item) => item.name === "Supabase",
    ),
  );
  assert.ok(
    filterDatabases("", "files", false).some(
      (item) => item.id === "database-19",
    ),
  );
  assert.equal(filterDatabases("", "wechat", true).length, 0);
  assert.equal(filterDatabases("", "all", true).length, 19);
  assert.deepEqual(
    filterDatabases("Cloudflare D1", "records", false).map((item) => item.id),
    ["database-2"],
  );
  assert.equal(filterDatabases("报名", "vector", false).length, 0);
  assert.equal(filterDatabases("not-a-service", "all", false).length, 0);
  assert.deepEqual(
    filterDatabases("", "all", false, ["database-0", "database-15"]).map(
      (item) => item.id,
    ),
    ["database-0", "database-15"],
  );
  assert.match(buildDatabaseInspection("both", "mysql"), /MySQL/);
  assert.match(buildDatabaseInspection("both", "mysql"), /只读检查/);
});
test("database setup and diagnosis carry selected service, environment and actual evidence", () => {
  const context = {
    ...defaultDatabaseContext,
    purpose: "both",
    existing: "sqlite",
    deploymentId: "cloud-1",
    stage: "online",
  };
  const service = databases.find((item) => item.id === "database-2");
  const setup = buildDatabaseSetupTask(service, context);
  for (const text of [
    "Cloudflare D1",
    "Cloudflare Workers",
    "SQLite",
    "网站已部署",
    "数据库绑定",
    service.allowance,
    "停止接入，不自动迁移",
  ])
    assert.ok(setup.includes(text), text);
  assert.ok(
    buildDatabaseSetupTask(service, { ...context, stage: "local" }).includes(
      "本次只验证开发环境",
    ),
  );
  const diagnostic = buildDatabaseDiagnostic(
    context,
    service,
    "save",
    "提交活动报名",
    "D1_ERROR: no such table: registrations",
  );
  for (const text of [
    "提交活动报名",
    "no such table",
    "Cloudflare Workers",
    "表或集合",
    "修复后实际执行",
  ])
    assert.ok(diagnostic.includes(text), text);
  assert.ok(!/undefined|\[object Object\]/.test(setup + diagnostic));
  const empty = buildDatabaseDiagnostic(
    defaultDatabaseContext,
    undefined,
    "unknown",
    "",
    "",
  );
  assert.ok(empty.includes("尚未提供，请先引导我找到必要日志"));
  assert.ok(!empty.includes("我的项目在电脑上能连接"));
  assert.ok(empty.includes("不自动假定是 Vercel"));
});

const {
  cloudCandidates,
  filterCloudPlatforms,
  hasRecurringCloudAllowance,
  cloudDeployHref,
  buildCloudSelectionTask,
  defaultCloudContext,
} = require("./cloud-catalog.cjs");
const { cloudGuides } = require("./cloud-guides.cjs");
test("cloud catalog preserves all active services and separates recurring allowance from trials", () => {
  assert.equal(
    filterCloudPlatforms("", "全部", false).length,
    availablePlatforms.length,
  );
  for (const p of availablePlatforms) {
    const g = cloudGuides[p.id];
    assert.ok(g && g.sleep && g.storage && g.billing && g.start, p.name);
    assert.ok(!/待复核|待核验/.test(p.allowance + p.limit), p.name);
  }
  const recurring = filterCloudPlatforms("", "全部", true).map((p) => p.id);
  for (const id of [
    "cloud-7",
    "cloud-12",
    "cloud-15",
    "cloud-18",
    "cloud-20",
    "cloud-21",
  ])
    assert.ok(!recurring.includes(id), id);
  assert.ok(recurring.includes("cloud-11"));
  assert.ok(!hasRecurringCloudAllowance("cloud-13"));
  assert.deepEqual(
    filterCloudPlatforms("Python Flask", "全部", false).map((p) => p.id),
    ["cloud-8"],
  );
  assert.equal(filterCloudPlatforms("", "全部", false, []).length, 0);
  assert.deepEqual(
    filterCloudPlatforms("", "全部", false, ["cloud-17", "cloud-0"]).map(
      (p) => p.id,
    ),
    ["cloud-17", "cloud-0"],
  );
});
test("cloud suggestions honor commercial use, task capabilities and unknown project types", () => {
  assert.deepEqual(cloudCandidates(defaultCloudContext), []);
  assert.deepEqual(
    cloudCandidates({ ...defaultCloudContext, need: "offline" }),
    [],
  );
  assert.deepEqual(
    cloudCandidates({ ...defaultCloudContext, need: "client" }),
    [],
  );
  const personal = cloudCandidates({
    ...defaultCloudContext,
    need: "next",
    purpose: "personal",
  });
  assert.equal(personal[0].platformId, "cloud-0");
  const business = cloudCandidates({
    ...defaultCloudContext,
    need: "next",
    purpose: "commercial",
  });
  assert.ok(!business.some((c) => c.platformId === "cloud-0"));
  assert.ok(business.some((c) => c.platformId === "cloud-1"));
  const paid = cloudCandidates({
    ...defaultCloudContext,
    need: "next",
    purpose: "commercial",
    budget: "review",
  });
  assert.ok(paid.some((c) => c.platformId === "cloud-0"));
  const cron = cloudCandidates({ ...defaultCloudContext, need: "automation" });
  assert.ok(!cron.some((c) => c.platformId === "cloud-11"));
  const wechat = cloudCandidates({
    ...defaultCloudContext,
    need: "wechat",
    budget: "review",
  });
  assert.ok(wechat.some((c) => c.platformId === "cloud-21"));
  for (const c of [...personal, ...business, ...paid, ...cron, ...wechat])
    assert.ok(!["cloud-13", "cloud-19"].includes(c.platformId));
});
test("cloud selection tasks and deploy links carry exact choices without accepting arbitrary URL values", () => {
  const { deploymentContextFromSearch } = require("./deployment-task.cjs");
  const context = {
    need: "wechat",
    purpose: "commercial",
    budget: "review",
    data: "existing",
  };
  const href = cloudDeployHref("cloud-21", context);
  const url = new URL(href, "https://example.test");
  assert.equal(url.hash, "#deploy-cloud-21");
  assert.deepEqual(deploymentContextFromSearch(url.search), {
    artifact: "miniapp",
    purpose: "commercial",
    budget: "review",
    data: "existing",
  });
  assert.deepEqual(
    deploymentContextFromSearch(
      "?artifact=bogus&purpose=other&budget=unlimited&data=password",
    ),
    {},
  );
  const task = buildCloudSelectionTask(context, ["cloud-21", "cloud-13"]);
  assert.match(task, /微信小程序的后端/);
  assert.match(task, /已有数据服务/);
  assert.match(task, /15 天/);
  assert.match(task, /不创建远程资源/);
  assert.ok(!task.includes("Zeabur"));
});
