## Context
Maputnik already ships with partial shadcn/ui integration (`src/components/ui/button.tsx`, `input.tsx`, `label.tsx`, `slider.tsx`, `card.tsx`) and a utility `cn()` helper in `src/lib/utils.ts`. Base input components in `src/components/` remain legacy React class components with SCSS classes and custom behaviors.

## Goals / Non-Goals
- Goals:
  - Define a phase-1 migration for base inputs that keeps the existing prop contracts intact.
  - Choose shadcn/ui primitives that best match current behavior (native select vs custom select, input vs textarea).
  - Preserve current accessibility semantics and immediate response behaviors.
- Non-Goals:
  - Replace complex inputs (autocomplete, color, number, JSON, dynamic array) in this phase.
  - Rework Field* wrappers beyond what is necessary for base inputs.
  - Introduce new styling tokens or redesign the UI.

## Decisions
- Decision: Use wrapper components to preserve public APIs.
  - Rationale: Existing downstream components rely on specific prop names and behavior; wrappers allow shadcn styling without breaking props.
  - Approach: Keep existing component names (`InputButton`, `InputSelect`, etc.) and swap internals to shadcn primitives.
- Decision: Prefer shadcn "native-select" over Radix Select for phase 1.
  - Rationale: Current `InputSelect` is a native `<select>` with immediate input/change events and default browser semantics; shadcn's native-select aligns better with existing behavior and the `panel-layout` requirement for immediate select response.
- Decision: Use shadcn `textarea` for `InputString` when `multi` is true.
  - Rationale: Current behavior switches between `<input>` and `<textarea>`; matching that avoids UX regressions.

## Component Mapping (Phase 1)
- `InputButton` -> `src/components/ui/button` (shadcn Button)
- `InputCheckbox` -> shadcn `checkbox` (registry: `@shadcn/checkbox`)
- `InputSelect` -> shadcn `native-select` (registry: `@shadcn/native-select`), fallback to custom if required
- `InputString` -> shadcn `input` or `textarea` (registry: `@shadcn/input`, `@shadcn/textarea`)
- `InputUrl` -> continue wrapping `InputString` (no change in public API)
- `Fieldset` -> retain structure in this phase; optional follow-up to align with shadcn Card/Label

## Risks / Trade-offs
- Risk: Radix-based Select or Checkbox may change focus/keyboard behavior.
  - Mitigation: Use native select for phase 1 and match existing input events for checkbox.
- Risk: Visual mismatch with SCSS styles.
  - Mitigation: Preserve className hooks or adopt Tailwind classes that mirror existing SCSS; validate against panel layout requirements.

## Migration Plan
1. Add missing shadcn primitives (checkbox, native-select, textarea) via registry.
2. Update base input components to wrap shadcn primitives while keeping props identical.
3. Verify behavior in areas that use these components (Field* wrappers, Layer editor forms).
4. Validate lint/build and update changelog.

## Open Questions
- Should `InputSelect` remain fully native in phase 1 (preferred), or should we allow the Radix Select for richer UI later?
- Do we want `Fieldset` included in phase 1 or keep it for a follow-up phase?
