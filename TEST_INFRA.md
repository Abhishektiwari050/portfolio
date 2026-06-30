# E2E Test Infrastructure & Strategy

This document outlines the End-to-End (E2E) testing philosophy, feature inventory, 4-tier test case design, and coverage thresholds for the AI Engineer & Founder Portfolio Website.

---

## 1. E2E Test Philosophy

Our E2E testing strategy is designed to verify the entire system's behavior as a cohesive "cybernetic control room". Because the portfolio website relies heavily on interactive WebGL particle swarms, smooth scroll integrations, custom cursor reticles, and real-time terminal telemetry, traditional static page testing is insufficient. 

We utilize **Playwright** to:
1. **Validate Interactive States**: Verify how the application reacts to mouse movements, scroll actions, and click events.
2. **Ensure Visual Consistency**: Use screenshot testing to confirm that particle morphs and blueprint layout shifts render correctly.
3. **Guard Against Regression**: Prevent breaking changes across interdependent features (e.g., scrolling affecting both the 3D Canvas and the Terminal Console).
4. **Assert Completed Behavior**: Test against the fully realized specification of the portfolio (including elements/behaviors that may not be present in the baseline but are required in the final product).

---

## 2. Feature Inventory (9 Features)

The E2E test suite covers the following 9 core features:

1. **Hero / Intro Section (`#intro`)**: The initial landing area introducing the "AI Systems Architect" narrative with system status readouts.
2. **Aetheris AI Venture Card (`#aetheris`)**: Bento-grid card showcasing the decentralized agent swarm venture.
3. **Helios Engine Venture Card (`#helios`)**: Bento-grid card showcasing the Rust-based vector index venture.
4. **Chronos Predict Venture Card (`#chronos`)**: Bento-grid card showcasing the spatio-temporal GNN energy grid venture.
5. **Contact Section (`#connect`)**: The final section containing secure connection links and contact pathways.
6. **Terminal Console (`[data-testid="terminal-console"]`)**: The real-time diagnostic log stream reflecting system telemetry.
7. **Custom Cursor (`[data-testid="custom-cursor"]`)**: The custom React-based CAD reticle tracking mouse coordinates and locking onto interactive targets.
8. **Smooth Scroll**: Normalized scroll mapping using Lenis/GSAP to transition states and opacities.
9. **3D Canvas Rendering (`canvas`)**: The GPU-accelerated Three.js particle swarm morphing between shapes.

---

## 3. 4-Tier Test Case Design (104 Tests)

To achieve comprehensive coverage, our test suite is structured into four distinct tiers:

### Tier 1: Feature Coverage (45 Tests)
*Focus: Five tests per feature to verify standard happy-path functionality.*
- **Hero/Intro**:
  1. Section is visible on page load.
  2. Heading text contains "ENGINEERING INTELLIGENT SYSTEMS.".
  3. Status readout displays "AUTH: SUCCESS".
  4. Decrypt status "INIT_STAGE_01" is visible.
  5. Scroll prompt "SYS_SCROLL_TO_DECRYPT" is displayed.
- **Aetheris AI**:
  1. Section exists in the DOM.
  2. Heading text contains "Aetheris AI".
  3. Tagline displays decentralized swarm description.
  4. Core tech stack contains "FastAPI" and "TypeScript".
  5. Active state class triggers when scrolled into view.
- **Helios Engine**:
  1. Section exists in the DOM.
  2. Heading text contains "Helios Engine".
  3. Tagline displays Rust-based vector index description.
  4. Core tech stack contains "Rust".
  5. Active state class triggers when scrolled into view.
- **Chronos Predict**:
  1. Section exists in the DOM.
  2. Heading text contains "Chronos Predict".
  3. Tagline displays spatio-temporal GNN description.
  4. Core tech stack contains "Python" or "PyTorch".
  5. Active state class triggers when scrolled into view.
