"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Heart, Download, Check } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export interface MuseCard {
  id: string;
  tag: string;
  title: string;
  content: string;
}

const TAG_TINT: Record<string, string> = {
  解读: "bg-violet-500/10 text-violet-700",
  行动: "bg-emerald-500/10 text-emerald-700",
  延伸: "bg-sky-500/10 text-sky-700",
  风险: "bg-amber-500/10 text-amber-700",
};

/** 单张结果卡片：弹出入场 + 悬停光效 + 复制/收藏/导出。 */
export function ResultCard({
  card,
  index,
  favorited,
  onToggleFavorite,
}: {
  card: MuseCard;
  index: number;
  favorited: boolean;
  onToggleFavorite: (card: MuseCard) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(`【${card.tag}】${card.title}\n\n${card.content}`);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 1600);
  }

  function exportMd() {
    const md = `# ${card.title}\n\n> ${card.tag} · Inspiration Muse\n\n${card.content}\n`;
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `muse-${card.tag}-${card.title.slice(0, 12)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("已导出 Markdown");
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay: index * 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass card-lift group relative flex flex-col gap-3 rounded-3xl border border-white/50 p-6"
    >
      <span
        className={cn(
          "w-fit rounded-full px-3 py-1 text-xs font-medium",
          TAG_TINT[card.tag] ?? "bg-foreground/5 text-foreground/60"
        )}
      >
        {card.tag}
      </span>

      <h3 className="text-lg font-semibold leading-snug">{card.title}</h3>
      <p className="text-sm leading-relaxed text-foreground/65">{card.content}</p>

      <div className="mt-2 flex items-center gap-1 border-t border-foreground/5 pt-3">
        <IconBtn label="复制" onClick={copy}>
          {copied ? (
            <Check className="size-4 text-emerald-600" />
          ) : (
            <Copy className="size-4" />
          )}
        </IconBtn>
        <IconBtn
          label={favorited ? "取消收藏" : "收藏"}
          onClick={() => onToggleFavorite(card)}
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              favorited && "fill-rose-500 text-rose-500"
            )}
          />
        </IconBtn>
        <IconBtn label="导出" onClick={exportMd}>
          <Download className="size-4" />
        </IconBtn>
      </div>
    </motion.article>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      title={label}
      className="btn-glow inline-flex size-9 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-white/60 hover:text-foreground"
    >
      {children}
      <span className="sr-only">{label}</span>
    </motion.button>
  );
}
