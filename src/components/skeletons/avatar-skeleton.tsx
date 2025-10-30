import { Skeleton } from "@/components/ui/skeleton";

export default function AvatarSkeleton() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      {/* Avatar Kreis Skeleton */}
      <Skeleton className="aspect-square size-32 rounded-full bg-gray-200" />
      {/* Name Skeleton */}
      <div className="mt-4 w-32">
        <Skeleton className="h-6 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}
