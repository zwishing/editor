# Refine Panel UI Details

## Overview
This change addresses three visual refinements to improve the user experience when interacting with sidebar panels and layer settings:

1. **Remove black border effect** when clicking on panels (Layers, Sources, Code, Settings, Global State)
2. **Fix selected item visibility** by changing the background color from white to a more visible shade
3. **Improve zoom slider layout** to display min/max zoom controls in a single-line format for better aesthetics

## Motivation
The current UI has several usability issues:
- Black borders appear around panels when clicked, creating visual noise
- Selected items use white backgrounds that blend with the panel surface, making it hard to identify the current selection
- The zoom property controls (min/max zoom) are vertically stacked, consuming unnecessary vertical space and looking less polished

## User Impact
- **Cleaner visual experience** without distracting border effects
- **Better visibility** of selected items in layer lists and other components
- **More compact and professional** zoom control layout

## Scope
This change affects:
- Panel border styling in `_layout.scss`
- Selected item styling in `_layer.scss` and `_input.scss`
- Zoom property component layout in `_ZoomProperty.tsx` and `_zoomproperty.scss`

## Dependencies
None - this is a purely visual refinement that doesn't affect functionality.

## Risks
- Low risk: Changes are cosmetic and don't affect core functionality
- Potential for slight visual regression if color contrast isn't sufficient
- May need to verify accessibility (WCAG contrast ratios)
