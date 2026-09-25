import { z } from "zod";

const imageSourceRegex = /^(?:\/images\/defaults\/[a-zA-Z0-9._-]+\.webp|https:\/\/[a-zA-Z0-9.-]+\.supabase\.co\/storage\/v1\/object\/public\/site-images\/[a-zA-Z0-9._-]+)$/;

export const ImageSchema = z.object({
  src: z.string().refine(
    (src) => src.startsWith("/images/defaults/") || src.includes("/storage/v1/object/public/site-images/"),
    { message: "Image src must be in /images/defaults/ or Supabase site-images bucket" }
  ),
  alt: z.string().max(140, "Alt text must be at most 140 characters"),
});

export const SocialUrlSchema = z.string().max(200).refine(
  (url) => url === "#" || url.startsWith("https://"),
  { message: "Social URLs must start with https:// or be '#'" }
);

export const SeoSchema = z.object({
  title: z.string().max(140),
  description: z.string().max(700),
});

export const HeroSchema = z.object({
  logo: z.string().max(80),
  nav_links: z.tuple([
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
  ]),
  nav_cta: z.string().max(80),
  headline_line1: z.string().max(140),
  headline_line2_plain: z.string().max(140),
  headline_line2_italic: z.string().max(140),
  subtitle: z.string().max(700),
  cta: z.string().max(80),
});

export const HeroDashboardSchema = z.object({
  image: ImageSchema,
  tabs: z.tuple([
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
  ]),
  image_card_title: z.string().max(140),
  image_card_caption: z.string().max(140),
  revenue_title: z.string().max(140),
  period_label: z.string().max(80),
  legend_revenue: z.string().max(80),
  legend_bookings: z.string().max(80),
  stat_cards: z.tuple([
    z.object({
      label: z.string().max(80),
      value: z.string().max(80),
      sub: z.string().max(80),
    }),
    z.object({
      label: z.string().max(80),
      value: z.string().max(80),
      sub: z.string().max(80),
    }),
  ]),
  trend_title: z.string().max(140),
  occupancy_title: z.string().max(140),
  occupancy_value: z.string().max(80),
  occupancy_label: z.string().max(80),
  occupancy_delta: z.string().max(80),
  mini_stats: z.tuple([
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
  ]),
  status_title: z.string().max(140),
  status_badge: z.string().max(80),
  status_rows: z.tuple([
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
  ]),
  ops_title: z.string().max(140),
  ops_rows: z.tuple([
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
    z.object({ label: z.string().max(80), value: z.string().max(80) }),
  ]),
});

export const FeaturesCard1Schema = z.object({
  title: z.string().max(140),
  description: z.string().max(700),
});

export const FeaturesCard2Schema = z.object({
  title: z.string().max(140),
  description: z.string().max(700),
  review: z.object({
    rating: z.string().max(80),
    rating_caption: z.string().max(80),
    reviewer_name: z.string().max(80),
    reviewer_meta: z.string().max(140),
    review_text: z.string().max(700),
    avatar: ImageSchema,
  }),
});

export const FeaturesCard3Schema = z.object({
  title: z.string().max(140),
  description: z.string().max(700),
  tasks: z.tuple([
    z.object({ label: z.string().max(80), progress: z.string().max(80), done: z.boolean() }),
    z.object({ label: z.string().max(80), progress: z.string().max(80), done: z.boolean() }),
    z.object({ label: z.string().max(80), progress: z.string().max(80), done: z.boolean() }),
    z.object({ label: z.string().max(80), progress: z.string().max(80), done: z.boolean() }),
  ]),
  summary_title: z.string().max(140),
  summary_sub: z.string().max(140),
});

export const FeaturesSchema = z.object({
  headline_plain: z.string().max(140),
  headline_italic: z.string().max(140),
  subtitle: z.string().max(700),
  cards: z.tuple([FeaturesCard1Schema, FeaturesCard2Schema, FeaturesCard3Schema]),
});

export const ShowcaseTabSchema = z.object({
  tab_label: z.string().max(80),
  headline_line1: z.string().max(140),
  headline_line2: z.string().max(140),
  features: z.tuple([
    z.object({ title: z.string().max(140), description: z.string().max(700) }),
    z.object({ title: z.string().max(140), description: z.string().max(700) }),
    z.object({ title: z.string().max(140), description: z.string().max(700) }),
  ]),
  cta: z.string().max(80),
  image: ImageSchema,
  chip1: z.object({ label: z.string().max(80), value: z.string().max(80) }),
  chip2: z.object({ label: z.string().max(80), value: z.string().max(80) }),
});

export const ShowcaseSchema = z.object({
  tabs: z.tuple([
    ShowcaseTabSchema,
    ShowcaseTabSchema,
    ShowcaseTabSchema,
    ShowcaseTabSchema,
  ]),
});

export const TestimonialItemSchema = z.object({
  name: z.string().max(80),
  role: z.string().max(80),
  quote: z.string().max(700),
  avatar: ImageSchema,
});

export const TestimonialsSchema = z.object({
  headline_plain: z.string().max(140),
  headline_italic: z.string().max(140),
  subtitle: z.string().max(700),
  items: z.tuple([
    TestimonialItemSchema,
    TestimonialItemSchema,
    TestimonialItemSchema,
    TestimonialItemSchema,
    TestimonialItemSchema,
    TestimonialItemSchema,
  ]),
});

export const FooterColumnSchema = z.object({
  heading: z.string().max(80),
  links: z.tuple([
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
  ]),
});

export const FooterSchema = z.object({
  logo: z.string().max(80),
  tagline: z.string().max(700),
  columns: z.tuple([
    FooterColumnSchema,
    FooterColumnSchema,
    FooterColumnSchema,
  ]),
  follow_label: z.string().max(80),
  socials: z.tuple([
    z.object({ platform: z.string().max(80), url: SocialUrlSchema }),
    z.object({ platform: z.string().max(80), url: SocialUrlSchema }),
    z.object({ platform: z.string().max(80), url: SocialUrlSchema }),
    z.object({ platform: z.string().max(80), url: SocialUrlSchema }),
  ]),
  copyright: z.string().max(140),
  legal_links: z.tuple([
    z.string().max(80),
    z.string().max(80),
    z.string().max(80),
  ]),
});

export const SiteContentSchema = z.object({
  seo: SeoSchema,
  hero: HeroSchema,
  hero_dashboard: HeroDashboardSchema,
  features: FeaturesSchema,
  showcase: ShowcaseSchema,
  testimonials: TestimonialsSchema,
  footer: FooterSchema,
}).strict();

export type SiteContent = z.infer<typeof SiteContentSchema>;
