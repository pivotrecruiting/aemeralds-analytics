import type {
  PermissionsT,
  PermissionCheckT,
} from "@/types/permissions/base-types";

// Generischer Typ für ein einzelnes Resource-Permissions-Objekt
// z.B. UserPermissionsObj<"users"> erzwingt die richtigen Actions und Datentypen
export type UserPermissionsObj<K extends keyof PermissionsT> = {
  [A in PermissionsT[K]["action"]]: PermissionCheckT<K>;
};

// Hilfsfunktion für Bild-Besitz
function isOwnImage(user: { id: string }, image: { user_id: string }) {
  return image.user_id === user.id;
}

export const USER_PERMISSIONS: {
  users: UserPermissionsObj<"users">;
  profile_images: UserPermissionsObj<"profile_images">;
  user_roles: UserPermissionsObj<"user_roles">;
} = {
  // users
  users: {
    view: (user, targetUser) => user.id === targetUser.id, // Eigene Daten sehen
    create: false, // User kann keinen neuen User anlegen
    update: (user, targetUser) => user.id === targetUser.id, // Nur eigene Daten bearbeiten
    delete: false, // User kann sich nicht selbst löschen
  },
  // profile_images
  profile_images: {
    view: isOwnImage, // Nur eigene Bilder sehen
    create: isOwnImage, // Nur eigenes Bild anlegen
    update: isOwnImage, // Nur eigenes Bild bearbeiten
    delete: isOwnImage, // Nur eigenes Bild löschen
  },
  // user_roles
  user_roles: {
    view: (user, assignment) => assignment.user_id === user.id,
    create: false,
    update: false,
    delete: false,
  },
};
