"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SignUpButtonProps = {
  isFormValid: boolean;
};

export default function SignUpButton({ isFormValid }: SignUpButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isFormValid} className="flex-1">
      {pending ? "Registrieren..." : "Registrieren"}
    </Button>
  );
}
