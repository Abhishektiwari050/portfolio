# Design System and Theme Setup Analysis — Milestone 2

## 1. Executive Summary
This analysis details the design system, theme setup, font loading strategy, and global styles for the personal portfolio. The project uses a custom **Vanilla CSS** setup rather than Tailwind CSS. We have defined a precise typography loading mechanism for `Syne`, `Geist Sans`, and `Geist Mono`, along with a robust `:root` custom properties system matching the CAD/schematic visual aesthetic, custom scrollbars, and Lenis smooth scrolling compatibility.

---

## 2. CSS Framework Verification
* **Tailwind CSS Status**: **Not Installed / Not Used**.
* **Evidence**:
  * `package.json` contains no references to `tailwindcss`, `postcss`, or `autoprefixer` in either `dependencies` or `devDependencies`.
  * The root directory contains no Tailwind configurations (`tailwind.config.js`, `tailwind.config.ts`, `postcss.config.js`).
  * The project relies entirely on custom vanilla CSS in `src/index.css` and `src/App.css`.
* **Recommendation**: Maintain the Vanilla CSS approach. Given the highly customized, CAD-like canvas and SVG schematic visual overlays, custom CSS allows precise control over CSS variables, `@property` definitions, and layout behaviors without the overhead or design constraints of Tailwind.

---

## 3. Font Loading Strategy
We need to load:
1. `Syne` (Weights 700, 800) — Display/Headers
2. `Geist Sans` (Weights 300, 400, 500) — Body/UI
3. `Geist Mono` (Weights 400, 500) — Monospace/Data

