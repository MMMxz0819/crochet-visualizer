import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VisualizePage() {
  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">3D可视化</h1>
      <Card>
        <CardHeader>
          <CardTitle>即将上线</CardTitle>
          <CardDescription>
            此功能正在开发中，敬请期待！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            3D可视化功能将允许您将图解转换为逼真的3D模型预览，
            支持不同线材材质、颜色切换，以及旋转、缩放等交互功能。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
