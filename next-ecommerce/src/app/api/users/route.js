/**
 * API Route: /api/users
 * POST - Login or Register (mock auth, ready for MongoDB + bcrypt)
 * Uses userService - works with dummy data or MongoDB
 */

import { NextResponse } from "next/server";
import { loginUser, registerUser } from "@/lib/services/userService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === "login") {
      const user = await loginUser(email, password);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
      return NextResponse.json({ user });
    }

    if (action === "register") {
      const user = await registerUser({ email, password, name });
      if (!user) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}
