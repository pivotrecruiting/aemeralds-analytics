export function setAvatarUrl({
  avatarUrl,
  gender,
}: {
  avatarUrl: string | null;
  gender: string | null;
}) {
  if (avatarUrl) {
    return avatarUrl;
  } else {
    // TODO: add female and male avatar urls as fallback if different are needed
    switch (gender) {
      case "male":
        return "/divers-avatar.svg";
      case "female":
        return "/divers-avatar.svg";
      case "divers":
        return "/divers-avatar.svg";

      default:
        return "/divers-avatar.svg";
    }
  }
}
