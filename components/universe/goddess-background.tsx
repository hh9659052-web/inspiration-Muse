"use client";

import { motion } from "framer-motion";

/**
 * 女神石像全屏背景。
 * 图片按需求固定：width:100vw / height:100svh / object-fit:cover / object-position:center。
 * 图片缺失时优雅回退为梦境渐变（不报错）。
 */
export function GoddessBackground({
  src,
  dim = 0,
}: {
  src: string;
  /** 顶层压暗程度 0-1，供文字可读性 */
  dim?: number;
}) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* 回退底：梦境渐变（图片加载前/缺失时可见） */}
      <div className="bg-dream absolute inset-0" />

      <motion.img
        src={src}
        alt=""
        draggable={false}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          width: "100vw",
          height: "100svh",
          objectFit: "cover",
          objectPosition: "center",
        }}
        className="select-none"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* 柔光：顶部天光 + 中心聚焦 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(255,255,255,0.35),transparent_60%)]" />
      {dim > 0 && (
        <div
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ opacity: dim }}
        />
      )}
    </div>
  );
}
