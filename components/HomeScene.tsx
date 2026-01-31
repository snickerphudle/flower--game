"use client";

import { useState } from "react";
import BlossomField from "./BlossomField";
import StartButton from "./StartButton";
import CentralFlower from "./CentralFlower";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeScene() {
  const [started, setStarted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [sceneExited, setSceneExited] = useState(false);

  const handleStart = () => {
    console.log("Experience started!");
    setStarted(true);

    // Start transition immediately
    setShowTransition(true);
  };

  const handleSequenceComplete = () => {
    setSceneExited(true);
  };

  if (sceneExited) {
    // Placeholder for next screen / V2
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <p className="text-rose-300 font-serif italic animate-pulse">
          Loading next memory...
        </p>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-rose-50 bg-paper-texture selection:bg-rose-200">
      {/* Background Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-rose-100/30 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,241,242,0.8)_100%)] pointer-events-none opacity-50" />

      {/* Blossom Field (Background Layer) */}
      <BlossomField count={25} />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div
              key="start-button"
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              <StartButton onStartAction={handleStart} />
            </motion.div>
          )}

          {showTransition && (
            <motion.div
              key="central-flower"
              className="absolute inset-0 flex items-center justify-center"
            >
              <CentralFlower onSequenceComplete={handleSequenceComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Foreground Blur Layer (Parallax depth hint) */}
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </main>
  );
}
