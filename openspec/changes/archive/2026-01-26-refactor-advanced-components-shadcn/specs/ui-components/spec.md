## MODIFIED Requirements

### Requirement: Base Component Standardization
All components in the editor (both base inputs and advanced property wrappers) MUST be implemented using the project's standard UI library (Shadcn/UI) and styled exclusively with Tailwind CSS.

#### Scenario: SASS Removal
- **Given** a component file
- **When** the component is refactored
- **Then** it MUST NOT import any `.scss` file
- **And** it MUST NOT use BEM-style global classes (e.g., `maputnik-checkbox`)

#### Scenario: API Compatibility
- **Given** an existing component C with props P
- **When** C is refactored to use Shadcn or Tailwind
- **Then** the new implementation MUST accept exactly the same props P
- **And** the behavior (callbacks, value handling) MUST remain identical to the previous implementation.

#### Scenario: Tailwind Usage
- **Given** a component needing custom styling not covered by a standard Shadcn primitive
- **When** styling the component
- **Then** it MUST use Tailwind CSS utility classes instead of inline styles or SASS.

#### Scenario: Refactor PropertyGroup
- **WHEN** a PropertyGroup component is refactored
- **THEN** it must be a functional component
- **AND** it must use Tailwind classes for layout

#### Scenario: Refactor _FunctionButtons
- **WHEN** specialized function buttons for properties are refactored
- **THEN** they must use Shadcn/UI Button components
- **AND** they must use Tailwind for positioning and spacing

#### Scenario: Refactor InputAutocomplete
- **WHEN** InputAutocomplete is refactored
- **THEN** it should leverage the new Shadcn-based Combobox internal component where appropriate

#### Scenario: Refactor Multi-value Inputs
- **WHEN** InputArray and InputDynamicArray are refactored
- **THEN** they must use Tailwind for flex/grid layouts
- **AND** they must use functional component patterns for managing array state
