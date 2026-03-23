import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTenantFromHost, getTenantFromSlug, tenants } from "@/lib/tenant";

export function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host") || "localhost";
  const host = rawHost.replace(/:.*/, ""); // elimina ":3000"

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

  // 🔥 MODO TEMPORAL: vercel.app o localhost - usar RUTAS
  if (host.includes("vercel.app") || host.includes("localhost")) {
    const pathParts = pathname.split("/").filter(Boolean);
    const firstSegment = pathParts[0];

    // Rutas globales permitidas (sin redirección)
    const globalRoutes = ["user", "cuenta", "checkout", "auth", "bienvenido"];
    if (firstSegment && globalRoutes.includes(firstSegment)) {
      return NextResponse.next();
    }

    // Si la ruta raíz, redirigir a una categoría por defecto
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/tecnologia", request.url));
    }

    // Si el primer segmento es una categoría válida, permitir
    const validSlugs = Object.keys(tenants);
    if (firstSegment && validSlugs.includes(firstSegment)) {
      return NextResponse.next();
    }

    // Si el primer segmento es un slug válido de categoría
    const tenant = getTenantFromSlug(firstSegment);
    if (tenant) {
      return NextResponse.next();
    }

    // Si no es una ruta válida, redirigir a tecnologia
    return NextResponse.redirect(new URL("/tecnologia", request.url));
  }

  // 🎯 MODO PRODUCCIÓN: dominio personalizado - usar SUBDOMINIOS
  const tenant = getTenantFromHost(host);
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