"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { PasswordField } from "@/components/admin/PasswordField";
import { loginAction } from "@/app/admin/actions";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes("NEXT_REDIRECT")) {
        setError(err.message || "Failed to sign in.");
        setLoading(false);
      }
    }
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Enter your admin credentials to access the console."
      footer={
        <div className="flex items-center justify-center">
          <Link
            href="/admin/forgot-password"
            className="text-sage_700 hover:text-sage_900 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      }
    >
      {notice === "password_updated" && (
        <div className="mb-4 p-3 rounded-lg bg-sage_50 border border-sage_200 text-sage_800 text-[12px] flex items-center gap-2">
          <CheckCircle2 size={15} className="text-sage_700 flex-shrink-0" />
          <span>Password updated. Please sign in with your new credentials.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="identifier" className="text-[13px] font-medium text-text_primary">
            Username or email
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            autoComplete="username"
            placeholder="admin or owner@domain.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none"
          />
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 rounded-pill bg-primary-btn text-white text-[13px] font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          <span>Sign In</span>
        </button>
      </form>
    </AuthCard>
  );
}
