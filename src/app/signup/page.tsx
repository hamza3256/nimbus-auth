"use client";

import { useState } from "react";
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
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useOAuthProviders } from "@/lib/auth/utils";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { oauthProviders, isLoadingProviders } = useOAuthProviders();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Account created successfully");
      router.push("/signin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm your password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or sign up with
                  </span>
                </div>
              </div>

              {isLoadingProviders && (
                <p className="text-center text-sm text-muted-foreground">
                  Loading sign up options...
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
                          // No need to setIsLoading(false) here as signIn will navigate away
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
                        Sign up with Google
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
                        Sign up with Facebook
                      </Button>
                    )}
                    {oauthProviders.github && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          setIsLoading(true);
                          await signIn("github", { callbackUrl: "/dashboard" });
                        }}
                        disabled={isLoading}
                      >
                        <Image src="/icons/social/github-logo.svg" alt="GitHub" width={20} height={20} className="mr-2" />
                        Sign up with GitHub
                      </Button>
                    )}
                    {oauthProviders.apple && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          setIsLoading(true);
                          await signIn("apple", { callbackUrl: "/dashboard" });
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
                        Sign up with Apple
                      </Button>
                    )}
                  </div>
                )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
