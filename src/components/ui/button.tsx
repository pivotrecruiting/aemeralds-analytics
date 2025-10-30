import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center  justify-center gap-2 cursor-pointer whitespace-nowrap rounded-full  transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary active:bg-primary/80 px-8 py-2 pb-2.5 cta h-13 text-primary-foreground shadow-[0px_0px_5.3px_0px_var(--color-primary)] hover:bg-primary/80",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border cta active:bg-background/30 border-primary bg-transparent px-8 py-2 pb-2.5 h-13 text-primary shadow-[0px_0px_5.3px_0px_var(--color-primary)] hover:bg-background/30",
        "outline-mint":
          "border active:bg-background/30 border-mint bg-transparent px-8 py-2 pb-2.5 h-13 text-mint shadow-[0px_0px_5.3px_0px_var(--color-mint)] hover:bg-background/30",
        secondary:
          "bg-secondary active:bg-muted/20 font-normal! px-5 py-2 bg-muted  border border-foreground text-secondary-foreground shadow-xs hover:bg-muted/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary body underline underline-offset-4 hover:text-primary/60 font-normal",
        mint: "bg-mint rounded-full active:bg-mint/80 hover:bg-mint/90 text-card-primary px-8 py-2 pb-2.5 h-13 shadow-[0px_0px_5.3px_0px_var(--color-mint)]",
      },
      size: {
        default: "",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
      focusVisible: {
        true: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      focusVisible: true,
    },
  }
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
      disableFocusRing?: boolean;
    }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disableFocusRing = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const focusVisible = disableFocusRing ? false : true;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, focusVisible, className })
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
