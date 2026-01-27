## ADDED Requirements
### Requirement: Editor UI state is managed by Zustand
The system SHALL manage editor UI state (panels, selection, modal visibility, view state, and debug flags) in a Zustand store and expose typed actions for updates.

#### Scenario: Switching side panels
- **WHEN** the user selects a different side panel (layers/settings/sources/global state/code editor)
- **THEN** the active side panel state SHALL update via the UI store

#### Scenario: Toggling modals
- **WHEN** the user opens or closes a modal (settings, sources, open, shortcuts, export, debug)
- **THEN** modal visibility SHALL update via the UI store

#### Scenario: Layer selection updates
- **WHEN** the user selects a layer or clears the selection
- **THEN** the selected layer state SHALL update via the UI store

#### Scenario: Map view changes
- **WHEN** the user changes zoom or map center
- **THEN** map view state SHALL update via the UI store

#### Scenario: Debug option changes
- **WHEN** the user toggles MapLibre/OpenLayers debug options
- **THEN** debug flag state SHALL update via the UI store
