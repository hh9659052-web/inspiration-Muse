"use client";

/**
 * 漂浮的梦幻水晶泡泡装饰层（图四 / 超现实参考）。
 * 放在页面背景，pointer-events-none，不挡交互。
 */
const PRESETS: Record<
  "sparse" | "normal" | "rich",
  { size: number; left: string; top: string; delay: number; opacity?: number }[]
> = {
  sparse: [
    { size: 120, left: "6%", top: "20%", delay: 0, opacity: 0.7 },
    { size: 70, left: "86%", top: "16%", delay: 1.4, opacity: 0.6 },
    { size: 150, left: "80%", top: "66%", delay: 0.7, opacity: 0.55 },
    { size: 54, left: "16%", top: "74%", delay: 2.1, opacity: 0.6 },
  ],
  normal: [
    { size: 130, left: "8%", top: "18%", delay: 0 },
    { size: 72, left: "82%", top: "22%", delay: 1.2, opacity: 0.7 },
    { size: 160, left: "78%", top: "62%", delay: 0.6, opacity: 0.6 },
    { size: 56, left: "14%", top: "68%", delay: 1.8, opacity: 0.7 },
    { size: 96, left: "46%", top: "8%", delay: 2.4, opacity: 0.5 },
    { size: 40, left: "60%", top: "82%", delay: 3, opacity: 0.6 },
  ],
  rich: [
    { size: 140, left: "5%", top: "14%", delay: 0 },
    { size: 80, left: "88%", top: "18%", delay: 1.1, opacity: 0.7 },
    { size: 180, left: "76%", top: "60%", delay: 0.5, opacity: 0.6 },
    { size: 60, left: "12%", top: "70%", delay: 1.7, opacity: 0.7 },
    { size: 110, left: "42%", top: "6%", delay: 2.3, opacity: 0.5 },
    { size: 46, left: "62%", top: "84%", delay: 2.9, opacity: 0.6 },
    { size: 64, left: "30%", top: "44%", delay: 3.6, opacity: 0.4 },
    { size: 90, left: "92%", top: "48%", delay: 4.2, opacity: 0.5 },
  ],
};

export function FloatingBubbles({
  density = "normal",
  className,
}: {
  density?: "sparse" | "normal" | "rich";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${className ?? ""}`}
    >
      {PRESETS[density].map((b, i) => (
        <span
          key={i}
          className="bubble-crystal animate-float absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            opacity: b.opacity ?? 0.8,
            animationDelay: `${b.delay}s`,
            animationDuration: `${7 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}
