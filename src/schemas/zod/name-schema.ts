import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Name zu kurz")
  .max(100, "Name ist zu lang")
  .regex(/^[^'";]*$/, {
    message: "Name enthält ungültige Zeichen",
  })
  .regex(/^[A-Za-zÄäÖöÜüß\s-]*$/, {
    message: "Name darf nur Buchstaben enthalten",
  });
