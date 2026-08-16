'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type Easing } from 'motion/react';

interface AchievementCelebrationProps {
  /** Controla si la celebración está visible. */
  open: boolean;
  /** Se llama cuando la celebración termina su ciclo y se oculta sola. */
  onClose: () => void;
  /** Mensaje accesible para lectores de pantalla (el texto ya viene dibujado en la imagen). */
  mensaje?: string;
  /** Ruta de la imagen del logro (estrella + trofeo + banner). */
  imagenSrc?: string;
  /** Apaga el sonido de recompensa aunque el ajuste global lo permita. */
  sonido?: boolean;
  /** Apaga la vibración de recompensa aunque el ajuste global lo permita. */
  vibracion?: boolean;
}

/* Coreografía calcada del JSON aportado por el usuario (achievement_star_success v1.0):
   entrance 0-550ms · settle 550-800ms · happy_jump 800-1500ms · trophy_shine 1050-1950ms ·
   sparkle_burst 1200-2300ms · banner_pulse 1550-2400ms · celebration_wiggle 2350-3000ms ·
   final_hold 3000-3600ms · dismissAfterMs 4200ms. Framer/Motion exige un solo array `times`
   por grupo de propiedades, así que las 4 propiedades del gráfico principal (opacity/scale/y/
   rotate) comparten los mismos 11 puntos de tiempo del JSON, repitiendo el valor donde esa
   propiedad no cambia en esa etapa. */
const DURACION_TOTAL_S = 3.6;
const DISMISS_MS = 4200;
const AUDIO_DELAY_MS = 450;
const HAPTICS_DELAY_MS = 550;
const REDUCED_MOTION_DURATION_S = 0.9;

const TIMES = [0, 0.1528, 0.2222, 0.3097, 0.4167, 0.6528, 0.6978, 0.7431, 0.7881, 0.8333, 1];
const EASES: Easing[] = [
  'easeOut',
  'easeInOut',
  'easeInOut',
  'easeInOut',
  'linear',
  'linear',
  'easeInOut',
  'easeInOut',
  'easeInOut',
  'easeInOut',
];

const OPACITY_KEYFRAMES = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const SCALE_KEYFRAMES = [0.35, 1.08, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const Y_KEYFRAMES = [40, 0, 0, -28, 0, 0, 0, 0, 0, 0, 0];
const ROTATE_KEYFRAMES = [0, 0, 0, -3, 0, 0, -2, 2, -1, 0, 0];

const COLORES_CONFETI = [
  'var(--brand-gold)',
  'var(--brand-coral)',
  'var(--brand-cyan)',
  'var(--brand-violet)',
];

function leerAjuste(clave: string, porDefecto: boolean) {
  if (typeof window === 'undefined') return porDefecto;
  const valor = window.localStorage.getItem(clave);
  if (valor === null) return porDefecto;
  return valor === 'true';
}

function reproducirSonidoLogro() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const notas = [523.25, 659.25, 783.99];
    notas.forEach((frecuencia, indice) => {
      const inicio = ctx.currentTime + indice * 0.09;
      const osc = ctx.createOscillator();
      const ganancia = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frecuencia;
      ganancia.gain.setValueAtTime(0, inicio);
      ganancia.gain.linearRampToValueAtTime(0.15, inicio + 0.03);
      ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.35);
      osc.connect(ganancia);
      ganancia.connect(ctx.destination);
      osc.start(inicio);
      osc.stop(inicio + 0.4);
    });
    setTimeout(() => ctx.close().catch(() => {}), 900);
  } catch {
    /* Safari/autoplay puede bloquear el audio; la celebración sigue sin sonido. */
  }
}

interface Particula {
  id: number;
  angulo: number;
  distancia: number;
  color: string;
  forma: 'estrella' | 'confeti';
  retraso: number;
  rotacion: number;
  tamano: number;
}

/* spread: 320 (no círculo completo — deja un hueco abajo, hacia el banner de texto). */
function generarParticulas(cantidad: number): Particula[] {
  return Array.from({ length: cantidad }, (_, id) => {
    const angulo = -160 + (320 / cantidad) * id + (Math.random() * 14 - 7);
    return {
      id,
      angulo,
      distancia: 70 + Math.random() * 70,
      color: COLORES_CONFETI[id % COLORES_CONFETI.length],
      forma: id % 3 === 0 ? 'estrella' : 'confeti',
      retraso: Math.random() * 0.2,
      rotacion: Math.random() * 280 - 140,
      tamano: 7 + Math.random() * 5,
    };
  });
}

function EstrellaSvg({ color, tamano }: { color: string; tamano: number }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill={color}>
      <path d="M12 1.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 8.8l7.1-.7z" />
    </svg>
  );
}

/**
 * Celebración de logro para niños de 1 a 4 años: se dispara cuando completan
 * correctamente una actividad. Coreografía calcada del JSON del usuario
 * (achievement_star_success v1.0) — breve, alegre, sin flashes agresivos,
 * no bloquea la siguiente acción (pointer-events: none, ver blockNavigation
 * del JSON y la regla anti-patrón de CLAUDE.md) y respeta prefers-reduced-motion.
 * Ver docs/copy/app-interna-blueprint.md.
 */
