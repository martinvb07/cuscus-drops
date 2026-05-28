'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const API  = process.env.NEXT_PUBLIC_API_URL        || 'http://localhost:4001';
const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

type FinancialStatus   = 'pending' | 'authorized' | 'paid' | 'partially_refunded' | 'refunded' | 'voided';
type FulfillmentStatus = 'unfulfilled' | 'in_transit' | 'dispatched' | 'delivered' | 'cancelled';

interface Order {
  _id: string;
  shopifyOrderNumber: number;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  shippingAddress: { address1: string; address2?: string; city: string; province: string; country: string; zip: string };
  lineItems: { title: string; quantity: number; price: string }[];
  totalPrice: string; currency: string;
  financialStatus: FinancialStatus; fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string; trackingCompany?: string; trackingUrl?: string;
  adminNotes?: string; shopifyCreatedAt: string; createdAt: string;
}

interface Stats {
  total: number; paid: number; pending: number;
  dispatched: number; delivered: number;
  available: number; stockTotal: number; revenue: number;
}

interface Customer {
  _id: string; firstName: string; lastName: string;
  email: string; phone: string; city: string; country: string;
  totalOrders: number; totalSpent: number; lastOrder: string;
}

interface ShopifyLiveData {
  connected: boolean; inventory: number | null; stockTotal: number;
  stats: { total: number; paid: number; dispatched: number; revenue: number; currency: string } | null;
  timestamp: string; error?: string;
}

interface ProductDetails {
  productId: string; productTitle: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  variantId: string; price: string; currencyCode: string; inventory: number;
}

const FIN_LABEL: Record<FinancialStatus, string>   = { pending: 'Pendiente', authorized: 'Autorizado', paid: 'Pagado', partially_refunded: 'Parcial', refunded: 'Reembolso', voided: 'Anulado' };
const FUL_LABEL: Record<FulfillmentStatus, string> = { unfulfilled: 'Sin despachar', in_transit: 'En tránsito', dispatched: 'Despachado', delivered: 'Entregado', cancelled: 'Cancelado' };
const FIN_CLS:   Record<FinancialStatus, string>   = { pending: 'badge-pending', authorized: 'badge-pending', paid: 'badge-paid', partially_refunded: 'badge-refunded', refunded: 'badge-refunded', voided: 'badge-refunded' };
const FUL_CLS:   Record<FulfillmentStatus, string> = { unfulfilled: 'badge-unfulfilled', in_transit: 'badge-in_transit', dispatched: 'badge-dispatched', delivered: 'badge-delivered', cancelled: 'badge-refunded' };

function hdrs() { return { 'Content-Type': 'application/json', 'x-admin-token': PASS }; }

type Section = 'dashboard' | 'drops' | 'pedidos' | 'inventario' | 'clientes' | 'shopify' | 'config';

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const ICONS: Record<Section, React.ReactElement> = {
  dashboard:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  drops:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  pedidos:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v10H2z" stroke="currentColor" strokeWidth="1.2"/><path d="M5 6h4M5 8.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  inventario: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4v6l-6 3L1 10V4z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1v12M1 4l6 3 6-3" stroke="currentColor" strokeWidth="1.2"/></svg>,
  clientes:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  shopify:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5C9 2 8.2 1.5 7 1.5c-1.5 0-2.5 1-2.5 2.5V5H3l-.5 7h9L11 5H9.5V4c0-.8-.5-1.5-1.5-1.5z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  config:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1v1.5M7 11.5V13M13 7h-1.5M2.5 7H1M11.24 2.76l-1.06 1.06M3.82 10.18l-1.06 1.06M11.24 11.24l-1.06-1.06M3.82 3.82L2.76 2.76" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
};

const NAV: { id: Section; label: string; live?: true }[] = [
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'drops',      label: 'Drop #1',    live: true },
  { id: 'pedidos',    label: 'Pedidos',    live: true },
  { id: 'inventario', label: 'Inventario' },
  { id: 'clientes',   label: 'Clientes' },
  { id: 'shopify',    label: 'Shopify' },
  { id: 'config',     label: 'Config' },
];

