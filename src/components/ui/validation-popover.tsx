"use client";

import { AlertCircle, CheckCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ValidationErrorT = {
  message: string;
  isValidated: boolean;
};

export type ValidationPopoverBgT =
  | "background"
  | "card"
  | "input"
  | "accent"
  | "muted";

type ValidationPopoverPropsT = {
  error?:
    | string
    | string[]
    | ValidationErrorT[]
    | (string | ValidationErrorT)[];
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  inputRef?:
    | React.RefObject<HTMLInputElement | null>
    | ((instance: HTMLInputElement | null) => void)
    | null;
  bgVariant?: ValidationPopoverBgT;
};

export default function ValidationPopover({
  error,
  className = "",
  isOpen,
  onOpenChange,
  inputRef,
  bgVariant = "muted",
}: ValidationPopoverPropsT) {
  // Handle different error types and convert to ValidationErrorT[]
  const getValidationErrors = (): ValidationErrorT[] => {
    if (!error) return [];

    if (Array.isArray(error)) {
      return error.map((err) => {
        if (typeof err === "string") {
          return { message: err, isValidated: false };
        } else if (typeof err === "object" && "message" in err) {
          return err as ValidationErrorT;
        }
        return { message: String(err), isValidated: false };
      });
    }

    return [{ message: String(error), isValidated: false }];
  };

  const errors = getValidationErrors();
  const allValidated = errors.every((error) => error.isValidated);

  // Controlled state for popover
  const [open, setOpen] = useState(false);
  const isControlled = isOpen !== undefined;
  const currentOpen = isControlled ? isOpen : open;
  const handleOpenChange = isControlled ? onOpenChange : setOpen;

  // Auto-close when errors are resolved (only for uncontrolled mode)
  useEffect(() => {
    if (!isControlled && open) {
      if (allValidated) {
        setOpen(false);
      }
    }
  }, [errors, open, isControlled, allValidated]);

  // Handle popover open to maintain input focus
  const handleOpenChangeWithFocus = (newOpen: boolean) => {
    handleOpenChange?.(newOpen);

    // If opening popover, ensure input stays focused
    if (newOpen && inputRef && "current" in inputRef && inputRef.current) {
      // Small delay to ensure popover is rendered
      setTimeout(() => {
        if (inputRef && "current" in inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // Get background class based on variant
  const getBackgroundClass = () => {
    switch (bgVariant) {
      case "background":
        return "bg-background";
      case "input":
        return "bg-input";
      case "accent":
        return "bg-accent";
      case "muted":
        return "bg-muted";
      case "card":
      default:
        return "bg-card";
    }
  };

  // Get arrow border class based on variant
  const getArrowBorderClass = () => {
    switch (bgVariant) {
      case "background":
        return "border-t-background";
      case "input":
        return "border-t-input";
      case "accent":
        return "border-t-accent";
      case "muted":
        return "border-t-muted";
      case "card":
      default:
        return "border-t-card";
    }
  };

  if (errors.length === 0) return null;

  return (
    <Popover open={currentOpen} onOpenChange={handleOpenChangeWithFocus}>
      <PopoverTrigger asChild>
        {allValidated ? (
          <CheckCircle
            className={`absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 cursor-pointer text-green-300 ${className}`}
            onMouseDown={(e) => {
              // Prevent focus loss when clicking the icon
              e.preventDefault();
            }}
          />
        ) : (
          <AlertCircle
            className={`text-destructive absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 cursor-pointer ${className}`}
            onMouseDown={(e) => {
              // Prevent focus loss when clicking the icon
              e.preventDefault();
            }}
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className={`${getBackgroundClass()} relative mb-7 max-w-xs border-0 p-3`}
        onOpenAutoFocus={(e) => {
          // Prevent auto-focus on popover content
          e.preventDefault();
          // Return focus to input
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        {/* Arrow pointing down to input */}
        <div
          className={`${getArrowBorderClass()} absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-9 border-r-9 border-l-9 border-transparent`}
        ></div>

        <ul className="space-y-1 text-sm">
          {errors.map((errorItem, index) => (
            <li key={index} className="flex items-start gap-2">
              {errorItem.isValidated ? (
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-300" />
              ) : (
                <AlertCircle className="text-destructive mt-0.5 h-4 w-4 flex-shrink-0" />
              )}
              <span className={errorItem.isValidated ? "text-white" : ""}>
                {errorItem.message}
              </span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
