"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

type ContentSwitchProps = {
  children: ReactNode;
  id: string | number; // Eindeutige ID zur Identifizierung des Inhalts
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
};

/**
 * ContentSwitch ist eine Komponente zum animierten Wechseln zwischen verschiedenen Inhalten
 *
 * @param children - Der aktuelle Inhalt
 * @param id - Eindeutige ID, die sich ändert, wenn der Inhalt wechselt
 * @param direction - Richtung der Animation (Standard: "up")
 * @param duration - Dauer der Animation in Sekunden (Standard: 0.2)
 * @param className - Optionale CSS-Klassen
 */
export default function ContentSwitch({
  children,
  id,
  direction = "up",
  duration = 0.2,
  className = "",
}: ContentSwitchProps) {
  // Bestimme die Animation basierend auf der Richtung
  const getAnimationProps = () => {
    switch (direction) {
      case "up":
        return {
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 0 }, // Nur Fade-Out ohne Bewegung
        };
      case "down":
        return {
          initial: { opacity: 0, y: -15 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 0 }, // Nur Fade-Out ohne Bewegung
        };
      case "left":
        return {
          initial: { opacity: 0, x: 15 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 0 }, // Nur Fade-Out ohne Bewegung
        };
      case "right":
        return {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -15 },
        };
      default:
        return {
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 0 }, // Nur Fade-Out ohne Bewegung
        };
    }
  };

  const { initial, animate, exit } = getAnimationProps();

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={{
            duration,
            ease: "easeOut",
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
