'use client';

import { useState } from 'react';
import { Flame, Star, Trophy, Lock } from 'lucide-react';
import { CURRICULO } from '@/lib/curriculo';
import { leerProgreso, totalCompletados, type Progreso } from '@/lib/progreso';

interface Logro {
  titulo: string;
  detalle: string;
  icon: typeof Flame;
  color: string;
  conseguido: (p: Progreso, total: number) => boolean;
}

const LOGROS: Logro[] = [
  { titulo: 'Primer paso', detalle: 'Completa tu primer reto', icon: Star, color: 'var(--brand-gold)', conseguido: (_p, total) => total >= 1 },
  { titulo: '3 días seguidos', detalle: 'Practica 3 días seguidos', icon: Flame, color: 'var(--brand-coral)', conseguido: (p) => p.racha >= 3 },
  { titulo: '5 sonidos dominados', detalle: 'Completa 5 retos', icon: Trophy, color: 'var(--brand-cyan)', conseguido: (_p, total) => total >= 5 },
  { titulo: 'Curso completo', detalle: `Completa los ${CURRICULO.length} retos`, icon: Trophy, color: 'var(--brand-violet)', conseguido: (_p, total) => total >= CURRICULO.length },
];

/* Pantalla secundaria (checklist, sin gate de revisor-visual — CLAUDE.md). */
export default function PuntuacionPage() {
  const [progreso] = useState<Progreso | null>(() => leerProgreso());

  if (!progreso) return null;
  const total = totalCompletados(progreso);

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
      <h1 className="mb-6 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Tus logros</h1>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-card)] border-2 border-b-[4px] border-[color-mix(in_oklab,var(--brand-gold)_60%,black)] bg-[color-mix(in_oklab,var(--brand-gold)_12%,transparent)] p-4 text-center">
          <Flame size={22} color="var(--brand-gold)" className="mx-auto mb-1" fill="var(--brand-gold)" />
          <p className="text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{progreso.racha}</p>
          <p className="text-[12px] text-[var(--text-secondary)]">Días seguidos</p>
        </div>
        <div className="rounded-[var(--radius-card)] border-2 border-b-[4px] border-[color-mix(in_oklab,var(--brand-cyan)_60%,black)] bg-[color-mix(in_oklab,var(--brand-cyan)_12%,transparent)] p-4 text-center">
          <Trophy size={22} color="var(--brand-cyan)" className="mx-auto mb-1" />
          <p className="text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{total}</p>
          <p className="text-[12px] text-[var(--text-secondary)]">Sonidos dominados</p>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {LOGROS.map((logro) => {
          const conseguido = logro.conseguido(progreso, total);
          const Icon = logro.icon;
          return (
            <li
              key={logro.titulo}
              className={`flex items-center gap-3 rounded-[var(--radius-card)] border-2 p-4 ${conseguido ? 'border-[color-mix(in_oklab,var(--text-primary)_10%,transparent)] bg-[var(--surface)]' : 'border-[color-mix(in_oklab,var(--text-primary)_8%,transparent)] bg-[color-mix(in_oklab,var(--text-primary)_3%,transparent)]'}`}
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: conseguido ? `color-mix(in oklab, ${logro.color} 16%, transparent)` : 'color-mix(in oklab, var(--text-primary) 8%, transparent)' }}
              >
                {conseguido ? <Icon size={20} color={logro.color} /> : <Lock size={16} color="var(--text-tertiary)" />}
              </span>
              <div>
                <p className={`text-[14px] font-semibold ${conseguido ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>{logro.titulo}</p>
                <p className="text-[12px] text-[var(--text-tertiary)]">{logro.detalle}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
