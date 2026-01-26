# Design: Advanced Components Refactor

## Architecture Overview

The property editing system in Maputnik follows a deeply nested hierarchy:

1.  **PropertyGroup**: Orchestrates a list of properties for a layer.
2.  **FieldFunction**: A complex wrapper that switches between literal values, zoom functions, data functions, and expressions.
3.  **Property Wrappers**: `_SpecProperty`, `_DataProperty`, `_ZoomProperty`, `_ExpressionProperty` - these manage the state and layout for different property types.
4.  **FieldSpec / Block**: Standard containers for labels, documentation, and error messages.
5.  **InputSpec**: A router that selects the appropriate input component based on the style specification.
6.  **InputComponents**: Atomic inputs (`InputString`, `InputNumber`) or complex ones (`InputDynamicArray`, `InputAutocomplete`).

## Refactoring Strategy

### 1. Class to Functional Components
All remaining class components in this hierarchy will be converted to functional components using `useMemo`, `useCallback`, and `useState`.

### 2. Styling Migration
- Remove all SASS files associated with these components (e.g., `SmallError.scss` - though most were already removed).
- Replace `.maputnik-*` classes with Tailwind CSS utility classes.
- Use `cn` utility for conditional classes.
- Maintain the visual density and layout by carefully mapping BEM styles to Tailwind (e.g., `flex`, `items-center`, `gap-2`, `w-full`).

### 3. Shadcn/UI Integration
- Use `Button` from Shadcn for action buttons in `_FunctionButtons`.
- Use `Collapser` (already refactored) for collapsible sections.
- Ensure `InputAutocomplete` uses the new `Combobox` (based on Shadcn) where appropriate.

### 4. Component Dependencies
The refactor must proceed bottom-up where possible, but since base components are already done, we can now tackle the intermediate and top-level property components.

| Component | Status | New Implementation |
| :--- | :--- | :--- |
| `PropertyGroup` | Class | Functional + Tailwind |
| `Fieldset` | Functional | Tailwind-only updates |
| `InputSpec` | Class | Functional + Tailwind |
| `_SpecProperty` | Class | Functional + Tailwind |
| `_DataProperty` | Class | Functional + Tailwind |
| `_ZoomProperty` | Class | Functional + Tailwind |
| `_ExpressionProperty` | Class | Functional + Tailwind |
| `_FunctionButtons` | Class | Functional + Tailwind + Shadcn Button |

## Data Flow
The `onChange` and `value` props will remain identical to ensure no breakage in `App.tsx` or other top-level container components.
