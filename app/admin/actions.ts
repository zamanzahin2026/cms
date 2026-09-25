"use server";

import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import crypto from "crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "@/lib/rate-limit";
import { getAuthenticatedAdmin } from "@/lib/auth-guard";

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headerList.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function constantTimeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a || "");
    const bufB = Buffer.from(b || "");
    if (bufA.length !== bufB.length) {
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Fixed short delay to prevent timing attacks on login
async function fakeDelay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// -------------------------------------------------------------
// 1. SETUP ACTION
// -------------------------------------------------------------
const SetupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username cannot exceed 32 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "Letters, numbers, dot, dash, and underscore only"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters"),
  confirmPassword: z.string(),
  setupCode: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function setupAction(formData: FormData) {
  const adminClient = createAdminClient();

  // 1. Confirm admin_profile is empty. If an admin already exists, return 404 forever.
  const { count } = await adminClient
    .from("admin_profile")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    notFound();
  }

  // 2. Rate limit setup attempts: max 5 attempts per IP per hour
  const ip = await getClientIp();
  const rateLimitKey = `setup:${ip}`;
  const rateCheck = await checkRateLimit(rateLimitKey, 5, 3600, 3600);
  if (!rateCheck.allowed) {
    return { error: rateCheck.message || "Too many setup attempts. Please try again later." };
  }

  // 3. Parse input
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const setupCode = (formData.get("setupCode") as string)?.trim() || "";

  const parsed = SetupSchema.safeParse({
    username,
    email,
    password,
    confirmPassword,
    setupCode,
  });

  if (!parsed.success) {
    await recordFailedAttempt(rateLimitKey, 5, 3600, 3600);
    return { error: parsed.error.errors[0]?.message || "Invalid setup input" };
  }

  // 4. Compare setup code in constant time
  const expectedCode = process.env.ADMIN_SETUP_CODE?.trim() || "";
  if (!expectedCode || !constantTimeCompare(setupCode, expectedCode)) {
    await recordFailedAttempt(rateLimitKey, 5, 3600, 3600);
    return { error: "Invalid setup code. Please check your ADMIN_SETUP_CODE." };
  }

  // 5. Create user in Supabase Auth via admin API
  let createdUserId: string | null = null;
  try {
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
    });

    if (createError || !newUser?.user) {
      await recordFailedAttempt(rateLimitKey, 5, 3600, 3600);
      return { error: createError?.message || "Failed to create authentication user." };
    }

    createdUserId = newUser.user.id;

    // 6. Insert profile
    const { error: profileError } = await adminClient.from("admin_profile").insert({
      user_id: createdUserId,
      username: parsed.data.username.toLowerCase(),
    });

    if (profileError) {
      // Rollback auth user
      await adminClient.auth.admin.deleteUser(createdUserId);
      return { error: "Failed to create admin profile: " + profileError.message };
    }

    // Reset rate limit on success
    await resetRateLimit(rateLimitKey);

    // 7. Sign in the new user to establish SSR session cookies
    const supabase = await createClient();
    await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
  } catch (err: any) {
    if (createdUserId) {
      try {
        await adminClient.auth.admin.deleteUser(createdUserId);
      } catch {}
    }
    return { error: err.message || "An unexpected error occurred during setup." };
  }

  redirect("/admin");
}

// -------------------------------------------------------------
// 2. LOGIN ACTION
// -------------------------------------------------------------
export async function loginAction(formData: FormData) {
  const ip = await getClientIp();
  const rateLimitKey = `login:${ip}`;

  // Rate limit: 5 failed attempts in 15 min -> 15 min lockout
  const rateCheck = await checkRateLimit(rateLimitKey, 5, 900, 900);
  if (!rateCheck.allowed) {
    return { error: rateCheck.message || "Too many attempts. Try again in 15 minutes." };
  }

  const identifier = ((formData.get("identifier") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";

  if (!identifier || !password) {
    await fakeDelay(200);
    return { error: "Incorrect username or password" };
  }

  const adminClient = createAdminClient();
  let emailToAuth = identifier;

  try {
    if (!identifier.includes("@")) {
      // Look up user_id by username in admin_profile
      const { data: profile } = await adminClient
        .from("admin_profile")
        .select("user_id")
        .eq("username", identifier)
        .single();

      if (!profile) {
        await recordFailedAttempt(rateLimitKey, 5, 900, 900);
        await fakeDelay(250);
        return { error: "Incorrect username or password" };
      }

      // Fetch email using admin client
      const { data: userData, error: getUserError } = await adminClient.auth.admin.getUserById(
        profile.user_id
      );

      if (getUserError || !userData?.user?.email) {
        await recordFailedAttempt(rateLimitKey, 5, 900, 900);
        await fakeDelay(250);
        return { error: "Incorrect username or password" };
      }

      emailToAuth = userData.user.email;
    }

    // Authenticate with @supabase/ssr server client to set cookies
    const supabase = await createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password,
    });

    if (signInError || !signInData.user) {
      await recordFailedAttempt(rateLimitKey, 5, 900, 900);
      await fakeDelay(250);
      return { error: "Incorrect username or password" };
    }

    // Verify user is the admin
    const { data: adminRow } = await adminClient
      .from("admin_profile")
      .select("user_id")
      .eq("user_id", signInData.user.id)
      .single();

    if (!adminRow) {
      await supabase.auth.signOut();
      await recordFailedAttempt(rateLimitKey, 5, 900, 900);
      await fakeDelay(250);
      return { error: "Incorrect username or password" };
    }

    // Success: reset attempts
    await resetRateLimit(rateLimitKey);
  } catch (err: any) {
    await recordFailedAttempt(rateLimitKey, 5, 900, 900);
    await fakeDelay(250);
    return { error: "Incorrect username or password" };
  }

  redirect("/admin");
}

