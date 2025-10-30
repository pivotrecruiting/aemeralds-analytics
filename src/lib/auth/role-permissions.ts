import { USER_PERMISSIONS } from "./role-permissions/user-permissions";
import { BACKOFFICE_PERMISSIONS } from "./role-permissions/backoffice-permissions";
import { MANAGER_PERMISSIONS } from "./role-permissions/manager-permissions";
import { ADMIN_PERMISSIONS } from "./role-permissions/admin-permissions";
import { PUBLIC_PERMISSIONS } from "./role-permissions/public-permissions";
import type { RolesWithPermissionsT } from "@/types/permissions/base-types";

export const ROLES_WITH_PERMISSIONS = {
  public: PUBLIC_PERMISSIONS,
  user: USER_PERMISSIONS,
  backoffice: BACKOFFICE_PERMISSIONS,
  manager: MANAGER_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
} as const satisfies RolesWithPermissionsT;

// USAGE:
/*
import { hasPermission } from "@/app/utils/helpers/permissions/has-permission";
import type { ExtendedUserT } from "@/app/types/users";
const user: ExtendedUserT = {
  id: "1",
  firstName: null,
  lastName: null,
  gender: null,
  createdAt: "",
  updatedAt: null,
  termsPrivacy: null,
  termsAgb: null,
  roles: [{ id: "1", name: "user" }],
  profileImage: null,
};
export const targetUser: ExtendedUserT = {
  id: "2",
  firstName: null,
  lastName: null,
  gender: null,
  createdAt: "",
  updatedAt: null,
  termsPrivacy: null,
  termsAgb: null,
  roles: [{ id: "2", name: "manager" }],
  profileImage: null,
};


// Kann der User einen anderen User sehen?
hasPermission(user, "users", "view", targetUser);

// Kann der User einen neuen User anlegen?
hasPermission(user, "users", "create");

// Kann der User einen anderen User bearbeiten?
hasPermission(user, "users", "update", targetUser);

// Kann der User einen anderen User löschen?
hasPermission(user, "users", "delete", targetUser);
*/
