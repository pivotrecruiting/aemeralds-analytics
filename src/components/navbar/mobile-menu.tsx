"use client";

import { useId } from "react";
import { ChevronRightIcon, ArrowLeftIcon } from "lucide-react";
import { LinkAnchor } from "../ui/link-anchor";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { MENU_ITEMS } from "./menu-items";
import { ContentSwitch } from "../animations";
import { ScrollableContainer } from "../ui/scrollable-container";
import { CompanyLogo } from "../logos/company-logo";
import type { TMenuItem } from "./menu-items";

/**
 * Props für die MobileMenu-Komponente
 */
type MobileMenuProps = {
  activeSubmenu: TMenuItem | null;
  onMenuItemClick: (item: TMenuItem, e: React.MouseEvent) => void;
  onBackClick: () => void;
};

/**
 * Mobile Menü-Komponente für die Navigation in der Sidebar
 */
export default function MobileMenu(props: MobileMenuProps) {
  const { activeSubmenu, onMenuItemClick, onBackClick } = props;

  // Eindeutige ID für die Content-Switch-Animation basierend auf dem aktiven Menü
  const contentId = activeSubmenu
    ? `submenu-${activeSubmenu.href}`
    : "main-menu";
  const mobileMenuId = useId();
  const activeSubmenuId = activeSubmenu
    ? `${mobileMenuId}-${activeSubmenu.href.replace(/\//g, "-")}`
    : undefined;

  // Stellt sicher, dass MENU_ITEMS korrekt typisiert ist
  const typedMenuItems: TMenuItem[] = MENU_ITEMS;

  // Rendert das aktive Untermenü
  const renderSubmenu = () => {
    if (!activeSubmenu) return null;

    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <Button
            variant="link"
            size="lg"
            onClick={onBackClick}
            className="-mt-2 mb-8 -ml-4 flex items-center justify-between text-sm font-medium no-underline"
            aria-label="Zurück zum Hauptmenü"
          >
            <ArrowLeftIcon className="mr-2 size-4" aria-hidden="true" />
            Zurück
          </Button>
        </div>

        <h2
          id={`${activeSubmenuId}-heading`}
          className="text-md mb-2 font-semibold"
        >
          {activeSubmenu.title}
        </h2>

        <div
          className="flex-1"
          role="region"
          aria-labelledby={`${activeSubmenuId}-heading`}
          id={`submenu-${activeSubmenu.href}`}
        >
          <ScrollableContainer
            maxHeight="calc(100vh - 180px)"
            className="pb-24"
          >
            <nav aria-label={`${activeSubmenu.title} Untermenü`}>
              <ul className="space-y-1.5" role="menu">
                {activeSubmenu.children?.map((subItem) => (
                  <li key={subItem.href} role="none">
                    <LinkAnchor
                      size="lg"
                      className="text-secondary-foreground py-1.5 text-[16px] font-normal"
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
      </div>
    );
  };

  // Rendert das Hauptmenü
  const renderMainMenu = () => {
    return (
      <>
        <SheetHeader className="pb-4">
          <SheetTitle>
            <CompanyLogo />
          </SheetTitle>

          <SheetDescription className="sr-only">
            Hauptnavigation
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1">
          <ScrollableContainer maxHeight="calc(100vh - 140px)">
            <nav aria-label="Hauptnavigation">
              <ul className="mt-4 space-y-1" role="menu">
                {typedMenuItems.map((item) => {
                  const isActive = activeSubmenu?.href === item.href;
                  const submenuId = isActive
                    ? `submenu-${item.href}`
                    : undefined;

                  return (
                    <li key={item.href} role="none">
                      <LinkAnchor
                        className="text-foreground flex items-center justify-between py-2 text-lg font-semibold"
                        href={item.href}
                        onClick={(e) =>
                          item.children && onMenuItemClick(item, e)
                        }
                        role="menuitem"
                        aria-haspopup={!!item.children}
                        aria-expanded={isActive ? true : undefined}
                        aria-controls={
                          item.children && isActive ? submenuId : undefined
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
                  );
                })}
              </ul>
            </nav>
          </ScrollableContainer>
        </div>
      </>
    );
  };

  return (
    <ContentSwitch id={contentId}>
      {activeSubmenu ? renderSubmenu() : renderMainMenu()}
    </ContentSwitch>
  );
}
