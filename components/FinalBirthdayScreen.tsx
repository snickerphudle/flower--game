"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import WindPetals from "./WindPetals";

type FinalCard = {
  id: string;
  name: string;
  caption: string;
  image: { src: string; alt: string };
  icon: { src: string; alt: string };
};

export default function FinalBirthdayScreen({
  cards,
}: {
  cards: Array<{
    id: string;
    name: string;
    caption: string;
    image: { src: string; alt: string };
    icon: { src: string; alt: string };
  }>;
}) {
  const normalizedCards = useMemo<FinalCard[]>(
    () =>
      cards
        .filter((c) => Boolean(c.image?.src) && Boolean(c.icon?.src))
        .map((c) => ({
          id: c.id,
          name: c.name,
          caption: c.caption,
          image: c.image,
          icon: c.icon,
        })),
    [cards]
  );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Soft dreamy background */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-pink-100/40" />
      <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_25%_15%,rgba(251,113,133,0.18)_0%,transparent_55%),radial-gradient(circle_at_80%_70%,rgba(244,114,182,0.14)_0%,transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] bg-[url('/assets/sakura-reference.png')] bg-cover bg-center mix-blend-multiply" />

      {/* Fill the screen with cherry blossom petals */}
      <WindPetals
        className="z-[3] opacity-75"
        count={90}
        lowCost
        sources={[
          "/cherry0.png",
          "/cherry1.png",
          "/cherry2.png",
          "/cherry3.png",
        ]}
      />

      {/* Content */}
      <div className="relative z-[6] flex h-full w-full flex-col">
        {/* Top headline */}
        <header className="relative pt-10 sm:pt-14 md:pt-16 pb-6 sm:pb-8 px-6 text-center overflow-visible">
          <div className="mx-auto max-w-5xl">
            <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-40 w-[min(92vw,760px)] rounded-full blur-3xl opacity-70 bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.35),transparent_70%)]" />
            <motion.h1
              className={clsx(
                "font-display",
                "text-5xl sm:text-7xl md:text-8xl",
                "leading-[1.2]",
                "pb-2",
                "overflow-visible",
                "font-extrabold tracking-[-0.05em]",
                "bday-shimmer-text",
                "drop-shadow-[0_18px_60px_rgba(0,0,0,0.12)]"
              )}
              initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Happy Birthday
            </motion.h1>
          </div>
        </header>

        {/* Infinite carousel */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="bday-marquee">
              <div
                className="bday-marquee__track"
                style={
                  {
                    ["--bday-marquee-duration" as never]: "42s",
                  } as React.CSSProperties
                }
                aria-label="Memories carousel"
              >
                <div className="bday-marquee__group">
                  {normalizedCards.map((c) => (
                    <div
                      key={`bday-card-a-${c.id}`}
                      className={clsx(
                        "bday-card-aura",
                        "w-[220px] sm:w-[250px] md:w-[270px]",
                        "rounded-2xl",
                        "bg-transparent",
                        "border border-transparent"
                      )}
                    >
                      <div className="relative p-3">
                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-rose-50 border border-black/5">
                          <Image
                            src={c.image.src}
                            alt={c.image.alt}
                            fill
                            sizes="270px"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        {/* flower icon (top-right) */}
                        <div className="pointer-events-none absolute top-5 right-5">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/70 backdrop-blur border border-black/5 shadow-[0_14px_40px_rgba(0,0,0,0.14)]">
                            <Image
                              src={c.icon.src}
                              alt={c.icon.alt}
                              fill
                              sizes="56px"
                              className="object-contain p-2 drop-shadow-[0_12px_26px_rgba(0,0,0,0.18)]"
                              priority={false}
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <div className="font-display text-lg sm:text-xl font-extrabold tracking-[-0.03em] text-rose-950/90 lowercase">
                            {c.name}
                          </div>
                          <div className="mt-1 h-[34px] sm:h-[38px] text-[11px] sm:text-[12px] leading-snug text-rose-900/55 bday-line-clamp-2">
                            {c.caption}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* duplicate for seamless loop */}
                <div className="bday-marquee__group" aria-hidden="true">
                  {normalizedCards.map((c) => (
                    <div
                      key={`bday-card-b-${c.id}`}
                      className={clsx(
                        "bday-card-aura",
                        "w-[220px] sm:w-[250px] md:w-[270px]",
                        "rounded-2xl",
                        "bg-transparent",
                        "border border-transparent"
                      )}
                    >
                      <div className="relative p-3">
                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-rose-50 border border-black/5">
                          <Image
                            src={c.image.src}
                            alt={c.image.alt}
                            fill
                            sizes="270px"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        {/* flower icon (top-right) */}
                        <div className="pointer-events-none absolute top-5 right-5">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/70 backdrop-blur border border-black/5 shadow-[0_14px_40px_rgba(0,0,0,0.14)]">
                            <Image
                              src={c.icon.src}
                              alt={c.icon.alt}
                              fill
                              sizes="56px"
                              className="object-contain p-2 drop-shadow-[0_12px_26px_rgba(0,0,0,0.18)]"
                              priority={false}
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <div className="font-display text-lg sm:text-xl font-extrabold tracking-[-0.03em] text-rose-950/90 lowercase">
                            {c.name}
                          </div>
                          <div className="mt-1 h-[34px] sm:h-[38px] text-[11px] sm:text-[12px] leading-snug text-rose-900/55 bday-line-clamp-2">
                            {c.caption}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8 sm:pb-10 text-center text-sm sm:text-base tracking-[0.25em] uppercase text-rose-900/50">
          with all my love
        </div>
      </div>
    </div>
  );
}
