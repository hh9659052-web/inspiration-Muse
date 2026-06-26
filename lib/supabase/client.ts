import { createBrowserClient } from "@supabase/ssr";
import { requireEnv } from "@/lib/env";

/** 浏览器端 Supabase 客户端（Client Components 中使用）。 */
export function createClient() {
  return createBrowserClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
