"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Signed in as {session?.user?.email}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/signin" })}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
} 