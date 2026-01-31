"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

interface StartButtonProps {
  onStart: () => void;
}

export default function StartButton({ onStart }: StartButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    onStart();
    // Reset click state after animation if needed, but for V1 we just start
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 z-10 relative">
      <div className="relative">
        {/* Pulse Ring */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-rose-300"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}

        {/* Button */}
        <motion.button
          onClick={handleClick}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 15px rgba(253, 164, 175, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          className={clsx(
            "relative px-10 py-4 rounded-full",
            "bg-white/80 backdrop-blur-sm",
            "border border-rose-200",
            "text-rose-900 font-medium text-lg tracking-widest uppercase",
            "shadow-sm transition-colors duration-300",
            "hover:bg-white hover:border-rose-300",
            "outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-rose-50",
          )}
        >
          Start
        </motion.button>
      </div>

      {/* Subtext */}
    </div>
  );
}
