export function Footer() {
  return (
    <footer className="py-12 px-8 text-center border-t border-[var(--color-text)]/5">
      <p className="text-xs text-[var(--color-text-muted)] tracking-wider">
        © {new Date().getFullYear()} Colaps Store — Todos los derechos
        reservados
      </p>
    </footer>
  );
}
