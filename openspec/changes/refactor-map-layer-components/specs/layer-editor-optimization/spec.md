# Layer Editor Optimization Spec

## ADDED Requirements

### Requirement: Rendering Performance
The editor MUST handle large style files efficiently.

#### Scenario: Opening Layer Editor
Given a complex style with hundreds of layers
When the user opens the Layer Editor for a layer
Then it should render efficiently without blocking the UI
And expensive calculations like `layoutGroups` should be memoized

#### Scenario: Editing properties
Given an open Layer Editor
When the user changes a property
Then only the relevant fields should re-render
And the whole editor or unrelated siblings should not re-render due to unstable object references

### Requirement: Component Structure
The component MUST be modular and maintainable.

#### Scenario: Code Splitting
Given the `LayerEditor` component
When reviewing the code
Then the render logic for different group types (Paint, Layout, Filter) should be in separate components for better maintainability (and potential code splitting)
