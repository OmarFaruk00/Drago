import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "./adminJwt";

export async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const payload = verifyToken(token);
  if (!payload) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
  return { admin: payload };
}
