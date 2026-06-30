import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/layout/nav-bar";
import { FloatingBubbles } from "@/components/visual/floating-bubbles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 兜底守卫（middleware 已拦截，这里双保险）
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-dream relative min-h-screen overflow-hidden">
      {/* 固定在背景的梦幻泡泡层 */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <FloatingBubbles density="normal" />
      </div>
      <div className="relative z-10">
        <NavBar email={user.email ?? undefined} />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
