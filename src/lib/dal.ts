import "server-only";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { jwtVerify } from "jose";
import type {
  UserAppMetadata,
  UserMetadata,
  SupabaseClient} from "@supabase/supabase-js";
import {
  AuthError
} from "@supabase/supabase-js";

// Shared client instance for better performance
const getSupabaseClient = cache(async () => {
  return await createClient();
});

// Type definitions for better type safety
export type UserT = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export type PublicUserT = {
  id: string;
  first_name: string;
  last_name: string;
  gender?: GenderT;
  created_at: string;
  updated_at: string;
  status?: string;
  avatar?: UserAvatarT;
  user_roles: {
    role_id: string;
    roles: {
      name: UserRolesT;
    };
  }[];
};

export type SessionDataT = {
  isAuth: true;
  userId: string;
  user: UserT;
};

export type UserAvatarT = {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: Date;
  fileSize: number;
  url: string;
  extended_user_id: string;
  user_sub_id: string; // Supabase auth UID
  folderPath: string;
} | null;

export type UserRolesT = "user" | "admin"; // default === "user"

export type GenderT = "male" | "female" | "divers" | null; // default === null

export const verifySession = cache(async (): Promise<SessionDataT> => {
  const supabase = await getSupabaseClient();

  // Get JWT secret from environment variables
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("SUPABASE_JWT_SECRET environment variable is not set");
  }

  const safeSession = new SupabaseSafeSession(supabase, jwtSecret);
  const { data, error } = await safeSession.getUser();

  if (error) {
    console.error("Session verification error:", error.message);
    redirect("/login");
  }

  if (!data) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: data.id,
    user: {
      id: data.id,
      email: data.email || undefined,
      user_metadata: data.user_metadata,
    },
  };
});

export const getPublicUser = cache(async (): Promise<PublicUserT | null> => {
  const session = await verifySession();
  if (!session) return null;

  const supabase = await getSupabaseClient();
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
    .eq("id", session.userId)
    .single();

  if (error) {
    console.error("Error fetching public user:", error);
    return null;
  }

  return data;
});

export const signOut = async () => {
  const supabase = await getSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
};

export type SupabaseSafeUser = {
  id: string;
  session_id: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  app_metadata: UserAppMetadata;
  user_metadata: UserMetadata;
};

export type SupabaseSafeUserResponse =
  | { data: SupabaseSafeUser; error: null }
  | { data: null; error: AuthError };

export class SupabaseSafeSession {
  private supabase: SupabaseClient;
  private jwtSecret: Uint8Array;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabase: SupabaseClient<any, any, any>, jwtSecret: string) {
    this.supabase = supabase;
    this.jwtSecret = new TextEncoder().encode(jwtSecret);
  }

  private async getAccessToken() {
    // Let Supabase get the session tokens and automatically refresh them if needed
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      return { error };
    }
    if (!data.session) {
      return { error: new AuthError("No session data") };
    }

    return {
      access_token: data.session.access_token,
    };
  }

  private async parseAccessToken(
    accessToken: string
  ): Promise<SupabaseSafeUserResponse> {
    try {
      const { payload } = await jwtVerify<SupabaseSafeUser>(
        accessToken,
        this.jwtSecret
      );
      return {
        data: {
          id: payload.sub as string,
          session_id: payload.session_id,
          role: payload.role ?? null,
          email: payload.email ?? null,
          phone: payload.phone ?? null,
          app_metadata: payload.app_metadata,
          user_metadata: payload.user_metadata,
        },
        error: null,
      };
    } catch {
      return { data: null, error: new AuthError("JWT verification failed") };
    }
  }

  public async getUser(): Promise<SupabaseSafeUserResponse> {
    const token = await this.getAccessToken();

    if (token.error) {
      return { data: null, error: token.error };
    }

    const { data: userData, error } = await this.parseAccessToken(
      token.access_token
    );

    if (error) {
      return { data: null, error };
    }

    return { data: userData, error: null };
  }
}

// export const getPublicUserFetch = async (): Promise<PublicUserT | null> => {
//   // Session wie gehabt prüfen
//   const session = await verifySession();
//   if (!session) return null;

//   // Supabase REST-URL und Key holen
//   const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; // z.B. "https://abcxyz.supabase.co"
//   const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Nur auf dem Server!

//   if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
//     throw new Error("Supabase URL oder Service Role Key nicht gesetzt!");
//   }

//   // REST-API Endpoint für users-Tabelle
//   const endpoint = `${SUPABASE_URL}/rest/v1/users`;

//   // Query-Parameter für den einzelnen User und inkl. Relationen
//   // Achtung: Mit "select" kannst du auch Relationen abfragen (Supabase-Syntax, z.B. user_roles(role_id,roles(name)))
//   const params = new URLSearchParams({
//     id: `eq.${session.userId}`,
//     select: `*,user_roles(role_id,roles(name)),schools(id,name)`,
//   });

//   // Fetch!
//   const res = await fetch(`${endpoint}?${params.toString()}`, {
//     method: "GET",
//     headers: {
//       apikey: SUPABASE_SERVICE_ROLE_KEY,
//       Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
//       Accept: "application/json",
//     },
//   });

//   if (!res.ok) {
//     console.error("Supabase REST API Error:", res.statusText);
//     return null;
//   }

//   const data = await res.json();

//   // Die API gibt immer ein Array zurück
//   if (!data || !data[0]) {
//     return null;
//   }

//   return data[0] as PublicUserT;
// };

/*
   A secure solution for user retrievement from session in server-side applications using Supabase.
      
   Instead of relying directly on the Supabase session object from cookie data like supabase.auth.getSession(),
   this tool mitigates the spoofing SSR attack vector by verifying the JWT token, ensuring the session's validity.
 
   Read more: https://github.com/orgs/supabase/discussions/23224
 
   - It uses jose instead of jsonwebtoken to remain compatible with edge runtime.
   - To use it, you need the JWT Secret of your Supabase, which should never be shared publicly.
   
   # Usage:
   	const safeSession = new SupabaseSafeSession(supabaseInstance, jwtSecret)
	const { data, error } = await safeSession.getUser()
	if (error) {
		throw new Error(error.message)
	}

   # Result:
	{
		"id": "12345678-90ab-cdef-1234-567890abcdef",
		"session_id": "fedcba98-7654-3210-fedc-ba9876543210",
		"role": "authenticated",
		"email": "john.doe@example.com",
		"phone": "",
		"app_metadata": { "provider": "email", "providers": ["email"] },
		"user_metadata": {
			"email": "john.doe@example.com",
			"email_verified": false,
			"phone_verified": false,
			"sub": "12345678-90ab-cdef-1234-567890abcdef"
		}
	}
*/
