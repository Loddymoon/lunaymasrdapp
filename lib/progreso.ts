import { CURRICULO } from './curriculo';

/* Progreso del niño — persistido en localStorage (NO sessionStorage: la queja #1
   de la competencia, recogida por el usuario, es "cada vez que minimiza la app
   debe empezar de cero"). Sesión 6 sincroniza esto contra Supabase por cuenta;
   hasta entonces localStorage es la fuente de verdad, por dispositivo. */

const CLAVE = 'hablapronto_progreso';

export interface Progreso {
  completados: Record<string, string>; // retoId -> fecha ISO (YYYY-MM-DD) de cuando se completó
  racha: number;
  ultimaFecha: string | null; // última fecha (YYYY-MM-DD) con un reto completado
}

const PROGRESO_VACIO: Progreso = { completados: {}, racha: 0, ultimaFecha: null };

function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function diasEntre(a: string, b: string): number {
  const msPorDia = 86400000;
  return Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / msPorDia);
}

// Si localStorage falla (ej. navegación privada estricta), el camino se vería
// con TODO bloqueado — indistinguible de "perdiste tu progreso" sin este aviso
// (hallazgo del revisor-visual).
let errorAlmacenamiento = false;
export function huboErrorAlmacenamiento(): boolean {
  return errorAlmacenamiento;
}

export function leerProgreso(): Progreso {
  if (typeof window === 'undefined') return PROGRESO_VACIO;
  try {
    const raw = window.localStorage.getItem(CLAVE);
    errorAlmacenamiento = false;
    if (!raw) return PROGRESO_VACIO;
    const parsed = JSON.parse(raw);
    return { ...PROGRESO_VACIO, ...parsed };
  } catch {
    errorAlmacenamiento = true;
    return PROGRESO_VACIO;
  }
}

function guardarProgreso(p: Progreso) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(p));
    errorAlmacenamiento = false;
  } catch {
    /* localStorage puede fallar en navegación privada — el progreso de esta
       sesión no se pierde en memoria, solo no sobrevive a cerrar la app */
    errorAlmacenamiento = true;
  }
}

/** El primer reto sin completar — es donde el padre debe aterrizar siempre. */
export function retoActual(p: Progreso): (typeof CURRICULO)[number] {
  return CURRICULO.find((r) => !p.completados[r.id]) ?? CURRICULO[CURRICULO.length - 1];
}

export function yaCompletadoHoy(p: Progreso): boolean {
  return p.ultimaFecha === hoyISO();
}

/** Marca un reto como completado hoy y actualiza la racha. Idempotente: llamarlo
 * de nuevo el mismo día no rompe la racha ni duplica el conteo. */
export function completarReto(retoId: string): Progreso {
  const p = leerProgreso();
  const hoy = hoyISO();
  if (p.completados[retoId]) return p; // ya estaba completado, no reescribe fecha

  let racha = p.racha;
  if (!p.ultimaFecha) {
    racha = 1;
  } else if (p.ultimaFecha === hoy) {
    racha = p.racha; // ya completó algo hoy
  } else if (diasEntre(p.ultimaFecha, hoy) === 1) {
    racha = p.racha + 1; // día consecutivo
  } else {
    racha = 1; // se rompió la racha
  }

  const actualizado: Progreso = {
    completados: { ...p.completados, [retoId]: hoy },
    racha,
    ultimaFecha: hoy,
  };
  guardarProgreso(actualizado);
  return actualizado;
}

export function totalCompletados(p: Progreso): number {
  return Object.keys(p.completados).length;
}

/** Restaura un estado anterior tal cual (para el "Deshacer" tras completar un
 * reto por error — un toque accidental de un niño de 1-4 años cerca de la
 * pantalla es un escenario real, hallazgo del revisor-visual). */
export function restaurarProgreso(anterior: Progreso): Progreso {
  guardarProgreso(anterior);
  return anterior;
}
