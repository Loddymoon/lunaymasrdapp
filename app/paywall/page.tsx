'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion, animate } from 'motion/react';
import { ChevronLeft, Volume2, ShieldCheck, Bell, Ban, Loader2, X } from 'lucide-react';
import { HablaProntoLogo } from '@/components/shared/HablaProntoLogo';
import { DispositivoOwnable } from '@/components/shared/DispositivoOwnable';

/* Precio que cuenta de 0 al valor real al montar (baseline de animación #2, 22/55 T4) —
   nunca un número estático en una pantalla de conversión. */
function PrecioAnimado({ valor }: { valor: number }) {
  const reduceMotion = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduceMotion ? valor : 0);
  useEffect(() => {
    // reduceMotion ya deja `mostrado` correcto desde el useState inicial —
    // no hace falta reafirmarlo (evita setState síncrono dentro del efecto).
    if (reduceMotion) return;
    const controls = animate(0, valor, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (v) => setMostrado(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);
  return <>${mostrado.toFixed(2)}</>;
}

/* ============================================================================
   PAYWALL — HablaPronto (Sesión 4)
   Anatomía de 02B-ONBOARDING-Y-PAYWALL.md, corta por defecto (60-OPERACION-DE-
   CONVERSION.md): 1 headline · 1 línea personal · beneficios (max 3) · 2 planes
   · 1 bloque de confianza/reversión · 1 CTA dominante + salida limpia.
   El CTA de pago real (checkout de Hotmart) se conecta en la Sesión 6 — hoy
   lleva a /activar, una pantalla honesta de "esto se conecta pronto", nunca un
   botón muerto (ver ESTADO.md → Pendientes del usuario).
   Copy de plazos: sin promesas de fecha exacta — apoya lo que ya hacen en casa
   (pedido del usuario, 2026-08-12).
   ============================================================================ */

interface Respuestas {
  nombre?: string;
  meta?: 'primeras-palabras' | 'vocales' | 'oraciones' | 'confianza';
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const META_COPY: Record<NonNullable<Respuestas['meta']>, string> = {
  'primeras-palabras': 'soltar sus primeras palabras',
  vocales: 'pronunciar bien vocales y consonantes',
  oraciones: 'armar oraciones sencillas',
  confianza: 'ganar confianza al hablar',
};

export default function PaywallPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  // Inicializador perezoso en vez de leer sessionStorage en un efecto: evita
  // el setState síncrono dentro de un efecto (regla nueva de React) — el
  // guard de `window` es necesario porque este componente sí se renderiza en
  // el servidor una vez antes de hidratar (sessionStorage no existe ahí).
  const [r] = useState<Respuestas>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = sessionStorage.getItem('hablapronto_onboarding');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [conectando, setConectando] = useState(false);
  const [errorConexion, setErrorConexion] = useState(false);

  function empezar() {
    setConectando(true);
    setErrorConexion(false);
    setTimeout(() => {
      try {
        router.push(`/activar?plan=${plan}`);
      } catch {
        setConectando(false);
        setErrorConexion(true);
      }
    }, 450);
  }

  const nombreNino = r.nombre?.trim() || 'tu hijo';
  const metaCopy = r.meta ? META_COPY[r.meta] : 'hablar más claro';

  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      <header className="flex items-center justify-between px-5 pt-5">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Link href="/onboarding" aria-label="Volver" className="flex size-9 items-center justify-center rounded-full text-[var(--text-secondary)]">
            <ChevronLeft size={22} />
          </Link>
        </motion.div>
        <HablaProntoLogo size="small" />
        <span className="size-9" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-[440px] flex-1 px-5 pb-32 pt-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
        >
          {/* Dispositivo ownable de FICHA-ARTE.md (mascota "Rufo el zorro") — mismo
              tratamiento "sticker" (contorno + sombra inferior) que CTA/PlanCard,
              para que hable el mismo lenguaje visual del resto de la pantalla. */}
          <motion.div variants={ITEM_VARIANTS} className="mb-2 flex items-center justify-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-b-[4px] border-[color-mix(in_oklab,var(--brand-coral)_70%,black)] bg-[var(--brand-coral)]">
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
                <path d="M13 23 19 3 29 20z" fill="var(--surface)" opacity="0.85" />
                <path d="M51 23 45 3 35 20z" fill="var(--surface)" opacity="0.85" />
                <circle cx="25" cy="33" r="3.6" fill="var(--surface)" />
                <circle cx="39" cy="33" r="3.6" fill="var(--surface)" />
                <circle cx="25" cy="34" r="1.9" fill="var(--text-primary)" />
                <circle cx="39" cy="34" r="1.9" fill="var(--text-primary)" />
                <ellipse cx="32" cy="39.5" rx="5.5" ry="4" fill="var(--surface)" opacity="0.75" stroke="var(--text-primary)" strokeWidth="1" />
                <path d="M29.2 38.2h5.6l-2.8 3.6z" fill="var(--text-primary)" />
                <path d="M27 44.5c2.4 2 8.6 2 11 0" stroke="var(--text-primary)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            {/* Segunda pieza del dispositivo ownable (burbuja + onda de sonido de
                FICHA-ARTE.md) — antes solo aparecía la mascota, sin la burbuja de
                diálogo (hallazgo del revisor: "dispositivo ownable incompleto"). */}
            <DispositivoOwnable size={44} />
          </motion.div>

          {/* 1-2. Headline de resultado + línea personal — acento naranja (accent-2),
              MISMO rol de énfasis de titular que el onboarding (línea 401); el verde
              queda EXCLUSIVO del CTA/avance, en toda la app. */}
          <motion.h1
            variants={ITEM_VARIANTS}
            className="mb-2 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
          >
            Desbloquea el{' '}
            <span className="text-[var(--accent-2)]">plan diario</span> de {nombreNino}
          </motion.h1>
          <motion.p variants={ITEM_VARIANTS} className="mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Si en el parque o en el control con el pediatra sientes que otros niños ya hablan más, no es que hagas algo mal — preparamos el Método de los 5 Minutos para ayudar a {nombreNino} a {metaCopy}, a su propio ritmo.
          </motion.p>

          {/* Beneficios — máx 3. Colores: accent-2 SOLO para el que habla de voz/hablar
              (mismo significado que el mic en la app), accent para confianza/cobro
              (misma familia que "seguir"), neutro para lo informativo — nunca los
              colores de mascota/premio de FICHA-ARTE aquí. */}
          <motion.ul variants={ITEM_VARIANTS} className="mb-6 flex flex-col gap-3">
            <Beneficio icon={Volume2} color="var(--accent-2)" texto="Voces humanas reales en español neutro, nunca robóticas" />
            <Beneficio icon={Bell} color="var(--text-tertiary)" texto="Un reto nuevo cada día, ajustado a su edad exacta" />
            <Beneficio icon={Ban} color="var(--text-tertiary)" texto="Sin anuncios ni compras dentro de la app" />
          </motion.ul>

          {/* Planes — flechas arriba/abajo alternan entre los 2 planes, como espera
              la semántica nativa de un radiogroup (hallazgo del revisor). */}
          <motion.div
            variants={ITEM_VARIANTS}
            role="radiogroup"
            aria-label="Elige tu plan"
            onKeyDown={(e) => {
              // Roving focus real: además de cambiar el plan, mueve el foco del
              // teclado a la tarjeta recién elegida (antes solo cambiaba el
              // estado y dejaba el foco visual en la tarjeta vieja — rompía el
              // patrón WAI-ARIA esperado de un radiogroup, hallazgo del revisor).
              if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                setPlan('mensual');
                document.getElementById('plan-mensual')?.focus();
              } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                setPlan('anual');
                document.getElementById('plan-anual')?.focus();
              }
            }}
            className="mb-5 flex flex-col gap-3"
          >
            <PlanCard
              id="plan-anual"
              seleccionado={plan === 'anual'}
              onClick={() => setPlan('anual')}
              badge="2 meses gratis"
              titulo="Anual"
              precioGrande={2.5}
              sufijo="/mes"
              detalle="Se cobra $29.99/año"
              tono="destacado"
            />
            <PlanCard
              id="plan-mensual"
              seleccionado={plan === 'mensual'}
              onClick={() => setPlan('mensual')}
              titulo="Mensual"
              precioGrande={4.99}
              sufijo="/mes"
              detalle="Se cobra cada mes"
              tono="neutro"
            />
          </motion.div>

          {/* Confianza + garantía agrupadas sobre una superficie elevada (profundidad
              de página, pedido del revisor) — la hairline degradé sigue siendo el
              ÚNICO borde con ese tratamiento. La garantía ahora tiene su propio ícono
              y un divisor que la separa visualmente del bloque de arriba: antes vivía
              como texto suelto sin el mismo peso que la información de cobro. */}
          <motion.div variants={ITEM_VARIANTS} className="mb-4 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-3">
            <div className="hairline-degrade px-4 py-3 text-[13px] leading-snug text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">7 días gratis.</strong> Aviso por correo 24h antes del cobro, con fecha y monto exactos. Cancela cuando quieras desde tu cuenta.
            </div>
            <div className="mt-2.5 flex items-start gap-2.5 border-t border-[color-mix(in_oklab,var(--text-primary)_10%,transparent)] px-1 pt-2.5">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--text-tertiary)]" />
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Garantía HablaPronto:</strong> si en 14 días no te sirve, te devolvemos todo.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* CTA fijo al fondo de la pantalla (siempre visible sin scroll — hallazgo del
          revisor: el contenido completo supera el alto del viewport en celulares
          comunes y el botón que decide el cobro quedaba fuera del primer vistazo). */}
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
        className="fixed inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--bg)] from-70% to-transparent pt-6"
      >
        <div className="mx-auto w-full max-w-[440px] px-5 pb-6">
          {errorConexion && (
            <p className="mb-2 text-center text-[12px] font-medium text-[var(--text-secondary)]">
              No pudimos conectar. Inténtalo de nuevo.
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={empezar}
            disabled={conectando}
            className="hablapronto-cta relative mb-1 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-button)] border-[2.5px] px-8 text-[16px] font-bold text-[var(--bg)] [touch-action:manipulation] disabled:opacity-60"
          >
            <span className="hablapronto-cta-sheen pointer-events-none absolute -left-8 -top-4 h-14 w-24" aria-hidden="true" />
            {conectando && <Loader2 size={18} className="animate-spin" />}
            {conectando ? 'Conectando…' : errorConexion ? 'Reintentar' : 'Empezar mi plan gratis'}
          </motion.button>

          {/* Salida limpia — vuelve al inicio, nunca reinicia el cuestionario de 5
              preguntas que el padre ya completó (antes mandaba a /onboarding). */}
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 py-2 text-[13px] font-semibold text-[var(--text-tertiary)]"
          >
            <X size={14} /> Ahora no, volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Beneficio({
  icon: Icon,
  color,
  texto,
}: {
  icon: typeof Volume2;
  color: string;
  texto: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)]"
        style={{ background: `color-mix(in oklab, ${color} 14%, transparent)` }}
      >
        <Icon size={18} color={color} />
      </span>
      <span className="pt-1.5 text-[13px] leading-snug text-[var(--text-primary)]">{texto}</span>
    </li>
  );
}

