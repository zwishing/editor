# Proposal: Fix Overlapping Property Action Buttons

## Goal
Improve the UI of the Zoom and Data property editors by resolving the overlapping "Add Stop" and "Convert to Expression" buttons, grouping them together, and right-aligning them.

## Context
When a property is converted to a zoom function or a data function, the editor displays buttons to add new stops or convert the entire function to an expression. Currently, these buttons use `InputButton`, which has a fixed small size (`h-6 w-6`) intended for icons. When used with text, the buttons overlap or the text is truncated.

## Proposed Strategy
1.  **Layout Refactor**: Wrap the buttons in a right-aligned container (`flex justify-end`).
2.  **Component Enhancement**: Update `InputButton` (or use `Button` directly) to support text labels with proper padding and flexible width.
3.  **Visual Polish**: Ensure consistent icons and spacing.

## Capabilities
- `ui-layout`: Improved button group layout and alignment.
- `component-fix`: Proper rendering of buttons with text in property editors.
