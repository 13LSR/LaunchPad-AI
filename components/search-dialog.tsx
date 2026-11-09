"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search, ArrowUpRight, FileText, CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchItems as items } from "@/lib/search-index";
const fuse = new Fuse(items, {
  keys: [
    { name: "title", weight: 3 },
    { name: "description", weight: 1 },
    { name: "module", weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
});
export function SearchDialog() {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [active, setActive] = useState(0);
  const router = useRouter();
  const results = useMemo(
    () =>
      query.trim()
        ? fuse
            .search(query)
            .slice(0, 35)
            .map((r) => r.item)
        : items.slice(0, 8),
    [query],
  );
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);
  useEffect(() => {
    if (open && results[active])
      document
        .getElementById("result-" + results[active].id)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, results, open]);
  function navigate(href: string) {
    setOpen(false);
    router.push(href);
    setTimeout(
      () => window.dispatchEvent(new Event("launchpad:navigate")),
      250,
    );
  }
  return (
    <>
      <button
        className="global-search"
        onClick={() => setOpen(true)}
        aria-label="搜索全站"
      >
        <Search size={16} />
        <span>搜索命令、平台、技术栈…</span>
        <kbd>Ctrl K</kbd>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="search-dialog p-0">
          <DialogTitle className="sr-only">搜索全站内容</DialogTitle>
          <DialogDescription className="sr-only">
            输入关键词查找平台、命令和八个模块的完整内容。
          </DialogDescription>
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 pr-12">
            <Search size={19} className="text-primary" />
            <input
              autoFocus
              aria-label="搜索关键词"
              value={query}
              placeholder="试试报名、上传图片、运行命令…"
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229)
                  return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) =>
                    Math.max(0, Math.min(a + 1, results.length - 1)),
                  );
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                }
                if (e.key === "Enter" && results[active])
                  navigate(results[active].href);
              }}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              role="combobox"
              aria-expanded={true}
              aria-controls="search-results"
              aria-activedescendant={
                results[active] ? "result-" + results[active].id : undefined
              }
            />
          </div>
          <div className="px-5 pt-3 text-xs text-muted-foreground">
            {query ? results.length + " 个匹配结果" : "快速前往"}
          </div>
          <div
            className="max-h-[55vh] overflow-y-auto p-2"
            id="search-results"
            role="listbox"
          >
            {results.map((item, i) => (
              <button
                id={"result-" + item.id}
                key={item.id}
                role="option"
                aria-selected={i === active}
                className={"search-result " + (i === active ? "selected" : "")}
                onMouseEnter={() => setActive(i)}
                onClick={() => navigate(item.href)}
              >
                <FileText size={16} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.module}</span>
                </div>
                <ArrowUpRight size={15} />
              </button>
            ))}
            {results.length === 0 && (
              <div className="px-4 py-12 text-center">
                <Search className="mx-auto mb-3 text-muted-foreground" />
                <p>没有找到相关内容</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  试试平台名、框架名或更短的关键词。
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
            <span>↑ ↓ 选择 · Esc 关闭</span>
            <span className="flex items-center gap-2">
              <CornerDownLeft size={12} /> 打开内容
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
