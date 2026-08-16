import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Patrón canónico de docs/sistema/26-AUTH-MODERNO.md — copiar tal cual, no
// "optimizar". Sin esto el usuario se desloguea solo (los Server Components
// no pueden refrescar el token; el middleware corre en cada request y sí puede).
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: nada entre createServerClient y getUser(). getUser() valida
  // el JWT contra Supabase y dispara el refresh si el token expiró.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Modelo onboarding-first (ESTADO.md → Estrategia de monetización): el
  // funnel completo es público, SOLO /app exige sesión.
  const PUBLIC_PATHS = [
    '/', '/onboarding', '/paywall', '/login', '/auth', '/activar',
    '/terminos', '/privacidad', '/reembolsos',
  ];
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some(
    (p) => path === p || (p !== '/' && path.startsWith(p + '/'))
  );

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // IMPORTANTE: devolver supabaseResponse TAL CUAL (trae las cookies refrescadas).
  return supabaseResponse;
}
