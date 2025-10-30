import { z } from "zod";

// Enum ohne null, für die z.enum()
const genderEnum = z.enum(["male", "female", "divers"]).nullish();

// Das vollständige Schema mit Preprocessing
export const genderSchema = z.preprocess(
  (val) => {
    // Leeren String in undefined umwandeln
    return val === "" ? undefined : val;
  },
  z.union([genderEnum, z.null()])
);
