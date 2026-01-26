# Specification: Property Editor UI

## ADDED Requirements

### Requirement: Block Layout

The `Block` component MUST adapt its layout to accommodate variable-width actions without overlapping the input field.

#### Scenario: Responsive Action Width

- **GIVEN** a `Block` component in standard mode (not wide, not inline)
- **WHEN** rendering the Action container
- **THEN** it must use `w-auto` instead of fixed `w-[64px]` to accommodate multiple buttons without overlap/wrapping.
- **AND** the Content container must use `flex-1` and `min-w-0` to handle remaining space gracefully.

## ADDED Requirements

### Requirement: Function Buttons UI

The property function buttons MUST be presented as simple icons with tooltips.

#### Scenario: Enhanced Presentation

- **GIVEN** property function buttons (Zoom, Data, Expression)
- **WHEN** rendered
- **THEN** they must use the updated `InputButton` (ghost style).
- **AND** they must be wrapped in `Tooltip` to display descriptive text on hover.
