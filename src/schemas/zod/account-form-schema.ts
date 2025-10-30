import { z } from "zod";
import { emailSchema } from "./email-schema";
import { nameSchema } from "./name-schema";
import { genderSchema } from "./gender-schema";
import type { UserRolesT } from "@/lib/dal";

export const USER_ROLES: UserRolesT[] = ["user", "admin"];

// Schema für das Account-Formular mit wiederverwendbaren Regeln
export const accountFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  gender: genderSchema,
  role: z.enum(USER_ROLES as [string, ...string[]]),
});

// Typ für die Form-Daten, abgeleitet vom Schema
export type AccountFormDataT = z.infer<typeof accountFormSchema>;
