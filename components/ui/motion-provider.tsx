"use client";

import { MotionConfig } from "motion/react";

/** Honour prefers-reduced-motion: transforms off, opacity fades kept */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
