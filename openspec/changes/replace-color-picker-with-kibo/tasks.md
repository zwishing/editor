## 1. Implementation
- [x] 1.1 Refactor `InputColor.tsx` to remove `react-color` and use `kibo-ui/color-picker`.
- [x] 1.2 Implement Popover behavior for the new color picker (using shadcn/ui Popover if available, or custom).
- [x] 1.3 Ensure `InputColor` accepts and returns color strings compatible with existing data (hex, rgba).
- [x] 1.4 Remove `react-color` and `@types/react-color` from `package.json` if no longer used.

## 2. Validation
- [x] 2.1 Verify color picker works in Layer Editor (Paint properties).
- [x] 2.2 Verify transparency (alpha channel) works correctly.
- [x] 2.3 Check for any layout regressions in the color input field itself.
