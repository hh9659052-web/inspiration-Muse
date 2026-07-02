"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/** 玻璃拟态功能面板（居中弹层，带柔光描边与淡入缩放）。 */
export function GlassModal({
  open,
  onClose,
  title,
  icon,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/25 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative flex max-h-[86svh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/60"
          >
            <header className="flex items-center justify-between border-b border-white/40 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                {icon}
                {title}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="btn-glow inline-flex size-9 items-center justify-center rounded-full text-foreground/50 hover:bg-white/60 hover:text-foreground"
              >
                <X className="size-4" />
              </motion.button>
            </header>
            <div className="overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
