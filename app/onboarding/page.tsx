'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, Volume2, Sparkles, Check, ShieldCheck } from 'lucide-react';
import { HablaProntoLogo } from '@/components/shared/HablaProntoLogo';
import { DispositivoOwnable } from '@/components/shared/DispositivoOwnable';

/* ============================================================================
   ONBOARDING — HablaPronto (Sesión 4)
   7 pantallas, una decisión por pantalla (02B regla 1). Las respuestas se
   guardan en sessionStorage (frontend-only por ahora — la persistencia real en
   Supabase se conecta en la Sesión 6, ver ESTADO.md). El paywall las lee de ahí
   para personalizar el resultado.
   Copy: NINGUNA promesa de plazo exacto — "primeros sonidos" se enmarca en la
   ventana de 60 días y "primeras palabras" en 30-60 días, siempre como apoyo a
   lo que ya hacen en casa, nunca como garantía del producto solo (pedido del
   usuario, 2026-08-12).
   ============================================================================ */

type Edad = '12-18m' | '18-24m' | '2-3a' | '3-4a';
type Nivel = 'senas' | 'palabras' | 'frases' | 'vocabulario';
type Meta = 'primeras-palabras' | 'vocales' | 'oraciones' | 'confianza';
type Momento = 'manana' | 'tarde' | 'noche';

interface Respuestas {
  nombre: string;
  edad?: Edad;
  nivel?: Nivel;
  meta?: Meta;
  momento?: Momento;
  minutos?: 5 | 10 | 15;
}

const EDAD_LABEL: Record<Edad, string> = {
  '12-18m': '12 a 18 meses',
  '18-24m': '18 a 24 meses',
  '2-3a': '2 a 3 años',
  '3-4a': '3 a 4 años',
};

const META_LABEL: Record<Meta, string> = {
  'primeras-palabras': 'Soltar sus primeras palabras',
  vocales: 'Pronunciar bien vocales y consonantes',
  oraciones: 'Empezar a armar oraciones sencillas',
  confianza: 'Ganar confianza y soltura al hablar',
};

const PASOS_CON_PROGRESO = ['nombre', 'edad', 'nivel', 'meta', 'momento', 'minutos'] as const;
type PasoId =
  | 'nombre'
  | 'edad'
  | 'nivel'
  | 'reconocimiento'
  | 'meta'
  | 'momento'
  | 'minutos'
  | 'cargando'
  | 'resultado';

const ORDEN: PasoId[] = ['nombre', 'edad', 'nivel', 'reconocimiento', 'meta', 'momento', 'minutos', 'cargando', 'resultado'];

