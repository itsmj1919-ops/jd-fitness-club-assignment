# Performance Atlas Route and Motion Audit

## Baseline Capture

The following routes were inspected at 390px mobile, 768px tablet, 1024px compact desktop, and 1440px desktop before the full 3D world sprint: Home, Programs, Coaching, Membership, Journal, and Visit. The visual hierarchy is consistent and current text blocks remain legible at every inspected size.

## Findings

| Area | Current state | Action for 3D world sprint |
|---|---|---|
| Home hero | Realistic gym video, safe title column, and optional video controls are present. The WebGL overlay is restrained and should remain subordinate to the film. | Refine into a shared arrival-room scene, add route-aware depth, and keep title within the existing safe column. |
| Home content | Zone Explorer is a strong image-led transition into the page; mobile stacks cleanly. | Add section-arrival choreography and a controllable house-map entry without moving text into media. |
| Programs | Session Builder and Manim media are structured and readable. | Add Training Floor room state, session-path visual markers, and lazy progression media behavior. |
| Coaching | Coach Match is clear at both widths. | Add a spatial coaching-room layer and expandable method detail that maintains visible CTA paths. |
| Membership | Folio rows are readable and tier hierarchy is clear. | Add amenity depth, drawer focus handling, and a room-map link with a 2D fallback. |
| Journal | Editorial feature card and reading list are well structured. | Add Recovery Library depth and reading-progress treatment without autoplay or reduced reading width. |
| Visit | Split layout has clear form labels and mobile reflows safely. | Add Arrival Atrium marker and guided steps while preserving the existing validated client-side form. |
| Shared navigation | Header, mobile menu, and command trigger appear consistently. | Introduce map overlay and refined command navigation with keyboard and Escape safety. |

## Motion Inventory

| Effect | Classification | Visibility / fallback |
|---|---|---|
| Hero training film | Keep and refine | Pauses when off-screen; poster remains available; hidden for reduced motion. |
| Hero Three.js overlay | Refine | Capped DPR; only active while hero is visible; hidden for reduced motion. |
| CSS hover and transition responses | Keep and standardize | Transform/opacity only; touch alternatives remain explicit. |
| Manim Practice Progression | Keep as optional controlled media | Starts only on user request and pauses outside viewport. |
| HyperFrames Atlas House Tour | Preview-only pending final render approval | Validated editable composition; no final MP4 will be rendered without explicit approval. |

## Motion Budget

The enhanced desktop tier may display one active WebGL room, relevant visual media, and short interaction feedback at the same time. Standard and mobile tiers prioritize image depth, limited transforms, and paused off-screen media. Reduced-motion users receive the complete static information architecture without automatic video, 3D drift, or delayed actions.
