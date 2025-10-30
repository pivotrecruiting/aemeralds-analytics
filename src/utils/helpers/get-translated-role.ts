import type { UserRolesT } from "@/lib/dal";

export function getTranslatedRole(role: UserRolesT) {
  switch (role) {
    case "user":
      return "Benutzer";
    case "admin":
      return "Admin";
    default:
      return "Benutzer";
  }
}
