import Link from 'next/link';

export const metadata = { title: 'Entrar — HablaPronto' };

// STUB de la Sesión 4 (login/auth real). Existe para que el enlace "Entrar"
// del header de la landing no sea un enlace muerto — ver ESTADO.md.
export default function LoginStubPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-5 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <h1 className="text-2xl font-bold [font-family:var(--font-display)]">
        Estamos construyendo el ingreso
      </h1>
      <p className="max-w-md text-base text-[var(--text-secondary)]">
        Muy pronto vas a poder entrar a tu cuenta de HablaPronto desde aquí.
      </p>
      <Link href="/" className="text-sm font-semibold text-[var(--accent)] underline">
        Volver a HablaPronto
      </Link>
    </div>
  );
}
