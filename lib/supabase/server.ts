import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server Components no pueden escribir cookies (el warning de setAll() es
// esperado ahí — el middleware es quien de verdad refresca la sesión, ver
// lib/supabase/middleware.ts). Usar en Server Components/Route Handlers.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            /* llamado desde un Server Component — el middleware refresca la sesión */
          }
        },
      },
    }
  );
}
