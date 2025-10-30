import Card from "@/components/ui/card";
import { getPublicUser, verifySession } from "@/lib/dal";
import Image from "next/image";
import ProblemForm from "./problem-form";

export default async function Problem() {
  const [session, user] = await Promise.all([verifySession(), getPublicUser()]);
  if (!session || !user) return null;

  return (
    <Card className="flex grid-cols-2 flex-col-reverse px-8 py-8 sm:flex sm:px-12 sm:py-12 md:grid lg:px-20">
      <div className="flex flex-col items-start justify-center">
        {/* Greeting message */}
        <div className="subheader">Hallo {user.first_name}!</div>

        {/* Problem Melden */}
        <ProblemForm user={user} userEmail={session.user.email} />
      </div>
      <div className="flex h-full flex-col items-center justify-center">
        <Image
          src="/trouble.webp"
          width={428}
          height={428}
          priority
          className="h-full translate-0 object-cover pb-8 sm:p-10 md:translate-x-15 lg:p-6 xl:w-full"
          alt="Trouble"
        />
      </div>
    </Card>
  );
}
