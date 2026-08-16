# BLUEPRINT DE ONBOARDING — aportado por el usuario, 2026-08-12

> Guardado tal cual para ejecutarlo en la Sesión 4 (Onboarding, paywall y login). NO se construye
> todavía — estamos cerrando la Sesión 3 (página de ventas). Dos puntos quedan marcados como
> DECISIÓN PENDIENTE porque contradicen o no aplican a lo ya documentado en ESTADO.md.

## Principio rector
Micro-compromisos (inversión psicológica): 3-4 preguntas rápidas de personalización antes del
paywall — el padre/madre debe ver en <60 segundos que la app está hecha a la medida de su hijo.

## Flujo paso a paso
**Paso 1 — 4 micro-preguntas** (barra de progreso animada arriba, estilo Duolingo):
1. Edad del niño: 12-18m · 18-24m · 2-3a · 3-4a
2. Nivel actual de comunicación: solo señala/sonidos · palabras sueltas · frases cortas con
   dificultad de pronunciación · habla pero quiere ampliar vocabulario
3. Meta principal del mes: primeras palabras · vocales/consonantes · oraciones sencillas ·
   confianza y fluidez
4. Tiempo disponible al día: 5 min (recomendado) · 10 min · 15 min

**Paso 2 — Pantalla de carga "efecto laboratorio"** (~3s, mensajes dinámicos):
"Analizando la etapa del habla..." → "Seleccionando ejercicios fonéticos en español neutro..." →
"Plan neurolingüístico personalizado de 5 minutos al día generado con éxito."

**Paso 3 — Momento "Aha!"**: demo de 5s con audio real (voz humana) de una vocal o palabra
cotidiana — mata la objeción de "voces robóticas" ANTES del paywall.

**Paso 4 — Paywall:**
- Titular: "Desbloquea el plan neurolingüístico diario para tu hijo"
- Subtítulo + trial + aviso de recordatorio 24h antes del cobro (transparencia = diferenciador)
- Precios: Anual $29.99/año ($2.50/mes) destacado · Mensual $4.99/mes
- CTA: "Probar [N] Días Gratis y Comenzar"

## 3 reglas de oro
1. Cero registro largo al inicio — el cuestionario va sin pedir nombre/correo/contraseña; la
   cuenta se crea recién al activar la prueba en el paywall.
2. Refuerzo positivo entre pantallas ("¡Excelente elección! La etapa de 2 a 3 años es ideal para...").
3. Claridad comercial: términos de la prueba gratis siempre visibles.

## ⚠️ DOS PUNTOS A CONFIRMAR CON EL USUARIO ANTES DE CONSTRUIR (Sesión 4)
1. **Duración del trial:** este blueprint dice 3 días; ESTADO.md/FICHA-MERCADO.md ya documentan
   7 días (decidido en Sesión 1 con la regla de tiempo-a-valor del SO — 5-7 días cuando el aha es
   inmediato). Si se baja a 3 días, también hay que revisar la garantía de 14 días (regla dura:
   garantía > prueba — con 3 días de prueba sigue cumpliéndose, así que ESO no se rompe) y todos
   los textos de la landing/PS que ya dicen "7 días" (varios lugares en app/page.tsx).
2. **"Cancela desde la App Store / Google Play":** HablaPronto es una web app vendida por Hotmart
   (ver 51-STACK-PINEADO.md y ESTADO.md → Decisiones técnicas), no una app nativa de tienda — no
   existe ese flujo. El copy real debe decir algo como "cancela cuando quieras desde tu cuenta"
   (como ya está en la landing actual).
