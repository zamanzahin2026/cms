import "server-only";
import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";

export interface AuthenticatedAdmin {
  userId: string;
  email: string;
  username: string;
}

export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const adminClient = createAdminClient();
    const { data: profile, error: profileError } = await adminClient
      .from("admin_profile")
      .select("user_id, username")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email || "",
      username: profile.username,
    };
  } catch (err) {
    console.error("Auth guard error:", err);
    return null;
  }
}
