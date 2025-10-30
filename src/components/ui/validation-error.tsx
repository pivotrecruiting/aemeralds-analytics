import { AlertCircle, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ValidationErrorProps {
  message: string;
  requirements?: string[];
  children: React.ReactNode;
}

export function ValidationError({
  message,
  requirements,
  children,
}: ValidationErrorProps) {
  if (!message) return <>{children}</>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          <AlertCircle className="text-destructive absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-start gap-2">
          <Info className="text-destructive mt-0.5 h-4 w-4" />
          <div>
            <p className="text-destructive font-medium">{message}</p>
            {requirements && (
              <ul className="mt-2 space-y-1 text-sm">
                {requirements.map((req, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {req}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
