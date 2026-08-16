'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { CURRICULO } from '@/lib/curriculo';
import { leerProgreso, totalCompletados, type Progreso } from '@/lib/progreso';

/* Pantalla secundaria (checklist, sin gate de revisor-visual). Panel de
   progreso por sonido — lo que ESTADO.md llama "inversión" del loop de hábito:
   crece cada día y es lo que el padre "pierde" si no sigue usando la app. */
export default function AvancePage() {
  const [progreso] = useState<Progreso | null>(() => leerProgreso());

  if (!progreso) return null;
  const total = totalCompletados(progreso);
  const pct = Math.round((total / CURRICULO.length) * 100);

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
      <h1 className="mb-1 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Avance del aprendizaje</h1>
      <p className="mb-5 text-[13px] text-[var(--text-secondary)]">{total} de {CURRICULO.length} sonidos dominados</p>

      <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>

      <ul className="flex flex-col gap-2">
        {CURRICULO.map((reto) => {
          const completado = Boolean(progreso.completados[reto.id]);
          return (
            <li
              key={reto.id}
              className={`flex items-center gap-3 rounded-[var(--radius-card)] border-2 px-4 py-3 ${completado ? 'border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_6%,var(--surface))]' : 'border-[color-mix(in_oklab,var(--text-primary)_8%,transparent)] bg-[var(--surface)]'}`}
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[15px] font-bold [font-family:var(--font-display)]"
                style={{
                  background: completado ? 'var(--accent)' : 'color-mix(in oklab, var(--text-primary) 8%, transparent)',
                  color: completado ? 'var(--surface)' : 'var(--text-tertiary)',
                }}
              >
                {completado ? <Check size={16} strokeWidth={3} /> : reto.letra}
              </span>
              <div className="flex-1">
                <p className={`text-[14px] font-semibold ${completado ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>{reto.palabra}</p>
              </div>
              {completado && progreso.completados[reto.id] && (
                <span className="text-[11px] text-[var(--text-tertiary)]">{progreso.completados[reto.id]}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
