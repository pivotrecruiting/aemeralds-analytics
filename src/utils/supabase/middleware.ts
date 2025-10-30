import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest } from "next/server";

// Öffentliche Routen, die ohne Authentifizierung zugänglich sind
const publicRoutes = [
  "/login",
  "/registrieren",
  "/request-password",
  "/reset-password",
  "/sign-up",
  "/auth",
];

// Statische Assets und Next.js interne Routen
const staticRoutes = ["/_next", "/api", "/assets", "/favicon.ico"];

export async function updateSession(request: NextRequest) {
  // Erstelle Response für Cookie-Management
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Erstelle Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Prüfe Authentifizierung
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Prüfe ob es sich um eine statische Route handelt
  const isStaticRoute = staticRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isStaticRoute) {
    return response;
  }

  // Prüfe ob es sich um eine öffentliche Route handelt
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Wenn nicht authentifiziert und nicht auf öffentlicher Route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url), {
      status: 302,
    });
  }

  // Wenn authentifiziert und auf Login-Seite
  if (user && isPublicRoute) {
    // Hole Benutzerrolle aus der Datenbank
    const { data: userData } = await supabase
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
      .eq("id", user.id)
      .single();

    if (userData?.user_roles?.[0]?.roles?.name) {
      const role = userData.user_roles[0].roles.name;

      // Weiterleitung basierend auf Rolle
      switch (role) {
        case "user":
          return NextResponse.redirect(new URL("/dashboard", request.url), {
            status: 302,
          });
        case "admin":
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
            {
              status: 302,
            }
          );
        default:
          return NextResponse.redirect(new URL("/dashboard", request.url), {
            status: 302,
          });
      }
    }
  }

  // Wenn auf Root-Pfad und authentifiziert
  if (user && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url), {
      status: 302,
    });
  }

  return response;
}
