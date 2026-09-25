"use client";

import React, { useState } from "react";
import { AuthCard } from "@/components/admin/AuthCard";
import { PasswordField } from "@/components/admin/PasswordField";
import { resetPasswordAction } from "@/app/admin/actions";
import { AlertCircle, Loader2 } from "lucide-react";

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await resetPasswordAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes("NEXT_REDIRECT")) {
        setError(err.message || "Failed to update password.");
        setLoading(false);
      }
    }
  };

  return (
    <AuthCard
      title="Create new password"
      subtitle="Enter a new secure password for your account."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
        <PasswordField
          id="password"
          name="password"
          label="New password"
          showStrength
          autoComplete="new-password"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
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
          <span>Update Password & Sign In</span>
        </button>
      </form>
    </AuthCard>
  );
}
