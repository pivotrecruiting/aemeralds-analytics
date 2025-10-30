import { z } from "zod";
import { passwordSchema } from "./password-schema";
import { emailSchema } from "./email-schema";
import { genderSchema } from "./gender-schema";
import { nameSchema } from "./name-schema";

export type SignUpSchemaT = z.infer<typeof signUpSchema>;

export const signUpSchema = z
  .object({
    firstName: nameSchema,

    lastName: nameSchema,

    gender: genderSchema,

    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Passwortbestätigung ist erforderlich"),

    // Terms and conditions checkboxes
    termsAgb: z.boolean().refine((val) => val === true, {
      message: "Sie müssen die AGB akzeptieren",
    }),
    termsPrivacy: z.boolean().refine((val) => val === true, {
      message: "Sie müssen die Datenschutzerklärung akzeptieren",
    }),
    termsUsage: z.boolean().refine((val) => val === true, {
      message: "Sie müssen die Nutzungsbedingungen akzeptieren",
    }),

    // School ID, Class ID and role are optional
    schoolId: z.string().nullish().optional(),
    classId: z.string().nullish().optional(),
    role: z.string().nullish().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });
