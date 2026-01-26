# Refine Property Function Buttons

## Why

The current property function buttons (Convert to Zoom, Data, Expression) have several UI issues:

1.  **Visual Style**: The "circled" button style is visually heavy and outdated. User requested "only icons, no circles".
2.  **Accessibility**: Tooltips rely on native `title` attribute. User requested "display prompt text content on move up", implying a better UI tooltip.
3.  **Layout**: The buttons are constrained by a fixed width (`w-[64px]`) in the `Block` component, causing them to be blocked or cut off by the input field when multiple buttons are present.

## What Changes

### 1. UI Components

- **InputButton**: Remove the "rounded-full" and border styles. Make it a ghost/plain icon button.
- **Tooltip**: Introduce `shadcn/ui/tooltip` (using `@radix-ui/react-tooltip`) to provide consistent, styled hover tooltips.

### 2. Block Layout

- **Responsiveness**: Remove the fixed `w-[64px]` constraint on the Action block in `Block.tsx`. Allow it to size based on content (`w-auto`), ensuring all buttons are visible.
- **Flexibility**: Ensure the Content block (`flex-1`) shrinks correctly (`min-w-0`) to accommodate the wider Action block without breaking layout.

### 3. Function Buttons

- **Integration**: Update `_FunctionButtons.tsx` to use the new `Tooltip` and `InputButton` styles.
- **Structure**: Ensure buttons are grouped flexibly.

## User Review Required

- Confirm if "Ghost" style (no background, only icon) is desired, or if a subtle hover background is needed (standard ghost button behavior).
- Confirm layout adjustment (Action block taking more space means Input gets slightly less space on the same line).

## Verification Plan

### Automated

- `openspec validate` to ensure spec compliance.

### Manual Verification

- **Visual**: Check Layer Editor properties (e.g., `circle-radius`).
  - Buttons should be icons only (no circles).
  - Tooltips should appear on hover (shadcn style).
  - All buttons (Zoom, Data, Expression) should be visible and not overlapped by the input.
- **Interaction**: Click buttons to verify they still trigger conversions.
