# Change: Refactor Advanced Components to Tailwind & Shadcn

## Why
The project is moving towards a modern stack using Tailwind CSS and Shadcn/UI. The base components have been refactored, and now the higher-level "advanced" components that compose these base components need to be modernized to ensure a consistent styling approach and eliminate legacy SASS dependencies in the property editing pane.

## What Changes
- Convert class-based "advanced" components to functional components using React hooks.
- Replace legacy `.maputnik-*` BEM styles with Tailwind CSS utility classes.
- Maintain 100% backward compatibility with existing `props` and behavior.
- Improve code readability and maintainability by using modern React patterns and Shadcn/UI primitives.
- Integrate Shadcn/UI components (like Button) into property editing sub-components.

## Impact
- Affected specs: `advanced-components`
- Affected code: `PropertyGroup.tsx`, `Fieldset.tsx`, `InputSpec.tsx`, `_SpecProperty.tsx`, `_DataProperty.tsx`, `_ZoomProperty.tsx`, `_ExpressionProperty.tsx`, `_FunctionButtons.tsx`, etc.
