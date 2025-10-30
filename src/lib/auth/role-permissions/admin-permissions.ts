import type {
  PermissionsT,
  PermissionCheckT,
} from "@/types/permissions/base-types";

export type AdminPermissionsObj<K extends keyof PermissionsT> = {
  [A in PermissionsT[K]["action"]]: PermissionCheckT<K>;
};

export const ADMIN_PERMISSIONS: {
  users: AdminPermissionsObj<"users">;
  profile_images: AdminPermissionsObj<"profile_images">;
  user_roles: AdminPermissionsObj<"user_roles">;
} = {
  // users
  users: {
    view: true,
    create: true,
    update: true,
    delete: true,
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
    view: true,
    create: true,
    update: true,
    delete: true,
  },
};
