"use client";
import { useEffect, useRef } from "react";
export function useHashTarget(onTarget: (id: string) => void) {
  const callback = useRef(onTarget);
  callback.current = onTarget;
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    function revealHash(hash: string) {
      let id;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      if (!id) return;
      callback.current(id);
      clearTimeout(timer);
      timer = setTimeout(
        () =>
          document
            .getElementById(id)
            ?.scrollIntoView({ block: "start", behavior: "instant" }),
        80,
      );
    }
    const reveal = () => revealHash(location.hash);
    function click(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      )
        return;
      const url = new URL(anchor.href);
      // Next.js same-page links use history navigation without a native hashchange.
      if (
        url.origin === location.origin &&
        url.pathname === location.pathname &&
        url.search === location.search &&
        url.hash
      )
        revealHash(url.hash);
    }
    reveal();
    window.addEventListener("hashchange", reveal);
    window.addEventListener("popstate", reveal);
    window.addEventListener("launchpad:navigate", reveal);
    document.addEventListener("click", click);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", reveal);
      window.removeEventListener("popstate", reveal);
      window.removeEventListener("launchpad:navigate", reveal);
      document.removeEventListener("click", click);
    };
  }, []);
}
