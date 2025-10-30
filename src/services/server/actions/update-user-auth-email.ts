"use server";

import { createClient } from "@/utils/supabase/server";

export type ApiResponseT = {
  type: "message" | "toast";
  error: boolean;
  success: boolean;
  title?: string;
  message?: string;
};

export async function updateUserAuthEmail({
  email,
}: {
  email: string;
}): Promise<ApiResponseT> {
  const supabase = await createClient();

  try {
    // Securely get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting authenticated user:", userError);
      return {
        type: "message",
        error: true,
        success: false,
        message: "Error getting authenticated user.",
      };
    }

    // Update the user's email
    const { data: authData, error: authError } = await supabase.auth.updateUser(
      {
        email: email,
      }
    );

    if (authError) {
      console.error("Error updating user email:", authError);
      return {
        type: "message",
        error: true,
        success: false,
        message: "Fehler beim Aktualisieren der E-Mail aufgetreten.",
      };
    }

    if (authData) {
      return {
        type: "toast",
        success: true,
        error: false,
        title: "Bestätitgungs E-Mail versendet",
        message:
          "Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihre E-Mail-Adresse zu aktualisieren.",
      };
    }

    return {
      type: "message",
      error: true,
      success: false,
      message: "Keine antwort vom Authentifizierungs Server erhalten.",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      type: "message",
      error: true,
      success: false,
      message: "Ein unerwarteter Fehler ist aufgetreten.",
    };
  }
}
