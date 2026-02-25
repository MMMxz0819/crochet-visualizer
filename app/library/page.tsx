import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LibraryPage() {
  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">图解库</h1>
      <Card>
        <CardHeader>
          <CardTitle>即将上线</CardTitle>
          <CardDescription>
            此功能正在开发中，敬请期待！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            浏览、收藏和管理您的图解作品集合。
            支持搜索、筛选、按分类整理等功能。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
