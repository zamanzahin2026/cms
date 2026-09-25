"use client";

import React, { useState } from "react";
import { AuthCard } from "@/components/admin/AuthCard";
import { PasswordField } from "@/components/admin/PasswordField";
import { setupAction } from "@/app/admin/actions";
import { AlertCircle, Loader2 } from "lucide-react";

export default function SetupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await setupAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      // If redirect happens Next throws, ignore redirect exceptions
      if (err.message && !err.message.includes("NEXT_REDIRECT")) {
        setError(err.message || "Failed to complete setup.");
        setLoading(false);
      }
    }
  };

  return (
    <AuthCard
      title="Create your admin account"
      subtitle="Initial setup for the Ostra management console."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-[13px] font-medium text-text_primary">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            maxLength={32}
            pattern="^[a-zA-Z0-9._-]+$"
            placeholder="admin"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none"
          />
          <span className="text-[11px] text-text_muted">
            3–32 characters (letters, numbers, dot, dash, underscore).
          </span>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-text_primary">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="owner@domain.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none"
          />
          <span className="text-[11px] text-text_muted leading-snug">
            Password reset links are sent here. Use the same email as your Supabase account unless custom email (SMTP) is set up.
          </span>
        </div>

        {/* Password with Strength Meter */}
        <PasswordField
          id="password"
          name="password"
          label="Password"
          showStrength
          autoComplete="new-password"
        />

        {/* Confirm Password */}
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
        />

        {/* Setup Code */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="setupCode" className="text-[13px] font-medium text-text_primary">
            Setup code
          </label>
          <input
            id="setupCode"
            name="setupCode"
            type="password"
            required
            placeholder="Enter the 32-character setup code"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none"
          />
          <span className="text-[11px] text-text_muted">
            The secret ADMIN_SETUP_CODE provided during initialization.
          </span>
        </div>

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
          <span>Create Admin Account</span>
        </button>
      </form>
    </AuthCard>
  );
}
