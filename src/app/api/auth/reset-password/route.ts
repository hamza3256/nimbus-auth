import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json(
      { message: "Token and password are required" },
      { status: 400 },
    );
  }

  // Find the token
  const resetToken = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.token, token),
      eq(
        verificationTokens.identifier,
        (
          await db.query.verificationTokens.findFirst({
            where: eq(verificationTokens.token, token),
          })
        )?.identifier || "",
      ),
    ),
  });

  if (!resetToken || !resetToken.identifier.startsWith("password_reset:")) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 },
    );
  }

  if (resetToken.expires < new Date()) {
    return NextResponse.json({ message: "Token has expired" }, { status: 400 });
  }

  const email = resetToken.identifier.replace("password_reset:", "");
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, user.id));
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  return NextResponse.json({ message: "Password has been reset successfully" });
}
