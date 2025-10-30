import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountInfoSkeleton() {
  return (
    <Card>
      <div className="relative flex flex-col items-center justify-center">
        {/* TODO: Add profile picture */}
        <div className="bg-muted relative z-10 mt-10 aspect-square size-32 animate-pulse rounded-full bg-cover bg-right"></div>

        <div className="mt-4 flex flex-col items-center justify-center">
          <h2 className="header">
            <Skeleton className="h-[45px] w-42" />
          </h2>
          {/* TODO: Add additional information */}
          <div className="text-muted-foreground pt-[8px] text-sm">
            {/* TODO: Add gender label */}
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
