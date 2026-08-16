import Link from 'next/link';

export const metadata = { title: 'Términos y Condiciones — HablaPronto' };

export default function TerminosPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <Link href="/" className="text-sm font-semibold text-[var(--accent)]">
          ← Volver a HablaPronto
        </Link>
        <h1 className="mt-6 text-3xl font-bold [font-family:var(--font-display)]">
          Términos y condiciones
        </h1>
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">
          Última actualización: pendiente de fecha de lanzamiento — este texto se revisa por completo
          antes de publicar la app (ver 47-LEGAL-FISCAL-Y-PRIVACIDAD.md).
        </p>

        <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Qué es HablaPronto</h2>
            <p className="mt-2">
              HablaPronto es una aplicación educativa de apoyo, pensada para usarse en compañía de un
              padre, madre, tutor o cuidador. Ofrece retos diarios de estimulación del habla para niños
              de 1 a 4 años.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              HablaPronto no es un servicio médico
            </h2>
            <p className="mt-2">
              HablaPronto no diagnostica, no trata y no cura ninguna condición del habla o del lenguaje.
              No reemplaza la evaluación ni la guía de un médico, fonoaudiólogo o especialista en
              desarrollo del lenguaje. Si te preocupa el desarrollo del habla de tu hijo, consulta
              siempre a un profesional.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Suscripción y cobro</h2>
            <p className="mt-2">
              HablaPronto se ofrece con una prueba gratuita de 7 días. Antes de que termine, te avisamos
              por correo y dentro de la app la fecha y el monto exactos del primer cobro. Puedes
              cancelar en cualquier momento desde tu cuenta.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cuentas de menores</h2>
            <p className="mt-2">
              La cuenta la crea y administra siempre un adulto responsable del niño. HablaPronto no
              permite que un menor cree su propia cuenta.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
