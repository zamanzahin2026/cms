import { unstable_cache } from "next/cache";
import defaultSiteContent from "@/content/site.default.json";
import { SiteContent, SiteContentSchema } from "./content-schema";
import { createAdminClient } from "./supabase/admin";

async function fetchLiveContent(): Promise<SiteContent> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .single();

    if (error || !data?.data) {
      return defaultSiteContent as SiteContent;
    }

    const parsed = SiteContentSchema.safeParse(data.data);
    if (parsed.success) {
      return parsed.data;
    }

    console.warn("Live content failed schema validation, using fallback default:", parsed.error);
    return defaultSiteContent as SiteContent;
  } catch (err) {
    // If Supabase is unreachable, local env not configured, or table empty
    return defaultSiteContent as SiteContent;
  }
}

export const getSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    return await fetchLiveContent();
  },
  ["site-content-cache"],
  { tags: ["site-content"], revalidate: 3600 }
);

export function getDefaultSiteContent(): SiteContent {
  return defaultSiteContent as SiteContent;
}
