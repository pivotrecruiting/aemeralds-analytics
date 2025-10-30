"use client";

import { useRef, useId, useEffect } from "react";
import { ChevronRightIcon } from "lucide-react";
import { LinkAnchor } from "../ui/link-anchor";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ContentSwitch from "../animations/content-switch";
import { MENU_ITEMS, type TMenuItem } from "./menu-items";
import { ScrollableContainer } from "../ui/scrollable-container";
import { CompanyLogo } from "../logos/company-logo";

type DesktopMenuProps = {
  activeSubmenu: TMenuItem | null;
  onMenuItemClick: (item: TMenuItem, e: React.MouseEvent) => void;
  activeNavLinkRef: React.MutableRefObject<HTMLAnchorElement | null>;
};

export default function DesktopMenu({
  activeSubmenu,
  onMenuItemClick,
  activeNavLinkRef,
}: DesktopMenuProps) {
  const submenuSheetRef = useRef<HTMLDivElement>(null);
  const submenuId = useId();
  const activeSubmenuId = activeSubmenu
    ? `${submenuId}-${activeSubmenu.href.replace(/\//g, "-")}`
    : undefined;

  // Setzen des Keyboard-Fokus auf das erste Submenu-Element
  useEffect(() => {
    if (!activeSubmenu || !submenuSheetRef.current) return;

    // Ersten Link im aktiven Submenu finden und fokussieren
    const submenuId = `desktop-submenu-${activeSubmenu.href}`;
    const submenuEl = document.getElementById(submenuId);
    if (!submenuEl) return;

    // Kurze Verzögerung, um DOM-Updates abzuwarten
    const focusFirstLink = () => {
      const firstLink = submenuEl.querySelector(
        'a[role="menuitem"]'
      ) as HTMLElement | null;
      if (firstLink) {
        firstLink.focus();
      }
    };

    const timer = setTimeout(focusFirstLink, 100);
    return () => clearTimeout(timer);
  }, [activeSubmenu]);

  // Event-Handler für Tab-Navigation im Submenu
  useEffect(() => {
    if (!activeSubmenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const submenuId = `desktop-submenu-${activeSubmenu.href}`;
        const submenuEl = document.getElementById(submenuId);
        if (!submenuEl) return;

        // Alle fokussierbaren Elemente im Submenu finden
        const focusableElements = submenuEl.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements.length === 0) return;

        const lastElement = focusableElements[focusableElements.length - 1];

        // Wenn wir das letzte Element erreichen und Tab drücken (vorwärts)
        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          // Fokus zurück zum aktiven Navlink setzen
          if (activeNavLinkRef.current) {
            activeNavLinkRef.current.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSubmenu, activeNavLinkRef]);

  return (
    <>
      {/* Desktop: Haupt-Menü */}
      <SheetHeader className="pb-4">
        <SheetTitle>
          <CompanyLogo />
        </SheetTitle>

        <SheetDescription className="sr-only">Hauptnavigation</SheetDescription>
      </SheetHeader>

      <nav aria-label="Hauptnavigation">
        <ul className="mt-4 space-y-1" role="menu">
          {MENU_ITEMS.map((item) => (
            <li key={item.href} role="none">
              <LinkAnchor
                className={`text-foreground flex items-center justify-between px-2 py-2 text-lg font-semibold ${
                  activeSubmenu?.href === item.href ? "rounded bg-gray-100" : ""
                }`}
                href={item.href}
                onClick={(e) => item.children && onMenuItemClick(item, e)}
                role="menuitem"
                aria-haspopup={!!item.children}
                aria-expanded={activeSubmenu?.href === item.href}
                aria-controls={
                  item.children && activeSubmenu?.href === item.href
                    ? activeSubmenuId
                    : undefined
                }
                ref={
                  activeSubmenu?.href === item.href
                    ? activeNavLinkRef
                    : undefined
                }
              >
                {item.title}
                {item.children && (
                  <ChevronRightIcon
                    className="size-5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                )}
              </LinkAnchor>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop: Submenu erscheint rechts neben dem Hauptmenü */}
      {activeSubmenu && (
        <div
          className="absolute top-0 bottom-0 left-full w-[400px] overflow-hidden border-l bg-white"
          ref={submenuSheetRef}
          role="region"
          aria-labelledby={`${activeSubmenuId}-heading`}
          id={`desktop-submenu-${activeSubmenu.href}`}
        >
          <ContentSwitch
            id={`desktop-submenu-${activeSubmenu.href}`}
            direction="up"
            className="h-full"
          >
            <div className="flex h-full flex-col p-8 pt-20">
              <h2
                id={`${activeSubmenuId}-heading`}
                className="mb-2 text-lg font-semibold"
              >
                {activeSubmenu.title}
              </h2>

              <ScrollableContainer
                maxHeight="calc(100vh - 180px)"
                className=""
                containerClassName="flex-1"
              >
                <nav aria-label={`${activeSubmenu.title} Untermenü`}>
                  <ul className="space-y-2.5 pb-24" role="menu">
                    {activeSubmenu.children?.map((subItem) => (
                      <li key={subItem.href} role="none">
                        <LinkAnchor
                          className="text-md font-normal"
                          href={subItem.href}
                          role="menuitem"
                        >
                          {subItem.title}
                        </LinkAnchor>
                      </li>
                    ))}
                  </ul>
                </nav>
              </ScrollableContainer>
            </div>
          </ContentSwitch>
        </div>
      )}
    </>
  );
}
