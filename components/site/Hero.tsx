import React from "react";
import Link from "next/link";
import { Nav } from "./Nav";
import { DashboardMockup } from "./DashboardMockup";
import { HeroDashboardSchema, HeroSchema } from "@/lib/content-schema";
import { z } from "zod";

interface HeroProps {
  content: z.infer<typeof HeroSchema>;
  dashboardContent: z.infer<typeof HeroDashboardSchema>;
}

export function Hero({ content, dashboardContent }: HeroProps) {
  return (
    <section id="overview" className="p-3 sm:p-4">
      {/* Hero Rounded Container */}
      <div className="rounded-[28px] bg-hero-gradient relative flex flex-col items-center pt-2 pb-36 sm:pb-56 px-4 sm:px-8 border border-sage_200/60 shadow-sm">
        {/* Top Nav */}
        <Nav
          logo={content.logo}
          navLinks={content.nav_links}
          navCta={content.nav_cta}
        />

        {/* Hero Title & Copy */}
        <div className="mt-16 sm:mt-24 text-center max-w-[800px] flex flex-col items-center z-10">
          <h1 className="text-[40px] sm:text-[54px] lg:text-[68px] font-serif leading-[1.06] tracking-[-0.02em] text-text_primary text-balance font-normal">
            <span>{content.headline_line1}</span>
            <br />
            <span>
              {content.headline_line2_plain}{" "}
              <span className="italic font-normal">{content.headline_line2_italic}</span>
            </span>
          </h1>

          <p className="mt-5 text-[14px] sm:text-[15px] leading-[1.6] text-text_secondary max-w-[520px]">
            {content.subtitle}
          </p>

          <div className="mt-8">
            <Link
              href="#features"
              className="inline-block px-7 py-3 rounded-pill bg-primary-btn text-white text-[13px] font-medium shadow-md hover:shadow-lg transition-all hover:opacity-95"
            >
              {content.cta}
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup overlapping bottom edge by roughly 40% */}
        <div className="w-full max-w-[1040px] mx-auto absolute -bottom-36 sm:-bottom-52 left-0 right-0 px-3 sm:px-6 z-20">
          <DashboardMockup {...dashboardContent} />
        </div>
      </div>
    </section>
  );
}
