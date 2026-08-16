# ESTADO — HablaPronto
Última actualización: 2026-08-16 | Sesión actual: 6

⏸️ CHECKPOINT — Sesión 6 (integraciones reales y seguridad) en curso, siguiendo
docs/sistema/62-PUBLICACION-SEGURA-Y-CONTINUA.md fases P0-P1 (preparación local antes de tocar
GitHub/Vercel/Supabase — cero secretos en chat). Hecho: inventario P0 (sin repo git, sin CLIs de
vercel/supabase/gh instaladas), `.gitignore` creado, `.env.example` creado (solo nombres de
variables, sin valores secretos), `eslint.config.mjs` ajustado para ignorar `plantillas-codigo/` y
`scripts/` (no son código de la app desplegada). Corregidos 8 errores reales de lint
(`react-hooks/set-state-in-effect`, patrón "seteo de estado dentro de un efecto en el montaje" que
dispara renders en cascada) en: `components/landing/Oferta.tsx`, `app/paywall/page.tsx` (x2),
`app/app/page.tsx` (x3), `components/shared/AchievementCelebration.tsx`, y recién
`app/onboarding/page.tsx` (el más complejo: restauraba 2 estados a la vez desde sessionStorage —
convertido a inicializadores perezosos de useState, efecto eliminado por completo).
Siguiente paso exacto: correr `npm run lint` de nuevo para confirmar cero errores reales
(faltaba revisar si `app/app/camino/page.tsx`, `puntuacion/page.tsx`, `perfil/page.tsx` y
`avance/page.tsx` tienen el mismo patrón, más 2-3 warnings menores sueltos de rondas anteriores) →
`tsc --noEmit` + `npm run build` → `git init` + primer commit → pedirle al usuario crear el
repositorio en GitHub para conectar. Las pantallas de producto (landing/onboarding/paywall/
app-inicio/app-camino) siguen "NO LISTA" — pausadas a propósito, ver Problemas conocidos.
🧩 Aparte #1 (a pedido del usuario): `components/shared/AchievementCelebration.tsx` — celebración al completar un reto, coreografía calcada del JSON del usuario, imagen real ya copiada a `public/logros/estrella-trofeo.png` (el usuario la había guardado en la raíz del proyecto como "ChatGPT Image 13 ago...png"; NO se tocó el otro archivo similar de un perrito que también dejó en la raíz, ni "aguafiestas.png" — no pedidos). Verificado renderizando en vivo (capturas a 800ms/1400ms): pop, confeti y banner se ven bien. tsc ✓ build ✓. NO integrado a ninguna pantalla todavía (Sesión 5).

🧩 Aparte #2 (a pedido del usuario — RESUELTO, ejecutado): pidió usar una imagen nueva (5 niños + wordmark "Habla Pronto") como isotipo oficial. Se preguntó el alcance (reemplaza la identidad ya aprobada) y el usuario eligió "reemplazar en toda la app", aceptando perder la aprobación de landing/onboarding/paywall. Ejecutado: `components/shared/HablaProntoLogo.tsx` (tamaños small/medium/large/hero, prop `marco` porque el archivo no trae fondo transparente — se enmarca en tarjeta mientras no llegue una versión limpia), imagen en `public/logo/isotipo-habla-pronto.png`, ya en el header de la landing (`app/page.tsx`→`Hero`), header del paywall, y pantalla de carga del onboarding. FICHA-ARTE.md actualizada con la nota de este cambio. Pendiente (Sesión 5, pantallas que no existen aún): menú, perfil, logros, modal de felicitación, favicon (este último necesita un recorte simplificado — la composición completa no se lee a 16-32px).

