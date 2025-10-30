import { ZodError } from "zod";
import { genderSchema } from "@/schemas/zod/gender-schema";
import { nameSchema } from "@/schemas/zod/name-schema";
import { emailSchema } from "@/schemas/zod/email-schema";
import type { FormDataT } from "@/types/registration-form";
import type { FieldValidatorT } from "@/hooks/use-validated-form";
import type { ValidationErrorT } from "@/components/ui/validation-popover";

export const registrationValidators: Partial<
  Record<keyof FormDataT, FieldValidatorT<FormDataT>>
> = {
  gender: (value) => {
    try {
      genderSchema.parse(value);
      return undefined;
    } catch (e) {
      if (e instanceof ZodError) {
        return e.errors.map((er) => er.message);
      }
      return ["Ungültiges Feld"];
    }
  },
  first_name: (value) => {
    try {
      nameSchema.parse(value);
      return undefined;
    } catch (e) {
      if (e instanceof ZodError) {
        return e.errors.map((er) => er.message);
      }
      return ["Ungültiger Vorname"];
    }
  },
  last_name: (value) => {
    try {
      nameSchema.parse(value);
      return undefined;
    } catch (e) {
      if (e instanceof ZodError) {
        return e.errors.map((er) => er.message);
      }
      return ["Ungültiger Nachname"];
    }
  },
  email: (value) => {
    try {
      emailSchema.parse(value);
      return undefined;
    } catch (e) {
      if (e instanceof ZodError) {
        return e.errors.map((er) => er.message);
      }
      return ["Ungültige E-Mail-Adresse"];
    }
  },
  password: (value) => {
    const passwordValue = typeof value === "string" ? value : "";
    const errors: ValidationErrorT[] = [
      {
        message: "Mindestens 8 Zeichen erforderlich",
        isValidated: passwordValue.length >= 8,
      },
      {
        message: "Mindestens ein Großbuchstabe erforderlich",
        isValidated: /[A-Z]/.test(passwordValue),
      },
      {
        message: "Mindestens ein Kleinbuchstabe erforderlich",
        isValidated: /[a-z]/.test(passwordValue),
      },
      {
        message: "Mindestens eine Zahl erforderlich",
        isValidated: /[0-9]/.test(passwordValue),
      },
    ];
    return errors;
  },
  confirm_password: (value, allValues) => {
    const v = typeof value === "string" ? value : "";
    const pwd =
      typeof allValues.password === "string" ? allValues.password : "";
    if (pwd && v && pwd !== v) return "Die Passwörter stimmen nicht überein";
    return undefined;
  },
  terms_agb: (value) => (value ? undefined : "AGB müssen akzeptiert werden"),
  terms_privacy: (value) =>
    value ? undefined : "Datenschutzerklärung muss akzeptiert werden",
  terms_usage: (value) =>
    value ? undefined : "Nutzungsbedingungen müssen akzeptiert werden",
};
