# Tasks: Refine Panel UI Details

## Implementation Tasks

- [x] **Remove panel border effects** <!-- id: 1 -->
  - Update `_layout.scss` to remove `border-right` from `.maputnik-layout-list`
  - Remove focus-within border effects from layer items in `_layer.scss`
  - Test clicking on all panels (Layers, Sources, Code, Settings, Global State)

- [x] **Fix selected item visibility** <!-- id: 2 -->
  - Change `$color-panel-active` in `_vars.scss` from `#E2E8F0` (Slate 200) to `#DBEAFE` (Blue 100) for better contrast
  - Update `.maputnik-layer-list-item-selected` background color in `_layer.scss`
  - Update `.maputnik-button-selected` background color in `_input.scss`
  - Verify selected items are clearly visible in layer list and other components

- [x] **Improve zoom slider layout** <!-- id: 3 -->
  - Modify `_ZoomProperty.tsx` to use flexbox layout instead of table for min/max zoom
  - Update `_zoomproperty.scss` to style single-line layout
  - Ensure label, slider, and value display inline
  - Test with various zoom ranges to ensure layout remains stable

## Verification Tasks

- [x] **Visual regression testing** <!-- id: 4 -->
  - Manually test all panel interactions
  - Verify selected items are visible across all components
  - Check zoom property layout in layer editor
  - Test in both light and dark themes (if applicable)

- [x] **Accessibility check** <!-- id: 5 -->
  - Verify WCAG contrast ratios for selected items
  - Ensure keyboard navigation still works correctly
  - Test with screen reader if available
