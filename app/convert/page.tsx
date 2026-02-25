import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConvertPage() {
  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">图片转图解</h1>
      <Card>
        <CardHeader>
          <CardTitle>即将上线</CardTitle>
          <CardDescription>
            此功能正在开发中，敬请期待！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            上传您的钩针图解图片，AI将自动识别图解内容，
            将其转换为可编辑的结构化数据。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
