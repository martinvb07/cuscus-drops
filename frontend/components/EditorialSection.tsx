'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

interface Props { available?: number | null }

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   BANNER 01 â€” EXCLUSIVIDAD
   Layout: texto + nÃºmero gigante izquierda / gorra derecha (parallax)
   EmociÃ³n: silencio, lujo, rareza
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BannerExclusividad({ available }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY   = useTransform(scrollYProgress, [0, 1], ['24px', '-24px']);
  const numY   = useTransform(scrollYProgress, [0, 1], ['10px', '-10px']);
  const ghostY = useTransform(scrollYProgress, [0, 1], ['6px', '-6px']);
  const pct    = available != null ? Math.max(0, (available / 100) * 100) : null;

  return (
    <div ref={ref} className="relative border-b border-[var(--line)] overflow-hidden">
      <div
        className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr]"
        style={{ minHeight: 'clamp(320px, 50vh, 640px)' }}
      >
        {/* â”€â”€ Left: nÃºmero editorial + copy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="relative flex flex-col justify-center px-5 sm:px-12 lg:px-16 py-9 sm:py-14 lg:py-20 border-r-0 lg:border-r border-[var(--line)] overflow-hidden">

          {/* Ghost cap behind the number â€” contexto material muy sutil */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{ right: '-8%', top: '0', width: '68%', height: '100%', y: ghostY }}
            aria-hidden
          >
            <Image
              src="/drop1-img/front.png"
              alt=""
              fill
              style={{ objectFit: 'contain', opacity: 0.038, padding: '6%' }}
            />
          </motion.div>

          {/* Section label + eyelet dots */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
          >
            <span className="font-mono text-[8px] tracking-[0.52em] text-bone-3 uppercase" style={{ opacity: 0.38 }}>
              01 &nbsp;·&nbsp; Exclusividad
            </span>
            <div className="flex gap-[5px] items-center" style={{ opacity: 0.22 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-[3px] h-[3px] rounded-full border border-[var(--bone-3)]" />
              ))}
            </div>
          </motion.div>

          {/* NÃºmero 100 con acento vertical de stitching */}
          <motion.div style={{ y: numY }} className="relative mb-2">
            {/* Vertical stitch accent */}
            <div
              className="absolute left-0 top-0 bottom-0 pointer-events-none"
              style={{
                width: '1px',
                backgroundImage: 'repeating-linear-gradient(to bottom, rgba(235,230,219,0.20) 0px, rgba(235,230,219,0.20) 4px, transparent 4px, transparent 9px)',
              }}
              aria-hidden
            />
            <div className="pl-5">
              <motion.p
                className="font-gothic text-bone leading-none"
                style={{ fontSize: 'clamp(88px, 14vw, 180px)' }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.2, ease: EASE }}
              >
                100
              </motion.p>
              <motion.p
                className="font-mono text-bone-3 mt-2 pl-1"
                style={{ fontSize: '7.5px', letterSpacing: '0.30em', opacity: 0.28 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.28 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.9 }}
              >
                SERIAL 001 — 100 &nbsp;·&nbsp; DROP #1
              </motion.p>
            </div>
          </motion.div>

          {/* Stitching divider */}
          <motion.div
            className="ml-5 mb-8 mt-6"
            style={{
              height: '1px',
              width: '56px',
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(235,230,219,0.22) 0px, rgba(235,230,219,0.22) 5px, transparent 5px, transparent 9px)',
              transformOrigin: 'left center',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 1.0 }}
            aria-hidden
          />

          {/* Copy */}
          <motion.p
            className="font-garamond italic text-bone-3 leading-relaxed mb-6 ml-5"
            style={{ fontSize: 'clamp(15px, 1.9vw, 20px)', maxWidth: '360px' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 1.1, ease: EASE }}
          >
            Solo cien gorras en el mundo.<br />Cada pieza existe una sola vez.
          </motion.p>

          {/* Barra de stock */}
          <motion.div
            className="flex flex-col gap-2.5 w-full max-w-[320px] ml-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.36, duration: 0.9 }}
          >
            <div className="relative w-full h-px bg-[var(--line)] overflow-hidden">
              {pct !== null && (
                <motion.div
                  className="absolute left-0 top-0 h-full"
                  style={{ background: 'linear-gradient(90deg, var(--bone-3), var(--bone))' }}
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55, duration: 1.4, ease: EASE }}
                />
              )}
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[7.5px] tracking-[0.26em] uppercase text-bone-2">
                {available != null ? `${available} disponibles` : '— — —'}
              </span>
              <span className="font-mono text-[7.5px] tracking-[0.26em] uppercase text-bone-3 opacity-45">
                100 total
              </span>
            </div>
          </motion.div>
        </div>

        {/* â”€â”€ Right: gorra con parallax â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="relative hidden lg:block overflow-hidden">
          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ y: imgY }}>
            <div className="relative w-full h-full">
              <Image
                src="/drop1-img/front.png"
                alt=""
                fill
                style={{ objectFit: 'contain', padding: '7%', opacity: 0.88 }}
              />
            </div>
          </motion.div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.50) 0%, transparent 55%)' }}
            aria-hidden
          />
          <motion.span
            className="absolute bottom-6 right-6 font-mono text-[7px] tracking-[0.28em] uppercase text-bone-3"
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.28 }}
            viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
          >
            Drop 01 · Colombia 2026
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   BANNER 02 â€” SIN REPOSICIÃ“N
   Layout: full-width cinematogrÃ¡fico, gorra oscura de fondo, texto sobrepuesto
   EmociÃ³n: irrepetible, limitado, urgencia elegante
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BannerSinReposicion() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.00]);
  const textY   = useTransform(scrollYProgress, [0, 1], ['16px', '-16px']);

  return (
    <div
      ref={ref}
      className="relative border-b border-[var(--line)] overflow-hidden flex items-center"
      style={{ minHeight: 'clamp(280px, 40vh, 520px)' }}
    >
      {/* Gorra de fondo â€” muy oscura */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ scale: bgScale }}
        aria-hidden
      >
        <Image
          src="/drop1-img/back.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.07 }}
        />
      </motion.div>

      {/* Gradiente lateral para dar profundidad */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--ink) 0%, rgba(10,10,10,0.0) 40%, rgba(10,10,10,0.0) 60%, var(--ink) 100%)' }}
        aria-hidden
      />

      {/* LÃ­nea de stitching animada */}
      <motion.div
        className="absolute inset-x-0 pointer-events-none"
        style={{ top: '50%' }}
        aria-hidden
      >
        <motion.div
          style={{
            height: '1px',
            background: 'repeating-linear-gradient(90deg, rgba(235,230,219,0.12) 0px, rgba(235,230,219,0.12) 6px, transparent 6px, transparent 14px)',
            transformOrigin: 'left center',
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.0, ease: [0.25, 1, 0.5, 1] }}
        />
      </motion.div>

      {/* Contenido */}
      <motion.div
        className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-12 lg:px-16 py-9 sm:py-14"
        style={{ y: textY }}
      >
        <motion.p
          className="font-mono text-[8px] tracking-[0.52em] text-bone-3 uppercase mb-7"
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.38 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          02 &nbsp;·&nbsp; Sin reposici&oacute;n
        </motion.p>

        <motion.h2
          className="font-bebas text-bone leading-[0.90] mb-5"
          style={{ fontSize: 'clamp(50px, 9.5vw, 128px)', letterSpacing: '0.04em' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          Sin reposici&oacute;n.
        </motion.h2>

        <motion.p
          className="font-mono text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-bone-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 0.50, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22, duration: 1.0, ease: EASE }}
        >
          Cuando desaparezca, termina.
        </motion.p>
      </motion.div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   BANNER 03 â€” NUMERADAS
   Layout: imagen tÃ©cnica izquierda (blueprint) / serial + texto derecha
   EmociÃ³n: pieza de colecciÃ³n, identidad, trazabilidad
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BannerNumeradas() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['18px', '-18px']);

  return (
    <div ref={ref} className="relative border-b border-[var(--line)] overflow-hidden">
      <div
        className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr]"
        style={{ minHeight: 'clamp(320px, 44vh, 580px)' }}
      >
        {/* â”€â”€ Left: imagen con overlay tÃ©cnico â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="relative hidden lg:block border-r border-[var(--line)] overflow-hidden">
          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ y: imgY }}>
            <div className="relative w-full h-full">
              <Image
                src="/drop1-img/left.png"
                alt=""
                fill
                style={{ objectFit: 'contain', padding: '14%', opacity: 0.60 }}
              />
            </div>
          </motion.div>

          {/* Blueprint lines â€” SVG overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(235,230,219,0.06)" strokeWidth="1" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(235,230,219,0.06)" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="28%" stroke="rgba(235,230,219,0.05)" strokeWidth="0.8" fill="none" />
            <circle cx="50%" cy="50%" r="42%" stroke="rgba(235,230,219,0.03)" strokeWidth="0.5" fill="none" strokeDasharray="3 8" />
          </svg>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent 60%, rgba(10,10,10,0.5) 100%)' }}
            aria-hidden
          />
        </div>

        {/* â”€â”€ Right: serial + copy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex flex-col justify-center px-5 sm:px-12 lg:px-16 py-9 sm:py-14 lg:py-20">

          <motion.p
            className="font-mono text-[8px] tracking-[0.52em] text-bone-3 uppercase mb-7"
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.38 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            03 &nbsp;·&nbsp; Numeradas
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, ease: EASE }}
            className="mb-3"
          >
            <p
              className="font-gothic text-bone leading-none"
              style={{ fontSize: 'clamp(56px, 9vw, 120px)' }}
            >
              #001
            </p>
            <p
              className="font-mono text-bone-3 mt-2"
              style={{ fontSize: 'clamp(11px, 1.3vw, 14px)', letterSpacing: '0.32em', opacity: 0.30 }}
            >
              — #100
            </p>
          </motion.div>

          <motion.div
            className="w-8 h-px bg-[var(--bone-3)] opacity-20 mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.9 }}
          />

          <motion.p
            className="font-garamond italic text-bone-3 leading-relaxed"
            style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', maxWidth: '340px' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 1.0, ease: EASE }}
          >
            Cada gorra tiene identidad propia.<br />No hay dos iguales en el mundo.
          </motion.p>

        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   BANNER 04 â€” PARA COLECCIONISTAS
   Layout: gorra editorial izquierda (escala suave) / manifiesto + CTA derecha
   EmociÃ³n: culto, pertenencia, archivo, exclusividad definitiva
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BannerColeccionistas() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.97]);
  const textY    = useTransform(scrollYProgress, [0, 1], ['14px', '-14px']);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div
        className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr]"
        style={{ minHeight: 'clamp(320px, 48vh, 620px)' }}
      >
        {/* â”€â”€ Left: gorra editorial â€” escala lenta con scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="relative overflow-hidden min-h-[220px] lg:min-h-0 border-r-0 lg:border-r border-[var(--line)]">
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            <Image
              src="/drop1-img/front.png"
              alt=""
              fill
              style={{ objectFit: 'contain', padding: '7%', opacity: 0.75 }}
            />
          </motion.div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.05) 60%, rgba(10,10,10,0.55) 100%)' }}
            aria-hidden
          />
        </div>

        {/* â”€â”€ Right: manifiesto final â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          className="flex flex-col justify-center px-5 sm:px-12 lg:px-14 py-9 sm:py-14 lg:py-20"
          style={{ y: textY }}
        >
          <motion.p
            className="font-mono text-[8px] tracking-[0.52em] text-bone-3 uppercase mb-7"
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.38 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            04 &nbsp;·&nbsp; Para coleccionistas
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.3, ease: EASE }}
            className="mb-8"
          >
            <h2
              className="font-bebas text-bone leading-[0.92]"
              style={{ fontSize: 'clamp(32px, 4.8vw, 62px)', letterSpacing: '0.04em' }}
            >
              No es mercanc&iacute;a.
            </h2>
            <h2
              className="font-bebas text-bone-3 leading-[0.92] mt-1"
              style={{ fontSize: 'clamp(32px, 4.8vw, 62px)', letterSpacing: '0.04em' }}
            >
              Es archivo.
            </h2>
          </motion.div>

          <motion.div
            className="w-8 h-px bg-[var(--bone-3)] opacity-20 mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            style={{ originX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28, duration: 0.9 }}
          />

          <motion.p
            className="font-garamond italic text-bone-3 leading-relaxed mb-8"
            style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', maxWidth: '300px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 1.0 }}
          >
            Dise&ntilde;ada para quienes entienden que
            lo verdaderamente exclusivo no se repite.
          </motion.p>

          <motion.a
            href="#drop"
            className="flex items-center gap-3 group w-fit"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.46, duration: 0.9 }}
          >
            <span className="font-mono text-[9px] tracking-[0.42em] uppercase text-bone border-b border-[rgba(235,230,219,0.2)] pb-0.5 group-hover:border-[rgba(235,230,219,0.5)] transition-colors duration-500">
              Adquirir ahora
            </span>
            <span className="font-mono text-bone opacity-40 group-hover:translate-x-1.5 transition-transform duration-300">
              →
            </span>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SECCIÃ“N PRINCIPAL
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function EditorialSection({ available }: Props) {
  return (
    <section id="manifesto" className="relative w-full overflow-hidden">

      {/* Header */}
      <div className="border-t border-b border-[var(--line)] px-5 sm:px-10 lg:px-16 py-4">
        <motion.div
          className="max-w-[1440px] mx-auto flex items-center justify-between"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
        >
          <span className="font-mono text-[8px] tracking-[0.50em] text-bone-3 uppercase opacity-50">
            Manifiesto
          </span>
          <span className="font-mono text-[8px] tracking-[0.28em] text-bone-3 uppercase opacity-35">
            Drop #1 · 2026
          </span>
        </motion.div>
      </div>

      <BannerExclusividad available={available} />
      <BannerSinReposicion />
      <BannerNumeradas />
      <BannerColeccionistas />

      {/* Cita final */}
      <div className="border-t border-[var(--line)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-10 sm:py-16">
          <motion.blockquote
            className="flex flex-col items-center text-center gap-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <div className="w-8 h-px bg-[var(--bone-3)] opacity-20" aria-hidden />
            <p
              className="font-garamond italic text-bone-2 leading-[1.45] max-w-[400px]"
              style={{ fontSize: 'clamp(16px, 2vw, 21px)' }}
            >
              &ldquo;La gorra que llevabas era tu mundo entero.
              Y solo hab&iacute;a cien mundos como ese.&rdquo;
            </p>
            <span className="font-mono text-[7.5px] tracking-[0.44em] text-bone-3 uppercase opacity-35">
              Cuscus Hats · Drop #1 · 100 gorras
            </span>
          </motion.blockquote>
        </div>
      </div>

    </section>
  );
}



