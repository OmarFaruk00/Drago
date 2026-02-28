/**
 * Admin Image Upload API - Saves to public/uploads
 */

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/adminAuth";

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
    let ext = (path.extname(file.name || "") || ".jpg").toLowerCase().replace(/^\./, "");
    if (!/^[a-z0-9]+$/.test(ext)) ext = "jpg";
    const name = `img-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, name);
    await writeFile(filePath, buffer);
    const url = `/uploads/${name}`;
    return NextResponse.json({ url });
  } catch (err) {
    const msg = err?.message || String(err);
    console.error("Upload error:", msg);
    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      { error: isDev ? `Upload failed: ${msg}` : "Upload failed" },
      { status: 500 }
    );
  }
}
