"use client";

import Image from "next/image";
import { useMemo } from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { randomInt, randomRange, sample } from "@/lib/random";

type Petal = {
  key: string;
  src: string;
  xStart: number; // vw
  yStart: number; // vh
  sizePx: number;
  durationS: number;
  delayS: number;
  driftVw: number;
  swayVw: number;
  rot0Deg: number;
  rot1Deg: number;
  opacity: number;
  blurPx: number;
};

export default function WindPetals({
  sources,
  enabled = true,
  count = 100,
  className,
}: {
  sources: string[];
  enabled?: boolean;
  count?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const petals = useMemo<Petal[]>(() => {
    if (!enabled) return [];
    if (!sources.length) return [];

    const effectiveCount = shouldReduceMotion ? Math.min(count, 12) : count;

    return Array.from({ length: effectiveCount }).map((_, i) => {
      const durationS = randomRange(10, 18);
      const delayS = randomRange(0, 2.5);

      return {
        key: `wind-petal-${i}-${Math.random().toString(16).slice(2)}`,
        src: sample(sources),
        xStart: randomRange(-10, 110),
        yStart: randomRange(-30, 110),
        sizePx: randomInt(18, 46),
        durationS,
        delayS,
        driftVw: randomRange(-16, 16),
        swayVw: randomRange(2, 7),
        rot0Deg: randomRange(-40, 40),
        rot1Deg: randomRange(180, 540) * (Math.random() < 0.5 ? -1 : 1),
        opacity: randomRange(0.18, 0.55),
        blurPx: randomRange(0, 1.1),
      };
    });
  }, [count, enabled, sources, shouldReduceMotion]);

  if (!enabled) return null;
  if (!sources.length) return null;

  return (
    <div
      className={clsx(
        "wind-petals absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {petals.map((p) => (
        <motion.div
          key={p.key}
          className="absolute"
          initial={{
            x: `${p.xStart}vw`,
            y: `${p.yStart}vh`,
            rotate: shouldReduceMotion ? 0 : p.rot0Deg,
            opacity: 0,
          }}
          animate={{
            x: shouldReduceMotion
              ? `${p.xStart}vw`
              : [
                  `${p.xStart}vw`,
                  `${p.xStart + p.swayVw}vw`,
                  `${p.xStart - p.swayVw}vw`,
                  `${p.xStart + p.driftVw}vw`,
                ],
            y: [`${p.yStart}vh`, "120vh"],
            rotate: shouldReduceMotion ? 0 : [p.rot0Deg, p.rot1Deg],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            x: shouldReduceMotion
              ? { duration: p.durationS, repeat: Infinity, ease: "linear" }
              : {
                  duration: p.durationS * 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "mirror",
                },
            y: {
              duration: p.durationS,
              repeat: Infinity,
              ease: "linear",
              delay: p.delayS,
            },
            rotate: shouldReduceMotion
              ? { duration: p.durationS, repeat: Infinity, ease: "linear" }
              : {
                  duration: p.durationS * 0.8,
                  repeat: Infinity,
                  ease: "linear",
                },
            opacity: {
              duration: p.durationS,
              repeat: Infinity,
              times: [0, 0.12, 0.88, 1],
              delay: p.delayS,
            },
          }}
          style={{
            width: p.sizePx,
            height: p.sizePx,
            filter: `blur(${p.blurPx}px) drop-shadow(0 16px 34px rgba(0,0,0,0.10))`,
            willChange: "transform",
          }}
        >
          <Image
            src={p.src}
            alt=""
            width={p.sizePx}
            height={p.sizePx}
            className="select-none"
            draggable={false}
            priority={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
