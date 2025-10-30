import { getMainText } from "./helpers/get-main-text";
import RegistrationSuccessStep from "./components/registration-success-step";
import RegistrationFormContainer from "../components/registration-form-container";
import type { UserRolesT } from "@/lib/dal";

// Definiere Typen für die Datenstrukturen
export type DecodedDataT = {
  school_id: string;
  class_id?: string;
  role?: UserRolesT;
} | null;

// Definiere den Typ für searchParams
export type SearchParamsT = {
  token?: string;
  firstNameError?: string;
  lastNameError?: string;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  authError?: string;
  success?: string;
  genderError?: string;
  connectionError?: string;
  termsAgbError?: string;
  termsPrivacyError?: string;
  termsUsageError?: string;
};

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<SearchParamsT>;
}) {
  // Warten auf searchParams, um sicherzustellen, dass die Daten verfügbar sind
  const params = await Promise.resolve(searchParams);

  const { success } = params;

  // Check security of let and token
  const decodedData: DecodedDataT = null;

  // TODO: Add back in if token registration is needed
  /* 
   let schoolData: SchoolDataT = null;
   let classData: ClassDataT = null;
   const token = params.token;
  
  if (token) {
    try {
      decodedData = JSON.parse(atob(token));
      // Wenn eine schoolId vorhanden ist, hole die Schuldaten
      if (decodedData?.school_id) {
        schoolData = await getSchoolById(decodedData.school_id);
      }
      // Wenn eine classId vorhanden ist, hole die Klassendaten
      if (decodedData?.class_id) {
        const fetchedClassData = await getClassById(decodedData.class_id);
        if (fetchedClassData) {
          classData = {
            id: fetchedClassData.id,
            name: fetchedClassData.name,
            school: schoolData
              ? {
                  id: schoolData.id,
                  name: schoolData.name,
                }
              : undefined,
          };
        }
        // Falls wir keine schoolId haben, aber die Klasse eine Schule hat, setzen wir die Schuldaten
        if (!schoolData && classData?.school) {
          schoolData = {
            id: classData.school.id,
            name: classData.school.name,
          };
        }
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  }
*/

  // Show success message and confirmation step
  if (success) {
    return <RegistrationSuccessStep />;
  } else {
    // If registration is not yet finished, show the registration form
    return (
      <div className="px-[11px]">
        <h1 className="header">REGISTRIEREN</h1>
        <p>{getMainText(decodedData)}</p>

        {/* TODO: Add back in if token registration is needed */}
        {/* {schoolData && (
          <p className="text-foreground/80 text-sm">
            Schule: {schoolData.name}
          </p>
        )} */}

        {/* {classData && (
          <p className="text-foreground/80 text-sm">Klasse: {classData.name}</p>
        )} */}

        <RegistrationFormContainer
          decodedData={decodedData}
          serverErrors={params}
        />
      </div>
    );
  }
}
