import { z } from "zod";

export const addressSchema = z
  .string()
  .min(1, "Adresse ist erforderlich")
  .max(150, "Adresse ist zu lang")
  .regex(/^[^'";]*$/, {
    message: "Adresse enthält ungültige Zeichen",
  });
