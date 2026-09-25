import React from "react";
import { getSiteContent } from "@/lib/content";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { Showcase } from "@/components/site/Showcase";
import { Testimonials } from "@/components/site/Testimonials";
import { Footer } from "@/components/site/Footer";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-background text-text_primary flex flex-col selection:bg-sage_200">
      {/* 1. Hero with Integrated Overlapping Console Mockup */}
      <Hero
        content={content.hero}
        dashboardContent={content.hero_dashboard}
      />

      {/* 2. Features Section */}
      <Features {...content.features} />

      {/* 3. Showcase Section */}
      <Showcase {...content.showcase} />

      {/* 4. Testimonials Section */}
      <Testimonials {...content.testimonials} />

      {/* 5. Footer Section */}
      <Footer {...content.footer} />
    </main>
  );
}
