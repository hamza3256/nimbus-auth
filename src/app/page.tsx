import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import SignOutButton from "@/components/auth/signout-button";
import { CopyTerminalCommand } from "@/components/ui/copy-terminal-command";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center flex flex-col items-center">
          <Image
            src="/main-title.png"
            alt="NimbusAuth Main Title"
            width={360}
            height={80}
            priority
            className="mx-auto drop-shadow-lg"
          />
          <p className="mt-2 text-lg font-medium text-[#23407a] tracking-wide">
            A secure authentication starter kit
          </p>
        </div>
        <CopyTerminalCommand />
        {isLoggedIn ? (
          <div className="space-y-4 text-center">
            <p className="text-[#23407a] font-normal text-sm tracking-wide mt-2">
              Signed in as {session.user.email}
            </p>
            <SignOutButton />
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-white font-medium rounded-xl border border-[#FF9800] transition-colors duration-200 focus:ring-2 focus:ring-[#FF9800]/40 focus:outline-none"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full bg-white hover:bg-[#FFF3E0] text-[#FF9800] hover:text-[#F57C00] font-medium rounded-xl border border-[#FF9800] transition-colors duration-200 focus:ring-2 focus:ring-[#FF9800]/40 focus:outline-none"
            >
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
