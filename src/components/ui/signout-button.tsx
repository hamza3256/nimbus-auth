"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-full shadow-md border-2 border-[#1C3A70] transition-colors duration-200"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signOut({ redirect: false });
          window.location.reload();
        });
      }}
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
} 