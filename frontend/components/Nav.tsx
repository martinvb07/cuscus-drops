export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 sm:px-9 py-[18px] sm:py-[22px] text-[11px]">
      <a
        className="flex items-center gap-[8px] text-bone opacity-90 hover:opacity-100 font-mono tracking-[0.18em] uppercase transition-opacity"
        href="#"
      >
        <svg
          className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-current fill-none shrink-0"
          style={{ strokeWidth: 1.4 }}
          viewBox="0 0 24 24"
        >
          <path d="M3 16V6h11v10H3z" />
          <path d="M14 9h5l2 3v4h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
        <span className="hidden sm:inline">Estado del envío</span>
      </a>

      <a
        className="flex items-center gap-[8px] text-bone opacity-90 hover:opacity-100 font-mono tracking-[0.18em] uppercase transition-opacity"
        href="#"
      >
        <svg
          className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-current fill-none shrink-0"
          style={{ strokeWidth: 1.4 }}
          viewBox="0 0 24 24"
        >
          <rect x="5" y="10" width="14" height="10" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        <span className="hidden sm:inline">Ingrese usando contraseña</span>
      </a>
    </nav>
  );
}