export function AchievementCelebration({
  open,
  onClose,
  mensaje = '¡Lo lograste! Actividad completada con éxito.',
  imagenSrc = '/logros/estrella-trofeo.png',
  sonido,
  vibracion,
}: AchievementCelebrationProps) {
  const reduceMotion = useReducedMotion();
  // `open` es intencional como disparador (no se usa dentro del cuerpo):
  // cada vez que la celebración se vuelve a abrir, se quiere una nueva
  // dispersión aleatoria de partículas, no la misma de la vez anterior.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const particulas = useMemo(() => generarParticulas(18), [open]);
  const cerroRef = useRef(false);

  useEffect(() => {
    if (!open) {
      cerroRef.current = false;
      return;
    }
    cerroRef.current = false;

    const sonidoActivo = sonido ?? leerAjuste('hablapronto_sonido', true);
    const vibracionActiva = vibracion ?? leerAjuste('hablapronto_vibracion', true);
    const temporizadores: ReturnType<typeof setTimeout>[] = [];

    if (sonidoActivo) {
      temporizadores.push(setTimeout(reproducirSonidoLogro, AUDIO_DELAY_MS));
    }
    if (vibracionActiva && typeof navigator !== 'undefined' && navigator.vibrate) {
      temporizadores.push(
        setTimeout(() => navigator.vibrate([25, 35, 25, 35, 60]), HAPTICS_DELAY_MS)
      );
    }

    const duracionTotalMs = reduceMotion ? REDUCED_MOTION_DURATION_S * 1000 + 400 : DISMISS_MS;
    temporizadores.push(
      setTimeout(() => {
        if (!cerroRef.current) {
          cerroRef.current = true;
          onClose();
        }
      }, duracionTotalMs)
    );

    return () => temporizadores.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--text-primary)_22%,transparent)] backdrop-blur-sm" />

          <span className="sr-only">{mensaje}</span>

          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            {/* trophy_shine: destello dorado anclado sobre el trofeo (76%, 20%), no al centro */}
            {!reduceMotion && (
              <motion.div
                className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: '76%',
                  top: '20%',
                  background:
                    'radial-gradient(circle, color-mix(in oklab, var(--brand-gold) 60%, transparent) 0%, transparent 70%)',
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.35, 1.1], opacity: [0, 0.85, 0] }}
                transition={{ duration: 0.9, delay: 1.05, times: [0, 0.45, 1], ease: 'easeOut' }}
              />
            )}

            {/* sparkle_burst: 18 partículas, abanico de 320° con origen ligeramente arriba del centro */}
            {!reduceMotion &&
              particulas.map((p) => {
                const radianes = (p.angulo * Math.PI) / 180;
                const dx = Math.cos(radianes) * p.distancia;
                const dy = Math.sin(radianes) * p.distancia;
                return (
                  <motion.span
                    key={p.id}
                    className="absolute left-1/2 top-[42%]"
                    initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                    animate={{
                      x: [0, dx * 0.6, dx],
                      y: [0, dy * 0.6 - 14, dy + 18],
                      opacity: [0, 1, 0],
                      rotate: [0, p.rotacion],
                    }}
                    transition={{
                      duration: 1.1,
                      delay: 1.2 + p.retraso,
                      times: [0, 0.5, 1],
                      ease: 'easeOut',
                    }}
                  >
                    {p.forma === 'estrella' ? (
                      <EstrellaSvg color={p.color} tamano={p.tamano} />
                    ) : (
                      <span
                        className="block rounded-sm"
                        style={{ width: p.tamano, height: p.tamano * 0.6, backgroundColor: p.color }}
                      />
                    )}
                  </motion.span>
                );
              })}

            {/* entrance + settle + happy_jump + celebration_wiggle: una sola línea de tiempo */}
            <motion.div
              initial={{ scale: 0.35, opacity: 0, y: 40, rotate: 0 }}
              animate={
                reduceMotion
                  ? { scale: 1, opacity: 1, y: 0, rotate: 0 }
                  : { opacity: OPACITY_KEYFRAMES, scale: SCALE_KEYFRAMES, y: Y_KEYFRAMES, rotate: ROTATE_KEYFRAMES }
              }
              transition={
                reduceMotion
                  ? { duration: REDUCED_MOTION_DURATION_S, ease: 'easeOut' }
                  : { duration: DURACION_TOTAL_S, times: TIMES, ease: EASES }
              }
              className="relative w-64 sm:w-72 lg:w-80 max-w-sm"
            >
              <Image
                src={imagenSrc}
                alt=""
                width={512}
                height={512}
                priority
                className="h-auto w-full select-none"
                draggable={false}
              />

              {/* banner_pulse: pulso de escala + brillo sobre la franja del banner, 1550-2400ms */}
              {!reduceMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-x-0 bottom-[6%] h-[22%] rounded-full"
                  style={{
                    background:
                      'radial-gradient(ellipse, color-mix(in oklab, var(--brand-gold) 45%, transparent) 0%, transparent 75%)',
                  }}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 0.75, 0.35, 0.6], scale: [1, 1.06, 0.98, 1] }}
                  transition={{ duration: 0.85, delay: 1.55, times: [0, 0.35, 0.7, 1], ease: 'easeInOut' }}
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
