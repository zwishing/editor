# Spec: Layer List UI Refinement

## ADDED Requirements

### Requirement: Improved Layer List Visuals

The Layer List MUST have improved visual styling including hover effects, increased spacing, and consistent headers.

#### Scenario: Hovering over a layer

- **Given** the user is viewing the layer list
- **When** they hover over a layer item
- **Then** the item MUST show a distinct, light background color change

#### Scenario: Viewing layer list text

- **Given** the layer list is populated
- **Then** ALL text elements (including headers, group titles, layer items, and icons) MUST use a larger font size (e.g., increasing base size from 12px to 14px) to ensure better readability across the entire component.
- **And** there MUST be increased horizontal and vertical padding (addressing "左右边距" and general spacing) around items
- **And** there should be vertical spacing between items
- **And** there should typically be no horizontal divider lines between items

#### Scenario: Viewing layer groups

- **Given** the layer list contains groups
- **Then** group headers should be visually distinct from items (e.g. bold, colored)

#### Scenario: Viewing panel header

- **Given** the layer list panel is visible
- **Then** the header height should match other main panels in the application
