import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  const verifyToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  if (!verifyToken) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 },
    );
  }

  if (verifyToken.expires < new Date()) {
    return NextResponse.json({ message: "Token has expired" }, { status: 400 });
  }

  const email = verifyToken.identifier;
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.id, user.id));
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  return NextResponse.json({ message: "Email verified successfully" });
}
