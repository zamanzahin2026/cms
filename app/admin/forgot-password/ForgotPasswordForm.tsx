"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { forgotPasswordAction } from "@/app/admin/actions";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(urlError);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await forgotPasswordAction(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setMessage(res.success);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter your username or email and we will send you a reset link."
      footer={
        <div className="flex items-center justify-center">
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 text-text_secondary hover:text-text_primary transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to sign in</span>
          </Link>
        </div>
      }
    >
      {message ? (
        <div className="p-4 rounded-xl bg-sage_50 border border-sage_200 text-sage_800 text-[13px] flex flex-col gap-2 animate-fade-up">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={16} className="text-sage_700" />
            <span>Link Requested</span>
          </div>
          <p className="leading-relaxed text-sage_900">{message}</p>
        </div>
      ) : (
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
              placeholder="admin or owner@domain.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-[14px] text-text_primary placeholder:text-text_muted focus:border-sage_600 focus:ring-1 focus:ring-sage_600 outline-none"
            />
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
            <span>Send Reset Link</span>
          </button>
        </form>
      )}
    </AuthCard>
  );
}
