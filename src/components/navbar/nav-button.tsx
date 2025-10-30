import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 [&_svg]:size-4 [&_svg]:shrink-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 [&_svg]:size-4 [&_svg]:shrink-0",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 [&_svg]:size-4 [&_svg]:shrink-0",
        ghost:
          "hover:bg-accent hover:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        link: "relative group cursor-pointer",
      },
      size: {
        default: "text-sm px-2 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      // Link-specific padding sizes for the background
      linkSize: {
        default: "", // Will use default padding defined in component
        sm: "", // Will use small padding defined in component
        md: "", // Will use medium padding defined in component
        lg: "", // Will use large padding defined in component
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      linkSize: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const NavButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, linkSize, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Add a wrapper for link variant to create the hover effect
    if (variant === "link") {
      // Define custom link sizes independent of button sizes
      let marginClass = "-m-1"; // Default - Porsche style

      if (linkSize === "sm") {
        marginClass = "-m-0.5"; // Extra small
      } else if (linkSize === "md") {
        marginClass = "-m-1.5"; // Medium
      } else if (linkSize === "lg") {
        marginClass = "-m-2"; // Large
      }

      return (
        <Comp
          className={cn(buttonVariants({ variant, size, linkSize, className }))}
          ref={ref}
          {...props}
        >
          <span className="relative inline-flex items-center">
            {props.children}
            <span
              className={`absolute inset-0 -z-10 ${marginClass} group-hover:bg-accent rounded-sm bg-transparent`}
            ></span>
          </span>
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, linkSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NavButton.displayName = "Button";

export { NavButton, buttonVariants };
