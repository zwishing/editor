# theming Specification

## Purpose
TBD - created by archiving change improve-ui-ux. Update Purpose after archive.
## Requirements
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

### Requirement: Centralized Brand Color

The application MUST use a single source of truth for the brand color (`--brand-base`), defined as an HSL value to support opacity modifiers.

#### Scenario: Update Brand Color

Given the brand color is updated in `globals.css`
When the changes are saved
Then all components using `--primary`, `--ring`, `--accent`, and `--sidebar-ring` reflect the new color.

### Requirement: Interaction States

Interactive elements MUST use consistent state colors:

- **Default**: `--muted-foreground` (icons), `--foreground` (text).
- **Hover**: `--accent` (background), `--accent-foreground` (text).
- **Active/Selected**: `--primary` (background), `--primary-foreground` (text) OR `--panel-active` (tinted background) + `--primary` (border/text).
- **Disabled**: `--muted` (background/text) with `opacity-50`.

#### Scenario: Hover State

Given a clickable element (button, list item)
When the user hovers over it
Then the background color changes to `--accent` (or a distinct hover color) and text color to `--accent-foreground`.

### Requirement: Typography Tokens

Font sizes and families MUST be standardized:

- **Heading**: `Space Grotesk` via `font-heading`.
- **Body**: `DM Sans` via `font-sans`.
- **Mono**: `JetBrains Mono` via `font-mono`.
- **Sizes**: `text-xs` (12px), `text-sm` (14px), `text-base` (16px).

#### Scenario: Heading Font

Given a page with a header
When the page is rendered
Then the header uses `font-heading` (Space Grotesk).

### Requirement: Spacing Tokens

Spacing MUST follow the 4px grid system using Tailwind standard classes (`p-1`, `m-2`, `gap-4`, etc.).

#### Scenario: Layout Spacing

Given a layout component
When spacing is applied
Then it uses values like `p-2`, `m-4` which map to multiples of 4px.

