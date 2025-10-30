"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signup } from "@/services/server/actions/signup";
import RegistrationStep1 from "./registration-step-1";
import RegistrationStep2 from "./registration-step-2";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { registrationValidators } from "@/validation/registration-form-validators";
import type { DecodedDataT, SearchParamsT } from "../registrieren/page";
import type { FormDataT } from "@/types/registration-form";

// Types moved to '@/types/registration-form'

type RegistrationFormContainerPropsT = {
  decodedData: DecodedDataT;
  serverErrors: SearchParamsT;
};

export default function RegistrationFormContainer({
  decodedData,
  serverErrors,
}: RegistrationFormContainerPropsT) {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    values,
    getFieldProps,
    setFieldValue,
    validateField,
    setServerErrors,
  } = useValidatedForm<FormDataT>({
    initialValues: {
      gender: null,
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
    },
    validators: registrationValidators,
    serverErrors: {
      gender: serverErrors.genderError,
      first_name: serverErrors.firstNameError,
      last_name: serverErrors.lastNameError,
      email: serverErrors.emailError,
      password: serverErrors.passwordError,
      confirm_password: serverErrors.confirmPasswordError,
    },
  });

  const handleInputChange = <K extends keyof FormDataT>(
    field: K,
    value: FormDataT[K]
  ) => {
    setFieldValue(field, value);
    validateField(field, value as unknown as string | boolean | null);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (formDataObj: FormData) => {
    // Add all form data to FormData object
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "boolean") {
          if (value) {
            formDataObj.append(key, "on");
          }
        } else {
          formDataObj.append(key, value.toString());
        }
      }
    });

    // Add returnTo URL
    let returnToUrl = "/registrieren";
    if (decodedData?.school_id) {
      returnToUrl += `?token=${btoa(JSON.stringify(decodedData))}`;
    }
    formDataObj.append("returnTo", returnToUrl);

    await signup(formDataObj);
  };

  // Check if all required fields are filled for step 2
  const isStep2Valid = () => {
    return (
      typeof values.password === "string" &&
      values.password.trim() !== "" &&
      typeof values.confirm_password === "string" &&
      values.confirm_password.trim() !== "" &&
      Boolean(values.terms_agb) &&
      Boolean(values.terms_privacy) &&
      Boolean(values.terms_usage)
    );
  };

  useEffect(() => {
    if (serverErrors.authError || serverErrors.connectionError) {
      setCurrentStep(2);
    }
    // Keep hook's server error state in sync if it changes externally
    setServerErrors({
      gender: serverErrors.genderError,
      first_name: serverErrors.firstNameError,
      last_name: serverErrors.lastNameError,
      email: serverErrors.emailError,
      password: serverErrors.passwordError,
      confirm_password: serverErrors.confirmPasswordError,
    });
  }, [
    serverErrors.authError,
    serverErrors.connectionError,
    serverErrors.genderError,
    serverErrors.firstNameError,
    serverErrors.lastNameError,
    serverErrors.emailError,
    serverErrors.passwordError,
    serverErrors.confirmPasswordError,
    setServerErrors,
  ]);

  // ✅ SICHERHEIT: Keine Wiederherstellung von Formulardaten aus URL-Parametern
  // Dies verhindert, dass sensible Daten wie Passwörter in URLs gespeichert werden
  // Benutzer müssen Daten bei Fehlern neu eingeben - dies ist ein akzeptabler Kompromiss für bessere Sicherheit

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="mt-4 flex flex-col gap-2">
          <form action={handleSubmit}>
            {/* Hidden inputs for server data */}
            {decodedData && (
              <>
                <input
                  type="hidden"
                  name="school_id"
                  value={decodedData.school_id}
                />
                <input
                  type="hidden"
                  name="class_id"
                  value={decodedData.class_id}
                />
                <input type="hidden" name="role" value={decodedData.role} />
              </>
            )}

            {/* Step 1: Gender, First Name, Last Name */}
            {currentStep === 1 && (
              <RegistrationStep1
                values={values}
                getFieldProps={getFieldProps}
                onNext={handleNext}
                onSelectChange={(field, value) =>
                  handleInputChange(field, value as never)
                }
              />
            )}

            {/* Step 2: Password, Confirm Password, Checkboxes */}
            {currentStep === 2 && (
              <RegistrationStep2
                getFieldProps={getFieldProps}
                serverErrors={serverErrors}
                onPrevious={handlePrevious}
                isFormValid={isStep2Valid()}
              />
            )}
          </form>

          <div className="mt-3 flex flex-row justify-center gap-1.5 text-center">
            Du hast schon einen Account?
            <span className="text-primary">
              <Link href="/login">
                <Button variant="link">Jetzt anmelden!</Button>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
