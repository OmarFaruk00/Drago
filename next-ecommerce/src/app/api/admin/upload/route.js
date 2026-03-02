/**
 * Admin Image Upload API
 * - Localhost: saves to public/uploads
 * - Production (Vercel/serverless): uploads to Cloudinary
 */

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/adminAuth";

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
    folder: "drago-uploads",
    resource_type: "image",
  });
  return result.secure_url;
}

async function uploadToLocal(buffer, ext) {
  const name = `img-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, name);
  await writeFile(filePath, buffer);
  return `/uploads/${name}`;
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided. Select an image to upload." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.` },
        { status: 400 }
      );
    }
    let ext = (path.extname(file.name || "") || ".jpg").toLowerCase().replace(/^\./, "");
    if (!/^[a-z0-9]+$/.test(ext)) ext = "jpg";

    let url;
    const isProd = process.env.NODE_ENV === "production";

    if (HAS_CLOUDINARY) {
      url = await uploadToCloudinary(buffer, ext);
    } else if (isProd) {
      return NextResponse.json(
        {
          error:
            "Main site requires Cloudinary. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in your hosting environment variables. Get free at cloudinary.com",
        },
        { status: 503 }
      );
    } else {
      url = await uploadToLocal(buffer, ext);
    }

    return NextResponse.json({ url });
  } catch (err) {
    const msg = err?.message || String(err);
    console.error("Upload error:", msg);
    const hint = HAS_CLOUDINARY ? "Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET in Vercel. Redeploy after adding env vars." : "Add Cloudinary env vars in Vercel.";
    const errMsg = `Upload failed: ${msg}. ${hint}`;
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
