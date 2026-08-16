# VEREDICTO revisor-visual — paywall
Fecha: 2026-08-15 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Bloque de confianza, línea 196 de app/paywall/page.tsx] "Cancela cuando quieras desde tu cuenta" sigue siendo una promesa sin flujo de cancelación real en el código (el propio comentario de línea 33-35 confirma que el cobro/gestión de cuenta se conecta en Sesión 6) — en la pantalla que decide el dinero, prometer control que hoy nadie puede ejercer es el defecto de mayor severidad → antes de activar el cobro real, construir el flujo mínimo de cancelación o cambiar el texto a algo que la app pueda cumplir hoy (ej. "puedes cancelar desde el correo de confirmación").
2. [Headline + subtítulo, líneas 130-139] El copy nombra el mecanismo (Método de los 5 Minutos) y personaliza con el nombre del niño, pero sigue sin agitar la escena exacta de dolor de FICHA-AVATAR.md (comparar al hijo con otros niños en el parque/reunión, el comentario del pediatra) antes de resolver — no se tocó esta ronda. Esto hace que el Eje 3 de copy (emoción) puntúe ≤2, lo que por regla obliga a corregir aunque el total de copy pase el umbral → sumar una línea corta que dispare esa escena concreta antes de "Preparamos el Método...".
3. [Escala tipográfica general — precio 20px / plan-título 15px / beneficio 13px / trust 13-12px / badge 11px] No se tocó a fondo esta ronda (confirmado por el usuario). Al entrecerrar los ojos la franja media (15/13/12/11px) se sigue percibiendo como un bloque parejo — solo 2 niveles claros (headline vs. el resto) en vez de los 3-4 esperados → consolidar body en un único 14-15px y label en un único 11-12px.
4. [Radiogroup de planes, `onKeyDown` en línea 157-165] La corrección de esta ronda cambia el `plan` seleccionado con flechas, pero el foco del teclado NO se mueve a la tarjeta recién seleccionada (los `<button role="radio">` no manejan `tabIndex` con roving focus) — un usuario de teclado que presiona flecha abajo ve que "Mensual" queda marcado pero el foco visual sigue en "Anual", cuyo `aria-checked` pasa a `false` mientras conserva el foco: desincroniza foco y estado, rompe el patrón WAI-ARIA de radiogroup → mover el foco (`.focus()`) a la tarjeta recién seleccionada dentro del mismo handler.
5. [Dispositivo ownable, mascota única línea 111-125] FICHA-ARTE.md define el dispositivo ownable de la app como "burbuja de diálogo con cola + onda de sonido multicolor + familia de mascotas rotativas + wordmark burbuja" — en esta pantalla solo aparece la mascota (Rufo el zorro) en un círculo simple, sin burbuja de diálogo ni onda de sonido, dejando la identidad menos diferenciada de un paywall infantil genérico → incorporar al menos un segundo elemento del dispositivo (ej. una pequeña onda de sonido decorativa junto al headline, o una burbuja de diálogo alrededor del subtítulo).
