export function Footer({ storeName = "Colaps Store" }: { storeName?: string }) {
  return (
    <footer className="border-t border-[var(--color-text)]/5 mt-20">
      {/* Trust section */}
      <div id="trust" className="max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-3 gap-10">
        <div>
          <div className="text-3xl mb-3">🚚</div>
          <h3 className="text-sm font-semibold mb-1">Envío gratis a toda Colombia</h3>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Sin mínimo de compra. Entregamos en 3 a 7 días hábiles a cualquier ciudad del país.
          </p>
        </div>
        <div>
          <div className="text-3xl mb-3">💵</div>
          <h3 className="text-sm font-semibold mb-1">Pago contraentrega</h3>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Pagás cuando el producto llega a tu puerta. Sin tarjeta, sin riesgo, sin complicaciones.
          </p>
        </div>
        <div>
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-sm font-semibold mb-1">Garantía de 30 días</h3>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Si no quedás satisfecho, te devolvemos el dinero. Sin preguntas, sin letra pequeña.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-text)]/5 py-6 px-8 flex items-center justify-between">
        <p className="text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} {storeName} — Todos los derechos reservados
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] no-underline transition-colors">
            Política de privacidad
          </a>
          <a href="#" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] no-underline transition-colors">
            Términos
          </a>
          <a href="#" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] no-underline transition-colors">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}