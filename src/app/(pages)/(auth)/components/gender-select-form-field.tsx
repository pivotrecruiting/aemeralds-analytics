"use client";

import { useState } from "react";
import GenderSelect from "@/components/ui/gender-select";
import type { GenderT } from "@/types/users";

type ValidationErrorT = {
  message: string;
  isValidated: boolean;
};

type GenderSelectFormFieldPropsT = {
  error?:
    | string
    | string[]
    | ValidationErrorT[]
    | (string | ValidationErrorT)[];
  value?: GenderT;
  onChange?: (value: GenderT) => void;
};

export default function GenderSelectFormField({
  error,
  value,
  onChange,
}: GenderSelectFormFieldPropsT) {
  const [internalGender, setInternalGender] = useState<GenderT>(null);

  // Use external value if provided, otherwise use internal state
  const currentGender = value ? (value as GenderT) : internalGender;
  const handleChange = (newGender: GenderT) => {
    if (onChange) {
      onChange(newGender || null);
    } else {
      setInternalGender(newGender);
    }
  };

  return (
    <div className="relative">
      <input type="hidden" name="gender" value={currentGender || ""} />
      <GenderSelect
        label="Geschlecht"
        value={currentGender}
        onChange={handleChange}
        error={error}
      />
    </div>
  );
}
