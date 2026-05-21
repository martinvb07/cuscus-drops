export default function StockBadge({ available, total = 100 }: { available: number | null; total?: number }) {
  const pct = available !== null ? Math.max(0, (available / total) * 100) : null;
  const low = pct !== null && pct < 20;

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[440px]">
      {/* Barra de stock */}
      <div className="w-full h-[2px] bg-[var(--line)] relative overflow-hidden">
        {pct !== null && (
          <div
            className="absolute left-0 top-0 h-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: low
                ? 'linear-gradient(90deg, #e05c5c, #f5c842)'
                : 'linear-gradient(90deg, var(--bone-3), var(--bone))',
            }}
          />
        )}
      </div>

      {/* Texto */}
      <div className="flex items-center justify-between w-full font-mono text-[10px] tracking-[0.22em] uppercase">
        {available === null ? (
          <span className="text-bone-3">Verificando stock...</span>
        ) : available <= 0 ? (
          <span className="text-[#e05c5c]">Agotado</span>
        ) : (
          <>
            <span className={low ? 'text-[#f5c842]' : 'text-bone-2'}>
              {available} disponibles
            </span>
            <span className="text-bone-3">{total} unidades · Drop #1</span>
          </>
        )}
      </div>
    </div>
  );
}
