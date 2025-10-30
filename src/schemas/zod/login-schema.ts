import { z } from "zod";
import { emailSchema } from "./email-schema";

export type SignInSchemaT = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Passwort ist erforderlich"),
});
