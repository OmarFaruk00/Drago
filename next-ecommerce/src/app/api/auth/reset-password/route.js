/**
 * Reset Password API - Set new password with token
 * POST { token, password }
 */

import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/services/userService";

export async function POST(request) {
  try {
    const { token, password, code } = await request.json();
    if (!token || !password || !code) {
      return NextResponse.json(
        { error: "Token, verification code, and password are required" },
        { status: 400 }
      );
    }
    const result = await resetPassword(token, password, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Password updated. You can now sign in." });
  } catch (err) {
    console.error("Reset password:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
