"use client";

import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import GenderSelectFormField from "./gender-select-form-field";
import type { GenderT } from "@/types/users";
import type { FormDataT } from "@/types/registration-form";
import type { FieldPropsT } from "@/hooks/use-validated-form";

type RegistrationStep1PropsT = {
  values: FormDataT;
  getFieldProps: <K extends keyof FormDataT>(
    field: K,
    opts?: { id?: string; type?: string }
  ) => FieldPropsT;
  onNext: () => void;
  onSelectChange: (
    field: keyof FormDataT,
    value: string | boolean | null
  ) => void;
};

export default function RegistrationStep1({
  values,
  getFieldProps,
  onNext,
  onSelectChange,
}: RegistrationStep1PropsT) {
  // Prevent number input for name fields
  const preventNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (numbers.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Gender Select */}
      <GenderSelectFormField
        error={getFieldProps("gender").error}
        value={values.gender}
        onChange={(value: GenderT) => onSelectChange("gender", value || null)}
      />

      <div className="flex flex-row gap-3">
        {/* First Name */}
        <div className="relative">
          <InputWithLabel
            label="Vorname"
            aria-label="Vorname"
            {...getFieldProps("first_name", { type: "text" })}
            inputMode="text"
            onKeyDown={preventNumbers}
          />
        </div>

        {/* Last Name */}
        <div className="relative">
          <InputWithLabel
            label="Nachname"
            aria-label="Nachname"
            {...getFieldProps("last_name", { type: "text" })}
            inputMode="text"
            onKeyDown={preventNumbers}
          />
        </div>
      </div>

      {/* Email */}
      <div className="relative">
        <InputWithLabel
          label="E-Mail-Adresse"
          aria-label="E-Mail-Adresse"
          autoComplete="email"
          {...getFieldProps("email", { type: "email" })}
        />
      </div>

      <div className="mt-6">
        <Button
          type="button"
          onClick={onNext}
          className="w-full"
          disabled={
            !(
              typeof values.first_name === "string" && values.first_name.trim()
            ) ||
            !(
              typeof values.last_name === "string" && values.last_name.trim()
            ) ||
            !(typeof values.email === "string" && values.email.trim())
          }
        >
          Weiter
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
