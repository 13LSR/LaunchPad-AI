"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function CopyButton({
  text,
  label = false,
  className,
}: {
  text: string;
  label?: boolean | string;
  className?: string;
}) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copied = copiedText === text;
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  async function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (!ok) throw Error("copy");
      }
      setCopiedText(text);
      toast.success("已复制");
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopiedText(null), 2000);
    } catch {
      toast.error("复制失败，请选中文字后手动复制");
    }
  }
  return (
    <Button
      variant="ghost"
      size={label ? "sm" : "icon"}
      onClick={copy}
      aria-label={
        copied ? "已复制" : typeof label === "string" ? label : "复制内容"
      }
      title={copied ? "已复制" : typeof label === "string" ? label : "复制内容"}
      className={cn(
        "copy-button text-muted-foreground",
        copied && "text-emerald-500",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </motion.span>
      </AnimatePresence>
      {label &&
        (copied ? "已复制" : typeof label === "string" ? label : "复制")}
    </Button>
  );
}
export function CodeBlock({
  code,
  language = "终端",
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  return (
    <div className="code-block">
      <div className="code-header">
        <span>{title || language}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