- **Contact Section**:
  1. Section exists in the DOM.
  2. Heading text contains "SECURE CONNECTION".
  3. Mailto link is configured correctly.
  4. GitHub link is present and targets the correct URL.
  5. LinkedIn link is present and targets the correct URL.
- **Terminal Console**:
  1. Console is visible in the viewport.
  2. Console title bar displays ">_ Agent_Console_Stream".
  3. Status indicator shows "Online".
  4. Boot logs are printed on initialization.
  5. Prompt indicator `$` is present.
- **Custom Cursor**:
  1. Cursor wrapper is rendered in the DOM.
  2. Cursor reticle follows mouse movement.
  3. Coordinates readout matches mouse position.
  4. Coordinates readout updates on move.
  5. Hovering links triggers hover state.
- **Smooth Scroll**:
  1. Scroll progress indicator is present.
  2. Page height allows scrolling.
  3. Scroll event handler registers scroll.
  4. Scroll progress updates on scroll.
  5. Section opacities update during scroll.
- **3D Canvas**:
  1. Canvas element is appended to the right column.
  2. WebGL context (WebGL or WebGL2) is successfully initialized.
  3. Canvas dimensions match container.
  4. Shader program compiles without WebGL errors.
  5. Particle count matches expected density.

### Tier 2: Boundary & Corner Cases (45 Tests)
*Focus: Five tests per feature to verify behavior under extreme, invalid, or unusual conditions.*
- **Hero/Intro**:
  1. Viewport resize does not break layout or hide status readouts.
  2. Very small viewports (mobile) adapt gracefully (e.g., hiding desktop-only decorations).
  3. Fast double-scrolling immediately at load does not freeze the intro animation.
  4. Reloading the page at a scrolled position correctly restores or skips the intro state.
  5. Font loading failures fall back to system monospace gracefully.
- **Aetheris AI**:
  1. Rapidly scrolling past the section does not leave the card stuck in transition.
  2. Extremely wide viewports (ultrawide) keep bento grid aligned.
  3. Text truncation or overflow does not break bento card bounds.
  4. Hovering a card boundary exactly does not trigger rapid hover flickering.
  5. Component handles missing or empty tech stack arrays without crashing.
- **Helios Engine**:
  1. Rapidly scrolling past the section does not leave the card stuck in transition.
  2. Extremely wide viewports (ultrawide) keep bento grid aligned.
  3. Text truncation or overflow does not break bento card bounds.
  4. Hovering a card boundary exactly does not trigger rapid hover flickering.
  5. Component handles missing or empty tech stack arrays without crashing.
- **Chronos Predict**:
  1. Rapidly scrolling past the section does not leave the card stuck in transition.
  2. Extremely wide viewports (ultrawide) keep bento grid aligned.
  3. Text truncation or overflow does not break bento card bounds.
  4. Hovering a card boundary exactly does not trigger rapid hover flickering.
  5. Component handles missing or empty tech stack arrays without crashing.
- **Contact Section**:
  1. Copying contact links to clipboard works.
  2. Right-clicking links does not break custom cursor lock state.
  3. Keyboard navigation (Tab key) can focus contact links.
  4. Pressing Enter on focused contact links triggers default action.
  5. Rapidly hovering and unhovering contact links does not crash the cursor tether.
- **Terminal Console**:
  1. Console handles very long log lines by wrapping or truncating.
  2. Log buffer does not grow infinitely (capped at max lines).
  3. Simulating high-frequency log updates does not degrade page frame rate.
  4. Resizing window dynamically recalculates terminal layout.
  5. Hiding/collapsing terminal state (if supported) preserves log history.
- **Custom Cursor**:
  1. Moving mouse outside the window hides the custom cursor.
  2. Touch devices (where touch is simulated) hide the custom cursor.
  3. Extreme mouse speeds (rapid movement) do not cause reticle lag beyond LERP limits.
  4. Cursor does not block clicking underlying elements (pointer-events: none).
  5. Cursor handles dragging events gracefully.
