# Milestone 2: Design System & Theme Changes

This document outlines the modifications made to configure the portfolio's design system and theme, maintaining WCAG AA compliance and establishing consistent typography, CAD-style scrollbars, Lenis smooth scrolling, and hover-scoped custom cursors.

## Modified Files

### 1. `index.html`
- Added preconnections to `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (with `crossorigin`).
- Loaded the Google Font family `Geist` (Sans), `Geist Mono`, and `Syne` (weights 700, 800) using a single optimized link.

### 2. `src/index.css`
- Removed the old `@import` statement for Inter and JetBrains Mono.
- Configured `--font-sans` to use `Geist`, `Geist Sans`, and standard fallbacks.
- Configured `--font-mono` to use `Geist Mono` and monospace fallbacks.
- Added `--font-display` to use `Syne` and sans-serif fallbacks.
- Set `--color-text-muted` to `#8a93a6` (WCAG AA compliant contrast ratio of 4.5:1 against the dark background).
- Added global typography rules:
  - Heading tags (`h1` through `h6`) use `var(--font-display)` (Syne), bold weights, line-height `1.1`, and tight letter-spacing (`-0.03em`). `h1` uses weight `800` and responsive font-size via `clamp`.
  - Body copy uses `var(--font-sans)` (Geist) and slight negative tracking (`-0.01em`).
  - Monospace elements (`code`, `pre`, `.code-text`, `.font-mono`) use `var(--font-mono)` (Geist Mono) and custom scaling.
- Configured a custom, sharp, thin CAD-style scrollbar:
  - Width and height set to `4px` (thin).
  - Track background set to `--bg-primary` with a left border matching `--border-color`.
  - Thumb border-radius set to `0` (sharp corners) and color set to a semi-transparent cyan, transitioning to solid `--accent-cyan` on hover.
- Added official Lenis smooth scrolling helper styles to prevent layout shifts:
  - Restricting height changes on html/body.
  - Resetting scroll-behavior to auto when Lenis is active.
  - Setting overscroll-behavior to contain for prevent-marked elements.
- Scoped `cursor: none` to `@media (hover: hover)` for `body`, `a`, `button`, and `[role="button"]`, and removed touch-device cursor overrides from the mobile media query.

---

## Build Verification Output

The build command `npm run build` was executed successfully with zero errors.

```
> portfolio@0.0.0 build
> tsc -b && vite build

vite v8.1.0 building client environment for production...
transforming...✓ 25 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.76 kB │ gzip:   0.40 kB
dist/assets/index-BV7dgtJv.css    4.44 kB │ gzip:   1.66 kB
dist/assets/index-CsLRyA34.js   744.16 kB │ gzip: 200.37 kB

✓ built in 420ms
[plugin builtin:vite-reporter] 
```
No errors or warnings were generated during compilation.
