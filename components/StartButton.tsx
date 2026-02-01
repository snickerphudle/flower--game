"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { getRosesFountainBgm } from "@/lib/rosesFountainBgm";

interface StartButtonProps {
  onStartAction: () => void;
}

export default function StartButton({ onStartAction }: StartButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const startupAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload for instant playback on click.
    // Use the shared BGM instance so it can continue across screens.
    startupAudioRef.current = getRosesFountainBgm();

    return () => {
      // Best-effort cleanup
      startupAudioRef.current = null;
    };
  }, []);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);

    // Must be triggered from user gesture for best autoplay compatibility.
    const audio = startupAudioRef.current ?? getRosesFountainBgm();
    audio.loop = true;
    try {
      audio.currentTime = 0;
    } catch {
      // ignore (some browsers may block setting currentTime before metadata loads)
    }
    void audio.play().catch(() => {
      // ignore autoplay restrictions or transient failures
    });

    onStartAction();
    // Reset click state after animation if needed, but for V1 we just start
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 z-10 relative">
      <div className="relative">
        {/* Click Pulse Ring */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 rounded-full border border-rose-300/70"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}

        {/* Text-only mystical button (no pill background) */}
        <motion.button
          onClick={handleClick}
          initial={false}
          animate={
            isClicked ? { scale: 0.98, opacity: 0.9 } : { scale: 1, opacity: 1 }
          }
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={clsx(
            // Keep a generous hit target, but visually it's just text + glow
            "relative px-10 py-8 bg-transparent border-0",
            "text-rose-900/90 font-serif tracking-[0.35em] uppercase",
            "text-4xl sm:text-5xl",
            "outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-50",
          )}
          aria-label="Start"
        >
          {/* Soft aura */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(253,164,175,0.35), rgba(255,241,242,0) 60%)",
            }}
            animate={{
              opacity: [0.55, 0.85, 0.55],
              scale: [0.98, 1.05, 0.98],
            }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Gentle float */}
          <motion.span
            className="relative inline-block"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Shimmer highlight that softly passes over the text */}
            <span
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden"
            >
              <motion.span
                className="absolute -inset-y-6 w-16 rotate-12 opacity-40"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,241,242,0), rgba(255,255,255,0.9), rgba(255,241,242,0))",
                  filter: "blur(2px)",
                }}
                animate={{ x: ["-30%", "140%"] }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  repeatDelay: 2.2,
                  ease: "easeInOut",
                }}
              />
            </span>

            {/* Actual text with subtle glow */}
            <motion.span
              className="relative"
              style={{ textShadow: "0px 0px 14px rgba(253, 164, 175, 0.35)" }}
              animate={{ opacity: [0.92, 1, 0.92] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Start
            </motion.span>
          </motion.span>
        </motion.button>
      </div>

      {/* Subtext */}
    </div>
  );
}