- **Smooth Scroll**:
  1. Scrolling past the bottom boundary (overscroll) is handled gracefully.
  2. High-frequency trackpad scrolling does not cause layout jitter.
  3. Keyboard scrolling (Arrow keys, PageDown) coordinates with the scroll progress.
  4. Scroll animations pause when the page is unfocused or tab is backgrounded.
  5. Dynamic content height changes recalculate scroll boundaries.
- **3D Canvas**:
  1. Canvas handles WebGL context loss and triggers recovery.
  2. Extremely low-spec GPU emulation falls back to 2D or static layout.
  3. Resizing the window updates the camera aspect ratio and renderer size instantly.
  4. Hovering the canvas at extreme coordinates (negative or out-of-bounds) does not crash shaders.
  5. Rendering remains stable when tab is minimized/inactive (uses requestAnimationFrame).

### Tier 3: Cross-Feature Combinations (9 Tests)
*Focus: Interactions between multiple features.*
1. **Scroll & Canvas Shape Morph**: Scrolling from Hero to Aetheris morphs the 3D particle swarm shape.
2. **Scroll & Terminal Logs**: Scrolling into a new venture section triggers new telemetry logs in the Terminal Console.
3. **Cursor Hover & Terminal Log**: Hovering over a venture card card-header highlights the card and prints a hover log in the Terminal.
4. **Canvas Node Click & Terminal Stream**: Clicking a node on the SVG blueprint morphs the canvas and streams detailed node specs to the Terminal.
5. **Scroll & Cursor Lock**: Scrolling while the cursor is locked onto a link breaks the lock state when the link leaves the viewport.
6. **Theme Change & WebGL Colors**: Toggling theme/color tokens (if applicable) updates both CSS variables and WebGL particle colors.
7. **Resize, Scroll, & Canvas**: Resizing the window while scrolled halfway recalculates scroll positions and adjusts WebGL camera bounds.
8. **Cursor Hover & Canvas Ripple**: Hovering interactive elements triggers WebGL particle repulsion at the cursor coordinates.
9. **Contact Link Focus & Terminal**: Focusing contact links via keyboard prints access logs to the Terminal.

### Tier 4: Real-World Scenarios (5 Tests)
*Focus: End-to-end user journeys and complex workflows.*
1. **Full Journey Scroll-Through**: User lands on page, waits for loader, scrolls through all ventures (Aetheris -> Helios -> Chronos), and reaches the contact section.
2. **Interactive Venture Exploration**: User scrolls to Helios, hovers over the tech stack, clicks a blueprint node, reads the terminal output, and clicks the GitHub link.
3. **Keyboard-Only Navigation**: User navigates the entire page using only the keyboard (Tab, Enter, Arrow keys), verifying focus states and accessibility.
4. **Interrupted Scroll and Click**: User scrolls rapidly, halts mid-way, clicks an interactive node to read logs, then scrolls backwards to the Hero section.
5. **Deep Link / Direct Scroll Navigation**: User loads the page with a hash anchor (e.g., `#helios`) and the page smooth-scrolls directly to the target section, morphing the canvas and updating the terminal.

---

## 4. Coverage Thresholds

To maintain high confidence in our deployments, we enforce the following E2E coverage thresholds:

| Metric | Target Threshold | Minimum Acceptable |
| :--- | :--- | :--- |
| **Feature Coverage** | 100% of defined features (9/9) | 100% (9/9) |
| **Test Case Count** | 104+ test cases | 104 |
| **Test Pass Rate** | 100% passing (on completed code) | 100% |
| **Browser Coverage** | Chromium, Firefox, WebKit | Chromium, Firefox, WebKit |
| **Visual Regression Max Diff** | < 5% pixel difference (`maxDiffPixelRatio: 0.05`) | < 5% |
