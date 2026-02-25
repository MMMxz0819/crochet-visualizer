import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditorPage() {
  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">图解编辑器</h1>
      <Card>
        <CardHeader>
          <CardTitle>即将上线</CardTitle>
          <CardDescription>
            此功能正在开发中，敬请期待！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            创建和编辑您的专属图解。支持拖拽放置针法符号、
            颜色选择、重复标记等功能。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
