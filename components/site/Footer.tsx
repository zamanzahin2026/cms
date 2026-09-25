import React from "react";
import Link from "next/link";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { FooterSchema } from "@/lib/content-schema";
import { z } from "zod";

type FooterProps = z.infer<typeof FooterSchema>;

// Custom SVG icon for X (formerly Twitter)
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer({
  logo,
  tagline,
  columns,
  follow_label,
  socials,
  copyright,
  legal_links,
}: FooterProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook size={14} />;
      case "instagram":
        return <Instagram size={14} />;
      case "x":
      case "twitter":
        return <XIcon size={13} />;
      case "linkedin":
        return <Linkedin size={14} />;
      default:
        return null;
    }
  };

  return (
    <footer className="p-3 sm:p-4 mt-12">
      {/* Dark rounded container with radial glow in lower middle */}
      <div className="rounded-[28px] bg-footer-gradient p-8 sm:p-16 text-white border border-white/10 relative overflow-hidden">
        {/* Top Row: Brand & Tagline on Left, 3 Navigation Columns on Right */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="max-w-[280px]">
            <span className="text-[44px] font-serif text-[#FAFAF7] tracking-tight block leading-none font-normal">
              {logo}
            </span>
            <p className="mt-4 text-[14px] leading-[1.6] text-white/80">
              {tagline}
            </p>
          </div>

          {/* Right Columns (3 link lists) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16">
            {columns.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-white/50">
                  {col.heading}
                </span>
                <ul className="flex flex-col gap-3 mt-1">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href="#"
                        className="text-[14px] text-white/90 hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Separator / Vertical space ~90px */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Follow Us + Socials */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[12px] text-white/60 font-medium">
              {follow_label}
            </span>
            <div className="flex items-center gap-2">
              {socials.map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url}
                  target={soc.url !== "#" ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={soc.platform}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
                >
                  {getSocialIcon(soc.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Center: Copyright */}
          <div className="text-[12px] text-white/60 text-center">
            {copyright}
          </div>

          {/* Right: Legal Links */}
          <div className="flex items-center gap-4 text-[12px] text-white/60">
            {legal_links.map((legal, idx) => (
              <Link
                key={idx}
                href="#"
                className="hover:text-white/90 transition-colors"
              >
                {legal}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
