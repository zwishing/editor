# Change: Update InputNumber with shadcn/ui

## Why
InputNumber is currently implemented with custom markup and SASS styling. We want to rebuild it using shadcn/ui components while preserving the existing API and behavior so current usage remains unchanged.

## What Changes
- Rebuild `InputNumber` to use shadcn/ui input components where possible.
- Preserve the existing props, events, range behavior, and data attributes.
- Keep existing CSS behavior stable so current screens do not regress.

## Impact
- Affected specs: `specs/ui-components/spec.md`
- Affected code: `src/components/InputNumber.tsx` and shadcn ui component files in `src/components/ui/`
