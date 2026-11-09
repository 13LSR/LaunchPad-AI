"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="py-24">
      <h1 className="text-2xl font-semibold">页面暂时没有加载成功</h1>
      <p className="my-5 text-sm text-muted-foreground">
        请重试一次，或返回首页查看其他模块。
      </p>
      <Button onClick={reset}>重新加载</Button>
    </div>
  );
}
