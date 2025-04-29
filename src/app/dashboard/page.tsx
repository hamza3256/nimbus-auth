import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import SignOutButton from "@/components/auth/signout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-b from-white/50 via-[#FFD600]/10 to-white/40 flex flex-col">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
          <Image
            src="/main-title.png"
            alt="NimbusAuth Dragon Ball Title"
            width={200}
            height={45}
            priority
            className="drop-shadow-lg"
          />
          <p className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-[#1C3A70] mt-2 sm:mt-0">Dashboard</p>
        </div>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <SignOutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl mx-auto">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-[#1C3A70]">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-[#1C3A70]">{session.user.name || "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Example Protected Data Card */}
        <Card>
          <CardHeader>
            <CardTitle>Protected Data Example</CardTitle>
            <CardDescription>
              This content is only visible to authenticated users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is an example of a protected route in Next.js. You can only see this
              content if you are authenticated. The session is checked server-side
              using getServerSession.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 