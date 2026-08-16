import Link from 'next/link';

export const metadata = { title: 'Activando tu prueba — HablaPronto' };

// STUB de la Sesión 4. El cobro real (checkout de Hotmart + webhook) se conecta
// en la Sesión 6 — ver ESTADO.md → Secuencia maestra → Servicios externos.
// Existe para que el CTA del paywall no sea un enlace muerto.
export default function ActivarStubPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-5 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <h1 className="text-2xl font-bold [font-family:var(--font-display)]">
        ¡Ya casi! Falta conectar el cobro real
      </h1>
      <p className="max-w-md text-base text-[var(--text-secondary)]">
        Aquí vas a poder activar tus 7 días gratis con tarjeta, de forma segura. Todavía estamos
        conectando esa parte — vuelve pronto.
      </p>
      <Link href="/" className="text-sm font-semibold text-[var(--accent)] underline">
        Volver a HablaPronto
      </Link>
    </div>
  );
}
