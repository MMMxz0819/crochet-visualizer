import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/visualize", label: "3D可视化", description: "查看图解3D效果" },
  { href: "/convert", label: "图片转图解", description: "上传图片识别图解" },
  { href: "/library", label: "图解库", description: "浏览管理图解" },
  { href: "/editor", label: "图解编辑器", description: "创建编辑图解" },
  { href: "/dictionary", label: "针法字典", description: "学习基础针法" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">钩针图解可视化</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            登录
          </Button>
          <Button size="sm">开始使用</Button>
        </div>
      </div>
    </header>
  );
}
