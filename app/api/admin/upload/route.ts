import { NextResponse } from "next/server";
import crypto from "crypto";
import sharp from "sharp";
import { getAuthenticatedAdmin } from "@/lib/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify and convert using sharp
    let webpBuffer: Buffer;
    try {
      webpBuffer = await sharp(buffer)
        .rotate() // auto-rotate based on EXIF orientation
        .webp({ quality: 82 })
        .toBuffer();
    } catch (sharpError: any) {
      return NextResponse.json(
        { error: "Invalid image file. The uploaded file could not be decoded." },
        { status: 400 }
      );
    }

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "site-images";
    const filename = `${crypto.randomUUID()}.webp`;

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from(bucketName)
      .upload(filename, webpBuffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image to storage: " + uploadError.message },
        { status: 500 }
      );
    }

    // Retrieve public URL
    const {
      data: { publicUrl },
    } = adminClient.storage.from(bucketName).getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during image upload." },
      { status: 500 }
    );
  }
}
