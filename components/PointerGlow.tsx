"use client";

import { useEffect, useRef } from "react";

export default function PointerGlow() {
  const rafRef = useRef<number | null>(null);
  const latestRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const root = document.documentElement;

    const commit = () => {
      rafRef.current = null;
      const { x, y, active } = latestRef.current;
      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);
      root.style.setProperty("--pointer-active", active ? "1" : "0");
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(commit);
    };

    const onMove = (e: PointerEvent) => {
      latestRef.current.x = e.clientX;
      latestRef.current.y = e.clientY;
      latestRef.current.active = true;
      schedule();
    };
    const onLeave = () => {
      latestRef.current.active = false;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    // Initialize to center-ish so first paint looks nice.
    latestRef.current = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.35,
      active: false,
    };
    schedule();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div className="pointer-glow pointer-events-none fixed inset-0 z-[2]" aria-hidden="true" />;
}

