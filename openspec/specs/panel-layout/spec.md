# panel-layout Specification

## Purpose
TBD - created by archiving change update-panel-ui. Update Purpose after archive.
## Requirements
### Requirement: Light panel surfaces for list and editor
The system SHALL render the layer list panel and layer editor panel with clean Geo-SaaS surfaces that visually separate them from the map and toolbar while preserving existing typography. The panels MUST use a distinct surface color, a 1px border, and a subtle shadow to communicate hierarchy.

#### Scenario: Default layout surfaces
- **WHEN** the app loads with the code editor closed
- **THEN** the list and editor panels use light surface backgrounds and readable dark text

### Requirement: Panel sizing and spacing
The system SHALL set the layer list width to 240px and the layer editor width to 420px with consistent internal padding and a visible divider between panels and the map.

#### Scenario: Panel widths
- **WHEN** the layer editor is visible
- **THEN** the list panel is 240px wide and the editor panel is 420px wide

### Requirement: Subtle panel transitions
The system SHALL apply 150-200ms transitions for panel background, border, and shadow changes and respect prefers-reduced-motion.

#### Scenario: Reduced motion
- **WHEN** prefers-reduced-motion is enabled
- **THEN** panel transitions are disabled

### Requirement: Hover and focus states
The system SHALL provide visible hover and keyboard focus states for list rows and panel controls using the accent color with sufficient contrast.

#### Scenario: Row interaction states
- **WHEN** a user hovers or focuses a layer row
- **THEN** the row shows a visible highlight or outline without shifting layout

### Requirement: Header light chrome
The system SHALL render the top header as a light surface with a subtle 1px divider and muted default text/icons that brighten on hover.

#### Scenario: Header hover feedback
- **WHEN** a user hovers a header item
- **THEN** the item text or icon increases in contrast and shows a soft background

### Requirement: Layer list active rail
The system SHALL show a 3px primary-colored rail on the left edge of the active layer list item with a soft active background.

#### Scenario: Active layer affordance
- **WHEN** a layer item is selected
- **THEN** the active rail is visible and the row background uses a light primary tint

### Requirement: Modernized form controls
The system SHALL render property inspector inputs at 32px height with a clear focus ring and aligned labels using secondary text color.

#### Scenario: Input focus feedback
- **WHEN** a user focuses an input or select
- **THEN** a primary-colored ring or glow is visible without layout shift

### Requirement: Slider styling
The system SHALL style range sliders with a subtle neutral track, primary-colored fill, and a compact thumb that remains visible on light surfaces.

#### Scenario: Slider visibility
- **WHEN** a user adjusts a slider
- **THEN** the track, fill, and thumb remain clearly visible against the panel surface

### Requirement: Code editor panel scrolling
The system SHALL allow vertical scrolling within the code editor panel so users can reach all code content without scrolling the overall page.

#### Scenario: Code editor scroll
- **WHEN** the code editor panel is open and content exceeds the viewport height
- **THEN** the code editor panel scrolls vertically to reveal hidden content

### Requirement: Immediate select input response
The system SHALL apply select input changes without perceptible delay so dependent UI updates appear immediately after selection.

#### Scenario: Select change
- **WHEN** a user selects a different option from any select input
- **THEN** the new value and any dependent UI updates are applied immediately

### Requirement: Layer group folder icon
The system SHALL render a folder-style icon before each layer group title to indicate grouped layers.

#### Scenario: Group header display
- **WHEN** the layer list renders a grouped set of layers
- **THEN** the group header shows a folder icon before the group title

