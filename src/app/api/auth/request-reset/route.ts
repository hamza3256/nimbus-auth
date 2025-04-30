import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) {
    // For security, do not reveal if user exists
    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  }

  const token = randomBytes(32).toString("hex");
  const expires = addHours(new Date(), 1);
  await db.insert(verificationTokens).values({
    identifier: `password_reset:${email}`,
    token,
    expires,
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href='${resetUrl}'>here</a> to reset your password. This link will expire in 1 hour.</p>`
  });

  return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
} 