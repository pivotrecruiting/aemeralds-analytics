"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input";
import { AuthErrorContainer } from "@/components/ui/auth-error-container";
import { requestPassword } from "@/services/server/actions/request-password";
import { emailSchema } from "@/schemas/zod/email-schema";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { ZodError } from "zod";
import { SuccessMessage } from "@/components/ui/success-message";

export default function RequestPassword() {
  const [errors, setErrors] = useState<{
    authError?: string;
    connectionError?: string; // Neuer Fehlertyp für Netzwerkprobleme
  }>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getFieldProps } = useValidatedForm({
    initialValues: { email: "" },
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
  });

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setErrors({});
    setSuccess(null);

    try {
      const result = await requestPassword(formData);

      if (result.success) {
        setSuccess(result.message || null);
      } else if (result.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error("Fehler beim Formular-Submit:", error);

      // Prüfen, ob es sich um einen Netzwerkfehler handelt
      if (error instanceof Error) {
        if (
          error.message.includes("fetch failed") ||
          error.message.includes("network") ||
          error.message.includes("AuthRetryableFetchError")
        ) {
          setErrors({
            connectionError:
              "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.",
          });
        } else {
          setErrors({ authError: "Ein unerwarteter Fehler ist aufgetreten." });
        }
      } else {
        setErrors({ authError: "Ein unerwarteter Fehler ist aufgetreten." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //TODO: Refactor this file - bitte testen und überprüfen
  return (
    <div className="px-6">
      <h1 className="header">PASSWORT VERGESSEN?</h1>
      <p>Gib deine E-Mail-Adresse ein um dein Passwort zurückzusetzen.</p>
      <div className="flex flex-col gap-4">
        <div className="mt-10 flex flex-col gap-2">
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="relative">
                <InputWithLabel
                  label="E-Mail-Adresse"
                  aria-label="E-Mail-Adresse"
                  {...getFieldProps("email", { type: "email" })}
                />
              </div>
            </div>

            {/* Success Message */}
            <div className="relative">
              <SuccessMessage message={success} />
            </div>

            {/* Connection Error */}
            {errors && (
              <AuthErrorContainer
                error={errors.connectionError || errors.authError}
              />
            )}

            {/* Request button */}
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wird gesendet..." : "Passwort zurücksetzen"}
            </Button>
          </form>
          {/* Register link */}
          <div>
            <div className="mt-3 flex flex-row justify-center gap-1.5 text-center">
              Noch kein Konto bei uns?
              <span className="text-primary">
                <Link href="/registrieren">
                  <Button variant="link">Registriere dich jetzt</Button>
                </Link>
              </span>
            </div>
            <div className="mt-3 flex flex-row justify-center gap-1.5 text-center">
              Zurück zum
              <span className="text-primary">
                <Link href="/login">
                  <Button variant="link">Login</Button>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
