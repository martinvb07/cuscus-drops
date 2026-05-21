'use client';

import { useState, useEffect, useCallback } from 'react';

const API  = process.env.NEXT_PUBLIC_API_URL      || 'http://localhost:4001';
const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

type FinancialStatus   = 'pending' | 'authorized' | 'paid' | 'partially_refunded' | 'refunded' | 'voided';
type FulfillmentStatus = 'unfulfilled' | 'in_transit' | 'dispatched' | 'delivered' | 'cancelled';

interface Order {
  _id:               string;
  shopifyOrderNumber: number;
  customer:          { firstName: string; lastName: string; email: string; phone: string };
  shippingAddress:   { firstName?: string; lastName?: string; address1: string; address2?: string; city: string; province: string; country: string; zip: string };
  lineItems:         { title: string; quantity: number; price: string }[];
  totalPrice:        string;
  currency:          string;
  financialStatus:   FinancialStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?:   string;
  trackingCompany?:  string;
  trackingUrl?:      string;
  adminNotes?:       string;
  shopifyCreatedAt:  string;
  createdAt:         string;
}

interface Stats {
  total: number; paid: number; pending: number;
  dispatched: number; delivered: number;
  available: number; stockTotal: number; revenue: number;
}

const FIN_LABEL: Record<FinancialStatus, string>  = { pending: 'Pendiente', authorized: 'Autorizado', paid: 'Pagado', partially_refunded: 'Parcial', refunded: 'Reembolso', voided: 'Anulado' };
const FUL_LABEL: Record<FulfillmentStatus, string> = { unfulfilled: 'Sin despachar', in_transit: 'En tránsito', dispatched: 'Despachado', delivered: 'Entregado', cancelled: 'Cancelado' };
const FIN_CLS: Record<FinancialStatus, string>    = { pending: 'badge-pending', authorized: 'badge-pending', paid: 'badge-paid', partially_refunded: 'badge-refunded', refunded: 'badge-refunded', voided: 'badge-refunded' };
const FUL_CLS: Record<FulfillmentStatus, string>  = { unfulfilled: 'badge-unfulfilled', in_transit: 'badge-in_transit', dispatched: 'badge-dispatched', delivered: 'badge-delivered', cancelled: 'badge-refunded' };

function hdrs() { return { 'Content-Type': 'application/json', 'x-admin-token': PASS }; }

function openOrder(o: Order, setSelected: (o: Order) => void, setPatch: (p: Record<string, string>) => void) {
  setSelected(o);
  setPatch({ fulfillmentStatus: o.fulfillmentStatus, trackingNumber: o.trackingNumber || '', trackingCompany: o.trackingCompany || '', trackingUrl: o.trackingUrl || '', adminNotes: o.adminNotes || '' });
}

