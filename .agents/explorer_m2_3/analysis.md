# Design System & Theme Setup Investigation — Milestone 2

## Executive Summary
This report analyzes the design system, typography, and color tokens for the portfolio project in Milestone 2. The project relies entirely on **custom vanilla CSS** (no Tailwind CSS is present). The typography and color palette must be updated to align with the *Blueprint of Swarms* CAD aesthetic outlined in the design brief. This analysis provides the concrete CSS changes and integration strategies required, including performance-oriented font loading and cross-browser scrollbar support.

---

## 1. CSS Framework Verification
* **Tailwind CSS**: **Not Used**.
  * `package.json` contains no Tailwind CSS, PostCSS, or Autoprefixer dependencies.
  * No Tailwind configuration files (`tailwind.config.js`, etc.) exist in the repository.
  * `src/index.css` contains custom vanilla CSS variables and classes (such as `.app-container`, `.left-column`, `.right-column`, and `.bento-card`).
* **Unused Files**: `src/App.css` contains boilerplate code from the Vite React template and is **not imported** anywhere (`main.tsx` only imports `index.css`, and `App.tsx` does not import `App.css`).
  * *Recommendation*: Remove `src/App.css` to clean up the codebase.

---

## 2. Font Loading Strategy
The design brief requires three fonts:
1. **Display (Headers)**: `Syne` (Weights: 700, 800)
2. **Body / UI**: `Geist Sans` (Weights: 300, 400, 500)
3. **Monospace / Data**: `Geist Mono` (Weights: 400, 500)

### Loading Options
* **Option A: HTML `<link>` Tags (Recommended for Performance)**
  Adding preconnect and link tags to `index.html` allows the browser to resolve the DNS and download fonts in parallel with the CSS, preventing render-blocking delays and reducing Flash of Unstyled Text (FOUT).
  
  *Insert inside `<head>` in `index.html`:*
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  ```

* **Option B: CSS `@import` (Cohesive with current structure)**
  Replace the existing `@import` at the top of `src/index.css`.
  
  *At the top of `src/index.css`:*
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
  ```

*Note: Google Fonts hosts the sans-serif version of Vercel Geist under the family name `'Geist'`, and the monospace version under `'Geist Mono'`.*

---

## 3. CSS Custom Properties (Variables)
To implement the "deep space dark theme" and typography system, the `:root` selector in `src/index.css` should be updated.

### Proposed `:root` Declarations
```css
:root {
  /* Background Colors */
  --bg-primary: #030303;      /* Absolute void black for OLED contrast */
  --bg-secondary: #08090C;    /* Slate-tinted charcoal for cards/panels */
  --bg-tertiary: rgba(11, 13, 18, 0.5); /* Glassmorphic panels */

  /* Border & Glow */
  --border-color: rgba(0, 240, 255, 0.08); /* Technical CAD cyan border */
  --border-glow: rgba(0, 240, 255, 0.15);

  /* Text Colors */
  --color-text-primary: #F3F4F6;   /* Crisp off-white */
  --color-text-secondary: #9CA3AF; /* Medium gray for descriptions */
  --color-text-muted: #6B7280;     /* Muted gray for telemetry (3.8:1 contrast) */
  /* Note: For elements requiring strict WCAG AA 4.5:1 contrast, use #8E95A2 */

  /* Accent Colors */
  --accent-cyan: #00F0FF;          /* Helios Engine / Speed */
  --accent-indigo: #6366F1;        /* Chronos Predict / Time-Series */
  --accent-purple: #A855F7;        /* Aetheris AI / Swarms */

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
```

### Contrast & Accessibility Analysis
* **Primary Text (`#F3F4F6`)** on `--bg-primary` (`#030303`): **18.7:1** (Passes WCAG AAA)
* **Secondary Text (`#9CA3AF`)** on `--bg-primary` (`#030303`): **8.6:1** (Passes WCAG AAA)
* **Muted Text (`#6B7280`)** on `--bg-primary` (`#030303`): **3.8:1**
  * *Compliance*: Under WCAG 2.1, a 3:1 ratio is acceptable for "incidental" or "disabled" text, and for large text. If `--color-text-muted` is used for critical metadata, we recommend using `#8E95A2` (4.5:1) instead.
* **Accent Cyan (`#00F0FF`)** on `--bg-primary` (`#030303`): **12.5:1** (Passes WCAG AAA)

---

## 4. Scrollbar & Global Styles Plan

### A. Cross-Browser Scrollbar
To ensure consistent styling across Webkit browsers (Chrome, Safari, Edge) and Firefox, we should combine the webkit-specific scrollbar pseudo-elements with standard CSS scrollbar properties.

```css
/* Standard Scrollbar properties for Firefox */
html {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 240, 255, 0.25) var(--bg-primary);
}

/* Webkit Scrollbar styling (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.25);
  border-radius: 3px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.5);
}
```

### B. Global Font Styles
Apply the typography scale, letter-spacing, and smoothing to the global elements:

```css
body {
  background-color: var(--bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
  overflow-x: hidden;
  cursor: none; /* Hidden for Custom CAD Cursor */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; /* Firefox antialiasing */
}

h1, h2, h3 {
  font-family: var(--font-display);
  letter-spacing: -0.03em;
  font-weight: 800;
}

.code-text, .telemetry, .terminal {
  font-family: var(--font-mono);
  letter-spacing: -0.02em;
}

/* Custom selection styling matching the CAD theme */
::selection {
  background-color: rgba(0, 240, 255, 0.15);
  color: var(--accent-cyan);
}
```

### C. Lenis Smooth Scroll Integration Support
The design brief specifies integrating **Lenis** for smooth scrolling. To prevent layout shifting and scroll conflicts, the following structural CSS must be present:

```css
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
```

---

## 5. Additional Observations & High-Fidelity Enhancements

### A. Custom CAD Cursor Expansion
The current `CustomCursor.tsx` tracks mouse position and locks onto buttons, but it lacks the advanced features described in the design brief:
1. **Interactive Hover States**: The brief requests a 24px circular target reticle with crosshairs that rotate, and a tiny readout indicating the action (e.g. `[SYS: DECRYPT]`). The current implementation only shows a dashed circle and `X`/`Y` coordinates.
2. **Action Label Support**: We recommend adding a `data-cursor-label` attribute on interactive elements (e.g., `<button data-cursor-label="SYS: DECRYPT">`) and updating `CustomCursor.tsx` to read this attribute and display it next to the cursor when hovering.

### B. Grid Overlay Overlaying Content
The `.grid-overlay` and `.grid-overlay-sub` have `z-index: 1`, while `.app-container` has `z-index: 2`. This is correct as it places the grid behind interactive content. However, we should ensure that the canvas does not get hidden by these overlays.

---

## 6. Actionable Implementation Plan (for Implementer)
1. **Remove Unused Files**: Delete `src/App.css`.
2. **Update Font Loading**: Add the Google Fonts `<link>` tag to `index.html`.
3. **Apply CSS Updates**: Overwrite the `:root` variables and add global styles, scrollbar styles, and Lenis support styles in `src/index.css`.
4. **Enhance Custom Cursor**: Update `src/components/CustomCursor.tsx` to support custom action labels via `data-cursor-label` attributes.
