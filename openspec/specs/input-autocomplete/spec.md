# input-autocomplete Specification

## Purpose
TBD - created by archiving change refactor-components-shadcn. Update Purpose after archive.
## Requirements
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

### Requirement: Standard Shadcn Combobox Integration

The `InputAutocomplete` MUST use standard Shadcn/Radix components (`Command`), replacing `downshift`.

#### Scenario: Visual Consistency

- **Given** the component
- **Then** it MUST use `Command` and `CommandInput`.
- **And** the input MUST look like a standard Shadcn Input.

#### Scenario: Autocomplete Behavior

- **Given** user types
- **Then** the list MUST show filtered results (manual or automatic).
- **And** the input value MUST reflect exactly what is typed (free text support).

#### Scenario: Navigation and Selection

- **Given** the list is open
- **When** user navigates with arrows and presses Enter
- **Then** the selected item MUST populate the input.
- **And** `onChange` MUST be fired.

