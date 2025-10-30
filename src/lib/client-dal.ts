import { createClient } from "@/utils/supabase/client";

export type PublicUserT = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  created_at: string;
  updated_at: string;
  user_roles: {
    role_id: string;
    roles: {
      name: string;
    };
  }[];
};

export const getPublicUserClient = async (): Promise<PublicUserT | null> => {
  const supabase = createClient();

  // Session prüfen
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return null;
  }

  // User-Daten abrufen
  const { data, error } = await supabase
    .from("users")
    .select(
      `
    *,
    user_roles (
      role_id,
      roles (
        name
      )
    )
  `
    )
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching public user:", error);
    return null;
  }

  return data;
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error during sign out:", error.message);
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
};
