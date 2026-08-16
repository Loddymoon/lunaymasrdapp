# FICHA DE DIRECCIÓN DE ARTE — HablaPronto

## Referencia del usuario
- ¿Hay imagen(es) de referencia del usuario?: SÍ → 2 capturas de Pinterest (grid "FREE Educational Apps for Little Kids" + tarjetas de figuras/crayones tipo sticker), aportadas 2026-08-12
- Extracción:
  - Modo: claro · Fondo: #FDF8EC · Superficie: #FFFEF7 · Texto 1º/2º: #33291C / #9A8C74
  - Acento(s): multi-acento saturado (rosa, celeste, amarillo, verde, violeta) — la referencia es genérica (stock/clipart), no una app real, así que se tomó como GUÍA DE ESTILO (letras "burbuja" con contorno grueso, degradé, glossy highlight, sparkles) y se fusionó con la tabla de líderes reales de abajo, no se clonó 1:1
  - Display: bubble-letter redondeada, contorno oscuro grueso + relleno saturado + sombra inferior
  - Radio: generoso (16-24px) · Espaciado: aireado · Sombras: duras/definidas (no difuminadas)
  - Bordes: gruesos (2-3px) siempre visibles, tipo "sticker troquelado"
  - Textura/gradiente/grano: glossy highlight diagonal en botones y letras · sparkles/estrellas decorativas sueltas
  - Detalle firma a replicar: contorno grueso + relleno de color + sombra inferior en el wordmark y en los botones principales
- Prohibiciones anti-IA que la referencia LEVANTA: se levanta la prohibición por defecto de "acento en 5+ sitios" y de "glow" — aquí SÍ hay multi-acento funcional (uno por personaje/recompensa) y un glow contenido en el wordmark, justificados por esta referencia + el nicho infantil (29 → fila Kids/familiar ya pedía multi-acento)

## Identidad derivada (fusión de líderes, 16 PASO 0.2bis)
- TABLA DE LÍDERES:
  - Duolingo → botones que se "hunden" al tocar (borde inferior grueso, 3D), bottom-nav de 4-5 íconos, mascota que celebra, tipografía redonda gruesa
  - Lingokids → mascota protagonista + burbuja de diálogo, densidad táctil pensada para dedos de niños, paleta muy saturada con un color por elemento
  - Kinedu → panel de progreso legible para el padre (la pieza que vende confianza, no solo diversión)
- Combinación tipográfica probada usada: fila "Infantil/educación" de 29 (Baloo 2 o Fredoka, misma familia) → se eligió **Baloo 2** único, validada contra los líderes (Duolingo usa una redondeada equivalente)
- Arquetipo: Cuidador + Bufón (mezcla deliberada — confiable para quien paga [el padre] y juguetón para quien usa [el niño])
- Mundo del sujeto (0.45): bloques de letras → botones que "se hunden" · burbuja de diálogo → forma de las tarjetas de palabra · onda de sonido al hablar → visual del micrófono · estrellitas de logro infantil → sistema de recompensa · mascota que acompaña → varía por reto (nunca un solo personaje fijo)
- Dirección del banco 54 usada para el DISPOSITIVO OWNABLE: ninguna de las 12 encajaba (nicho kids no está en el banco) → dispositivo PROPIO derivado del mundo del sujeto: burbuja de diálogo con cola + onda de sonido + familia de mascotas rotativas + wordmark "burbuja" (contorno grueso + sombra) tomado de la referencia del usuario

## Personalidad compilada
- 3 adjetivos de personalidad: cálido, juguetón, confiable
- Compilación: spring moderado (bounce 0.15-0.2, no el extremo "0.3+" de un juguetón puro, para no sentirse caótico) · duración base 220-260ms · exclamaciones máx 1/pantalla (celebración) · celebración nivel alto en hitos reales (estrellas, racha) · radio tendencial 16-24px

