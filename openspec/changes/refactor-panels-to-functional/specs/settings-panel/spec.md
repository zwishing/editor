# Spec Delta: Settings Panel Refactor

## MODIFIED Requirements

### Requirement: Modernized Settings Panel
Functional component implementation of the Style Settings panel. The system SHALL maintain existing style editing capabilities while using a hooks-based architecture.

#### Scenario: Update Style Name
- **WHEN** the user changes the style name in the Name field
- **THEN** the `onStyleChanged` callback is triggered with the updated name in the style JSON.

#### Scenario: Update MapTiler Access Token
- **WHEN** the user enters a MapTiler access token in the MapTiler field
- **THEN** the `onChangeMetadataProperty` callback is triggered with the new token for "maputnik:openmaptiles_access_token".

#### Scenario: Change Projection
- **WHEN** the user selects a different projection from the dropdown
- **THEN** the `onStyleChanged` callback is triggered with the updated projection type.
