---
name: Patiotuerca-Design-System
description: "Activa esta skill para maquetar interfaces visuales respetando la identidad de Patiotuerca. Estrictamente limitado a cambios de UI (HTML/CSS); prohibido alterar la lógica de programación existente."
version: 1.2.0
---

# 🚗 Skill: Sistema de Diseño Patiotuerca

## 1. Propósito y Restricción Crítica
Esta skill rige la organización visual, paleta, tipografía y formas de los componentes del portal.
**RESTRICCIÓN DE LÓGICA:** Solo tienes permitido cambiar aspectos visuales (HTML, clases CSS, Tailwind, estilos en línea). **NO DEBE** tocar, reescribir ni eliminar ningún código de lógica que ya esté escrito (scripts, controladores de estado, hooks, o eventos como `onClick`).

## 2. Paleta de Colores

| Elemento | Token CSS | Hexadecimal | Uso Obligatorio |
| :--- | :--- | :--- | :--- |
| **Primario** | `--pt-primary` | `#E52320` | Botones de acción principales (ej. Buscar), logo institucional[cite: 11, 13]. |
| **Superficie** | `--pt-surface` | `#FFFFFF` | Fondo de la web, fondo de tarjetas y widget de búsqueda[cite: 11, 12]. |
| **Texto Principal** | `--pt-text-main` | `#222222` | Títulos de vehículos, precios[cite: 12]. |
| **Texto Secundario**| `--pt-text-muted` | `#888888` | Kilometraje, año, ubicación, íconos inactivos[cite: 12]. |
| **Destacado** | `--pt-badge-blue` | `#2A64F6` | Etiquetas de destaque sobre imágenes (ej. "TOP")[cite: 12]. |
| **Acción Rápida** | `--pt-action-green` | `#25D366` | Botón flotante de contacto (WhatsApp)[cite: 11]. |
| **Bordes** | `--pt-border` | `#EAEAEA` | Líneas divisorias y bordes de inputs[cite: 11, 12]. |

## 3. Tipografía
Todo el sistema utiliza una fuente **Sans-serif geométrica** (como `Inter` o `Roboto`).

*   **Precios de Vehículos:** `18px` (1.125rem), `font-weight: 700` (Bold)[cite: 12].
*   **Títulos de Vehículos (Modelo):** `16px` (1rem), `font-weight: 600` (SemiBold)[cite: 12].
*   **Texto Secundario (Año, Ciudad):** `12px` (0.75rem), `font-weight: 400`, color gris oscuro `--pt-text-muted`[cite: 12].
*   **Botones Principales:** `14px` (0.875rem), `font-weight: 600`[cite: 11].

## 4. Estilo de Botones tomados del sitio

1.  **Botón Primario (Llamado a la acción):**
    *   Fondo rojo (`--pt-primary`), texto blanco[cite: 11].
    *   Esquinas redondeadas suaves (`border-radius: 8px`).
2.  **Botones de Categoría (Explorar por...):**
    *   Forma cuadrada con fondo blanco y bordes muy redondeados (`border-radius: 16px`)[cite: 12].
    *   Llevan un ícono centrado y texto en la parte inferior[cite: 12].
    *   Borde o sombra muy tenue alrededor (`1px solid var(--pt-border)`)[cite: 12].
3.  **Botón Flotante de Acción (WhatsApp):**
    *   Totalmente circular (`border-radius: 50%`)[cite: 11].
    *   Fondo verde (`--pt-action-green`) con ícono blanco[cite: 11].

## 5. Estilo de Tarjetas tomadas del sitio

### Tarjeta de Vehículo ("Autos Destacados")
*   **Contenedor Principal:** Fondo blanco, borde perimetral sutil (`1px solid var(--pt-border)`) y esquinas redondeadas (`border-radius: 8px`)[cite: 12].
*   **Imagen Superior:** Cubre el 100% del ancho del contenedor, manteniendo las esquinas superiores redondeadas[cite: 12].
*   **Insignias Superpuestas (Badges):**
    *   Esquina superior izquierda: Contador de fotos oscuro y transparente[cite: 12].
    *   Esquina superior derecha: Ícono circular blanco con corazón (Favorito)[cite: 12].
    *   Esquina inferior izquierda de la imagen: Etiqueta "TOP" azul (`--pt-badge-blue`) con `border-radius: 4px`[cite: 12].
*   **Estructura de Datos (Body):** Padding interno de `12px`. El orden visual de arriba hacia abajo es:
    1.  Ubicación y Año (Texto pequeño y gris)[cite: 12].
    2.  Marca y Modelo (Texto mediano y negro)[cite: 12].
    3.  Kilometraje (Texto pequeño y gris con ícono)[cite: 12].
    4.  Precio USD (Texto grande y en negrita)[cite: 12].

### Widget de Búsqueda (Hero)
*   **Contenedor:** Rectángulo blanco expansivo, esquinas redondeadas (`border-radius: 12px`), sombra envolvente (`box-shadow: 0 8px 24px rgba(0,0,0,0.08)`)[cite: 11].

## 6. Tokens CSS Base

```css
:root {
  /* Colores */
  --pt-primary: #E52320;
  --pt-surface: #FFFFFF;
  --pt-text-main: #222222;
  --pt-text-muted: #888888;
  --pt-badge-blue: #2A64F6;
  --pt-action-green: #25D366;
  --pt-border: #EAEAEA;

  /* Radios de borde */
  --pt-radius-badge: 4px;
  --pt-radius-card: 8px;
  --pt-radius-widget: 12px;
  --pt-radius-category: 16px;
  --pt-radius-circle: 50%;
}