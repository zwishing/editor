## MODIFIED Requirements

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
