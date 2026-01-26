# Theming Specs

## ADDED Requirements
### Requirement: Professional Color System
The system SHALL use a refined color palette with support for dark mode.
#### Scenario: Color Palette
- The application MUST use the `Slate` scale for neutrals and `Indigo` for primary actions.
- **Global:** Define CSS variables or Tailwind config.

#### Scenario: Dark Mode
- All components MUST support dark mode with appropriate contrast corrections.
- **Global:** `dark:` variants for all surface and text colors.

#### Scenario: Interaction States
- Interactive elements MUST have clear hover, active, and focus states.
- **Components:** `Button`, `Input`, `Select`.
