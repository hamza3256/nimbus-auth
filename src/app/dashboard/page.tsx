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
    <div className="min-h-screen p-8">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/main-title.png"
            alt="NimbusAuth Dragon Ball Title"
            width={200}
            height={45}
            priority
            className="drop-shadow-lg"
          />
          <p className="text-lg font-semibold text-[#1C3A70]">Dashboard</p>
        </div>
        <SignOutButton />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
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