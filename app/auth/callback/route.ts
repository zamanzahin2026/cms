import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Validate next redirect: only allow values starting with /admin
  let next = searchParams.get("next") || "/admin";
  if (!next.startsWith("/admin")) {
    next = "/admin";
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If invalid or expired
  const errorRedirect = new URL("/admin/forgot-password", origin);
  errorRedirect.searchParams.set(
    "error",
    "This link has expired or was opened in a different browser. Request a new one below."
  );
  return NextResponse.redirect(errorRedirect);
}
