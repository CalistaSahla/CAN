# CAN Design Direction

This direction follows the CAN competition proposal: a professional, evidence-first trust product for general users. It is technical without treating neon, glass, or motion as a substitute for evidence.

## Design Read

Public-facing web trust platform for Indonesian users. Visual language: editorial product interface, using structured evidence and restrained infrastructure cues. Dials: ENERGY 2, RHYTHM 2, MOTION 1.

## Tokens and Rationale

- `--site-paper: #f2f4f1` and `--site-surface: #ffffff`: neutral page and report surfaces keep evidence readable and distinct from the chrome.
- `--site-ink: #172d2d` and `--site-muted: #536765`: deep green-charcoal gives the product a grounded security character; muted text retains WCAG AA contrast.
- `--site-evidence: #24675e`: evidence/status color is reserved for collected-signal structure, not general decoration.
- `--site-accent: #c64e36`: warm vermilion is reserved for primary actions and input errors, so users can find the next action quickly.
- Display headings use the available editorial serif stack to separate product narrative from technical evidence. Body copy uses system sans-serif for broad platform availability and long-form readability.

## Composition and Motion

The landing page uses a split hero because the URL action and report structure need to be understood together. The process is a six-step sequence because it mirrors CAN's real proposal flow. Trust DNA uses an indexed list so the six dimensions are comparable without fabricated scores. The interpretation section switches to a dark field to distinguish the product principle from the operational details above it.

Motion stays at dial 1: focus and hover feedback only, with reduced-motion support. No autoplay animation, glass blur, background orbs, or decorative status lights are part of the design system.

## Content and Demo Boundary

The report preview is an explicitly labeled structure illustration, not a scan result. `/scan` and the current `/periksa/hasil` preview remain in demo mode until real collection and report APIs exist. The UI must keep saying when a step, score, finding, or evidence item is illustrative or not run.