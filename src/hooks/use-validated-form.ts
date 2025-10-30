"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  ValidationErrorT,
  ValidationPopoverBgT,
} from "@/components/ui/validation-popover";

export type FieldValidatorT<FormValuesT> = (
  value: string | boolean | null,
  values: FormValuesT
) => string | string[] | ValidationErrorT[] | undefined;

export type ValidatedFormOptionsT<FormValuesT> = {
  initialValues: FormValuesT;
  validators?: Partial<Record<keyof FormValuesT, FieldValidatorT<FormValuesT>>>;
  serverErrors?: Partial<
    Record<keyof FormValuesT, string | string[] | ValidationErrorT[]>
  >;
};

export type FieldPropsT = {
  name: string;
  id?: string;
  value?: string;
  checked?: boolean;
  type?: string;
  showPasswordToggle?: boolean;
  bgVariant?: ValidationPopoverBgT;
  // Input/Change
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Optional: for components like InputWithLabel that call onValidation directly
  onValidation?: (field: string, value: string) => void;
  // Error compatible with ValidationPopover
  error?:
    | string
    | string[]
    | ValidationErrorT[]
    | (string | ValidationErrorT)[];
};

export function useValidatedForm<FormValuesT extends Record<string, unknown>>(
  options: ValidatedFormOptionsT<FormValuesT>
) {
  const { initialValues } = options;
  const validators = useMemo<
    Partial<Record<keyof FormValuesT, FieldValidatorT<FormValuesT>>>
  >(
    () =>
      options.validators ??
      ({} as Partial<Record<keyof FormValuesT, FieldValidatorT<FormValuesT>>>),
    [options.validators]
  );
  const initialServerErrors: Partial<
    Record<keyof FormValuesT, string | string[] | ValidationErrorT[]>
  > =
    options.serverErrors ??
    ({} as Partial<
      Record<keyof FormValuesT, string | string[] | ValidationErrorT[]>
    >);

  const [values, setValues] = useState<FormValuesT>(initialValues);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof FormValuesT, string | string[] | ValidationErrorT[]>>
  >({});
  const [externalServerErrors, setExternalServerErrors] =
    useState<
      Partial<Record<keyof FormValuesT, string | string[] | ValidationErrorT[]>>
    >(initialServerErrors);

  const setFieldValue = useCallback(
    <K extends keyof FormValuesT>(field: K, value: FormValuesT[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateField = useCallback(
    <K extends keyof FormValuesT>(field: K, value: string | boolean | null) => {
      const validator = validators[field];
      if (!validator) {
        // Clear error if there is no validator for this field
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
        return;
      }

      try {
        const errorResult = validator(value, values);
        setValidationErrors((prev) => ({ ...prev, [field]: errorResult }));
      } catch {
        // Defensive: never throw from validators
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [validators, values]
  );

  const combineErrors = useCallback(
    (
      field: keyof FormValuesT
    ):
      | string
      | string[]
      | ValidationErrorT[]
      | (string | ValidationErrorT)[]
      | undefined => {
      const vErr = validationErrors[field];
      const sErr = externalServerErrors[field];

      if (!vErr && !sErr) return undefined;

      const vList = Array.isArray(vErr) ? vErr : vErr ? [vErr] : [];
      const sList = Array.isArray(sErr) ? sErr : sErr ? [sErr] : [];

      return [...vList, ...sList];
    },
    [validationErrors, externalServerErrors]
  );

  const getFieldProps = useCallback(
    <K extends keyof FormValuesT>(
      field: K,
      opts?: {
        id?: string;
        type?: string;
        showPasswordToggle?: boolean;
        bgVariant?: ValidationPopoverBgT;
      }
    ): FieldPropsT => {
      const currentValue = values[field];
      const isCheckbox = opts?.type === "checkbox";

      return {
        name: String(field),
        id: opts?.id ?? String(field),
        type: opts?.type,
        showPasswordToggle: opts?.showPasswordToggle,
        bgVariant: opts?.bgVariant,
        value:
          typeof currentValue === "string"
            ? currentValue
            : !isCheckbox
              ? String(currentValue ?? "")
              : undefined,
        checked: isCheckbox ? Boolean(currentValue) : undefined,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const nextVal = isCheckbox
            ? (e.target.checked as unknown as FormValuesT[K])
            : (e.target.value as unknown as FormValuesT[K]);
          setFieldValue(field, nextVal);
          validateField(field, isCheckbox ? e.target.checked : e.target.value);
        },
        onValidation: (f: string, v: string) => {
          if (f === String(field)) validateField(field, v);
        },
        error: combineErrors(field),
      };
    },
    [values, setFieldValue, validateField, combineErrors]
  );

  const setServerErrors = useCallback(
    (
      next: Partial<
        Record<keyof FormValuesT, string | string[] | ValidationErrorT[]>
      >
    ) => setExternalServerErrors(next),
    []
  );

  const isFormValid = useMemo(() => {
    // Valid if no validationErrors values are set
    return Object.values(validationErrors).every(
      (v) => !v || (Array.isArray(v) && v.length === 0)
    );
  }, [validationErrors]);

  return {
    values,
    setFieldValue,
    validationErrors,
    setValidationErrors,
    getFieldProps,
    validateField,
    combineErrors,
    setServerErrors,
    isFormValid,
  } as const;
}
