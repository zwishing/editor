# Tasks

- [x] feat(ui): add Tooltip component
  - Install `@radix-ui/react-tooltip`
  - Create `src/components/ui/tooltip.tsx`
- [x] refactor(ui): update InputButton style
  - Change strict styled component to flexible ghost button (remove circle)
  - Ensure it accepts ref (for Tooltip trigger)
- [x] refactor(layout): fix Block action width
  - Change `w-[64px]` to `w-auto` in `Block.tsx`
  - Ensure layout prevents input overlap
- [x] refactor(components): update Property Function Buttons
  - Use `Tooltip` for hover text
  - Update structure in `_FunctionButtons.tsx`
