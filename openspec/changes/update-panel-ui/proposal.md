# Change: Reframe UI to a clean, Figma-like Geo-SaaS style
## Why
The current UI feels heavy and lacks the crisp hierarchy seen in modern B2B tools. A cohesive, airy, high-efficiency style will keep the map as the focal point while improving scanability and interaction clarity across panels and controls.
## What Changes
- Introduce a modern Geo-SaaS design language (airy, precise, focused) with Ant Design–inspired light tokens.
- Define a compact density system and small-radius shapes for panel rows, inputs, and headers.
- Restyle the top header to a light surface with subtle border and hover feedback.
- Redesign layer list selection (soft active background + 3px primary rail) and hover states to reduce visual noise.
- Modernize property inspector form fields (aligned labels, 32px inputs, focus glow) and slider track/thumb styling.
- Preserve existing fonts; tune weights/line-height only for readability.
## Impact
- Affected specs: panel-layout
- Affected code: src/styles/_toolbar.scss, src/styles/_layout.scss, src/styles/_layer.scss, src/styles/_input.scss, src/styles/_vars.scss, src/styles/_components.scss (if needed)
