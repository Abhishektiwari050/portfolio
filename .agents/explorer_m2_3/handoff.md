# Handoff Report — Explorer 3 (Milestone 2 Design System & Theme)

## 1. Observation
* **File Structure**:
  * The project contains `src/index.css`, `src/App.css`, `src/App.tsx`, and `src/main.tsx` (observed via `list_dir` on `src/`).
  * `package.json` (observed via `view_file`) does not list `tailwindcss` or any PostCSS dependencies:
    ```json
    "dependencies": {
      "@studio-freight/react-lenis": "^0.0.47",
      "gsap": "^3.15.0",
      "lenis": "^1.3.25",
      "lucide-react": "^1.22.0",
      "react": "^19.2.7",
      "react-dom": "^19.2.7",
      "three": "^0.185.0"
    }
    ```
  * No Tailwind CSS configuration files are present in the project root.
* **Global Styles**:
  * `src/index.css` (observed via `view_file`) defines custom properties inside `:root`:
    ```css
    :root {
      --bg-primary: #030406;
      --bg-secondary: #080a0f;
      --bg-tertiary: #0e111a;
      ...
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    ```
  * No `--font-display` variable is defined.
* **Unused Code**:
  * `src/main.tsx` (observed via `view_file`) imports `./index.css` but not `App.css`.
  * `src/App.tsx` (observed via `view_file`) does not import `App.css`.
* **Custom Cursor**:
  * `src/components/CustomCursor.tsx` (observed via `view_file`) displays `X`/`Y` coordinates but does not support rotating crosshairs or custom action labels (e.g. `[SYS: DECRYPT]`).

---

## 2. Logic Chain
1. Since `package.json` contains no Tailwind CSS dependencies and there are no Tailwind configuration files, the project relies entirely on **custom vanilla CSS** (specifically `src/index.css`).
2. Because `src/App.css` is not imported by `main.tsx` or `App.tsx`, it is an unused boilerplate file that should be removed to keep the repository clean.
3. Because `--font-display` is missing from `src/index.css` and the font variables are set to `Inter` and `JetBrains Mono`, they must be updated to `Syne`, `Geist`, and `Geist Mono` as specified in the design brief.
4. Because the design brief requires `Syne`, `Geist`, and `Geist Mono`, we can load them from Google Fonts via a single `<link>` tag in `index.html` (which is more performant than `@import` because it allows parallel download).
5. Because the current custom scrollbar in `src/index.css` is Webkit-only (`::-webkit-scrollbar`), we need to add standard CSS scrollbar properties (`scrollbar-width`, `scrollbar-color`) to ensure cross-browser compatibility (e.g. Firefox support).
6. Because the custom cursor in `src/components/CustomCursor.tsx` only shows coordinates, it needs to be enhanced with `data-cursor-label` support to display action labels like `[SYS: DECRYPT]` on hover.

---

## 3. Caveats
* **Font Availability**: Assumed that Google Fonts serves the Vercel-designed `Geist` and `Geist Mono` under those exact names, which is true as of their recent addition to the Google Fonts library. If there are any CDN issues, local hosting of the fonts is an alternative.
* **WCAG Compliance**: The design brief's `--color-text-muted` value `#6B7280` has a contrast ratio of 3.8:1 against `#030303`. While acceptable for decorative or non-essential text, a value of `#8E95A2` (4.5:1) should be used if it displays critical information.

---

## 4. Conclusion
The design system for Milestone 2 should be implemented using custom vanilla CSS by updating `src/index.css` and `index.html` with the specified variables, Google Fonts link, global styles, cross-browser scrollbars, and Lenis support styles. `src/App.css` should be deleted. `src/components/CustomCursor.tsx` should be enhanced to support interactive action labels.

---

## 5. Verification Method
* **Visual Verification**: Once the implementer applies the changes, verify that the font family for headers is `Syne` and body text is `Geist` using browser developer tools.
* **Console/Build Verification**: Run `npm run build` to ensure that removing `src/App.css` does not cause any compilation errors.
* **Linter Verification**: Run `npm run lint` (which runs `oxlint`) to verify that no CSS or TypeScript syntax errors were introduced.
