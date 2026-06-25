"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Lightbulb, AlertTriangle, Gauge } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IdeaAnalysisResult } from "@/types";

export function AiAnalysisPanel({
  ideaId,
  initial,
}: {
  ideaId: string;
  initial: IdeaAnalysisResult | null;
}) {
  const [analysis, setAnalysis] = useState<IdeaAnalysisResult | null>(initial);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setLoading(true);
    const res = await fetch(`/api/ideas/${ideaId}/analyze`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "分析失败" }));
      toast.error("AI 分析失败", { description: error });
      return;
    }
    const { analysis } = await res.json();
    setAnalysis(analysis);
    toast.success("分析完成 ✨");
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <Sparkles className="size-8 text-primary" />
          <p className="font-medium">让 AI 看看这个想法</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            缪斯会给出一句话点评、可行性评估，以及亮点与风险。
          </p>
          <Button onClick={runAnalysis} disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            开始分析
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <Card>
        <CardContent className="flex flex-col gap-4 py-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-lg font-medium leading-snug">
              {analysis.oneLiner}
            </p>
          </div>

          <Section icon={<Gauge className="size-4" />} title="可行性">
            <p className="text-sm text-muted-foreground">
              {analysis.feasibility}
            </p>
          </Section>

          <Section icon={<Lightbulb className="size-4" />} title="亮点">
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {analysis.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </Section>

          <Section icon={<AlertTriangle className="size-4" />} title="风险">
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {analysis.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Section>

          <Button
            variant="ghost"
            size="sm"
            onClick={runAnalysis}
            disabled={loading}
            className="w-fit"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            重新分析
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
        {icon}
        {title}
      </span>
      {children}
    </div>
  );
}
