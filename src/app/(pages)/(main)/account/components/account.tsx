import Card from "@/components/ui/card";
import AccountInfo from "./account-info";
import { Suspense } from "react";
import AccountInfoSkeleton from "./account-info-skeleton";
import AccountForm from "./account-form";
import AccountFormSkeleton from "./account-form-skeleton";

export default function Account() {
  return (
    <div className="flex grid-cols-[1.25fr_2fr] flex-col gap-4 lg:grid">
      <Suspense fallback={<AccountInfoSkeleton />}>
        <div className="flex flex-col gap-4">
          {/* Profile picture and account info */}
          <Card className="relative h-full">
            <AccountInfo />
          </Card>
        </div>
      </Suspense>
      {/* Personal Info */}
      <Card>
        <div className="subheader pb-6">Persönliche Infos</div>
        <Suspense fallback={<AccountFormSkeleton />}>
          <AccountForm />
        </Suspense>
      </Card>
    </div>
  );
}
