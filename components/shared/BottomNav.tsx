'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, Route, Trophy, User, TrendingUp } from 'lucide-react';

const DESTINOS = [
  { href: '/app', label: 'Inicio', icon: Home },
  { href: '/app/camino', label: 'Camino', icon: Route },
  { href: '/app/puntuacion', label: 'Puntos', icon: Trophy },
  { href: '/app/perfil', label: 'Perfil', icon: User },
  { href: '/app/avance', label: 'Avance', icon: TrendingUp },
] as const;

/* Nav inferior de la app interna — 5 destinos (máximo permitido, docs/copy/
   app-interna-blueprint.md). El tab activo usa --accent-2 (naranja "toca aquí" /
   elemento activo de FICHA-ARTE) — el verde --accent queda EXCLUSIVO del CTA de
   "seguir/continuar" dentro de cada pantalla, nunca de la navegación. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-20 border-t border-[color-mix(in_oklab,var(--text-primary)_8%,transparent)] bg-[var(--surface)] [padding-bottom:env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex w-full max-w-[440px] items-stretch justify-between px-2">
        {DESTINOS.map(({ href, label, icon: Icon }) => {
          const activo = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={activo ? 'page' : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-center [touch-action:manipulation]"
            >
              <motion.span whileTap={{ scale: 0.88 }} className="relative flex flex-col items-center gap-1">
                <Icon
                  size={22}
                  strokeWidth={activo ? 2.5 : 2}
                  color={activo ? 'var(--accent-2)' : 'var(--text-tertiary)'}
                  fill={activo ? 'color-mix(in oklab, var(--accent-2) 18%, transparent)' : 'none'}
                />
                <span className={`text-[11px] ${activo ? 'font-bold text-[var(--accent-2)]' : 'font-medium text-[var(--text-tertiary)]'}`}>
                  {label}
                </span>
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
