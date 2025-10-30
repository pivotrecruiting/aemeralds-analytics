import type {
  PermissionsT,
  PermissionCheckT,
} from "@/types/permissions/base-types";

export type BackofficePermissionsObj<K extends keyof PermissionsT> = {
  [A in PermissionsT[K]["action"]]: PermissionCheckT<K>;
};

// Die contactPerson-Objekte müssen ein Feld contact_person_locations: ContactPersonLocationAssignmentT[] enthalten!
// Das ist ein DTO für die Permission-Prüfung, KEIN reines DB-Model.

export const BACKOFFICE_PERMISSIONS: {
  users: BackofficePermissionsObj<"users">;
  profile_images: BackofficePermissionsObj<"profile_images">;
  user_roles: BackofficePermissionsObj<"user_roles">;
} = {
  // users
  users: {
    view: true, // Alle User sehen
    create: true, // User anlegen
    update: true, // User bearbeiten
    delete: false, // Keine User löschen
  },
  // profile_images
  profile_images: {
    view: true, // Alle Bilder sehen
    create: true, // Bilder anlegen
    update: true, // Bilder bearbeiten
    delete: true, // Bilder löschen
  },
  // user_roles
  user_roles: {
    view: true, // Select own role join
    create: false,
    update: false,
    delete: false,
  },
};
