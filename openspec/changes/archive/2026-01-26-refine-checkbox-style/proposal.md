# Refine Checkbox Style

## Why

The current checkbox implementation in `InputCheckbox.tsx` overrides the default Shadcn UI styles, making it larger (`24px` vs `16px`) and adding custom border colors. The user requested the "original shadcn effect" to match the rest of the UI and reduce visual weight.

## What Changes

### UI Components

- **InputCheckbox**: Remove custom `h-[24px] w-[24px]` and border overrides. Pass `className` through but rely on the default `Checkbox` styles from `src/components/ui/checkbox.tsx`.

## User Review Required

None. This is a direct style reversion request.

## Verification Plan

### Manual Verification

- **Visual**: Open Layer Editor -> Paint Properties -> Boolean fields (e.g. `fill-antialias`).
  - Checkbox should be small (16x16 standard).
  - Checkbox should use primary color on checked state without custom blue overrides.
