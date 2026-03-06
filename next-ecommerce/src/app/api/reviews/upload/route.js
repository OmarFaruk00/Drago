/**
 * Review Image Upload - Authenticated users only (for product review images)
 * Returns single image URL per request. Client can call multiple times for multiple images.
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
    folder: "drago-reviews",
    resource_type: "image",
  });
  return result.secure_url;
}

async function uploadToLocal(buffer, ext, userId) {
  const name = `review-${userId}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, name);
  await writeFile(filePath, buffer);
  return `/uploads/${name}`;
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Login to upload review images." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Image too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.` },
        { status: 400 }
      );
    }

    let ext = (path.extname(file.name || "") || ".jpg").toLowerCase().replace(/^\./, "");
    if (!/^[a-z0-9]+$/.test(ext)) ext = "jpg";

    const isProd = process.env.NODE_ENV === "production";
    let url;

    if (HAS_CLOUDINARY) {
      url = await uploadToCloudinary(buffer, ext);
    } else if (isProd) {
      return NextResponse.json(
        { error: "Image upload is not configured. Try again later." },
        { status: 503 }
      );
    } else {
      url = await uploadToLocal(buffer, ext, session.user.id);
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Review upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
