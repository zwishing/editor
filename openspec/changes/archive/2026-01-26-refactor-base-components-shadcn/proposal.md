# Refactor Base Components to Shadcn and Tailwind CSS

## Goal
Migrate all "base components" in `src/components` to use `shadcn/ui` primitives or Tailwind CSS. Eliminate dependency on SASS and `classnames` within these components while strictly maintaining the current props interface to avoid breaking changes in the rest of the application.

## Context
The project is transitioning to a modern UI stack based on Shadcn and Tailwind. Base components (those that don't depend on other business components) are the foundation of this migration.

## Proposed Changes

### Atomic Input Components
- **InputCheckbox.tsx**: Refactor to use `src/components/ui/checkbox.tsx`.
- **InputString.tsx**: Refactor to use `src/components/ui/input.tsx` and `src/components/ui/textarea.tsx`.
- **InputSelect.tsx**: Refactor to use `src/components/ui/native-select.tsx` (or `ui/select`).
- **InputNumber.tsx**: Refactor to use `src/components/ui/input.tsx` and `src/components/ui/slider.tsx`.
- **InputButton.tsx**: Refactor to use `src/components/ui/button.tsx`.
- **InputAutocomplete.tsx**: Ensure it is fully transitioned to `ui/combobox` and uses Tailwind only.

### Composite / Custom Base Components
- **InputMultiInput.tsx**: Implement radio-button group using Tailwind CSS to match the existing look.
- **InputColor.tsx**: Use Tailwind for the wrapper and swatch; keep `react-color` but style the layout with utility classes.
- **InputJson.tsx**: Use Tailwind for the Codemirror container.

### Utility & Layout Components
- **Doc.tsx**: Migrate `SpecDoc` classes to Tailwind.
- **SmallError.tsx**: Remove `SmallError.scss`, use Tailwind for error styling.
- **Collapse.tsx / Collapser.tsx**: Migrate to Tailwind.
- **IconLayer.tsx / ScrollContainer.tsx**: Simple Tailwind migrations.

## Design
- **API Preservation**: Every component MUST keep its existing `Props` type and default exports.
- **Styling**: All BEM-style classes (e.g., `maputnik-checkbox`) and SASS imports will be removed. Tailwind classes will be used to recreate the existing layout and aesthetics within the Shadcn theme.
- **Implementation**: Class-based components should be converted to Functional Components where appropriate to better align with Shadcn patterns, provided the interface remains identical.

## Verification Plan
1. **Visual Regression**: Manual check of each base component in the editor (Property Inspector, Modals).
2. **Prop Validation**: Ensure all existing uses of these components still work without requiring parent-level changes.
3. **Build Check**: Ensure SASS removal doesn't break global styles (if variables were shared, though base components shouldn't export global SASS).
