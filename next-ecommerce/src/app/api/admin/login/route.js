/**
 * Admin Login API - returns JWT
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/lib/models/Admin";
import { signToken } from "@/lib/adminJwt";
import { mockUsers } from "@/lib/data/users";

const USE_MONGODB = !!process.env.MONGODB_URI;

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    let admin = null;

    if (USE_MONGODB) {
      try {
        const conn = await connectDB();
        if (conn) {
          admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");
          if (admin && !(await admin.comparePassword(password))) admin = null;
        }
      } catch (dbErr) {
        console.error("Admin login DB error:", dbErr?.message || dbErr);
      }
    }
    if (!admin) {
      const mockAdmin = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password && u.role === "admin"
      );
      if (mockAdmin) admin = { id: mockAdmin.id, email: mockAdmin.email, name: mockAdmin.name };
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const payload = {
      id: admin._id?.toString() || admin.id,
      email: admin.email,
      name: admin.name,
    };
    const token = signToken(payload);

    const response = NextResponse.json({
      token,
      admin: { id: payload.id, email: payload.email, name: payload.name },
    });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err?.message || err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
