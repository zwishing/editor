# Spec Delta: Sources Panel Refactor

## MODIFIED Requirements

### Requirement: Modernized Sources Panel
Functional component implementation of the Data Sources panel. The system SHALL maintain source management capabilities (Add/Remove/Select Public Source) while utilizing functional components and React hooks.

#### Scenario: Add New Source
- **WHEN** the user configures a new source (ID and Type) and clicks "Add Source"
- **THEN** the `onStyleChanged` callback is triggered with the new source added to the style's `sources` object.

#### Scenario: Remove Active Source
- **WHEN** the user clicks the delete icon on an active source
- **THEN** the `onStyleChanged` callback is triggered with that source removed from the style's `sources` object.

#### Scenario: Select Public Source
- **WHEN** the user clicks the add icon on a public source
- **THEN** the `onStyleChanged` callback is triggered with the public source added to the active style.
