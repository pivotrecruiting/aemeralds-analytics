import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import Container from "./container";
import { LinkAnchor } from "./ui/link-anchor";
import React from "react";

// Footer menu data structure -  // TODO: REPLACE WITH YOUR ACTUAL DATA
const FOOTER_MENU_SECTIONS = [
  {
    id: "contact",
    title: "Contact",
    links: [
      { href: "/contact", title: "Contact & Directions" },
      { href: "/opening-hours", title: "Opening Hours" },
      { href: "/team", title: "Our Team" },
    ],
  },
  {
    id: "services",
    title: "Services",
    links: [
      { href: "/services", title: "Our Services" },
      { href: "/portfolio", title: "Portfolio" },
      { href: "/pricing", title: "Pricing" },
      { href: "/consultation", title: "Free Consultation" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { href: "/help", title: "Help Center" },
      { href: "/documentation", title: "Documentation" },
      { href: "/tutorials", title: "Tutorials" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { href: "/about", title: "About Us" },
      { href: "/careers", title: "Careers" },
      { href: "/news", title: "News & Updates" },
    ],
  },
];

// REPLACE WITH YOUR ACTUAL LEGAL LINKS
const LEGAL_LINKS = [
  { href: "/cookie-policy", title: "Cookie Policy" },
  { href: "/imprint", title: "Imprint" },
  { href: "/privacy", title: "Privacy Policy" },
  { href: "/terms", title: "Terms of Service" },
  { href: "/accessibility", title: "Accessibility" },
  { href: "/contact", title: "Contact" },
];

// REPLACE WITH YOUR ACTUAL SOCIAL MEDIA LINKS
const SOCIAL_LINKS = [
  {
    href: "https://facebook.com/your-company",
    label: "Facebook",
    icon: FaFacebook,
    hoverColor: "hover:text-blue-600",
  },
  {
    href: "https://tiktok.com/@your-company",
    label: "TikTok",
    icon: FaTiktok,
    hoverColor: "hover:text-black",
  },
  {
    href: "https://instagram.com/your-company",
    label: "Instagram",
    icon: FaInstagram,
    hoverColor: "hover:text-pink-600",
  },
  {
    href: "https://linkedin.com/company/your-company",
    label: "LinkedIn",
    icon: FaLinkedin,
    hoverColor: "hover:text-blue-700",
  },
];

// Centralized styles
const styles = {
  sectionHeading: "text-md font-medium text-primary-foreground",
  menuLink:
    "text-sm text-primary-foreground font-normal transition-colors hover:text-black",
  legalLink:
    "text-xs text-primary-foreground  transition-colors hover:text-foreground",
  socialLink: "text-primary-foreground transition-colors",
  separator: "text-muted-foreground",
};

export default function Footer() {
  return (
    <footer className="border-t bg-[oklch(0.3_0.05_251.81)]">
      {/* Main Footer Content */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Menu Sections */}
            {FOOTER_MENU_SECTIONS.map((section) => (
              <nav
                key={section.id}
                className="space-y-4"
                aria-labelledby={`${section.id}-heading`}
              >
                <h3
                  id={`${section.id}-heading`}
                  className={styles.sectionHeading}
                >
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <LinkAnchor href={link.href} className={styles.menuLink}>
                        {link.title}
                      </LinkAnchor>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom Footer */}
      <section className="py-6">
        <Container>
          <div className="flex flex-col items-start justify-between space-y-4 sm:items-center lg:flex-row lg:space-y-0">
            {/* Legal Links */}
            <nav aria-label="Legal Information">
              <ul className="flex flex-wrap justify-start gap-4 lg:justify-start">
                {LEGAL_LINKS.map((link, index) => (
                  <React.Fragment key={`legal-item-${index}`}>
                    <li>
                      <LinkAnchor href={link.href} className={styles.legalLink}>
                        {link.title}
                      </LinkAnchor>
                    </li>
                    {index < LEGAL_LINKS.length - 1 && (
                      <li>
                        <span className={styles.separator}>|</span>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </nav>

            {/* Social Media Links */}
            <nav aria-label="Social Media">
              <ul className="my-6 flex space-x-4">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.href}>
                    <LinkAnchor
                      href={social.href}
                      className={`${styles.socialLink} ${social.hoverColor}`}
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </LinkAnchor>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </section>
    </footer>
  );
}
