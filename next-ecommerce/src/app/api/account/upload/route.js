/**
 * Account Image Upload - Authenticated users only (avatar)
 * - Localhost: saves to public/uploads
 * - Production (Vercel): uploads to Cloudinary
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const HAS_CLOUDINARY =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

async function uploadToCloudinary(buffer, ext) {
  const { v2: cloudinary } = await import("cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const mime = ext === "jpg" ? "jpeg" : ext;
  const base64 = `data:image/${mime};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, {
    folder: "drago-avatars",
    resource_type: "image",
  });
  return result.secure_url;
}

async function uploadToLocal(buffer, ext, session) {
  const name = `avatar-${session.user.id}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, name);
  await writeFile(filePath, buffer);
  return `/uploads/${name}`;
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let ext = (path.extname(file.name || "") || ".jpg").toLowerCase().replace(/^\./, "");
    if (!/^[a-z0-9]+$/.test(ext)) ext = "jpg";

    let url;
    const isProd = process.env.NODE_ENV === "production";

    if (HAS_CLOUDINARY) {
      url = await uploadToCloudinary(buffer, ext);
    } else if (isProd) {
      return NextResponse.json(
        { error: "Profile image upload is not configured. Please contact support or try again later." },
        { status: 503 }
      );
    } else {
      url = await uploadToLocal(buffer, ext, session);
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Account upload error:", err);
    const raw =
      err?.error?.message || err?.message || (typeof err?.error === "string" ? err.error : null) || String(err);
    return NextResponse.json({ error: raw || "Upload failed" }, { status: 500 });
  }
}