// Si el padre ya había avanzado en el cuestionario (ej.: volvió desde el
// paywall con el botón "Volver", o solo alcanzó a escribir el nombre y
// recargó), restaura sus respuestas. Si las 5 preguntas con progreso están
// completas lo manda directo al resumen; si falta alguna, lo deja justo en la
// primera pregunta sin responder — nunca salta a "resultado" con datos a
// medias (regresión detectada por el revisor-visual: antes cualquier dato
// guardado, aunque fuera solo el nombre, saltaba directo al final). Se calcula
// una sola vez como inicializador perezoso de useState, no en un efecto — sin
// `sessionStorage` disponible (paso por servidor) simplemente arranca vacío.
function leerEstadoInicial(): { r: Respuestas; pasoIdx: number } {
  if (typeof window === 'undefined') return { r: { nombre: '' }, pasoIdx: 0 };
  try {
    const raw = sessionStorage.getItem('hablapronto_onboarding');
    if (!raw) return { r: { nombre: '' }, pasoIdx: 0 };
    const datos: Respuestas = JSON.parse(raw);
    const camposRequeridos: Array<[PasoId, keyof Respuestas]> = [
      ['edad', 'edad'],
      ['nivel', 'nivel'],
      ['meta', 'meta'],
      ['momento', 'momento'],
      ['minutos', 'minutos'],
    ];
    const faltante = camposRequeridos.find(([, campo]) => datos[campo] === undefined);
    return { r: datos, pasoIdx: ORDEN.indexOf(faltante ? faltante[0] : 'resultado') };
  } catch {
    return { r: { nombre: '' }, pasoIdx: 0 };
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [estadoInicial] = useState(leerEstadoInicial);
  const [pasoIdx, setPasoIdx] = useState(estadoInicial.pasoIdx);
  const [r, setR] = useState<Respuestas>(estadoInicial.r);
  const paso = ORDEN[pasoIdx];

  const progresoPct = useMemo(() => {
    const i = PASOS_CON_PROGRESO.indexOf(paso as (typeof PASOS_CON_PROGRESO)[number]);
    if (i === -1) return paso === 'reconocimiento' ? 50 : 100;
    return Math.round(((i + 1) / (PASOS_CON_PROGRESO.length + 1)) * 100);
  }, [paso]);

  function avanzar() {
    setPasoIdx((i) => Math.min(i + 1, ORDEN.length - 1));
  }
  function retroceder() {
    setPasoIdx((i) => Math.max(i - 1, 0));
  }
  function volverAMinutos() {
    setPasoIdx(ORDEN.indexOf('minutos'));
  }
  function omitir() {
    setPasoIdx(ORDEN.indexOf('cargando'));
  }
  function elegir<K extends keyof Respuestas>(campo: K, valor: Respuestas[K]) {
    setR((prev) => ({ ...prev, [campo]: valor }));
    setTimeout(avanzar, 380);
  }

  useEffect(() => {
    if (paso !== 'cargando') return;
    const t = setTimeout(avanzar, 2600);
    return () => clearTimeout(t);
  }, [paso]);

  useEffect(() => {
    // Se guarda en CADA cambio (no solo al llegar a "resultado"): si el padre
    // toca "volver" y sale del cuestionario a mitad de camino, el nombre que ya
    // escribió no se pierde (hallazgo del revisor-visual).
    try {
      sessionStorage.setItem('hablapronto_onboarding', JSON.stringify(r));
    } catch {
      /* sessionStorage puede fallar en navegación privada — no bloquea el flujo */
    }
  }, [r]);

  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      <header className="flex items-center gap-3 px-5 pt-5">
        {paso === 'cargando' ? (
          // Sin botón de volver mientras carga: sale a mitad de una animación de
          // sistema no es una pregunta que se pueda "deshacer" — hallazgo del revisor.
          <span className="size-9 shrink-0" aria-hidden="true" />
        ) : paso === 'resultado' ? (
          <button
            aria-label="Volver a mis respuestas"
            onClick={volverAMinutos}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"
          >
            <ChevronLeft size={22} />
          </button>
        ) : pasoIdx > 0 ? (
          <button
            aria-label="Volver a la pregunta anterior"
            onClick={retroceder}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <Link href="/" aria-label="Volver a HablaPronto" className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]">
            <ChevronLeft size={22} />
          </Link>
        )}
        <div
          role="progressbar"
          aria-label="Progreso del cuestionario"
          aria-valuenow={progresoPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-live="polite"
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]"
        >
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${progresoPct}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
          />
        </div>
        {PASOS_CON_PROGRESO.includes(paso as (typeof PASOS_CON_PROGRESO)[number]) && (
          <button
            onClick={omitir}
            className="shrink-0 text-[12.5px] font-semibold text-[var(--text-tertiary)]"
          >
            Omitir
          </button>
        )}
      </header>

      <main className="flex flex-1 flex-col px-5 pb-10 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={paso}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            className="mx-auto flex w-full max-w-[420px] flex-1 flex-col"
          >
            {paso === 'nombre' && (
              <PantallaNombre
                nombre={r.nombre}
                onNombre={(n) => setR((p) => ({ ...p, nombre: n }))}
                onContinuar={avanzar}
              />
            )}
            {paso === 'edad' && <PantallaEdad edad={r.edad} onElegir={(v) => elegir('edad', v)} />}
            {paso === 'nivel' && <PantallaNivel nivel={r.nivel} onElegir={(v) => elegir('nivel', v)} />}
            {paso === 'reconocimiento' && <PantallaReconocimiento onContinuar={avanzar} />}
            {paso === 'meta' && <PantallaMeta meta={r.meta} onElegir={(v) => elegir('meta', v)} />}
            {paso === 'momento' && <PantallaMomento momento={r.momento} onElegir={(v) => elegir('momento', v)} />}
            {paso === 'minutos' && <PantallaMinutos minutos={r.minutos} onElegir={(v) => elegir('minutos', v)} />}
            {paso === 'cargando' && <PantallaCargando />}
            {paso === 'resultado' && (
              <PantallaResultado
                respuestas={r}
                onContinuar={() => router.push('/paywall')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ── Bloques compartidos ─────────────────────────────────────────────────── */

/* Dispositivo ownable de FICHA-ARTE.md — familia de mascotas rotativas. "Rufo el
   zorro" (coral) es la principal; "la nube" (violeta) y "la gotita" (cian) rotan en
   otras preguntas para que no se sienta repetitivo (pedido explícito de la ficha). */
function MascotaMini({ variante = 'coral' }: { variante?: 'coral' | 'violeta' | 'cian' | 'dorado' }) {
  const color =
    variante === 'coral' ? 'var(--brand-coral)'
    : variante === 'violeta' ? 'var(--brand-violet)'
    : variante === 'dorado' ? 'var(--brand-gold)'
    : 'var(--brand-cyan)';
  return (
    <div className="mb-3 flex justify-center">
      <svg width="96" height="96" viewBox="0 0 64 64" fill="none">
        {/* Contorno "sticker" de 2.5px en las formas principales (pedido de
            FICHA-ARTE, hallazgo del revisor: sin stroke se lee como blob relleno
            en vez del dispositivo ownable de la marca). */}
        <path d="M13 23 19 3 29 20z" fill={color} stroke="var(--text-primary)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M17 19.5 20.5 8 25.5 18.5z" fill="var(--surface)" opacity="0.65" />
        <path d="M51 23 45 3 35 20z" fill={color} stroke="var(--text-primary)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M47 19.5 43.5 8 38.5 18.5z" fill="var(--surface)" opacity="0.65" />
        {/* Cola de zorro asomando (hallazgo del revisor: a 96px se confundía con
            gato) — pincelada curva con la misma punta clara de las orejas. */}
        <path d="M49 42c7 1 9 9 3 14-2.5 2-6 2-7.5-1 3-.5 5-3 4.5-6-3 1-6-.5-6.5-3.5 2.5 0 5-1.5 6.5-3.5z" fill={color} stroke="var(--text-primary)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M46 51.5c1-1.5 1.5-3 1-4.5" stroke="var(--surface)" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
        <ellipse cx="32" cy="36" rx="21" ry="19" fill={color} stroke="var(--text-primary)" strokeWidth="2.5" />
        <circle cx="25" cy="33" r="3.6" fill="var(--surface)" />
        <circle cx="39" cy="33" r="3.6" fill="var(--surface)" />
        <circle cx="25" cy="34" r="1.9" fill="var(--text-primary)" />
        <circle cx="39" cy="34" r="1.9" fill="var(--text-primary)" />
        {/* Hocico: nariz + bozo claro, más grande para leerse a este tamaño
            (hallazgo del revisor: la versión anterior era imperceptible). */}
        <ellipse cx="32" cy="40.5" rx="6" ry="4.5" fill="var(--surface)" opacity="0.55" />
        <path d="M29 39h6l-3 4z" fill="var(--text-primary)" />
        <path d="M27 45.5c2.4 2 8.6 2 11 0" stroke="var(--text-primary)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* Ancla el tercio inferior de cada pregunta con contenido real (wayfinding), en vez
   de dejar vacío muerto — pedido explícito del revisor-visual. */
function PasoFooter({ numero }: { numero: number }) {
  return (
    <div className="mt-auto flex items-center justify-center gap-2 pt-6 pb-2 text-[11px] font-semibold text-[var(--text-tertiary)]">
      <span>Pregunta {numero} de 6</span>
      <span aria-hidden="true">·</span>
      <span>Tus respuestas ajustan el plan de tu hijo</span>
    </div>
  );
}

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-6 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
      {children}
    </h1>
  );
}

function OpcionBloque({
  label,
  sub,
  onClick,
  index = 0,
  seleccionado = false,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
  index?: number;
  seleccionado?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : index * 0.06, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="mb-4 flex w-full flex-col items-start rounded-[var(--radius-card)] border-2 border-b-[6px] bg-[var(--surface)] px-5 py-4 text-left [touch-action:manipulation] active:border-b-[3px] active:translate-y-[3px]"
      style={{
        borderColor: seleccionado ? 'var(--accent)' : 'color-mix(in oklab, var(--text-primary) 14%, transparent)',
        borderBottomColor: seleccionado ? 'var(--accent)' : undefined,
        background: seleccionado ? 'color-mix(in oklab, var(--accent) 8%, var(--surface))' : undefined,
      }}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="text-[17px] font-semibold text-[var(--text-primary)]">{label}</span>
        <AnimatePresence>
          {seleccionado && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--surface)]"
            >
              <Check size={14} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {sub && <span className="mt-1 text-[13px] text-[var(--text-secondary)]">{sub}</span>}
    </motion.button>
  );
}

/* ── Pantallas ────────────────────────────────────────────────────────────── */

function PantallaNombre({
  nombre,
  onNombre,
  onContinuar,
}: {
  nombre: string;
  onNombre: (v: string) => void;
  onContinuar: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  // SIEMPRE se resuelve a un initial/animate concreto (nunca un objeto vacío):
  // useReducedMotion() puede resolver DESPUÉS del primer render, y si ese
  // segundo render deja de pasar la prop `animate` a medio camino de la
  // transición, Motion no la completa — el elemento queda atascado en
  // opacity:0 para siempre (bug real encontrado por el revisor-visual).
  const entrada = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : delay, ease: 'easeOut' as const },
  });

  useEffect(() => {
    // Foco diferido: si se enfoca de entrada (autoFocus nativo) el teclado del
    // celular salta a mitad de la animación de entrada — se espera a que el
    // stagger termine (hallazgo del revisor: "un paso extra evitable" pedía
    // autoFocus, la ronda anterior lo había quitado por el salto prematuro).
    const t = setTimeout(() => inputRef.current?.focus(), reduceMotion ? 0 : 500);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  return (
    <form
      /* Única pantalla del flujo que centra verticalmente: es la "bienvenida"
         de 1 solo campo, no una pregunta con 3-4 opciones — incluso apps como
         Duolingo tratan la pantalla de nombre distinto a las de selección.
         Ya se intentó pt-6 uniforme (ronda 8): dejó ~300px de vacío muerto
         antes del pie, el anti-patrón que el propio sistema prohíbe. */
      className="flex flex-1 flex-col justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        onContinuar();
      }}
    >
      <motion.div {...entrada(0)}>
        <MascotaMini variante="coral" />
      </motion.div>
      <motion.div {...entrada(0.06)}>
        <Titulo>
          ¿Cómo se <span className="text-[var(--accent-2)]">llama</span> tu hijo o hija?
        </Titulo>
      </motion.div>
      <motion.p {...entrada(0.12)} className="-mt-4 mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        Así vas a ver su nombre en cada reto — puedes dejarlo en blanco.
      </motion.p>
      <motion.label {...entrada(0.18)} className="mb-8 block">
        <span className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">Su nombre (opcional)</span>
        <input
          ref={inputRef}
          value={nombre}
          onChange={(e) => onNombre(e.target.value)}
          placeholder="Ej: Mateo"
          autoComplete="given-name"
          className="w-full rounded-[var(--radius-button)] border-2 border-[color-mix(in_oklab,var(--text-primary)_14%,transparent)] bg-[color-mix(in_oklab,var(--surface-2)_35%,var(--surface))] px-4 py-3 text-[16px] text-[var(--text-primary)] shadow-[inset_0_2px_5px_rgba(51,41,28,0.15)] outline-none focus-visible:border-[var(--accent-2)]"
        />
      </motion.label>
      <motion.button
        {...entrada(0.24)}
        type="submit"
        whileTap={{ scale: 0.97 }}
        className="hablapronto-cta relative flex h-14 w-full items-center justify-center overflow-hidden rounded-[var(--radius-button)] border-[2.5px] px-8 text-[17px] font-bold text-[var(--bg)] [touch-action:manipulation]"
      >
        <span className="hablapronto-cta-sheen pointer-events-none absolute -left-8 -top-4 h-14 w-24" aria-hidden="true" />
        Continuar
      </motion.button>
      <motion.div {...entrada(0.3)} className="mt-6 flex flex-col items-center gap-2">
        <DispositivoOwnable size={48} />
        <p className="flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
          <ShieldCheck size={13} strokeWidth={2.5} />
          Tu información está segura y nunca se comparte
        </p>
      </motion.div>
      <p className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-[var(--text-tertiary)]">
        <span>Pregunta 1 de 6</span>
        <span aria-hidden="true">·</span>
        <span>Tus respuestas ajustan el plan de tu hijo</span>
      </p>
    </form>
  );
}

function PantallaEdad({ edad, onElegir }: { edad?: Edad; onElegir: (v: Edad) => void }) {
  return (
    <div className="flex flex-1 flex-col pt-6">
      <MascotaMini variante="coral" />
      <Titulo>¿Qué edad tiene tu hijo o hija?</Titulo>
      <p className="-mt-4 mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        Si comparas a tu hijo con otros niños de su edad y te preocupa el ritmo, no estás sola — cada edad tiene sus propios sonidos clave, y empezamos por los correctos.
      </p>
      {(Object.keys(EDAD_LABEL) as Edad[]).map((e, i) => (
        <OpcionBloque key={e} index={i} seleccionado={edad === e} label={EDAD_LABEL[e]} onClick={() => onElegir(e)} />
      ))}
      <PasoFooter numero={2} />
    </div>
  );
}

function PantallaNivel({ nivel, onElegir }: { nivel?: Nivel; onElegir: (v: Nivel) => void }) {
  return (
    <div className="flex flex-1 flex-col pt-6">
      <MascotaMini variante="violeta" />
      <Titulo>¿Cómo se comunica hoy?</Titulo>
      <p className="-mt-4 mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">Sin juicios — esto solo ajusta el punto de partida de su plan.</p>
      <OpcionBloque index={0} seleccionado={nivel === 'senas'} label="Solo señala o hace sonidos" onClick={() => onElegir('senas')} />
      <OpcionBloque index={1} seleccionado={nivel === 'palabras'} label="Dice palabras sueltas" sub={'Ej: "mamá", "agua"'} onClick={() => onElegir('palabras')} />
      <OpcionBloque index={2} seleccionado={nivel === 'frases'} label="Dice frases cortas pero le cuesta pronunciar" onClick={() => onElegir('frases')} />
      <OpcionBloque index={3} seleccionado={nivel === 'vocabulario'} label="Habla y quiere ampliar su vocabulario" onClick={() => onElegir('vocabulario')} />
      <PasoFooter numero={3} />
    </div>
  );
}

function PantallaReconocimiento({ onContinuar }: { onContinuar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--brand-coral)_16%,transparent)]">
        <Sparkles size={30} color="var(--brand-coral)" />
      </div>
      <p className="mb-2 text-[19px] font-bold leading-snug text-[var(--text-primary)] [font-family:var(--font-display)]">
        Muchos papás y mamás llegan aquí sin saber si van al ritmo esperado
      </p>
      <p className="mb-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        Y no es que estén haciendo algo mal — es que nadie les dio un método claro para practicar en casa, unos minutos al día.
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onContinuar}
        className="hablapronto-cta relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-[var(--radius-button)] border-[2.5px] px-8 text-[17px] font-bold text-[var(--bg)] [touch-action:manipulation]"
      >
        <span className="hablapronto-cta-sheen pointer-events-none absolute -left-8 -top-4 h-14 w-24" aria-hidden="true" />
        Entiendo, sigamos
      </motion.button>
    </div>
  );
}

