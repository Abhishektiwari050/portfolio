# Original User Request

## Initial Request — 2026-06-29T05:11:54Z

Build an award-winning personal portfolio website for an AI engineer and founder. The site must feel like months of meticulous design work went into it — with stunning 3D animations, scroll-driven storytelling, and premium micro-interactions that make visitors say "what the hell, this is incredible." The design must be inspired by real award-winning sites (Awwwards winners, 21st.dev components, top GitHub 3D portfolio repos) — not generic templates.

Working directory: C:\Users\abhis\.gemini\antigravity\scratch\portfolio
Integrity mode: development

An existing React + Vite + TypeScript + Three.js project exists in the working directory. The team may keep, modify, or completely replace any part of it. The person is an AI engineer who builds multi-agent systems, GPU-accelerated vector search, and predictive networks. They are also a founder. The portfolio should tell their story — not just list projects.

## Requirements

### R1. Design Research Before Coding
Before writing any UI code, research real award-winning developer portfolio websites for concrete design patterns. Sources to mine:
- **Awwwards**: Study 3-5 recent "Site of the Day" winners in the portfolio/personal category for layout patterns, typography choices, color palettes, animation timing, and scroll behavior
- **21st.dev**: Browse the component library, find the most visually stunning components (animated beams, orbiting circles, spotlight cards, text reveal animations, gradient borders, etc.), and extract the design patterns or actual component code
- **GitHub**: Search for highly-starred 3D portfolio repos (Three.js, React Three Fiber, GSAP-based) and study their animation architectures
- Compile findings into a design brief before implementation begins

### R2. Awwwards-Level Visual Design
The website must achieve a level of visual polish that would be competitive for an Awwwards "Site of the Day" nomination. This means:
- A cohesive, curated color system (not generic CSS defaults)
- Premium typography with intentional font pairing, proper hierarchy, and refined spacing
- Sophisticated micro-animations and hover states on every interactive element
- Smooth, buttery scroll transitions (not janky or stuttered)
- A design that feels like a premium product, not a developer's side project

### R3. Immersive 3D & Animation Experience (Desktop-First)
The desktop experience must feature an immersive 3D element that is central to the site's identity — not a decorative afterthought. Scroll-driven animations should connect sections into a continuous visual narrative. The 3D and animation layer should make people stop and stare. Mobile can be a simplified but still polished fallback.

### R4. Story-Driven Portfolio Content
The portfolio tells the story of an AI systems architect and founder. It should flow like a narrative — each project/venture is a chapter. Content areas include:
- A commanding hero/intro that establishes identity
- Project showcases (Aetheris AI — multi-agent runtime, Helios Engine — GPU vector search, Chronos Predict — predictive networks) with metrics, tech stacks, and narrative descriptions
- A contact/connect section
- The overall feel should be "showing the intricate machinery" — revealing the complexity and engineering behind the systems

### R5. Production-Ready Quality
The site must build without errors, load within 3 seconds on a standard connection, and be immediately deployable. No placeholder images, no broken layouts, no console errors.

### R6. Smooth Scroll & Loading Experience
Award-winning sites never use raw browser scroll. The site must implement a smooth scroll library (Lenis, Locomotive Scroll, or equivalent) for buttery scroll feel. Additionally, a custom preloader/loading screen must mask asset loading — the user should never see a flash of unstyled content or a half-rendered 3D scene. The preloader itself should be animated and on-brand (not a generic spinner).

### R7. Typography & Text Animations
Text is not static on award-winning sites. Headings and key text elements must animate into view — split-text reveals (character-by-character or word-by-word), staggered fade-ins, or kinetic typography effects triggered by scroll position. These animations must feel precise and intentional, not generic fade-ups.

## Acceptance Criteria

### Visual Quality (Agent-as-Judge)
- [ ] An independent verification agent opens the site in a browser, takes screenshots of every section at desktop resolution, and rates each on a 1-10 scale across: typography quality, color harmony, animation smoothness, layout sophistication, and overall "wow factor"
- [ ] Every section must score at least 7/10 on each dimension. Overall average must be 8+/10
- [ ] The site must NOT look like a generic developer template — it must have a distinctive visual identity

### Design System Coherence
- [ ] Typography uses a deliberate font pairing: one display/heading font, one body font, one monospace font — consistently applied across all sections
- [ ] The color palette uses no more than 2-3 accent colors with consistent application throughout (no random one-off colors)
- [ ] Spacing follows a consistent scale (not arbitrary pixel values that change section to section)

### 3D & Animation
- [ ] At least one prominent 3D element renders correctly in the browser viewport (verified via screenshot)
- [ ] Scrolling through the page triggers visible animation transitions between sections (verified via browser interaction)
- [ ] Hover states exist on all interactive elements (links, cards, buttons)
- [ ] A custom cursor is present that reacts differently to interactive elements vs. background
- [ ] Text reveal animations trigger on at least the hero heading and section titles as they scroll into view

### Scroll & Loading
- [ ] Smooth scrolling is active (scroll behavior is visibly different from default browser scroll — no snapping, no jank)
- [ ] A branded preloader/loading screen appears before the main content renders
- [ ] No flash of unstyled content (FOUC) or partially rendered 3D scene is visible during load

### Content Completeness
- [ ] Hero section with name/title/tagline is present and visually commanding
- [ ] At least 3 project showcases are present with titles, descriptions, and tech details
- [ ] Contact section with working links is present

### Technical Quality
- [ ] `npm run build` completes with zero errors
- [ ] `npm run dev` serves the site successfully on localhost
- [ ] No JavaScript console errors on page load or during scroll
- [ ] Page loads in under 3 seconds on localhost
