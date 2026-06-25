"use client";

import { useEffect, useState } from "react";
import { getRemainingMs, getTemperature } from "@/lib/bubble";
import type { BubbleTemperature } from "@/types";

interface CountdownState {
  remainingMs: number;
  temperature: BubbleTemperature;
  isCold: boolean;
}

/**
 * 基于 expires_at 的实时倒计时。
 * 每秒更新一次剩余时间与温度态；过期后停在 0。
 */
export function useCountdown(expiresAt: string): CountdownState {
  const compute = (): CountdownState => {
    const remainingMs = getRemainingMs({ expires_at: expiresAt });
    return {
      remainingMs,
      temperature: getTemperature(remainingMs),
      isCold: remainingMs <= 0,
    };
  };

  const [state, setState] = useState<CountdownState>(compute);

  useEffect(() => {
    // 立即同步一次（避免 SSR/CSR 初值漂移），随后每秒跳动。
    setState(compute());

    if (getRemainingMs({ expires_at: expiresAt }) <= 0) return;

    const timer = setInterval(() => {
      const next = compute();
      setState(next);
      if (next.isCold) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);

  return state;
}
