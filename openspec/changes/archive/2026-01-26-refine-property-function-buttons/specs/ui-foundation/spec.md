# Specification: UI Foundation

## ADDED Requirements

### Requirement: InputButton Styles

The `InputButton` component MUST utilize a ghost-style appearance to reduce visual clutter.

#### Scenario: Ghost Style

- **GIVEN** an `InputButton` component
- **WHEN** it is rendered
- **THEN** it must use `variant="ghost"` and remove `rounded-full` to present as a minimal icon button effectively removing the "circle".

## ADDED Requirements

### Requirement: Tooltip Component

The application MUST include a standard `Tooltip` component for consistent hover interactions.

#### Scenario: Component Existence

- **GIVEN** the Shadcn UI library pattern
- **WHEN** `Tooltip` is requested
- **THEN** it must wrap `@radix-ui/react-tooltip` and provide `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`.