### Option A: CDN (Vercel + Google Fonts) - Recommended
Vercel distributes `Geist` via JSDelivr as separate Sans and Mono packages. This defines the font family names exactly as `'Geist Sans'` and `'Geist Mono'`, matching the design brief.
* **HTML Integration (`index.html`)**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/sans.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/mono.css">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap" rel="stylesheet">
  ```
* **CSS Integration (`src/index.css`)**:
  ```css
  @import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/sans.css');
  @import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/mono.css');
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
  ```

### Option B: Google Fonts Only
Google Fonts recently added `Geist` and `Geist Mono` to its directory. The family name for Sans on Google Fonts is simply `Geist` (not `Geist Sans`).
* **HTML Integration (`index.html`)**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..500&family=Geist+Mono:wght@400..500&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  ```
* **CSS Integration (`src/index.css`)**:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300..500&family=Geist+Mono:wght@400..500&family=Syne:wght@700;800&display=swap');
  ```

### Best Practice Font Fallback Recommendation
To ensure maximum compatibility across both Google Fonts and CDN loading, the `font-family` declarations in CSS should list both `'Geist Sans'` and `'Geist'`:
```css
:root {
  --font-display: 'Syne', sans-serif;
  --font-sans: 'Geist Sans', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
```

---

## 4. CSS Custom Properties (Theme Definition)
We define the theme variables in `src/index.css` under the `:root` pseudo-class.

```css
:root {
  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-sans: 'Geist Sans', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  /* Backgrounds */
  --bg-primary: #030303;      /* Absolute void black for OLED contrast and WebGL blending */
  --bg-secondary: #08090C;    /* Slate-tinted charcoal for bento cards and panels */
  --bg-tertiary: rgba(11, 13, 18, 0.5); /* Glassmorphic panels (requires backdrop-filter) */
  
  /* Accents & Borders */
  --accent-cyan: #00F0FF;     /* Primary action, active nodes, data packets, terminal prompts */
  --accent-indigo: #6366F1;   /* Secondary paths, passive node connections, ambient light */
  --accent-purple: #A855F7;   /* Swarm coordinator nodes, evaluator feedback loops */
  --border-color: rgba(0, 240, 255, 0.08); /* Delicate cyan border for CAD schematic feel */
  --border-glow: rgba(0, 240, 255, 0.15);
  
  /* Text Colors */
  --color-text-primary: #F3F4F6;   /* Crisp off-white for headers and body */
  --color-text-secondary: #9CA3AF; /* Medium gray for descriptions and metadata */
  --color-text-muted: #8a93a6;     /* Brightened from #6B7280 to maintain WCAG 4.5:1 contrast */
}
```

### Contrast & Accessibility Note
The design brief lists `--color-text-muted` as `#6B7280`. However, when rendered on a dark background like `#030303` or `#08090C`, `#6B7280` has a contrast ratio of only **4.14:1**, which fails the WCAG AA minimum contrast ratio of **4.5:1** for body text. 
We recommend using **`#8a93a6`** (already present in the current `src/index.css`), which increases the contrast ratio to **7.2:1** (on `#030303`) and **6.5:1** (on `#08090C`), ensuring full accessibility.

---

## 5. Scrollbar and Global Styles Plan
To ensure a high-fidelity scroll experience and seamless Lenis smooth scrolling, the following styles are recommended:

### A. Custom Scrollbar
Ensure both standard-compliant (Firefox) and WebKit-compliant (Chrome/Safari/Edge) scrollbars are styled:
```css
/* Standard Scrollbar (Firefox) */
html {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 240, 255, 0.25) var(--bg-primary);
}

/* WebKit Scrollbar (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.25);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.5);
}
```

### B. Lenis Smooth Scroll Integration
Lenis smooth scrolling requires specific global styles to prevent layout shifts and scroll fighting:
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

### C. CAD Cursor Global Styles
To prevent cursor flickering and ensure touch devices behave correctly, we should scope the `cursor: none` property to devices with hover capability:
```css
@media (hover: hover) {
  body, a, button, [role="button"], input, select, textarea {
    cursor: none;
  }
}
```

---

## 6. Proposed Implementation

### A. Proposed Changes to `index.html`
Replace the `<head>` section to load the new fonts:

```html
<<<<
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>portfolio</title>
  </head>
====
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/sans.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/mono.css">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap" rel="stylesheet">
  </head>
>>>>
```

### B. Proposed Changes to `src/index.css`
Update the imports, root custom variables, typography mapping, and add Lenis styles:

```css
<<<<
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg-primary: #030406;
  --bg-secondary: #080a0f;
  --bg-tertiary: #0e111a;
  --border-color: rgba(0, 240, 255, 0.08);
  --border-glow: rgba(0, 240, 255, 0.15);
  
  --color-text-primary: #f3f4f6;
  --color-text-secondary: #9ca3af;
  --color-text-muted: #8a93a6; /* Increased brightness for WCAG 4.5:1 contrast */
  
  /* Accent Colors */
  --accent-cyan: #00f0ff;
  --accent-blue: #3b82f6;
  --accent-indigo: #6366f1;
  --accent-green: #10b981;
  --accent-purple: #a855f7;
  
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
  cursor: none;
  -webkit-font-smoothing: antialiased;
}

a, button {
  cursor: none;
}
====
@import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/sans.css');
@import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/font/mono.css');
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

:root {
  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-sans: 'Geist Sans', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  /* Backgrounds */
  --bg-primary: #030303;      /* Absolute void black */
  --bg-secondary: #08090C;    /* Slate-tinted charcoal */
  --bg-tertiary: rgba(11, 13, 18, 0.5); /* Glassmorphic panels */
  --border-color: rgba(0, 240, 255, 0.08);
  --border-glow: rgba(0, 240, 255, 0.15);
  
  /* Text Colors */
  --color-text-primary: #F3F4F6;
  --color-text-secondary: #9CA3AF;
  --color-text-muted: #8a93a6; /* Maintained for WCAG 4.5:1 contrast */
  
  /* Accent Colors */
  --accent-cyan: #00F0FF;
  --accent-blue: #3b82f6;
  --accent-indigo: #6366F1;
  --accent-green: #10b981;
  --accent-purple: #A855F7;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 240, 255, 0.25) var(--bg-primary);
}

body {
  background-color: var(--bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  letter-spacing: -0.03em;
}

@media (hover: hover) {
  body, a, button, [role="button"], input, select, textarea {
    cursor: none;
  }
}

/* Lenis Smooth Scroll Integration */
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
>>>>
```
