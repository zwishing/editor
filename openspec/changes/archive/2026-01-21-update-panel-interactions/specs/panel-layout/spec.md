## ADDED Requirements
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
