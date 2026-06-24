import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* 背景泡泡装饰 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-[12%] top-[18%] size-40 rounded-full bg-bubble-warm/20 blur-2xl" />
        <div className="absolute right-[14%] top-[30%] size-52 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[16%] left-[24%] size-44 rounded-full bg-bubble-cold/20 blur-2xl" />
      </div>

      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
          <Sparkles className="size-4 text-primary" />
          给三分钟热度一个落地的机会
        </span>

        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          灵感缪斯
        </h1>

        <p className="text-pretty text-lg text-muted-foreground">
          把一闪而过的想法吹成一个泡泡。它有 72 小时的生命，
          AI 帮你把它拆成 3 个 5 分钟就能完成的小任务——
          别让灵感冷掉。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/login">开始吹泡泡</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">登录</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
