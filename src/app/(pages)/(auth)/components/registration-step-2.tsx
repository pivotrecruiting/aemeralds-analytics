"use client";

import { Button } from "@/components/ui/button";
import { AuthErrorContainer } from "@/components/ui/auth-error-container";
import { Check, ArrowLeft } from "lucide-react";
import PasswordInput from "./password-input";
import SignUpButton from "./sign-up-button";
import type { SearchParamsT } from "../registrieren/page";
import type { FormDataT } from "@/types/registration-form";
import type { FieldPropsT } from "@/hooks/use-validated-form";

type RegistrationStep2PropsT = {
  getFieldProps: <K extends keyof FormDataT>(
    field: K,
    opts?: { id?: string; type?: string }
  ) => FieldPropsT;
  serverErrors: SearchParamsT;
  onPrevious: () => void;
  isFormValid: boolean;
};

export default function RegistrationStep2({
  getFieldProps,
  serverErrors,
  onPrevious,
  isFormValid,
}: RegistrationStep2PropsT) {
  // Field props helpers
  const passwordField = getFieldProps("password");
  const confirmPasswordField = getFieldProps("confirm_password");
  const termsAgbField = getFieldProps("terms_agb", { type: "checkbox" });
  const termsPrivacyField = getFieldProps("terms_privacy", {
    type: "checkbox",
  });
  const termsUsageField = getFieldProps("terms_usage", { type: "checkbox" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        {/* Password */}
        <PasswordInput
          passwordError={passwordField.error || ""}
          showPasswordToggle
          value={passwordField.value}
          onChange={passwordField.onChange}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        {/* Confirm Password */}
        <PasswordInput
          passwordError={passwordField.error || ""}
          confirmPasswordError={confirmPasswordField.error || ""}
          confirmPassword={true}
          value={confirmPasswordField.value}
          onChange={confirmPasswordField.onChange}
        />
      </div>

      {/* Terms and Conditions Checkboxes */}
      <div className="mt-2 flex flex-col gap-4">
        {/* AGB Checkbox */}
        <div className="relative">
          <label className="flex cursor-pointer items-start space-x-2">
            <div className="relative">
              <input
                {...termsAgbField}
                type="checkbox"
                className="peer sr-only"
              />
              <div className="peer-checked:bg-primary peer-checked:border-primary h-5 w-5 rounded border border-gray-300 bg-white transition-colors"></div>
              <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
            </div>
            <span className="text-sm">
              Ich habe die{" "}
              <a
                href="https://www.resqx.de/app-agb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary mr-1 underline"
              >
                Allgemeinen Nutzungsbedingungen (AGB)
              </a>{" "}
              gelesen und akzeptiere sie
            </span>
          </label>
        </div>

        {/* Privacy Checkbox */}
        <div className="relative">
          <label className="flex cursor-pointer items-start space-x-2">
            <div className="relative">
              <input
                {...termsPrivacyField}
                type="checkbox"
                className="peer sr-only"
              />
              <div className="peer-checked:bg-primary peer-checked:border-primary h-5 w-5 rounded border border-gray-300 bg-white transition-colors"></div>
              <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
            </div>
            <span className="text-sm">
              Ich habe die{" "}
              <a
                href="https://www.resqx.de/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary mr-1 underline"
              >
                Datenschutzerklärung{" "}
              </a>{" "}
              gelesen und akzeptiere sie
            </span>
          </label>
        </div>

        {/* Usage Terms Checkbox */}
        <div className="relative">
          <label className="flex cursor-pointer items-start space-x-2">
            <div className="relative">
              <input
                {...termsUsageField}
                type="checkbox"
                className="peer sr-only"
              />
              <div className="peer-checked:bg-primary peer-checked:border-primary h-5 w-5 rounded border border-gray-300 bg-white transition-colors"></div>
              <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
            </div>
            <span className="text-sm">
              Ich nutze meinen Account ausschließlich selbst und werde weder
              Zugangsdaten noch Inhalte der App an Dritte weitergeben.
            </span>
          </label>
        </div>
      </div>

      <div className="relative">
        {/* Connection Error */}
        {serverErrors.connectionError && (
          <AuthErrorContainer
            error={serverErrors.connectionError}
            className="absolute top-1 mt-0 lg:min-w-[340px]"
          />
        )}

        {/* Auth Error - nur anzeigen, wenn kein Verbindungsfehler vorliegt */}
        {serverErrors.authError && !serverErrors.connectionError && (
          <AuthErrorContainer
            error={serverErrors.authError}
            className="absolute top-4 mt-0 lg:min-w-[340px]"
          />
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="aspect-square flex-0 p-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <SignUpButton isFormValid={isFormValid} />
      </div>
    </div>
  );
}
