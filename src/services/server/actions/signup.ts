"use server";

import { signUpSchema } from "@/schemas/zod/sign-up-schema";
import { appendMultipleErrorParams } from "@/utils/helpers/append-multiple-error-params";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Original URL für Redirects bewahren
  const returnTo = (formData.get("returnTo") as string) || "/registrieren";

  // Fehlersammlung initialisieren
  const errors: Record<string, string> = {};

  // Überprüfen Sie die Checkbox-Werte korrekt
  // FormData.get() gibt "on" zurück, wenn eine Checkbox ausgewählt ist
  const termsAgb = formData.get("terms_agb") === "on";
  const termsPrivacy = formData.get("terms_privacy") === "on";
  const termsUsage = formData.get("terms_usage") === "on";

  const rawData = {
    email: formData.get("email"),
    firstName: formData.get("first_name"),
    lastName: formData.get("last_name"),
    gender: formData.get("gender"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm_password"),
    termsAgb,
    termsPrivacy,
    termsUsage,
    // TODO: add decoded token data back in if needed
    // schoolId: formData.get("school_id"),
    // classId: formData.get("class_id"),
    role: formData.get("role"),
  };

  const validationResult = signUpSchema.safeParse(rawData);

  if (!validationResult.success) {
    validationResult.error.issues.forEach((error) => {
      const field = error.path[0] as string;
      let errorKey: string;

      // Mapping der Feldnamen zu Fehlerparameternamen
      switch (field) {
        case "firstName":
          errorKey = "firstNameError";
          break;
        case "lastName":
          errorKey = "lastNameError";
          break;
        case "email":
          errorKey = "emailError";
          break;
        case "password":
          errorKey = "passwordError";
          break;
        case "confirmPassword":
          errorKey = "confirmPasswordError";
          break;
        case "termsAgb":
          errorKey = "termsAgbError";
          break;
        case "termsPrivacy":
          errorKey = "termsPrivacyError";
          break;
        case "termsUsage":
          errorKey = "termsUsageError";
          break;
        default:
          errorKey = `${field}Error`;
      }

      errors[errorKey] = error.message;
    });

    // ✅ SICHERHEIT: Nur Fehlermeldungen in URL - keine sensiblen Daten
    return redirect(appendMultipleErrorParams(returnTo, errors));
  }

  const {
    email,
    password,
    firstName,
    lastName,
    schoolId,
    role,
    classId,
    gender,
    termsAgb: validatedTermsAgb,
    termsPrivacy: validatedTermsPrivacy,
    termsUsage: validatedTermsUsage,
  } = validationResult.data;

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          gender,
          role,
          schoolId,
          classId,
          termsAgb: validatedTermsAgb,
          termsPrivacy: validatedTermsPrivacy,
          termsUsage: validatedTermsUsage,
        },
      },
    });

    if (error) {
      console.error("Supabase auth error:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("fetch failed") ||
          error.message.includes("network") ||
          error.message.includes("AuthRetryableFetchError")
        ) {
          errors.connectionError =
            "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.";
        } else {
          errors.authError = "Fehler beim Erstellen des Accounts.";
        }
      } else {
        errors.authError = "Fehler beim Erstellen des Accounts.";
      }

      // ✅ SICHERHEIT: Nur Fehlermeldungen in URL - keine sensiblen Daten
      return redirect(appendMultipleErrorParams(returnTo, errors));
    }
  } catch (error) {
    console.error("Failed signing up! Error: ", error);

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
        errors.authError = "Fehler beim Erstellen des Accounts.";
      }
    } else {
      errors.authError = "Fehler beim Erstellen des Accounts.";
    }

    // ✅ SICHERHEIT: Nur Fehlermeldungen in URL - keine sensiblen Daten
    return redirect(appendMultipleErrorParams(returnTo, errors));
  }
  // TODO: change text back after email implementation
  // Erfolgreiche Registrierung
  return redirect(
    appendMultipleErrorParams(returnTo, {
      success: "Account erstellt. Melden Sie sich an, um mit ResQX zu starten!",
    })
  );
}
