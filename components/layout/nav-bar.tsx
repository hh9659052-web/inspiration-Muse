import Link from "next/link";
import { Sparkles, LogOut, History } from "lucide-react";

import { signOut } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";

export function NavBar({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-semibold"
        >
          <Sparkles className="size-5 text-primary" />
          灵感缪斯
        </Link>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/history">
              <History className="size-4" />
              <span className="hidden sm:inline">历史</span>
            </Link>
          </Button>

          {email && (
            <span className="mx-2 hidden text-sm text-muted-foreground sm:inline">
              {email}
            </span>
          )}

          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">登出</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
