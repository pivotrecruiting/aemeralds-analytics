import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        variant === "primary" ? "bg-card" : "bg-muted",
        className
      )}
    >
      {children}
    </div>
  );
}
