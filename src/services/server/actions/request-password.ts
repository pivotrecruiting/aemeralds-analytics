"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { getBaseUrl } from "@/utils/helpers/get-base-url";

// Schema für die E-Mail-Validierung
const requestPasswordSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
});

export async function requestPassword(formData: FormData) {
  const supabase = await createClient();

  // Extract and validate email
  const rawData = {
    email: formData.get("email"),
  };

  if (!rawData.email) {
    return {
      success: false,
      errors: { emailError: "E-Mail ist erforderlich" },
    };
  }

  // Validiere die E-Mail-Adresse
  const validationResult = requestPasswordSchema.safeParse(rawData);

  if (!validationResult.success) {
    const emailError =
      validationResult.error.issues[0]?.message || "Ungültige E-Mail-Adresse";
    return { success: false, errors: { emailError } };
  }

  const { email } = validationResult.data;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getBaseUrl()}/reset-password`,
    });

    if (error) {
      // Prüfen, ob es sich um einen Netzwerkfehler handelt
      if (error instanceof Error) {
        if (
          error.message.includes("fetch failed") ||
          error.message.includes("network") ||
          error.message.includes("AuthRetryableFetchError")
        ) {
          return {
            success: false,
            errors: {
              connectionError:
                "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.",
            },
          };
        }
      }
      return {
        success: false,
        errors: { authError: "Es gab ein Problem beim Versenden der E-Mail." },
      };
    }

    // Erfolgsmeldung
    return {
      success: true,
      message:
        "Falls deine E-Mail existiert, haben wir dir soeben einen Link zum Zurücksetzen deines Passworts geschickt.",
    };
  } catch (error) {
    console.error("Unerwarteter Fehler beim Passwort-Reset:", error);

    // Prüfen, ob es sich um einen Netzwerkfehler handelt
    if (error instanceof Error) {
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("network") ||
        error.message.includes("AuthRetryableFetchError")
      ) {
        return {
          success: false,
          errors: {
            connectionError:
              "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.",
          },
        };
      }
    }

    return {
      success: false,
      errors: { authError: "Ein unerwarteter Fehler ist aufgetreten." },
    };
  }
}
