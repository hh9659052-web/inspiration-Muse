"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
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
    const supabase = createClient();

    const emailRedirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
      redirect
    )}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });

    setLoading(false);

    if (error) {
      toast.error("发送失败", { description: error.message });
      return;
    }

    setSent(true);
    toast.success("登录链接已发送", { description: "请查收邮箱并点击链接登录。" });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <Link href="/" className="mb-2 inline-flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <span className="font-semibold">灵感缪斯</span>
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
    <main className="flex min-h-screen items-center justify-center px-6">
      <Suspense fallback={<Loader2 className="size-6 animate-spin" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
