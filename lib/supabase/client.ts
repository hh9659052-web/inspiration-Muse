import { createBrowserClient } from "@supabase/ssr";

/**
 * 浏览器端 Supabase 客户端（Client Components 中使用）。
 * 注意：NEXT_PUBLIC_* 变量必须以「字面量」形式访问 process.env.XXX，
 * Next.js 才会在构建时把值内联进前端包；动态访问 process.env[name] 在浏览器读不到。
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "缺少环境变量 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY。请在 Vercel 配置后重新部署（构建时需存在）。"
    );
  }
  return createBrowserClient(url, anonKey);
}
