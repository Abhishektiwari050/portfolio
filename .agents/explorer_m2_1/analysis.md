# Analysis: Design System & Theme Setup (Milestone 2)

## 1. Executive Summary
This report analyzes the design system and theme setup for Milestone 2, establishing a solid foundation for an editorial-grade, CAD-inspired portfolio interface. The visual concept (*"The Blueprint of Swarms"*) avoids generic neon gradients and focuses on a high-fidelity diagnostic console aesthetic. 

This analysis verifies the project's CSS configuration, determines the optimal font loading strategy, maps the required design tokens to CSS custom properties, and provides a plan for global styles and a custom scrollbar.

---

## 2. CSS Framework Verification
We inspected the project's dependency configurations and root directory:
* **`package.json`**: Checked both `dependencies` and `devDependencies`. There are no references to `tailwindcss`, `postcss`, `autoprefixer`, or any Tailwind CSS plugins.
* **Configuration Files**: A search for `tailwind.config.js` or `postcss.config.js` yielded **0 results**.
* **`src/index.css`**: Contains custom vanilla CSS rules including standard selector resets, custom layout classes (`.app-container`, `.left-column`, `.right-column`), and custom keyframe animations.

**Conclusion**: The project relies entirely on **custom vanilla CSS**. No CSS utility frameworks are present. We recommend maintaining this setup to keep the build lightweight and to allow maximum flexibility for custom WebGL and SVG integration.

---

## 3. Font Loading Strategy
The design brief requires three fonts:
1. **`Syne`** (Weights: 700, 800) - For Display Headers.
2. **`Geist Sans`** (Weights: 300, 400, 500) - For Body / UI.
3. **`Geist Mono`** (Weights: 400, 500) - For Monospace / Telemetry.

Both `Geist` (as Geist Sans) and `Geist Mono` are available on Google Fonts alongside `Syne`. 

### A. Loading Methods Comparison

| Method | Implementation | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **HTML `<link>`** (Recommended) | Add preconnect and stylesheet links to `index.html` | • Best performance (browser parses HTML and fetches fonts early).<br>• Allows `rel="preconnect"` to reduce DNS lookup latency.<br>• Prevents Flash of Unstyled Text (FOUT). | • Injects external dependencies into the HTML entry point. |
| **CSS `@import`** | Add `@import url(...)` at the top of `src/index.css` | • Keeps all styling and assets within CSS.<br>• Clean HTML. | • Worse performance (causes a waterfall where the browser must download the CSS file before discovering it needs to download the font stylesheet). |
| **CDN (Vercel)** | Load Vercel's official Geist font stylesheet via jsdelivr | • Highly optimized package directly from the creator. | • Introduces an additional third-party domain (jsdelivr) on top of Google Fonts. |

### B. Implementation Details
We recommend using **Google Fonts** via **HTML `<link>`** with preconnections for maximum loading performance.

#### 1. HTML Update (`index.html`)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Geist:wght@300;400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet">
```

#### 2. CSS font-family mappings (`src/index.css`)
```css
:root {
  --font-display: 'Syne', sans-serif;
  --font-sans: 'Geist', 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
```

---

## 4. CSS Custom Properties (Theme Tokens)
We have mapped the required design tokens to CSS custom properties. 

### A. Theme Token Mapping

| Token | CSS Custom Property | Value | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **Background Primary** | `--bg-primary` | `#030303` | Absolute void black to maximize OLED contrast. |
| **Background Secondary** | `--bg-secondary` | `#08090C` | Slate-tinted charcoal for cards and panels. |
| **Background Tertiary** | `--bg-tertiary` | `rgba(11, 13, 18, 0.5)` | Glassmorphic panels (requires `backdrop-filter: blur(12px)`). |
| **Border Color** | `--border-color` | `rgba(0, 240, 255, 0.08)` | Delicate cyan border. |
| **Accent Cyan** | `--accent-cyan` | `#00F0FF` | Primary action, active nodes, terminal prompts (Helios). |
| **Accent Indigo** | `--accent-indigo` | `#6366F1` | Secondary paths, ambient light (Chronos). |
| **Accent Purple** | `--accent-purple` | `#A855F7` | Swarm coordinator nodes (Aetheris). |
| **Text Primary** | `--color-text-primary` | `#F3F4F6` | Crisp off-white. |
| **Text Secondary** | `--color-text-secondary` | `#9CA3AF` | Medium gray for descriptions. |
| **Text Muted** | `--color-text-muted` | `#6B7280` | Dark gray for background metrics and telemetry. |

### B. Accessibility & Contrast Warning (WCAG AA Compliance)
* **The Issue**: `--color-text-muted` (`#6B7280`) on `--bg-primary` (`#030303`) has a contrast ratio of **3.22:1**. On `--bg-secondary` (`#08090C`), the contrast ratio is **2.97:1**. Both of these fall below the **WCAG AA requirement of 4.5:1** for body text.
* **The Solution**: 
  1. If `--color-text-muted` is used for **critical content** (descriptions, readable text), we must use an accessible alternative, such as **`#8A93A6`** (contrast ratio of **5.14:1** on `#030303` and **4.74:1** on `#08090C`).
  2. If it is only used for **decorative metrics, grid numbers, or telemetry streams** (non-essential UI elements), the lower contrast is permissible under WCAG guidelines as decorative text.
  * We have defined `--color-text-muted-accessible: #8a93a6` in our proposed CSS to allow the implementer to choose the appropriate level of contrast based on the element's readability requirements.

---

## 5. Scrollbar & Global Styles Plan
To align with the CAD/schematic aesthetic, we propose a refined scrollbar and strict global typography rules.

### A. Custom CAD-style Scrollbar
Instead of rounded, thick scrollbars, a CAD interface should feature a highly minimalist, sharp-edged scroll indicator.
* **Width**: Very thin (`4px`) to stay unobtrusive.
* **Track**: Solid background matching the primary void black, with a subtle border separating it from the content.
* **Thumb**: Semi-transparent cyan (`rgba(0, 240, 255, 0.3)`) with sharp corners (`border-radius: 0px`).

```css
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-left: 1px solid var(--border-color);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.3);
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.6);
}
```

### B. Global Typography Styles
Applying the design brief's letter-spacing and font pairings globally:
* **Headers (`h1, h2, h3`)**: Use `Syne` with `-0.03em` letter-spacing.
* **Body / UI (`body, p, a, button`)**: Use `Geist` (or `Geist Sans` fallback) with `-0.01em` letter-spacing.
* **Monospace (`.code-text`, `.telemetry`, `.terminal`)**: Use `Geist Mono` with `-0.02em` letter-spacing.

---

## 6. Proposed Files
For the implementation phase, we have created the following reference files in our working directory:
1. **`proposed_index.css`**: A complete drop-in replacement for `src/index.css` containing the updated variables, typography rules, custom CAD scrollbar, and existing animation classes.
2. **`proposed_index.html`**: A reference for `index.html` showing where to place the Google Fonts preconnection links and document title.
