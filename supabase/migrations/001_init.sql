-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. site_content
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. site_content_history
CREATE TABLE IF NOT EXISTS public.site_content_history (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. admin_profile
CREATE TABLE IF NOT EXISTS public.admin_profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure username is unique case-insensitively
CREATE UNIQUE INDEX IF NOT EXISTS admin_profile_username_idx ON public.admin_profile (lower(username));

-- Enforce exactly one admin row in the database
CREATE UNIQUE INDEX IF NOT EXISTS admin_profile_single_row_idx ON public.admin_profile ((true));

-- 4. auth_attempts
CREATE TABLE IF NOT EXISTS public.auth_attempts (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 0,
  window_started_at TIMESTAMPTZ,
  locked_until TIMESTAMPTZ
);

-- Enable Row Level Security (RLS) on all tables
-- With no public policies, anon/authenticated users cannot read or write directly.
-- Server-only access via SUPABASE_SECRET_KEY (service_role) bypasses RLS safely.
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_attempts ENABLE ROW LEVEL SECURITY;

-- Configure Supabase Storage bucket 'site-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  5242880,
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif'];

-- Policy: Allow public read access to uploaded site images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access site-images'
  ) THEN
    CREATE POLICY "Public Access site-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'site-images');
  END IF;
END $$;

