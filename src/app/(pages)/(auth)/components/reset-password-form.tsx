"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "./password-input";
import { createClient } from "@/utils/supabase/client";
import { passwordWithConfirmationSchema } from "@/schemas/zod/password-schema";
import { SuccessMessage } from "@/components/ui/success-message";
import { Button } from "@/components/ui/button";
import { AuthErrorContainer } from "@/components/ui/auth-error-container";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [connectionError, setConnectionError] = useState(""); // Neuer State für Netzwerkfehler
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  // Funktion zum Zurücksetzen aller Fehlermeldungen
  const resetErrors = () => {
    setPasswordError("");
    setConfirmPasswordError("");
    setError("");
    setConnectionError(""); // Auch den Verbindungsfehler zurücksetzen
    setMessage("");
  };

  // Überwache Änderungen an den Passwort-Feldern und setze Fehler zurück
  useEffect(() => {
    resetErrors();
  }, [password, confirmPassword]);

  useEffect(() => {
    // Überprüfen, ob wir im Passwort-Reset-Modus sind
    const checkAuthState = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        // Listener für Änderungen des Auth-Status
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event) => {
            if (event === "PASSWORD_RECOVERY") {
              setIsResetMode(true);
            }
          }
        );

        // Initialer Check
        if (data?.session?.user.email_confirmed_at) {
          setIsResetMode(true);
        }

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking auth state:", error);

        // Prüfen, ob es sich um einen Netzwerkfehler handelt
        if (error instanceof Error) {
          if (
            error.message.includes("fetch failed") ||
            error.message.includes("network") ||
            error.message.includes("AuthRetryableFetchError")
          ) {
            setConnectionError(
              "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut."
            );
          } else {
            setError("Ein unerwarteter Fehler ist aufgetreten.");
          }
        } else {
          setError("Ein unerwarteter Fehler ist aufgetreten.");
        }
      }
    };

    checkAuthState();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Explizites Zurücksetzen aller Fehlermeldungen vor der Validierung
    resetErrors();
    setIsLoading(true);

    try {
      // Validierung
      const validationResult = passwordWithConfirmationSchema.safeParse({
        password,
        confirmPassword,
      });

      if (!validationResult.success) {
        validationResult.error.errors.forEach((error) => {
          if (error.path[0] === "password") {
            setPasswordError(error.message);
          } else if (error.path[0] === "confirmPassword") {
            setConfirmPasswordError(error.message);
          }
        });
        setIsLoading(false);
        return;
      }

      // Prüfe explizit, ob die Passwörter übereinstimmen
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwörter stimmen nicht überein");
        setIsLoading(false);
        return;
      }

      // Passwort aktualisieren
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(
          "Das Passwort konnte nicht zurückgesetzt werden. Möglicherweise ist der Link abgelaufen."
        );
      } else {
        setMessage(
          "Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden."
        );
        setPassword("");
        setConfirmPassword("");

        // Optional: nach erfolgreicher Aktualisierung zur Login-Seite weiterleiten
        setTimeout(() => {
          router.replace(
            "/login?message=Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden."
          );
        }, 4000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);

      // Prüfen, ob es sich um einen Netzwerkfehler handelt
      if (error instanceof Error) {
        if (
          error.message.includes("fetch failed") ||
          error.message.includes("network") ||
          error.message.includes("AuthRetryableFetchError")
        ) {
          setConnectionError(
            "Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut."
          );
        } else {
          setError("Ein unerwarteter Fehler ist aufgetreten.");
        }
      } else {
        setError("Ein unerwarteter Fehler ist aufgetreten.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Passwort-Änderung Handler für kontrollierte Inputs
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Bestätigungspasswort-Änderung Handler für kontrollierte Inputs
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  // Wenn wir NICHT im Reset-Modus sind, Hinweis anzeigen und kein Formular
  if (!isResetMode) {
    return (
      <div className="bg-background/80 rounded-md p-4">
        <p>
          Bitte folge dem Link in deiner E-Mail, um dein Passwort
          zurückzusetzen.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="header">NEUES PASSWORT FESTLEGEN</h1>
      <p>Bitte gib dein neues Passwort ein.</p>

      <div className="mt-10 flex flex-col gap-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-6">
            {/* Password input */}
            <div className="relative">
              <PasswordInput
                passwordError={passwordError}
                showPasswordToggle={true}
                onChange={handlePasswordChange}
                value={password}
              />
            </div>

            {/* Confirm Password input */}
            <div className="relative">
              <PasswordInput
                passwordError=""
                confirmPasswordError={confirmPasswordError}
                confirmPassword={true}
                onChange={handleConfirmPasswordChange}
                value={confirmPassword}
              />
            </div>
          </div>

          {/* Connection/Auth Error */}
          {(connectionError || error) && (
            <AuthErrorContainer
              error={connectionError || error}
              className="absolute -mt-2"
            />
          )}

          {/* Success Message */}
          <div className="relative">
            <SuccessMessage message={message} className="-top-1" />
          </div>

          {/* Reset Password Button */}
          <div className="mt-12">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !!connectionError}
            >
              {isLoading ? "Wird zurückgesetzt..." : "Passwort zurücksetzen"}
            </Button>
          </div>
        </form>

        {/* Login link */}
        <p className="text-center">
          Zurück zum
          <Link href="/login" className="text-primary">
            <Button variant="link" className="ml-1.5">
              Login
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
