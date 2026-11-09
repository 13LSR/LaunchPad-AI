import {
  Sparkles,
  Package,
  Puzzle,
  Terminal,
  Database,
  Bot,
  Cloud,
  Image,
  BookOpen,
} from "lucide-react";
const icons = {
  Sparkles,
  Package,
  Puzzle,
  Terminal,
  Database,
  Bot,
  Cloud,
  Image,
};
export function ModuleIcon({
  name,
  size = 18,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = icons[name as keyof typeof icons] || BookOpen;
  return <Icon size={size} strokeWidth={1.7} className={className} />;
}
