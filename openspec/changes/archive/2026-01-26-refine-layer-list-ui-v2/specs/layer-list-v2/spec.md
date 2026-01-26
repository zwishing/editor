# Spec: Layer List UI Refinement v2

## ADDED Requirements

### Requirement: Layout and Visual Polish

The Layer List and Layer Editor MUST be visually consistent and address specific user feedback regarding width, headers, and icons.

#### Scenario: Layer List Width

- **Given** the application layout
- **Then** the Layer List panel MUST have an increased width (e.g., ~300px) to accommodate content better

#### Scenario: Header Consistency

- **Given** the Layer List and Layer Editor headers
- **Then** they MUST have matching heights, font sizes, and padding
- **And** they MUST have a light divider line separating them from the content
- **And** the Layer List header button items MUST be vertically aligned

#### Scenario: Persistent Hidden Icon

- **Given** a layer is hidden (visibility='none')
- **Then** the "eye-off" icon MUST be visible at all times, not just on hover

#### Scenario: Group Styling

- **Given** a layer group is displayed
- **Then** there MUST NOT be any residual black horizontal lines or borders at the bottom
