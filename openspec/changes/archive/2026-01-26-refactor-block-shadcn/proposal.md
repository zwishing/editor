# Refactor Block Component with shadcn/ui

## Why
The current `Block` component uses custom CSS (`maputnik-input-block`) and lacks consistency with the new shadcn/ui design system. We want to standardize all UI components to use shadcn primitives to improve maintainability and visual consistency.

## What
- Replace the internal implementation of `src/components/Block.tsx`.
- Use `Card`, `Label`, or composed `div`s with Tailwind utility classes instead of custom SCSS.
- Ensure the public API (`BlockProps`) remains unchanged (except potentially removing `style` if we want to enforce strict tokens).
- Maintain current functionality: label, action slot, documentation toggle.
- Create new shadcn components (`card.tsx`, `label.tsx`) if they don't exist in `src/components/ui`.