🐛 Bug real encontrado por el revisor-visual (no relacionado al logo, afectaba TODA la app desde que se creó): `tokens.css` referenciaba la fuente como string literal `'Baloo 2'`, pero `next/font` (en `app/layout.tsx`) la expone como variable `--font-baloo` con un nombre interno distinto — el string nunca hacía match y la app completa (landing incluida, que ya había sido aprobada) estaba cayendo en silencio a Segoe UI. CORREGIDO: `tokens.css` ahora usa `var(--font-baloo)`. También se corrigieron las orejas de la mascota "Rufo" (se leían como cuernos de diablito, no zorro) + nariz agregada, en onboarding y paywall.

Ronda extra de correcciones (2026-08-13, tras 3ª revisión de landing/onboarding/paywall — landing 35/40 usab. muy cerca, onboarding 32/40, paywall 28/40): (1) el header pequeño del isotipo no se leía (5 caras + texto en ~90px) → se creó un recorte propio `public/logo/wordmark-habla-pronto.png` (SOLO el wordmark, mismo diseño y texto, solo cambia el encuadre) para el tamaño `small`, sin marco de tarjeta; el isotipo completo con las 5 caras se reserva para tamaños medium/large/hero. (2) Los 3 wrappers de página (`app/page.tsx`, `onboarding`, `paywall`) tenían un `bg-[var(--bg)]` opaco que tapaba el degradé de profundidad que ya existía en `globals.css` → quitado, ahora se ve. (3) Paywall: bloque de confianza/garantía comprimido, botón con manejo de error de conexión + reintento, barra de CTA fijo ahora respeta `prefers-reduced-motion`. (4) Onboarding: nariz de zorro agregada, ícono de check con spring de entrada en la pantalla resultado, jerarquía tipográfica separada (15px cuerpo / 12px label / 11px footer), párrafo de la pantalla "edad" fusionado en uno. Capturas nuevas tomadas, 4ª ronda de revisión relanzada sobre las 3.

Ronda extra 2 (2026-08-13, tras 4ª revisión — landing 34/40 subió craft a 18/20, onboarding 31/40 craft 13/20, paywall 29/40 craft 13/20): (1) recorte del wordmark re-hecho más ajustado (todavía queda un residuo fotográfico mínimo en una esquina — el revisor lo sigue marcando en la landing/paywall como choque de estilo "3D glossy vs. kit plano", no solo por el recorte). (2) Degradé de fondo subido de 6-8% a 16-20% de opacidad + 3ra banda de color (antes "imperceptible" según 2 revisores distintos). (3) Onboarding: el campo de nombre se separó en su propia pantalla ("Pregunta 1 de 6") en vez de compartir la pantalla de edad — reduce la densidad que se venía repitiendo como defecto; mascota agrandada a 96px con hocico más grande; radio del botón "Escuchar audio" unificado; auto-avance de tarjetas subido de 220ms a 380ms + check visual de confirmación; label de opciones subido a 17px. (4) Paywall: radio de PlanCard unificado a --radius-card, indicador de selección (radio circle) agregado a ambas tarjetas de plan. RESUELTO (2026-08-13): el usuario mandó la versión del isotipo CON FONDO TRANSPARENTE REAL
("imagen sin fondo 5 ninos.png", verificado con sharp: alpha=0 en las 4 esquinas). Reemplazó a
`public/logo/isotipo-habla-pronto.png`; se regeneró `public/logo/wordmark-habla-pronto.png` (el
recorte solo-wordmark para tamaño `small`) desde este archivo nuevo. `HablaProntoLogo.tsx` ya NO
enmarca en tarjeta por defecto (`marco = false`) — el defecto #1 que se repetía en CASI TODAS las
rondas de landing y paywall (el choque de un rectángulo con fondo ajeno contra el kit plano)
debería quedar resuelto de raíz. También esta ronda: mascota "Rufo" con contorno sticker de 2-2.5px
en onboarding (antes se leía como blob relleno) + hocico más grande también en el badge del
paywall; el botón "Volver" del paywall ya no borra las 6 respuestas del cuestionario (onboarding
ahora restaura sessionStorage al montar y salta directo al resumen); radio del chip de beneficio
del paywall tokenizado; pantalla "nombre" del onboarding con stagger de entrada + Enter-para-continuar.
5ª ronda de revisor-visual relanzada sobre las 3 pantallas — si esta tampoco cierra el gate
(≥36/40 usab. y ≥16/20 craft), parar el loop automático y reportarle al usuario el estado real en
vez de seguir iterando a ciegas (ya llevamos 5+ rondas en cada pantalla).

