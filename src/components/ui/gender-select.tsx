import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import ValidationPopover from "./validation-popover";
import type {
  ValidationErrorT,
  ValidationPopoverBgT,
} from "./validation-popover";
import type { GenderT } from "@/types/users";

export type GenderSelectPropsT = {
  label: string;
  className?: string;
  value: GenderT;
  onChange: (value: GenderT) => void;
  error?:
    | string
    | string[]
    | ValidationErrorT[]
    | (string | ValidationErrorT)[];
  bgVariant?: ValidationPopoverBgT;
};

export default function GenderSelect({
  label,
  className,
  value,
  onChange,
  error,
  bgVariant = "card",
}: GenderSelectPropsT) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const options = [
    { id: "male", label: "Männlich" },
    { id: "female", label: "Weiblich" },
    { id: "divers", label: "Divers" },
    { id: null, label: "Keine Angabe" },
  ];

  // Handle different error types
  const hasError = Boolean(error);
  const errorMessages = Array.isArray(error) ? error : error ? [error] : [];

  // Convert error messages to strings for display
  const displayErrorMessages = errorMessages.map((err) => {
    if (typeof err === "string") {
      return err;
    } else if (typeof err === "object" && "message" in err) {
      return (err as ValidationErrorT).message;
    }
    return String(err);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Add event listener only when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle select click to show popover if there are errors
  const handleSelectClick = () => {
    if (hasError && displayErrorMessages.length > 0) {
      setPopoverOpen(true);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("inline-block", className)} ref={selectRef}>
      <div className="mb-1.5 pb-0.5 pl-1">{label}</div>
      <div className="relative">
        <div
          className={cn(
            "bg-input flex h-12 w-auto cursor-pointer items-center justify-between rounded-full pr-2 pl-4 text-[16px] text-nowrap outline-none focus:border-transparent focus:bg-[#43475C] focus:ring-2 focus:outline",
            hasError ? "outline-destructive outline" : ""
          )}
          onClick={handleSelectClick}
        >
          <span>
            {options.find((option) => option.id === value)?.label ||
              "Wähle dein Geschlecht"}
          </span>
          <div className="flex h-full items-center justify-center p-3">
            <ChevronDown
              className={cn(
                "size-5 transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* ValidationPopover for error display */}
        {hasError && displayErrorMessages.length > 0 && (
          <ValidationPopover
            error={errorMessages as (string | ValidationErrorT)[]}
            isOpen={popoverOpen}
            onOpenChange={setPopoverOpen}
            bgVariant={bgVariant}
          />
        )}

        {isOpen && (
          <div className="bg-muted scrollbar-hide absolute z-50 mt-2 max-h-52 w-36 overflow-auto rounded-3xl shadow-lg">
            {options.map((option) => (
              <div
                key={option.id}
                className="hover:bg-secondary/10 title cursor-pointer border-b border-[#889898]/20 px-4 py-3 last:border-0"
                onClick={() => {
                  onChange(option.id as GenderT);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
