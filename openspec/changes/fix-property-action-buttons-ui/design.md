# Design: Fix Overlapping Property Action Buttons

## Architecture
The property editors (`_ZoomProperty.tsx` and `_DataProperty.tsx`) are shared components used in the Layer Editor. They rely on `InputButton` for actions.

## Decisions
### 1. Button Grouping
We will use a flexbox container with `justify-end` to align the action buttons to the right side of the editor pane, matching common UI patterns for "Add" and "Convert" actions.

### 2. InputButton vs Button
`InputButton` is currently hardcoded to `h-6 w-6`. We have two choices:
- A: Modify `InputButton` to accept `className` that can override `h-6 w-6` (already does, but we need to pass it).
- B: Use the underlying `Button` component directly for text-based buttons.
We will go with **A** to maintain consistency in button styles while allowing flexible widths.

## Alternatives Considered
- Keeping them left-aligned but fixing the size: This solves the overlap but doesn't meet the user's request for right-alignment.
