import { z } from "zod";

/**
 * Validierungsschema für deutsche Postleitzahlen
 * Deutsche Postleitzahlen bestehen aus genau 5 Ziffern (0-9)
 */
export const zipcodeSchema = z
  .string()
  .min(5, "Postleitzahl muss aus 5 Ziffern bestehen")
  .max(5, "Postleitzahl muss aus 5 Ziffern bestehen")
  .regex(/^[0-9]{5}$/, {
    message: "Postleitzahl muss aus genau 5 Ziffern bestehen",
  });
