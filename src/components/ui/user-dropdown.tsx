"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/client-dal";
import { User, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAvatarUrl } from "@/utils/helpers/set-avatar-url";
import type { GenderT } from "@/types/users";
import type { PublicUserT } from "@/lib/dal";

export default function UserDropdown({ user }: { user: PublicUserT }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const router = useRouter();

  /**
   * Handles user signout with proper loading state management
   */
  const handleSignout = async (): Promise<void> => {
    if (isSigningOut) return; // Prevent multiple calls

    setIsSigningOut(true);

    try {
      const { success } = await signOut();
      if (success) {
        // Only close dropdown after successful signout
        setIsOpen(false);
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error during signout:", error);
      // Keep dropdown open on error so user can retry
      // You might want to show a toast notification here
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button aria-label="Open user menu" className="outline-none">
          <div
            className="aspect-square size-10 cursor-pointer rounded-full border border-white bg-cover bg-center hover:opacity-70 active:opacity-70"
            style={{
              backgroundImage: `url('${
                setAvatarUrl({
                  avatarUrl: user.avatar?.url || null,
                  gender: user.gender as GenderT,
                }) || ""
              }')`,
            }}
          ></div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" sideOffset={2}>
        <DropdownMenuItem
          asChild
          className="focus:bg-accent focus:text-accent-foreground"
        >
          <Link
            href="/account"
            className="flex w-full cursor-pointer items-center font-normal text-inherit no-underline hover:ring-0"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
          disabled={isSigningOut}
          onSelect={(event) => {
            event.preventDefault();
            handleSignout();
          }}
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isSigningOut ? "Logge aus..." : "Ausloggen"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
