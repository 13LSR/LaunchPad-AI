export default function Loading() {
  return (
    <div aria-label="正在加载页面" className="space-y-5 py-10">
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-secondary" />
      <div className="h-5 w-full animate-pulse rounded-lg bg-secondary" />
      <div className="mt-8 h-64 animate-pulse rounded-xl bg-secondary" />
    </div>
  );
}
