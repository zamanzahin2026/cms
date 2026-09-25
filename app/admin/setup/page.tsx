import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return <SetupForm />;
  }

  try {
    const adminClient = createAdminClient();

    // If an admin already exists, return 404 forever.
    const { count } = await adminClient
      .from("admin_profile")
      .select("*", { count: "exact", head: true });

    if (count && count > 0) {
      notFound();
    }
  } catch (err) {
    // If table doesn't exist yet or connection fails, allow setup form
  }

  return <SetupForm />;
}
