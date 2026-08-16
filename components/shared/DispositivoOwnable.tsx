/* Dispositivo ownable de FICHA-ARTE.md: "burbuja de diálogo con cola + onda de
   sonido multicolor". Se documentó desde la Sesión 2 pero nunca se dibujó fuera
   de los mockups de identidad — el revisor-visual lo señaló repetidas veces como
   ausente tanto en la landing como en el onboarding/paywall. Este componente es
   la pieza reutilizable: burbuja + onda, en --accent-2 (el color de "hablar"). */
export function DispositivoOwnable({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 64 51"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 4h48a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H30l-9 9v-9H8a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6z"
        fill="var(--surface)"
        stroke="var(--accent-2)"
        strokeWidth="2.5"
      />
      <rect x="16" y="19" width="5" height="10" rx="2.5" fill="var(--accent-2)" opacity="0.55" />
      <rect x="25" y="13" width="5" height="22" rx="2.5" fill="var(--accent-2)" />
      <rect x="34" y="17" width="5" height="14" rx="2.5" fill="var(--accent-2)" opacity="0.8" />
      <rect x="43" y="10" width="5" height="28" rx="2.5" fill="var(--accent-2)" opacity="0.5" />
    </svg>
  );
}
