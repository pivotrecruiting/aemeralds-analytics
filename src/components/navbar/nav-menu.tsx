"use client";

import { useRef, useState, useEffect, useId, useCallback } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";
import { ArrowRight, User } from "lucide-react";
import { LinkAnchor } from "../ui/link-anchor";
import { type TMenuItem } from "./menu-items";

type NavMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NavMenu({ isOpen, onClose }: NavMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<TMenuItem | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const mainSheetRef = useRef<HTMLDivElement>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navId = useId();
  // Referenz zum aktiven Navlink, um Fokus zurücksetzen zu können
  const activeNavLinkRef = useRef<HTMLAnchorElement | null>(null);
  // Flag, um zu verfolgen, ob wir vom letzten Submenu-Item zurücktabben sollen
  const shouldReturnFocusRef = useRef<boolean>(false);

  // Zurücksetzen des aktiven Untermenüs, wenn das Sheet geschlossen wird
  useEffect(() => {
    const currentTimeout = submenuTimeoutRef.current;
    if (currentTimeout) {
      clearTimeout(currentTimeout);
      submenuTimeoutRef.current = null;
    }

    // Sofort zurücksetzen in beiden Fällen
    setActiveSubmenu(null);
    // Referenzen zurücksetzen
    activeNavLinkRef.current = null;
    shouldReturnFocusRef.current = false;

    return () => {
      const timeoutId = submenuTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen]);

  // Prüft, ob wir auf einem Desktop-Gerät sind
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(
        typeof window !== "undefined" ? window.innerWidth >= 1024 : false
      );
    };

    // Initial prüfen
    checkScreenSize();

    // Event Listener für Resize-Events
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkScreenSize);

      // Cleanup beim Unmount
      return () => {
        window.removeEventListener("resize", checkScreenSize);
      };
    }
  }, []);

  // Hilfsfunktion zum Fokussieren des ersten Links im aktiven Submenu
  const focusFirstSubmenuLink = useCallback(() => {
    if (!activeSubmenu) return;

    // Die ID des Submenus basierend auf der Gerätetyp
    const submenuId = isDesktop
      ? `desktop-submenu-${activeSubmenu.href}`
      : `submenu-${activeSubmenu.href}`;

    // Submenu-Container finden
    const submenuEl = document.getElementById(submenuId);
    if (!submenuEl) return;

    // Ersten Link im Submenu finden und fokussieren
    const firstLink = submenuEl.querySelector(
      'a[role="menuitem"]'
    ) as HTMLElement | null;
    if (firstLink) {
      firstLink.focus();
      // Setzen des Flags auf false, da wir am Anfang des Submenus sind
      shouldReturnFocusRef.current = false;
    }
  }, [activeSubmenu, isDesktop]);

  // Fokus auf erstes Submenu-Element setzen, wenn Submenu aktiviert wird
  useEffect(() => {
    if (!activeSubmenu || !isOpen) return;

    // Kurze Verzögerung, um DOM-Updates abzuwarten
    const timer = setTimeout(focusFirstSubmenuLink, 100);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [activeSubmenu, isOpen, focusFirstSubmenuLink]);

  // Event-Handler für Tab-Navigation
  useEffect(() => {
    if (!isOpen || !activeSubmenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Wenn TAB gedrückt wird
      if (e.key === "Tab") {
        const submenuId = isDesktop
          ? `desktop-submenu-${activeSubmenu.href}`
          : `submenu-${activeSubmenu.href}`;

        const submenuEl = document.getElementById(submenuId);
        if (!submenuEl) return;

        // Alle fokussierbaren Elemente im Submenu finden
        const focusableElements = submenuEl.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Prüfen, ob wir im letzten Element des Submenus sind und Tab drücken (vorwärts tabben)
        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          // Fokus zurück zum aktiven Navlink setzen
          if (activeNavLinkRef.current) {
            activeNavLinkRef.current.focus();
            shouldReturnFocusRef.current = true;
          }
        }

        // Prüfen, ob wir im ersten Element des Submenus sind und Shift+Tab drücken (rückwärts tabben)
        if (e.shiftKey && document.activeElement === firstElement) {
          // Nichts tun, normale Tab-Navigation fortsetzen
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSubmenu, isOpen, isDesktop]);

  // Behandelt Klicks auf Menüpunkte mit Untermenüs
  const handleMenuItemClick = (item: TMenuItem, e: React.MouseEvent) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault();

      // Speichern des geklickten Elements als aktiver NavLink für späteren Focus
      if (e.currentTarget instanceof HTMLAnchorElement) {
        activeNavLinkRef.current = e.currentTarget;
      }

      // Toggle Submenu: Wenn das gleiche Menü aktiv ist, schließen
      if (activeSubmenu?.href === item.href) {
        setActiveSubmenu(null);
      } else {
        setActiveSubmenu(item);
        // Zurücksetzen des Return-Focus-Flags, da ein neues Submenu geöffnet wird
        shouldReturnFocusRef.current = false;
      }
    }
  };

  // Zurück zum Hauptmenü
  const handleBackToMain = () => {
    setActiveSubmenu(null);
    // Fokus zurück zum aktiven Navlink, wenn vorhanden
    if (activeNavLinkRef.current) {
      setTimeout(() => {
        activeNavLinkRef.current?.focus();
      }, 50);
    }
  };

  // CSS-Klasse für Sheet-Breite
  const sheetWidthClasses = "w-full lg:w-[600px] max-w-full";

  return (
    <>
      {/* Haupt-Sheet für alle Geräte */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className={`${sheetWidthClasses}`}
          ref={mainSheetRef}
          aria-labelledby={`${navId}-title`}
          aria-describedby={`${navId}-desc`}
        >
          {/* Mobile oder Desktop Menu basierend auf Bildschirmgröße */}
          {isDesktop ? (
            <DesktopMenu
              activeSubmenu={activeSubmenu}
              onMenuItemClick={handleMenuItemClick}
              activeNavLinkRef={activeNavLinkRef}
            />
          ) : (
            <MobileMenu
              activeSubmenu={activeSubmenu}
              onMenuItemClick={handleMenuItemClick}
              onBackClick={handleBackToMain}
            />
          )}

          <LinkAnchor
            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}`}
            className="group bg-secondary/70 absolute right-0 bottom-0 left-0 z-50 m-6 flex flex-col rounded-md p-3 text-sm"
          >
            <div className="flex h-8 w-full flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-1.5">
                <User size={16} />
                <div className="text-[15px] font-semibold">LOGIN</div>
              </div>
              <ArrowRight
                strokeWidth={1.5}
                size={22}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1 hover:translate-x-1"
              />
            </div>
          </LinkAnchor>
        </SheetContent>
      </Sheet>
    </>
  );
}
