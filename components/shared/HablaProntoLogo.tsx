import Image from 'next/image';
import { motion } from 'motion/react';

export type HablaProntoLogoSize = 'small' | 'medium' | 'large' | 'hero';

interface HablaProntoLogoProps {
  size?: HablaProntoLogoSize;
  /** Fade-in + scale sutil (0.95 → 1, ~600ms) para splash/onboarding. Off por defecto
   * (un logo de header persistente no debe animar en cada render). */
  animar?: boolean;
  /** El archivo de origen (2026-08-13) ya tiene transparencia real — por defecto NO
   * se enmarca. Se deja el prop por si algún caller puntual lo necesita. */
  marco?: boolean;
  className?: string;
}

/* Ancho por tamaño — el alto se deriva solo (h-auto) del ratio real del archivo
   para que nunca se estire ni se recorte, tal como pide el isotipo: object-fit
   equivalente vía "h-auto w-full" + contenedor con ancho fijo. */
const ANCHOS: Record<HablaProntoLogoSize, string> = {
  small: 'w-24',
  medium: 'w-44',
  large: 'w-64',
  hero: 'w-80 sm:w-96',
};

/* "small" (headers/nav, junto a otro contenido) usa un recorte propio de SOLO el
   wordmark (sin las 5 caras) — el isotipo completo a ese tamaño no se lee (hallazgo
   del revisor-visual: 5 caras + texto compitiendo en ~90px de alto). El recorte
   conserva el diseño y el texto originales tal cual, solo cambia el encuadre. */
const ARCHIVOS: Record<HablaProntoLogoSize, { src: string; width: number; height: number }> = {
  small: { src: '/logo/wordmark-habla-pronto.png', width: 760, height: 430 },
  medium: { src: '/logo/isotipo-habla-pronto.png', width: 1536, height: 1024 },
  large: { src: '/logo/isotipo-habla-pronto.png', width: 1536, height: 1024 },
  hero: { src: '/logo/isotipo-habla-pronto.png', width: 1536, height: 1024 },
};

/**
 * Isotipo oficial de HablaPronto: imagen aportada por el usuario, sin redibujar
 * ni recolorear (el recorte "small" solo cambia el encuadre, no el diseño; el
 * archivo con transparencia real reemplazó al de fondo oscuro el 2026-08-13).
 * Ver ESTADO.md → nota de identidad visual.
 */
export function HablaProntoLogo({ size = 'medium', animar = false, marco = false, className = '' }: HablaProntoLogoProps) {
  const archivo = ARCHIVOS[size];
  const imagen = (
    <Image
      src={archivo.src}
      alt="Habla Pronto, aplicación infantil de aprendizaje y comunicación"
      width={archivo.width}
      height={archivo.height}
      priority={size === 'hero'}
      className="h-auto w-full select-none object-contain"
      draggable={false}
    />
  );

  const usarMarco = marco;
  const contenido = usarMarco ? (
    <div className="overflow-hidden rounded-[var(--radius-card)] border-2 border-b-[4px] border-[color-mix(in_oklab,var(--text-primary)_22%,transparent)] bg-[var(--surface)] p-1">
      {imagen}
    </div>
  ) : (
    imagen
  );

  if (!animar) {
    return <div className={`${ANCHOS[size]} ${className}`}>{contenido}</div>;
  }

  return (
    <motion.div
      className={`${ANCHOS[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {contenido}
    </motion.div>
  );
}
