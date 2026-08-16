'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BottomNav } from '@/components/shared/BottomNav';

/* Shell de la app interna (Sesión 5) — min-h-dvh + nav al fondo (Regla de Oro 7:
   evita el vacío muerto bajo la nav). Sin auth todavía: esta ruta no está
   protegida por login (Sesión 6 la conecta a Supabase); hoy es accesible
   directo para poder construirla y probarla. */
export default function AppInternaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
            className="flex flex-1 flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
