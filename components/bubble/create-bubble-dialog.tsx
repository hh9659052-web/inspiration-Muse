"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateBubbleDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "创建失败" }));
      toast.error("发布失败", { description: error });
      return;
    }

    toast.success("泡泡已升起 🫧", { description: "它有 72 小时，别让它冷掉。" });
    setTitle("");
    setContent("");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          吹个泡泡
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            发布一个想法泡泡
          </DialogTitle>
          <DialogDescription>
            趁热写下来。它会存活 72 小时，AI 随时能帮你拆解它。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">想法是什么？</Label>
            <Input
              id="title"
              placeholder="例如：做一个帮人记录灵感的小程序"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">补充说明（可选）</Label>
            <Textarea
              id="content"
              placeholder="为什么想做？想给谁用？此刻的冲动是什么……"
              value={content}
              maxLength={2000}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              升起泡泡
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
