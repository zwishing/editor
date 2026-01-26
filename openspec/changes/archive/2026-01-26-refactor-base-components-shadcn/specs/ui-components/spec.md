## ADDED Requirements

### Requirement: Base Component Standardization
All base components MUST be implemented using the project's standard UI library (Shadcn/UI) and styled exclusively with Tailwind CSS.

#### Scenario: SASS Removal
- **Given** a base component file (e.g., `InputCheckbox.tsx`)
- **When** the component is refactored
- **Then** it MUST NOT import any `.scss` file
- **And** it MUST NOT use BEM-style global classes (e.g., `maputnik-checkbox`)

#### Scenario: API Compatibility
- **Given** an existing component $C$ with props $P$
- **When** $C$ is refactored to use Shadcn or Tailwind
- **Then** the new implementation MUST accept exactly the same props $P$
- **And** the behavior (callbacks, value handling) MUST remain identical to the previous implementation.

#### Scenario: Tailwind Usage
- **Given** a component needing custom styling not covered by a standard Shadcn primitive
- **When** styling the component
- **Then** it MUST use Tailwind CSS utility classes instead of inline styles or SASS.
