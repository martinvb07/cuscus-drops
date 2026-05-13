'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const COUNTRIES = [
  { code: 'CO', name: 'Colombia',          dial: '+57'  },
  { code: 'US', name: 'Estados Unidos',    dial: '+1'   },
  { code: 'MX', name: 'México',            dial: '+52'  },
  { code: 'AR', name: 'Argentina',         dial: '+54'  },
  { code: 'CL', name: 'Chile',             dial: '+56'  },
  { code: 'PE', name: 'Perú',              dial: '+51'  },
  { code: 'VE', name: 'Venezuela',         dial: '+58'  },
  { code: 'EC', name: 'Ecuador',           dial: '+593' },
  { code: 'BO', name: 'Bolivia',           dial: '+591' },
  { code: 'PY', name: 'Paraguay',          dial: '+595' },
  { code: 'UY', name: 'Uruguay',           dial: '+598' },
  { code: 'BR', name: 'Brasil',            dial: '+55'  },
  { code: 'PA', name: 'Panamá',            dial: '+507' },
  { code: 'CR', name: 'Costa Rica',        dial: '+506' },
  { code: 'GT', name: 'Guatemala',         dial: '+502' },
  { code: 'HN', name: 'Honduras',          dial: '+504' },
  { code: 'SV', name: 'El Salvador',       dial: '+503' },
  { code: 'NI', name: 'Nicaragua',         dial: '+505' },
  { code: 'DO', name: 'Rep. Dominicana',   dial: '+1'   },
  { code: 'CU', name: 'Cuba',              dial: '+53'  },
  { code: 'PR', name: 'Puerto Rico',       dial: '+1'   },
];

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

const LABELS: Record<Status, string> = {
  idle:      'Recibe alertas',
  loading:   'Enviando...',
  success:   'En la lista ✓',
  error:     'Error, reintenta',
  duplicate: 'Ya estás registrado ✓',
};

function PrivacyModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[560px] max-h-[80vh] overflow-y-auto border border-[var(--line-strong)] bg-[#0c0c0c]"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(235,230,219,0.2) transparent' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0c0c0c] border-b border-[var(--line)] px-6 py-4 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.42em] text-bone uppercase">Política de Privacidad</span>
          <button onClick={onClose} className="w-7 h-7 border border-[var(--line)] grid place-items-center text-bone-3 hover:text-bone hover:border-[var(--line-strong)] transition-colors">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          <p className="font-mono text-[9px] tracking-[0.12em] text-bone-3 leading-[1.8] uppercase">Última actualización: Mayo 2026</p>
          {[
            { title: '1. Responsable', body: 'Cuscus Hats es responsable del tratamiento de los datos personales, en cumplimiento de la Ley 1581 de 2012 (Colombia).' },
            { title: '2. Datos que Recopilamos', body: 'Únicamente recopilamos tu número de teléfono, proporcionado voluntariamente.' },
            { title: '3. Finalidad', body: 'Tu número se usa exclusivamente para enviarte alertas sobre drops y lanzamientos exclusivos de Cuscus Hats vía WhatsApp.' },
            { title: '4. Compartición', body: 'No vendemos ni compartimos tu número con terceros. Solo lo usamos con proveedores de mensajería para enviarte las comunicaciones autorizadas.' },
            { title: '5. Conservación', body: 'Conservamos tu número mientras mantengas tu suscripción. Puedes solicitar su eliminación en cualquier momento.' },
            { title: '6. Tus Derechos', body: 'Tienes derecho a acceder, rectificar y suprimir tus datos. Escríbenos a contacto@cuscushats.com con el asunto "Datos Personales".' },
          ].map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-[6px]">
              <h3 className="font-mono text-[9px] tracking-[0.32em] text-bone uppercase">{title}</h3>
              <p className="font-mono text-[9px] tracking-[0.1em] text-bone-3 leading-[1.9]">{body}</p>
            </div>
          ))}
          <button onClick={onClose} className="mt-2 h-[42px] w-full bg-bone text-ink font-mono text-[10px] tracking-[0.36em] uppercase hover:bg-transparent hover:text-bone border border-bone transition-all duration-200">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignupForm() {
  const [status, setStatus]           = useState<Status>('idle');
  const [country, setCountry]         = useState(COUNTRIES[0]);
  const [open, setOpen]               = useState(false);
  const [query, setQuery]             = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const wrapperRef                    = useRef<HTMLDivElement>(null);
  const searchRef                     = useRef<HTMLInputElement>(null);
  const closePrivacy = useCallback(() => setShowPrivacy(false), []);

  const filtered = query.trim()
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.dial.includes(query))
    : COUNTRIES;

  useEffect(() => { if (open) searchRef.current?.focus(); }, [open]);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) { setOpen(false); setQuery(''); }
    }
    function esc(e: KeyboardEvent) { if (e.key === 'Escape') { setOpen(false); setQuery(''); } }
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', esc); };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    const data = { phone: country.dial + (e.currentTarget.elements.namedItem('phone') as HTMLInputElement).value };
    try {
      const res = await fetch(`${API_URL}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.status === 201)      setStatus('success');
      else if (res.status === 409) setStatus('duplicate');
      else                         setStatus('error');
    } catch { setStatus('error'); }
    setTimeout(() => setStatus('idle'), 2400);
  }

  const isSuccess = status === 'success' || status === 'duplicate';

  return (
    <>
      {showPrivacy && <PrivacyModal onClose={closePrivacy} />}
      <form onSubmit={handleSubmit} className="w-full max-w-[480px] flex flex-col gap-[6px] sm:gap-[8px]" autoComplete="off">

        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="flex-1 h-px bg-[var(--line-strong)]" />
          <span className="font-mono text-[8px] tracking-[0.38em] text-bone-3 uppercase whitespace-nowrap">Sé el primero en saber</span>
          <span className="flex-1 h-px bg-[var(--line-strong)]" />
        </div>

        {/* Phone + country picker */}
        <div ref={wrapperRef} className="relative flex items-center border border-[var(--line)] bg-[rgba(235,230,219,0.05)] transition-all duration-300 focus-within:border-[rgba(235,230,219,0.55)] focus-within:bg-[rgba(235,230,219,0.09)]">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 px-3 border-r border-[var(--line)] h-[44px] shrink-0 text-bone-2 font-mono text-[10px] tracking-[0.14em] hover:text-bone transition-colors duration-200 select-none"
          >
            <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} width="20" height="14" alt={country.name} className="rounded-[2px] object-cover shrink-0" />
            <span>{country.dial}</span>
            <svg width="8" height="8" viewBox="0 0 10 6" fill="currentColor" className="opacity-50 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M0 0 L5 6 L10 0Z"/>
            </svg>
          </button>

          <input
            type="tel"
            name="phone"
            placeholder="Número de WhatsApp"
            inputMode="tel"
            required
            className="flex-1 bg-transparent border-0 outline-none text-bone py-0 px-3 h-[44px] text-[10px] tracking-[0.18em] font-mono placeholder:text-bone-3 placeholder:tracking-[0.12em] min-w-0"
          />

          {open && (
            <div className="absolute left-0 top-full mt-[2px] z-50 border border-[var(--line-strong)] bg-[#0e0e0e] shadow-[0_8px_32px_rgba(0,0,0,0.8)]" style={{ width: 'max(240px,100%)' }}>
              <div className="border-b border-[var(--line)] px-3 py-2 flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bone-3 shrink-0"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
                <input ref={searchRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar país..." className="flex-1 bg-transparent border-0 outline-none text-bone text-[10px] font-mono tracking-[0.12em] placeholder:text-bone-3 min-w-0" />
              </div>
              <ul className="max-h-[180px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(235,230,219,0.2) transparent' }}>
                {filtered.length === 0
                  ? <li className="px-3 py-2 text-[9px] text-bone-3 font-mono tracking-[0.14em]">Sin resultados</li>
                  : filtered.map(c => (
                    <li key={c.code}>
                      <button type="button" onClick={() => { setCountry(c); setOpen(false); setQuery(''); }}
                        className="w-full flex items-center gap-3 px-3 py-[9px] text-left hover:bg-[rgba(235,230,219,0.07)] transition-colors duration-150"
                        style={{ background: c.code === country.code ? 'rgba(235,230,219,0.08)' : undefined }}>
                        <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} width="20" height="14" alt={c.name} className="rounded-[2px] object-cover shrink-0" />
                        <span className="flex-1 font-mono text-[10px] tracking-[0.12em] text-bone-2 truncate">{c.name}</span>
                        <span className="font-mono text-[10px] tracking-[0.12em] text-bone-3 shrink-0">{c.dial}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-[44px] px-4 font-mono text-[11px] tracking-[0.38em] uppercase flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50"
          style={{
            background:  isSuccess ? 'transparent' : 'var(--bone)',
            color:       isSuccess ? 'var(--bone)'  : 'var(--ink)',
            border:      isSuccess ? '1px solid rgba(235,230,219,0.4)' : '1px solid var(--bone)',
          }}
          onMouseEnter={e => { if (status === 'idle') { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--bone)'; }}}
          onMouseLeave={e => { if (status === 'idle') { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bone)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)'; }}}
        >
          <span>{LABELS[status]}</span>
          {!isSuccess && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0 L13 10 L24 12 L13 14 L12 24 L11 14 L0 12 L11 10 Z"/></svg>
          )}
        </button>

        {/* Legal */}
        <p className="text-[8.5px] text-bone-3 text-center mt-[2px] leading-[1.6] font-mono tracking-[0.1em] uppercase">
          Al registrarte aceptas{' '}
          <button type="button" onClick={() => setShowPrivacy(true)} className="border-b border-[rgba(235,230,219,0.3)] hover:border-bone-2 hover:text-bone-2 transition-colors duration-200">
            nuestra política de privacidad
          </button>.
        </p>
      </form>
    </>
  );
}
