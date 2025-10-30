"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { login } from "@/services/server/actions/login";
import Link from "next/link";
import { InputWithLabel } from "@/components/ui/input";
import { LoginButton } from "../components/login-button";
import PasswordInput from "../components/password-input";
import { use } from "react";
import { emailSchema } from "@/schemas/zod/email-schema";
import { ZodError } from "zod";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { AuthErrorContainer } from "@/components/ui/auth-error-container";

type TSearchParams = {
  emailError?: string;
  authError?: string;
  passwordError?: string;
  connectionError?: string;
};

export default function Login({
  searchParams,
}: {
  searchParams: Promise<TSearchParams>;
}) {
  const { emailError, authError, passwordError, connectionError } =
    use(searchParams);

  const { getFieldProps } = useValidatedForm({
    initialValues: { email: "", password: "" },
    validators: {
      email: (value) => {
        try {
          emailSchema.parse(value);
          return undefined;
        } catch (e) {
          if (e instanceof ZodError) {
            const message = e.errors?.[0]?.message;
            return [
              typeof message === "string"
                ? message
                : "Ungültige E-Mail-Adresse",
            ];
          }
          return ["Ungültige E-Mail-Adresse"];
        }
      },
    },
    serverErrors: {
      email: emailError,
      password: passwordError,
    },
  });

  return (
    <div className="px-[11px]">
      <h1 className="header">LOGIN</h1>
      <p className="">
        Gib deine E-Mail-Adresse und dein Passwort ein, um dich anzumelden.
      </p>
      <div className="flex flex-col gap-4">
        <div className="mt-6 flex flex-col gap-2">
          <form action={login}>
            <div className="flex flex-col gap-6">
              {/* Hidden input for preserving current URL including parameters */}
              <input
                type="hidden"
                name="returnTo"
                value={`/login${Object.entries(use(searchParams))
                  .filter(
                    ([key]) => key !== "emailError" && key !== "authError"
                  )
                  .reduce(
                    (acc, [key, value]) =>
                      `${acc}${acc ? "&" : "?"}${key}=${value}`,
                    ""
                  )}`}
              />

              {/* Email */}
              <div className="relative">
                <InputWithLabel
                  autoComplete="email"
                  label="E-Mail-Adresse"
                  aria-label="E-Mail-Adresse"
                  {...getFieldProps("email", { type: "email" })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                {/* Password */}
                <PasswordInput
                  passwordError={getFieldProps("password").error || ""}
                  showPasswordToggle
                />

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link href="/request-password">
                    <Button
                      variant="link"
                      className="m-0 h-auto p-0 text-right underline"
                      type="button"
                    >
                      Passwort vergessen
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3 py-4">
              <Switch id="remember" />
              <label htmlFor="remember" className="p-0 leading-0">
                Angemeldet bleiben
              </label>
            </div>

            {/* Connection Error */}
            {connectionError && (
              <AuthErrorContainer
                error={connectionError}
                className="absolute -mt-2"
              />
            )}

            {/* Auth Error */}
            {authError && !connectionError && (
              <AuthErrorContainer error={authError} className="absolute mt-0" />
            )}

            {/* Login button */}
            <LoginButton />
          </form>
          {/* Register link */}
          <div className="mt-3 flex flex-row justify-center gap-1.5 text-center">
            Noch kein Konto bei uns?
            <span className="text-primary">
              <Link href="/registrieren">
                <Button variant="link">Registriere dich jetzt</Button>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
