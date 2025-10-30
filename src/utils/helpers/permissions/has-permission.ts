import { ROLES_WITH_PERMISSIONS } from "@/lib/auth/role-permissions";
import type {
  PermissionsT,
  RolesWithPermissionsT,
} from "@/types/permissions/base-types";
import type { ExtendedUserT } from "@/types/users";

/**
 * Permission System - Berechtigungsprüfung für Benutzer
 *
 * Diese Funktion implementiert ein flexibles Berechtigungssystem, das auf Rollen basiert.
 * Sie prüft, ob ein Benutzer eine bestimmte Aktion auf einer Ressource ausführen darf.
 *
 * ## Funktionsweise:
 *
 * 1. **Rollen-basierte Berechtigung**: Jeder Benutzer hat eine oder mehrere Rollen
 * 2. **Ressourcen und Aktionen**: Berechtigungen werden für spezifische Ressourcen (z.B. 'users', 'posts')
 *    und Aktionen (z.B. 'read', 'write', 'delete') definiert
 * 3. **Fallback auf Public**: Wenn kein Benutzer übergeben wird, wird automatisch die 'public' Rolle verwendet
 * 4. **OR-Logik**: Wenn mindestens eine Rolle des Benutzers die Berechtigung hat, wird true zurückgegeben
 *
 * ## Parameter (Props):
 *
 * @param user - Der zu prüfende Benutzer (ExtendedUserT | null)
 *   - Wenn null, wird automatisch die 'public' Rolle verwendet
 *   - Muss die Eigenschaft 'roles' haben, die ein Array von Rollen-Objekten enthält
 *
 * @param resource - Die Ressource, auf die zugegriffen werden soll (keyof PermissionsT)
 *   - Beispiele: 'users', 'posts', 'locations', 'departments'
 *   - Muss in der PermissionsT Type-Definition definiert sein
 *
 * @param action - Die Aktion, die ausgeführt werden soll (PermissionsT[Resource]["action"])
 *   - Beispiele: 'read', 'write', 'delete', 'create'
 *   - Muss für die angegebene Ressource in der PermissionsT Type-Definition definiert sein
 *
 * @param data - Optional: Spezifische Daten für die Berechtigungsprüfung (PermissionsT[Resource]["dataType"])
 *   - Wenn angegeben: Prüft Berechtigung für genau dieses Objekt (z.B. darf User X User Y bearbeiten?)
 *   - Wenn nicht angegeben: Prüft generelle Berechtigung für die Ressource (z.B. darf User X alle User sehen?)
 *
 * ## Rückgabewert:
 *
 * @returns boolean - true wenn der Benutzer die Berechtigung hat, false sonst
 *
 * ## Berechtigungstypen:
 *
 * 1. **Boolean-Berechtigungen**: Einfache true/false Werte
 *    ```typescript
 *    users: {
 *      read: true,  // Alle User mit dieser Rolle können User lesen
 *      write: false // Keine User mit dieser Rolle können User schreiben
 *    }
 *    ```
 *
 * 2. **Funktions-Berechtigungen**: Komplexe Logik für spezifische Objekte
 *    ```typescript
 *    users: {
 *      update: (currentUser, targetUser) => {
 *        return currentUser.id === targetUser.id; // Nur eigene Daten bearbeiten
 *      }
 *    }
 *    ```
 *
 * ## Verwendungsbeispiele:
 *
 * ```typescript
 * // Prüfe generelle Lesebelechtigung für User
 * const canReadUsers = hasPermission(user, 'users', 'read');
 *
 * // Prüfe spezifische Update-Berechtigung für einen User
 * const canUpdateUser = hasPermission(user, 'users', 'update', targetUser);
 *
 * // Prüfe Public-Berechtigung (wenn user = null)
 * const canPublicRead = hasPermission(null, 'posts', 'read');
 *
 * // Prüfe komplexe Berechtigung mit Funktion
 * const canDeletePost = hasPermission(user, 'posts', 'delete', post);
 * ```
 *
 * ## Debugging:
 *
 * Die Funktion gibt Console-Logs aus für:
 * - permission: Die gefundene Berechtigung (boolean oder Funktion)
 * - roleName: Den aktuell geprüften Rollennamen
 * - effectiveUser: Den effektiven Benutzer (original oder public fallback)
 *
 * ## Type Safety:
 *
 * Die Funktion ist vollständig typisiert und nutzt TypeScript Generics:
 * - Resource muss ein gültiger Schlüssel von PermissionsT sein
 * - Action muss für die angegebene Resource definiert sein
 * - Data muss dem korrekten Typ für die Resource entsprechen
 */
export function hasPermission<Resource extends keyof PermissionsT>(
  user: ExtendedUserT | null,
  resource: Resource,
  action: PermissionsT[Resource]["action"],
  data?: PermissionsT[Resource]["dataType"]
) {
  // Wenn kein User übergeben wurde, als public prüfen
  const effectiveUser = user ?? {
    id: "public",
    firstName: null,
    lastName: null,
    gender: null,
    createdAt: "",
    updatedAt: null,
    termsPrivacy: null,
    termsAgb: null,
    roles: [{ id: "public", name: "public" }],
    profileImage: null,
  };
  // Für alle Rollen des Users prüfen, ob mindestens eine die Berechtigung erlaubt
  return effectiveUser.roles
    .map((role) => role.name)
    .some((roleName) => {
      // Hole die Berechtigung für die Rolle, Ressource und Aktion
      const permission = (ROLES_WITH_PERMISSIONS as RolesWithPermissionsT)[
        roleName
      ]?.[resource]?.[action];
      if (permission == null) return false; // Keine Berechtigung definiert
      // Wenn die Berechtigung ein Boolean ist, direkt zurückgeben
      if (typeof permission === "boolean") return permission;
      // Wenn die Berechtigung eine Funktion ist, nur true wenn 'data' übergeben wurde und die Funktion true ergibt
      return data != null && permission(effectiveUser, data);
    });
}