## Brand kit final
> Nota de sincronización (2026-08-12): la app mobile (mockups de identidad) usa los hex de abajo
> tal cual; el KIT DE LANDING (components/landing/tokens.css) los RECALIBRÓ levemente a pedido
> del usuario ("el fondo pálido no me gusta") sin cambiar el significado de cada color — mismo
> hue, más cuerpo/contraste: fondo `#fbeed2`, superficie `#fffdf5`, elevada `#ffe6b8`, acento
> verde `#1b7a52` (oscurecido para que el texto crema del botón cumpla AA), acento-2 naranja
> `#d9720c`. Los hex de esta sección son el ORIGEN conceptual; `tokens.css` es la fuente de la
> verdad para lo que corre en producción — si difieren, gana `tokens.css` y se anota aquí.
- Fondo: #FDF8EC · Superficie: #FFFEF7 · Hundido/elevada: #FFF3DF · Texto 1º/2º: #33291C / #9A8C74
- Acento primario: #F28C1B naranja (SOLO en: acción de grabar/hablar — mic, y elementos "toca aquí")
- Acento "continuar": #3FB57D verde (SOLO en: la acción de seguir/avanzar — botón continuar, chevrons de avance — nunca otro uso)
- Familia de mascotas/recompensa (multi-acento funcional, uno por personaje o tipo de recompensa): cian #2FA8D8 (mascota "gotita"/estado dominado) · dorado #FFC23D (estrellas/premios/hito) · coral #FF6F81 (mascota "Rufo el zorro") · violeta #9B7FE0 (mascota "nube") · teal #22C3A6 y magenta #E8558F (decorativos, días de la semana — nunca en botones de acción)
- Semánticos: éxito = verde (coincide con "continuar", ver arriba) · error #E1543D con ícono siempre · aviso dorado
- Display/Body: Baloo 2 (pesos 500/600/700/800) · Escala: display 22-30px / title 19-22px / body 13-16px / label 10.5-13px
- Radio: 16-26px según componente · Profundidad: bordes gruesos de 2-2.5px + sombra inferior sólida (estilo "sticker/botón 3D"), no glassmorphism · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: burbuja de diálogo con cola + onda de sonido multicolor + familia de mascotas rotativas + wordmark bubble-letter con contorno grueso y sombra
- Motion signature: ease-out para entradas, spring suave (bounce 0.15-0.2) solo en celebraciones/hitos, stagger 60-70ms

## Trazabilidad y vetos
- Protocolo A/B/C: se generaron 3 direcciones (A "Bloques de Juego" — Duolingo-forward · B "Burbuja Habladora" — Lingokids-forward · C "Cuento Cálido" — Kinedu-forward) → el usuario pidió **combinación de las 3** + más color + el tratamiento "burbuja/glossy" de sus propias referencias → la ficha describe esa fusión final, no una opción pura
- Página comparativa: `direcciones-abc.html` (3 opciones iniciales) → `direccion-final.html` (dirección combinada y aprobada, iterada 3 veces con el usuario)
- Paleta derivada de: fila "Kids/familiar" de `29-REFERENCIA-VISUAL.md` (naranja+cian base) + ampliada con dorado/coral/violeta/teal/magenta a pedido del usuario, siguiendo el patrón de multi-acento funcional de Duolingo/Lingokids (un color = un significado fijo, nunca decorativo suelto)
- Registro anti-repetición: paleta (cálida multi-acento sobre crema) y par tipográfico (Baloo 2 único) anotados en ESTADO.md → vetados para el próximo proyecto del SO
- Modo (claro) DERIVADO por: la fila Kids/familiar de 29 dice que claro casi siempre gana en este nicho (mundo diurno, colorido) + confirmado por ambas referencias del usuario (fondos claros)

## Actualización de identidad — isotipo oficial (2026-08-13)
- El usuario aportó una imagen nueva (5 niños ilustrados + wordmark "Habla Pronto" en letras
  burbuja azul/rosa/verde/violeta sobre fondo oscuro difuminado) y pidió EXPLÍCITAMENTE que
  reemplace el logo de texto (`.hablapronto-wordmark`) en TODA la app, incluyendo landing,
  cuestionario y pantalla de pago — aceptando que eso invalida la aprobación visual que esas
  pantallas ya tenían y que hay que re-revisarlas.
- Esta imagen tiene su propia paleta (no la de esta ficha) y un estilo 3D/fotorrealista distinto
  a la familia de mascotas SVG planas de arriba — es COSA JUZGADA NUEVA que sobreescribe el
  wordmark bubble-letter (no la mascota "Rufo el zorro" ni el resto de la paleta funcional, que
  siguen en pie donde ya estaban, salvo que el usuario pida quitarlos también).
- Implementación: componente `components/shared/HablaProntoLogo.tsx`, archivo en
  `public/logo/isotipo-habla-pronto.png`. El archivo NO tiene fondo transparente (fondo oscuro
  difuminado) — mientras no llegue una versión limpia, se muestra enmarcado en una tarjeta
  (`marco` por defecto) para que no se vea como un rectángulo oscuro suelto sobre el fondo claro
  de la app. Si el usuario manda una versión con fondo transparente, cambiar el default de
  `marco` a `false` en el componente (un solo lugar).
- Usado en: header de la landing (`app/page.tsx` → `Hero`), header de la pantalla de pago
  (`app/paywall/page.tsx`), pantalla de carga del cuestionario (`app/onboarding/page.tsx`,
  `PantallaCargando`). Pendiente (Sesión 5, no existen aún): menú principal, perfil, sección de
  logros, modal de felicitación, favicon — el favicon en particular necesita un recorte
  simplificado del isotipo, porque a 16-32px la composición completa (5 caras + 2 líneas de
  texto) no se lee.

## Idioma UI: Español latino neutro · Fecha de cierre de la ficha: 2026-08-12 · Aprobada por el usuario: SÍ
