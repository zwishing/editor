# Spec: UI Components

## MODIFIED Requirements

### Component: InputColor

#### Scenario: User picks a color
- **Given** the user clicks on the color preview swatch
- **Then** a popover containing the Kibo-UI color picker should appear
- **And** the picker should allow selecting Hue, Saturation, Lightness, and Alpha
- **And** changes should reflect immediately in the input field

#### Scenario: Legacy format support
- **Given** the input receives a HEX or RGBA string
- **Then** the color picker should initialize with the correct color values
