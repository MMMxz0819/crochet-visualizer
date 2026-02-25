import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DictionaryPage() {
  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">针法字典</h1>
      <Card>
        <CardHeader>
          <CardTitle>即将上线</CardTitle>
          <CardDescription>
            此功能正在开发中，敬请期待！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            学习基础钩针针法，包括锁针、短针、中长针、长针等。
            每个针法都配有详细的图解说明和3D演示。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
