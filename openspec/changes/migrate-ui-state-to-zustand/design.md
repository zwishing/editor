## Context
The editor UI state (active side view, modal visibility, selection, map view, debug flags, errors/infos) currently lives in the `App` class component state (`src/components/App.tsx`). This has grown into a large, tightly coupled state object with many `setState` calls and prop passing to child components. The codebase already uses Zustand for `active-color-store`.

## Goals / Non-Goals
- Goals:
  - Move editor UI state into a centralized Zustand store with typed actions.
  - Reduce prop drilling by allowing components to subscribe to slices of UI state.
  - Preserve runtime behavior and existing UI flows.
- Non-Goals:
  - Replacing `StyleStore`, `ApiStyleStore`, or `RevisionStore`.
  - Changing persistence semantics, network synchronization, or undo/redo logic.
  - Refactoring components beyond wiring to the new store.

## Decisions
- Decision: Create a dedicated `editor-ui-store` using `zustand` `create` with a typed state interface and action methods.
  - Why: Aligns with existing Zustand usage and enables selector-based subscriptions.
- Decision: Keep style persistence and revision history in their current classes.
  - Why: These are not UI-only concerns and already encapsulate persistence semantics.
- Decision: Migrate in one pass for UI state (panels, selection, modal visibility, view state, debug flags).
  - Why: Ensures consistent state management without partial hybrid UI state.

## Risks / Trade-offs
- Risk: Introducing a single UI store may encourage oversized global state.
  - Mitigation: Provide selector hooks and scoped actions, avoid dumping non-UI data.
- Risk: Behavior regressions due to mismatched `setState` semantics.
  - Mitigation: Preserve state transitions and update order; add validation steps.

## Migration Plan
1. Define Zustand UI store with current `App.state` shape for UI-only fields.
2. Replace `App` local UI state with store selectors/actions.
3. Update child components to read from store instead of props for UI state.
4. Verify modal visibility, side view switching, and selection behaviors.

## Open Questions
- Should error/info toasts remain in UI store or be split into a notification store later?