function PantallaMeta({ meta, onElegir }: { meta?: Meta; onElegir: (v: Meta) => void }) {
  return (
    <div className="flex flex-1 flex-col pt-6">
      <MascotaMini variante="cian" />
      <Titulo>¿Cuál es la meta de este mes?</Titulo>
      <p className="-mt-4 mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">Elegimos UNA meta a la vez — así el reto diario tiene un enfoque claro, no diez cosas a medias.</p>
      {(Object.keys(META_LABEL) as Meta[]).map((m, i) => (
        <OpcionBloque key={m} index={i} seleccionado={meta === m} label={META_LABEL[m]} onClick={() => onElegir(m)} />
      ))}
      <PasoFooter numero={4} />
    </div>
  );
}

function PantallaMomento({ momento, onElegir }: { momento?: Momento; onElegir: (v: Momento) => void }) {
  return (
    <div className="flex flex-1 flex-col pt-6">
      <MascotaMini variante="dorado" />
      <Titulo>¿En qué momento del día van a practicar?</Titulo>
      <p className="-mt-4 mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">Con esto elegimos la hora de tu recordatorio diario.</p>
      <OpcionBloque index={0} seleccionado={momento === 'manana'} label="En la mañana" onClick={() => onElegir('manana')} />
      <OpcionBloque index={1} seleccionado={momento === 'tarde'} label="Después del almuerzo" onClick={() => onElegir('tarde')} />
      <OpcionBloque index={2} seleccionado={momento === 'noche'} label="En la noche, antes de dormir" onClick={() => onElegir('noche')} />
      <PasoFooter numero={5} />
    </div>
  );
}

