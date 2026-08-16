'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence, animate } from 'motion/react';
import { Volume2, Flame, Check, Undo2 } from 'lucide-react';
import { AchievementCelebration } from '@/components/shared/AchievementCelebration';
import { DispositivoOwnable } from '@/components/shared/DispositivoOwnable';
import { CURRICULO } from '@/lib/curriculo';
import { leerProgreso, completarReto, restaurarProgreso, retoActual, yaCompletadoHoy, totalCompletados, huboErrorAlmacenamiento, type Progreso } from '@/lib/progreso';

const VENTANA_DESHACER_MS = 12000;

const ITEM_VARIANTS = {
  oculto: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const } },
};

/* Número de la racha con conteo animado al montar/cambiar — baseline de
   animación obligatoria del SO para números héroe (hallazgo del revisor). */
function RachaAnimada({ valor }: { valor: number }) {
  const reduceMotion = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduceMotion ? valor : 0);
  useEffect(() => {
    if (reduceMotion) return; // ya viene correcto desde el useState inicial
    const controls = animate(0, valor, { duration: 0.6, ease: 'easeOut', onUpdate: (v) => setMostrado(Math.round(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);
  return <>{mostrado}</>;
}

/* Reto del día — pantalla "Inicio" de la Sesión 5. No hay reconocimiento de voz
   por IA (decisión de ESTADO.md): el padre practica CON el niño y toca "Ya
   practicamos" — el mismo patrón honesto que ya usa el onboarding con el demo
   de audio (speechSynthesis como reemplazo temporal de las grabaciones reales,
   pendientes de que el usuario las produzca). */
export default function InicioPage() {
  const reduceMotion = useReducedMotion();
  // Inicializadores perezosos (no useEffect): leerProgreso()/huboErrorAlmacenamiento()
  // ya traen su propio guard de `typeof window` para el paso por servidor, así
  // que no hace falta un efecto solo para sincronizar el estado en el montaje
  // (evita setState síncrono dentro de un efecto).
  const [progreso, setProgreso] = useState<Progreso | null>(() => leerProgreso());
  const [reproduciendo, setReproduciendo] = useState(false);
  const [errorAudio, setErrorAudio] = useState(false);
  const [celebrar, setCelebrar] = useState(false);
  const [progresoAntes, setProgresoAntes] = useState<Progreso | null>(null);
  const deshacerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [errorGuardado, setErrorGuardado] = useState(() => huboErrorAlmacenamiento());

  useEffect(() => {
    return () => {
      if (deshacerTimeoutRef.current) clearTimeout(deshacerTimeoutRef.current);
    };
  }, []);

  if (!progreso) return null; // evita parpadeo mientras se lee localStorage

  const reto = retoActual(progreso);
  const siguienteReto = CURRICULO[CURRICULO.indexOf(reto) + 1];
  const completadoHoy = yaCompletadoHoy(progreso);
  const total = totalCompletados(progreso);

  function reproducirDemo() {
    setReproduciendo(true);
    setErrorAudio(false);
    try {
      const u = new SpeechSynthesisUtterance(reto.fraseDemo);
      u.lang = 'es-419';
      u.rate = 0.85;
      u.onend = () => setReproduciendo(false);
      u.onerror = () => {
        setReproduciendo(false);
        setErrorAudio(true);
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      setReproduciendo(false);
      setErrorAudio(true);
    }
  }

  function marcarCompletado() {
    const antes = progreso;
    const actualizado = completarReto(reto!.id);
    setProgreso(actualizado);
    setErrorGuardado(huboErrorAlmacenamiento());
    setCelebrar(true);
    setProgresoAntes(antes);
    if (deshacerTimeoutRef.current) clearTimeout(deshacerTimeoutRef.current);
    deshacerTimeoutRef.current = setTimeout(() => setProgresoAntes(null), VENTANA_DESHACER_MS);
  }

  function deshacer() {
    if (!progresoAntes) return;
    setProgreso(restaurarProgreso(progresoAntes));
    setProgresoAntes(null);
    if (deshacerTimeoutRef.current) clearTimeout(deshacerTimeoutRef.current);
  }

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--text-secondary)]">Hola de nuevo</p>
          <h1 className="text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            El reto de hoy
          </h1>
        </div>
        {/* Es un dato informativo, no un botón — sin el borde "sticker" grueso
            que en el resto de la app siempre marca algo tocable (hallazgo del
            revisor: se leía como botón sin acción). */}
        <div className="flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--brand-gold)_35%,transparent)] bg-[color-mix(in_oklab,var(--brand-gold)_12%,transparent)] px-3 py-1.5">
          <Flame size={16} color="var(--brand-gold)" fill="var(--brand-gold)" />
          <span className="text-[16px] font-bold text-[var(--text-primary)]">
            <RachaAnimada valor={progreso.racha} />
          </span>
        </div>
      </header>

      {errorGuardado && (
        <p className="mb-4 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--brand-coral)_14%,transparent)] px-3 py-2 text-center text-[12px] text-[var(--text-secondary)]">
          No pudimos guardar en este navegador — practiquen igual, pero puede no verse la próxima vez.
        </p>
      )}

      <AnimatePresence mode="wait">
        {completadoHoy ? (
          <motion.div
            key="completado"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[var(--radius-card)] border-2 border-b-[5px] border-[color-mix(in_oklab,var(--accent)_55%,black)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] px-6 py-10 text-center"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)]">
              <Check size={30} color="var(--accent)" strokeWidth={3} />
            </div>
            <p className="text-[22px] font-bold leading-snug text-[var(--text-primary)] [font-family:var(--font-display)]">
              ¡Ya practicaron hoy!
            </p>
            <p className="max-w-[26ch] text-[13px] leading-relaxed text-[var(--text-secondary)]">
              Vuelvan mañana por el siguiente sonido. Llevan {total} de {CURRICULO.length} sonidos dominados.
            </p>
            <DispositivoOwnable size={44} />
            {progresoAntes && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 flex flex-col items-center gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={deshacer}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-tertiary)] underline underline-offset-2 [touch-action:manipulation]"
                >
                  <Undo2 size={13} />
                  ¿Tocaste por error? Deshacer
                </motion.button>
                {/* Barra que se agota: el enlace no debe desaparecer en silencio
                    (hallazgo del revisor) — esto avisa cuánto tiempo queda. */}
                <div className="h-1 w-24 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-primary)_10%,transparent)]">
                  <motion.div
                    className="h-full rounded-full bg-[var(--text-tertiary)]"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: VENTANA_DESHACER_MS / 1000, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reto"
            initial="oculto"
            animate="visible"
            variants={{ oculto: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
            className="flex flex-1 flex-col justify-center gap-5"
          >
            <motion.div
              variants={ITEM_VARIANTS}
              className="flex flex-col items-center gap-5 rounded-[var(--radius-card)] border-2 border-b-[5px] border-[color-mix(in_oklab,var(--text-primary)_16%,transparent)] bg-[var(--surface)] px-6 py-9 text-center"
            >
              <span className="flex size-24 items-center justify-center rounded-[var(--radius-card)] border-2 border-b-[4px] border-[color-mix(in_oklab,var(--accent-2)_55%,black)] bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)] text-[56px] font-bold text-[var(--accent-2)] [font-family:var(--font-display)]">
                {reto.letra}
              </span>
              <div>
                <p className="text-[18px] font-bold text-[var(--accent-2)] [font-family:var(--font-display)]">{reto.palabra}</p>
                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Practiquen esta palabra juntos, un par de veces</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={reproducirDemo}
                className="flex items-center gap-2 rounded-full border-2 border-[color-mix(in_oklab,var(--text-primary)_14%,transparent)] bg-[var(--bg)] px-4 py-2 text-[13px] font-semibold text-[var(--text-primary)] [touch-action:manipulation]"
              >
                <Volume2 size={16} color="var(--brand-cyan)" />
                {reproduciendo ? 'Reproduciendo…' : 'Escuchar cómo suena'}
              </motion.button>
              {errorAudio && (
                <p className="text-[13px] text-[var(--text-tertiary)]">
                  Tu navegador no pudo reproducir el audio — pueden seguir practicando igual.
                </p>
              )}
            </motion.div>

            {siguienteReto && (
              <motion.p variants={ITEM_VARIANTS} className="flex items-center justify-center gap-1.5 text-[13px] text-[var(--text-tertiary)]">
                Mañana: <span className="font-semibold text-[var(--text-secondary)]">{siguienteReto.letra} de {siguienteReto.palabra}</span>
              </motion.p>
            )}

            <motion.button
              variants={ITEM_VARIANTS}
              whileTap={{ scale: 0.97 }}
              onClick={marcarCompletado}
              className="hablapronto-cta relative flex h-14 w-full items-center justify-center overflow-hidden rounded-[var(--radius-button)] border-[2.5px] px-8 text-[16px] font-bold text-[var(--bg)] [touch-action:manipulation]"
            >
              <span className="hablapronto-cta-sheen pointer-events-none absolute -left-8 -top-4 h-14 w-24" aria-hidden="true" />
              ¡Ya practicamos!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AchievementCelebration open={celebrar} onClose={() => setCelebrar(false)} />
    </div>
  );
}
