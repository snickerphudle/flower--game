"use client";

import Image from "next/image";
import { useMemo } from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import WindPetals from "./WindPetals";

export type FinaleCard = {
  id: string;
  title: string;
  caption: string;
  image: { src: string; alt: string };
  icon: { src: string; alt: string };
};

type ArcCard = FinaleCard & {
  yPx: number;
  rotateDeg: number;
};

export default function BirthdayFinale({
  cards,
  className,
}: {
  cards: FinaleCard[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const arc = useMemo<ArcCard[]>(() => {
    const n = cards.length;
    if (n === 0) return [];

    // Gentle "smile" arc: center lower, ends higher.
    // \(t \in [-1, 1]\), y = amp*(1 - t^2)
    const amp = 44; // px
    const maxRot = 8; // deg (smaller to avoid edge clipping)

    return cards.map((card, i) => {
      const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
      const yPx = amp * (1 - t * t);
      const rotateDeg = t * maxRot;
      return { ...card, yPx, rotateDeg };
    });
  }, [cards]);

  return (
    <div
      className={clsx(
        "relative w-full h-full overflow-hidden",
        "bg-gradient-to-b from-white via-rose-50 to-pink-100/70",
        className
      )}
    >
      {/* Dense cherry blossom storm */}
      <WindPetals
        className="z-[1] opacity-90"
        // This is the main perf cost on this screen (each petal is an image).
        // Keep it dense, but not so dense it tanks FPS on mobile.
        count={shouldReduceMotion ? 14 : 90}
        sources={[
          "/cherry0.png",
          "/cherry1.png",
          "/cherry2.png",
          "/cherry3.png",
        ]}
      />

      {/* Soft vignette + glow wash */}
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.85)_0%,rgba(255,241,242,0.0)_60%)]" />
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(circle_at_50%_85%,rgba(251,113,133,0.12)_0%,rgba(255,241,242,0.0)_55%)]" />

      {/* Title */}
      <div className="absolute inset-x-0 top-0 z-[20] flex items-start justify-center pt-10 sm:pt-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.98, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-900/10 bg-white/55 backdrop-blur px-4 py-1.5 text-[11px] uppercase tracking-[0.35em] text-rose-900/60">
            final surprise
          </div>
          <h1
            className={clsx(
              "mt-4 font-display font-extrabold tracking-[-0.06em]",
              "text-5xl sm:text-7xl md:text-8xl",
              "text-transparent bg-clip-text",
              "bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300",
              "birthday-title-shimmer"
            )}
          >
            Happy Birthday
          </h1>
          <div className="mt-3 font-caption text-sm sm:text-lg text-rose-950/60">
            May your days be soft, bright, and full of blooms.
          </div>
        </motion.div>
      </div>

      {/* Cards arranged in a simple arc under the title */}
      <div className="absolute inset-x-0 top-[34vh] sm:top-[38vh] z-[12] px-4">
        <div
          className={clsx(
            // Allow horizontal pan on small screens to keep cards full-size without collisions.
            "w-full",
            "overflow-x-auto no-scrollbar",
            "touch-pan-x",
            // Make edge cards fully visible when scrolled to ends.
            "scroll-px-4"
          )}
        >
          {/* NOTE: Cards are translated down via transforms (which don't affect layout),
              and `overflow-x-auto` implies `overflow-y: hidden` in Tailwind.
              Add bottom padding so the arc never gets visually clipped. */}
          <div className="flex w-max min-w-full justify-center items-end gap-4 sm:gap-5 px-4 pb-16 sm:pb-20">
            {arc.map((c) => (
              <div
                key={c.id}
                className="relative shrink-0"
                style={{
                  transform: `translateY(${c.yPx}px) rotate(${c.rotateDeg}deg)`,
                  transformOrigin: "center 80%",
                }}
              >
                {/* Aura (subtle, static) */}
                <div
                  className="absolute -inset-4 rounded-[30px] blur-xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.70) 0%, rgba(251,113,133,0.22) 35%, rgba(253,164,175,0.08) 62%, rgba(255,241,242,0) 78%)",
                  }}
                />

                {/* Card (same sizing as before) */}
                <div
                  className={clsx(
                    "relative overflow-hidden rounded-2xl",
                    "bg-white/92 border border-black/5",
                    "shadow-[0_14px_44px_rgba(0,0,0,0.16)]",
                    // Slightly smaller than before so the arc never clips.
                    "w-[min(34vw,205px)] sm:w-[min(21vw,225px)]"
                  )}
                >
                  <div className="relative w-full aspect-[3/4] bg-rose-50">
                    <Image
                      src={c.image.src}
                      alt={c.image.alt}
                      fill
                      sizes="(max-width: 640px) 44vw, 280px"
                      className="object-cover"
                      priority={false}
                    />
                    <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-multiply bg-[radial-gradient(circle_at_25%_20%,rgba(0,0,0,0.35)_0%,transparent_55%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.25)_0%,transparent_60%)]" />
                  </div>

                  <div className="px-4 pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-xl sm:text-2xl font-extrabold tracking-[-0.04em] text-rose-950/90 lowercase">
                          {c.title}
                        </div>
                        <div className="mt-1 font-caption text-xs sm:text-sm text-rose-900/55">
                          {c.caption}
                        </div>
                      </div>
                      <div className="relative h-10 w-10 shrink-0">
                        <Image
                          src={c.icon.src}
                          alt={c.icon.alt}
                          fill
                          sizes="40px"
                          className="object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
                          priority={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute inset-x-0 bottom-6 z-[30] flex items-center justify-center px-4">
        <div className="rounded-full bg-white/55 backdrop-blur border border-rose-900/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-rose-900/55">
          take it all in
        </div>
      </div>
    </div>
  );
}
