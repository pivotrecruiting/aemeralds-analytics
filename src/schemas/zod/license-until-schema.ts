import { z } from "zod";

export const licenseUntilSchema = z
  .string()
  .regex(
    /^\d{2}\.\d{2}\.\d{4}$/,
    "Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein"
  )
  .refine(
    (val) => {
      if (!val) return false;
      const [day, month, year] = val.split(".").map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year &&
        date > new Date() // Datum muss in der Zukunft liegen
      );
    },
    {
      message: "Bitte geben Sie ein gültiges Datum in der Zukunft ein",
    }
  );
