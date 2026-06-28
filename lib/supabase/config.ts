/**
 * Supabase「公开」连接配置。
 *
 * anon key 是公开凭据：它本来就会被打包进浏览器端代码、对任何访问者可见，
 * 安全边界由数据库的 RLS（行级安全）保证，而非 key 的保密性。
 * 因此把 URL 与 anon key 写在这里、提交进仓库是安全且常见的做法。
 *
 * ⚠️ service_role 等机密 key 绝不可写在这里，仅放服务端环境变量。
 *
 * 这里直接使用已验证有效的内置值，确保部署平台环境变量配置出错时仍能正常工作。
 * 如需更换 Supabase 项目，改这两个常量即可。
 */
export const SUPABASE_URL = "https://nvxanydapqnlnwjxkxjz.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52eGFueWRhcHFubG53anhreGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MzE0MjEsImV4cCI6MjA5ODIwNzQyMX0.AvUtpKJ-crSOtc63pLpID63Aen42ypvkKY80AfkYfNM";
