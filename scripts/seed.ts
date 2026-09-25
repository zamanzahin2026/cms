import { createClient } from "@supabase/supabase-js";
import defaultContent from "../content/site.default.json";
import { SiteContentSchema } from "../lib/content-schema";

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    console.error("Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
    process.exit(1);
  }

  // Validate default content
  const parsed = SiteContentSchema.safeParse(defaultContent);
  if (!parsed.success) {
    console.error("Default content failed schema validation:", parsed.error);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Checking site_content row in Supabase...");

  const { data: existing, error: selectError } = await supabase
    .from("site_content")
    .select("id")
    .eq("id", "main")
    .maybeSingle();

  if (selectError) {
    console.error("Error querying site_content:", selectError);
    process.exit(1);
  }

  if (existing) {
    console.log("Row 'main' already exists in site_content. Skipping seed.");
    return;
  }

  console.log("Seeding site_content table with default site data...");
  const { error: insertError } = await supabase.from("site_content").insert({
    id: "main",
    data: parsed.data,
    updated_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error("Error inserting default content:", insertError);
    process.exit(1);
  }

  console.log("Seeding complete! site_content initialized with id 'main'.");
}

seed().catch((err) => {
  console.error("Unexpected error during seed:", err);
  process.exit(1);
});