## Qué es esta app (3 líneas máximo)
App que guía a padres y madres de niños de 1 a 4 años a estimular el desarrollo del habla (vocales, consonantes, primeras palabras) con retos diarios de 5 minutos adaptados a la edad exacta del niño, con voces humanas reales en español neutro. Monetización: suscripción con prueba gratuita de 7 días.

## Promesa central
"HablaPronto ayuda a padres y madres de niños de 1 a 4 años a estimular el desarrollo del habla de sus hijos sin pagar terapias costosas ni caer en cobros sorpresa, mediante retos diarios de 5 minutos con voces humanas reales adaptados a la edad exacta del niño."

## Reporte de validación (Sesión 1)
- Veredicto: Excelente oportunidad
- Apps de referencia: Speech Blubs (4.6★ App Store, pero quejas activas de cobro), Kinedu (9M+ familias, respaldo Stanford, quejas de cuestionarios largos y cobro anticipado), Lingokids ($14.99/mes, 4.5★, quejas de precio "carísimo")
- Lo que los usuarios odian de la competencia (nuestra oportunidad): cobros sin avisar tras el trial + difícil cancelar · cuestionarios largos antes de dejar usar la app · voces mal pronunciadas/con acento raro · precio percibido como injusto
- Brecha LATAM confirmada: sí — ninguna de las 3 grandes está especializada 100% en fonética en español neutro; todas son apps genéricas de desarrollo infantil traducidas
- Precio de referencia del mercado: $14.99/mes (Lingokids, confirmado 2026-08-12) — ver FICHA-MERCADO.md

## Dirección de Arte (Sesión 2 — NO cambiar sin justificación)
- FICHA-ARTE.md: existe y aprobada — 2026-08-12
- ¿Hubo referencia visual del usuario?: SÍ (2 capturas de Pinterest, estilo "bubble letter" infantil) → usada como GUÍA DE ESTILO, fusionada con la tabla de líderes (Duolingo/Lingokids/Kinedu), no clonada 1:1
- Resumen: fondo #FDF8EC · superficie #FFFEF7 · texto #33291C · Display/Body "Baloo 2" · radio 16-26px
- Multi-acento funcional (cada color = un significado fijo): naranja #F28C1B = acción de hablar/grabar · verde #3FB57D = "seguir/continuar" (EXCLUSIVO, no usar para nada más) · cian #2FA8D8, dorado #FFC23D, coral #FF6F81, violeta #9B7FE0 = familia de mascotas/recompensas · teal #22C3A6 y magenta #E8558F = decorativos (días de la semana)
- Personalidad: cálido · juguetón · confiable
- Dispositivo ownable: burbuja de diálogo + onda de sonido + familia de mascotas rotativas (varían por reto) + wordmark "burbuja" con contorno grueso
- Mockups aprobados: direcciones-abc.html (3 opciones iniciales) → direccion-final.html (versión combinada y aprobada por el usuario, 2026-08-12)
- REGISTRO ANTI-REPETICIÓN (29/54): paleta cálida multi-acento sobre crema + par tipográfico Baloo 2 único quedan VETADOS para el próximo proyecto del SO. Dirección del banco 54 usada: N/A (dispositivo ownable propio, ningún nicho del banco 54 cubre "kids")

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: existe y aprobada — 2026-08-12 (el copy de venta se DERIVA de ella)
- Resumen: mamá/papá 25-40 años LATAM con hijo de 1-4 años, preocupado por su desarrollo del habla · dolor #1: cobros sorpresa sin avisar tras el trial · deseo #1: ver a su hijo dominar vocales/consonantes jugando · nivel de consciencia: Solution-Aware (4/5) · sofisticación: media-alta (4/5)
- Landing: sigue la ESTRUCTURA CANÓNICA de 10 secciones del 19 — carrusel con placeholders hasta tener screenshots reales · footer legal: pendiente (Sesión 6)

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Onboarding-first con paywall de prueba (Modelo 2 — matriz "Educación" de 02C, referencia Duolingo)
- Justificación: nicho educativo/hábito diario, la primera victoria (el niño imita un sonido) ocurre en minutos — el patrón de mayor conversión y retención a largo plazo para este tipo de app es onboarding corto → preview del reto → paywall, no cobro inmediato ni freemium puro
- Diseño del paywall: aparece después de que el padre completa el primer reto de muestra con su hijo (vive la primera victoria antes de que se le pida pagar)
- Trial: 7 días — el aha es inmediato, pero el padre necesita ver 2-3 retos para confiar (ver FICHA-MERCADO §4); aviso pre-cobro el día 6, in-app + email, con fecha y monto exactos
- Puente del trial D1-D7: D1 primer reto completado con celebración · D2-D3 primer "insight" (qué sonido domina mejor) · D4-D5 panel de progreso acumulado (palabras dominadas) · D6 aviso pre-cobro honesto · D7 cobro + "ya eres Pro" con lo desbloqueado visible
- Pricing: $4.99/mes mensual | $29.99/año mostrado como "$2.50/mes" con "2 meses gratis" (ver FICHA-MERCADO.md §1 para el porqué del precio bajo la mediana)

