import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import { verificationTokens } from "@/db/schema";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, password } = registerSchema.parse(body);

    // Check if email or username already exists
    const existingUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 },
      );
    }

    const existingUserByUsername = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate verification token
    const token = randomBytes(32).toString("hex");
    const expires = addHours(new Date(), 1);
    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href='${verifyUrl}'>here</a> to verify your email. This link will expire in 1 hour.</p>`,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
