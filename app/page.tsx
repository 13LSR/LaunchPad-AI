import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { githubUrl } from "@/lib/data";
import { ProjectFlow } from "@/components/project-flow";

const startingPoints = [
  {
    title: "还只有一个想法",
    text: "选场景、理清功能，生成一份发给 AI 的需求。",
    action: "打开 AI 启动器",
    href: "/guide/prompts",
  },
  {
    title: "代码有了，运行不起来",
    text: "认出项目文件，按步骤复制命令，在电脑上打开它。",
    action: "查找运行方法",
    href: "/guide/local",
  },
  {
    title: "已经能运行，准备上线",
    text: "先确认数据存在哪里，再选适合项目的云平台。",
    action: "检查上线前的数据准备",
    href: "/guide/local#local-data-next",
  },
];
const journey = [
  {
    title: "先在自己的电脑上打开",
    text: "找到项目类型，照着说明安装和启动。遇到报错，把对应的排查任务交给 AI。",
    result: "确认页面和主要功能能用",
    action: "本地运行速查",
    href: "/guide/local",
  },
  {
    title: "确认数据要保存到哪里",
    text: "有账号、报名记录或订单？先准备数据库。有用户上传的图片？再选文件存储。",
    result: "需要的数据能保存、能读出来",
    action: "数据库与文件存储",
    href: "/guide/databases",
  },
  {
    title: "选一个能放下项目的平台",
    text: "看平台能不能运行你的项目，再比较免费额度、使用限制和超额费用。",
    result: "知道用哪个平台，以及为什么",
    action: "云端部署平台",
    href: "/guide/cloud",
  },
  {
    title: "让 AI 协助发布，自己验收",
    text: "复制部署任务给 AI，按提示完成账号授权。上线后打开网址，试用关键功能。",
    result: "拿到别人也能访问的网址",
    action: "Agent 自动部署",
    href: "/guide/cli",
  },
];
const resources = [
  {
    title: "想从现成项目改起？",
    text: "找一个用途接近的开源项目，再让 AI 帮你换内容、改功能。",
    action: "挑选开源项目",
    href: "/guide/projects",
  },
  {
    title: "想让 AI 更会做这件事？",
    text: "给 AI 编程助手增加设计、查文档或测试页面的专门技能。",
    action: "认识 Agent 技能包",
    href: "/guide/skills",
  },
  {
    title: "图片太大，打开很慢？",
    text: "按图片用途选格式，了解怎么压缩、怎么存，再把任务交给 AI。",
    action: "查看媒体优化指南",
    href: "/guide/media",
  },
];
const questions = [
  {
    question: "完全不会编程，也能用吗？",
    answer:
      "可以从你当前遇到的问题开始。本站会说明该点哪里、复制什么、怎样判断成功。不认识自己的项目类型，就到「本地运行速查」按文件名查找，或复制项目识别任务给你的 AI 编程助手。",
  },
  {
    question: "这里会直接帮我写代码、发布网站吗？",
    answer:
      "这里提供操作指南、可复制的命令，以及发给 AI 的任务说明。你需要在自己的 AI 编程助手中创建或打开项目，让它执行任务；云平台账号也由你自己注册和管理。",
  },
  {
    question: "免费额度，意味着一直不用花钱吗？",
    answer:
      "本站的指南和工具可以免费使用。云平台的免费套餐通常有容量、访问量或使用期限限制，有些不允许商用；超额后可能暂停服务或收费。平台详情会说明这些条件。AI 模型调用和购买自己的域名，也可能另外收费。",
  },
  {
    question: "已经有项目，还需要从头来吗？",
    answer:
      "不用。打不开项目，就查运行方法；已经能运行，先检查是否要保存用户数据和上传文件；这些准备好了，再比较云平台并交给 AI 协助部署。只展示固定内容的网站通常不需要单独开通数据库。",
  },
  {
    question: "我想做微信小程序，这里也适用吗？",
    answer:
      "适用。AI 启动器包含微信小程序场景，本地运行指南也有对应的开发者工具和后端说明。小程序界面需要通过微信开发者工具预览、提交审核；云平台负责承载它需要的后端和数据服务。",
  },
];

