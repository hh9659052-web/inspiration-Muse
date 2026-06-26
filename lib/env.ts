/**
 * 读取必需的环境变量，缺失时抛出清晰的中文报错（而非白屏 / 底层库的晦涩错误）。
 * 仅在运行时（请求处理）调用，不在模块顶层调用，以免影响构建。
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `缺少环境变量 ${name}。请在本地 .env.local 或 Vercel 项目的环境变量中配置后重新部署。`
    );
  }
  return value;
}
