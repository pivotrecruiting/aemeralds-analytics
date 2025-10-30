import { getBaseUrl } from "@/utils/helpers/get-base-url";

// Bekannte Fehlerparametertypen, die wir entfernen möchten
export const ERROR_PARAMS = [
  "emailError",
  "passwordError",
  "firstNameError",
  "lastNameError",
  "authError",
  "connectionError",
];

// Alternative Funktion zum Anhängen mehrerer Fehler auf einmal
export function appendMultipleErrorParams(
  url: string,
  errors: Record<string, string>
): string {
  const baseUrl = getBaseUrl();
  const urlObj = new URL(url, baseUrl);

  // Entferne zuerst alle bekannten Fehlerparameter
  ERROR_PARAMS.forEach((errorParam) => {
    urlObj.searchParams.delete(errorParam);
  });

  // Füge dann die neuen Fehlerparameter hinzu
  Object.entries(errors).forEach(([param, value]) => {
    if (value) {
      urlObj.searchParams.set(param, value);
    }
  });

  return `${urlObj.pathname}${urlObj.search}`;
}
