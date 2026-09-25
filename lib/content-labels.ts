export interface FieldMeta {
  label: string;
  description?: string;
  maxLength?: number;
  type: "text" | "textarea" | "image" | "url";
  recommendedSize?: string;
}

export const CONTENT_FIELD_METADATA: Record<string, FieldMeta> = {
  // SEO
  "seo.title": { label: "Page Title (SEO)", maxLength: 140, type: "text" },
  "seo.description": { label: "Meta Description (SEO)", maxLength: 700, type: "textarea" },

  // Hero
  "hero.logo": { label: "Brand Logo Text", maxLength: 80, type: "text" },
  "hero.nav_links.0": { label: "Navigation Link 1", maxLength: 80, type: "text" },
  "hero.nav_links.1": { label: "Navigation Link 2", maxLength: 80, type: "text" },
  "hero.nav_links.2": { label: "Navigation Link 3", maxLength: 80, type: "text" },
  "hero.nav_links.3": { label: "Navigation Link 4", maxLength: 80, type: "text" },
  "hero.nav_cta": { label: "Nav Button CTA", maxLength: 80, type: "text" },
  "hero.headline_line1": { label: "Hero Headline — Line 1", maxLength: 140, type: "text" },
  "hero.headline_line2_plain": { label: "Hero Headline — Line 2 (Plain word)", maxLength: 140, type: "text" },
  "hero.headline_line2_italic": { label: "Hero Headline — Line 2 (Italic phrase)", maxLength: 140, type: "text" },
  "hero.subtitle": { label: "Hero Subtitle", maxLength: 700, type: "textarea" },
  "hero.cta": { label: "Hero Primary CTA Button", maxLength: 80, type: "text" },

  // Hero Dashboard
  "hero_dashboard.image": { label: "Dashboard Cabin Feature Image", type: "image", recommendedSize: "960x1280 (3:4 portrait)" },
  "hero_dashboard.tabs.0": { label: "Dashboard Tab 1", maxLength: 80, type: "text" },
  "hero_dashboard.tabs.1": { label: "Dashboard Tab 2", maxLength: 80, type: "text" },
  "hero_dashboard.tabs.2": { label: "Dashboard Tab 3", maxLength: 80, type: "text" },
  "hero_dashboard.tabs.3": { label: "Dashboard Tab 4", maxLength: 80, type: "text" },
  "hero_dashboard.tabs.4": { label: "Dashboard Tab 5", maxLength: 80, type: "text" },
  "hero_dashboard.image_card_title": { label: "Image Card Title", maxLength: 140, type: "text" },
  "hero_dashboard.image_card_caption": { label: "Image Card Caption", maxLength: 140, type: "text" },
  "hero_dashboard.revenue_title": { label: "Revenue Chart Title", maxLength: 140, type: "text" },
  "hero_dashboard.period_label": { label: "Period Dropdown Label", maxLength: 80, type: "text" },
  "hero_dashboard.legend_revenue": { label: "Revenue Legend Label", maxLength: 80, type: "text" },
  "hero_dashboard.legend_bookings": { label: "Bookings Legend Label", maxLength: 80, type: "text" },
  "hero_dashboard.stat_cards.0.label": { label: "Stat 1 Label", maxLength: 80, type: "text" },
  "hero_dashboard.stat_cards.0.value": { label: "Stat 1 Value", maxLength: 80, type: "text" },
  "hero_dashboard.stat_cards.0.sub": { label: "Stat 1 Subtitle", maxLength: 80, type: "text" },
  "hero_dashboard.stat_cards.1.label": { label: "Stat 2 Label", maxLength: 80, type: "text" },
  "hero_dashboard.stat_cards.1.value": { label: "Stat 2 Value", maxLength: 80, type: "text" },
  "hero_dashboard.stat_cards.1.sub": { label: "Stat 2 Subtitle", maxLength: 80, type: "text" },
  "hero_dashboard.trend_title": { label: "Occupancy Trend Chart Title", maxLength: 140, type: "text" },
  "hero_dashboard.occupancy_title": { label: "Occupancy Rate Gauge Title", maxLength: 140, type: "text" },
  "hero_dashboard.occupancy_value": { label: "Occupancy Rate Value (%)", maxLength: 80, type: "text" },
  "hero_dashboard.occupancy_label": { label: "Occupancy Center Label", maxLength: 80, type: "text" },
  "hero_dashboard.occupancy_delta": { label: "Occupancy Delta Text", maxLength: 80, type: "text" },
  "hero_dashboard.mini_stats.0.label": { label: "Mini Stat 1 Label", maxLength: 80, type: "text" },
  "hero_dashboard.mini_stats.0.value": { label: "Mini Stat 1 Value", maxLength: 80, type: "text" },
  "hero_dashboard.mini_stats.1.label": { label: "Mini Stat 2 Label", maxLength: 80, type: "text" },
  "hero_dashboard.mini_stats.1.value": { label: "Mini Stat 2 Value", maxLength: 80, type: "text" },
  "hero_dashboard.mini_stats.2.label": { label: "Mini Stat 3 Label", maxLength: 80, type: "text" },
  "hero_dashboard.mini_stats.2.value": { label: "Mini Stat 3 Value", maxLength: 80, type: "text" },
  "hero_dashboard.status_title": { label: "Status Card Title", maxLength: 140, type: "text" },
  "hero_dashboard.status_badge": { label: "Status Badge Text", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.0.label": { label: "Status Row 1 Label", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.0.value": { label: "Status Row 1 Value", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.1.label": { label: "Status Row 2 Label", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.1.value": { label: "Status Row 2 Value", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.2.label": { label: "Status Row 3 Label", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.2.value": { label: "Status Row 3 Value", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.3.label": { label: "Status Row 4 Label", maxLength: 80, type: "text" },
  "hero_dashboard.status_rows.3.value": { label: "Status Row 4 Value", maxLength: 80, type: "text" },
  "hero_dashboard.ops_title": { label: "Operations Overview Title", maxLength: 140, type: "text" },
  "hero_dashboard.ops_rows.0.label": { label: "Operations Row 1 Label", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.0.value": { label: "Operations Row 1 Percentage", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.1.label": { label: "Operations Row 2 Label", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.1.value": { label: "Operations Row 2 Percentage", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.2.label": { label: "Operations Row 3 Label", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.2.value": { label: "Operations Row 3 Percentage", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.3.label": { label: "Operations Row 4 Label", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.3.value": { label: "Operations Row 4 Percentage", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.4.label": { label: "Operations Row 5 Label", maxLength: 80, type: "text" },
  "hero_dashboard.ops_rows.4.value": { label: "Operations Row 5 Percentage", maxLength: 80, type: "text" },

  // Features
  "features.headline_plain": { label: "Features Headline (Plain)", maxLength: 140, type: "text" },
  "features.headline_italic": { label: "Features Headline (Italic)", maxLength: 140, type: "text" },
  "features.subtitle": { label: "Features Subtitle", maxLength: 700, type: "textarea" },
  "features.cards.0.title": { label: "Card 1 Title", maxLength: 140, type: "text" },
  "features.cards.0.description": { label: "Card 1 Description", maxLength: 700, type: "textarea" },
  "features.cards.1.title": { label: "Card 2 Title", maxLength: 140, type: "text" },
  "features.cards.1.description": { label: "Card 2 Description", maxLength: 700, type: "textarea" },
  "features.cards.1.review.rating": { label: "Card 2 Rating Score", maxLength: 80, type: "text" },
  "features.cards.1.review.rating_caption": { label: "Card 2 Rating Caption", maxLength: 80, type: "text" },
  "features.cards.1.review.reviewer_name": { label: "Card 2 Reviewer Name", maxLength: 80, type: "text" },
  "features.cards.1.review.reviewer_meta": { label: "Card 2 Reviewer Stay Meta", maxLength: 140, type: "text" },
  "features.cards.1.review.review_text": { label: "Card 2 Review Quote", maxLength: 700, type: "textarea" },
  "features.cards.1.review.avatar": { label: "Card 2 Reviewer Avatar", type: "image", recommendedSize: "512x512 (1:1)" },
  "features.cards.2.title": { label: "Card 3 Title", maxLength: 140, type: "text" },
  "features.cards.2.description": { label: "Card 3 Description", maxLength: 700, type: "textarea" },
  "features.cards.2.tasks.0.label": { label: "Task 1 Label", maxLength: 80, type: "text" },
  "features.cards.2.tasks.0.progress": { label: "Task 1 Progress", maxLength: 80, type: "text" },
  "features.cards.2.tasks.1.label": { label: "Task 2 Label", maxLength: 80, type: "text" },
  "features.cards.2.tasks.1.progress": { label: "Task 2 Progress", maxLength: 80, type: "text" },
  "features.cards.2.tasks.2.label": { label: "Task 3 Label", maxLength: 80, type: "text" },
  "features.cards.2.tasks.2.progress": { label: "Task 3 Progress", maxLength: 80, type: "text" },
  "features.cards.2.tasks.3.label": { label: "Task 4 Label", maxLength: 80, type: "text" },
  "features.cards.2.tasks.3.progress": { label: "Task 4 Progress", maxLength: 80, type: "text" },
  "features.cards.2.summary_title": { label: "Team Summary Title", maxLength: 140, type: "text" },
  "features.cards.2.summary_sub": { label: "Team Summary Subtitle", maxLength: 140, type: "text" },

  // Testimonials
  "testimonials.headline_plain": { label: "Testimonials Headline (Plain)", maxLength: 140, type: "text" },
  "testimonials.headline_italic": { label: "Testimonials Headline (Italic)", maxLength: 140, type: "text" },
  "testimonials.subtitle": { label: "Testimonials Subtitle", maxLength: 700, type: "textarea" },

  // Testimonial 1
  "testimonials.items.0.name": { label: "Testimonial 1 — Name", maxLength: 80, type: "text" },
  "testimonials.items.0.role": { label: "Testimonial 1 — Role", maxLength: 80, type: "text" },
  "testimonials.items.0.quote": { label: "Testimonial 1 — Quote", maxLength: 700, type: "textarea" },
  "testimonials.items.0.avatar": { label: "Testimonial 1 — Avatar", type: "image", recommendedSize: "512x512 (1:1)" },

  // Testimonial 2
  "testimonials.items.1.name": { label: "Testimonial 2 — Name", maxLength: 80, type: "text" },
  "testimonials.items.1.role": { label: "Testimonial 2 — Role", maxLength: 80, type: "text" },
  "testimonials.items.1.quote": { label: "Testimonial 2 — Quote", maxLength: 700, type: "textarea" },
  "testimonials.items.1.avatar": { label: "Testimonial 2 — Avatar", type: "image", recommendedSize: "512x512 (1:1)" },

  // Testimonial 3
  "testimonials.items.2.name": { label: "Testimonial 3 — Name", maxLength: 80, type: "text" },
  "testimonials.items.2.role": { label: "Testimonial 3 — Role", maxLength: 80, type: "text" },
  "testimonials.items.2.quote": { label: "Testimonial 3 — Quote", maxLength: 700, type: "textarea" },
  "testimonials.items.2.avatar": { label: "Testimonial 3 — Avatar", type: "image", recommendedSize: "512x512 (1:1)" },

  // Testimonial 4
  "testimonials.items.3.name": { label: "Testimonial 4 — Name", maxLength: 80, type: "text" },
  "testimonials.items.3.role": { label: "Testimonial 4 — Role", maxLength: 80, type: "text" },
  "testimonials.items.3.quote": { label: "Testimonial 4 — Quote", maxLength: 700, type: "textarea" },
  "testimonials.items.3.avatar": { label: "Testimonial 4 — Avatar", type: "image", recommendedSize: "512x512 (1:1)" },

  // Testimonial 5
  "testimonials.items.4.name": { label: "Testimonial 5 — Name", maxLength: 80, type: "text" },
  "testimonials.items.4.role": { label: "Testimonial 5 — Role", maxLength: 80, type: "text" },
  "testimonials.items.4.quote": { label: "Testimonial 5 — Quote", maxLength: 700, type: "textarea" },
  "testimonials.items.4.avatar": { label: "Testimonial 5 — Avatar", type: "image", recommendedSize: "512x512 (1:1)" },

  // Testimonial 6
  "testimonials.items.5.name": { label: "Testimonial 6 — Name", maxLength: 80, type: "text" },
  "testimonials.items.5.role": { label: "Testimonial 6 — Role", maxLength: 80, type: "text" },
  "testimonials.items.5.quote": { label: "Testimonial 6 — Quote", maxLength: 700, type: "textarea" },
  "testimonials.items.5.avatar": { label: "Testimonial 6 — Avatar", type: "image", recommendedSize: "512x512 (1:1)" },

  // Footer
  "footer.logo": { label: "Footer Logo", maxLength: 80, type: "text" },
  "footer.tagline": { label: "Footer Tagline", maxLength: 700, type: "textarea" },
  "footer.columns.0.heading": { label: "Footer Column 1 Heading", maxLength: 80, type: "text" },
  "footer.columns.0.links.0": { label: "Col 1 Link 1", maxLength: 80, type: "text" },
  "footer.columns.0.links.1": { label: "Col 1 Link 2", maxLength: 80, type: "text" },
  "footer.columns.0.links.2": { label: "Col 1 Link 3", maxLength: 80, type: "text" },
  "footer.columns.0.links.3": { label: "Col 1 Link 4", maxLength: 80, type: "text" },

  "footer.columns.1.heading": { label: "Footer Column 2 Heading", maxLength: 80, type: "text" },
  "footer.columns.1.links.0": { label: "Col 2 Link 1", maxLength: 80, type: "text" },
  "footer.columns.1.links.1": { label: "Col 2 Link 2", maxLength: 80, type: "text" },
  "footer.columns.1.links.2": { label: "Col 2 Link 3", maxLength: 80, type: "text" },
  "footer.columns.1.links.3": { label: "Col 2 Link 4", maxLength: 80, type: "text" },

  "footer.columns.2.heading": { label: "Footer Column 3 Heading", maxLength: 80, type: "text" },
  "footer.columns.2.links.0": { label: "Col 3 Link 1", maxLength: 80, type: "text" },
  "footer.columns.2.links.1": { label: "Col 3 Link 2", maxLength: 80, type: "text" },
  "footer.columns.2.links.2": { label: "Col 3 Link 3", maxLength: 80, type: "text" },
  "footer.columns.2.links.3": { label: "Col 3 Link 4", maxLength: 80, type: "text" },

  "footer.follow_label": { label: "Follow Us Label", maxLength: 80, type: "text" },
  "footer.socials.0.platform": { label: "Social 1 Platform", maxLength: 80, type: "text" },
  "footer.socials.0.url": { label: "Social 1 URL", maxLength: 200, type: "url" },
  "footer.socials.1.platform": { label: "Social 2 Platform", maxLength: 80, type: "text" },
  "footer.socials.1.url": { label: "Social 2 URL", maxLength: 200, type: "url" },
  "footer.socials.2.platform": { label: "Social 3 Platform", maxLength: 80, type: "text" },
  "footer.socials.2.url": { label: "Social 3 URL", maxLength: 200, type: "url" },
  "footer.socials.3.platform": { label: "Social 4 Platform", maxLength: 80, type: "text" },
  "footer.socials.3.url": { label: "Social 4 URL", maxLength: 200, type: "url" },

  "footer.copyright": { label: "Copyright Notice", maxLength: 140, type: "text" },
  "footer.legal_links.0": { label: "Legal Link 1", maxLength: 80, type: "text" },
  "footer.legal_links.1": { label: "Legal Link 2", maxLength: 80, type: "text" },
  "footer.legal_links.2": { label: "Legal Link 3", maxLength: 80, type: "text" },
};

// Add metadata for showcase tabs (0 to 3)
for (let t = 0; t < 4; t++) {
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.tab_label`] = { label: `Showcase Tab ${t + 1} Label`, maxLength: 80, type: "text" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.headline_line1`] = { label: `Showcase Tab ${t + 1} Headline Line 1`, maxLength: 140, type: "text" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.headline_line2`] = { label: `Showcase Tab ${t + 1} Headline Line 2`, maxLength: 140, type: "text" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.cta`] = { label: `Showcase Tab ${t + 1} CTA Button`, maxLength: 80, type: "text" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.image`] = { label: `Showcase Tab ${t + 1} Image`, type: "image", recommendedSize: "1600x1200 (4:3)" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.chip1.label`] = { label: `Tab ${t + 1} Chip 1 Label`, maxLength: 80, type: "text" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.chip1.value`] = { label: `Tab ${t + 1} Chip 1 Value`, maxLength: 80, type: "text" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.chip2.label`] = { label: `Tab ${t + 1} Chip 2 Label`, maxLength: 80, type: "text" };
  CONTENT_FIELD_METADATA[`showcase.tabs.${t}.chip2.value`] = { label: `Tab ${t + 1} Chip 2 Value`, maxLength: 80, type: "text" };

  for (let f = 0; f < 3; f++) {
    CONTENT_FIELD_METADATA[`showcase.tabs.${t}.features.${f}.title`] = { label: `Tab ${t + 1} Feature ${f + 1} Title`, maxLength: 140, type: "text" };
    CONTENT_FIELD_METADATA[`showcase.tabs.${t}.features.${f}.description`] = { label: `Tab ${t + 1} Feature ${f + 1} Description`, maxLength: 700, type: "textarea" };
  }
}