export default function Home() {
  return (
    <>
      <section className="landing-hero" aria-labelledby="home-title">
        <div className="landing-hero-copy">
          <h1 id="home-title">
            让 AI 写的项目，
            <br />
            <span>真正上线。</span>
          </h1>
          <p className="landing-lead">
            你想成为天才程序员吗？
            <br />
            AI 时代，人人都是 <strong>Yes 工程师。</strong>
          </p>
          <p className="landing-explanation">
            LaunchPad AI 专为<strong>非程序员</strong>解决 AI
            时代的跑代码、云部署、白嫖免费额度、CLI
            自动化操作与开源二次改造难题。不懂怎么运行、怎么改、怎么让 AI
            通过终端帮你部署？这里有说明，也有能直接复制给 AI 的任务。
          </p>
          <div className="landing-actions">
            <Button asChild size="lg">
              <Link href="/guide/prompts">
                从想法开始 <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Button>
            <a href="#how" className="landing-secondary">
              先看上线路线 <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="landing-reassurance">
            本站免费使用 · 无需注册 · 命令与 AI 任务一键复制
          </p>
        </div>
        <nav id="start" className="landing-start" aria-labelledby="start-title">
          <h2 id="start-title">你现在到哪一步了？</h2>
          <p>从眼前的问题开始，不用从头学。</p>
          <div className="landing-start-links">
            {startingPoints.map((point) => (
              <Link key={point.href} href={point.href}>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                  <span>{point.action}</span>
                </div>
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </nav>
      </section>
      <section className="landing-full-path" aria-labelledby="full-path-title">
        <h2 id="full-path-title">从场景启动到媒体优化，一个完整闭环。</h2>
        <p>
          明确需求与改造开源项目可以同时进行，数据服务按需准备。
          技能包和图片优化随时都能用，让项目在开发、上线与改进之间不断完善。
        </p>
        <ProjectFlow />
      </section>
      <section
        id="why"
        className="landing-example"
        aria-labelledby="example-title"
      >
        <div className="landing-example-intro">
          <h2 id="example-title">
            上线一个网站，
            <br />
            到底要准备什么？
          </h2>
          <p>
            假设你让 AI 做了一个<strong>活动报名网站</strong>
            。别人要打开页面、填写报名信息，还可能上传照片。这三件事，需要分别考虑。
          </p>
          <Link href="/guide/local#local-data-next">
            看看我的项目需要哪些 <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="landing-example-parts">
          <article>
            <div className="landing-part-heading">
              <h3>让别人打开报名页面</h3>
              <span>网站部署</span>
            </div>
            <p>把网页和需要运行的程序放到云平台，获得一个可访问的网址。</p>
            <Link href="/guide/cloud">
              比较网站部署平台 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <div className="landing-part-heading">
              <h3>记住谁报了名</h3>
              <span>数据库</span>
            </div>
            <p>保存姓名、场次和报名状态，让你下次打开时还能查到这些记录。</p>
            <Link href="/guide/databases">
              选择数据库 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <div className="landing-part-heading">
              <h3>收下报名者上传的照片</h3>
              <span>文件存储 · 按需</span>
            </div>
            <p>专门保存上传的图片和附件，再把文件地址记录到数据库里。</p>
            <Link href="/guide/databases#database-15">
              了解文件存储 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <p className="landing-example-note">
            只展示固定作品和联系方式？通常不用单独开通数据库。是否需要额外服务，要看你的项目实际做了什么。
          </p>
        </div>
      </section>
      <section
        id="how"
        className="landing-journey"
        aria-labelledby="journey-title"
      >
        <div className="landing-section-title">
          <h2 id="journey-title">代码有了，按这条路线往前走。</h2>
          <p>每一步都有具体说明和可复制的操作。已经完成的，直接跳过。</p>
        </div>
        <ol>
          {journey.map((step, index) => (
            <li key={step.href}>
              <Link href={step.href}>
                <span className="landing-step" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <p className="journey-result">这一步完成后：{step.result}</p>
                  <span className="journey-module">
                    {step.action} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="landing-resources" aria-labelledby="resources-title">
        <div className="landing-section-title">
          <h2 id="resources-title">用得上时，再打开这些工具。</h2>
          <p>从现成作品开始，或给手上的项目补一点能力。</p>
        </div>
        <div className="landing-resource-list">
          {resources.map((resource) => (
            <Link key={resource.href} href={resource.href}>
              <h3>{resource.title}</h3>
              <p>{resource.text}</p>
              <span>
                {resource.action} <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section
        id="questions"
        className="landing-faq"
        aria-labelledby="faq-title"
      >
        <h2 id="faq-title">开始之前，你可能想问</h2>
        <div>
          {questions.map(({ question, answer }) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="landing-close" aria-labelledby="close-title">
        <div>
          <h2 id="close-title">今天，先让项目往前走一步。</h2>
          <p>不用先成为天才程序员。从你现在卡住的地方开始。</p>
        </div>
        <Button asChild size="lg">
          <a href="#start">
            找到我的下一步 <ArrowRight size={18} aria-hidden="true" />
          </a>
        </Button>
      </section>
      <footer className="landing-footer">
        <span>
          LaunchPad AI <span>· 为想把想法做出来的人。</span>
        </span>
        <a href={githubUrl} target="_blank" rel="noreferrer">
          <Github size={16} aria-hidden="true" /> GitHub 源码{" "}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </>
  );
}
