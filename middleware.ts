import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/setup",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/auth/callback",
];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const adminHost = process.env.ADMIN_HOST?.trim();

  // 1. Optional admin subdomain routing
  if (adminHost) {
    if (hostname === adminHost) {
      if (url.pathname === "/") {
        url.pathname = "/admin";
        return NextResponse.rewrite(url);
      }
      if (!url.pathname.startsWith("/admin") && !url.pathname.startsWith("/auth") && !url.pathname.startsWith("/api")) {
        url.pathname = `/admin${url.pathname}`;
        return NextResponse.rewrite(url);
      }
    } else if (url.pathname.startsWith("/admin")) {
      const redirectUrl = new URL(url.pathname + url.search, `https://${adminHost}`);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. Only process session and auth guard on /admin and /auth
  const isAuthOrAdmin = url.pathname.startsWith("/admin") || url.pathname.startsWith("/auth");

  if (!isAuthOrAdmin) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Apply security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If not configured, allow access to public admin routes for setup
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: any }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.some((path) =>
    url.pathname.startsWith(path)
  );

  // If visiting protected admin route while unauthenticated, redirect to /admin/login
  if (!user && url.pathname.startsWith("/admin") && !isPublicAdminRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    "/((?!_next/static|_next/image|favicon.ico|images/|api/site).*)",
  ],
};
