## ADDED Requirements

### Requirement: Layer List Item UI Migration

The layer list item and its internal components MUST be refactored to use Shadcn UI components.

#### Scenario: IconAction Refactor

- **Given** the `IconAction` component used within Layer List Item
- **When** rendered
- **Then** it MUST be a Shadcn `Button` component with `variant="ghost"` and `size="icon"`
- **And** it MUST display the correct icon for the action (duplicate, show, hide, delete)
- **And** it MUST retain the original `onClick` behavior and `title` tooltip

#### Scenario: Layer List Item Display

- **Given** a layer list item
- **When** rendered
- **Then** it MUST look consistent with the new Shadcn/Tailwind design system
- **And** it MUST preserve the drag handle, layer type icon, ID label, and action buttons

#### Scenario: Drag and Drop

- **Given** the layer list
- **When** dragging an item via the handle
- **Then** the `dnd-kit` listeners MUST function correctly
