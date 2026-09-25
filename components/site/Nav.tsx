"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavProps {
  logo: string;
  navLinks: [string, string, string, string];
  navCta: string;
}

const NAV_TARGETS = ["#overview", "#features", "#operations", "#stories"];

export function Nav({ logo, navLinks, navCta }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full relative z-30 pt-6 px-4 sm:px-8">
      <div className="max-w-[1140px] mx-auto flex items-center justify-between">
        {/* Left: Brand Logo Wordmark */}
        <Link
          href="#overview"
          className="text-2xl font-serif text-text_primary tracking-tight font-normal hover:opacity-90 transition-opacity"
        >
          {logo}
        </Link>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((label, index) => (
            <Link
              key={index}
              href={NAV_TARGETS[index] || "#"}
              className="text-[13px] text-text_secondary hover:text-text_primary transition-colors font-medium"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Desktop CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="#overview"
            className="px-5 py-2.5 rounded-pill bg-white text-text_primary text-[13px] font-medium shadow-sm hover:shadow transition-all border border-border/40"
          >
            {navCta}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-text_primary hover:bg-surface_muted/80 transition-colors"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-border shadow-card animate-fade-up">
          <div className="flex flex-col gap-3">
            {navLinks.map((label, index) => (
              <Link
                key={index}
                href={NAV_TARGETS[index] || "#"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[14px] text-text_secondary hover:text-text_primary font-medium py-1 px-2"
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <Link
                href="#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-pill bg-sage_600 text-white text-[13px] font-medium shadow-sm"
              >
                {navCta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
