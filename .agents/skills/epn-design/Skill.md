---
name: epn-design
description: Úsala siempre que crees o modifiques pantallas, componentes, estilos, botones o paletas para aplicar la identidad visual institucional de la EPN en React Native/Expo.
---

# Sistema de Diseño Institucional EPN (React Native)

Guía de tokens, reglas visuales y componentes basada en la identidad gráfica oficial de la Escuela Politécnica Nacional (EPN).

---

## 1. Tokens de Color y Contrastes (WCAG AA)

| Token Semántico | Hex | Rol en React Native | Accesibilidad / Contraste |
|---|---|---|---|
| `primary` | `#0D1C33` | Azul Marino EPN. Headers, footers, fondos de modales, texto de títulos | Texto `#FFFFFF` o `#EBB336` sobre esto (contraste alto) |
| `accent` | `#EBB336` | Amarillo Dorado EPN. Botones de acción principal, iconos activos, destacados | Usar texto oscuro `#0D1C33` sobre esto |
| `accentText` | `#8D6B20` | Texto dorado sobre fondo blanco | Cumple AA (4.9:1). **Obligatorio en lugar de accent sobre blanco** |
| `surface` | `#FFFFFF` | Fondo de tarjetas (cards), contenedores y campos de entrada | Texto `#4A4A4A` o `#0D1C33` |
| `background` | `#F8F9FA` | Fondo general de pantallas y secciones secundarias | Texto oscuro sobre esto |
| `text` | `#4A4A4A` | Cuerpo de párrafos, leyendas y contenido descriptivo | Pasa AA sobre `surface` y `background` |
| `border` | `#E2E8F0` | Bordes limpios de tarjetas, divisores e inputs | Sutil, delimitador de contenedor |
| `error` | `#D62C27` | Rojo institucional para errores y validaciones | Texto blanco o fondo de alerta |

> **Regla innegociable de contraste:**  
> NUNCA usar `accent` (`#EBB336`) como color de texto sobre fondo blanco (no se lee). Usar siempre `accentText` (`#8D6B20`).

---

## 2. Tipografía y Jerarquía Visual

En React Native usar fuentes sans-serif del sistema con los siguientes tamaños y pesos estándar:

- **Título Principal (H1):** 28–32 pt, peso `'700'` (Bold).
  - *Identidad institucional:* Se recomienda el estilo **bicolor**, por ejemplo: `SERVICIOS` en color `#0D1C33` y `EPN` en color `#8D6B20`.
- **Encabezado de Sección (H2):** 20–24 pt, peso `'700'`, color `#0D1C33`.
- **Subtítulo (H3):** 16–18 pt, peso `'600'` (SemiBold), color `#0D1C33`.
- **Cuerpo (Body):** 14–16 pt, peso `'400'` (Regular), color `#4A4A4A`.
- **Leyendas / Notas (Small):** 12–13 pt, peso `'400'`, color `#718096`.

---

## 3. Formas, Bordes y Elevación (React Native StyleSheet)

- **Escala de espaciado:** Múltiplos de 8 pt (8, 16, 24, 32 pt).
- **Radios de borde (`borderRadius`):**
  - Componentes estándar (Cards, Inputs, Botones): `8` pt.
  - Insignias o botones de píldora (Pills): `9999` pt.
  - Botones circulares o insignias: `50%` del ancho/alto.
- **Elevación / Sombras para Tarjetas (`surface`):**
  ```typescript
  cardShadow: {
    shadowColor: '#0D1C33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  }
  ```

---

## 4. Componentes Clave

### A. Botón Principal (Primary Button)
- **Fondo:** `#EBB336` (Amarillo EPN).
- **Texto:** `#0D1C33` (Azul marino oscuro), tamaño 16 pt, peso `'700'`.
- **Forma:** Altura mínima de `48` pt, `borderRadius: 8`, centrado.
- **Estado presionado (`pressed`):** Reducción de opacidad a `0.85` para respuesta táctil.

### B. Botón Institucional Oscuro (Dark Button)
- **Fondo:** `#0D1C33` (Azul marino EPN).
- **Texto:** `#FFFFFF`, tamaño 16 pt, peso `'600'`.

### C. Tarjetas de Contenido (Cards)
- **Fondo:** `#FFFFFF` (`surface`).
- **Borde:** `1` pt en `#E2E8F0` con `cardShadow`.
- **Espaciado interior (`padding`):** `16` a `24` pt.
- **Radio:** `8` pt.

### D. Barras de Navegación (Header y Bottom Tabs)
- **Header superior:** Fondo `#0D1C33`, título `#FFFFFF`. Iconos en `#FFFFFF` o `#EBB336`.
- **Barra de pestañas (Tabs):** Fondo `#0D1C33` o `#FFFFFF`.
  - Pestaña activa: Icono y texto en `#EBB336` (si fondo oscuro) o `#0D1C33` (si fondo claro).
  - Pestaña inactiva: `#718096` o `#A0AEC0`.

---

## 5. Tokens en Código (Referencia TypeScript)

Objeto de tokens recomendado para importar en la aplicación:

```typescript
export const EPN_THEME = {
  colors: {
    primary: '#0D1C33',
    accent: '#EBB336',
    accentText: '#8D6B20',
    surface: '#FFFFFF',
    background: '#F8F9FA',
    text: '#4A4A4A',
    border: '#E2E8F0',
    error: '#D62C27',
  },
  radius: {
    sm: 4,
    md: 8,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
```

---

## 6. Checklist de Verificación Visual

Antes de dar una tarea por completada, verificar:
- [ ] ¿Los colores se importan de `EPN_THEME` sin valores hex duplicados a mano?
- [ ] ¿El texto amarillo sobre fondo blanco usa estrictamente `#8D6B20` (`accentText`)?
- [ ] ¿Los botones tienen al menos 48 pt de altura para accesibilidad táctil?
- [ ] ¿Las tarjetas usan fondo `#FFFFFF` sobre el lienzo `#F8F9FA` con sombra o borde sutil?
- [ ] ¿Se verificó en Expo Go que la interfaz mantiene la sobriedad y elegancia institucional de la EPN?
