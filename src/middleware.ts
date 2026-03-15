import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const LOCALES = ["en", "da"] as const;
const DEFAULT_LOCALE = "en";

// Paths that should never be locale-prefixed or rewritten
const SKIP_PATHS = [
  "/api",
  "/admin",
  "/login",
  "/go",
  "/_next",
  "/favicon",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // --- 1. Legacy domain backward compat (qr.activatelms.com) ---
  // Rewrite bare slugs to /go/[slug] so old QR codes keep working
  if (hostname.includes("activatelms.com")) {
    const isSkipPath = SKIP_PATHS.some((p) => pathname.startsWith(p));
    const isStaticFile = pathname.includes(".");

    if (!isSkipPath && !isStaticFile && pathname !== "/") {
      // Rewrite /{slug} → /go/{slug} internally (no visible redirect)
      const url = request.nextUrl.clone();
      url.pathname = `/go${pathname}`;
      return NextResponse.rewrite(url);
    }

    // Root of activatelms → redirect to main domain
    if (pathname === "/") {
      return NextResponse.redirect("https://getdynamicqrcode.com");
    }
  }

  // --- 2. Auth protection for /admin ---
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // --- 3. Skip non-locale paths ---
  const isSkipPath = SKIP_PATHS.some((p) => pathname.startsWith(p));
  const isStaticFile = pathname.includes(".");
  if (isSkipPath || isStaticFile) {
    return NextResponse.next();
  }

  // --- 4. Locale routing for marketing pages ---
  // Check if path already has a locale prefix
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Root or unlocalized path → detect language and redirect
  const acceptLanguage = request.headers.get("accept-language") || "";
  const prefersDanish = acceptLanguage.toLowerCase().includes("da");
  const locale = prefersDanish ? "da" : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
