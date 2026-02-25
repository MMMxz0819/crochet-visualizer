import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Box, ImageIcon, Library, PenTool, BookOpen } from "lucide-react";

const features = [
  {
    href: "/visualize",
    icon: Box,
    title: "3D可视化",
    description: "将图解转换为逼真的3D模型预览",
    color: "bg-blue-500",
  },
  {
    href: "/convert",
    icon: ImageIcon,
    title: "图片转图解",
    description: "上传图片，AI智能识别图解内容",
    color: "bg-green-500",
  },
  {
    href: "/library",
    icon: Library,
    title: "图解库",
    description: "浏览、收藏和管理您的图解作品",
    color: "bg-purple-500",
  },
  {
    href: "/editor",
    icon: PenTool,
    title: "图解编辑器",
    description: "创建和编辑属于您的图解",
    color: "bg-orange-500",
  },
  {
    href: "/dictionary",
    icon: BookOpen,
    title: "针法字典",
    description: "学习基础钩针针法技巧",
    color: "bg-pink-500",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <section className="container py-24 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            钩针图解可视化工具
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            将钩针图解转换为3D模型，或从图片智能识别图解。轻松管理您的编织作品，
            学习新针法，开启您的创作之旅。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/visualize">
                开始体验
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dictionary">学习针法</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-16 px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary flex items-center">
                    了解更多 <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-16 px-4">
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">还没有图解？</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            上传您的图片，使用AI自动识别图解，或者从空白画布开始创建新作品。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/convert">上传图片识别</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/editor">创建新图解</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
