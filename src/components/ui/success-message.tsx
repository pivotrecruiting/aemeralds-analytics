import React from "react";
import { cn } from "@/lib/utils";

type SuccessMessageProps = {
  message: string | null | undefined;
  className?: string;
};

export const SuccessMessage = ({ message, className }: SuccessMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "text-success absolute -bottom-12 left-0 text-sm font-medium",
        className
      )}
    >
      {message}
    </div>
  );
};
