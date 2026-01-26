## MODIFIED Requirements
### Requirement: Preserve existing SASS-rendered UI
**REPLACED BY**: `### Requirement: Exclusively use Tailwind CSS for styling`
The system MUST NOT use SASS/SCSS and MUST rely entirely on Tailwind CSS utility classes and Shadcn/UI for all visual styling.

#### Scenario: App without SASS
- **GIVEN** SASS files and loaders are removed
- **WHEN** the application is built and rendered
- **THEN** all components render with Tailwind CSS styling
- **AND** the visual appearance remains consistent with the previous SASS implementation

### Requirement: Phase-1 shadcn primitives are available
The system MUST include all necessary shadcn primitives required for component migration in `src/components/ui`.

#### Scenario: Complete Shadcn primitive set
- **WHEN** any component is migrated from SASS to Tailwind
- **THEN** required shadcn primitives (button, checkbox, input, select, etc.) are available in `src/components/ui`
