"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function HashReveal() {
  const pathname = usePathname();
  useEffect(() => {
    function reveal() {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      let current: HTMLElement | null = el;
      while (current) {
        if (current instanceof HTMLDetailsElement) current.open = true;
        current = current.parentElement;
      }
      requestAnimationFrame(() =>
        el.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    }
    const timers: ReturnType<typeof setTimeout>[] = [setTimeout(reveal, 100)];
    function click(event: MouseEvent) {
      const a = (event.target as Element)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href);
      if (
        url.origin === location.origin &&
        url.pathname === location.pathname &&
        url.hash
      )
        timers.push(setTimeout(reveal, 50));
    }
    window.addEventListener("hashchange", reveal);
    window.addEventListener("popstate", reveal);
    window.addEventListener("launchpad:navigate", reveal);
    document.addEventListener("click", click);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("hashchange", reveal);
      window.removeEventListener("popstate", reveal);
      window.removeEventListener("launchpad:navigate", reveal);
      document.removeEventListener("click", click);
    };
  }, [pathname]);
  return null;
}
