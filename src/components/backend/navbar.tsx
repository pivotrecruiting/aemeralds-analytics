"use client";

import { LinkAnchor } from "@/components/ui/link-anchor";
import { Bell, Menu, X } from "lucide-react";
import { NavButton } from "@/components/navbar/nav-button";
import Container from "@/components/container";
import UserDropdown from "../ui/user-dropdown";
import Link from "next/link";
import { CompanyLogo } from "../logos/company-logo";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { PublicUserT } from "@/lib/dal";
import { Skeleton } from "@/components/ui/skeleton";

export function NavbarClient({ user }: { user: PublicUserT }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className="border-b pr-3 pl-0 sm:px-4 lg:px-10"
      aria-label="Backend-Navigation"
    >
      <Container>
        <div className="flex items-center justify-between py-2">
          <Link href="/">
            <CompanyLogo />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 py-3 md:flex">
            <LinkAnchor
              className={`font-medium transition-colors ${
                isActive("/dashboard")
                  ? "text-primary bg-primary/10 border-primary/20 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 rounded-md border px-2 py-1 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              size="md"
              href="/"
            >
              Dashboard
            </LinkAnchor>
          </div>
          {/* Mobile Menu Toggle & User */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleMenu}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-2 transition-colors"
              aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <UserDropdown user={user} />
          </div>
          {/* Desktop User & Notifications */}
          <div className="hidden items-center gap-2 md:flex">
            <NavButton
              variant="link"
              linkSize="lg"
              className="svg-crisp"
              aria-label="Benachrichtigungen öffnen"
            >
              <Bell strokeWidth={2} size={20} />
            </NavButton>
            <UserDropdown user={user} />
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t px-4 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <LinkAnchor
                className={`block py-2 font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "text-primary bg-primary/10 border-primary/20 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 rounded-md border px-3 py-1.5 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                size="md"
                href="/"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </LinkAnchor>
              <LinkAnchor
                className={`block py-2 font-medium transition-colors ${
                  isActive("/account")
                    ? "text-primary bg-primary/10 border-primary/20 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 rounded-md border px-3 py-1.5 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                size="md"
                href="/account"
                onClick={() => setIsOpen(false)}
              >
                Profil
              </LinkAnchor>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}

export function NavbarSkeleton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className="border-b pr-3 pl-0 sm:px-4 lg:px-10"
      aria-label="Backend-Navigation"
    >
      <Container>
        <div className="flex items-center justify-between py-2">
          <Link href="/">
            <CompanyLogo />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 py-3 md:flex">
            <LinkAnchor
              className={`font-medium transition-colors ${
                isActive("/")
                  ? "text-primary bg-primary/10 border-primary/20 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 rounded-md border px-2 py-1 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              size="md"
              href="/"
            >
              Dashboard
            </LinkAnchor>
          </div>
          {/* Mobile Menu Toggle & User */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleMenu}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-2 transition-colors"
              aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            {/* Avatar Skeleton instead of user dropdown trigger */}
            <Skeleton className="aspect-square size-10 rounded-full border border-white" />
          </div>
          {/* Desktop User & Notifications */}
          <div className="hidden items-center gap-2 md:flex">
            <NavButton
              variant="link"
              linkSize="lg"
              className="svg-crisp"
              aria-label="Benachrichtigungen öffnen"
            >
              <Bell strokeWidth={2} size={20} />
            </NavButton>
            {/* Avatar Skeleton instead of user dropdown trigger */}
            <Skeleton className="aspect-square size-10 rounded-full border border-white" />
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t px-4 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <LinkAnchor
                className={`block py-2 font-medium transition-colors ${
                  isActive("/")
                    ? "text-primary bg-primary/10 border-primary/20 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 rounded-md border px-3 py-1.5 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                size="md"
                href="/"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </LinkAnchor>
              <LinkAnchor
                className={`block py-2 font-medium transition-colors ${
                  isActive("/account")
                    ? "text-primary bg-primary/10 border-primary/20 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 rounded-md border px-3 py-1.5 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                size="md"
                href="/account"
                onClick={() => setIsOpen(false)}
              >
                Profil
              </LinkAnchor>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}
