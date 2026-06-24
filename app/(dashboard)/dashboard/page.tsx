import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">我的泡泡墙</h1>
        <p className="text-sm text-muted-foreground">
          每个想法都有 72 小时。冷掉之前，让 AI 帮你迈出第一步。
        </p>
      </div>

      {/* M2 将在此渲染泡泡墙；当前为占位空状态 */}
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <Sparkles className="size-8 text-primary" />
        <p className="font-medium">还没有泡泡</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          登录功能已就绪 ✅ 下一步（M2）将支持发布想法泡泡。
        </p>
      </div>
    </div>
  );
}
