# Milestone 1 Infrastructure Review Report

## Review Summary

**Verdict**: APPROVE

The infrastructure changes made in Milestone 1 are correct, complete, and verified. The required animation and scrolling packages (`gsap`, `lenis`, and `@studio-freight/react-lenis`) are successfully installed and locked in `package-lock.json`. The project compiles successfully with zero errors.

---

## Quality Review

### Findings

No critical or major findings were discovered. The following minor findings are noted:

#### [Minor] Finding 1: Peer Dependency Warnings with React 19
- **What**: Installing `@studio-freight/react-lenis` produces peer dependency warnings because it expects `react: ^18.0.0` but the project uses `react: ^19.2.7`.
- **Where**: `package.json`
- **Why**: This requires the use of `--legacy-peer-deps` during installation and could potentially lead to minor React 19 compatibility warnings during runtime.
- **Suggestion**: Since the core `lenis` package (v1.3.25) is also installed, we should prefer importing React bindings directly from `lenis/react` in future milestones rather than using the deprecated `@studio-freight/react-lenis` wrapper, as it is better maintained and compatible.

#### [Minor] Finding 2: Unused Variable and React Hook Warnings
- **What**: There are two minor linter warnings during `npm run lint`.
- **Where**: 
  - `e2e/tier3-combinations.spec.ts:82` (Unused variable `initialScrollY`)
  - `src/components/ThreeCanvas.tsx:260` (Accessing ref `.current` in effect cleanup)
- **Why**: These do not block the build but should be cleaned up during future milestones to maintain high code quality.
- **Suggestion**: Remove the unused variable in the spec file, and copy the ref to a local variable inside the effect in `ThreeCanvas.tsx`.

### Verified Claims

- **Claim**: Packages `gsap`, `lenis`, and `@studio-freight/react-lenis` are installed.
  - **Verification Method**: Inspected `package.json` and verified packages are listed in `dependencies`. Checked `package-lock.json` using PowerShell to confirm they are locked.
  - **Status**: PASS
- **Claim**: Project builds successfully with zero compilation errors.
  - **Verification Method**: Executed `npm run build` in the project directory and verified it completed successfully with no errors.
  - **Status**: PASS

### Coverage Gaps

- **Deprecated Package Usage** — risk level: Low — recommendation: Accept the risk for now but prioritize using `lenis/react` exports from the core `lenis` package over `@studio-freight/react-lenis` when implementing the scroll behavior.

### Unverified Items

None. All claims have been verified.

---

## Adversarial Review

### Challenge Summary

**Overall risk assessment**: LOW

The overall risk is low because this is a setup/infrastructure milestone with no functional code changes. However, there are minor risks related to package deprecation and bundle size.

### Challenges

#### [Low] Challenge 1: Deprecation of `@studio-freight/react-lenis`
- **Assumption challenged**: The assumption that `@studio-freight/react-lenis` is the best React wrapper to use.
- **Attack scenario**: If React 19 introduces breaking changes to ref handling or effect timing that `@studio-freight/react-lenis` (which has not been updated recently) does not support, the scroll container might fail to initialize or cause silent runtime exceptions.
- **Blast radius**: Smooth scrolling might be disabled or behave erratically on the landing page.
- **Mitigation**: Use `lenis/react` instead of `@studio-freight/react-lenis` if any runtime issues are encountered during Milestone 3.

#### [Low] Challenge 2: Bundle Size Limits
- **Assumption challenged**: The assumption that adding these heavy packages won't impact performance.
- **Attack scenario**: The production build output contains a single JS chunk (`index-DA07QMnF.js`) of **744.16 kB**, which Vite flags with a warning: `Some chunks are larger than 500 kB after minification`.
- **Blast radius**: High initial load time and potential PageSpeed score degradation.
- **Mitigation**: Code-split the heavy 3D/canvas components and animations using dynamic imports (`lazy` / `Suspense`) so they are loaded asynchronously.

### Stress Test Results

- **Build under production optimization** → Expected: Successful minification and chunk generation → Actual: Success, but with a warning about chunk size (> 500 kB) → PASS (build succeeds, but optimization is recommended).

### Unchallenged Areas

- **Runtime behavior of Lenis with GSAP** — reason not challenged: No animation or scrolling logic has been implemented in the codebase yet. This must be stress-tested in Milestone 3.
