"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { GenderT} from "@/lib/dal";
import { verifySession } from "@/lib/dal";

export type ApiResponseT = {
  type: "message" | "toast";
  error: boolean;
  success: boolean;
  title?: string;
  message?: string;
};

export async function updateUserProfile({
  first_name,
  last_name,
  gender,
}: {
  first_name: string;
  last_name: string;
  gender: GenderT;
}): Promise<ApiResponseT> {
  const supabase = await createClient();

  try {
    const session = await verifySession();

    if (!session) {
      console.error("Error getting authenticated user:");
      return {
        type: "message",
        error: true,
        success: false,
        message: "Fehler beim Abrufen des authentifizierten Benutzers.",
      };
    }

    // Update users table with new first_name and last_name

    const { error: updateError } = await supabase
      .from("users")
      .update({
        first_name,
        last_name,
        gender,
      })
      .eq("id", session.userId);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return {
        type: "message",
        error: true,
        success: false,
        message: "Fehler beim Aktualisieren des Benutzerprofils.",
      };
    }
    revalidatePath("/", "layout");
    return {
      type: "message",
      error: false,
      success: true,
      message: "Benutzerprofil erfolgreich aktualisiert.",
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
