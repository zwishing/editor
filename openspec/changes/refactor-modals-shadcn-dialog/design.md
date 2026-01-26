# Design: Modal Refactor to Shadcn/UI Dialog

## Component Mapping
The legacy `ModalInternal` props will map as follows:
- `isOpen` -> Passed to `Dialog`'s `open` prop.
- `onOpenToggle` -> Wrapped by a handler passed to `onOpenChange`.
- `title` -> Rendered inside `DialogTitle`.
- `children` -> Rendered inside `DialogContent`.

## Styling
Existing SCSS classes like `.maputnik-modal` will be replaced with Tailwind utilities within the `Modal.tsx` wrapper. We will ensure the "scroller" behavior is maintained using Tailwind `overflow-y-auto` on the content wrapper.

## Key Changes
- Remove `withTranslation` HOC; inject `useTranslation` in each functional modal.
- Replace `react-aria-modal` with `@/components/ui/dialog`.
- Use `DialogDescription` (optional or hidden) to satisfy SR requirements if needed.
