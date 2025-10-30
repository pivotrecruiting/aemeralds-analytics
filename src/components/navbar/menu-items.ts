/**
 * Type definition for a menu item
 */
export type TMenuItem = {
  title: string;
  href: string;
  children?: TMenuItem[];
};

/**
 * Main menu structure for navigation
 * Template menu items - customize for your specific project needs
 */
export const MENU_ITEMS: TMenuItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
    children: [
      { title: "All Products", href: "/products" },
      { title: "Category 1", href: "/products/category-1" },
      { title: "Category 2", href: "/products/category-2" },
      { title: "Featured", href: "/products/featured" },
    ],
  },
  {
    title: "Services",
    href: "/services",
    children: [
      { title: "Service 1", href: "/services/service-1" },
      { title: "Service 2", href: "/services/service-2" },
      { title: "Consulting", href: "/services/consulting" },
    ],
  },
  {
    title: "Resources",
    href: "/resources",
    children: [
      { title: "Blog", href: "/blog" },
      { title: "Documentation", href: "/docs" },
      { title: "FAQ", href: "/faq" },
      { title: "Downloads", href: "/downloads" },
    ],
  },
  {
    title: "Company",
    href: "/company",
    children: [
      { title: "About Us", href: "/about" },
      { title: "Team", href: "/team" },
      { title: "Careers", href: "/careers" },
      { title: "News", href: "/news" },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

/**
 * Example of how to extend menu items for specific projects
 * Uncomment and modify as needed
 */
// export const PROJECT_SPECIFIC_MENU_ITEMS: TMenuItem[] = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     children: [
//       { title: "Analytics", href: "/dashboard/analytics" },
//       { title: "Settings", href: "/dashboard/settings" },
//     ],
//   },
//   // Add your project-specific menu items here
// ];
