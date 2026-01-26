# Design: Base Components Refactor

## Objective
Standardize the look and feel of Maputnik's atomic controls while modernizing the codebase to use Shadcn and Tailwind CSS.

## Architectural Decisions

### Preservation of Props Interface
We will not change the `Props` definitions. This is a non-negotiable constraint to allow a safe "bottom-up" refactor. Any improvement to the API should be a separate change after the styles are migrated.

### Class Components vs Functional Components
Maputnik's original base components are mostly Class Components. We will convert them to Functional Components during this refactor because:
1. Shadcn components are designed for Functional Components and Hooks.
2. It reduces boilerplate for simple atomic controls.
3. React 19 is used, where Functional Components are the standard.

### Style Migration
Classes like `maputnik-input-block` are often used for layout density. We need to ensure that the Tailwind classes we apply (e.g., `h-8`, `text-xs`) match the existing compact editor design.

## Component Mapping Table

| Original Component | Shadcn equivalent | Notes |
| :--- | :--- | :--- |
| `InputButton` | `Button` | Use `variant="outline"` or `ghost` by default. |
| `InputCheckbox` | `Checkbox` | |
| `InputString` | `Input` / `Textarea` | |
| `InputSelect` | `NativeSelect` | Users prefer native dropdowns for specific contexts, keep using the pattern introducing in `ui/native-select`. |
| `InputNumber` | `Input` + `Slider` | |
| `InputAutocomplete`| `Combobox` | Already refactored. |
| `InputColor` | Custom + Tailwind | Shadcn lacks a native color picker. |
| `SmallError` | Tailwind | Standardize error colors. |
