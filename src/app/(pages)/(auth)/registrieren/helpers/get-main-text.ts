import type { DecodedDataT } from "../page";

//  TODO: Update texts based on specific needs
export function getMainText(decodedData: DecodedDataT) {
  if (!decodedData) {
    return "Gib deine Daten ein, um dich zu registrieren.";
  }

  if (decodedData.role === "user") {
    return "Gib deine Daten ein, um dich als Benutzer zu registrieren.";
  }

  if (decodedData.role === "admin") {
    return "Gib deine Daten ein, um dich als ... zu registrieren.";
  }

  return "Gib deine Daten ein, um dich zu registrieren.";
}
