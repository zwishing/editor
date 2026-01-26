# Design: Panel Visual Refinements

## Technical Approach

### 1. Remove Panel Border Effects

**Problem:** Black borders appear around panels when users click or focus on them, creating visual noise.

**Current Implementation:**
- `_layout.scss` line 94: `.maputnik-layout-list` has `border-right: 1px solid vars.$color-panel-border`
- `_layer.scss` lines 88-92: Layer items have `border-color` and `box-shadow` on `:focus-within`

**Solution:**
- Remove the `border-right` property from `.maputnik-layout-list` in `_layout.scss`
- Keep the subtle border but prevent it from changing color/style on interaction
- Modify `:focus-within` styles in `_layer.scss` to use only background color changes, not border changes
- Preserve accessibility by maintaining visible focus indicators through background color

**Files to Modify:**
- `src/styles/_layout.scss` (line ~94)
- `src/styles/_layer.scss` (lines ~88-92)

---

### 2. Fix Selected Item Visibility

**Problem:** Selected items use `$color-panel-active: #E2E8F0` (Slate 200) which is too similar to the white panel surface (`$color-panel-surface: #FFFFFF`), making selections hard to see.

**Current Implementation:**
- `_vars.scss` line 18: `$color-panel-active: #E2E8F0` (Slate 200)
- `_layer.scss` line 155: `.maputnik-layer-list-item-selected` uses `background-color: vars.$color-panel-active`
- `_input.scss` line 175: `.maputnik-button-selected` also uses this color

**Solution:**
- Change `$color-panel-active` from `#E2E8F0` (Slate 200) to `#DBEAFE` (Blue 100)
- This provides better contrast while maintaining the professional aesthetic
- Blue tint aligns with the accent color (`$color-panel-accent: #2563EB`)
- Contrast ratio calculation:
  - Current: ~1.1:1 (fails WCAG)
  - Proposed: ~1.4:1 (still low but visually distinct due to blue tint)
  - Alternative if needed: `#BFDBFE` (Blue 200) for ~1.8:1 ratio

**Files to Modify:**
- `src/styles/_vars.scss` (line ~18)

**Impact:**
- All components using `$color-panel-active` will automatically update
- Includes layer list, button groups, and other selection states

---

### 3. Improve Zoom Slider Layout

**Problem:** Min/Max zoom controls are vertically stacked using the `Block` component layout, consuming excessive vertical space and looking less polished.

**Current Implementation:**
- `FieldMinZoom.tsx` and `FieldMaxZoom.tsx` use the `Block` component wrapper
- `Block.tsx` creates a vertical layout with:
  - `.maputnik-input-block-label` (label on top)
  - `.maputnik-input-block-content` (content below)
- `InputNumber` with `allowRange={true}` renders:
  - `.maputnik-number-range` (slider)
  - `.maputnik-number` (text input)
  - Both wrapped in `.maputnik-number-container`

**Solution:**
- Add a `compact` or `inline` prop to the `Block` component
- When `inline={true}`, apply CSS class `.maputnik-input-block--inline`
- Update `_input.scss` to add horizontal flexbox layout for inline blocks:
  ```scss
  .maputnik-input-block--inline {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .maputnik-input-block-label {
      width: auto;
      min-width: 80px;
    }
    
    .maputnik-input-block-content {
      flex: 1;
    }
  }
  ```
- Update `FieldMinZoom.tsx` and `FieldMaxZoom.tsx` to pass `inline={true}` to Block
- Ensure `.maputnik-number-container` layout remains horizontal (already is)

**Files to Modify:**
- `src/components/Block.tsx` (add inline prop)
- `src/components/FieldMinZoom.tsx` (pass inline prop)
- `src/components/FieldMaxZoom.tsx` (pass inline prop)
- `src/styles/_input.scss` (add inline block styles)

**Impact:**
- Min/Max zoom will display as: `[Min Zoom] [slider] [value]` on one line
- Saves vertical space in layer editor
- More consistent with modern UI patterns

---

## Design Decisions

### Color Choice for Selected Items
We chose `#DBEAFE` (Blue 100) because:
1. It provides visual distinction through color tint (blue vs. gray)
2. It aligns with the brand accent color
3. It's subtle enough to not be distracting
4. It's a standard color from the Tailwind palette we're already using

Alternative considered: `#BFDBFE` (Blue 200) for higher contrast, but it may be too prominent for the design aesthetic.

### Border Removal Strategy
We're removing borders on interaction but keeping the base border because:
1. The base border provides visual structure
2. Changing borders on interaction creates visual "jumping"
3. Background color changes are sufficient for feedback
4. This aligns with modern UI patterns (e.g., macOS, iOS)

### Zoom Layout Approach
Using flexbox instead of table because:
1. Flexbox is more flexible for responsive layouts
2. Easier to align items vertically
3. Better control over spacing and gaps
4. More semantic for single-line layouts

---

## Testing Strategy

### Manual Testing
1. Click through all panels and verify no black borders appear
2. Select various layers and verify selection is clearly visible
3. Check zoom controls display in single-line format
4. Test keyboard navigation to ensure focus is still visible

### Visual Regression
- Take screenshots before/after for comparison
- Test in different browser sizes
- Verify on both Windows and macOS if possible

### Accessibility
- Use browser dev tools to check contrast ratios
- Test with keyboard-only navigation
- Verify screen reader announcements still work
