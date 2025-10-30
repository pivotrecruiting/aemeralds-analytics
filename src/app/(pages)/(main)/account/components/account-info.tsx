import { getPublicUser } from "@/lib/dal";
import { getAccountGenderLabel } from "@/utils/helpers/gender-helpers";
import AvatarInput from "./avatar-input";
import type { GenderT } from "@/lib/dal";

export default async function AccountInfo() {
  const user = await getPublicUser();

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <AvatarInput
        id={user.id}
        avatar={user.avatar}
        gender={user.gender as GenderT}
      />
      <div />
      <div className="mt-4 text-center">
        <h2 className="header">
          {user.first_name} {user.last_name}
        </h2>
        <p className="text-muted-foreground text-sm">
          {getAccountGenderLabel(
            user.user_roles[0].roles.name,
            user.gender || null
          )}
        </p>
      </div>
    </div>
  );
}
