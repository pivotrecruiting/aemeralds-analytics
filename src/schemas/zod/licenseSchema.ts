import { z } from "zod";
import { LICENSES } from "@/constants/licenses";

export const licenseSchema = z
  .enum(LICENSES)
  .nullable()
  .refine((val) => val !== null, {
    message: "Bitte wählen Sie eine Lizenz aus",
  });
