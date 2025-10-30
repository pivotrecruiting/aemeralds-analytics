import type {
  PermissionsT,
  PermissionCheckT,
} from "@/types/permissions/base-types";

export type ManagerPermissionsObj<K extends keyof PermissionsT> = {
  [A in PermissionsT[K]["action"]]: PermissionCheckT<K>;
};

export const MANAGER_PERMISSIONS: {
  users: ManagerPermissionsObj<"users">;
  profile_images: ManagerPermissionsObj<"profile_images">;
  user_roles: ManagerPermissionsObj<"user_roles">;
} = {
  // users
  users: {
    view: true,
    create: true,
    update: true,
    delete: (user, targetUser) =>
      targetUser.roles.some((r: { name: string }) => r.name !== "admin"), // Keine Admins löschen
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
    view: (user, assignment) => assignment.user_id === user.id,
    create: false,
    update: false,
    delete: false,
  },
};
