const badges = [
  {
    icon: "🚚",
    title: "Envío gratis",
    desc: "En todos los pedidos",
  },
  {
    icon: "💵",
    title: "Contraentrega",
    desc: "Pagás cuando recibís",
  },
  {
    icon: "🛡️",
    title: "Garantía",
    desc: "30 días sin preguntas",
  },
  {
    icon: "⚡",
    title: "Despacho rápido",
    desc: "3–7 días hábiles",
  },
];

export function TrustBadges() {
  return (
    <div className="w-full border-y border-[var(--color-text)]/5 bg-[var(--color-bg-secondary)]">
      <div className="max-w-[1200px] mx-auto px-8 py-5 grid grid-cols-4 gap-4">
        {badges.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="text-2xl">{b.icon}</span>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text)]">
                {b.title}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}