function PantallaMinutos({ minutos, onElegir }: { minutos?: 5 | 10 | 15; onElegir: (v: 5 | 10 | 15) => void }) {
  return (
    <div className="flex flex-1 flex-col pt-6">
      <MascotaMini variante="coral" />
      <Titulo>¿Cuánto tiempo pueden practicar juntos al día?</Titulo>
      <p className="-mt-4 mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">Empezar corto y ser constante rinde más que sesiones largas y salteadas.</p>
      <OpcionBloque index={0} seleccionado={minutos === 5} label="5 minutos" sub="Recomendado — lo que dura un reto" onClick={() => onElegir(5)} />
      <OpcionBloque index={1} seleccionado={minutos === 10} label="10 minutos" onClick={() => onElegir(10)} />
      <OpcionBloque index={2} seleccionado={minutos === 15} label="15 minutos" onClick={() => onElegir(15)} />
      <PasoFooter numero={6} />
    </div>
  );
}

const MENSAJES_CARGA = [
  'Analizando la etapa del habla...',
  'Seleccionando ejercicios de fonética en español neutro...',
  'Armando el Método de los 5 Minutos, a su medida...',
];

function PantallaCargando() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => Math.min(v + 1, MENSAJES_CARGA.length - 1)), 850);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <HablaProntoLogo size="small" animar className="mb-8" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        className="mb-6 flex size-16 items-center justify-center rounded-full border-4 border-[var(--surface-2)] border-t-[var(--accent-2)]"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-[16px] font-semibold text-[var(--text-primary)]"
        >
          {MENSAJES_CARGA[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function PantallaResultado({ respuestas, onContinuar }: { respuestas: Respuestas; onContinuar: () => void }) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const [errorAudio, setErrorAudio] = useState(false);
  const nombreNino = respuestas.nombre?.trim() || 'tu hijo';

  function reproducirDemo() {
    setReproduciendo(true);
    setErrorAudio(false);
    try {
      const u = new SpeechSynthesisUtterance('A. Araña.');
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

  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.45 }}
        className="mb-5 flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)]"
      >
        <Check size={30} color="var(--accent-2)" strokeWidth={3} />
      </motion.div>
      <h1 className="mb-2 text-balance text-[24px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
        El <span className="text-[var(--accent-2)]">Método de los 5 Minutos</span> de {nombreNino} está listo
      </h1>
      <p className="mb-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
        Empezamos por la letra <strong className="text-[var(--text-primary)]">A</strong>.
      </p>
      <p className="mb-6 text-[12.5px] leading-relaxed text-[var(--text-tertiary)]">
        Referencia, no promesa: los primeros sonidos suelen llegar en los primeros 60 días, y apoya lo que ya haces en casa — no reemplaza a su pediatra.
      </p>

      <button
        onClick={reproducirDemo}
        className="mb-8 flex w-full items-center gap-4 rounded-[var(--radius-card)] border-2 border-[color-mix(in_oklab,var(--text-primary)_14%,transparent)] bg-[var(--surface)] px-5 py-4 text-left [touch-action:manipulation]"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[color-mix(in_oklab,var(--brand-cyan)_16%,transparent)]">
          <Volume2 size={22} color="var(--brand-cyan)" />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-bold text-[var(--text-primary)]">{reproduciendo ? 'Reproduciendo…' : 'Escuchar cómo suena'}</span>
          <span className="block text-[12.5px] text-[var(--text-secondary)]">Así practican la letra A hoy</span>
        </span>
      </button>
      {errorAudio && (
        <p className="-mt-6 mb-8 text-[12.5px] text-[var(--text-tertiary)]">
          Tu navegador no pudo reproducir el audio de muestra — dentro de la app vas a escuchar las voces humanas reales sin problema.
        </p>
      )}

      <div className="mt-auto w-full">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onContinuar}
          className="hablapronto-cta relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-[var(--radius-button)] border-[2.5px] px-8 text-[17px] font-bold text-[var(--bg)] [touch-action:manipulation]"
        >
          <span className="hablapronto-cta-sheen pointer-events-none absolute -left-8 -top-4 h-14 w-24" aria-hidden="true" />
          Ver mi plan y empezar
        </motion.button>
      </div>
    </div>
  );
}
