# VEREDICTO revisor-visual — Inicio (app interna)
Fecha: 2026-08-16 00:00
Screenshot: docs/revisiones/app-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla completa, estado "reto pendiente"] Sigue habiendo bastante aire: el bloque arriba del header hasta la tarjeta y el tramo entre el botón verde y la barra inferior sumados rondan ~30% de la altura de pantalla — la línea "Mañana: U de Uva" ayuda, pero es un solo renglón chico entre dos huecos grandes → sumar un elemento más de valor real (ej. mini indicador de racha semanal tipo puntitos, o un tip corto para el cuidador) en vez de solo repartir el vacío centrando.
2. [Verificado en código, h7-Flexibilidad] `app/app/page.tsx` no tiene ningún atajo/comportamiento de eficiencia para el usuario que repite la rutina a diario — sin default de "saltar el audio si ya se escuchó hoy", sin tecla/gesto rápido, todo el flujo es idéntico en la visita 1 y en la visita 50 → dar algún ahorro de fricción al uso recurrente (ej. recordar si ya tocó "Escuchar" y no re-mostrar el botón como primario).
3. [Enlace "¿Tocaste por error? Deshacer"] La barra de 12s ya avisa cuánto tiempo queda (bien resuelto), pero pasado ese lapso la acción queda permanente sin ninguna otra vía de corrección — ni en `/app/camino` hay forma de desmarcar un día ya completado → dar una segunda oportunidad de editar el día desde Camino, no solo la ventana de 12s en Inicio.
4. [Tarjeta del reto, jerarquía tipográfica] La pantalla usa 5 tamaños de texto distintos (13/16/18/22/56px) cuando la jerarquía limpia pide máximo 3 — al entrecerrar los ojos "El reto de hoy" (22px) y "Oso" (18px) siguen siendo casi el mismo peso visual pese al cambio de color → consolidar niveles (ej. fundir 22 y 18 en un único tamaño de título de sección).
5. [Letra "O" dentro del tile naranja] El glifo se ve levemente corrido hacia arriba respecto al centro óptico del contenedor cuadrado → ajustar line-height/baseline del carácter para centrarlo mejor dentro del tile.
