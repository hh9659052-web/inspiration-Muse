"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { FloatingBubbles } from "@/components/visual/floating-bubbles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const emailRedirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
        redirect
      )}`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo },
      });

      if (error) {
        toast.error("发送失败", { description: error.message });
        return;
      }

      setSent(true);
      toast.success("登录链接已发送", {
        description: "请查收邮箱并点击链接登录。",
      });
    } catch (err) {
      // 例如缺少 NEXT_PUBLIC_SUPABASE_URL/ANON_KEY 时会走到这里
      toast.error("登录初始化失败", {
        description: err instanceof Error ? err.message : "请检查环境变量配置",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass w-full max-w-sm border-0">
      <CardHeader className="items-center text-center">
        <Link href="/" className="mb-2 inline-flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <span className="font-display text-lg italic">灵感缪斯</span>
        </Link>
        <CardTitle className="text-xl">用邮箱登录</CardTitle>
        <CardDescription>
          {sent ? "链接已送达你的邮箱" : "我们会发一个免密码登录链接给你"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="size-10 text-primary" />
            <p>
              已向 <span className="font-medium text-foreground">{email}</span>{" "}
              发送登录链接，点击邮件中的按钮即可进入。
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSent(false)}
              className="mt-2"
            >
              换个邮箱
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mail className="size-4" />
              )}
              发送登录链接
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="bg-dream relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <FloatingBubbles density="sparse" />
      <div className="relative z-10">
        <Suspense fallback={<Loader2 className="size-6 animate-spin" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
