# Scope: Personal Portfolio Anatomy Page

## Architecture
- **Left Column**: Solid bright yellow background (`#d7ff00`) displaying a rotating 3D skeleton model bust (from `Skelet_N031209.3ds` loaded using `TDSLoader` with a solid white plaster material). Features vertical navigation, coordinate details, and crosshairs.
- **Right Column**: Solid off-white background (`#f5f5f7`) featuring a particle-face 3D element and brutalist typography (`Bebas Neue` font) displaying the title "BRUTAL ARCHITECTURE" and concrete block graphic with a yellow SVG triangle.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|--------------|--------|
| 1 | 3D Model integration | Load Skelet_N031209.3ds via TDSLoader, set material properties, set bust view, and auto-rotation | None | DONE |
| 2 | Layout & Typography | Configure split-screen layout, colors, Bebas Neue heading, and coordinate overlays | M1 | DONE |
| 3 | E2E Testing Track | Write and run E2E test cases validating anatomy page rendering, canvas, and elements | M2 | DONE |

## Interface Contracts
- **3D Skeleton Model**: Loaded from `/Skelet_N031209.3ds` via `TDSLoader`. Scale, position, and rotation applied to render it as an upright, camera-facing bust in the left column. Continuous Y-rotation.
- **Anatomy Layout**: Grid split (`grid-cols-1 md:grid-cols-2`). Left background `#d7ff00`, right background `#f5f5f7`. Text details and navigation matching design references.
