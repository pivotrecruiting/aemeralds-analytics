import type { ExtendedUserT, ProfileImageT } from "../users";
import type { UserRoleAssignmentT } from "../assignments";
import type { UserRoleNameT } from "../roles";

export type PermissionCheckT<Key extends keyof PermissionsT> =
  | boolean
  | ((user: ExtendedUserT, data: PermissionsT[Key]["dataType"]) => boolean);

export type RolesWithPermissionsT = {
  [R in UserRoleNameT]: Partial<{
    [Key in keyof PermissionsT]: Partial<{
      [Action in PermissionsT[Key]["action"]]: PermissionCheckT<Key>;
    }>;
  }>;
};

export type PermissionsT = {
  users: {
    dataType: ExtendedUserT;
    action: "view" | "create" | "update" | "delete";
  };
  profile_images: {
    dataType: ProfileImageT & { user_id: string };
    action: "view" | "create" | "update" | "delete";
  };
  user_roles: {
    dataType: UserRoleAssignmentT;
    action: "view" | "create" | "update" | "delete";
  };
};

// Hinweis: user.roles ist ein Array von UserRoleT (mit name: UserRoleNameT),
// die Permission-Matrix (RolesWithPermissionsT) wird weiterhin über UserRoleNameT indexiert.
