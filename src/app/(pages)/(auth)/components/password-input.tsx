import { InputWithLabel } from "@/components/ui/input";
import type { ChangeEvent } from "react";

type ValidationErrorT = {
  message: string;
  isValidated: boolean;
};

export default function PasswordInput({
  passwordError,
  confirmPasswordError,
  showPasswordToggle = false,
  confirmPassword = false,
  value,
  onChange,
}: {
  passwordError:
    | string
    | string[]
    | ValidationErrorT[]
    | (string | ValidationErrorT)[];
  confirmPasswordError?:
    | string
    | string[]
    | ValidationErrorT[]
    | (string | ValidationErrorT)[];
  showPasswordToggle?: boolean;
  confirmPassword?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  // Bestimme die Prop-Werte basierend auf confirmPassword
  const name = confirmPassword ? "confirm_password" : "password";
  const label = confirmPassword ? "Passwort bestätigen" : "Passwort";
  const id = confirmPassword ? "confirm_password" : "password";

  // Bestimme die Fehlermeldung basierend darauf, ob es ein Bestätigungspasswort ist
  const errorMessage = confirmPassword
    ? confirmPasswordError || ""
    : passwordError || "";

  return (
    <div className="relative">
      <InputWithLabel
        name={name}
        autoComplete="current-password"
        label={label}
        aria-label={label}
        type="password"
        id={id}
        showPasswordToggle={showPasswordToggle}
        value={value}
        onChange={onChange}
        error={errorMessage}
      />
    </div>
  );
}
