import { NavbarClient } from "@/components/backend/navbar";
import { getPublicUser, verifySession } from "@/lib/dal";

export default async function NavbarWrapper() {
  const [session, user] = await Promise.all([verifySession(), getPublicUser()]);
  if (!session || !user) return null;

  return <NavbarClient user={user} />;
}
