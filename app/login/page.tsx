'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ShieldCheck, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DispositivoOwnable } from '@/components/shared/DispositivoOwnable';

/* Login real — Sesión 6. Enlace mágico + código de 6 dígitos en el mismo
   correo (el "combo" de docs/sistema/26-AUTH-MODERNO.md): el enlace puede
   abrirse en otro dispositivo/app de correo y crear la sesión en el lugar
   equivocado — el código siempre funciona donde el padre empezó. Mensajes
   genéricos en todo el flujo (anti-enumeración): nunca revela si el correo
   existe o no. */

type Estado = 'email' | 'enviado' | 'verificando';

function leerParam(nombre: string, porDefecto: string): string {
  if (typeof window === 'undefined') return porDefecto;
  return new URLSearchParams(window.location.search).get(nombre) ?? porDefecto;
}

export default function LoginPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const supabase = createClient();

  const [siguiente] = useState(() => leerParam('next', '/app'));
  const [erroInicial] = useState(() => leerParam('error', ''));

  const [estado, setEstado] = useState<Estado>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(
    erroInicial === 'enlace_invalido' ? 'Ese enlace ya venció o no es válido. Pide uno nuevo abajo.' : ''
  );
  const [cooldown, setCooldown] = useState(0);

  const entrada = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : delay, ease: 'easeOut' as const },
  });

  function iniciarCooldown() {
    setCooldown(30);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function enviarAcceso() {
    if (enviando || cooldown > 0) return;
    setEnviando(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(siguiente)}` },
    });
    setEnviando(false);
    // Anti-enumeración (26-AUTH-MODERNO.md): NUNCA revelar si la cuenta existe
    // o no — ese caso pasa "enviado" con el mismo mensaje de siempre. Solo se
    // muestran los errores que NO delatan nada de la cuenta: formato de correo
    // inválido (útil, corrige un typo) y límite de envíos (evita spam real).
    if (err?.code === 'email_address_invalid') {
      setError('Ese correo no parece válido — revísalo e intenta de nuevo.');
      return;
    }
    if (err?.code === 'over_email_send_rate_limit' || err?.status === 429) {
      setError('Ya pediste varios accesos seguidos — espera un momento antes de intentar de nuevo.');
      return;
    }
    if (err && err.status && err.status >= 500) {
      setError('No pudimos enviar el correo — revisa tu conexión e intenta de nuevo.');
      return;
    }
    setEstado('enviado');
    iniciarCooldown();
  }

  async function verificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setError('');
    const { error: err } = await supabase.auth.verifyOtp({ email, token: codigo, type: 'email' });
    setEnviando(false);
    if (err) {
      setError('Ese código no es correcto o ya venció. Puedes pedir uno nuevo.');
      return;
    }
    router.push(siguiente);
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col [font-family:var(--font-body)]">
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link
          href="/"
          aria-label="Volver a HablaPronto"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"
        >
          <ChevronLeft size={22} />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-5 pb-10 pt-6">
        {estado === 'email' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void enviarAcceso();
            }}
          >
            <motion.div {...entrada(0)} className="mb-3 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-[color-mix(in_oklab,var(--accent-2)_55%,black)] bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)]">
                <Mail size={26} color="var(--accent-2)" strokeWidth={2.5} />
              </div>
            </motion.div>
            <motion.h1
              {...entrada(0.06)}
              className="mb-2 text-balance text-center text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
            >
              Entra a tu cuenta
            </motion.h1>
            <motion.p {...entrada(0.12)} className="mb-6 text-center text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Sin contraseñas. Te mandamos un enlace y un código a tu correo.
            </motion.p>
            <motion.label {...entrada(0.18)} className="mb-4 block">
              <span className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">Tu correo</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                autoFocus
                className="w-full rounded-[var(--radius-button)] border-2 border-[color-mix(in_oklab,var(--text-primary)_14%,transparent)] bg-[color-mix(in_oklab,var(--surface-2)_35%,var(--surface))] px-4 py-3 text-[16px] text-[var(--text-primary)] shadow-[inset_0_2px_5px_rgba(51,41,28,0.15)] outline-none focus-visible:border-[var(--accent-2)]"
              />
            </motion.label>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-[13px] text-[var(--brand-coral)]">
                {error}
              </motion.p>
            )}
            <motion.button
              {...entrada(0.24)}
              type="submit"
              disabled={enviando}
              whileTap={{ scale: 0.97 }}
              className="hablapronto-cta relative flex h-14 w-full items-center justify-center overflow-hidden rounded-[var(--radius-button)] border-[2.5px] px-8 text-[17px] font-bold text-[var(--bg)] disabled:opacity-60 [touch-action:manipulation]"
            >
              <span className="hablapronto-cta-sheen pointer-events-none absolute -left-8 -top-4 h-14 w-24" aria-hidden="true" />
              {enviando ? 'Enviando…' : 'Enviarme el acceso'}
            </motion.button>
            <motion.div {...entrada(0.3)} className="mt-6 flex flex-col items-center gap-2">
              <DispositivoOwnable size={40} />
              <p className="flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
                <ShieldCheck size={13} strokeWidth={2.5} />
                Tu información está segura y nunca se comparte
              </p>
            </motion.div>
          </form>
        ) : (
          <form onSubmit={verificarCodigo}>
            <motion.div {...entrada(0)} className="mb-3 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-[color-mix(in_oklab,var(--accent)_55%,black)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
                <Mail size={26} color="var(--accent)" strokeWidth={2.5} />
              </div>
            </motion.div>
            <motion.h1
              {...entrada(0.06)}
              className="mb-2 text-balance text-center text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
            >
              Revisa tu correo
            </motion.h1>
            <motion.p {...entrada(0.12)} className="mb-6 text-center text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Le mandamos un enlace a <span className="font-semibold text-[var(--text-primary)]">{email}</span>. También
              puedes escribir el código de 6 dígitos aquí:
            </motion.p>
            <motion.label {...entrada(0.18)} className="mb-4 block">
              <span className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">Código de 6 dígitos</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoFocus
                className="w-full rounded-[var(--radius-button)] border-2 border-[color-mix(in_oklab,var(--text-primary)_14%,transparent)] bg-[color-mix(in_oklab,var(--surface-2)_35%,var(--surface))] px-4 py-3 text-center text-[22px] tracking-[0.4em] text-[var(--text-primary)] shadow-[inset_0_2px_5px_rgba(51,41,28,0.15)] outline-none focus-visible:border-[var(--accent)]"
              />
            </motion.label>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-[13px] text-[var(--brand-coral)]">
                {error}
              </motion.p>
            )}
            <motion.button
              {...entrada(0.24)}
              type="submit"
              disabled={enviando || codigo.length !== 6}
              whileTap={{ scale: 0.97 }}
              className="hablapronto-cta relative flex h-14 w-full items-center justify-center overflow-hidden rounded-[var(--radius-button)] border-[2.5px] px-8 text-[17px] font-bold text-[var(--bg)] disabled:opacity-60 [touch-action:manipulation]"
            >
              <span className="hablapronto-cta-sheen pointer-events-none absolute -left-8 -top-4 h-14 w-24" aria-hidden="true" />
              {enviando ? 'Verificando…' : 'Entrar'}
            </motion.button>
            <motion.div {...entrada(0.3)} className="mt-5 flex flex-col items-center gap-2 text-center">
              <button
                type="button"
                disabled={cooldown > 0}
                onClick={() => void enviarAcceso()}
                className="text-[13px] font-semibold text-[var(--text-tertiary)] underline underline-offset-2 disabled:no-underline disabled:opacity-60"
              >
                {cooldown > 0 ? `Reenviar código en ${cooldown}s` : 'Reenviar código'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEstado('email');
                  setCodigo('');
                  setError('');
                }}
                className="text-[13px] text-[var(--text-tertiary)]"
              >
                Usar otro correo
              </button>
            </motion.div>
          </form>
        )}
      </main>
    </div>
  );
}
