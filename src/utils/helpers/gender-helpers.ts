import type { GenderT, UserRolesT } from "@/lib/dal";

/**
 * Übersetzt den Gender-Wert in eine lesbare deutsche Bezeichnung
 * @param gender Das Geschlecht (male/female/divers/null)
 * @returns Deutsche Bezeichnung des Geschlechts (Männlich/Weiblich/Divers/Keine Angabe)
 */

export const getGenderLabel = (gender: GenderT | null): string => {
  if (!gender) return "Keine Angabe";

  switch (gender) {
    case "male":
      return "Männlich";
    case "female":
      return "Weiblich";
    case "divers":
      return "Divers";
    default:
      return "Keine Angabe";
  }
};

/**
 * Gibt die rollen- und geschlechtsspezifische Bezeichnung für einen Benutzer zurück
 * @param role Die Rolle des Benutzers (user, admin)
 * @param gender Das Geschlecht des Benutzers (male, female, divers, null)
 * @returns Die passende Bezeichnung als string
 */

export function getAccountGenderLabel(
  role: UserRolesT,
  gender: GenderT
): string {
  // If standard user
  if (role === "user") {
    if (gender === "male") return "Benutzer";
    if (gender === "female") return "Benutzerin";
    return "Benutzer";
  }
  // If admin
  if (role === "admin") return "Admin";
  return "Benutzer";
}
