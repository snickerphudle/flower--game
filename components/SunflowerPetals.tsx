"use client";

import Image from "next/image";
import { useMemo } from "react";
import clsx from "clsx";
import { randomInt, randomRange, sample } from "@/lib/random";

const PETAL_SOURCES = [
  "/sunflower1.png",
  "/sunflower2.png",
  "/sunflower3.png",
  "/sunflower4.png",
] as const;

type Petal = {
  key: string;
  src: (typeof PETAL_SOURCES)[number];
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

export default function SunflowerPetals({
  enabled = true,
  count = 16,
  className,
}: {
  enabled?: boolean;
  count?: number;
  className?: string;
}) {
  const petals = useMemo<Petal[]>(() => {
    if (!enabled) return [];

    return Array.from({ length: count }).map((_, i) => {
      const durationS = randomRange(10, 18);
      const delayS = -randomRange(0, durationS);

      return {
        key: `sf-petal-${i}-${Math.random().toString(16).slice(2)}`,
        src: sample(PETAL_SOURCES),
        leftPct: randomRange(-8, 108),
        sizePx: randomInt(18, 44),
        durationS,
        delayS,
        driftPx: randomRange(-90, 90),
        swayPx: randomRange(12, 38),
        rot0Deg: randomRange(-35, 35),
        rot1Deg: randomRange(180, 520) * (Math.random() < 0.5 ? -1 : 1),
        opacity: randomRange(0.22, 0.52),
        blurPx: randomRange(0, 1.0),
        swayDurationS: randomRange(2.8, 5.2),
        swayDelayS: randomRange(0, 1.5),
      };
    });
  }, [count, enabled]);

  if (!enabled) return null;

  return (
    <div
      className={clsx(
        "sunflower-petals absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      aria-hidden="true"
    >
      {petals.map((p) => {
        const style = {
          position: "absolute",
          top: 0,
          left: `${p.leftPct}%`,
          width: p.sizePx,
          height: p.sizePx,
          opacity: p.opacity,
          filter: `blur(${p.blurPx}px) drop-shadow(0 16px 34px rgba(0,0,0,0.10))`,
          animationName: "sunflower-petal-fall",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDuration: `${p.durationS}s`,
          animationDelay: `${p.delayS}s`,
          willChange: "transform",
          ["--sf-drift" as any]: `${p.driftPx}px`,
          ["--sf-sway" as any]: `${p.swayPx}px`,
          ["--sf-rot0" as any]: `${p.rot0Deg}deg`,
          ["--sf-rot1" as any]: `${p.rot1Deg}deg`,
        } as React.CSSProperties;

        const innerStyle = {
          animationName: "sunflower-petal-sway",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDuration: `${p.swayDurationS}s`,
          animationDelay: `${p.swayDelayS}s`,
          willChange: "transform",
        } as React.CSSProperties;

        return (
          <div key={p.key} className="sunflower-petal" style={style}>
            <div className="sunflower-petal__inner" style={innerStyle}>
              <Image
                src={p.src}
                alt=""
                width={p.sizePx}
                height={p.sizePx}
                className="select-none"
                draggable={false}
                priority={false}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