function PlanCard({
  id,
  seleccionado,
  onClick,
  badge,
  titulo,
  precioGrande,
  sufijo,
  detalle,
  tono,
}: {
  id: string;
  seleccionado: boolean;
  onClick: () => void;
  badge?: string;
  titulo: string;
  precioGrande: number;
  sufijo: string;
  detalle: string;
  tono: 'destacado' | 'neutro';
}) {
  const color = tono === 'destacado' ? 'var(--brand-gold)' : 'var(--text-primary)';
  return (
    <motion.button
      id={id}
      role="radio"
      aria-checked={seleccionado}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex w-full items-center justify-between rounded-[var(--radius-card)] border-[2.5px] border-b-[5px] bg-[var(--surface)] px-5 py-4 text-left transition-colors duration-200 [touch-action:manipulation]"
      style={{
        borderColor: seleccionado ? color : 'color-mix(in oklab, var(--text-primary) 12%, transparent)',
        borderBottomColor: seleccionado ? `color-mix(in oklab, ${color} 70%, black)` : 'color-mix(in oklab, var(--text-primary) 20%, transparent)',
      }}
    >
      {badge && (
        <span
          className="absolute -top-3 left-4 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]"
          style={{ background: color }}
        >
          {badge}
        </span>
      )}
      <div className="flex items-center gap-3">
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded-full border-2"
          style={{ borderColor: seleccionado ? color : 'color-mix(in oklab, var(--text-primary) 25%, transparent)' }}
        >
          {seleccionado && <span className="size-2.5 rounded-full" style={{ background: color }} />}
        </span>
        <div>
          <div className="text-[15px] font-bold text-[var(--text-primary)]">{titulo}</div>
          <div className="text-[12px] text-[var(--text-secondary)]">{detalle}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[20px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          <PrecioAnimado valor={precioGrande} />
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">{sufijo}</span>
        </div>
      </div>
    </motion.button>
  );
}
