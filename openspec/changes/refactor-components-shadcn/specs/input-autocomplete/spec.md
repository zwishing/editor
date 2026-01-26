## MODIFIED Requirements

### Requirement: Input Autocomplete UI Migration
The auto-complete input MUST be refactored to use Shadcn UI components (or compatible primitives) while preserving the current filtering and free-text behaviors.

#### Scenario: Autocomplete Rendering
- **Given** an `InputAutocomplete` component
- **When** rendered
- **Then** it MUST look like a Shadcn Input/Combobox
- **And** it MUST display a dropdown menu when focused or typing

#### Scenario: Filtering Options
- **Given** a list of options `['foo', 'bar']`
- **When** typing "f"
- **Then** the dropdown MUST show "foo"
- **When** typing "z"
- **Then** the dropdown MUST show no results (or empty state)

#### Scenario: Selection and Input
- **Given** the autocomplete input
- **When** a user selects an item from the dropdown
- **Then** `onChange` MUST be called with the item value
- **And** the input value MUST update
- **When** user types loose text (not in list)
- **Then** `onChange` MUST be called with the typed text
