"use client";

import { cn } from "@/lib/utils";
import React, { type ReactNode, useRef, useState, useEffect } from "react";

type TScrollableContainerProps = {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
  topGradientClassName?: string;
  bottomGradientClassName?: string;
  containerClassName?: string;
};

/**
 * A reusable component that makes content scrollable with gradient fades at top and bottom
 * when content overflows the container
 */
export function ScrollableContainer({
  children,
  className,
  maxHeight = "calc(100vh - 200px)",
  topGradientClassName,
  bottomGradientClassName,
  containerClassName,
}: TScrollableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);

  // Aktualisiert die Gradient-Anzeige basierend auf der Scroll-Position
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // Zeigt den oberen Gradient, wenn nicht ganz oben
    setShowTopGradient(scrollTop > 10);

    // Zeigt den unteren Gradient, wenn nicht ganz unten
    setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
  };

  // Initial und bei Änderung der Kinder auf Overflow prüfen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prüft, ob Container scrollbar ist (Inhalt größer als Container)
    const checkOverflow = () => {
      const hasOverflow = container.scrollHeight > container.clientHeight;
      setShowBottomGradient(hasOverflow);
    };

    checkOverflow();

    // Initialen Scroll-Handler ausführen
    handleScroll();

    // Event-Listener für Resize hinzufügen
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [children]);

  return (
    <div className={cn("relative h-full", containerClassName)}>
      {/* Oberer Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 right-0 left-0 z-10 h-8 bg-gradient-to-b to-transparent opacity-0 transition-opacity duration-200",
          showTopGradient ? "opacity-100" : "opacity-0",
          topGradientClassName
        )}
        aria-hidden="true"
      />

      {/* Scrollbarer Container */}
      <div
        ref={containerRef}
        className={cn("-mx-4 h-full overflow-y-auto px-4 py-2", className)}
        style={{ maxHeight }}
        onScroll={handleScroll}
      >
        {children}
      </div>

      {/* Unterer Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-200",
          showBottomGradient ? "opacity-100" : "opacity-0",
          bottomGradientClassName
        )}
        aria-hidden="true"
      />
    </div>
  );
}
