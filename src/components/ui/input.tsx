"use client";
import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import ValidationPopover, {
  type ValidationErrorT,
  type ValidationPopoverBgT,
} from "./validation-popover";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Additional props
  error?:
    | boolean
    | string
    | string[]
    | ValidationErrorT[]
    | (string | ValidationErrorT)[];
  helperText?: string;
  containerClassName?: string;
  showPasswordToggle?: boolean;
  bgVariant?: ValidationPopoverBgT;
}

export interface InputWithLabelProps extends InputProps {
  label?: string;
  labelClassName?: string;
  showPasswordToggle?: boolean;
  onValidation?: (field: string, value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error = false,
      helperText,
      containerClassName,
      showPasswordToggle, // Add this prop
      bgVariant = "muted",
      ...props
    },
    ref
  ) => {
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Base input styles
    const inputStyles = cn(
      "bg-input rounded-full px-4 py-3 w-full text-[16px] ",
      "outline-none focus:outline focus:outline-none focus:border-transparent focus:ring-0",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      error ? "outline outline-destructive" : "border-transparent",
      className
    );

    // Determine if there's an error (either boolean true, non-empty string, or non-empty array)
    const hasError = Boolean(error);

    // Handle different error types
    let errorMessages: (string | ValidationErrorT)[] = [];
    if (typeof error === "string" && error) {
      errorMessages = [error];
    } else if (Array.isArray(error)) {
      errorMessages = error.filter((msg) => {
        if (typeof msg === "string") return msg;
        if (typeof msg === "object" && "message" in msg) {
          return (msg as ValidationErrorT).message;
        }
        return false;
      });
    }

    // If error is a string, use it as helperText (for backward compatibility)
    const displayHelperText = typeof error === "string" ? error : helperText;

    // Don't show ValidationTooltip if it's a password field with toggle
    const isPasswordWithToggle = type === "password" && showPasswordToggle;

    // Handle input focus to keep popover open
    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (hasError && errorMessages.length > 0) {
        setPopoverOpen(true);
      }
      // Call original onFocus if provided
      props.onFocus?.(e);
    };

    // Handle touch events for mobile devices
    const handleTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
      if (hasError && errorMessages.length > 0) {
        setPopoverOpen(true);
      }
      // Call original onTouchStart if provided
      props.onTouchStart?.(e);
    };

    // Handle input change to update popover state
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Keep popover open if there are still errors
      if (hasError && errorMessages.length > 0) {
        setPopoverOpen(true);
      }
      // Call original onChange if provided
      props.onChange?.(e);
    };

    return (
      <div className="flex w-full flex-col">
        <div className={cn("relative", containerClassName)}>
          <input
            type={type}
            className={inputStyles}
            ref={ref}
            {...props}
            onFocus={handleInputFocus}
            onTouchStart={handleTouchStart}
            onChange={handleInputChange}
          />

          {/* Error Icon with Popover - nur anzeigen wenn kein Passwort-Toggle */}
          {hasError && errorMessages.length > 0 && !isPasswordWithToggle && (
            <ValidationPopover
              error={errorMessages as (string | ValidationErrorT)[]}
              isOpen={popoverOpen}
              onOpenChange={setPopoverOpen}
              inputRef={ref}
              bgVariant={bgVariant}
            />
          )}

          {/* Absolut positionierte Fehlermeldung (nur für non-error helper text) */}
          {displayHelperText && !hasError && (
            <p
              className={cn(
                "absolute -bottom-5 left-1 text-sm",
                "text-foreground/70"
              )}
            >
              {displayHelperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      className,
      label,
      labelClassName,
      id,
      type,
      showPasswordToggle = false,
      error,
      onValidation,
      bgVariant = "muted",
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    // Nur für Passwort-Felder anwenden und wenn Toggle aktiviert ist
    const isPassword = type === "password";
    const showToggle = isPassword && showPasswordToggle;

    // Aktueller Input-Typ basierend auf Sichtbarkeit
    const currentType = isPassword && isPasswordVisible ? "text" : type;

    // Error handling
    const hasError = Boolean(error);

    // Handle different error types
    let errorMessages: (string | ValidationErrorT)[] = [];
    if (typeof error === "string" && error) {
      errorMessages = [error];
    } else if (Array.isArray(error)) {
      errorMessages = error.filter((msg) => {
        if (typeof msg === "string") return msg;
        if (typeof msg === "object" && "message" in msg) {
          return (msg as ValidationErrorT).message;
        }
        return false;
      });
    }

    // Handle input focus to keep popover open
    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (hasError && errorMessages.length > 0) {
        setPopoverOpen(true);
      }
      // Call original onFocus if provided
      props.onFocus?.(e);
    };

    // Handle touch events for mobile devices
    const handleTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
      if (hasError && errorMessages.length > 0) {
        setPopoverOpen(true);
      }
      // Call original onTouchStart if provided
      props.onTouchStart?.(e);
    };

    // Handle input change to update popover state
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Keep popover open if there are still errors
      if (hasError && errorMessages.length > 0) {
        setPopoverOpen(true);
      }

      // Call validation if provided
      if (onValidation) {
        onValidation(e.target.name, e.target.value);
      }

      // Call original onChange if provided
      props.onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className={cn("pb-0.5 pl-1", labelClassName)}>
            {label}
          </label>
        )}
        <div className="relative">
          <Input
            id={id}
            className={cn(showToggle && "pr-10", className)}
            type={currentType}
            ref={ref}
            error={showToggle ? undefined : error} // Don't pass error to Input if showToggle is true
            bgVariant={bgVariant}
            {...props}
            onFocus={handleInputFocus}
            onTouchStart={handleTouchStart}
            onChange={handleInputChange}
          />

          {/* Error Icon with Popover for password inputs - positioned left of eye icon */}
          {hasError && errorMessages.length > 0 && showToggle && (
            <ValidationPopover
              error={errorMessages as (string | ValidationErrorT)[]}
              className="right-14"
              isOpen={popoverOpen}
              onOpenChange={setPopoverOpen}
              inputRef={ref}
              bgVariant={bgVariant}
            />
          )}

          {/* Password Toggle Button */}
          {showToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-foreground/80 hover:text-foreground absolute top-3.5 right-5 cursor-pointer"
              aria-label={
                isPasswordVisible ? "Passwort verbergen" : "Passwort anzeigen"
              }
            >
              {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
InputWithLabel.displayName = "InputWithLabel";

export { Input, InputWithLabel };
