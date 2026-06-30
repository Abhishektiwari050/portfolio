# Milestone 1: Infrastructure - Changes Report

This report documents the installation of the required animation and scrolling packages, dependency verification, and the baseline compilation of the project.

## 1. Package Installation

We installed the required packages: `gsap`, `lenis`, and the React wrapper for Lenis. 

### Package Name Resolution for React Lenis:
1. An initial attempt was made to install `@lenis/react` as requested. However, the npm registry returned a **404 Not Found** error:
   ```
   npm error 404 Not Found - GET https://registry.npmjs.org/@lenis%2freact - Not found
   ```
2. Searching the npm registry revealed that the React integration is available under the package name `@studio-freight/react-lenis` (which is deprecated in favor of the core `lenis` package which now bundles React bindings at `lenis/react`).
3. Both `lenis` (which contains direct React exports at `lenis/react`) and `@studio-freight/react-lenis` were successfully installed.

### Peer Dependency Resolution:
Since the project uses **React 19** (`^19.2.7`), installing `@studio-freight/react-lenis` (which has a peer dependency of `react: ^18.0.0`) produced peer dependency warnings. We resolved this appropriately using the `--legacy-peer-deps` flag during installation:
```bash
npm install gsap lenis --legacy-peer-deps
npm install @studio-freight/react-lenis --legacy-peer-deps
```

### Installation Output:
```
npm warn deprecated @studio-freight/react-lenis@0.0.47: The '@studio-freight/react-lenis' package has been renamed to 'lenis'. Please update your dependencies: npm install lenis and visit the documentation: https://www.npmjs.com/package/lenis
npm warn deprecated @studio-freight/tempus@0.0.38: The '@studio-freight/tempus' package has been renamed to 'tempus'. Please update your dependencies: npm install tempus and visit the documentation: https://www.npmjs.com/package/tempus
npm warn deprecated @studio-freight/lenis@1.0.42: The '@studio-freight/lenis' package has been renamed to 'lenis'. Please update your dependencies: npm install lenis and visit the documentation: https://www.npmjs.com/package/lenis
npm warn deprecated @studio-freight/hamo@0.6.33: The '@studio-freight/hamo' package has been renamed to 'hamo'. Please update your dependencies: npm install hamo and visit the documentation: https://www.npmjs.com/package/hamo

added 14 packages, and audited 56 packages in 4s

10 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

## 2. Package Verification

The dependencies have been successfully added to `package.json` and locked in `package-lock.json`.

### `package.json` dependencies:
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

---

## 3. Build Verification

We ran the project's build script to ensure that the baseline project compiles with zero errors.

### Build Command:
```bash
npm run build
```

### Build Output:
```
> portfolio@0.0.0 build
> tsc -b && vite build

vite v8.1.0 building client environment for production...
transforming...✓ 25 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.45 kB │ gzip:   0.29 kB
dist/assets/index-C9SFvemr.css    3.80 kB │ gzip:   1.44 kB
dist/assets/index-DA07QMnF.js   744.16 kB │ gzip: 200.37 kB

✓ built in 789ms
[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

The baseline project builds successfully with **zero compilation errors**.
