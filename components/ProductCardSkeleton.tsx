export function ProductCardSkeleton() {
  return (
    <div
      className="block bg-card border border-[var(--color-text)]/5 p-6 relative animate-pulse"
      style={{ borderRadius: "var(--radius-card)" }}
    >
      {/* Imagen skeleton */}
      <div
        className="h-44 mb-5 bg-[var(--color-bg-secondary)]"
        style={{ borderRadius: "calc(var(--radius-card) - 4px)" }}
      />

      {/* Título skeleton */}
      <div
        className="h-3.5 bg-[var(--color-bg-secondary)] rounded mb-2 w-3/4"
      />
      <div
        className="h-3.5 bg-[var(--color-bg-secondary)] rounded mb-4 w-1/2"
      />

      {/* Tags skeleton */}
      <div className="h-3 bg-[var(--color-bg-secondary)] rounded mb-5 w-1/3" />

      {/* Precio + botón skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-6 bg-[var(--color-bg-secondary)] rounded w-20" />
        <div className="h-8 bg-[var(--color-bg-secondary)] rounded w-20" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
