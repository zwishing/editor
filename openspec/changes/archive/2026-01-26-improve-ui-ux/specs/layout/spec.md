# Layout Specs

## ADDED Requirements
### Requirement: Panel and Container Layout rules
The system SHALL use a consistent sidebar and panel layout with responsive behavior.
#### Scenario: Panel Layout
- The application layout MUST consist of a sidebar, a main map view, and floating or docked panels.
- **Components:** `Layout`, `Panel`, `Sidebar`.

#### Scenario: Spacing Consistency
- All containers MUST use padding and margins defined in the design system (multiples of 4px).
- **Global:** No arbitrary pixel values for spacing.

#### Scenario: Responsive Containers
- Panels MUST be responsive and collapse or adjust on smaller screens (mobile/tablet).
