"use client";

import { useState, useEffect } from "react";
import type { DecodedDataT, SearchParamsT } from "../registrieren/page";

type FormDataT = {
  gender: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms_agb: boolean;
  terms_privacy: boolean;
  terms_usage: boolean;
  school_id?: string;
  class_id?: string;
  role?: string;
};

type ValidationErrorsT = {
  gender?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  terms_agb?: string;
  terms_privacy?: string;
  terms_usage?: string;
};

type UseRegistrationFormPropsT = {
  decodedData: DecodedDataT;
  serverErrors: SearchParamsT;
};

export function useRegistrationForm({
  decodedData,
  serverErrors,
}: UseRegistrationFormPropsT) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataT>({
    gender: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    terms_agb: false,
    terms_privacy: false,
    terms_usage: false,
    school_id: decodedData?.school_id,
    class_id: decodedData?.class_id,
    role: decodedData?.role,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrorsT>(
    {}
  );

  const handleInputChange = (
    field: keyof FormDataT,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field as keyof ValidationErrorsT]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Check if all required fields are filled for step 2
  const isStep2Valid = () => {
    return (
      formData.password.trim() !== "" &&
      formData.confirm_password.trim() !== "" &&
      formData.terms_agb &&
      formData.terms_privacy &&
      formData.terms_usage
    );
  };

  useEffect(() => {
    if (serverErrors.authError || serverErrors.connectionError) {
      setCurrentStep(2);
    }
  }, [serverErrors.authError, serverErrors.connectionError]);

  // Restore form data from URL parameters if they exist
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const restoredData = {
      gender: urlParams.get("gender") || "",
      first_name: urlParams.get("first_name") || "",
      last_name: urlParams.get("last_name") || "",
      email: urlParams.get("email") || "",
      password: urlParams.get("password") || "",
      confirm_password: urlParams.get("confirm_password") || "",
      terms_agb: urlParams.get("terms_agb") === "true",
      terms_privacy: urlParams.get("terms_privacy") === "true",
      terms_usage: urlParams.get("terms_usage") === "true",
    };

    // Only restore if we have some data
    if (
      restoredData.gender ||
      restoredData.first_name ||
      restoredData.last_name ||
      restoredData.email
    ) {
      setFormData((prev) => ({
        ...prev,
        ...restoredData,
        school_id: decodedData?.school_id,
        class_id: decodedData?.class_id,
        role: decodedData?.role,
      }));

      // If we have password data, we're on step 2
      if (restoredData.password || restoredData.confirm_password) {
        setCurrentStep(2);
      }
    }
  }, [decodedData]);

  return {
    currentStep,
    formData,
    validationErrors,
    handleInputChange,
    handleNext,
    handlePrevious,
    isStep2Valid,
  };
}
