# Typography Specs

## ADDED Requirements
### Requirement: Modern Typography System
The system SHALL use modern, accessible font families and a clear hierarchy.
#### Scenario: Font Families
- The application MUST use `Space Grotesk` for headings and `DM Sans` (or `Inter`) for UI text.
- **Global:** Update `index.css` / `globals.css`.

#### Scenario: Code Readability
- Code editors and JSON views MUST use `JetBrains Mono` or equivalent monospace font.
- **Components:** `JSONEditor`, `ExpressionInput`.

#### Scenario: Text Hierarchy
- Headings MUST use distinct weights (700/500) and sizes to establish hierarchy.
- Helper text MUST be legible and have sufficient contrast (`text-slate-500` minimum).