export default function AdminPage() {
  const [authed,      setAuthed]      = useState(false);
  const [password,    setPassword]    = useState('');
  const [stats,       setStats]       = useState<Stats | null>(null);
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState('');
  const [financial,   setFinancial]   = useState('');
  const [fulfillment, setFulfillment] = useState('');
  const [selected,    setSelected]    = useState<Order | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [patch,       setPatch]       = useState<Record<string, string>>({ fulfillmentStatus: '', trackingNumber: '', trackingCompany: '', trackingUrl: '', adminNotes: '' });

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
    setOrders(d.orders);
    setTotal(d.total);
  }, [page, search, financial, fulfillment]);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  function login() {
    if (password === PASS) setAuthed(true);
    else alert('Contraseña incorrecta');
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    const body: Record<string, string> = {};
    Object.entries(patch).forEach(([k, v]) => { if (v !== undefined) body[k] = v; });
    await fetch(`${API}/api/orders/${selected._id}`, { method: 'PATCH', headers: hdrs(), body: JSON.stringify(body) });
    setSaving(false);
    setSelected(null);
    load();
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="flex flex-col gap-5 w-full max-w-[320px]">
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bone-3 mb-2">Cuscus Hats</p>
            <h1 className="font-gothic text-3xl uppercase text-bone">Admin</h1>
          </div>
          <input
            type="password" placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="bg-transparent border border-[var(--line)] px-4 py-3 font-mono text-[12px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)]"
          />
          <button onClick={login} className="bg-bone text-ink py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-bone-2 transition-colors">
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-10 px-3 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-6 max-w-[1200px] mx-auto">
        <div>
          <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-bone-3">Panel de administración</p>
          <h1 className="font-gothic text-xl sm:text-2xl uppercase text-bone">Pedidos — Drop #1</h1>
        </div>
        <a
          href={`${API}/api/orders/export.csv`}
          download
          className="border border-[var(--line)] px-3 py-2 font-mono text-[10px] tracking-[0.22em] uppercase text-bone-3 hover:text-bone hover:border-[var(--line-strong)] transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          ↓ CSV
        </a>
      </div>

      {/* Stats — 2 cols móvil, 4 tablet, 7 desktop */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-6 max-w-[1200px] mx-auto">
          {[
            { label: 'Total',      value: stats.total },
            { label: 'Pagadas',    value: stats.paid,       color: '#3ecf8e' },
            { label: 'Pendientes', value: stats.pending,    color: '#f5c842' },
            { label: 'Despachadas',value: stats.dispatched, color: '#63b3ed' },
            { label: 'Entregadas', value: stats.delivered,  color: '#3ecf8e' },
            { label: 'Stock',      value: `${stats.available}/${stats.stockTotal}` },
            { label: 'Ingresos',   value: `$${Math.round(stats.revenue).toLocaleString('es-CO')}` },
          ].map(s => (
            <div key={s.label} className="border border-[var(--line)] p-3 sm:p-4 flex flex-col gap-1">
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] uppercase text-bone-3">{s.label}</span>
              <span className="font-gothic text-xl sm:text-2xl leading-none" style={{ color: s.color || 'var(--bone)' }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Filtros — stack en móvil */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 max-w-[1200px] mx-auto">
        <input
          type="text" placeholder="Buscar nombre, email, guía..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(1)}
          className="w-full sm:flex-1 bg-transparent border border-[var(--line)] px-3 py-2 font-mono text-[11px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)]"
        />
        <div className="flex gap-2">
          <select value={financial} onChange={e => { setFinancial(e.target.value); load(1); }}
            className="flex-1 bg-[#0f0f0f] border border-[var(--line)] px-2 py-2 font-mono text-[11px] text-bone-3 outline-none">
            <option value="">Todo pago</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pendientes</option>
            <option value="refunded">Reembolsos</option>
          </select>
          <select value={fulfillment} onChange={e => { setFulfillment(e.target.value); load(1); }}
            className="flex-1 bg-[#0f0f0f] border border-[var(--line)] px-2 py-2 font-mono text-[11px] text-bone-3 outline-none">
            <option value="">Todo estado</option>
            <option value="unfulfilled">Sin despachar</option>
            <option value="dispatched">Despachados</option>
            <option value="delivered">Entregados</option>
          </select>
          <button onClick={() => load(1)} className="border border-[var(--line)] px-3 py-2 font-mono text-[10px] uppercase text-bone-3 hover:text-bone transition-colors whitespace-nowrap">
            Buscar
          </button>
        </div>
      </div>

      {/* ── MOBILE: Cards ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 max-w-[1200px] mx-auto lg:hidden">
        {orders.length === 0 && (
          <p className="text-center font-mono text-[11px] text-bone-3 py-10">No hay órdenes</p>
        )}
        {orders.map(o => (
          <div
            key={o._id}
            className="border border-[var(--line)] p-4 flex flex-col gap-3 cursor-pointer active:bg-[rgba(235,230,219,0.04)]"
            onClick={() => openOrder(o, setSelected, setPatch)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] text-bone-3">#{o.shopifyOrderNumber}</p>
                <p className="font-mono text-[13px] text-bone">{o.customer.firstName} {o.customer.lastName}</p>
                <p className="font-mono text-[10px] text-bone-3 mt-0.5">{o.shippingAddress?.city}, {o.shippingAddress?.province}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`badge ${FIN_CLS[o.financialStatus]}`}>{FIN_LABEL[o.financialStatus]}</span>
                <span className={`badge ${FUL_CLS[o.fulfillmentStatus]}`}>{FUL_LABEL[o.fulfillmentStatus]}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line)] pt-2">
              <span className="font-mono text-[10px] text-bone-3">{o.customer.phone}</span>
              <span className="font-mono text-[11px] text-bone">
                ${parseFloat(o.totalPrice || '0').toLocaleString('es-CO')} {o.currency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP: Tabla ───────────────────────────────────────────────────── */}
      <div className="hidden lg:block overflow-x-auto max-w-[1200px] mx-auto border border-[var(--line)]">
        <table className="w-full admin-table border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[rgba(235,230,219,0.04)]">
              {['#', 'Cliente', 'Contacto', 'Ciudad', 'Pago', 'Despacho', 'Guía', 'Total', 'Fecha', ''].map(h => (
                <th key={h} className="px-4 py-3 font-mono text-[9px] tracking-[0.25em] uppercase text-bone-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-8 text-center font-mono text-[11px] text-bone-3">No hay órdenes</td></tr>
            )}
            {orders.map(o => (
              <tr
                key={o._id}
                className="border-b border-[var(--line)] cursor-pointer transition-colors"
                onClick={() => openOrder(o, setSelected, setPatch)}
              >
                <td className="px-4 py-3 font-mono text-[11px] text-bone whitespace-nowrap">#{o.shopifyOrderNumber}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-bone whitespace-nowrap">{o.customer.firstName} {o.customer.lastName}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-bone-3 whitespace-nowrap">
                  <div>{o.customer.email}</div><div>{o.customer.phone}</div>
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-bone-3 whitespace-nowrap">{o.shippingAddress?.city}, {o.shippingAddress?.province}</td>
                <td className="px-4 py-3 whitespace-nowrap"><span className={`badge ${FIN_CLS[o.financialStatus]}`}>{FIN_LABEL[o.financialStatus]}</span></td>
                <td className="px-4 py-3 whitespace-nowrap"><span className={`badge ${FUL_CLS[o.fulfillmentStatus]}`}>{FUL_LABEL[o.fulfillmentStatus]}</span></td>
                <td className="px-4 py-3 font-mono text-[10px] text-bone-3 whitespace-nowrap">{o.trackingNumber || <span className="opacity-30">—</span>}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-bone whitespace-nowrap">${parseFloat(o.totalPrice || '0').toLocaleString('es-CO')} {o.currency}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-bone-3 whitespace-nowrap">{new Date(o.shopifyCreatedAt || o.createdAt).toLocaleDateString('es-CO')}</td>
                <td className="px-4 py-3 text-bone-3 text-xs">→</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4 max-w-[1200px] mx-auto font-mono text-[10px] tracking-[0.2em] uppercase text-bone-3">
        <span>{total} órdenes</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); load(p); }}
            className="border border-[var(--line)] px-3 py-1 disabled:opacity-30 hover:text-bone hover:border-[var(--line-strong)] transition-colors">← Ant</button>
          <button disabled={orders.length < 50} onClick={() => { const p = page + 1; setPage(p); load(p); }}
            className="border border-[var(--line)] px-3 py-1 disabled:opacity-30 hover:text-bone hover:border-[var(--line-strong)] transition-colors">Sig →</button>
        </div>
      </div>

      {/* ── Modal / Drawer — full-screen en móvil, panel lateral en desktop ─── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative z-10 w-full sm:w-[560px] sm:h-full max-h-[92vh] sm:max-h-none bg-[#0d0d0d] border-t sm:border-t-0 sm:border-l border-[var(--line)] overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 rounded-t-xl sm:rounded-none"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle móvil */}
            <div className="flex justify-center sm:hidden mb-1">
              <div className="w-10 h-1 bg-[var(--line-strong)] rounded-full" />
            </div>

            {/* Header modal */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-bone-3">Orden</p>
                <h2 className="font-gothic text-2xl text-bone">#{selected.shopifyOrderNumber}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-bone-3 hover:text-bone text-2xl leading-none p-1">×</button>
            </div>

            {/* Cliente */}
            <section className="flex flex-col gap-3 border border-[var(--line)] p-4">
              <h3 className="font-mono text-[9px] tracking-[0.35em] uppercase text-bone-3">Cliente</h3>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div><span className="text-bone-3 block text-[9px]">Nombre</span><p className="text-bone">{selected.customer.firstName} {selected.customer.lastName}</p></div>
                <div><span className="text-bone-3 block text-[9px]">Teléfono</span><p className="text-bone">{selected.customer.phone || '—'}</p></div>
                <div className="col-span-2"><span className="text-bone-3 block text-[9px]">Email</span><p className="text-bone break-all">{selected.customer.email}</p></div>
              </div>
            </section>

            {/* Dirección */}
            <section className="flex flex-col gap-3 border border-[var(--line)] p-4">
              <h3 className="font-mono text-[9px] tracking-[0.35em] uppercase text-bone-3">Dirección de envío</h3>
              <div className="font-mono text-[11px] text-bone flex flex-col gap-1">
                <p>{selected.shippingAddress?.address1} {selected.shippingAddress?.address2}</p>
                <p>{selected.shippingAddress?.city}, {selected.shippingAddress?.province}</p>
                <p>{selected.shippingAddress?.country} {selected.shippingAddress?.zip}</p>
              </div>
              <button
                className="font-mono text-[9px] tracking-[0.25em] uppercase text-bone-3 hover:text-bone border border-[var(--line)] px-3 py-1.5 self-start transition-colors"
                onClick={() => navigator.clipboard.writeText(
                  `${selected.customer.firstName} ${selected.customer.lastName}\n${selected.shippingAddress?.address1} ${selected.shippingAddress?.address2 || ''}\n${selected.shippingAddress?.city}, ${selected.shippingAddress?.province}\n${selected.customer.phone}`
                )}
              >
                Copiar datos
              </button>
            </section>

            {/* Producto */}
            <section className="flex flex-col gap-3 border border-[var(--line)] p-4">
              <h3 className="font-mono text-[9px] tracking-[0.35em] uppercase text-bone-3">Producto</h3>
              {selected.lineItems.map((item, i) => (
                <div key={i} className="flex justify-between font-mono text-[11px]">
                  <span className="text-bone">{item.title} × {item.quantity}</span>
                  <span className="text-bone-2">${parseFloat(item.price).toLocaleString('es-CO')}</span>
                </div>
              ))}
              <div className="border-t border-[var(--line)] pt-2 flex justify-between font-mono text-[12px]">
                <span className="text-bone-3">Total</span>
                <span className="text-bone">${parseFloat(selected.totalPrice || '0').toLocaleString('es-CO')} {selected.currency}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${FIN_CLS[selected.financialStatus]}`}>{FIN_LABEL[selected.financialStatus]}</span>
                <span className={`badge ${FUL_CLS[selected.fulfillmentStatus]}`}>{FUL_LABEL[selected.fulfillmentStatus]}</span>
              </div>
            </section>

            {/* Actualizar estado */}
            <section className="flex flex-col gap-4 border border-[var(--line)] p-4">
              <h3 className="font-mono text-[9px] tracking-[0.35em] uppercase text-bone-3">Actualizar despacho</h3>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] tracking-[0.25em] uppercase text-bone-3">Estado</label>
                <select
                  value={patch.fulfillmentStatus}
                  onChange={e => setPatch(p => ({ ...p, fulfillmentStatus: e.target.value }))}
                  className="bg-[#0a0a0a] border border-[var(--line)] px-3 py-2.5 font-mono text-[11px] text-bone outline-none"
                >
                  <option value="unfulfilled">Sin despachar</option>
                  <option value="in_transit">En tránsito</option>
                  <option value="dispatched">Despachado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {[
                { key: 'trackingCompany', label: 'Transportadora',    ph: 'Servientrega, Coordinadora...' },
                { key: 'trackingNumber',  label: 'Número de guía',    ph: 'Ej: 1234567890' },
                { key: 'trackingUrl',     label: 'URL de rastreo',    ph: 'https://...' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] tracking-[0.25em] uppercase text-bone-3">{f.label}</label>
                  <input
                    type="text" placeholder={f.ph}
                    value={patch[f.key] || ''}
                    onChange={e => setPatch(p => ({ ...p, [f.key]: e.target.value }))}
                    className="bg-[#0a0a0a] border border-[var(--line)] px-3 py-2.5 font-mono text-[11px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)]"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] tracking-[0.25em] uppercase text-bone-3">Notas internas</label>
                <textarea
                  rows={3} placeholder="Notas sobre este pedido..."
                  value={patch.adminNotes || ''}
                  onChange={e => setPatch(p => ({ ...p, adminNotes: e.target.value }))}
                  className="bg-[#0a0a0a] border border-[var(--line)] px-3 py-2.5 font-mono text-[11px] text-bone placeholder:text-bone-3 outline-none focus:border-[var(--line-strong)] resize-none"
                />
              </div>

              <button
                onClick={save} disabled={saving}
                className="bg-bone text-ink py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-bone-2 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </section>

          </div>
        </div>
      )}
    </div>
  );
}
