import { z } from "zod";

export const citySchema = z
  .string()
  .min(1, "Stadt ist erforderlich")
  .max(80, "Stadtname ist zu lang")
  .regex(/^[^'";]*$/, {
    message: "Stadtname enthält ungültige Zeichen",
  });
