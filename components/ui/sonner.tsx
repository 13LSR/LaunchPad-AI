"use client";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme as "dark" | "light"}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{ style: { fontFamily: "inherit" } }}
    />
  );
}
