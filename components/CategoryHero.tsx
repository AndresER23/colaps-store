import type { CategoryTheme } from "@/lib/themes";

export function CategoryHero({ theme }: { theme: CategoryTheme }) {
  return (
    <section className="relative pt-20 pb-16 px-8 text-center">
      {/* Radial glow */}
      <div
        className="absolute inset-x-0 top-0 h-72 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center top, ${theme.accent}18 0%, transparent 70%)`,
        }}
      />

      <p className="relative text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-4 animate-fade-up">
        Colección
      </p>
      <h1
        className="relative text-6xl font-light tracking-tight animate-fade-up-delay-1"
        style={{ fontFamily: theme.fontDisplay }}
      >
        {theme.name}
      </h1>
      <p className="relative text-base text-[var(--color-text-muted)] mt-3 font-light animate-fade-up-delay-2">
        {theme.tagline}
      </p>
    </section>
  );
}
