"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FadeAnimationProps = {
  children: ReactNode;
  isVisible: boolean;
  duration?: number;
  delay?: number;
  className?: string;
  slideOffset?: number;
  slideOnExit?: boolean;
  onExitComplete?: () => void;
};

/**
 * FadeAnimation ist eine wiederverwendbare Komponente für Fade-In/Out-Effekte
 *
 * @param children - Der Inhalt, der animiert werden soll
 * @param isVisible - Steuert, ob der Inhalt sichtbar sein soll
 * @param duration - Dauer der Animation in Sekunden (Standard: 0.2)
 * @param delay - Verzögerung vor Beginn der Animation in Sekunden (Standard: 0)
 * @param className - Optionale CSS-Klassen
 * @param slideOffset - Stärke des Slide-Effekts in Pixeln (Standard: 15)
 * @param slideOnExit - Ob der Inhalt beim Ausblenden gleiten soll (Standard: false)
 * @param onExitComplete - Callback-Funktion, die nach Abschluss der Exit-Animation aufgerufen wird
 */
export default function FadeAnimation({
  children,
  isVisible,
  duration = 0.6,
  delay = 0.2,
  className = "",
  slideOffset = 20,
  slideOnExit = false,
  onExitComplete,
}: FadeAnimationProps) {
  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: slideOffset }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            y: slideOnExit ? -slideOffset : 0,
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
