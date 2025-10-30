"use client";

import { updateUserAuthEmail } from "@/services/server/actions/update-user-auth-email";
import { Check, AlertCircle } from "lucide-react";
import { InputWithLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GenderSelect from "@/components/ui/gender-select";
import { accountFormSchema } from "@/schemas/zod/account-form-schema";
import { updateUserProfile } from "@/services/server/actions/update-user-profile";
import { useState } from "react";
import type { GenderT, UserRolesT } from "@/lib/dal";
import { emailSchema } from "@/schemas/zod/email-schema";
import { nameSchema } from "@/schemas/zod/name-schema";
import { z } from "zod";
import type { ValidationErrorT } from "@/components/ui/validation-popover";

type AccountPropsT = {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    gender: GenderT;
    role: UserRolesT;
  };
};

export default function ClientAccountForm({ initialData }: AccountPropsT) {
  // State for form values
  const [formData, setFormData] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    email: initialData.email,
    gender: initialData.gender || null,
    role: initialData.role,
  });

  // State to track changes
  const [originalData, setOriginalData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | string[] | ValidationErrorT[]>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  // Check if any field has changed
  const hasNameChanged =
    formData.firstName !== originalData.firstName ||
    formData.lastName !== originalData.lastName;

  const hasGenderChanged = formData.gender !== originalData.gender;

  const hasEmailChanged = formData.email !== originalData.email;

  const hasAnyChange = hasNameChanged || hasEmailChanged || hasGenderChanged;

  // Validation function with multiple error support
  const validateField = (field: string, value: string) => {
    try {
      switch (field) {
        case "firstName":
        case "lastName":
          nameSchema.parse(value);
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
          break;
        case "email":
          emailSchema.parse(value);
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
          break;
      }
    } catch (error) {
      if (error instanceof z.ZodError && error.errors) {
        // Collect all validation errors for this field with validation status
        const errorMessages: ValidationErrorT[] = error.errors.map((err) => ({
          message: err.message,
          isValidated: false,
        }));

        setValidationErrors((prev) => ({
          ...prev,
          [field]: errorMessages,
        }));
      }
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle gender change
  const handleGenderChange = (value: GenderT) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));

    // Clear gender error if it exists
    if (validationErrors.gender) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.gender;
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setValidationErrors({});

    try {
      const validationResult = accountFormSchema.safeParse(formData);

      if (!validationResult.success) {
        // Extract and format validation errors
        const errors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          errors[path] = issue.message;
        });
        setValidationErrors(errors);
        setIsSubmitting(false);
        return;
      }

      const validatedData = validationResult.data;

      // Only update names if they have changed
      if (hasNameChanged || hasGenderChanged) {
        const result = await updateUserProfile({
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          gender: validatedData.gender as GenderT,
        });

        if (result.error) {
          throw new Error(result.message);
        }
      }

      // Only update email if it has changed
      if (hasEmailChanged) {
        const emailResult = await updateUserAuthEmail({
          email: validatedData.email,
        });

        if (emailResult.error) {
          throw new Error(emailResult.message);
        }
      }
      setOriginalData({ ...formData });
      // Show success state on button
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setFormError(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className="hidden" name="role" value={formData.role} readOnly />

      {formError && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>{formError}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[160px_1fr_1fr] sm:grid-rows-2 sm:gap-5">
        <GenderSelect
          label="Geschlecht"
          value={formData.gender}
          onChange={handleGenderChange}
          error={validationErrors.gender}
          bgVariant="muted"
        />
        <InputWithLabel
          label="Vorname"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={validationErrors.firstName}
          onValidation={validateField}
          bgVariant="muted"
        />
        <InputWithLabel
          label="Nachname"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={validationErrors.lastName}
          onValidation={validateField}
          bgVariant="muted"
        />
        <div className="col-span-3">
          <InputWithLabel
            label="E-Mail Adresse"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            onValidation={validateField}
            bgVariant="muted"
          />
        </div>

        <div className="col-span-1 col-start-3 mt-6 flex justify-end">
          <Button
            className="flex-0"
            type="submit"
            disabled={!hasAnyChange || isSubmitting}
          >
            {isSubmitting ? (
              "Speichern..."
            ) : showSuccess ? (
              <span className="flex items-center">
                <Check className="mr-1 h-4 w-4" />
                Gespeichert
              </span>
            ) : (
              "Speichern"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
