/**
 * Forgot Password API - Request reset link
 * POST { email }
 */

import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/services/userService";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const result = await requestPasswordReset(email.trim().toLowerCase());
    return NextResponse.json({
      success: true,
      message: "If this email exists, we've sent a reset link.",
      resetUrl: result.resetUrl,
    });
  } catch (err) {
    console.error("Forgot password:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
