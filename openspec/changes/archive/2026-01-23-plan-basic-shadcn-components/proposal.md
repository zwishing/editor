# Change: Plan basic shadcn component replacement

## Why
The codebase is in a hybrid state with shadcn/ui partially integrated. We need a clear, incremental plan to replace legacy base components while keeping existing prop APIs stable so downstream components do not break.

## What Changes
- Define a phase-1 scope of base components to replace with shadcn/ui primitives and wrappers.
- Specify API-compatibility requirements for each base component (props, events, and behavior).
- Document a migration strategy that preserves existing visual behavior and accessibility expectations.

## Impact
- Affected specs: `openspec/specs/ui-components/spec.md`
- Affected code: `src/components/InputButton.tsx`, `src/components/InputCheckbox.tsx`, `src/components/InputSelect.tsx`, `src/components/InputString.tsx`, `src/components/InputUrl.tsx`, `src/components/Fieldset.tsx`, `src/components/ui/*`
