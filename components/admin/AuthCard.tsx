import React from "react";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-card shadow-dashboard p-6 sm:p-8 border border-border">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="text-3xl font-serif text-text_primary tracking-tight font-normal inline-block hover:opacity-90"
          >
            Ostra
          </Link>
          <h2 className="text-[20px] font-semibold text-text_primary mt-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13px] text-text_secondary mt-1 leading-snug">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content / Form */}
        {children}

        {/* Footer */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-border/60 text-center text-[12px] text-text_secondary">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