-- 5. Seed initial default site content
INSERT INTO public.site_content (id, data)
VALUES (
  'main',
  
{
  "seo": {
    "title": "Ostra — Effortless operations for exceptional stays",
    "description": "Bookings, property operations, guest experiences and performance insights in one beautifully simple platform."
  },
  "hero": {
    "logo": "Ostra",
    "nav_links": [
      "Overview",
      "Features",
      "Operations",
      "Blog"
    ],
    "nav_cta": "Get for Free",
    "headline_line1": "Exceptional Stays Start",
    "headline_line2_plain": "with",
    "headline_line2_italic": "Effortless Operations",
    "subtitle": "Bookings, property operations, guest experiences, and performance insights — all in one beautifully simple platform.",
    "cta": "Start for Free"
  },
  "hero_dashboard": {
    "image": {
      "src": "/images/defaults/hero-cabin.webp",
      "alt": "Modern timber cabin with a glass front surrounded by pine forest"
    },
    "tabs": [
      "Overview",
      "Properties",
      "Bookings",
      "Operations",
      "Analytics"
    ],
    "image_card_title": "Luxury Stays & Residences",
    "image_card_caption": "Pine Hollow Retreat · 12 cabins",
    "revenue_title": "Nightly Revenue Trend",
    "period_label": "Monthly",
    "legend_revenue": "Revenue (USD)",
    "legend_bookings": "Bookings",
    "stat_cards": [
      {
        "label": "Guest Satisfaction",
        "value": "96%",
        "sub": "+3% this month"
      },
      {
        "label": "Avg. Daily Rate",
        "value": "$184",
        "sub": "+$12 vs last month"
      }
    ],
    "trend_title": "Occupancy Trend",
    "occupancy_title": "Occupancy Rate",
    "occupancy_value": "78%",
    "occupancy_label": "Occupancy",
    "occupancy_delta": "+4.2% vs last month",
    "mini_stats": [
      {
        "label": "Available",
        "value": "42"
      },
      {
        "label": "Occupied",
        "value": "148"
      },
      {
        "label": "Service",
        "value": "6"
      }
    ],
    "status_title": "Status",
    "status_badge": "Live",
    "status_rows": [
      {
        "label": "Housekeeping",
        "value": "14 rooms"
      },
      {
        "label": "Amenities",
        "value": "All active"
      },
      {
        "label": "Reservations",
        "value": "128"
      },
      {
        "label": "Maintenance",
        "value": "3 open"
      }
    ],
    "ops_title": "Operations Overview",
    "ops_rows": [
      {
        "label": "Housekeeping",
        "value": "92%"
      },
      {
        "label": "Guest Satisfaction",
        "value": "85%"
      },
      {
        "label": "Maintenance Requests",
        "value": "72%"
      },
      {
        "label": "Guest Services",
        "value": "90%"
      },
      {
        "label": "Energy Efficiency",
        "value": "68%"
      }
    ]
  },
  "features": {
    "headline_plain": "Stay in control of",
    "headline_italic": "every property",
    "subtitle": "Manage availability, reservations, and team tasks from one connected workspace — keeping every property and every guest experience on track.",
    "cards": [
      {
        "title": "Reservation Calendar",
        "description": "Keep every booking, arrival, and departure organized in one clear view."
      },
      {
        "title": "Available Properties",
        "description": "See property status, guest feedback, and stay details at a glance.",
        "review": {
          "rating": "4.8",
          "rating_caption": "from 124 reviews",
          "reviewer_name": "Sarah M.",
          "reviewer_meta": "Stayed at Lakeside Cabin",
          "review_text": "An absolutely stunning stay. Everything was spotless and the cabin was even better than we expected!",
          "avatar": {
            "src": "/images/defaults/avatar-sarah.webp",
            "alt": "Portrait of Sarah M."
          }
        }
      },
      {
        "title": "Team Tasks",
        "description": "Coordinate cleaning, setup, and daily tasks across every property.",
        "tasks": [
          {
            "label": "Turnover cleaning",
            "progress": "4/4",
            "done": true
          },
          {
            "label": "Guest welcome setup",
            "progress": "3/3",
            "done": true
          },
          {
            "label": "Restock basics",
            "progress": "1/4",
            "done": false
          },
          {
            "label": "Inspect outdoor areas",
            "progress": "0/2",
            "done": false
          }
        ],
        "summary_title": "4 team members active",
        "summary_sub": "Across 3 properties"
      }
    ]
  },
  "showcase": {
    "tabs": [
      {
        "tab_label": "Reservations",
        "headline_line1": "Everything you need,",
        "headline_line2": "nothing you don't",
        "features": [
          {
            "title": "Stay in control",
            "description": "See what's happening across every property — from occupied rooms and upcoming reservations to housekeeping and maintenance status."
          },
          {
            "title": "Work smarter",
            "description": "Coordinate teams, monitor reservations, and keep every operational task moving without jumping between tools."
          },
          {
            "title": "Know what's working",
            "description": "Follow occupancy, revenue trends, average daily rates, and guest sentiment with clear insights built for faster decisions."
          }
        ],
        "cta": "Try Ostra Free",
        "image": {
          "src": "/images/defaults/showcase-reservations.webp",
          "alt": "Scandinavian A-frame cabins in a grassy meadow beside a lake"
        },
        "chip1": {
          "label": "Occupancy Rate",
          "value": "78%"
        },
        "chip2": {
          "label": "Cleaning",
          "value": "Scheduled for May 20"
        }
      },
      {
        "tab_label": "Housekeeping",
        "headline_line1": "Spotless turnovers,",
        "headline_line2": "every single time",
        "features": [
          {
            "title": "Automatic turnover lists",
            "description": "Every checkout creates a cleaning checklist for the right team, with timings that fit the next arrival."
          },
          {
            "title": "Live room readiness",
            "description": "See which rooms are clean, in progress, or waiting for inspection without a single phone call."
          },
          {
            "title": "Supplies that never run out",
            "description": "Track linen, toiletries, and welcome items so every guest walks into a fully stocked stay."
          }
        ],
        "cta": "Try Ostra Free",
        "image": {
          "src": "/images/defaults/showcase-housekeeping.webp",
          "alt": "Freshly made bed inside a bright wooden cabin bedroom"
        },
        "chip1": {
          "label": "Rooms Ready",
          "value": "12 / 14"
        },
        "chip2": {
          "label": "Linen Restock",
          "value": "Today, 3:00 PM"
        }
      },
      {
        "tab_label": "Operations",
        "headline_line1": "Your whole team,",
        "headline_line2": "perfectly in sync",
        "features": [
          {
            "title": "Assign in seconds",
            "description": "Hand off tasks to the right person with due times, notes, and photos attached."
          },
          {
            "title": "Maintenance on track",
            "description": "Log issues, follow repairs, and close requests before they ever affect a guest."
          },
          {
            "title": "One shared timeline",
            "description": "Arrivals, departures, and team activity live together in a single view everyone can trust."
          }
        ],
        "cta": "Try Ostra Free",
        "image": {
          "src": "/images/defaults/showcase-operations.webp",
          "alt": "Wooden cabin porch at dusk with warm lights and a welcome basket"
        },
        "chip1": {
          "label": "Open Tasks",
          "value": "8"
        },
        "chip2": {
          "label": "Hot Tub Service",
          "value": "Tomorrow, 10:00 AM"
        }
      },
      {
        "tab_label": "Analytics",
        "headline_line1": "Clear numbers,",
        "headline_line2": "confident decisions",
        "features": [
          {
            "title": "Revenue at a glance",
            "description": "Nightly revenue, average daily rate, and booking pace in one clean dashboard."
          },
          {
            "title": "Occupancy trends",
            "description": "Spot busy seasons and quiet weeks early so pricing and staffing are always one step ahead."
          },
          {
            "title": "Guest sentiment",
            "description": "Turn reviews and ratings into clear signals about what guests love and what needs attention."
          }
        ],
        "cta": "Try Ostra Free",
        "image": {
          "src": "/images/defaults/showcase-analytics.webp",
          "alt": "Aerial view of a cabin retreat in a forest beside a lake"
        },
        "chip1": {
          "label": "Avg. Daily Rate",
          "value": "$184"
        },
        "chip2": {
          "label": "Guest Rating",
          "value": "4.8 ★"
        }
      }
    ]
  },
  "testimonials": {
    "headline_plain": "Exceptional stays, powered by",
    "headline_italic": "Ostra",
    "subtitle": "From boutique cabins to growing property portfolios, Ostra helps teams stay on top of bookings, operations, and guest experience — all in one place.",
    "items": [
      {
        "name": "James Carter",
        "role": "Property Manager",
        "quote": "Ostra gives us a much clearer view of what's happening across our properties. From reservations to housekeeping, everything finally feels organized and easy to manage.",
        "avatar": {
          "src": "/images/defaults/avatar-james.webp",
          "alt": "Portrait of James Carter"
        }
      },
      {
        "name": "David Kim",
        "role": "Hospitality Founder",
        "quote": "We were up and running incredibly fast, and the transition felt smooth from day one. Ostra helped us bring bookings, housekeeping, property updates, and daily operations into one clear system. Managing multiple stays now feels far more organized, and the whole team spends less time coordinating manually and more time focusing on the guest experience.",
        "avatar": {
          "src": "/images/defaults/avatar-david.webp",
          "alt": "Portrait of David Kim"
        }
      },
      {
        "name": "Emily Zhao",
        "role": "Guest Experience Lead",
        "quote": "What I love most is how simple everything feels. We can track arrivals, room readiness, and guest flow without jumping between multiple tools.",
        "avatar": {
          "src": "/images/defaults/avatar-emily.webp",
          "alt": "Portrait of Emily Zhao"
        }
      },
      {
        "name": "Daniel Novak",
        "role": "Product Manager",
        "quote": "The dashboard is clean, intuitive, and actually useful. We can quickly understand occupancy, revenue, and operational status without digging through spreadsheets.",
        "avatar": {
          "src": "/images/defaults/avatar-daniel.webp",
          "alt": "Portrait of Daniel Novak"
        }
      },
      {
        "name": "Sofia Laurent",
        "role": "Digital Creator",
        "quote": "Before Ostra, we were constantly coordinating things manually. Now our team has one clear system for bookings, housekeeping, and property updates.",
        "avatar": {
          "src": "/images/defaults/avatar-sofia.webp",
          "alt": "Portrait of Sofia Laurent"
        }
      },
      {
        "name": "Alex Turner",
        "role": "Travel Operator",
        "quote": "It saves us time, improves visibility, and keeps the whole operation running smoothly.",
        "avatar": {
          "src": "/images/defaults/avatar-alex.webp",
          "alt": "Portrait of Alex Turner"
        }
      }
    ]
  },
  "footer": {
    "logo": "Ostra",
    "tagline": "A smarter way to manage bookings, operations, and performance across every property.",
    "columns": [
      {
        "heading": "Platform",
        "links": [
          "Overview",
          "Bookings",
          "Operations",
          "Analytics"
        ]
      },
      {
        "heading": "Solutions",
        "links": [
          "Property Management",
          "Guest Experience",
          "Team Operations",
          "Performance Insights"
        ]
      },
      {
        "heading": "Company",
        "links": [
          "About Us",
          "Pricing",
          "Contact",
          "Support"
        ]
      }
    ],
    "follow_label": "Follow Us",
    "socials": [
      {
        "platform": "Facebook",
        "url": "#"
      },
      {
        "platform": "Instagram",
        "url": "#"
      },
      {
        "platform": "X",
        "url": "#"
      },
      {
        "platform": "LinkedIn",
        "url": "#"
      }
    ],
    "copyright": "© 2026 Ostra. All rights reserved.",
    "legal_links": [
      "Privacy Policy",
      "Terms of Use",
      "Cookies"
    ]
  }
}
::jsonb
)
ON CONFLICT (id) DO NOTHING;
