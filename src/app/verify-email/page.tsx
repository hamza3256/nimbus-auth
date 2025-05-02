"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }
      const res = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Email verified successfully. You can now sign in.");
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed.");
      }
    }
    verify();
  }, [token]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-center">
          {status === "pending" && <p>Verifying...</p>}
          {status === "success" && (
            <>
              <p className="text-green-600">{message}</p>
              <Button className="mt-4 w-full" onClick={() => router.push("/signin")}>Sign In</Button>
            </>
          )}
          {status === "error" && <p className="text-red-600">{message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
} 