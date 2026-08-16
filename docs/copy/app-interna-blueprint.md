# BLUEPRINT DE LA APP INTERNA — aportado por el usuario, 2026-08-12

> Guardado para ejecutarlo en la Sesión 5 (App interna simplificada). NO se construye todavía —
> estamos cerrando la Sesión 4 (onboarding + paywall, corrigiendo defectos del revisor-visual).

## Navegación inferior (5 destinos — el máximo permitido por las reglas del SO)
1. **Inicio** — el reto del día (lo que hoy es la pantalla "Reto de hoy" del mockup del carrusel)
2. **Camino** — el recorrido/mapa de progreso que va recorriendo el niño. Precisión del usuario
   (2026-08-13): estilo "camino serpenteante conectado" tipo **Candy Crush Saga** — nodos (uno por
   reto/día) unidos por una línea curva que serpentea de abajo hacia arriba, no una lista ni una
   grilla. Estado de cada nodo: completado (relleno + check) · actual (destacado, el que sigue) ·
   bloqueado (atenuado, candado sutil). El nodo "actual" es donde debe aterrizar el padre al abrir
   esta pantalla (scroll automático a su posición, no arranca desde el nodo 1 cada vez).
3. **Puntuación** — logros, monedas o puntos ganados
4. **Perfil** — datos del niño y de la familia
5. **Avance del aprendizaje** — el panel de progreso por sonido/palabra (lo que hoy es la sección
   "Progreso" del mockup)

## Persistencia del progreso — REQUISITO DURO (2026-08-13, pedido explícito del usuario) — RESUELTO 2026-08-16
"Cada vez que se consiga un logro, aunque el usuario salga de pantalla o se desconecte, al volver
debe encontrar el logro y seguir donde dejó los retos." Esto es texto casi literal de la regla de
oro de retención (ver Regla de Oro 6 de CLAUDE.md: "si borro tu historial, ¿la app de mañana es
idéntica?" — aquí es al revés: si el padre cierra la app, mañana NO debe verse idéntica a hoy, el
progreso de hoy debe seguir ahí). Implementación por capas:
- Sesión 5 (sin backend aún): progreso en `localStorage` (NO `sessionStorage` — sessionStorage se
  borra al cerrar la pestaña/app, exactamente el bug que se cita abajo). Persiste en el mismo
  dispositivo aunque el padre cierre y reabra la app.
- Sesión 6 (con Supabase): el `localStorage` se sincroniza a la tabla de progreso real ligada a la
  cuenta, para que el progreso también sobreviva un cambio de dispositivo — no reemplaza el local,
  lo respalda (el local sigue sirviendo de caché para carga instantánea).
- Gate de cierre para CUALQUIER pantalla que toque progreso/logros: cerrar la app a mitad de un
  reto, reabrir, y confirmar que aparece exactamente donde se dejó — no en el nodo 1 del Camino.

## Aprendizajes de competencia (quejas reales recogidas por el usuario, 2026-08-13 — comentarios de
Facebook/Instagram sobre Speech Blubs y apps similares del nicho). Cada uno se convierte en una
regla de construcción para HablaPronto, no en una feature nueva:
- "Cada vez que minimiza la app debe empezar de cero" → la razón de ser del requisito de
  persistencia de arriba. Es la queja #1 y la más repetida.
- "Pagué y me dice que debo pagar otra vez" / cobros duplicados → el webhook de Hotmart en Sesión 6
  necesita idempotencia real (ya estaba anotado en la auditoría del 2026-08-13, esto lo confirma
  con evidencia de mercado, sube de prioridad).
- "Cada que quiero iniciar sesión me marca error" → el login (Supabase Auth, Sesión 6) tiene que
  ser robusto y probado de verdad antes de lanzar, no un mejor-esfuerzo.
- "En español es horrible... el ciervo, el ciervo, la vaca la vaca" → confirma la decisión ya
  tomada de usar grabaciones humanas reales en español neutro (nunca traducción automática ni
  voces sintéticas) — no aflojar esta decisión por costo o velocidad.
- "No la uso y me acaba de cobrar" / no saben cómo cancelar → la cancelación tiene que ser
  self-service, visible, sin trámite ni contactar soporte — refuerza el dolor #1 de FICHA-AVATAR.
- "Es estafa" (sentimiento repetido) → confirma que la transparencia de cobro ya es la apuesta
  correcta de HablaPronto (dolor #1), pero también que hay que EJECUTARLA impecable — un solo error
  de cobro o un login roto el día del lanzamiento cuesta la reputación entera.

## Feature RETIRADA: grabación y comparación de voz del niño
- El usuario la propuso (grabar al niño diciendo una palabra, comparar cada 15 días) y luego pidió
  quitarla si yo consideraba que traía problemas — 2026-08-12. Decisión: SÍ, se retira del alcance.
- Por qué: la voz de un menor es un dato sensible (roza datos biométricos); exige consentimiento
  explícito, política de retención/borrado clara y almacenamiento seguro adicional (Supabase
  Storage) — carga legal y de infraestructura real para una función que no es parte de la promesa
  central (retos guiados de 5 min/día), sino un "bonus" de V2. Choca además con el diferenciador
  #1 de HablaPronto (transparencia y confianza) si no se ejecuta impecable desde el día 1.
- Si en el futuro se retoma: NO antes de que 47-LEGAL-FISCAL-Y-PRIVACIDAD.md defina el consentimiento
  y la retención, y solo como V2 tras validar el producto base.

## Componente de celebración (adelantado en Sesión 4, listo para Sesión 5)
- `components/shared/AchievementCelebration.tsx` ya existe: overlay con la estrella+trofeo+banner
  en pop-bounce, salto, destello dorado, confeti (colores de la familia mascota/recompensa
  brand-cyan/gold/coral/violet, nunca accent/accent-2), pulso del banner y desaparición — ~2.3s,
  prefers-reduced-motion respetado, sonido y vibración con apagado (localStorage
  `hablapronto_sonido` / `hablapronto_vibracion`, default encendidos).
- Uso: `<AchievementCelebration open={mostrar} onClose={() => setMostrar(false)} />` — se dispara
  cuando el niño completa un reto correctamente (pantalla "Inicio"/reto del día de la Sesión 5).
- Asset RESUELTO: `public/logros/estrella-trofeo.png` ya existe y está verificado (2026-08-13).

## Nota de estilo (aplicada ya en Sesión 4, seguir en Sesión 5)
El usuario pidió pantallas más vivas: colores más vívidos (ya ampliamos la paleta con
--brand-cyan/gold/coral/violet), bordes con sombra más oscura en los botones para que se sientan
"presionables", y feedback de tap rápido y consistente en TODOS los botones — no solo los
principales.
