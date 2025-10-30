import type {
  PermissionsT,
  PermissionCheckT,
} from "@/types/permissions/base-types";

// Generischer Typ für ein einzelnes Resource-Permissions-Objekt
// z.B. PublicPermissionsObj<"users"> erzwingt die richtigen Actions und Datentypen
export type PublicPermissionsObj<K extends keyof PermissionsT> = {
  [A in PermissionsT[K]["action"]]: PermissionCheckT<K>;
};

export const PUBLIC_PERMISSIONS: {
  users: PublicPermissionsObj<"users">;
  profile_images: PublicPermissionsObj<"profile_images">;
  user_roles: PublicPermissionsObj<"user_roles">;
} = {
  // users
  users: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  // profile_images
  profile_images: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  // user_roles
  user_roles: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
};
