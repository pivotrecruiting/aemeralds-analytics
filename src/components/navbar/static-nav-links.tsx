import Link from "next/link";
import { MENU_ITEMS, type TMenuItem } from "./menu-items";

/**
 * Renders a navigation item and its children recursively
 */
function renderMenuItem(item: TMenuItem, index: number) {
  return (
    <li key={`${item.href}-${index}`} className="navbar-item">
      <Link href={item.href} className="navbar-link">
        {item.title}
      </Link>
      {item.children && item.children.length > 0 && (
        <ul className="navbar-dropdown">
          {item.children.map((child, childIndex) =>
            renderMenuItem(child, childIndex)
          )}
        </ul>
      )}
    </li>
  );
}

/**
 * Server Component that renders all navigation links
 * This ensures search engines can crawl all links even if the nav menu
 * is controlled by client-side JavaScript
 */
export default function StaticNavLinks() {
  return (
    <div className="sr-only">
      <ul className="navbar-items">
        {MENU_ITEMS.map((item, index) => renderMenuItem(item, index))}
      </ul>
    </div>
  );
}
