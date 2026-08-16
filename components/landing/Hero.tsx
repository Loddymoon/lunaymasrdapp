'use client';

// KIT DE LANDING — §1 HERO (blueprint: 55 §1)
// Reglas embebidas: H1 bold completo con acento vía copy marcado · subtítulo con
// tope duro de 14 palabras (warn + truncado) · CTA vivo ≥52px con sombra tintada ·
// franja de prueba social como slot (SOLO datos reales — 19 §1) · mesh sutil de
// fondo YA incluido · carga inmediata (fade simple, nada que compita con el LCP).

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CtaButton } from './ui';
import { MarkedCopy, truncarMarcado, warnCopy } from './MarkedCopy';

export interface HeroProps {
  appName: string;
  /** Logo real del proyecto; sin él, marca mínima con el acento. */
  logo?: ReactNode;
  loginHref?: string;
  loginLabel?: string;
  /** Copy MARCADO de docs/copy/landing.md — máx 8-10 palabras, 1-3 en [acento]. */
  h1Marked: string;
  /** Copy MARCADO — máx 14 palabras (52): el kit trunca y avisa si excede. */
  subtitleMarked: string;
  /** 1ª persona + beneficio ("Probar mi primer escaneo") — nunca "Registrarse". */
  ctaLabel: string;
  /** Destino según el MODELO de 02C: checkout Hotmart (M1) u /onboarding (M2). */
  ctaHref: string;
  /** Franja bajo el CTA (posición FIJA de 19 §1). Día 1 sin números: la garantía. */
  socialProof?: ReactNode;
  /** Screenshot real o mini-demo honesto. Sin visual → placeholder honesto (55 §1.3). */
  visual?: ReactNode;
  id?: string;
}

export function Hero({
  appName,
  logo,
  loginHref,
  loginLabel = 'Entrar',
  h1Marked,
  subtitleMarked,
  ctaLabel,
  ctaHref,
  socialProof,
  visual,
  id = 'hero',
}: HeroProps) {
  warnCopy('Hero → h1', h1Marked, 10);
  warnCopy('Hero → subtítulo', subtitleMarked, 14);
  const subtitulo = truncarMarcado(subtitleMarked, 14);

  return (
    <section id={id} className="relative overflow-hidden">
      {/* Fondo con profundidad: mesh/radial sutil del acento — nunca fill plano */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(900px 480px at 50% -10%, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(640px 420px at 100% 0%, color-mix(in oklab, var(--accent-2) 14%, transparent) 0%, transparent 55%), ' +
            'radial-gradient(520px 360px at 0% 15%, color-mix(in oklab, var(--accent-2) 8%, transparent) 0%, transparent 55%)',
        }}
      />

      <div className="mx-auto w-full max-w-[1140px] px-5">
        {/* Header 64px: marca a la izquierda, SOLO "Entrar" terciario a la derecha (19) */}
        <header className="flex min-h-16 items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2">
            {logo ?? (
              <>
                <span aria-hidden="true" className="size-6 rounded-[8px] bg-[var(--accent)]" />
                <span className="hablapronto-wordmark text-[18px]">{appName}</span>
              </>
            )}
          </Link>
          {loginHref && (
            <Link href={loginHref} className="px-2 py-3 text-[14px] font-medium text-[var(--text-tertiary)]">
              {loginLabel}
            </Link>
          )}
        </header>

        {/* Carga inmediata: fade simple 300ms — el LCP manda (55 T4) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto flex max-w-[820px] flex-col items-center pt-10 text-center md:pt-16"
        >
          {/* H1: bold completo por defecto; el acento lo pone el [acento] del copy */}
          <h1 className="text-balance text-[40px] font-bold leading-[1.08] tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[60px]">
            <MarkedCopy text={h1Marked} />
          </h1>

          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[var(--text-secondary)] md:text-[18px]">
            <MarkedCopy text={subtitulo} />
          </p>

          <div className="mt-6 w-full sm:w-auto">
            <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
          </div>

          {/* Franja de prueba social: 8-12px bajo el CTA — SOLO números reales */}
          {socialProof && (
            <div className="mt-3 text-[13px] text-[var(--text-secondary)]">{socialProof}</div>
          )}

          {/* Visual del producto: SOLO se muestra si hay una captura real (55 §1.3).
              A pedido del usuario, se quitó el placeholder honesto mientras no hay
              screenshot — pendiente anotado en ESTADO.md para montarlo en la Sesión 5. */}
          {visual && (
            <div className="mt-10 w-full max-w-[720px]">
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_18%,transparent)] shadow-[var(--shadow-2)]">
                {visual}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
