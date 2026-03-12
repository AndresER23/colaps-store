import Link from "next/link";
import { themes, type CategorySlug } from "@/lib/themes";

const categories: { slug: CategorySlug; emoji: string }[] = [
  { slug: "tecnologia", emoji: "⚡" },
  { slug: "belleza", emoji: "✨" },
  { slug: "hogar", emoji: "🏠" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="h-[80vh] flex flex-col items-center justify-center text-center px-6 relative">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-gray-200 to-transparent opacity-50 pointer-events-none" />

        <h1 className="text-[clamp(48px,8vw,96px)] font-light tracking-tighter leading-none animate-fade-up">
          Colaps <span className="font-semibold">Store</span>
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] mt-5 font-light tracking-widest animate-fade-up-delay-1">
          Curated for the ones who notice.
        </p>
        <Link
          href="/tecnologia"
          className="mt-12 px-12 py-4 bg-[var(--color-accent)] text-white rounded-full text-sm font-medium tracking-widest uppercase no-underline hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 animate-fade-up-delay-3"
        >
          Explorar
        </Link>
      </section>

      {/* CATEGORIES */}
      <section className="px-12 pb-20">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-12">
          Categorías
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          {categories.map((cat, i) => {
            const t = themes[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="no-underline rounded-2xl p-12 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-400"
                style={{
                  background: t.bgSecondary,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl"
                  style={{ background: t.gradient }}
                >
                  {cat.emoji}
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: t.text }}
                >
                  {t.name}
                </h3>
                <p
                  className="text-sm font-light"
                  style={{ color: t.textMuted }}
                >
                  {t.tagline}
                </p>
                <span
                  className="inline-block mt-6 text-sm font-medium tracking-wider"
                  style={{ color: t.accent }}
                >
                  Explorar →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
