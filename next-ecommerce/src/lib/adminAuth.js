import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "./adminJwt";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/lib/models/Admin";

async function requireAdmin() {
  const cookieStore = await cookies();
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

/** Same as requireAdmin but ensures admin has role "super_admin". Use for moderator management. */
async function requireSuperAdmin() {
  const auth = await requireAdmin();
  if (auth.error) return auth;
  const id = auth.admin?.id;
  if (!id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    await connectDB();
    const admin = await Admin.findById(id).select("role").lean();
    if (!admin || admin.role !== "super_admin") {
      return { error: NextResponse.json({ error: "Forbidden: super_admin only" }, { status: 403 }) };
    }
  } catch {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { admin: auth.admin };
}

export { requireAdmin, requireSuperAdmin };
