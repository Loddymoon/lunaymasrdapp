import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Adonde llega el enlace del correo de acceso (magic link). Ver
// docs/sistema/26-AUTH-MODERNO.md — el link y el código de 6 dígitos
// (verificado en /login) son dos caminos al mismo signInWithOtp.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/app';

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirect(next);
    }
  }

  // Enlace inválido, vencido o ya usado: mensaje genérico (anti-enumeración,
  // 26-AUTH-MODERNO.md) — nunca detallar la causa exacta.
  return NextResponse.redirect(new URL('/login?error=enlace_invalido', request.url));
}
