# Buscaminas — Proyecto Final (Entrega 3)

**Autor:** Aylen Rodriguez  
**Curso:** Desarrollo y Arquitecturas Web 2025

## Estructura
- `index.html` — juego principal
- `contact.html` — formulario de contacto
- `css/style.css` — estilos
- `scripts/` — lógica (config, utils, storage, validation, ui, game)
- `icons/` — imágenes (caritas, banderas, minas...)
- `sounds/` — sonidos (open.mp3, close.mp3, reveal.mp3, explode.mp3, win.mp3)

## Cómo probar
1. Colocar assets (`icons/` y `sounds/`) en las carpetas correspondientes.
2. Abrir `index.html` en el navegador.
3. Ingresar nombre (mín. 3 letras).
4. Seleccionar dificultad y jugar.
5. Al ganar/perder, la partida se guarda en LocalStorage (ver Ranking).
6. Contacto: `contact.html` valida y abre `mailto:`.

## Requerimientos cubiertos (resumen)
- Tablero dinámico y responsive.
- Click izquierdo/derecho (bandera).
- Primer click seguro.
- Expansión de casillas vacías.
- Temporizador y contador de minas.
- Modales en vez de alert.
- Validaciones JS (nombre y contacto).
- Guardado de partidas en LocalStorage y modal Ranking.
- Orden por tiempo o fecha.
- Modo claro/oscuro y persistencia.
- Sonidos en eventos.
- Contact page con validación.
- Accesibilidad básica (focus, atajos).

## Commits sugeridos (ejemplo)
- `feat: estructura base del proyecto`
- `feat: tablero dinámico y lógica básica`
- `feat: banderas, primera versión UI`
- `feat: ranking y almacenamiento en localStorage`
- `feat: modo claro/oscuro y presets de dificultad`
- `feat: contact page y validaciones`
- `fix: corregir bugs y mejorar accesibilidad`
