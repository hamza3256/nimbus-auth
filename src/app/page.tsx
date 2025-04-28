import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to NimbusAuth</h1>
          <p className="mt-2 text-muted-foreground">
            A secure authentication starter kit
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
