import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="py-24">
      <p className="text-sm text-primary">404</p>
      <h1 className="mt-4 text-3xl font-semibold">这个页面还没有发射。</h1>
      <p className="my-6 text-sm text-muted-foreground">
        链接可能有误，可以从工具箱重新开始。
      </p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft /> 返回首页
        </Link>
      </Button>
    </div>
  );
}
