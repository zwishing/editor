# layer-editor Specification

## Purpose
TBD - created by archiving change refine-layer-editor-ui. Update Purpose after archive.
## Requirements
### Requirement: Opaque Settings Menu

The "More Options" menu in the Layer Editor header MUST have a solid, opaque background to ensure readability against the map or other content.

#### Scenario: Opening the menu

- **Given** the Layer Editor is open
- **When** the user clicks the "More Options" button
- **Then** the dropdown menu MUST appear with a solid background color (e.g., white or dark gray) covering underlying content

### Requirement: Tabbed Layer Properties

Layer properties MUST be organized into three distinct tabs: "Style", "Data", and "JSON", with the tab navigation fixed at the bottom of the panel.

#### Scenario: Tab Organization

- **Given** the Layer Editor
- **Then** properties MUST be grouped as follows:
  - **Style Tab**: ID, Layout properties, Paint properties (Default tab)
  - **Data Tab**: Filter settings
  - **JSON Tab**: JSON Editor
- **And** the Tabs navigation control MUST be fixed at the bottom of the panel

### Requirement: Visual Consistency with Layer List

The Layer Editor MUST match the visual styling (margins, padding, font sizes, borders) of the Layer List panel.

#### Scenario: Comparing Borders

- **Given** the Layer Editor header
- **Then** it MUST have a single light gray bottom border matching the Layer List
- **And** there MUST NOT be any double borders or dark/black lines separating content

#### Scenario: Typography

- **Given** text in the Layer Editor
- **Then** the font size MUST match the Layer List (e.g., text-sm)