## Gamificación y retención (loop documentado en Sesión 1; momentos se construyen en Sesión 5)
- Loop del hábito (Hooked): Gatillo [notificación diaria "Tu reto de 5 minutos de hoy"] → Acción [padre e hijo completan el reto fonético juntos] → Recompensa [celebración visual/sonora inmediata + racha] → Inversión [panel de progreso: palabras y sonidos dominados, que crece cada día — se pierde si no se compra]
- Mecánicas elegidas: racha diaria + panel visual de progreso por sonido/palabra dominada (sin XP ni ligas — no encaja con el tono "confiable" del avatar, evitar que se sienta como juego frívolo)
- Primera victoria que celebra el onboarding (<60s): el niño imita con éxito el sonido de una vocal/consonante y la app lo celebra con una animación
- Notificaciones de re-enganche: diaria, hora elegida por el padre en el onboarding — tope 1/día

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: ninguna etapa construida todavía (Sesión 1 fue investigación y decisiones, no código)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: código escrito, PENDIENTE de veredicto visual — protagonista: el reto de 5 minutos (mecanismo) — CTA primario: "Crear el plan gratis de mi hijo" → /onboarding
- Onboarding: código escrito, PENDIENTE de veredicto visual — 7 pantallas (edad+nombre · nivel · reconocimiento · meta · momento del día · minutos · loading+resultado con demo de audio) — respuestas en sessionStorage, sin backend todavía
- Paywall: código escrito, PENDIENTE de veredicto visual — anual $2.50/mes ($29.99/año, "2 meses gratis") destacado vs mensual $4.99/mes — CTA → /activar (stub honesto; Hotmart real en Sesión 6)
- Login/Auth: stub en /login — motivo de pedir cuenta: guardar el progreso del niño y el estado de la suscripción (Supabase Auth con magic link, se conecta en Sesión 6)
- App interna: pendiente — secciones (3-5 max): Reto de hoy · Progreso de mi hijo · Biblioteca de retos anteriores · Ajustes
- Servicios externos: pendiente — GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart
- Regla: no se construye la etapa siguiente sin cerrar la anterior