// -------------------------------------------------------------
// 3. LOGOUT ACTION
// -------------------------------------------------------------
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// -------------------------------------------------------------
// 4. FORGOT PASSWORD ACTION
// -------------------------------------------------------------
export async function forgotPasswordAction(formData: FormData) {
  const ip = await getClientIp();
  const rateLimitKey = `reset:${ip}`;

  // Limit: 3 requests per IP per hour
  const rateCheck = await checkRateLimit(rateLimitKey, 3, 3600, 3600);
  if (!rateCheck.allowed) {
    return { error: rateCheck.message || "Too many password reset requests. Please try again later." };
  }

  const identifier = ((formData.get("identifier") as string) || "").trim().toLowerCase();
  const genericMessage =
    "If that account exists, a reset link has been sent to its email address.";

  if (!identifier) {
    return { success: genericMessage };
  }

  await recordFailedAttempt(rateLimitKey, 3, 3600, 3600);

  try {
    const adminClient = createAdminClient();
    let emailToSend = identifier;

    if (!identifier.includes("@")) {
      const { data: profile } = await adminClient
        .from("admin_profile")
        .select("user_id")
        .eq("username", identifier)
        .single();

      if (profile) {
        const { data: userData } = await adminClient.auth.admin.getUserById(profile.user_id);
        if (userData?.user?.email) {
          emailToSend = userData.user.email;
        }
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const supabase = await createClient();

    await supabase.auth.resetPasswordForEmail(emailToSend, {
      redirectTo: `${siteUrl}/auth/callback?next=/admin/reset-password`,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
  }

  return { success: genericMessage };
}

// -------------------------------------------------------------
// 5. RESET PASSWORD ACTION
// -------------------------------------------------------------
export async function resetPasswordAction(formData: FormData) {
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  if (password.length < 10) {
    return { error: "Password must be at least 10 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const supabase = await createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      return { error: updateError.message };
    }

    // Sign out everywhere to invalidate previous sessions
    await supabase.auth.signOut({ scope: "global" });
  } catch (err: any) {
    return { error: err.message || "Failed to update password." };
  }

  redirect("/admin/login?notice=password_updated");
}

// -------------------------------------------------------------
// 6. ACCOUNT SETTINGS ACTIONS
// -------------------------------------------------------------
export async function changeUsernameAction(newUsername: string) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Unauthorized" };
  }

  const usernameClean = newUsername.trim().toLowerCase();
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;

  if (usernameClean.length < 3 || usernameClean.length > 32 || !usernameRegex.test(usernameClean)) {
    return { error: "Username must be 3–32 characters and contain only letters, numbers, dot, dash, or underscore." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("admin_profile")
    .update({ username: usernameClean, updated_at: new Date().toISOString() })
    .eq("user_id", admin.userId);

  if (error) {
    return { error: error.message.includes("unique") ? "Username is already taken." : error.message };
  }

  return { success: true };
}

export async function changePasswordAction(currentPassword: string, newPassword: string, confirmPassword: string) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Unauthorized" };
  }

  if (newPassword.length < 10) {
    return { error: "New password must be at least 10 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  const supabase = await createClient();

  // Verify current password by signing in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: admin.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Current password is incorrect." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}

export async function changeEmailAction(newEmail: string) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Unauthorized" };
  }

  const emailClean = newEmail.trim();
  const emailSchema = z.string().email();

  if (!emailSchema.safeParse(emailClean).success) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: emailClean });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOutEverywhereAction() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "global" });
  redirect("/admin/login");
}
