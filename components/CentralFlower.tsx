"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface CentralFlowerProps {
  onSequenceComplete?: () => void;
}

/**
 * One petal, drawn pointing "up" (negative Y).
 * We place petals around the center via: rotate(angle) → translate(0, -radius).
 */
const Petal = ({ delay }: { delay: number }) => {
  return (
    <motion.g
      // Avoid animating CSS filters (can rasterize + lag on scale)
      initial={{ opacity: 0, scale: 0.65 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo-ish
      }}
    >
      <path
        // Petal pointing up; base near (0,0), tip around y=-40
        d="M0 0 C -16 -10, -20 -34, -4 -44 C -1 -46, 3 -44, 0 -40 C 6 -44, 12 -46, 16 -44 C 32 -34, 26 -10, 0 0 Z"
        fill="#fda4af"
        fillOpacity="0.9"
        stroke="#fb7185"
        strokeWidth="0.75"
        strokeOpacity="0.28"
      />
    </motion.g>
  );
};

export default function CentralFlower({
  onSequenceComplete,
}: CentralFlowerProps) {
  const [zoom, setZoom] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Sequence:
    // 0s: Start
    // 0.2s * 5 = 1.0s: Petals appearing
    // 1.5s: Wait a beat
    // 1.5s: Trigger zoom

    const totalDuration = 0.2 * 5 + 0.45;
    const portalDurationMs = 900;

    const timer = setTimeout(() => {
      setZoom(true);
      if (onSequenceComplete) {
        // Give time for zoom animation to finish before calling complete
        setTimeout(onSequenceComplete, portalDurationMs);
      }
    }, totalDuration * 1000);

    return () => clearTimeout(timer);
  }, [onSequenceComplete]);

  return (
    <motion.div
      className="relative z-50 flex items-center justify-center pointer-events-none"
      style={{
        transformOrigin: "50% 50%",
        willChange: "transform, opacity",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
      }}
      animate={
        zoom
          ? shouldReduceMotion
            ? { scale: 1.12, opacity: 0 }
            : {
                // Portal-ish entry: spin around center while scaling up
                rotate: 1080,
                scale: 45,
                opacity: 0,
              }
          : { rotate: 0, scale: 1, opacity: 1 }
      }
      transition={{
        duration: 0.9,
        ease: [0.7, 0, 0.84, 0], // Custom easeInExpo-ish for dramatic zoom
        delay: 0.08,
      }}
    >
      {/* Portal ring cue (subtle). */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={
          zoom && !shouldReduceMotion
            ? {
                opacity: [0, 0.45, 0],
                scale: [0.9, 1.25, 1.8],
                rotate: [0, 120, 240],
              }
            : { opacity: 0, scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={[
            "h-44 w-44 rounded-full border border-rose-200/70",
            // Drop heavy glow during zoom to prevent blurred raster edges
            zoom ? "shadow-none" : "shadow-[0_0_30px_rgba(251,113,133,0.18)]",
          ].join(" ")}
        />
      </motion.div>

      <svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        className={zoom ? "" : "drop-shadow-xl"}
        style={{ overflow: "visible" }}
      >
        <motion.g
          // During portal entry, the flower subtly counter-spins for depth.
          animate={
            zoom && !shouldReduceMotion ? { rotate: -180 } : { rotate: 0 }
          }
          transition={{ duration: 0.9, ease: [0.7, 0, 0.84, 0], delay: 0.08 }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <g transform="translate(50, 50)">
            {/* 5 Petals arranged radially (like your reference). */}
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = i * 72;
              const radius = 18; // tweak spacing between petals here
              return (
                <g
                  key={i}
                  transform={`rotate(${angle}) translate(0, -${radius})`}
                >
                  <Petal delay={i * 0.2} />
                </g>
              );
            })}

            {/* Center Stamen (appears last) */}
            <motion.circle
              cx="0"
              cy="0"
              r="4.2"
              fill="#fff"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            />
            <motion.circle
              cx="0"
              cy="0"
              r="2.1"
              fill="#fecdd3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
}
