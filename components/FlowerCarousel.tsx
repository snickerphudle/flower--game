"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { randomRange, randomInt } from "@/lib/random";

type FlowerSection = {
  id: string;
  name: string;
  caption: string;
  image?: { src: string; alt: string };
  backgroundClassName: string;
  accentClassName: string;
  flowerEmoji: string;
  wrapClassName: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function GiftWrapOverlay({
  flowerName,
  wrapClassName,
  isOpening,
  onOpen,
}: {
  flowerName: string;
  wrapClassName: string;
  isOpening: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={isOpening}
      className={clsx(
        "absolute inset-0 z-10 cursor-pointer select-none",
        "rounded-xl overflow-hidden",
        "border border-black/5",
        "shadow-inner",
        wrapClassName,
        isOpening && "pointer-events-none",
      )}
      aria-label={`Unwrap ${flowerName}`}
      initial={false}
      animate={
        isOpening
          ? { opacity: 0, scale: 1.02, filter: "blur(4px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {/* wrapping paper pattern */}
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.65)_0%,transparent_55%),radial-gradient(circle_at_75%_65%,rgba(255,255,255,0.55)_0%,transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.12] mix-blend-multiply bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_1px,transparent_1px,transparent_9px)]" />

      {/* ribbon cross */}
      <div className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-white/45 backdrop-blur-[1px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]" />
      <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-white/45 backdrop-blur-[1px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]" />

      {/* bow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute -left-12 -top-6 h-12 w-16 rotate-[-18deg] rounded-[999px] bg-white/55 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" />
          <div className="absolute left-[-6px] -top-6 h-12 w-16 rotate-[18deg] rounded-[999px] bg-white/55 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" />
          <div className="h-6 w-6 rounded-full bg-white/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
        </div>
      </div>

      {/* prompt */}
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <div className="px-3 py-1.5 rounded-full bg-white/55 backdrop-blur text-[11px] tracking-[0.35em] uppercase text-rose-950/55">
          Tap to unwrap
        </div>
      </div>
    </motion.button>
  );
}

