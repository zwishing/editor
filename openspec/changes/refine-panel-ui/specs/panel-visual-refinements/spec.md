# Spec: Panel Visual Refinements

## MODIFIED Requirements

### Requirement: Panel borders must not appear on user interaction
**Priority:** P1  
**Status:** Draft

Panels should have clean edges without black borders appearing when users click or focus on them.

#### Scenario: User clicks on any sidebar panel
**Given** the user is viewing the Maputnik editor  
**When** the user clicks on Layers, Sources, Code, Settings, or Global State panels  
**Then** no black border should appear around the panel  
**And** the panel should remain visually clean with only the standard subtle border

#### Scenario: User navigates panels with keyboard
**Given** the user is using keyboard navigation  
**When** the user tabs through different panels  
**Then** focus indicators should be visible but not create black borders  
**And** the visual feedback should be consistent with the design system

---

### Requirement: Selected items must be clearly distinguishable from background
**Priority:** P1  
**Status:** Draft

Selected items in lists and controls must have sufficient visual contrast to be easily identified.

#### Scenario: User selects a layer in the layer list
**Given** the user is viewing the layer list  
**When** the user clicks on a layer to select it  
**Then** the selected layer background should be visibly different from unselected layers  
**And** the background color should not blend with the white panel surface  
**And** the contrast ratio should meet WCAG AA standards (4.5:1 minimum)

#### Scenario: User selects a button in a multi-button group
**Given** the user is viewing a multi-button control  
**When** the user clicks on one of the buttons  
**Then** the selected button should have a distinct background color  
**And** the selection should be immediately obvious

---

### Requirement: Zoom property controls must display in compact single-line format
**Priority:** P2  
**Status:** Draft

Min and max zoom controls should be laid out horizontally for better space efficiency and aesthetics.

#### Scenario: User views zoom property in layer editor
**Given** the user has selected a layer with zoom properties  
**When** the user views the min zoom control  
**Then** the label, slider, and value should be on a single horizontal line  
**And** the same layout should apply to max zoom  
**And** the controls should be visually aligned and balanced

#### Scenario: User adjusts zoom values
**Given** the user is viewing zoom controls in single-line format  
**When** the user drags the slider or enters a value  
**Then** the layout should remain stable  
**And** all elements should stay properly aligned  
**And** the value should update in real-time
