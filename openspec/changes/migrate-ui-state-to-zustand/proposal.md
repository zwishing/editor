# Change: Migrate editor UI state to Zustand

## Why
The editor UI state is centralized in the `App` class component and relies on `setState`, which makes state flows harder to follow and limits reuse. Migrating UI state to Zustand reduces prop drilling, enables targeted subscriptions, and aligns with existing Zustand usage in the codebase.

## What Changes
- Introduce a Zustand store for editor UI state (panels, selections, modal visibility, view state, debug options).
- Replace `App.state` UI updates with store actions/selectors.
- Keep persistence/history (`StyleStore`, `ApiStyleStore`, `RevisionStore`) unchanged.

## Impact
- Affected specs: `editor-state` (new)
- Affected code: `src/components/App.tsx`, UI panels/modals consuming UI state, new store module under `src/libs/store/`
