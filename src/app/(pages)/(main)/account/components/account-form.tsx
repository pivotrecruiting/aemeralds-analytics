import ClientAccountForm from "./client-account-form";
import { getPublicUser, verifySession } from "@/lib/dal";

export default async function AccountForm() {
  const [session, user] = await Promise.all([verifySession(), getPublicUser()]);
  if (!session || !user) return null;

  const initialData = {
    firstName: user.first_name,
    lastName: user.last_name,
    email: session.user.email || "",
    gender: user.gender || null,
    role: user.user_roles[0].roles.name,
  };

  return <ClientAccountForm initialData={initialData} />;
}
