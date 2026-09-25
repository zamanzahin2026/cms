import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { SiteContentSchema } from "@/lib/content-schema";

export async function POST(request: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { versionId } = await request.json();
    if (!versionId) {
      return NextResponse.json({ error: "Version ID is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // 1. Fetch version to restore
    const { data: targetVersion, error: fetchError } = await adminClient
      .from("site_content_history")
      .select("data")
      .eq("id", versionId)
      .single();

    if (fetchError || !targetVersion?.data) {
      return NextResponse.json({ error: "Requested version not found" }, { status: 404 });
    }

    const parsed = SiteContentSchema.safeParse(targetVersion.data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Stored version failed schema validation" }, { status: 400 });
    }

    // 2. Archive current content to history before overwriting
    const { data: currentContent } = await adminClient
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .single();

    if (currentContent?.data) {
      await adminClient.from("site_content_history").insert({
        data: currentContent.data,
      });
    }

    // 3. Update site_content
    const { error: updateError } = await adminClient
      .from("site_content")
      .upsert({
        id: "main",
        data: parsed.data,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      throw updateError;
    }

    // 4. Revalidate cache
    revalidateTag("site-content");
    revalidatePath("/");

    return NextResponse.json({ success: true, content: parsed.data });
  } catch (err: any) {
    console.error("Restore failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to restore version" },
      { status: 500 }
    );
  }
}
