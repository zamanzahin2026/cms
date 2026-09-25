import "server-only";
import { createAdminClient } from "./supabase/admin";

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  message?: string;
  lockedUntil?: Date;
}

export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number,
  lockSeconds: number
): Promise<RateLimitResult> {
  const admin = createAdminClient();
  const now = new Date();

  const { data, error } = await admin
    .from("auth_attempts")
    .select("count, window_started_at, locked_until")
    .eq("key", key)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error reading auth_attempts:", error);
    // On unexpected DB error, fail open or safely allow with warning
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  if (!data) {
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  // Check if currently locked
  if (data.locked_until) {
    const lockedUntil = new Date(data.locked_until);
    if (lockedUntil > now) {
      const minutesRemaining = Math.max(1, Math.ceil((lockedUntil.getTime() - now.getTime()) / 60000));
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil,
        message: `Too many attempts. Try again in ${minutesRemaining} minutes.`,
      };
    }
  }

  // Check window expiry
  if (data.window_started_at) {
    const windowStart = new Date(data.window_started_at);
    const windowExpires = new Date(windowStart.getTime() + windowSeconds * 1000);
    if (now > windowExpires) {
      // Window expired, reset counter
      return { allowed: true, remainingAttempts: maxAttempts };
    }
  }

  const remaining = Math.max(0, maxAttempts - data.count);
  if (data.count >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      message: `Too many attempts. Try again in ${Math.ceil(lockSeconds / 60)} minutes.`,
    };
  }

  return { allowed: true, remainingAttempts: remaining };
}

export async function recordFailedAttempt(
  key: string,
  maxAttempts: number,
  windowSeconds: number,
  lockSeconds: number
): Promise<RateLimitResult> {
  const admin = createAdminClient();
  const now = new Date();

  const { data } = await admin
    .from("auth_attempts")
    .select("count, window_started_at, locked_until")
    .eq("key", key)
    .single();

  let newCount = 1;
  let windowStart = now.toISOString();
  let lockedUntil: string | null = null;

  if (data) {
    const prevWindowStart = data.window_started_at ? new Date(data.window_started_at) : null;
    const windowExpires = prevWindowStart ? new Date(prevWindowStart.getTime() + windowSeconds * 1000) : null;

    if (windowExpires && now <= windowExpires) {
      newCount = data.count + 1;
      windowStart = data.window_started_at;
    } else {
      newCount = 1;
      windowStart = now.toISOString();
    }

    if (newCount >= maxAttempts) {
      lockedUntil = new Date(now.getTime() + lockSeconds * 1000).toISOString();
    }
  }

  await admin
    .from("auth_attempts")
    .upsert({
      key,
      count: newCount,
      window_started_at: windowStart,
      locked_until: lockedUntil,
    });

  if (newCount >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      message: `Too many attempts. Try again in ${Math.ceil(lockSeconds / 60)} minutes.`,
    };
  }

  return {
    allowed: true,
    remainingAttempts: maxAttempts - newCount,
  };
}

export async function resetRateLimit(key: string): Promise<void> {
  const admin = createAdminClient();
  await admin.from("auth_attempts").delete().eq("key", key);
}
