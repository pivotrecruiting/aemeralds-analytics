"use client";

import { useState } from "react";
import Link from "next/link";
import { CompanyLogo } from "../logos/company-logo";
import Container from "../container";
import NavMenu from "./nav-menu";
import StaticNavLinks from "./static-nav-links";
import { NavButton } from "./nav-button";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b" aria-label="Hauptnavigation">
      {/* SEO-freundliche statische Links (für Crawler sichtbar, für Nutzer über sr-only unsichtbar) */}
      <StaticNavLinks />

      <Container>
        {/* Navbar Container */}
        <div className="flex items-center justify-between py-4">
          {/* Logo Container */}

          <Link
            href="/"
            className="flex items-center"
            aria-label="Zurück zur Startseite"
          >
            <CompanyLogo />
          </Link>

          <div className="flex items-center">
            {/* Burger Menu Button für alle Geräte */}
            <NavButton
              variant="link"
              linkSize="lg"
              className="svg-crisp group relative z-50"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="main-menu"
              aria-label="Hauptmenü öffnen"
            >
              <div className="pointer-events-none flex items-center gap-2 select-none">
                <Menu className="size-6" />
                <span className="text-xs font-medium md:text-sm">Menu</span>
              </div>
            </NavButton>

            {/* Navigation mit Sheet */}
            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>
        </div>
      </Container>
    </nav>
  );
}
