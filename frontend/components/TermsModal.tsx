'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(4,4,4,0.88)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg max-h-[82vh] overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{
              background: 'rgba(10,10,10,1)',
              border: '1px solid rgba(235,230,219,0.12)',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-5"
              style={{ background: 'rgba(10,10,10,1)', borderBottom: '1px solid rgba(235,230,219,0.08)' }}>
              <div>
                <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-bone-3 mb-1">Cuscus Hats — Drop #1</p>
                <h2 className="font-gothic text-[20px] uppercase tracking-widest text-bone leading-none">
                  Términos & Condiciones
                </h2>
              </div>
              <button
                onClick={onClose}
                className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone-3 hover:text-bone transition-colors duration-200 ml-4 shrink-0"
              >
                Cerrar ×
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-7 flex flex-col gap-8">

              {/* Entrega */}
              <Section title="Entrega y producción">
                <p>
                  Cada gorra del Drop #1 es producida bajo pedido luego del lanzamiento oficial el{' '}
                  <strong className="text-bone">2 de junio de 2026</strong>. El tiempo estimado de producción y entrega es de{' '}
                  <strong className="text-bone">32 días calendario</strong> a partir de esa fecha.
                </p>
                <p>
                  Hacemos despachos a todo Colombia a través de operadores logísticos certificados. El cliente recibirá
                  una notificación con número de guía una vez el pedido sea despachado.
                </p>
                <p>
                  Las fechas de entrega son estimadas. Cuscus Hats no se hace responsable por retrasos ocasionados
                  por la empresa transportadora o situaciones de fuerza mayor.
                </p>
              </Section>

              {/* Política de compra */}
              <Section title="Política de compra">
                <p>
                  Esta es una <strong className="text-bone">edición completamente limitada de 100 unidades</strong>. Una vez
                  agotado el stock, el Drop #1 cierra de forma permanente.
                </p>
                <p>
                  Dado el carácter exclusivo y de producción bajo pedido, <strong className="text-bone">no se aceptan
                  cambios ni devoluciones</strong> salvo que el producto llegue con defecto de fábrica debidamente
                  documentado. En ese caso, el cliente deberá reportarlo dentro de los 5 días hábiles siguientes a la
                  recepción del pedido a través de nuestro WhatsApp de soporte.
                </p>
                <p>
                  El precio es en pesos colombianos (COP) e incluye IVA. El pago se procesa de forma segura a través
                  de Shopify Payments.
                </p>
              </Section>

              {/* Tratamiento de datos */}
              <Section title="Tratamiento de datos personales">
                <p>
                  Al realizar tu compra, autorizas a <strong className="text-bone">Cuscus Hats</strong> para recopilar y
                  tratar tus datos personales (nombre, correo electrónico, dirección de envío y teléfono) con los
                  siguientes fines:
                </p>
                <ul className="flex flex-col gap-2 mt-1">
                  {[
                    'Procesamiento y gestión del pedido.',
                    'Notificaciones de envío y estado del pedido.',
                    'Comunicaciones relacionadas con futuros drops y lanzamientos de Cuscus Hats.',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-bone shrink-0 mt-[2px]">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Tus datos son almacenados de forma segura y nunca serán vendidos ni compartidos con terceros
                  ajenos al proceso de entrega. Puedes solicitar la eliminación de tus datos en cualquier momento
                  contactándonos por WhatsApp.
                </p>
                <p>
                  El tratamiento de datos se rige por la{' '}
                  <strong className="text-bone">Ley 1581 de 2012</strong> (Ley de Protección de Datos Personales de
                  Colombia) y el Decreto 1377 de 2013.
                </p>
              </Section>

              {/* Condiciones generales */}
              <Section title="Condiciones generales">
                <p>
                  Al completar tu compra confirmas que has leído, entendido y aceptado la totalidad de estos términos
                  y condiciones.
                </p>
                <p>
                  Cuscus Hats se reserva el derecho de cancelar un pedido y realizar el reembolso total en caso de
                  detectar fraude, información de envío incorrecta o cualquier irregularidad en la transacción.
                </p>
                <p>
                  Para cualquier duda o inconveniente, contáctanos vía WhatsApp. Respondemos en horario hábil
                  (lunes a viernes, 9 am – 6 pm).
                </p>
              </Section>

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 px-6 py-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(235,230,219,0.08)', background: 'rgba(10,10,10,1)' }}>
              <p className="font-mono text-[7px] tracking-[0.22em] uppercase text-bone-3" style={{ opacity: 0.4 }}>
                Última actualización: Mayo 2026
              </p>
              <button
                onClick={onClose}
                className="font-mono text-[8px] tracking-[0.32em] uppercase text-bone border border-[rgba(235,230,219,0.15)] px-4 py-2 hover:border-[rgba(235,230,219,0.4)] transition-colors duration-200"
              >
                Entendido
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="w-4 h-[1px] bg-bone-3 opacity-40" />
        <h3 className="font-mono text-[8px] tracking-[0.38em] uppercase text-bone-3">{title}</h3>
      </div>
      <div className="flex flex-col gap-3 font-garamond text-[14px] text-bone-3 leading-relaxed pl-1">
        {children}
      </div>
    </div>
  );
}
