# Buscaminas — Proyecto Final

**Autor:** Aylen Rodriguez  
**Curso:** Desarrollo y Arquitecturas Web 2025

## Estructura
- `index.html` — juego principal
- `contact.html` — formulario de contacto
- `css/style.css` — estilos
- `scripts/` — lógica (config, utils, storage, validation, ui, game)
- `icons/` — imágenes (caritas, banderas, minas...)
- `sounds/` — sonidos

## Cómo probar
1. Abrir `index.html` en el navegador.
2. Ingresar nombre (mín. 3 letras).
3. Seleccionar dificultad y jugar.
4. Al ganar/perder, la partida se guarda en LocalStorage (ver Ranking).
5. Contacto: Validamos y usamos MailJS para enviar los mensajes.

## Requerimientos
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

