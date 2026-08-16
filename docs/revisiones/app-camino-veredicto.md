# VEREDICTO revisor-visual — Camino (app interna, HablaPronto)
Fecha: 2026-08-16 00:00
Screenshot: docs/revisiones/app-camino-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Contraste — letra del nodo actual "O", page.tsx L169-170] `color: var(--text-primary)` (#33291C) sobre `background: var(--accent-2)` (#d9720c) mide ≈4.31:1 — mejoró mucho respecto a la ronda anterior (2.9:1) pero sigue por debajo de 4.5:1 (AA para texto normal); a 18px bold no llega con certeza al umbral de "texto grande" (18.66px) que permitiría conformarse con 3:1. → Fix: oscurecer levemente el naranja del nodo actual o agregar un stroke/text-shadow sutil oscuro a la letra para cerrar la brecha a 4.5:1 limpio.
2. [Flexibilidad/valor real — nodos completados (Araña, Elefante, Iguana), page.tsx L191-195] Siguen siendo `<div>` sin acción: un padre que quiere repasar una palabra ya dominada con su hijo no tiene cómo volver a practicarla desde el camino. Ya no aparentan ser "botón 3D" (se resolvió el defecto de afordancia falsa), pero ahora es una función ausente, no solo un problema visual. → Fix: dar acción real de "practicar de nuevo" a los nodos completados (mismo destino `/app` con el reto correspondiente), o si es decisión de producto no permitirlo, está bien pero documentarlo.
3. [Ayuda contextual — badge de estrella del nodo actual, page.tsx L172-176] Sin texto de apoyo en el primer uso; un usuario nuevo no distingue si la estrella es un logro ya obtenido o la señal de "practica aquí hoy" — se apoya solo en la convención visual (pulso + color). → Fix: micro-copy auto-ocultable la primera vez ("Toca para practicar hoy") o confirmar con test real que no hace falta.
4. [Identidad ownable — cuerpo del camino, page.tsx L100-204] Fuera del ícono del header (DispositivoOwnable) y la paleta de color, el trazo serpenteante + círculos es la composición genérica de cualquier "skill path" (Duolingo-like); no hay ningún detalle firma propio de HablaPronto (mascota, sparkle, textura) dentro del cuerpo del camino mismo. → Fix: sumar un detalle ownable puntual junto al nodo actual (ej. una de las mascotas rotativas de la ficha, o un sparkle del brand kit) para que la pantalla no dependa solo del ícono superior para su identidad.
5. [Densidad visual — vista inicial tras auto-scroll, page.tsx L38-41] El auto-scroll centra bien el nodo actual, pero aun así deja 7 nodos simultáneos en pantalla (3 completados + actual + 3 bloqueados), por encima de la guía de 4-5 antes de pedir agrupar — no confunde la interacción (solo el actual es accionable) pero suma ruido visual. → Fix: opcional; si el currículo crece, atenuar (opacidad) los nodos más alejados del actual o comprimir `PASO_Y` cerca del nodo activo.
