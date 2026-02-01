"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { randomInt, randomRange } from "@/lib/random";

type Petal = {
  key: string;
  leftPct: number;
  sizePx: number;
  durationS: number;
  delayS: number;
  driftPx: number;
  swayPx: number;
  rot0Deg: number;
  rot1Deg: number;
  opacity: number;
  blurPx: number;
  swayDurationS: number;
  swayDelayS: number;
};

export default function RosePetals({
  enabled = true,
  count = 18,
  className,
}: {
  enabled?: boolean;
  count?: number;
  className?: string;
}) {
  const petals = useMemo<Petal[]>(() => {
    if (!enabled) return [];

    return Array.from({ length: count }).map((_, i) => {
      const durationS = randomRange(12, 22);
      // Negative delay starts petals mid-flight (prevents “all spawn at once”).
      const delayS = -randomRange(0, durationS);

      return {
        key: `petal-${i}-${Math.random().toString(16).slice(2)}`,
        leftPct: randomRange(-5, 105),
        sizePx: randomInt(14, 32),
        durationS,
        delayS,
        driftPx: randomRange(-70, 70),
        swayPx: randomRange(10, 34),
        rot0Deg: randomRange(-55, 55),
        rot1Deg: randomRange(160, 420) * (Math.random() < 0.5 ? -1 : 1),
        opacity: randomRange(0.28, 0.62),
        blurPx: randomRange(0, 1.2),
        swayDurationS: randomRange(3.2, 5.8),
        swayDelayS: randomRange(0, 1.5),
      };
    });
  }, [count, enabled]);

  if (!enabled) return null;

  return (
    <div
      className={clsx(
        "rose-petals absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      aria-hidden="true"
    >
      {petals.map((p) => {
        const style = {
          left: `${p.leftPct}%`,
          width: p.sizePx,
          height: p.sizePx,
          opacity: p.opacity,
          filter: `blur(${p.blurPx}px) drop-shadow(0 14px 28px rgba(0,0,0,0.10))`,
          animationDuration: `${p.durationS}s`,
          animationDelay: `${p.delayS}s`,
          ["--petal-drift" as any]: `${p.driftPx}px`,
          ["--petal-sway" as any]: `${p.swayPx}px`,
          ["--petal-rot0" as any]: `${p.rot0Deg}deg`,
          ["--petal-rot1" as any]: `${p.rot1Deg}deg`,
        } as React.CSSProperties;

        const innerStyle = {
          animationDuration: `${p.swayDurationS}s`,
          animationDelay: `${p.swayDelayS}s`,
        } as React.CSSProperties;

        return (
          <div key={p.key} className="rose-petal" style={style}>
            <div className="rose-petal__inner" style={innerStyle}>
              <svg
                viewBox="0 0 64 64"
                width="100%"
                height="100%"
                role="presentation"
                focusable="false"
              >
                <defs>
                  <radialGradient
                    id="petalGlow"
                    cx="30%"
                    cy="26%"
                    r="80%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                    <stop
                      offset="40%"
                      stopColor="rgba(251,113,133,0.75)"
                    />
                    <stop offset="100%" stopColor="rgba(225,29,72,0.80)" />
                  </radialGradient>
                </defs>
                {/* Stylized rose petal */}
                <path
                  d="M31.5 6.5C23.5 13 18 24 18 34.5c0 12.2 9.3 22 13.5 22s14-9.8 14-22C45.5 24 39.7 13 31.5 6.5Z"
                  fill="url(#petalGlow)"
                />
                <path
                  d="M31.5 10.5c-5.6 6-9.2 14.8-9.2 23.7 0 11.2 6.8 18.8 9.2 18.8s9.7-7.6 9.7-18.8c0-9-3.9-17.7-9.7-23.7Z"
                  fill="rgba(255,255,255,0.08)"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
