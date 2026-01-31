"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

type FlowerSection = {
  id: string;
  name: string;
  caption: string;
  image?: { src: string; alt: string };
  backgroundClassName: string;
  accentClassName: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function FlowerCarousel() {
  const sections = useMemo<FlowerSection[]>(
    () => [
      {
        id: "rose",
        name: "Rose",
        caption: "For the love you gave so freely.",
        backgroundClassName:
          "bg-gradient-to-b from-rose-50 via-white to-rose-100/40",
        accentClassName: "from-rose-200/60 to-rose-400/20",
      },
      {
        id: "orchid",
        name: "Orchid",
        caption: "For your quiet strength and grace.",
        backgroundClassName:
          "bg-gradient-to-b from-fuchsia-50 via-white to-purple-100/40",
        accentClassName: "from-fuchsia-200/60 to-purple-400/20",
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
      },
      {
        id: "sunflower",
        name: "Sunflower",
        caption: "For the way you always turned us toward the light.",
        backgroundClassName:
          "bg-gradient-to-b from-amber-50 via-white to-yellow-100/40",
        accentClassName: "from-amber-200/70 to-yellow-400/20",
      },
      {
        id: "lily",
        name: "Lily",
        caption: "For the peace you created at home.",
        backgroundClassName:
          "bg-gradient-to-b from-slate-50 via-white to-emerald-100/30",
        accentClassName: "from-emerald-200/50 to-slate-300/20",
      },
      {
        id: "lavender",
        name: "Lavender",
        caption: "For the calm you gave me, again and again.",
        backgroundClassName:
          "bg-gradient-to-b from-indigo-50 via-white to-violet-100/40",
        accentClassName: "from-violet-200/60 to-indigo-400/20",
      },
    ],
    [],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const cooldownUntilRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
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
              </div>

              <figcaption className="mt-6 text-center">
                <div className="text-2xl sm:text-3xl font-serif tracking-wide text-rose-950/90">
                  {section.name}
                </div>
                <div className="mt-2 text-base sm:text-lg font-serif italic text-rose-900/70">
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

