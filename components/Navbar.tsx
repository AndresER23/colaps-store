"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { themes, type CategorySlug } from "@/lib/themes";

const categories: { slug: CategorySlug; label: string }[] = [
  { slug: "tecnologia", label: "Tecnología" },
  { slug: "belleza", label: "Belleza" },
  { slug: "hogar", label: "Hogar" },
];

export function Navbar() {
  const pathname = usePathname();

  const activeCategory = categories.find((c) =>
    pathname.startsWith(`/${c.slug}`)
  )?.slug;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl bg-[var(--color-bg)]/90 border-b border-[var(--color-text)]/5 transition-all duration-500">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
          C
        </div>
        <span className="text-lg font-medium tracking-tight text-[var(--color-text)]">
          Colaps
        </span>
      </Link>

      {/* Category Links */}
      <div className="flex gap-8 items-center">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className={`text-xs uppercase tracking-[0.04em] font-medium no-underline pb-1 border-b-2 transition-all duration-300 ${
              activeCategory === cat.slug
                ? "text-[var(--color-accent)] border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text)]"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Cart placeholder */}
      <button className="text-xl bg-transparent border-none cursor-pointer">
        🛒
      </button>
    </nav>
  );
}
