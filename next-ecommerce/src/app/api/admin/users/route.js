/**
 * Admin Users API - CRUD (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { requireAdmin } from "@/lib/adminAuth";
import { mockUsers } from "@/lib/data/users";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const users = await User.find().select("-password").lean();
      return NextResponse.json(
        users.map((u) => ({ ...u, id: u._id?.toString(), _id: undefined, __v: undefined }))
      );
    }
    return NextResponse.json(
      mockUsers.map(({ password, ...u }) => ({ ...u, password: undefined }))
    );
  } catch (err) {
    console.error("Admin users GET:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, email, password, role } = body;
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (USE_MONGODB) {
      await connectDB();
      const exists = await User.findOne({ email });
      if (exists) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
      const user = await User.create({
        name,
        email,
        password,
        role: role || "user",
      });
      const { password: _, ...safe } = user.toObject();
      return NextResponse.json({ ...safe, id: user._id?.toString() });
    }

    if (mockUsers.find((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    const newUser = {
      id: `u${mockUsers.length + 1}`,
      name,
      email,
      role: role || "user",
      createdAt: new Date().toISOString().split("T")[0],
    };
    return NextResponse.json(newUser);
  } catch (err) {
    console.error("Admin users POST:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
