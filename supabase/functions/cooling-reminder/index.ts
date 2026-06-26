// Supabase Edge Function: cooling-reminder
// 查找「即将冷却且未提醒」的泡泡，给主人发邮件，然后标记 reminded_at。
// 由 pg_cron 定时（建议每 30 分钟）调用，详见同目录 README。
//
// 所需环境变量（supabase secrets set ...）：
//   SUPABASE_URL                 项目 URL（平台自动注入）
//   SUPABASE_SERVICE_ROLE_KEY    服务端密钥（平台自动注入，绕过 RLS）
//   RESEND_API_KEY               Resend 邮件服务密钥
//   REMINDER_FROM_EMAIL          发件地址，如 "灵感缪斯 <muse@yourdomain.com>"
//   SITE_URL                     站点地址，用于邮件里的泡泡链接

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const REMINDER_BEFORE_HOURS = 6;

interface IdeaRow {
  id: string;
  title: string;
  expires_at: string;
  profiles: { email: string | null } | null;
}

Deno.serve(async (req) => {
  // 简单的共享密钥校验（可选）：cron 调用时带 Authorization: Bearer <CRON_SECRET>
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret) {
    const auth = req.headers.get("Authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = Date.now();
  const threshold = new Date(
    now + REMINDER_BEFORE_HOURS * 60 * 60 * 1000
  ).toISOString();
  const nowIso = new Date(now).toISOString();

  // 即将冷却（剩余 ≤ REMINDER_BEFORE_HOURS 小时）、仍存活、且未提醒过的泡泡
  const { data, error } = await supabase
    .from("ideas")
    .select("id, title, expires_at, profiles ( email )")
    .in("status", ["active", "rescued"])
    .gt("expires_at", nowIso)
    .lte("expires_at", threshold)
    .is("reminded_at", null)
    .limit(200);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const ideas = (data ?? []) as unknown as IdeaRow[];
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("REMINDER_FROM_EMAIL")!;
  const siteUrl = Deno.env.get("SITE_URL") ?? "";

  let sent = 0;
  for (const idea of ideas) {
    const email = idea.profiles?.email;
    if (!email) continue;

    const hoursLeft = Math.max(
      1,
      Math.round((new Date(idea.expires_at).getTime() - now) / 3_600_000)
    );
    const link = `${siteUrl}/bubble/${idea.id}`;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: email,
          subject: `🫧 你的想法「${idea.title}」还有约 ${hoursLeft} 小时就冷掉了`,
          html: `
            <div style="font-family:sans-serif;line-height:1.6">
              <p>嘿，还记得这个想法吗？</p>
              <p style="font-size:18px;font-weight:600">「${idea.title}」</p>
              <p>它还有大约 <b>${hoursLeft} 小时</b>就要冷却了。
              花 5 分钟做掉一个小任务，别让灵感白白溜走。</p>
              <p><a href="${link}"
                style="display:inline-block;padding:10px 18px;background:#7c5cff;color:#fff;border-radius:8px;text-decoration:none">
                去抢救这个泡泡 →</a></p>
            </div>`,
        }),
      });
      if (!res.ok) continue; // 发送失败则不标记，下次再试
    }

    await supabase
      .from("ideas")
      .update({ reminded_at: nowIso })
      .eq("id", idea.id);
    sent++;
  }

  return new Response(JSON.stringify({ candidates: ideas.length, sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
