/**
 * Get current admin (verify JWT)
 */

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/adminJwt";

export async function GET(request) {
  const token = request.cookies?.get("adminToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  return NextResponse.json({ admin: payload });
}