function FlowerBurst({
  nonce,
  emoji,
}: {
  nonce: number | undefined;
  emoji: string;
}) {
  // Recompute particles per trigger.
  const particles = useMemo(() => {
    if (!nonce) return [];
    return Array.from({ length: 22 }).map((_, i) => {
      const x = randomRange(-160, 160);
      const y = randomRange(-220, -380);
      const rotate = randomRange(-140, 140);
      const delay = randomRange(0, 0.18);
      const size = randomInt(18, 34);
      const drift = randomRange(-40, 40);
      return { key: `${nonce}-${i}`, x, y, rotate, delay, size, drift };
    });
  }, [nonce]);

  return (
    <AnimatePresence>
      {nonce ? (
        <motion.div
          key={nonce}
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {particles.map((p) => (
            <motion.span
              key={p.key}
              className="absolute left-1/2 top-1/2"
              style={{ fontSize: p.size, filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.12))" }}
              initial={{ opacity: 0, scale: 0.6, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.6, 1.25, 0.9],
                x: [0, p.x, p.x + p.drift],
                y: [0, p.y, p.y - 40],
                rotate: [0, p.rotate],
              }}
              transition={{
                duration: 1.15,
                ease: "easeOut",
                delay: p.delay,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function FlowerCarousel() {
  const sections = useMemo<FlowerSection[]>(
    () => [
      {
        id: "rose",
        name: "rose",
        caption: "For the love you gave so freely.",
        backgroundClassName:
          "bg-gradient-to-b from-rose-50 via-white to-rose-100/40",
        accentClassName: "from-rose-200/60 to-rose-400/20",
        flowerEmoji: "🌹",
        wrapClassName:
          "bg-gradient-to-br from-rose-100 via-rose-50 to-white",
      },
      {
        id: "orchid",
        name: "Orchid",
        caption: "For your quiet strength and grace.",
        backgroundClassName:
          "bg-gradient-to-b from-fuchsia-50 via-white to-purple-100/40",
        accentClassName: "from-fuchsia-200/60 to-purple-400/20",
        flowerEmoji: "🌺",
        wrapClassName:
          "bg-gradient-to-br from-fuchsia-100 via-purple-50 to-white",
      },
      {
        id: "cherry-blossom",
        name: "Cherry Blossom",
        caption: "For every gentle spring you brought into my life.",
        image: {
          src: "/assets/sakura-reference.png",
          alt: "Cherry blossoms",
        },
        backgroundClassName:
          "bg-gradient-to-b from-pink-50 via-white to-rose-100/40",
        accentClassName: "from-pink-200/70 to-rose-400/20",
        flowerEmoji: "🌸",
        wrapClassName: "bg-gradient-to-br from-pink-100 via-rose-50 to-white",
      },
      {
        id: "sunflower",
        name: "Sunflower",
        caption: "For the way you always turned us toward the light.",
        backgroundClassName:
          "bg-gradient-to-b from-amber-50 via-white to-yellow-100/40",
        accentClassName: "from-amber-200/70 to-yellow-400/20",
        flowerEmoji: "🌻",
        wrapClassName:
          "bg-gradient-to-br from-amber-100 via-yellow-50 to-white",
      },
      {
        id: "lily",
        name: "Lily",
        caption: "For the peace you created at home.",
        backgroundClassName:
          "bg-gradient-to-b from-slate-50 via-white to-emerald-100/30",
        accentClassName: "from-emerald-200/50 to-slate-300/20",
        flowerEmoji: "🤍",
        wrapClassName:
          "bg-gradient-to-br from-emerald-50 via-slate-50 to-white",
      },
      {
        id: "lavender",
        name: "Lavender",
        caption: "For the calm you gave me, again and again.",
        backgroundClassName:
          "bg-gradient-to-b from-indigo-50 via-white to-violet-100/40",
        accentClassName: "from-violet-200/60 to-indigo-400/20",
        flowerEmoji: "🪻",
        wrapClassName:
          "bg-gradient-to-br from-violet-100 via-indigo-50 to-white",
      },
    ],
    [],
  );

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmStartedRef = useRef(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const cooldownUntilRef = useRef(0);

  const [unwrapStateById, setUnwrapStateById] = useState<
    Record<string, "wrapped" | "unwrapping" | "revealed">
  >(() =>
    Object.fromEntries(
      sections.map((s) => [s.id, "wrapped" as const]),
    ) as Record<string, "wrapped" | "unwrapping" | "revealed">,
  );
  const [burstNonceById, setBurstNonceById] = useState<Record<string, number>>(
    () => Object.fromEntries(sections.map((s) => [s.id, 0])),
  );
  const unwrapTimeoutsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    // Play background music on first landing (best-effort; browsers may still block).
    if (bgmStartedRef.current) return;
    bgmStartedRef.current = true;

    const audio = new Audio("/rosesfountain.mp3");
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0.9;
    bgmRef.current = audio;

    void audio.play().catch(() => {
      // ignore autoplay restrictions
    });

    return () => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
      if (bgmRef.current === audio) bgmRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      // Clear any pending unwrap timers.
      for (const id of Object.keys(unwrapTimeoutsRef.current)) {
        window.clearTimeout(unwrapTimeoutsRef.current[id]);
      }
      unwrapTimeoutsRef.current = {};
    };
  }, []);

  const unwrap = (sectionId: string) => {
    setUnwrapStateById((prev) => {
      const current = prev[sectionId] ?? "wrapped";
      if (current !== "wrapped") return prev;
      return { ...prev, [sectionId]: "unwrapping" };
    });

    setBurstNonceById((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? 0) + 1,
    }));

    // Reveal the image after the burst.
    const t = window.setTimeout(() => {
      setUnwrapStateById((prev) => ({ ...prev, [sectionId]: "revealed" }));
    }, 750);
    unwrapTimeoutsRef.current[sectionId] = t;
  };

  const scrollToIndex = (index: number) => {
    const next = clamp(index, 0, sections.length - 1);
    const el = sectionRefs.current[next];
    if (!el) return;

    isAnimatingRef.current = true;
    setActiveIndex(next);
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Best-effort unlock after the smooth scroll settles.
    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 750);
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section (threshold helps, but be safe).
        const candidates = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          );
        const top = candidates[0];
        if (!top?.target) return;
        const idx = sectionRefs.current.findIndex((n) => n === top.target);
        if (idx >= 0) setActiveIndex(idx);
      },
      { root, threshold: [0.55, 0.7, 0.85] },
    );

    for (const node of sectionRefs.current) {
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [sections.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Discrete “page” scroll: one wheel gesture -> one section.
      if (Math.abs(e.deltaY) < 8) return;
      e.preventDefault();

      const now = performance.now();
      if (isAnimatingRef.current) return;
      if (now < cooldownUntilRef.current) return;
      cooldownUntilRef.current = now + 650;

      const dir = e.deltaY > 0 ? 1 : -1;
      scrollToIndex(activeIndexRef.current + dir);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        scrollToIndex(activeIndexRef.current + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIndex(activeIndexRef.current - 1);
      }
      if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(sections.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sections.length]);

  return (
    <div className="relative w-full h-screen">
      {/* Progress dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            className={clsx(
              "h-2.5 w-2.5 rounded-full transition-all",
              i === activeIndex ? "bg-rose-500/70 scale-110" : "bg-rose-900/20",
            )}
            aria-label={`Go to ${s.name}`}
          />
        ))}
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className={clsx(
          "w-full h-screen overflow-y-auto scroll-smooth",
          "snap-y snap-mandatory",
          "no-scrollbar",
        )}
        aria-label="Memories"
      >
        {sections.map((section, idx) => (
          <section
            key={section.id}
            ref={(node) => {
              sectionRefs.current[idx] = node;
            }}
            className={clsx(
              "snap-start h-screen w-full flex items-center justify-center relative",
              section.backgroundClassName,
            )}
            aria-label={section.name}
          >
            {/* Soft ambient blobs */}
            <div
              className={clsx(
                "absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-60 pointer-events-none",
                "bg-gradient-to-br",
                section.accentClassName,
              )}
            />
            <div
              className={clsx(
                "absolute -bottom-28 -right-20 h-96 w-96 rounded-full blur-3xl opacity-50 pointer-events-none",
                "bg-gradient-to-tr",
                section.accentClassName,
              )}
            />

            <figure
              className={clsx(
                "relative z-10 w-[min(92vw,760px)]",
                "bg-white/95 border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.15)]",
                "rounded-2xl",
                "px-6 sm:px-10 pt-6 sm:pt-10 pb-8 sm:pb-10",
                "backdrop-blur-sm",
              )}
              style={{
                transform: `rotate(${idx % 2 === 0 ? -1.2 : 1.1}deg)`,
              }}
            >
              {/* “Polaroid” photo area */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-rose-50 border border-black/5">
                <FlowerBurst
                  nonce={burstNonceById[section.id]}
                  emoji={section.flowerEmoji}
                />

                {section.image ? (
                  <Image
                    src={section.image.src}
                    alt={section.image.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 760px"
                    className="object-cover"
                    priority={idx === 0}
                  />
                ) : (
                  <div
                    className={clsx(
                      "absolute inset-0",
                      "bg-gradient-to-br from-white via-white to-rose-100/60",
                    )}
                  />
                )}

                {/* subtle film grain */}
                <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none bg-[radial-gradient(circle_at_25%_20%,rgba(0,0,0,0.35)_0%,transparent_55%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.25)_0%,transparent_60%)]" />

                <AnimatePresence>
                  {unwrapStateById[section.id] !== "revealed" && (
                    <GiftWrapOverlay
                      key={`wrap-${section.id}`}
                      flowerName={section.name}
                      wrapClassName={section.wrapClassName}
                      isOpening={unwrapStateById[section.id] === "unwrapping"}
                      onOpen={() => unwrap(section.id)}
                    />
                  )}
                </AnimatePresence>
              </div>

              <figcaption className="mt-6 text-center">
                <div className="font-display text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] text-rose-950/90 lowercase">
                  {section.name}
                </div>
                <div className="font-caption mt-3 text-base sm:text-xl font-medium tracking-[-0.01em] text-rose-900/60">
                  {section.caption}
                </div>
                <div className="mt-6 text-xs uppercase tracking-[0.35em] text-rose-900/35">
                  Scroll to continue
                </div>
              </figcaption>
            </figure>
          </section>
        ))}
      </div>
    </div>
  );
}
