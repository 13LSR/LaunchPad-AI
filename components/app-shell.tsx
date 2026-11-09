"use client";
import Link from "next/link";
import { HashReveal } from "@/components/hash-reveal";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  ChevronRight,
  Github,
  Menu,
  Moon,
  Sun,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { modules, githubUrl } from "@/lib/data";
import { guideContent } from "@/lib/guide-content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModuleIcon } from "@/components/module-icon";
import { SearchDialog } from "@/components/search-dialog";
function Brand() {
  return (
    <Link href="/" className="brand" aria-label="LaunchPad AI 首页">
      <span className="brand-symbol">
        <Rocket size={21} />
      </span>
      <span>
        LaunchPad<span className="font-normal text-muted-foreground"> AI</span>
      </span>
    </Link>
  );
}
function Sidebar({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="sidebar-inner">
      <div className="sidebar-navigation">
        <div className="nav-group-label !mt-0">从想法到上线</div>
        <nav aria-label="八大模块">
          {modules.map((m) => (
            <Link
              key={m.slug}
              href={"/guide/" + m.slug}
              onClick={close}
              aria-current={
                pathname.endsWith("/" + m.slug) ? "page" : undefined
              }
              className={
                "nav-item " + (pathname.endsWith("/" + m.slug) ? "active" : "")
              }
            >
              <ModuleIcon name={m.icon} size={17} />
              <span>{m.title}</span>
              {m.slug === "prompts" && <span className="nav-new">起点</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <Link href="/" onClick={close} className="nav-item !mt-7">
          <ArrowUpRight size={17} />
          <span>了解这个网站</span>
        </Link>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="nav-item"
        >
          <Github size={17} />
          <span>GitHub 开源仓库</span>
        </a>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <strong>不用一次学完。</strong>
          <p>
            先完成眼前这一步，
            <br />
            再把你的想法慢慢做出来。
          </p>
          <Link href="/guide/prompts" onClick={close}>
            从一个想法开始 <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
function RightRail() {
  const pathname = usePathname();
  const m = modules.find((m) => pathname.endsWith("/" + m.slug));
  if (!m) return null;
  const g = guideContent[m.slug];
  return (
    <aside className="right-rail" aria-label="页面辅助导航">
      <p className="rail-heading">这一页怎么用</p>
      <nav className="toc">
        {g.before.map((s) => (
          <a key={s.id} href={"#" + s.id}>
            {s.title}
          </a>
        ))}
        <a href="#module-tools">{g.toolTitle}</a>
        {g.toolSections?.map((s) => (
          <a key={s.id} href={"#" + s.id}>
            {s.title}
          </a>
        ))}
        {g.after.map((s) => (
          <a key={s.id} href={"#" + s.id}>
            {s.title}
          </a>
        ))}
      </nav>
      <div className="rail-tip">
        <h3>完成之后</h3>
        <p>{g.next.label}</p>
        <Link href={"/guide/" + g.next.slug}>
          继续下一步 <ChevronRight size={14} />
        </Link>
      </div>
    </aside>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false),
    [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const landing = pathname === "/";
  useEffect(() => setMounted(true), []);
  const current = modules.find((m) => pathname.endsWith("/" + m.slug));
  return (
    <>
      <HashReveal />
      <a href="#main-content" className="skip-link">
        跳到主要内容
      </a>
      <header className={"topbar " + (landing ? "landing-topbar" : "")}>
        <div className="nav-brand-wrap">
          {!landing && (
            <Dialog open={mobile} onOpenChange={setMobile}>
              <DialogTrigger asChild>
                <Button
                  aria-label="打开导航菜单"
                  variant="ghost"
                  size="icon"
                  className="mobile-menu"
                >
                  <Menu size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="mobile-drawer">
                <DialogTitle className="sr-only">导航菜单</DialogTitle>
                <DialogDescription className="sr-only">
                  选择需要的工具或返回介绍首页
                </DialogDescription>
                <div className="px-5 pt-6">
                  <Brand />
                </div>
                <Sidebar close={() => setMobile(false)} />
              </DialogContent>
            </Dialog>
          )}
          <Brand />
        </div>
        {landing ? (
          <nav className="landing-nav" aria-label="首页导航">
            <a href="#why">上线要准备什么</a>
            <a href="#how">上线路线</a>
            <a href="#questions">常见问题</a>
          </nav>
        ) : (
          <SearchDialog />
        )}
        <div className="topbar-actions">
          <Button
            aria-label={
              mounted && resolvedTheme === "dark"
                ? "切换浅色模式"
                : "切换深色模式"
            }
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {mounted && resolvedTheme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </Button>
          {landing ? (
            <Button asChild className="landing-nav-cta">
              <a href="#start">
                找到起点 <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <Button
              asChild
              aria-label="GitHub 源码"
              variant="ghost"
              size="icon"
            >
              <a href={githubUrl} target="_blank" rel="noreferrer">
                <Github size={18} />
              </a>
            </Button>
          )}
        </div>
      </header>
      {landing ? (
        <main id="main-content" className="landing-page">
          {children}
        </main>
      ) : (
        <div className="app-body">
          <aside className="left-sidebar">
            <Sidebar />
          </aside>
          <div className="content-region">
            <div className="breadcrumb">
              <Link href="/">AI 开发入门指南</Link>
              <ChevronRight size={12} />
              <span className="text-foreground">
                {current?.title || "工具箱"}
              </span>
            </div>
            <div className="content-columns">
              <main id="main-content" className="main-content">
                {children}
                <footer className="footer">
                  <span>LaunchPad AI · 把想法做出来，也让它跑起来。</span>
                  <Link href="/">
                    关于这个网站 <ArrowUpRight size={12} />
                  </Link>
                </footer>
              </main>
              <RightRail />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
