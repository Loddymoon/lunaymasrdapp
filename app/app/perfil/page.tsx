'use client';

import { useState } from 'react';
import { Volume2, Vibrate } from 'lucide-react';

function leerAjuste(clave: string, porDefecto: boolean) {
  if (typeof window === 'undefined') return porDefecto;
  const v = window.localStorage.getItem(clave);
  return v === null ? porDefecto : v === 'true';
}

function leerNombreNino(): string {
  if (typeof window === 'undefined') return 'tu hijo';
  try {
    const raw = sessionStorage.getItem('hablapronto_onboarding');
    if (!raw) return 'tu hijo';
    const datos = JSON.parse(raw);
    return datos.nombre || 'tu hijo';
  } catch {
    return 'tu hijo';
  }
}

function Toggle({ activo, onChange }: { activo: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={activo}
      onClick={() => onChange(!activo)}
      className="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 [touch-action:manipulation]"
      style={{ background: activo ? 'var(--accent)' : 'color-mix(in oklab, var(--text-primary) 18%, transparent)' }}
    >
      <span
        className="absolute top-1 size-5 rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)] transition-[left] duration-200"
        style={{ left: activo ? 'calc(100% - 24px)' : '4px' }}
      />
    </button>
  );
}

/* Pantalla secundaria (checklist, sin gate de revisor-visual). Los mismos
   ajustes que ya lee components/shared/AchievementCelebration.tsx. */
export default function PerfilPage() {
  const [nombreNino] = useState(leerNombreNino);
  const [sonido, setSonido] = useState(() => leerAjuste('hablapronto_sonido', true));
  const [vibracion, setVibracion] = useState(() => leerAjuste('hablapronto_vibracion', true));

  function cambiarSonido(v: boolean) {
    setSonido(v);
    window.localStorage.setItem('hablapronto_sonido', String(v));
  }
  function cambiarVibracion(v: boolean) {
    setVibracion(v);
    window.localStorage.setItem('hablapronto_vibracion', String(v));
  }

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
      <h1 className="mb-6 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Perfil</h1>

      <div className="mb-6 flex items-center gap-4 rounded-[var(--radius-card)] border-2 border-[color-mix(in_oklab,var(--text-primary)_10%,transparent)] bg-[var(--surface)] p-4">
        <span className="flex size-14 items-center justify-center rounded-full border-2 border-b-[3px] border-[color-mix(in_oklab,var(--brand-coral)_65%,black)] bg-[var(--brand-coral)] text-[20px] font-bold text-[var(--surface)] [font-family:var(--font-display)]">
          {nombreNino.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-[16px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{nombreNino}</p>
          <p className="text-[12px] text-[var(--text-secondary)]">Practicando en HablaPronto</p>
        </div>
      </div>

      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Ajustes</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-[var(--radius-card)] border-2 border-[color-mix(in_oklab,var(--text-primary)_10%,transparent)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-3">
            <Volume2 size={18} color="var(--text-secondary)" />
            <span className="text-[14px] font-medium text-[var(--text-primary)]">Sonido de celebración</span>
          </div>
          <Toggle activo={sonido} onChange={cambiarSonido} />
        </div>
        <div className="flex items-center justify-between rounded-[var(--radius-card)] border-2 border-[color-mix(in_oklab,var(--text-primary)_10%,transparent)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-3">
            <Vibrate size={18} color="var(--text-secondary)" />
            <span className="text-[14px] font-medium text-[var(--text-primary)]">Vibración</span>
          </div>
          <Toggle activo={vibracion} onChange={cambiarVibracion} />
        </div>
      </div>
    </div>
  );
}
