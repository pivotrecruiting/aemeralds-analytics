import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="grid grid-cols-[128px_1fr_1fr] grid-rows-2 gap-5 p-4">
      {/* Gender Select Skeleton */}
      <div className="flex flex-col gap-1">
        <label className="pl-1 text-sm">Geschlecht</label>
        <Skeleton className="h-11 w-32 rounded-md bg-gray-200" />
      </div>
      {/* Vorname Skeleton */}
      <div className="flex flex-col gap-1">
        <label className="pl-1 text-sm">Vorname</label>
        <Skeleton className="h-11 w-full rounded-md bg-gray-200" />
      </div>
      {/* Nachname Skeleton */}
      <div className="flex flex-col gap-1">
        <label className="pl-1 text-sm">Nachname</label>
        <Skeleton className="h-11 w-full rounded-md bg-gray-200" />
      </div>
      {/* E-Mail Skeleton (volle Breite) */}
      <div className="col-span-3 flex flex-col gap-1">
        <label className="pl-1 text-sm">E-Mail Adresse</label>
        <Skeleton className="h-11 w-full rounded-md bg-gray-200" />
      </div>
      {/* Button Skeleton */}
      <div className="col-span-3 mt-6 flex justify-end">
        <Skeleton className="h-11 w-25 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}
