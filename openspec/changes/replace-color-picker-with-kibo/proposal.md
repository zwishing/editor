# Proposal: Replace Color Picker with Kibo-UI

## Goal
Replace the legacy `react-color` dependency with the internal `kibo-ui/color-picker` component to unify the UI design system and reduce external dependencies.

## Scope
- Refactor `InputColor.tsx` to use `src/components/kibo-ui/color-picker`.
- Ensure all color inputs across the application (Layer Editor, etc.) automatically inherit the new picker via `InputColor`.
- Maintain existing functionality: hex/rgba input, transparency support, and popover behavior.

## Implementation Details
- `InputColor` will continue to handle the "input field" and "preview swatch" presentation.
- The `ChromePicker` from `react-color` will be replaced by a composition of `ColorPicker` + `ColorPickerSelection` + `ColorPickerHue` + `ColorPickerAlpha` + `ColorPickerFormat` inside a Popover.
- Ensure the new picker supports the same color formats (hex strings, rgba strings) expected by the application.