## Puertas de etapa (aprobación antes de avanzar)
- Landing: NO LISTA (ronda 6, 2026-08-13) — 31/40 usab. (necesita ≥36) · 18/20 craft ✓ · 19/20 copy ✓ — evidencia: docs/revisiones/landing-375.png + landing-veredicto.md
- Onboarding: NO LISTA (ronda 8) — 32/40 usab. (necesita ≥36) · 13/20 craft (necesita ≥16) — evidencia: docs/revisiones/onboarding-375.png + onboarding-veredicto.md
- Paywall: NO LISTA (ronda 9) — 31/40 usab. (necesita ≥36) · 16/20 craft ✓ · 18/20 copy ✓ — evidencia: docs/revisiones/paywall-375.png + paywall-veredicto.md
- Login/Auth: no iniciada (stub honesto en /login) — evidencia: —
- App interna: NO EXISTE — no hay ninguna pantalla más allá de landing/onboarding/paywall/stubs (confirmado: `find app` solo devuelve esas rutas + legales). Este es el hueco más grande del producto hoy: no hay ningún "reto" real, ningún loop de uso, nada que retenga a un usuario después de pagar.
- Servicios externos: bloqueados hasta aprobar las anteriores — NINGUNO conectado todavía (sin Supabase, sin Hotmart, sin Resend, sin dominio, sin variables de entorno, sin API routes ni middleware en el proyecto)
- Certificado /100: aún no aplica (se certifica en Sesión 7-8)

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (necesita auth, base de datos, suscripción, contenido servido — no es un sitio estático) — decidido 2026-08-12
- Stack: Next.js + Supabase (auth + base de datos + Storage para audio/video) + Vercel (hosting) + Hotmart (cobro) + Resend (emails transaccionales)
- Features del MVP: 1) Selector de edad adaptativo · 2) Módulo de fonética interactiva (vocales/consonantes, voces humanas grabadas) · 3) Retos diarios de 5 min con repetición lúdica · 4) Panel visual de progreso para los padres
- Qué NO construir todavía: red social de padres, avatares 3D, multilenguaje, alfabetización preescolar avanzada
- Modelo de IA: NO se usa IA generativa en el MVP — el contenido son grabaciones humanas reales (evita el riesgo de sonar "robótico", que es justo la queja #1 de calidad de la competencia); posible IA futura: retroalimentación de pronunciación por reconocimiento de voz, pospuesta hasta validar retención y evitar cualquier promesa de tipo clínico/diagnóstico
- Auth: Supabase Auth con enlace mágico (magic link, sin contraseña) — más simple para el padre no técnico; variante "preview anónimo → paywall → login" para no pedir cuenta antes de que el padre vea el valor
- Modelo de datos (alto nivel): perfiles de padres · perfiles de niño (edad, nombre) · catálogo de retos por edad/fonema · progreso del niño (sonidos/palabras dominadas, rachas) · estado de suscripción — con RLS: cada padre solo ve sus propios hijos y su propio progreso
- Riesgo regulatorio: app usada por/sobre menores → aviso explícito de que es herramienta educativa de apoyo, NO diagnóstico ni terapia clínica; privacidad de datos de menores se revisa a fondo en Sesión 6 (`47-LEGAL-FISCAL-Y-PRIVACIDAD.md`)

## Sesiones completadas ✅
- Sesión 1 — Validación de mercado (con investigación propia), FICHA-AVATAR.md, FICHA-MERCADO.md, estrategia de monetización y arquitectura decididas — verificado 2026-08-12
- Sesión 2 — Identidad visual: FICHA-ARTE.md aprobada (paleta cálida multi-acento, Baloo 2, mascota rotativa, wordmark burbuja) — verificado 2026-08-12

## Sesión en progreso 🔧
- Sesión 5 (app interna) — ARRANCADA 2026-08-16, primera versión funcional construida y probada
  de punta a punta:
  - `lib/curriculo.ts` — 10 retos de fonética placeholder (vocales A/E/I/O/U + consonantes
    M/P/L/S/T), con audio demo vía speechSynthesis (mismo patrón honesto del onboarding, hasta
    que el usuario aporte grabaciones reales).
  - `lib/progreso.ts` — persistencia en `localStorage` (clave `hablapronto_progreso`), NUNCA
    `sessionStorage` — requisito explícito del usuario tras ver quejas reales de competencia
    ("cada vez que minimiza la app debe empezar de cero"). Probado de extremo a extremo: completar
    un reto → dispara `AchievementCelebration` → actualiza racha y total → SOBREVIVE recargar la
    página. Racha se rompe si pasa >1 día sin completar nada, sube 1 si es día consecutivo.
  - `components/shared/BottomNav.tsx` + `app/app/layout.tsx` — nav de 5 destinos (Inicio · Camino ·
    Puntos · Perfil · Avance), tab activo en --accent-2, shell con min-h-dvh (sin vacío bajo la nav).
  - `app/app/page.tsx` (Inicio) — el reto del día real e interactivo: letra + palabra + audio demo +
    botón "¡Ya practicamos!" que completa el reto, dispara la celebración (imagen real ya
    conectada) y cambia a un estado de éxito con la racha actualizada. Sin auth todavía: accesible
    directo (Sesión 6 la protege).
  - `app/app/camino/page.tsx` (Camino) — recorrido serpenteante conectado estilo Candy Crush Saga
    (pedido explícito del usuario), con nodos completados/actual/bloqueado y auto-scroll al nodo
    actual al abrir la pantalla.
  - `app/app/puntuacion/page.tsx`, `app/app/perfil/page.tsx` (con ajustes reales de
    sonido/vibración, mismas claves que `AchievementCelebration`), `app/app/avance/page.tsx` —
    pantallas secundarias (checklist, sin gate de revisor-visual), con contenido real, sin vacíos.
  - Verificado con datos semilla realistas (nunca la app vacía, regla 32): 3 retos completados,
    racha 3 — capturas en `docs/revisiones/app-{,camino-,puntuacion-,perfil-,avance-}375.png`.
  - Revisor-visual lanzado 4 rondas sobre Inicio y Camino (2026-08-16, a pedido del usuario: "lanzalas
    para que tengan el mismo nivel de pulido que el resto"). Progreso real, no solo cosmético —
    bugs de verdad encontrados y corregidos en el camino: toque accidental de un niño podía marcar
    un reto sin forma de deshacerlo (ahora hay "Deshacer" con barra de 12s), el color verde
    (exclusivo de "continuar") se usó por error en los nodos completados del Camino (corregido a
    dorado), contraste insuficiente en la letra del nodo actual (2.9:1 → 4.31:1), nodos del camino
    sin ninguna acción real detrás pese a verse tocables (ahora el nodo actual navega de verdad a
    Inicio), y ninguna de las 2 pantallas avisaba si fallaba el guardado (ahora sí).
    Resultado final: Inicio 34/40 usab. (falta 36) · 16/20 craft ✓. Camino 30/40 usab. (falta 36) ·
    15/20 craft (falta 16). Mismo patrón de meseta que las 3 pantallas de Sesión 4: cada ronda con
    contexto limpio encuentra defectos nuevos aunque los anteriores queden resueltos y verificados
    en código. DECISIÓN: se para el loop automático aquí (mismo criterio que Sesión 4) — evidencia
    en docs/revisiones/app-{inicio,camino}-veredicto.md. tsc ✓ build ✓ dev ✓ en las 5 pantallas.
- Sesión 4 (onboarding + paywall + login): landing/onboarding/paywall en pulido — última puntuación
  conocida por debajo del umbral en las 3 (ver "Problemas conocidos"), pausado a propósito por
  decisión del usuario (respuesta "b": un último repaso a criterio del agente, sin más rondas
  automáticas — ya ejecutado 2026-08-14).

## Próximas sesiones 📋
- Sesión 3: Página de ventas
- Sesión 4: Onboarding, paywall y login
- Sesión 5: App interna simplificada
- Sesión 6: Integraciones reales y seguridad (Supabase, Hotmart, dominio, seguridad de datos de menores)
- Sesión 7: Testing, animaciones, pulido y rigor de entrega
- Sesión 8: Adquisición, lanzamiento y backoffice

## Problemas conocidos ⚠️
- app-inicio (pantalla "Inicio" de la app interna) NO LISTA (PENDIENTE) — 4 rondas (2026-08-16).
  Última: 34/40 usab. (falta llegar a 36), 16/20 craft ✓. Ver docs/revisiones/app-inicio-veredicto.md.
  Pausado a propósito, mismo criterio que Sesión 4 (meseta de rondas, ver nota de patrón abajo).
- app-camino (pantalla "Camino" de la app interna) NO LISTA (PENDIENTE) — 4 rondas (2026-08-16).
  Última: 30/40 usab. (falta llegar a 36), 15/20 craft (falta llegar a 16). Ver
  docs/revisiones/app-camino-veredicto.md. Pausado a propósito, mismo criterio que Sesión 4.
- landing NO LISTA (PENDIENTE) — 9 rondas de revisor-visual (2026-08-13/14). Última lectura VÁLIDA:
  31/40 usab. (falta llegar a 36), 13/20 craft (falta llegar a 16 — bajó por hallazgos nuevos:
  íconos de "Problema" sin color de familia de mascotas, --surface-2 casi idéntico a --bg), 17/20
  copy (eje "especificidad y prueba" en 2/4 — sin testimonio/demo real, contenido pendiente del
  usuario, no resoluble con datos falsos). Ver docs/revisiones/landing-veredicto.md.
- onboarding NO LISTA (PENDIENTE) — 11 rondas. La lectura de la ronda 11 (17/40, "pantalla en
  blanco") fue UN FALSO NEGATIVO de la herramienta de captura, no del código — INVALIDADA, no usar
  como referencia. Última lectura válida real: ronda 10, 33/40 usab. / 15/20 craft. Verificado de
  nuevo tras el fix (ver abajo): la pantalla renderiza completa. Ver docs/revisiones/onboarding-veredicto.md
  (el archivo quedó con el veredicto inválido de la ronda 11 — para saber el estado real hay que
  leer este párrafo, no ese archivo, hasta la próxima ronda).
- paywall NO LISTA (PENDIENTE) — 12 rondas, última: 31/40 usab., 14/20 craft (bajó de 16 — hallazgo
  nuevo: roving focus del radiogroup no mueve el foco real al cambiar con flechas), 17/20 copy (eje
  emoción en 2/4 — falta agitar la escena de dolor específica antes de resolver). Ver
  docs/revisiones/paywall-veredicto.md.
- 2 BUGS REALES encontrados y corregidos esta sesión (no maquillaje para el revisor — afectaban la
  app de verdad):
  1. `scripts/screenshot.mjs` no esperaba el conteo animado del precio (mostraba $1.45 en vez de
     $2.50) — corregido subiendo el tiempo de espera antes de capturar.
  2. `app/onboarding/page.tsx`, función `entrada()` de `PantallaNombre`: cuando `useReducedMotion()`
     resolvía en `true` DESPUÉS del primer render (no siempre en el primero), el componente dejaba
     de pasarle la prop `animate` a Motion a mitad de la transición de entrada, y el elemento
     quedaba atascado en opacity:0 — la pantalla se veía en blanco. Le pudo pasar a un usuario real
     con "reducir movimiento" activado en su celular, no solo en las capturas. CORREGIDO: ahora
     siempre resuelve a un `initial`/`animate` concreto, nunca a un objeto vacío.
- Patrón observado (para no repetir el diagnóstico): las 3 pantallas oscilan entre 31-35/40 en
  usabilidad desde hace varias rondas, y el craft SUBE y BAJA de ronda en ronda incluso sin tocar
  código (ej. paywall craft fue 16→13→16→14 en 4 rondas consecutivas) — el revisor-visual evalúa con
  contexto limpio cada vez, así que hay variación real de "ojos frescos", no solo defectos que
  aparecen y desaparecen. DECISIÓN (2026-08-14): se paró el loop de rondas automáticas del
  revisor-visual — el usuario eligió (respuesta "b") un ÚLTIMO repaso a criterio propio del agente,
  SIN relanzar más revisiones. Ejecutado ese repaso final:
  - Componente nuevo `components/shared/DispositivoOwnable.tsx` (burbuja de diálogo + onda de
    sonido, el dispositivo ownable de FICHA-ARTE que nunca se había dibujado fuera de los mockups)
    — agregado a landing (junto a la prueba social del Hero), onboarding (pantalla "nombre", llena
    el vacío inferior) y paywall (junto a la mascota).
  - `--surface-2` recalibrado de #ffe6b8 a #ffcf78 (contraste contra --bg subió de 1.06:1 a 1.26:1
    — antes casi imperceptible).
  - Mascota "Rufo": se agregó una cola curva sutil (antes se confundía con gato a 96px).
  - Paywall: roving focus real en el radiogroup de planes (el foco del teclado ahora SÍ se mueve a
    la tarjeta elegida con flechas, antes solo cambiaba el estado); headline nombra la escena de
    dolor concreta de FICHA-AVATAR ("en el parque o en el control con el pediatra...").
  - Este repaso NO se verificó con el subagente revisor-visual (el usuario decidió no relanzarlo) —
    verificado solo con tsc/build limpios + captura a 375px + criterio del agente. Si se quiere una
    puntuación /40 /20 formal, hay que relanzarlo explícitamente.
- Nota técnica (para no repetir la investigación): el panel de navegador de esta sesión no renderiza
  screenshots ("Browser pane is not displayed"), y `npx playwright install chromium` se cuelga
  descargando el binario (red bloqueada). Solución que funcionó: `npm install --no-save
  playwright-core` (sin descargar navegador) + scripts/screenshot.mjs, que maneja el Chrome YA
  instalado en el sistema (`C:\Program Files\Google\Chrome\...`) — con `--disable-gpu` en los args
  de lanzamiento, obligatorio: sin él, `page.screenshot()` se cuelga en Windows headless. Capturar
  contra el build de producción (`npx next start -p 3100`), no contra `next dev`, para evitar el
  overlay de compilación de Turbopack en la esquina de la pantalla.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguna todavía — se avisará una por una cuando lleguemos a la fase de cuentas (Sesión 6 en adelante)

## Notas para la próxima sesión
- Blueprint de la app interna (aportado por el usuario 2026-08-12) en
  docs/copy/app-interna-blueprint.md — para la Sesión 5: nav inferior de 5 destinos (Inicio ·
  Camino · Puntuación · Perfil · Avance) + feature nueva de grabar la voz del niño y comparar
  cada 15 días (implica consentimiento de grabar a un menor, revisar en Sesión 6 con el 47).
- Blueprint de onboarding y paywall (aportado por el usuario 2026-08-12) guardado en
  docs/copy/onboarding-blueprint.md — ya ejecutado en la Sesión 4 (código escrito). Los 2 puntos
  que tenía pendientes de confirmar quedaron resueltos: trial en 7 días (no 3) y el copy de
  cancelación corregido (sin "App Store/Google Play", somos web+Hotmart).
- El nombre elegido es HablaPronto (dominio hablapronto.com verificado disponible el 2026-08-12).
- Identidad visual cerrada y aprobada (ver FICHA-ARTE.md) — es cosa juzgada, no se rediscute sin pedirlo el usuario.
- Grabación de voces humanas reales en español neutro y las imágenes reales de cada palabra (araña, perro, gato, etc.) son CONTENIDO real que el usuario deberá producir o encargar más adelante (no lo genera el agente en este mockup) — avisar en el momento oportuno (Sesión 5-6), no ahora.
- Pendiente técnico menor: queda corriendo un servidor de preview local (scripts/dev-static-server.js, puerto 4173) usado solo para revisar los mockups de diseño — se puede apagar sin pérdida, no es parte de la app final.
