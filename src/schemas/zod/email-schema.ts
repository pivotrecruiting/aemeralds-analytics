import { z } from "zod";

// Basis E-Mail-Schema
export const emailSchema = z
  .string()
  .trim()
  .min(1, "E-Mail ist erforderlich")
  .max(255, "E-Mail ist zu lang")
  .email({ message: "Ungültige E-Mail-Adresse." });

// Einfacher E-Mail-Typ für Typinferenz
export type EmailSchemaT = z.infer<typeof emailSchema>;
