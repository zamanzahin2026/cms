import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth-guard";
import { SiteContentSchema } from "@/lib/content-schema";
import { createAdminClient } from "@/lib/supabase/admin";
import defaultSiteContent from "@/content/site.default.json";

function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("site_content")
      .select("data, updated_at")
      .eq("id", "main")
      .single();

    if (error || !data) {
      return NextResponse.json({ content: defaultSiteContent });
    }

    return NextResponse.json({ content: data.data, updated_at: data.updated_at });
  } catch (err: any) {
    return NextResponse.json({ content: defaultSiteContent });
  }
}

export async function PUT(request: Request) {
  if (!verifyOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
  }

  // Validate strictly against SiteContentSchema
  const parsed = SiteContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed: payload does not match schema exactly", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  try {
    // 1. Fetch current content to push to history
    const { data: currentContent } = await adminClient
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .single();

    if (currentContent?.data) {
      // Insert old version into history
      await adminClient.from("site_content_history").insert({
        data: currentContent.data,
      });

      // Trim history to keep only the newest 20 rows
      const { data: oldVersions } = await adminClient
        .from("site_content_history")
        .select("id")
        .order("id", { ascending: false });

      if (oldVersions && oldVersions.length > 20) {
        const idsToDelete = oldVersions.slice(20).map((v) => v.id);
        await adminClient.from("site_content_history").delete().in("id", idsToDelete);
      }
    }

    // 2. Save new content to site_content
    const { error: upsertError } = await adminClient
      .from("site_content")
      .upsert({
        id: "main",
        data: parsed.data,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      throw upsertError;
    }

    // 3. Revalidate live site cache tags and path
    revalidateTag("site-content");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to update site content:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update content in database" },
      { status: 500 }
    );
  }
}
