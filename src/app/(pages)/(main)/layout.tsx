import { Suspense } from "react";
import NavbarWrapper from "@/components/ui/navbar-wrapper";
import { NavbarSkeleton } from "@/components/backend/navbar";
import type { Metadata } from "next";

import "@/styles/globals.css";

// TODO: Add your metadata
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Project",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1194px] p-4 sm:p-8 sm:pt-4">
      <Suspense fallback={<NavbarSkeleton />}>
        <NavbarWrapper />
      </Suspense>
      <div>{children}</div>
    </div>
  );
}
