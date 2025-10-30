"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/zod/login-schema";
import { createClient } from "@/utils/supabase/server";
import { appendMultipleErrorParams } from "@/utils/helpers/append-multiple-error-params";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Original URL für Redirects bewahren
  const returnTo = (formData.get("returnTo") as string) || "/login";

  // Fehlersammlung initialisieren
  const errors: Record<string, string> = {};

  // Extract and validate form data
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate with Zod schema
  const validationResult = loginSchema.safeParse(rawData);

  if (!rawData.email) {
    errors.emailError = "E-Mail ist erforderlich";
  }

  if (!rawData.password) {
    errors.passwordError = "Passwort ist erforderlich";
  }

  if (!validationResult.success) {
    validationResult.error.issues.forEach((error) => {
      const field = error.path[0] as string;
      errors[`${field}Error`] = error.message;
    });

    return redirect(appendMultipleErrorParams(returnTo, errors));
  }

  const { email, password } = validationResult.data;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Failed logging in! Error: ", error);
      // Prüfen, ob es sich um einen Netzwerkfehler handelt
      if (error instanceof Error) {
        if (
          error.message.includes("fetch failed") ||
          error.message.includes("network") ||
          error.message.includes("AuthRetryableFetchError")
        ) {
          errors.connectionError =
            "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.";
        } else {
          errors.authError = "Falsche E-Mail oder Passwort";
        }
      } else {
        errors.authError = "Falsche E-Mail oder Passwort";
      }
      return redirect(appendMultipleErrorParams(returnTo, errors));
    }
  } catch (error) {
    console.error("Failed logging in! Error: ", error);

    // Prüfen, ob es sich um einen Netzwerkfehler handelt
    if (error instanceof Error) {
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("network") ||
        error.message.includes("AuthRetryableFetchError")
      ) {
        errors.connectionError =
          "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.";
      } else {
        errors.authError = "Falsche E-Mail oder Passwort";
      }
    } else {
      errors.authError = "Falsche E-Mail oder Passwort";
    }

    return redirect(appendMultipleErrorParams(returnTo, errors));
  }

  // Prüfe die Benutzerrolle und leite direkt zur entsprechenden Seite weiter
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Fallback zur Startseite, wenn keine spezifische Rolle gefunden wurde
    return redirect("/dashboard");
  } else {
    return redirect("/login");
  }
}
