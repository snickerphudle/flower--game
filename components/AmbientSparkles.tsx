"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { randomInt, randomRange } from "@/lib/random";

type Sparkle = {
  key: string;
  leftPct: number;
  topPct: number;
  sizePx: number;
  twinkleDelayS: number;
  twinkleDurationS: number;
  driftDurationS: number;
  opacity: number;
  blurPx: number;
};

export default function AmbientSparkles({
  enabled = true,
  count = 24,
  className,
}: {
  enabled?: boolean;
  count?: number;
  className?: string;
}) {
  const sparkles = useMemo<Sparkle[]>(() => {
    if (!enabled) return [];
    return Array.from({ length: count }).map((_, i) => ({
      key: `sparkle-${i}-${Math.random().toString(16).slice(2)}`,
      leftPct: randomRange(0, 100),
      topPct: randomRange(0, 100),
      sizePx: randomInt(2, 6),
      twinkleDelayS: randomRange(0, 4),
      twinkleDurationS: randomRange(2.6, 5.2),
      driftDurationS: randomRange(12, 22),
      opacity: randomRange(0.12, 0.35),
      blurPx: randomRange(0, 0.8),
    }));
  }, [count, enabled]);

  if (!enabled) return null;

  return (
    <div
      className={clsx(
        "ambient-sparkles pointer-events-none fixed inset-0 z-[1] overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {sparkles.map((s) => (
        <span
          key={s.key}
          className="sparkle"
          style={
            {
              left: `${s.leftPct}%`,
              top: `${s.topPct}%`,
              width: s.sizePx,
              height: s.sizePx,
              opacity: s.opacity,
              filter: `blur(${s.blurPx}px)`,
              animationDelay: `${s.twinkleDelayS}s, 0s`,
              ["--sparkle-twinkle-duration" as any]: `${s.twinkleDurationS}s`,
              ["--sparkle-drift-duration" as any]: `${s.driftDurationS}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

