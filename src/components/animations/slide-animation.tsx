"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

type SlideDirection = "up" | "down" | "left" | "right";

type SlideAnimationProps = {
  children: ReactNode;
  isVisible: boolean;
  direction?: SlideDirection;
  duration?: number;
  delay?: number;
  className?: string;
  distance?: number;
  slideOnExit?: boolean;
  onExitComplete?: () => void;
};

/**
 * SlideAnimation ist eine wiederverwendbare Komponente für Slide-In/Out-Effekte
 * mit optionalem Fade-Effekt
 *
 * @param children - Der Inhalt, der animiert werden soll
 * @param isVisible - Steuert, ob der Inhalt sichtbar sein soll
 * @param direction - Richtung der Animation (Standard: "up")
 * @param duration - Dauer der Animation in Sekunden (Standard: 0.2)
 * @param delay - Verzögerung vor Beginn der Animation in Sekunden (Standard: 0)
 * @param className - Optionale CSS-Klassen
 * @param distance - Stärke des Slide-Effekts in Pixeln (Standard: 15)
 * @param slideOnExit - Ob der Inhalt beim Ausblenden gleiten soll (Standard: false)
 * @param onExitComplete - Callback-Funktion, die nach Abschluss der Exit-Animation aufgerufen wird
 */
export default function SlideAnimation({
  children,
  isVisible,
  direction = "up",
  duration = 0.2,
  delay = 0,
  className = "",
  distance = 15,
  slideOnExit = false,
  onExitComplete,
}: SlideAnimationProps) {
  // Bestimme die initialen und Exit-Werte basierend auf der Richtung
  const getDirectionValues = (dir: SlideDirection) => {
    switch (dir) {
      case "up":
        return {
          initial: { y: distance },
          exit: slideOnExit ? { y: -distance } : { y: 0 },
        };
      case "down":
        return {
          initial: { y: -distance },
          exit: slideOnExit ? { y: distance } : { y: 0 },
        };
      case "left":
        return {
          initial: { x: distance },
          exit: slideOnExit ? { x: -distance } : { x: 0 },
        };
      case "right":
        return {
          initial: { x: -distance },
          exit: slideOnExit ? { x: distance } : { x: 0 },
        };
      default:
        return {
          initial: { y: distance },
          exit: slideOnExit ? { y: -distance } : { y: 0 },
        };
    }
  };

  const { initial, exit } = getDirectionValues(direction);

  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            ...initial,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
              duration,
              delay,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            ...exit,
            transition: {
              duration,
              ease: "easeOut",
            },
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
