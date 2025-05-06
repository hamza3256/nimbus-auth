"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import { useOAuthProviders } from "@/lib/auth/utils";

const formSchema = z.object({
  login: z.string().min(1, "Email or Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { oauthProviders, isLoadingProviders } = useOAuthProviders();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setShowResendOption(false);

    try {
      const result = await signIn("credentials", {
        login: values.login,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "Please verify your email before signing in") {
          if (values.login.includes("@")) {
            setResendEmail(values.login);
          } else {
            setResendEmail("");
          }
          setShowResendOption(true);
          toast.error("Please verify your email before signing in.");
        } else {
          toast.error(result.error);
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!resendEmail) {
      toast.info(
        "Please enter your email address to resend the verification link.",
      );
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited
          toast.error(data.message);
        } else {
          toast.error(data.message || "Failed to resend verification email");
        }
        return;
      }

      toast.success(
        "Verification email has been sent. Please check your inbox.",
      );

      if (data.remaining !== undefined) {
        toast.info(`You have ${data.remaining} resend attempts remaining.`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com or username"
                        type="text"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end mb-2">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {isLoadingProviders && (
                <p className="text-center text-sm text-muted-foreground">
                  Loading login options...
                </p>
              )}
              {!isLoadingProviders &&
                oauthProviders &&
                Object.keys(oauthProviders).length > 0 && (
                  <div className="space-y-2">
                    {oauthProviders.google && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          setIsLoading(true);
                          await signIn("google", { callbackUrl: "/dashboard" });
                          setIsLoading(false); // May not be reached if redirected
                        }}
                        disabled={isLoading}
                      >
                        <Image
                          src="/icons/social/google-logo.svg"
                          alt="Google"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Sign in with Google
                      </Button>
                    )}
                    {oauthProviders.facebook && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          setIsLoading(true);
                          await signIn("facebook", {
                            callbackUrl: "/dashboard",
                          });
                          setIsLoading(false); // May not be reached if redirected
                        }}
                        disabled={isLoading}
                      >
                        <Image
                          src="/icons/social/facebook-logo.svg"
                          alt="Facebook"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Sign in with Facebook
                      </Button>
                    )}
                    {oauthProviders.github && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          setIsLoading(true);
                          await signIn("github", { callbackUrl: "/dashboard" });
                          setIsLoading(false); // May not be reached
                        }}
                        disabled={isLoading}
                      >
                        <Image src="/icons/social/github-logo.svg" alt="GitHub" width={20} height={20} className="mr-2" />
                        Sign in with GitHub
                      </Button>
                    )}
                    {oauthProviders.apple && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          setIsLoading(true);
                          await signIn("apple", { callbackUrl: "/dashboard" });
                          setIsLoading(false); // May not be reached if redirected
                        }}
                        disabled={isLoading}
                      >
                        <Image
                          src="/icons/social/apple-logo.svg"
                          alt="Apple"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Sign in with Apple
                      </Button>
                    )}
                  </div>
                )}

              {showResendOption && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">
                    Please verify your email before signing in.
                    {!resendEmail &&
                      showResendOption &&
                      " If you used a username, please try signing in with your email to resend the verification."}
                  </p>
                  {resendEmail && showResendOption && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-sm h-9"
                      onClick={handleResendVerification}
                      disabled={isResending}
                    >
                      {isResending ? "Sending..." : "Resend Verification Email"}
                    </Button>
                  )}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
