import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTenantFromHost } from "@/lib/tenant";

export function middleware(request: NextRequest) {
  // Limpiar puerto para que funcione en localhost
  const rawHost = request.headers.get("host") || "localhost";
  const host = rawHost.replace(/:.*/, ""); // elimina ":3000"
  
  const tenant = getTenantFromHost(host);
  const { pathname } = request.nextUrl;

  // No reescribir rutas internas de Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const slug = tenant.slug;

  if (pathname === "/") {
    return NextResponse.rewrite(new URL(`/${slug}`, request.url));
  }

  if (pathname.startsWith(`/${slug}`)) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(`/${slug}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};