/* ══ PAGE ═════════════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed,      setAuthed]      = useState(false);
  const [password,    setPassword]    = useState('');
  const [loginError,  setLoginError]  = useState(false);
  const [section,     setSection]     = useState<Section>('dashboard');
  const [sideOpen,    setSideOpen]    = useState(false);
  const [stats,       setStats]       = useState<Stats | null>(null);
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState('');
  const [financial,   setFinancial]   = useState('');
  const [fulfillment, setFulfillment] = useState('');
  const [selected,    setSelected]    = useState<Order | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [patch, setPatch] = useState<Record<string, string>>({
    fulfillmentStatus: '', trackingNumber: '', trackingCompany: '', trackingUrl: '', adminNotes: '',
  });
  const [customers,        setCustomers]        = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customerSearch,   setCustomerSearch]   = useState('');
  const [backendHealth,    setBackendHealth]     = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [shopifyLive,      setShopifyLive]       = useState<ShopifyLiveData | null>(null);
  const [shopifyLoading,   setShopifyLoading]   = useState(false);
  const [product,          setProduct]          = useState<ProductDetails | null>(null);
  const [productLoading,   setProductLoading]   = useState(false);
  const [productSaving,    setProductSaving]    = useState(false);
  const [productError,     setProductError]     = useState('');
  const [priceInput,       setPriceInput]       = useState('');
  const [confirmToggle,    setConfirmToggle]    = useState(false);
  const [saveMsg,          setSaveMsg]          = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadProduct() {
    setProductLoading(true); setProductError('');
    try {
      const res = await fetch('/api/admin/shopify/product', { headers: hdrs() });
      if (res.ok) { const d: ProductDetails = await res.json(); setProduct(d); setPriceInput(d.price); }
      else { const d = await res.json(); setProductError(d.error || 'Error al cargar producto'); }
    } finally { setProductLoading(false); }
  }

  function flash(msg: string) {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 3000);
  }

  async function savePrice() {
    if (!product || !priceInput) return;
    setProductSaving(true); setProductError('');
    try {
      const res = await fetch('/api/admin/shopify/product', { method: 'PATCH', headers: { ...hdrs() }, body: JSON.stringify({ price: priceInput }) });
      const d = await res.json();
      if (!res.ok) { setProductError(d.error || 'Error al guardar'); return; }
      setProduct(p => p ? { ...p, price: d.price ?? priceInput } : p);
      flash('Precio actualizado en Shopify');
    } finally { setProductSaving(false); }
  }

  async function executeToggle() {
    if (!product) return;
    const newStatus = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    setProductSaving(true); setProductError('');
    try {
      const res = await fetch('/api/admin/shopify/product', { method: 'PATCH', headers: { ...hdrs() }, body: JSON.stringify({ status: newStatus, productId: product.productId }) });
      const d = await res.json();
      if (!res.ok) { setProductError(d.error || 'Error al cambiar estado'); return; }
      setProduct(p => p ? { ...p, status: newStatus } : p);
      flash(newStatus === 'ACTIVE' ? 'Drop activado — web en vivo' : 'Drop cerrado — web muestra SOLD OUT');
    } finally { setProductSaving(false); }
  }

  async function loadShopifyLive() {
    setShopifyLoading(true);
    try {
      const res = await fetch('/api/admin/shopify/status', { headers: { 'x-admin-token': PASS } });
      if (res.ok) setShopifyLive(await res.json());
    } finally { setShopifyLoading(false); }
  }

  async function loadCustomers() {
    setCustomersLoading(true);
    try {
      const res = await fetch(`${API}/api/orders/customers`, { headers: hdrs() });
      if (res.ok) setCustomers(await res.json());
    } finally { setCustomersLoading(false); }
  }

  async function checkHealth() {
    try { const res = await fetch(`${API}/api/health`); setBackendHealth(res.ok ? 'ok' : 'error'); }
    catch { setBackendHealth('error'); }
  }

  const load = useCallback(async (p = page) => {
    const params = new URLSearchParams({ page: String(p), limit: '50' });
    if (search)      params.set('search',      search);
    if (financial)   params.set('financial',   financial);
    if (fulfillment) params.set('fulfillment', fulfillment);
    const [sRes, oRes] = await Promise.all([
      fetch(`${API}/api/orders/stats`,     { headers: hdrs() }),
      fetch(`${API}/api/orders?${params}`, { headers: hdrs() }),
    ]);
    if (!sRes.ok || !oRes.ok) return;
    setStats(await sRes.json());
    const d = await oRes.json();
    setOrders(d.orders); setTotal(d.total);
  }, [page, search, financial, fulfillment]);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  // Auto-refresh stats cada 60s mientras dashboard está activo
  useEffect(() => {
    if (!authed || section !== 'dashboard') {
      if (refreshRef.current) { clearInterval(refreshRef.current); refreshRef.current = null; }
      return;
    }
    refreshRef.current = setInterval(() => load(), 60_000);
    return () => { if (refreshRef.current) clearInterval(refreshRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, section]);

  useEffect(() => {
    if (!authed) return;
    if (section === 'clientes')  loadCustomers();
    if (section === 'config')    checkHealth();
    if (section === 'shopify')   loadShopifyLive();
    if (section === 'drops')     loadProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, section]);

  // Escape cierra drawer y confirmaciones
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setSelected(null); setConfirmToggle(false); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function login() {
    if (password === PASS) { setAuthed(true); setLoginError(false); }
    else { setLoginError(true); setTimeout(() => setLoginError(false), 1200); }
  }

  function openOrder(o: Order) {
    setSelected(o);
    setPatch({ fulfillmentStatus: o.fulfillmentStatus, trackingNumber: o.trackingNumber || '', trackingCompany: o.trackingCompany || '', trackingUrl: o.trackingUrl || '', adminNotes: o.adminNotes || '' });
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    const body: Record<string, string> = {};
    Object.entries(patch).forEach(([k, v]) => { if (v !== undefined) body[k] = v; });
    await fetch(`${API}/api/orders/${selected._id}`, { method: 'PATCH', headers: hdrs(), body: JSON.stringify(body) });
    setSaving(false); setSelected(null); load();
  }

  /* ── LOGIN ───────────────────────────────────────────────────────────────── */
  if (!authed) {
    return (
      <div className="min-h-screen flex fabric-bg" style={{ background: 'var(--ink)' }}>
        {/* Panel izquierdo — editorial */}
        <div className="hidden lg:flex flex-col justify-between w-[42%] border-r border-[var(--line)] p-10 relative overflow-hidden">
          {/* Fondo sutil */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(201,169,110,0.04) 0%, transparent 70%)' }} />

          <div>
            <div className="flex items-center gap-3 mb-16">
              <Image src="/LOGO_FINAL.png" alt="Cuscus Hats" width={28} height={28}
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-bone-3">Cuscus Hats</span>
            </div>

            <div className="mb-10">
              <p className="font-mono text-[8px] tracking-[0.5em] uppercase text-bone-3 mb-5 opacity-50">
                Sistema de gestión
              </p>
              <h1 className="font-bebas leading-none text-bone"
                style={{ fontSize: 'clamp(52px, 5vw, 72px)', letterSpacing: '0.04em' }}>
                PANEL<br />INTERNO
              </h1>
              <div className="stitch-divider w-16 mt-5 mb-5" />
              <p className="font-garamond text-[17px] text-bone-2" style={{ fontWeight: 300, fontStyle: 'italic', lineHeight: 1.5 }}>
                Drop #1 · Gorra Cuscus<br />100 unidades · 2026
              </p>
            </div>
          </div>

          {/* Stats decorativos */}
          <div className="grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-8">
            {[
              { label: 'Unidades', value: '100' },
              { label: 'Drop',     value: '#01' },
              { label: 'Estado',   value: 'LIVE' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-mono text-[7px] tracking-[0.4em] uppercase text-bone-3 mb-1.5 opacity-60">{s.label}</p>
                <p className="font-bebas text-[26px] text-bone" style={{ letterSpacing: '0.03em' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Logo móvil */}
          <div className="flex lg:hidden flex-col items-center gap-3 mb-12">
            <Image src="/LOGO_FINAL.png" alt="Cuscus Hats" width={32} height={32}
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.75 }} />
            <div className="stitch-divider w-10" />
            <p className="font-mono text-[7.5px] tracking-[0.45em] uppercase text-bone-3">Panel interno</p>
          </div>

          <div className="w-full max-w-[320px]">
            <div className="mb-8">
              <h2 className="font-bebas text-[34px] text-bone" style={{ letterSpacing: '0.05em' }}>
                ACCEDER
              </h2>
              <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-bone-3 mt-1 opacity-60">
                Introduce tu contraseña
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(false); }}
                  onKeyDown={e => e.key === 'Enter' && login()}
                  autoFocus
                  className="w-full px-4 py-3.5 font-mono text-[13px] text-bone placeholder:text-bone-3 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(235,230,219,0.04)',
                    border: `1px solid ${loginError ? 'rgba(224,92,92,0.6)' : 'var(--line)'}`,
                    boxShadow: loginError ? '0 0 0 3px rgba(224,92,92,0.08)' : 'none',
                  }}
                />
                {loginError && (
                  <p className="font-mono text-[8px] tracking-[0.2em] uppercase mt-1.5"
                    style={{ color: 'rgba(224,92,92,0.8)' }}>
                    Contraseña incorrecta
                  </p>
                )}
              </div>

              <button
                onClick={login}
                className="relative overflow-hidden py-3.5 font-mono text-[9px] tracking-[0.45em] uppercase text-[var(--ink)] transition-all duration-200 group"
                style={{ background: 'var(--bone)' }}
              >
                <span className="relative z-10 group-hover:opacity-80 transition-opacity">
                  Entrar al panel
                </span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, var(--bone), var(--bone-2))' }} />
              </button>
            </div>

            <p className="mt-8 font-mono text-[7px] tracking-[0.3em] uppercase text-bone-3 opacity-30 text-center">
              Cuscus Hats · Sistema interno · Drop #1
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── AUTHENTICATED ───────────────────────────────────────────────────────── */
  const stockPct = stats ? Math.round(((stats.stockTotal - (stats.available ?? 0)) / stats.stockTotal) * 100) : 0;
  const filteredCustomers = customerSearch
    ? customers.filter(c => {
        const q = customerSearch.toLowerCase();
        return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
               c.email.toLowerCase().includes(q) || (c.phone || '').includes(q) || (c.city || '').toLowerCase().includes(q);
      })
    : customers;

  function navTo(id: Section) { setSection(id); setSideOpen(false); }

  return (
    <div className="min-h-screen flex bg-[var(--ink)]">

      {/* ══ SIDEBAR — desktop ═══════════════════════════════════════════════════ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-[220px] shrink-0
        border-r border-[var(--line)] bg-[#0c0c0c]
        transition-transform duration-300
        ${sideOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-[var(--line)] flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <Image src="/LOGO_FINAL.png" alt="Cuscus Hats" width={24} height={24}
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
            <div>
              <p className="font-garamond text-[14px] text-bone leading-none" style={{ fontWeight: 300 }}>Cuscus</p>
              <p className="font-mono text-[6.5px] tracking-[0.4em] uppercase text-bone-3 opacity-50 mt-0.5">Admin</p>
            </div>
          </a>
          <button className="lg:hidden w-6 h-6 flex items-center justify-center text-bone-3 hover:text-bone transition-colors"
            onClick={() => setSideOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col py-2 flex-1 overflow-y-auto">
          {NAV.map(item => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navTo(item.id)}
                className="flex items-center gap-3 px-5 py-2.5 transition-all duration-150 relative group"
                style={{
                  background: active ? 'rgba(235,230,219,0.07)' : 'transparent',
                  color: active ? 'var(--bone)' : 'var(--bone-3)',
                }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-bone rounded-r-full" />
                )}
                <span className={`transition-colors ${active ? 'text-bone' : 'text-bone-3 group-hover:text-bone-2'}`}>
                  {ICONS[item.id]}
                </span>
                <span className={`font-mono text-[8.5px] tracking-[0.28em] uppercase transition-colors flex-1 text-left
                  ${active ? 'text-bone' : 'text-bone-3 group-hover:text-bone-2'}`}>
                  {item.label}
                </span>
                {item.live && (
                  <span className="w-[5px] h-[5px] rounded-full shrink-0 animate-pulse"
                    style={{ background: 'var(--green)', boxShadow: '0 0 5px rgba(62,207,142,0.6)' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Drop status */}
        <div className="p-4 border-t border-[var(--line)] mx-3 mb-3 border"
          style={{ background: 'rgba(235,230,219,0.025)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-[5px] h-[5px] rounded-full animate-pulse"
                style={{ background: 'var(--green)', boxShadow: '0 0 5px rgba(62,207,142,0.6)' }} />
              <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-bone opacity-80">Drop #1 · Live</span>
            </div>
            {stats && (
              <span className="font-bebas text-[16px] text-bone" style={{ letterSpacing: '0.02em' }}>
                {stats.available}/{stats.stockTotal}
              </span>
            )}
          </div>
          {stats && (
            <div className="h-[2px] bg-[var(--line)] overflow-hidden rounded-full">
              <div className="h-full transition-all duration-1000 rounded-full"
                style={{
                  width: `${stockPct}%`,
                  background: stockPct > 70 ? '#e05c5c' : stockPct > 40 ? '#f5c842' : '#3ecf8e',
                }} />
            </div>
          )}
        </div>
      </aside>

      {/* Overlay sidebar móvil */}
      {sideOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSideOpen(false)} />
      )}

      {/* ══ MAIN ════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-3.5
          border-b border-[var(--line)] backdrop-blur-md"
          style={{ background: 'rgba(12,12,12,0.92)' }}>
          <button className="lg:hidden flex flex-col gap-[4px] p-1.5"
            onClick={() => setSideOpen(true)}>
            {[0,1,2].map(i => (
              <span key={i} className="block w-[18px] h-[1.5px] bg-bone-3 rounded-full" />
            ))}
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span style={{ color: 'rgba(235,230,219,0.25)' }}>{ICONS[section]}</span>
            <span className="font-bebas text-[16px] text-bone tracking-[0.06em] truncate leading-none">
              {NAV.find(n => n.id === section)?.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {stats && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line)]"
                style={{ background: 'rgba(62,207,142,0.06)' }}>
                <span className="w-[4px] h-[4px] rounded-full animate-pulse"
                  style={{ background: 'var(--green)' }} />
                <span className="font-mono text-[7.5px] tracking-[0.25em] uppercase"
                  style={{ color: 'var(--green)' }}>
                  {stats.available} disponibles
                </span>
              </div>
            )}
            <a href={`${API}/api/orders/export.csv`} download
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line)] font-mono text-[7.5px] tracking-[0.24em] uppercase text-bone-3 hover:text-bone hover:border-[var(--line-strong)] transition-colors">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 1v5M2 5l2.5 3 2.5-3M1 8h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="hidden sm:inline">Exportar</span>
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          <div className="px-4 sm:px-6 py-6">

            {/* ── DASHBOARD ────────────────────────────────────────────────── */}
            {section === 'dashboard' && (
              <div className="flex flex-col gap-6">
                {/* Banner superior */}
                <div className="flex items-end justify-between border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="font-mono text-[7px] tracking-[0.45em] uppercase mb-1" style={{ color: 'rgba(235,230,219,0.3)' }}>
                      {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="font-bebas text-[28px] text-bone leading-none tracking-[0.04em]">Overview · Drop #1</h1>
                  </div>
                  {stats && (
                    <span className="font-mono text-[7.5px] tracking-[0.3em] uppercase hidden sm:block"
                      style={{ color: 'rgba(235,230,219,0.25)' }}>
                      {stats.total} órdenes totales
                    </span>
                  )}
                </div>

                {!stats ? (
                  <LoadingState label="Cargando métricas..." />
                ) : (
                  <>
                    {/* Grid métricas */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                      {[
                        { label: 'Pedidos',     value: stats.total,      color: 'var(--bone)',   sub: 'total' },
                        { label: 'Pagados',     value: stats.paid,       color: '#3ecf8e',       sub: 'confirmados' },
                        { label: 'Pendientes',  value: stats.pending,    color: '#f5c842',       sub: 'sin pago' },
                        { label: 'Despachados', value: stats.dispatched, color: '#63b3ed',       sub: 'enviados' },
                        { label: 'Entregados',  value: stats.delivered,  color: '#3ecf8e',       sub: 'recibidos' },
                        { label: 'Ingresos',    value: `$${Math.round(stats.revenue / 1000)}k`, color: 'var(--gold)', sub: 'COP' },
                      ].map(m => (
                        <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} sub={m.sub} />
                      ))}
                    </div>

                    {/* Stock + Revenue */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {/* Stock visual */}
                      <div className="border border-[var(--line)] p-5 flex flex-col gap-4 xl:col-span-2"
                        style={{ background: 'rgba(235,230,219,0.02)' }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-mono text-[7.5px] tracking-[0.35em] uppercase text-bone-3 mb-2">Stock Drop #1</p>
                            <div className="flex items-baseline gap-2">
                              <span className="font-bebas leading-none text-bone" style={{ fontSize: '48px', letterSpacing: '0.02em' }}>
                                {stats.available}
                              </span>
                              <span className="font-mono text-[10px] text-bone-3">/ {stats.stockTotal}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-bone-3 mb-1">Vendidas</p>
                            <span className="font-bebas text-[32px] leading-none"
                              style={{ color: stockPct > 70 ? '#e05c5c' : stockPct > 40 ? '#f5c842' : '#3ecf8e', letterSpacing: '0.02em' }}>
                              {stats.stockTotal - (stats.available ?? 0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between font-mono text-[7px] tracking-[0.22em] uppercase text-bone-3 mb-2">
                            <span>{stockPct}% vendido</span>
                            <span>{100 - stockPct}% disponible</span>
                          </div>
                          <div className="h-[3px] bg-[var(--line)] overflow-hidden rounded-full">
                            <div className="h-full transition-all duration-1000 rounded-full"
                              style={{ width: `${stockPct}%`, background: stockPct > 70 ? '#e05c5c' : stockPct > 40 ? '#f5c842' : '#3ecf8e' }} />
                          </div>
                        </div>
                      </div>

                      {/* Revenue + acciones */}
                      <div className="flex flex-col gap-3">
                        <div className="border border-[var(--line)] p-5 flex flex-col gap-1.5"
                          style={{ background: 'rgba(201,169,110,0.04)' }}>
                          <p className="font-mono text-[7.5px] tracking-[0.35em] uppercase text-bone-3">Ingresos</p>
                          <span className="font-bebas leading-none text-bone" style={{ fontSize: '30px', color: 'var(--gold)', letterSpacing: '0.02em' }}>
                            ${Math.round(stats.revenue).toLocaleString('es-CO')}
                          </span>
                          <span className="font-mono text-[7px] tracking-[0.24em] uppercase text-bone-3 opacity-50">COP · Drop #1</span>
                        </div>
                        <button onClick={() => navTo('pedidos')}
                          className="border border-[var(--line)] p-3.5 text-left group hover:border-[var(--line-strong)] transition-colors"
                          style={{ background: 'rgba(235,230,219,0.02)' }}>
                          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-bone-3 group-hover:text-bone transition-colors">
                            Ver pedidos →
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Últimas órdenes */}
                    <div>
                      <p className="font-mono text-[7.5px] tracking-[0.38em] uppercase text-bone-3 mb-3">
                        Últimas órdenes
                      </p>
                      <OrdersTable orders={orders.slice(0, 6)} onOpen={openOrder} compact />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── DROPS ────────────────────────────────────────────────────── */}
            {section === 'drops' && (
              <div className="flex flex-col gap-4 max-w-[600px]">
                <SectionHeader label="Drop #1 · Gestión en vivo">
                  <button onClick={loadProduct} disabled={productLoading}
                    className="btn-secondary">{productLoading ? 'Cargando...' : 'Actualizar'}</button>
                </SectionHeader>

                {productError && (
                  <div className="px-4 py-3 border font-mono text-[8.5px] tracking-[0.14em] leading-relaxed"
                    style={{ borderColor: 'rgba(224,92,92,0.25)', color: '#e05c5c', background: 'rgba(224,92,92,0.05)' }}>
                    {productError}
                  </div>
                )}

                {productLoading && !product ? (
                  <LoadingState label="Conectando con Shopify..." />
                ) : product ? (
                  <>
                    {/* Mensaje flash */}
                    {saveMsg && (
                      <div className="px-4 py-3 border font-mono text-[8.5px] tracking-[0.18em] flex items-center gap-2"
                        style={{ borderColor: 'rgba(62,207,142,0.25)', color: '#3ecf8e', background: 'rgba(62,207,142,0.06)' }}>
                        <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: '#3ecf8e' }} />
                        {saveMsg}
                      </div>
                    )}

                    {/* Status card */}
                    <Card>
                      <CardTitle>Estado del drop</CardTitle>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-[8px] h-[8px] rounded-full shrink-0"
                            style={{
                              background: product.status === 'ACTIVE' ? '#3ecf8e' : '#e05c5c',
                              boxShadow: product.status === 'ACTIVE' ? '0 0 10px rgba(62,207,142,0.5)' : '0 0 10px rgba(224,92,92,0.4)',
                              animation: product.status === 'ACTIVE' ? 'pulse 2s infinite' : 'none',
                            }} />
                          <div>
                            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-bone">
                              {product.status === 'ACTIVE' ? 'Drop activo' : 'Drop cerrado'}
                            </p>
                            <p className="font-mono text-[8px] tracking-[0.14em] text-bone-3 mt-0.5 opacity-60">
                              {product.status === 'ACTIVE' ? 'Visible · disponible para comprar' : 'Oculto · no disponible'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setConfirmToggle(true)} disabled={productSaving}
                          className="px-4 py-2 font-mono text-[8px] tracking-[0.26em] uppercase border transition-all disabled:opacity-30"
                          style={{
                            borderColor: product.status === 'ACTIVE' ? 'rgba(224,92,92,0.4)' : 'rgba(62,207,142,0.4)',
                            color: product.status === 'ACTIVE' ? '#e05c5c' : '#3ecf8e',
                            background: product.status === 'ACTIVE' ? 'rgba(224,92,92,0.06)' : 'rgba(62,207,142,0.06)',
                          }}>
                          {productSaving ? '...' : product.status === 'ACTIVE' ? 'Cerrar drop' : 'Abrir drop'}
                        </button>
                      </div>

                      {/* Lo que ve el usuario ahora */}
                      <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center gap-2.5">
                        <span className="font-mono text-[7px] tracking-[0.28em] uppercase text-bone-3 shrink-0">Web ahora:</span>
                        <span className="w-[5px] h-[5px] rounded-full shrink-0"
                          style={{ background: product.status === 'ACTIVE' ? '#3ecf8e' : '#f5c842' }} />
                        <span className="font-mono text-[8.5px] text-bone">
                          {product.status === 'ACTIVE'
                            ? 'Landing normal — botón comprar visible'
                            : 'Pantalla SOLD OUT — drop cerrado'}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[var(--line)] grid grid-cols-3 gap-3">
                        {[
                          { l: 'Producto',    v: product.productTitle },
                          { l: 'Inventario',  v: `${product.inventory} uds` },
                          { l: 'Moneda',      v: product.currencyCode },
                        ].map(r => (
                          <div key={r.l}>
                            <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-bone-3 mb-1">{r.l}</p>
                            <p className="font-mono text-[10px] text-bone truncate">{r.v}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Precio */}
                    <Card>
                      <CardTitle>Precio en Shopify</CardTitle>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="font-bebas leading-none text-bone"
                          style={{ fontSize: '42px', letterSpacing: '0.02em', color: 'var(--gold)' }}>
                          ${parseFloat(product.price).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="font-mono text-[9px] tracking-[0.28em] text-bone-3 uppercase">{product.currencyCode}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text" value={priceInput}
                          onChange={e => setPriceInput(e.target.value)}
                          placeholder="Ej: 210000"
                          className="flex-1 bg-transparent border border-[var(--line)] px-3 py-2.5 font-mono text-[11px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)] transition-colors"
                        />
                        <button
                          onClick={savePrice}
                          disabled={productSaving || priceInput === product.price}
                          className="px-5 py-2.5 font-mono text-[8px] tracking-[0.3em] uppercase text-[var(--ink)] transition-all disabled:opacity-30"
                          style={{ background: priceInput !== product.price ? 'var(--bone)' : 'rgba(235,230,219,0.2)', color: priceInput !== product.price ? 'var(--ink)' : 'var(--bone-3)' }}>
                          {productSaving ? '...' : 'Guardar'}
                        </button>
                      </div>
                      <p className="font-mono text-[7.5px] tracking-[0.14em] text-bone-3 opacity-40 mt-2">
                        Solo el número · sin puntos · ej: 210000 · se refleja en web al instante
                      </p>
                    </Card>
                  </>
                ) : !productError ? (
                  <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-bone-3 opacity-40 py-12 text-center">
                    Haz clic en "Actualizar" para cargar el drop desde Shopify
                  </p>
                ) : null}
              </div>
            )}

            {/* ── PEDIDOS ──────────────────────────────────────────────────── */}
            {section === 'pedidos' && (
              <div className="flex flex-col gap-4">
                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text" placeholder="Nombre, email, guía..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && load(1)}
                    className="flex-1 bg-transparent border border-[var(--line)] px-3 py-2 font-mono text-[10px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)] min-w-0"
                  />
                  <div className="flex gap-2">
                    <select value={financial} onChange={e => { setFinancial(e.target.value); load(1); }}
                      className="bg-[#0f0f0f] border border-[var(--line)] px-2 py-2 font-mono text-[9px] text-bone-3 outline-none focus:border-[var(--line-strong)]">
                      <option value="">Pago</option>
                      <option value="paid">Pagado</option>
                      <option value="pending">Pendiente</option>
                      <option value="refunded">Reembolso</option>
                    </select>
                    <select value={fulfillment} onChange={e => { setFulfillment(e.target.value); load(1); }}
                      className="bg-[#0f0f0f] border border-[var(--line)] px-2 py-2 font-mono text-[9px] text-bone-3 outline-none focus:border-[var(--line-strong)]">
                      <option value="">Estado</option>
                      <option value="unfulfilled">Sin despachar</option>
                      <option value="dispatched">Despachado</option>
                      <option value="delivered">Entregado</option>
                    </select>
                    <button onClick={() => load(1)} className="btn-secondary px-3">Buscar</button>
                  </div>
                </div>

                <OrdersTable orders={orders} onOpen={openOrder} />

                <div className="flex items-center justify-between font-mono text-[8.5px] tracking-[0.2em] uppercase text-bone-3">
                  <span>{total} órdenes</span>
                  <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); load(p); }} className="btn-secondary disabled:opacity-25">← Ant</button>
                    <button disabled={orders.length < 50} onClick={() => { const p = page + 1; setPage(p); load(p); }} className="btn-secondary disabled:opacity-25">Sig →</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── INVENTARIO ───────────────────────────────────────────────── */}
            {section === 'inventario' && (
              <div className="flex flex-col gap-4">
                <SectionHeader label="Stock · Drop #1" />
                {!stats ? <LoadingState label="Cargando..." /> : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Card>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-mono text-[7.5px] tracking-[0.35em] uppercase text-bone-3 mb-2">Disponibles</p>
                            <span className="font-bebas leading-none text-bone" style={{ fontSize: '64px', letterSpacing: '0.02em' }}>
                              {stats.available}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-[7.5px] tracking-[0.35em] uppercase text-bone-3 mb-2">Total</p>
                            <span className="font-bebas leading-none opacity-25" style={{ fontSize: '64px', letterSpacing: '0.02em' }}>
                              {stats.stockTotal}
                            </span>
                          </div>
                        </div>
                        <div className="h-[3px] bg-[var(--line)] overflow-hidden rounded-full mb-2">
                          <div className="h-full transition-all duration-1000 rounded-full"
                            style={{ width: `${stockPct}%`, background: stockPct > 70 ? '#e05c5c' : stockPct > 40 ? '#f5c842' : '#3ecf8e' }} />
                        </div>
                        <div className="flex justify-between font-mono text-[7px] tracking-[0.2em] uppercase text-bone-3">
                          <span>{stockPct}% vendido</span>
                          <span>{stats.stockTotal - (stats.available ?? 0)} uds vendidas</span>
                        </div>
                      </Card>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Vendidas',    value: stats.stockTotal - (stats.available ?? 0), color: '#3ecf8e' },
                          { label: 'Disponibles', value: stats.available,  color: 'var(--bone)' },
                          { label: 'Pagados',     value: stats.paid,       color: '#3ecf8e' },
                          { label: 'Pendientes',  value: stats.pending,    color: '#f5c842' },
                        ].map(m => (
                          <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} />
                        ))}
                      </div>
                    </div>
                    <p className="font-mono text-[7.5px] tracking-[0.2em] text-bone-3 opacity-30">
                      Datos al momento de carga · Shopify sincroniza automáticamente con cada compra
                    </p>
                  </>
                )}
              </div>
            )}

            {/* ── CLIENTES ─────────────────────────────────────────────────── */}
            {section === 'clientes' && (
              <div className="flex flex-col gap-4">
                <SectionHeader label={`Clientes · ${customers.length} registrados`}>
                  <input type="text" placeholder="Buscar..." value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    className="bg-transparent border border-[var(--line)] px-3 py-1.5 font-mono text-[9px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)] w-[180px]"
                  />
                </SectionHeader>

                {customersLoading ? <LoadingState label="Cargando clientes..." /> :
                  filteredCustomers.length === 0 ? (
                    <EmptyState label={customerSearch ? 'Sin resultados' : 'No hay clientes aún'} />
                  ) : (
                    <>
                      {/* Mobile cards */}
                      <div className="flex flex-col gap-2 sm:hidden">
                        {filteredCustomers.map(c => (
                          <Card key={c._id} compact>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-mono text-[11px] text-bone">{c.firstName} {c.lastName}</p>
                                <p className="font-mono text-[9px] text-bone-3 mt-0.5">{c.email}</p>
                                {c.phone && <p className="font-mono text-[9px] text-bone-3">{c.phone}</p>}
                                {c.city && <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-bone-3 mt-1 opacity-60">{c.city}</p>}
                              </div>
                              <div className="text-right">
                                <p className="font-mono text-[10px] text-bone">{c.totalOrders} {c.totalOrders === 1 ? 'orden' : 'órdenes'}</p>
                                <p className="font-mono text-[9px] text-bone-3">${c.totalSpent.toLocaleString('es-CO')}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto border border-[var(--line)]">
                        <table className="w-full admin-table border-collapse">
                          <thead>
                            <tr className="border-b border-[var(--line)]" style={{ background: 'rgba(235,230,219,0.025)' }}>
                              {['Nombre', 'Email', 'Teléfono', 'Ciudad', 'Órdenes', 'Total', 'Último pedido'].map(h => (
                                <th key={h} className="px-4 py-3 font-mono text-[7.5px] tracking-[0.28em] uppercase text-bone-3 text-left whitespace-nowrap">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCustomers.map(c => (
                              <tr key={c._id} className="border-b border-[var(--line)] hover:bg-[rgba(235,230,219,0.025)] transition-colors">
                                <td className="px-4 py-3 font-mono text-[10px] text-bone whitespace-nowrap">{c.firstName} {c.lastName}</td>
                                <td className="px-4 py-3 font-mono text-[9px] text-bone-3">{c.email}</td>
                                <td className="px-4 py-3 font-mono text-[9px] text-bone-3">{c.phone || <Dash/>}</td>
                                <td className="px-4 py-3 font-mono text-[9px] text-bone-3">{c.city || <Dash/>}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-bone text-center">{c.totalOrders}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-bone">${c.totalSpent.toLocaleString('es-CO')} COP</td>
                                <td className="px-4 py-3 font-mono text-[9px] text-bone-3">
                                  {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('es-CO') : <Dash/>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )
                }
              </div>
            )}

            {/* ── SHOPIFY ──────────────────────────────────────────────────── */}
            {section === 'shopify' && (
              <div className="flex flex-col gap-4 max-w-[640px]">
                <SectionHeader label="Shopify · Conexión en vivo">
                  <button onClick={loadShopifyLive} disabled={shopifyLoading} className="btn-secondary">
                    {shopifyLoading ? 'Actualizando...' : 'Sincronizar'}
                  </button>
                </SectionHeader>

                <Card>
                  <CardTitle>Estado de conexión · Admin API</CardTitle>
                  {shopifyLoading && !shopifyLive ? (
                    <LoadingState label="Consultando Shopify..." inline />
                  ) : shopifyLive ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-[8px] h-[8px] rounded-full shrink-0"
                          style={{
                            background: shopifyLive.connected ? '#3ecf8e' : '#e05c5c',
                            boxShadow: shopifyLive.connected ? '0 0 10px rgba(62,207,142,0.5)' : '0 0 10px rgba(224,92,92,0.4)',
                            animation: shopifyLive.connected ? 'pulse 2s infinite' : 'none',
                          }} />
                        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone flex-1">
                          {shopifyLive.connected ? 'Conectado a Shopify' : 'Sin conexión'}
                        </span>
                        <span className="font-mono text-[7.5px] text-bone-3 opacity-40">
                          {new Date(shopifyLive.timestamp).toLocaleTimeString('es-CO')}
                        </span>
                      </div>
                      {shopifyLive.connected && shopifyLive.stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          {[
                            { label: 'Órdenes',    value: shopifyLive.stats.total,      color: 'var(--bone)' },
                            { label: 'Pagadas',    value: shopifyLive.stats.paid,       color: '#3ecf8e' },
                            { label: 'Enviadas',   value: shopifyLive.stats.dispatched, color: '#63b3ed' },
                            { label: 'Inventario', value: shopifyLive.inventory ?? '—', color: shopifyLive.inventory !== null && shopifyLive.inventory < 10 ? '#e05c5c' : 'var(--bone)' },
                          ].map(m => (
                            <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} small />
                          ))}
                        </div>
                      )}
                      {shopifyLive.connected && shopifyLive.stats && (
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]">
                          <span className="font-mono text-[8px] tracking-[0.24em] uppercase text-bone-3">Ingresos totales</span>
                          <span className="font-bebas text-[22px] leading-none" style={{ color: 'var(--gold)', letterSpacing: '0.02em' }}>
                            ${Math.round(shopifyLive.stats.revenue).toLocaleString('es-CO')} {shopifyLive.stats.currency}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="font-mono text-[8.5px] tracking-[0.14em] text-bone-3 opacity-50">
                      Haz clic en "Sincronizar" para ver datos en vivo.
                    </p>
                  )}
                </Card>

                <Card>
                  <CardTitle>Webhook URL · Sincronización</CardTitle>
                  <div className="flex gap-2">
                    <code className="flex-1 min-w-0 bg-[rgba(235,230,219,0.04)] border border-[var(--line)] px-3 py-2 font-mono text-[9px] text-bone truncate">
                      {API}/api/shopify/webhook
                    </code>
                    <button onClick={() => navigator.clipboard.writeText(`${API}/api/shopify/webhook`)}
                      className="btn-secondary px-3 shrink-0">
                      Copiar
                    </button>
                  </div>
                  <p className="font-mono text-[7.5px] tracking-[0.14em] text-bone-3 mt-2 opacity-40">
                    En producción usa la URL pública del backend.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['orders/create','orders/paid','orders/updated','inventory_levels/update','fulfillments/create'].map(t => (
                      <span key={t} className="font-mono text-[7px] tracking-[0.12em] px-2 py-1 border border-[var(--line)] text-bone-3">{t}</span>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardTitle>Variables configuradas</CardTitle>
                  <div className="flex flex-col gap-0">
                    {[
                      { key: 'SHOPIFY_STORE_DOMAIN',  loc: 'frontend', desc: 'gzqyqr-0k.myshopify.com',  ok: true },
                      { key: 'SHOPIFY_ADMIN_TOKEN',    loc: 'frontend', desc: 'shpat_b37a... (activo)',    ok: true },
                      { key: 'SHOPIFY_VARIANT_ID',     loc: 'frontend', desc: '…/44148658929752',          ok: true },
                      { key: 'SHOPIFY_WEBHOOK_SECRET', loc: 'backend',  desc: 'Pendiente — webhooks',      ok: false },
                      { key: 'MONGODB_URI',            loc: 'backend',  desc: 'localhost:27017',            ok: true },
                    ].map(v => (
                      <div key={v.key} className="flex items-center gap-3 py-2.5 border-b border-[var(--line)]">
                        <span className="w-[5px] h-[5px] rounded-full shrink-0"
                          style={{ background: v.ok ? '#3ecf8e' : '#f5c842' }} />
                        <code className="font-mono text-[8.5px] text-bone flex-1">{v.key}</code>
                        <span className="font-mono text-[6.5px] tracking-[0.2em] uppercase px-1.5 py-0.5 border border-[var(--line)] shrink-0"
                          style={{ color: v.loc === 'frontend' ? 'rgba(63,160,255,0.7)' : 'rgba(62,207,142,0.7)' }}>
                          {v.loc}
                        </span>
                        <span className="font-mono text-[7.5px] text-bone-3 opacity-50 shrink-0 hidden sm:block">{v.desc}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ── CONFIG ───────────────────────────────────────────────────── */}
            {section === 'config' && (
              <div className="flex flex-col gap-4 max-w-[520px]">
                <SectionHeader label="Configuración" />

                <Card>
                  <CardTitle>Estado del backend</CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-[7px] h-[7px] rounded-full"
                        style={{
                          background: backendHealth === 'ok' ? '#3ecf8e' : backendHealth === 'error' ? '#e05c5c' : 'rgba(235,230,219,0.3)',
                          boxShadow: backendHealth === 'ok' ? '0 0 8px rgba(62,207,142,0.5)' : backendHealth === 'error' ? '0 0 8px rgba(224,92,92,0.4)' : 'none',
                          animation: backendHealth === 'ok' ? 'pulse 2s infinite' : 'none',
                        }} />
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone">
                        {backendHealth === 'ok' ? 'Online' : backendHealth === 'error' ? 'Offline' : 'Verificando...'}
                      </span>
                    </div>
                    <button onClick={checkHealth} className="btn-secondary">Reintentar</button>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--line)]">
                    <span className="font-mono text-[8px] tracking-[0.24em] uppercase text-bone-3">API URL</span>
                    <code className="font-mono text-[9px] text-bone-2">{API}</code>
                  </div>
                </Card>

                <Card>
                  <CardTitle>Producto · Drop #1</CardTitle>
                  <div className="flex flex-col gap-0">
                    {[
                      { label: 'Nombre',      value: 'Gorra Drop #1 — Cuscus Hats' },
                      { label: 'Precio',      value: '$210.000 COP' },
                      { label: 'Stock total', value: '100 unidades' },
                      { label: 'Product ID',  value: '8788136034392' },
                      { label: 'Variant ID',  value: '44148658929752' },
                      { label: 'Lanzamiento', value: '2026 · Colombia' },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center py-2.5 border-b border-[var(--line)]">
                        <span className="font-mono text-[8px] tracking-[0.24em] uppercase text-bone-3">{r.label}</span>
                        <span className="font-mono text-[9px] text-bone">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardTitle>Accesos rápidos</CardTitle>
                  <div className="flex flex-col gap-0">
                    {[
                      { label: 'Landing page',     href: '/',         ext: false },
                      { label: 'Shopify Admin',    href: 'https://admin.shopify.com/store/gzqyqr-0k', ext: true },
                      { label: 'Shopify Producto', href: 'https://admin.shopify.com/store/gzqyqr-0k/products/8788136034392', ext: true },
                      { label: 'API Health',       href: `${API}/api/health`, ext: true },
                    ].map(l => (
                      <a key={l.label} href={l.href}
                        target={l.ext ? '_blank' : undefined}
                        rel={l.ext ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-between py-2.5 border-b border-[var(--line)] group">
                        <span className="font-mono text-[9px] tracking-[0.18em] text-bone-3 group-hover:text-bone transition-colors">{l.label}</span>
                        <span className="text-bone-3 group-hover:text-bone transition-colors opacity-40">→</span>
                      </a>
                    ))}
                  </div>
                </Card>
              </div>
            )}

          </div>
        </main>

        {/* ══ BOTTOM NAV — solo móvil ════════════════════════════════════════ */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--line)] backdrop-blur-md"
          style={{ background: 'rgba(10,10,10,0.96)' }}>
          <div className="flex">
            {NAV.slice(0, 5).map(item => {
              const active = section === item.id;
              return (
                <button key={item.id} onClick={() => navTo(item.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors relative"
                  style={{ color: active ? 'var(--bone)' : 'var(--bone-3)' }}>
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-bone rounded-b-full" />
                  )}
                  {ICONS[item.id]}
                  <span className="font-mono text-[5.5px] tracking-[0.25em] uppercase">{item.label}</span>
                  {item.live && (
                    <span className="absolute top-2 right-[calc(50%-8px)] w-[4px] h-[4px] rounded-full"
                      style={{ background: 'var(--green)' }} />
                  )}
                </button>
              );
            })}
            <button onClick={() => setSideOpen(true)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors"
              style={{ color: 'var(--bone-3)' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="1" fill="currentColor"/>
                <circle cx="3" cy="7" r="1" fill="currentColor"/>
                <circle cx="11" cy="7" r="1" fill="currentColor"/>
              </svg>
              <span className="font-mono text-[5.5px] tracking-[0.25em] uppercase">Más</span>
            </button>
          </div>
        </nav>
      </div>

      {/* ══ MODAL CONFIRMACIÓN TOGGLE ═════════════════════════════════════════ */}
      {confirmToggle && product && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
          onClick={() => setConfirmToggle(false)}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          <div className="relative z-10 border border-[var(--line)] p-6 w-full max-w-[360px] mx-4 flex flex-col gap-4"
            style={{ background: '#0e0e0e' }}
            onClick={e => e.stopPropagation()}>
            <div>
              <p className="font-mono text-[7px] tracking-[0.4em] uppercase text-bone-3 mb-1.5">Confirmar acción</p>
              <h3 className="font-bebas text-[28px] text-bone" style={{ letterSpacing: '0.04em' }}>
                {product.status === 'ACTIVE' ? 'Cerrar el drop' : 'Abrir el drop'}
              </h3>
            </div>
            <p className="font-mono text-[9px] tracking-[0.14em] leading-relaxed text-bone-3">
              {product.status === 'ACTIVE'
                ? 'Los usuarios verán la pantalla SOLD OUT. El producto quedará en DRAFT en Shopify y no se podrá comprar.'
                : 'El drop volverá a estar disponible. La web mostrará la landing normal con el botón de compra.'}
            </p>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setConfirmToggle(false)}
                className="flex-1 btn-secondary py-2.5">
                Cancelar
              </button>
              <button
                onClick={() => { setConfirmToggle(false); executeToggle(); }}
                className="flex-1 py-2.5 font-mono text-[8px] tracking-[0.3em] uppercase transition-all"
                style={{
                  background: product.status === 'ACTIVE' ? '#e05c5c' : '#3ecf8e',
                  color: product.status === 'ACTIVE' ? '#fff' : '#000',
                }}>
                {product.status === 'ACTIVE' ? 'Cerrar drop' : 'Abrir drop'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DRAWER DE ORDEN ════════════════════════════════════════════════════ */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-end"
          onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full sm:w-[480px] sm:h-full max-h-[90vh] sm:max-h-none
                       border-t sm:border-t-0 sm:border-l border-[var(--line)]
                       overflow-y-auto flex flex-col gap-5 rounded-t-[4px] sm:rounded-none"
            style={{ background: '#0e0e0e' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle móvil */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-8 h-[2px] rounded-full bg-[var(--line-strong)]" />
            </div>

            <div className="px-5 sm:px-6 pb-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pt-2 pb-4 border-b border-[var(--line)]">
                <div>
                  <p className="font-mono text-[7px] tracking-[0.5em] uppercase mb-1" style={{ color: 'rgba(235,230,219,0.3)' }}>
                    {new Date(selected.shopifyCreatedAt || selected.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="font-bebas text-[36px] text-bone leading-none" style={{ letterSpacing: '0.03em' }}>
                    #{selected.shopifyOrderNumber}
                  </p>
                  <p className="font-mono text-[9px] text-bone-3 mt-1">
                    {selected.customer.firstName} {selected.customer.lastName}
                  </p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 flex items-center justify-center border border-[var(--line)] text-bone-3 hover:text-bone hover:border-[var(--line-strong)] transition-all duration-150 shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Badges de estado */}
              <div className="flex gap-2 mb-5">
                <span className={`badge ${FIN_CLS[selected.financialStatus]}`}>{FIN_LABEL[selected.financialStatus]}</span>
                <span className={`badge ${FUL_CLS[selected.fulfillmentStatus]}`}>{FUL_LABEL[selected.fulfillmentStatus]}</span>
              </div>

              {/* Cliente */}
              <DrawerSection title="Cliente">
                <div className="grid grid-cols-2 gap-3">
                  <DrawerField label="Nombre">{selected.customer.firstName} {selected.customer.lastName}</DrawerField>
                  <DrawerField label="Teléfono">{selected.customer.phone || '—'}</DrawerField>
                  <div className="col-span-2">
                    <DrawerField label="Email">{selected.customer.email}</DrawerField>
                  </div>
                </div>
              </DrawerSection>

              {/* Dirección */}
              <DrawerSection title="Dirección">
                <div className="font-mono text-[10px] text-bone flex flex-col gap-0.5 mb-3">
                  <p>{selected.shippingAddress?.address1} {selected.shippingAddress?.address2}</p>
                  <p className="text-bone-2">{selected.shippingAddress?.city}, {selected.shippingAddress?.province}</p>
                  <p className="text-bone-3">{selected.shippingAddress?.country} {selected.shippingAddress?.zip}</p>
                </div>
                <button
                  className="btn-secondary text-[7.5px] tracking-[0.25em]"
                  onClick={() => navigator.clipboard.writeText(
                    `${selected.customer.firstName} ${selected.customer.lastName}\n${selected.shippingAddress?.address1}${selected.shippingAddress?.address2 ? ' ' + selected.shippingAddress.address2 : ''}\n${selected.shippingAddress?.city}, ${selected.shippingAddress?.province}\n${selected.customer.phone}`
                  )}>
                  Copiar dirección
                </button>
              </DrawerSection>

              {/* Producto */}
              <DrawerSection title="Producto">
                {selected.lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between font-mono text-[10px]">
                    <span className="text-bone">{item.title} × {item.quantity}</span>
                    <span className="text-bone-2">${parseFloat(item.price).toLocaleString('es-CO')}</span>
                  </div>
                ))}
                <div className="stitch-divider my-3" />
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-bone-3">Total</span>
                  <span className="text-bone font-medium">${parseFloat(selected.totalPrice || '0').toLocaleString('es-CO')} {selected.currency}</span>
                </div>
              </DrawerSection>

              {/* Actualizar */}
              <DrawerSection title="Actualizar despacho">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-bone-3">Estado</label>
                    <select value={patch.fulfillmentStatus}
                      onChange={e => setPatch(p => ({ ...p, fulfillmentStatus: e.target.value }))}
                      className="bg-[#0e0e0e] border border-[var(--line)] px-3 py-2.5 font-mono text-[10px] text-bone outline-none focus:border-[var(--line-strong)]">
                      <option value="unfulfilled">Sin despachar</option>
                      <option value="in_transit">En tránsito</option>
                      <option value="dispatched">Despachado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  {[
                    { key: 'trackingCompany', label: 'Transportadora', ph: 'Servientrega, Coordinadora...' },
                    { key: 'trackingNumber',  label: 'Guía',           ph: '1234567890' },
                    { key: 'trackingUrl',     label: 'URL rastreo',    ph: 'https://...' },
                  ].map(f => (
                    <div key={f.key} className="flex flex-col gap-1">
                      <label className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-bone-3">{f.label}</label>
                      <input value={patch[f.key] || ''} onChange={e => setPatch(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.ph}
                        className="bg-transparent border border-[var(--line)] px-3 py-2.5 font-mono text-[10px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)] transition-colors"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-bone-3">Notas internas</label>
                    <textarea rows={2} placeholder="Notas..."
                      value={patch.adminNotes || ''}
                      onChange={e => setPatch(p => ({ ...p, adminNotes: e.target.value }))}
                      className="bg-transparent border border-[var(--line)] px-3 py-2.5 font-mono text-[10px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)] resize-none transition-colors"
                    />
                  </div>
                  <button onClick={save} disabled={saving}
                    className="py-3.5 font-mono text-[9px] tracking-[0.45em] uppercase transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ background: saving ? 'rgba(235,230,219,0.5)' : 'var(--bone)', color: 'var(--ink)' }}>
                    {saving ? (
                      <>
                        <span className="w-[4px] h-[4px] rounded-full animate-pulse" style={{ background: 'var(--ink)' }} />
                        Guardando...
                      </>
                    ) : 'Guardar cambios'}
                  </button>
                </div>
              </DrawerSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────────────── */

function MetricCard({ label, value, color, sub, small }: { label: string; value: string | number; color: string; sub?: string; small?: boolean }) {
  return (
    <div className="border border-[var(--line)] p-4 flex flex-col gap-1.5 transition-all duration-200 hover:border-[var(--line-strong)] hover:bg-[rgba(235,230,219,0.04)] group relative overflow-hidden"
      style={{ background: 'rgba(235,230,219,0.02)', borderTop: `2px solid ${color}30` }}>
      <div className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300"
        style={{ background: `linear-gradient(90deg, ${color}60, transparent)`, opacity: 0 }} />
      <span className="font-mono text-[7px] tracking-[0.32em] uppercase text-bone-3 group-hover:text-bone-2 transition-colors">{label}</span>
      <span className="font-bebas leading-none" style={{ fontSize: small ? '24px' : '36px', color, letterSpacing: '0.02em' }}>
        {value}
      </span>
      {sub && <span className="font-mono text-[6.5px] tracking-[0.2em] uppercase text-bone-3 opacity-40">{sub}</span>}
    </div>
  );
}

function Card({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={`border border-[var(--line)] flex flex-col gap-3 ${compact ? 'p-3.5' : 'p-4 sm:p-5'} hover:border-[rgba(235,230,219,0.12)] transition-colors duration-200`}
      style={{ background: 'rgba(235,230,219,0.025)' }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[7px] tracking-[0.45em] uppercase pb-3 border-b border-[var(--line)] flex items-center gap-2"
      style={{ color: 'rgba(235,230,219,0.35)' }}>
      <span className="w-[3px] h-[3px] rounded-full shrink-0" style={{ background: 'rgba(235,230,219,0.25)' }} />
      {children}
    </h3>
  );
}

function SectionHeader({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--line)] mb-1">
      <h2 className="font-bebas text-[20px] text-bone tracking-[0.06em] leading-none">{label}</h2>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 pb-2.5 border-b border-[var(--line)] mb-3">
        <span className="w-[3px] h-[3px] rounded-full shrink-0" style={{ background: 'rgba(235,230,219,0.2)' }} />
        <h4 className="font-mono text-[7px] tracking-[0.4em] uppercase" style={{ color: 'rgba(235,230,219,0.35)' }}>
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

function DrawerField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-mono text-[7px] tracking-[0.28em] uppercase text-bone-3 block mb-0.5">{label}</span>
      <p className="font-mono text-[10px] text-bone">{children}</p>
    </div>
  );
}

function LoadingState({ label, inline }: { label: string; inline?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${inline ? '' : 'py-14 justify-center'}`}>
      <div className="flex gap-[4px]">
        {[0,1,2].map(i => (
          <span key={i} className="w-[4px] h-[4px] rounded-full"
            style={{ background: 'var(--gold)', opacity: 0.4, animation: `pulse 1.2s ease-in-out ${i * 0.25}s infinite` }} />
        ))}
      </div>
      <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-bone-3 opacity-40">{label}</span>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 border border-[var(--line)]"
      style={{ background: 'rgba(235,230,219,0.01)' }}>
      <div className="w-12 h-12 border border-[var(--line)] flex items-center justify-center opacity-20">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1" className="text-bone-3"/>
          <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-bone-3"/>
        </svg>
      </div>
      <span className="font-mono text-[8px] tracking-[0.45em] uppercase text-bone-3 opacity-30">{label}</span>
    </div>
  );
}

function Dash() {
  return <span className="opacity-20">—</span>;
}

function OrdersTable({ orders, onOpen, compact = false }: { orders: Order[]; onOpen: (o: Order) => void; compact?: boolean }) {
  if (orders.length === 0) return <EmptyState label="No hay órdenes" />;

  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {orders.map(o => (
          <div key={o._id} onClick={() => onOpen(o)}
            className="border border-[var(--line)] p-4 flex flex-col gap-3 cursor-pointer active:bg-[rgba(235,230,219,0.03)]"
            style={{ background: 'rgba(235,230,219,0.02)' }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[8px] text-bone-3">#{o.shopifyOrderNumber}</p>
                <p className="font-mono text-[12px] text-bone mt-0.5">{o.customer.firstName} {o.customer.lastName}</p>
                <p className="font-mono text-[9px] text-bone-3 mt-0.5">{o.shippingAddress?.city}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`badge ${FIN_CLS[o.financialStatus]}`}>{FIN_LABEL[o.financialStatus]}</span>
                <span className={`badge ${FUL_CLS[o.fulfillmentStatus]}`}>{FUL_LABEL[o.fulfillmentStatus]}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-[var(--line)] pt-2">
              <span className="font-mono text-[8.5px] text-bone-3">{o.customer.phone}</span>
              <span className="font-mono text-[10px] text-bone">${parseFloat(o.totalPrice || '0').toLocaleString('es-CO')} {o.currency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto border border-[var(--line)]">
        <table className="w-full admin-table border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)]" style={{ background: 'rgba(235,230,219,0.04)' }}>
              {(compact
                ? ['#', 'Cliente', 'Ciudad', 'Pago', 'Despacho', 'Total']
                : ['#', 'Cliente', 'Contacto', 'Ciudad', 'Pago', 'Despacho', 'Guía', 'Total', 'Fecha', '']
              ).map(h => (
                <th key={h} className="px-4 py-3.5 font-mono text-[7px] tracking-[0.35em] uppercase whitespace-nowrap text-left"
                  style={{ color: 'rgba(235,230,219,0.35)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={o._id} onClick={() => onOpen(o)}
                className="border-b border-[var(--line)] cursor-pointer transition-all duration-150 group"
                style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(235,230,219,0.01)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(235,230,219,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(235,230,219,0.01)')}>
                <td className="px-4 py-3.5 font-mono text-[9px] text-bone-3 whitespace-nowrap">
                  <span style={{ color: 'rgba(235,230,219,0.25)' }}>#</span>{o.shopifyOrderNumber}
                </td>
                <td className="px-4 py-3.5 font-mono text-[10px] text-bone whitespace-nowrap font-medium">{o.customer.firstName} {o.customer.lastName}</td>
                {!compact && (
                  <td className="px-4 py-3.5 font-mono text-[9px] whitespace-nowrap">
                    <div style={{ color: 'rgba(235,230,219,0.6)' }}>{o.customer.email}</div>
                    <div style={{ color: 'rgba(235,230,219,0.35)' }}>{o.customer.phone}</div>
                  </td>
                )}
                <td className="px-4 py-3.5 font-mono text-[9px] text-bone-3 whitespace-nowrap">{o.shippingAddress?.city}</td>
                <td className="px-4 py-3.5"><span className={`badge ${FIN_CLS[o.financialStatus]}`}>{FIN_LABEL[o.financialStatus]}</span></td>
                <td className="px-4 py-3.5"><span className={`badge ${FUL_CLS[o.fulfillmentStatus]}`}>{FUL_LABEL[o.fulfillmentStatus]}</span></td>
                {!compact && <td className="px-4 py-3.5 font-mono text-[9px] text-bone-3">{o.trackingNumber || <Dash/>}</td>}
                <td className="px-4 py-3.5 font-mono text-[10px] text-bone whitespace-nowrap">${parseFloat(o.totalPrice || '0').toLocaleString('es-CO')} <span style={{ color: 'rgba(235,230,219,0.3)' }}>{o.currency}</span></td>
                {!compact && <td className="px-4 py-3.5 font-mono text-[9px] text-bone-3 whitespace-nowrap">{new Date(o.shopifyCreatedAt || o.createdAt).toLocaleDateString('es-CO')}</td>}
                {!compact && <td className="px-4 py-3.5 font-mono text-[11px] opacity-20 group-hover:opacity-60 transition-opacity">→</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
