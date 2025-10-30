export const USER_ROLES = [
  "public",
  "user",
  "backoffice",
  "manager",
  "admin",
] as const;

export type UserRoleNameT = (typeof USER_ROLES)[number];

export type UserRoleT = {
  id: string;
  name: UserRoleNameT;
};

export type UserRolesObjT = {
  role: UserRoleT;
};
