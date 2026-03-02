/**
 * Moderators API - List and create moderators (super_admin only)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/lib/models/Admin";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

/** Requires admin to be super_admin (used for moderator management). */
async function ensureSuperAdmin() {
  const auth = await requireAdmin();
  if (auth.error) return auth;
  const id = auth.admin?.id;
  if (!id) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  await connectDB();
  const doc = await Admin.findById(id).select("role").lean();
  if (!doc || doc.role !== "super_admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { admin: auth.admin };
}

const MAX_MODERATORS = 5;
const DEFAULT_PERMISSIONS = {
  products: false,
  orders: false,
  customers: false,
  coupons: false,
  categories: false,
  content: false,
  delivery: false,
  dashboard: false,
};

export async function GET() {
  const auth = await ensureSuperAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) return NextResponse.json([]);

  try {
    await connectDB();
    const moderators = await Admin.find({ role: "moderator" })
      .select("-password")
      .lean();
    return NextResponse.json(
      moderators.map((m) => ({
        ...m,
        id: m._id?.toString(),
        _id: undefined,
        __v: undefined,
      }))
    );
  } catch (err) {
    console.error("Moderators GET:", err);
    return NextResponse.json({ error: "Failed to fetch moderators" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await ensureSuperAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) {
    return NextResponse.json(
      { error: "Database required for moderators." },
      { status: 503 }
    );
  }

  try {
    const count = await Admin.countDocuments({ role: "moderator" });
    if (count >= MAX_MODERATORS) {
      return NextResponse.json(
        { error: "Maximum 5 moderators allowed." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, password, permissions } = body;
    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Name, email, and password (min 6 chars) are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const exists = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already used." }, { status: 400 });
    }

    const perm = { ...DEFAULT_PERMISSIONS };
    if (permissions && typeof permissions === "object") {
      Object.keys(perm).forEach((k) => {
        if (permissions[k] === true) perm[k] = true;
      });
    }

    const moderator = await Admin.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: "moderator",
      permissions: perm,
    });

    const out = moderator.toObject();
    delete out.password;
    return NextResponse.json({ ...out, id: moderator._id?.toString() });
  } catch (err) {
    console.error("Moderators POST:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create moderator" },
      { status: 500 }
    );
  }
}
