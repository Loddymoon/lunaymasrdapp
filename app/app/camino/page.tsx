'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Lock, Star } from 'lucide-react';
import { DispositivoOwnable } from '@/components/shared/DispositivoOwnable';
import { CURRICULO } from '@/lib/curriculo';
import { leerProgreso, huboErrorAlmacenamiento, type Progreso } from '@/lib/progreso';

const PASO_Y = 104; // separación vertical entre nodos
const AMPLITUD_X = 30; // % de recorrido horizontal — camino serpenteante, no una lista

function xPct(i: number) {
  // Serpentina orgánica (no zigzag rígido) — se acerca al estilo "camino
  // conectado" de Candy Crush Saga que pidió el usuario, en vez de una lista.
  return 50 + AMPLITUD_X * Math.sin(i * 0.9);
}

/* Pantalla "Camino" — recorrido visual del niño por los retos, con nodos
   conectados por una línea curva (pedido explícito del usuario: "estilo Candy
   Crush Saga"). El nodo actual es donde el padre debe aterrizar siempre al
   abrir esta pantalla, no en el nodo 1 (requisito de persistencia de
   docs/copy/app-interna-blueprint.md), Y es el único nodo con acción real:
   toca para ir a practicarlo en "Inicio" (antes el camino se veía interactivo
   pero ningún nodo llevaba a ningún lado — hallazgo del revisor-visual). */
export default function CaminoPage() {
  const reduceMotion = useReducedMotion();
  const [progreso] = useState<Progreso | null>(() => leerProgreso());
  const [errorGuardado] = useState(() => huboErrorAlmacenamiento());
  const nodoActualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progreso) return;
    nodoActualRef.current?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [progreso, reduceMotion]);

  const puntos = useMemo(
    () => CURRICULO.map((_, i) => ({ x: xPct(i), y: i * PASO_Y + 60 })),
    []
  );

  const trazo = useMemo(() => {
    if (puntos.length < 2) return '';
    let d = `M ${puntos[0].x} ${puntos[0].y}`;
    for (let i = 1; i < puntos.length; i++) {
      const previo = puntos[i - 1];
      const actual = puntos[i];
      const midY = (previo.y + actual.y) / 2;
      d += ` C ${previo.x} ${midY}, ${actual.x} ${midY}, ${actual.x} ${actual.y}`;
    }
    return d;
  }, [puntos]);

  const alturaTotal = CURRICULO.length * PASO_Y + 80;

  if (!progreso) {
    // Skeleton — antes esta pantalla desaparecía entera (header incluido)
    // mientras se leía localStorage (hallazgo del revisor-visual).
    return (
      <div className="flex flex-1 flex-col">
        <header className="px-5 pb-2 pt-6">
          <div className="h-6 w-28 animate-pulse rounded-full bg-[var(--surface-2)]" />
          <div className="mt-2 h-3.5 w-40 animate-pulse rounded-full bg-[var(--surface-2)]" />
        </header>
        <div className="flex flex-1 flex-col items-center gap-4 px-5 pt-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="size-14 animate-pulse rounded-full bg-[var(--surface-2)]" />
          ))}
        </div>
      </div>
    );
  }

  const indiceActual = CURRICULO.findIndex((r) => !progreso.completados[r.id]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-6">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Tu camino</h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            {Object.keys(progreso.completados).length} de {CURRICULO.length} completados
          </p>
        </div>
        <DispositivoOwnable size={40} />
      </header>

      {errorGuardado && (
        <p className="mx-5 mb-2 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--brand-coral)_14%,transparent)] px-3 py-2 text-[12px] text-[var(--text-secondary)]">
          No pudimos guardar el progreso en este navegador — practiquen igual, pero puede no verse la próxima vez.
        </p>
      )}

      <div className="relative flex-1 overflow-hidden">
      <div className="relative h-full overflow-y-auto px-5 pb-8" style={{ minHeight: alturaTotal }}>
        <svg
          className="pointer-events-none absolute inset-x-5 top-0"
          width="calc(100% - 40px)"
          height={alturaTotal}
          viewBox={`0 0 100 ${alturaTotal}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d={trazo}
            fill="none"
            stroke="var(--surface-2)"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? undefined : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1, ease: 'easeInOut' }}
          />
        </svg>

        {CURRICULO.map((reto, i) => {
          const completado = Boolean(progreso.completados[reto.id]);
          const esActual = i === indiceActual;
          const bloqueado = !completado && !esActual;
          const { x, y } = puntos[i];
          const etiqueta = completado
            ? `${reto.palabra}, ya completado`
            : esActual
              ? `${reto.palabra}, reto de hoy — toca para practicar`
              : `${reto.palabra}, todavía bloqueado`;

          const circulo = (
            <motion.div
              initial={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: reduceMotion ? 0 : Math.min(i * 0.04, 0.6), ease: 'easeOut' }}
              whileTap={esActual ? { scale: 0.92 } : undefined}
              className={`relative flex size-14 items-center justify-center rounded-full border-2 ${esActual ? 'border-b-[4px]' : ''}`}
              style={{
                // --accent (verde) es EXCLUSIVO de la acción de "seguir/continuar"
                // (FICHA-ARTE.md) — "completado" usa --brand-gold (familia de
                // recompensa), nunca el verde (hallazgo del revisor-visual).
                background: completado
                  ? 'var(--brand-gold)'
                  : esActual
                    ? 'var(--accent-2)'
                    : 'var(--surface)',
                borderColor: completado
                  ? 'color-mix(in oklab, var(--brand-gold) 70%, black)'
                  : esActual
                    ? 'color-mix(in oklab, var(--accent-2) 70%, black)'
                    : 'color-mix(in oklab, var(--text-primary) 14%, transparent)',
              }}
            >
              {esActual && !reduceMotion && (
                <motion.span
                  className="absolute -inset-1.5 rounded-full border-2"
                  style={{ borderColor: 'var(--accent-2)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {completado ? (
                <Check size={22} color="var(--surface)" strokeWidth={3} />
              ) : bloqueado ? (
                <Lock size={16} color="var(--text-tertiary)" />
              ) : (
                <span className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{reto.letra}</span>
              )}
              {esActual && (
                <span className="absolute -top-2 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--brand-gold)]">
                  <Star size={10} color="var(--surface)" fill="var(--surface)" />
                </span>
              )}
            </motion.div>
          );

          return (
            <div
              key={reto.id}
              ref={esActual ? nodoActualRef : undefined}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: `${x}%`, top: y, transform: 'translate(-50%, -50%)' }}
            >
              {esActual ? (
                <Link href="/app" aria-label={etiqueta} className="flex flex-col items-center gap-1 [touch-action:manipulation]">
                  {circulo}
                </Link>
              ) : (
                <div aria-label={etiqueta}>
                  {circulo}
                </div>
              )}
              <span
                className={`text-[10px] font-semibold ${bloqueado ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-secondary)]'}`}
                aria-hidden="true"
              >
                {reto.palabra}
              </span>
            </div>
          );
        })}
      </div>
      {/* Pista de que hay más camino abajo — sin esto el último nodo visible se
          corta seco justo sobre el nav (hallazgo del revisor). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--bg)] to-transparent"
      />
      </div>
    </div>
  );
}
