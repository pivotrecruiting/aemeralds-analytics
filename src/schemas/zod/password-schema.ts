import { z } from "zod";

// Zentrales Password-Schema für die gesamte Anwendung
export const passwordSchema = z
  .string()
  .min(8, "Mindestens 8 Zeichen erforderlich")
  .max(100, "Passwort ist zu lang")
  .regex(/[A-Z]/, "Mindestens ein Großbuchstabe erf.")
  .regex(/[a-z]/, "Mindestens ein Kleinbuchstabe erf.")
  .regex(/[0-9]/, "Mindestens eine Zahl erf.")
  .regex(/^[^'";]*$/, {
    message: "Passwort enthält ungültige Zeichen",
  });

// Password mit Bestätigung (für Registrierung und Passwort-Reset)
export const passwordWithConfirmationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

// Einfacher Passwort-Typ für Typinferenz
export type PasswordSchemaT = z.infer<typeof passwordSchema>;
export type PasswordWithConfirmationSchemaT = z.infer<
  typeof passwordWithConfirmationSchema
>;
