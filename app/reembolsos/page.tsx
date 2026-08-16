import Link from 'next/link';

export const metadata = { title: 'Reembolsos — HablaPronto' };

export default function ReembolsosPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <Link href="/" className="text-sm font-semibold text-[var(--accent)]">
          ← Volver a HablaPronto
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
          Política de reembolsos
        </h1>
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">
          Última actualización: pendiente de fecha de lanzamiento — este texto se revisa por completo
          antes de publicar la app (ver 47-LEGAL-FISCAL-Y-PRIVACIDAD.md).
        </p>

        <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              La Garantía Habla Tranquila
            </h2>
            <p className="mt-2">
              Tienes 14 días desde tu primer cobro para pedir el reembolso completo de HablaPronto,
              sin necesidad de explicar por qué. Solo escríbenos.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cómo pedirlo</h2>
            <p className="mt-2">
              Escribe a{' '}
              <a href="mailto:soporte@hablapronto.com" className="underline">
                soporte@hablapronto.com
              </a>{' '}
              con el correo con el que te registraste. Procesamos los reembolsos a través de Hotmart,
              la plataforma que gestiona tu compra.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cancelar no es lo mismo que reembolsar</h2>
            <p className="mt-2">
              Puedes cancelar tu suscripción cuando quieras desde tu cuenta, sin costo — eso detiene
              cobros futuros. El reembolso, además, te devuelve el último cobro si estás dentro de la
              ventana de 14 días.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
