# Specification: UI Components

## ADDED Requirements

### Requirement: Checkbox Style

The `InputCheckbox` component MUST use the standard Shadcn `Checkbox` styles without custom size or border overrides.

#### Scenario: Standard Appearance

- **GIVEN** an `InputCheckbox` component
- **WHEN** it is rendered
- **THEN** it must use the default size (16px/h-4) and colors defined in `src/components/ui/checkbox.tsx`.
