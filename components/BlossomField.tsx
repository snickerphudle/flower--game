"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { randomRange } from "@/lib/random";

// Simple SVG Petal Shape
const PetalSVG = ({ color = "#fda4af" }: { color?: string }) => (
  <svg
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm"
  >
    <path
      d="M15 30C15 30 5 20 5 10C5 4.47715 9.47715 0 15 0C20.5228 0 25 4.47715 25 10C25 20 15 30 15 30Z"
      fill={color}
      fillOpacity="0.8"
    />
  </svg>
);

interface PetalConfig {
  id: number;
  xStart: number; // 0-100 vw
  yStart: number; // 0-100 vh
  scale: number;
  opacity: number;
  rotation: number;
  duration: number;
  delay: number;
  blur: number;
}

interface BlossomFieldProps {
  count?: number;
  isGusting?: boolean;
}

export default function BlossomField({
  count = 20,
  isGusting = false,
}: BlossomFieldProps) {
  const [petals, setPetals] = useState<PetalConfig[]>([]);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // Reduce count if reduced motion is preferred
    const effectiveCount = shouldReduceMotion ? Math.min(count, 5) : count;

    const newPetals: PetalConfig[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      newPetals.push({
        id: i,
        xStart: randomRange(-20, 100), // Start scattered
        yStart: randomRange(-10, 110),
        scale: randomRange(0.4, 0.8), // Small to medium
        opacity: randomRange(0.4, 0.9),
        rotation: randomRange(0, 360),
        duration: randomRange(15, 25), // Slow floating
        delay: randomRange(0, 10),
        blur: randomRange(0, 2),
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPetals(newPetals);
  }, [count, shouldReduceMotion]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((petal) => (
        <Petal
          key={petal.id}
          config={petal}
          shouldReduceMotion={shouldReduceMotion ?? false}
        />
      ))}

      {/* Extra gust layer that only appears when gusting - skip if reduced motion */}
      {isGusting && !shouldReduceMotion && <GustLayer />}
    </div>
  );
}

function Petal({
  config,
  shouldReduceMotion,
}: {
  config: PetalConfig;
  isGusting?: boolean;
  shouldReduceMotion: boolean;
}) {
  // We use a continuous loop for the background field
  // To simulate wind, we move from left to right, wrapping around

  return (
    <motion.div
      className="absolute w-8 h-8"
      initial={{
        x: `${config.xStart}vw`,
        y: `${config.yStart}vh`,
        rotate: shouldReduceMotion ? 0 : config.rotation,
        opacity: 0,
      }}
      animate={{
        x: ["-10vw", "110vw"],
        y: shouldReduceMotion
          ? `${config.yStart}vh`
          : [
              `${config.yStart}vh`,
              `${config.yStart + 5}vh`,
              `${config.yStart - 5}vh`,
              `${config.yStart}vh`,
            ],
        rotate: shouldReduceMotion
          ? 0
          : [config.rotation, config.rotation + 360],
        opacity: [0, config.opacity, config.opacity, 0],
      }}
      transition={{
        x: {
          duration: config.duration,
          repeat: Infinity,
          ease: "linear",
          delay: config.delay - 20,
        },
        y: {
          duration: config.duration / 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        },
        rotate: {
          duration: config.duration * 0.8,
          repeat: Infinity,
          ease: "linear",
        },
        opacity: {
          duration: config.duration,
          repeat: Infinity,
          times: [0, 0.1, 0.9, 1],
        },
      }}
      style={{
        scale: config.scale,
        filter: `blur(${config.blur}px)`,
      }}
    >
      <PetalSVG />
    </motion.div>
  );
}

// A separate layer of fast-moving petals for the "Gust" effect
function GustLayer() {
  const gustPetals = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    y: randomRange(10, 90),
    scale: randomRange(0.5, 1),
    delay: randomRange(0, 0.2),
  }));

  return (
    <>
      {gustPetals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-10 h-10"
          initial={{ x: "-10vw", y: `${p.y}vh`, opacity: 0, rotate: 0 }}
          animate={{ x: "120vw", opacity: [0, 1, 0], rotate: 720 }}
          transition={{
            duration: randomRange(0.8, 1.5), // Fast!
            ease: "easeOut",
            delay: p.delay,
          }}
          style={{ scale: p.scale }}
        >
          <PetalSVG color="#f43f5e" /> {/* Slightly darker for visibility */}
        </motion.div>
      ))}
    </>
  );
}
