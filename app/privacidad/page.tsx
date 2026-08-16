import Link from 'next/link';

export const metadata = { title: 'Privacidad — HablaPronto' };

export default function PrivacidadPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <Link href="/" className="text-sm font-semibold text-[var(--accent)]">
          ← Volver a HablaPronto
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
          Aviso de privacidad
        </h1>
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">
          Última actualización: pendiente de fecha de lanzamiento — este texto se revisa por completo
          antes de publicar la app (ver 47-LEGAL-FISCAL-Y-PRIVACIDAD.md).
        </p>

        <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Qué datos recogemos</h2>
            <p className="mt-2">
              Para usar HablaPronto necesitamos el correo de quien crea la cuenta (el padre, la madre,
              tutor o cuidador — nunca del niño directamente) y el nombre y edad del niño para adaptar
              los retos. También guardamos el progreso de los retos completados.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Datos de menores de edad</h2>
            <p className="mt-2">
              HablaPronto está diseñada para usarse en compañía de un adulto. No recogemos datos del
              niño más allá de su nombre, edad y su progreso dentro de los retos. No compartimos esta
              información con terceros para fines publicitarios.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cómo usamos tus datos</h2>
            <p className="mt-2">
              Usamos tu correo para gestionar tu cuenta, tu prueba gratis y los avisos antes de
              cualquier cobro. No vendemos tus datos ni los de tu hijo a nadie.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tus derechos</h2>
            <p className="mt-2">
              Puedes pedir que borremos tu cuenta y la de tu hijo en cualquier momento escribiendo a{' '}
              <a href="mailto:soporte@hablapronto.com" className="underline">
                soporte@hablapronto.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
