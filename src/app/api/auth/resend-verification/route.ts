import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const resendSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = resendSchema.parse(body);

    // Rate limit by email address
    const rateLimitResult = await rateLimit(`resend-verification:${email}`, {
      limit: 3, // 3 attempts per hour
      window: 3600, // 1 hour in seconds
    });

    // Check if rate limited
    if (!rateLimitResult.success) {
      const resetTime = rateLimitResult.reset.toLocaleTimeString();
      return NextResponse.json(
        {
          message: `Too many verification requests. Please try again after ${resetTime}.`,
          rateLimitReset: rateLimitResult.reset,
        },
        { status: 429 }
      );
    }

    // Find the user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this email
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));

    // Generate new verification token
    const token = randomBytes(32).toString("hex");
    const expires = addHours(new Date(), 1);
    
    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    });

    // Send verification email
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1C3A70;">Verify Your Email Address</h2>
          <p>Please click the button below to verify your email address.</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #FF9800; color: white; font-weight: bold; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #666;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this email, you can safely ignore it.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Verification email sent",
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    console.error("Error resending verification email:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 