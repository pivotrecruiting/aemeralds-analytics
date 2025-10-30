import { getPublicUser } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getPublicUser();
  const role = user?.user_roles[0].roles.name;

  switch (role) {
    case "user":
      return <div>User Dashboard</div>;
    case "admin":
      return <div>Admin Dashboard</div>;
    default:
      redirect("/login");
  }
}
