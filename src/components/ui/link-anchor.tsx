import * as React from "react";
import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center text-foreground gap-1 relative hover:bg-accent  group focus-visible:outline-none focus-visible:ring-2 rounded-sm focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "",
        subtle: "text-muted-foreground hover:text-foreground",
        destructive: "text-destructive",
        ghost: "font-normal",
      },
      underline: {
        none: "",
        hover: "hover:underline underline-offset-4",
        always: "underline underline-offset-4",
      },
      size: {
        default: "text-sm px-1 py-0.5 -mx-1",
        sm: "text-xs px-0.5 py-0.5 -mx-0.5",
        md: "text-sm px-1.5 py-1 -mx-1.5",
        lg: "text-base px-1.5 py-1 -mx-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      underline: "none",
      size: "default",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  asNextLink?: boolean;
}

const LinkAnchor = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      href,
      variant,
      underline,
      size,
      asNextLink = true,
      children,
      ...props
    },
    ref
  ) => {
    // Vereinfachte Implementierung mit direktem Padding und Hintergrund
    if (asNextLink && !href.startsWith("http")) {
      return (
        <NextLink
          href={href}
          className={cn(linkVariants({ variant, underline, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </NextLink>
      );
    }

    return (
      <a
        href={href}
        className={cn(linkVariants({ variant, underline, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  }
);

LinkAnchor.displayName = "LinkAnchor";

export { LinkAnchor, linkVariants };
