# Refine Layer List UI/UX

## Goal Description

The goal is to improve the visual presentation and usability of the Layer List component.
Specific improvements include:

- Enhanced hover effects for layer items.
- Increased margins, padding, and font sizes for better readability.
- Larger vertical spacing between list items.
- Removal of horizontal dividers between layers.
- Distinct visual treatment for layer groups.
- Consistent header heights across panels.

## User Review Required

None.

## Proposed Changes

### Components

#### [MODIFY] [LayerListItem.tsx](file:///Users/zhang/code/editor/src/components/LayerListItem.tsx)

- Increase padding and font size.
- Update hover styling.
- Remove border-b.

#### [MODIFY] [LayerListGroup.tsx](file:///Users/zhang/code/editor/src/components/LayerListGroup.tsx)

- Enhance visual distinction of groups (e.g., bold or background).
- Increase font size and padding.

#### [MODIFY] [LayerList.tsx](file:///Users/zhang/code/editor/src/components/LayerList.tsx)

- Update header styling to match other panels.
- Add gap between items via parent container or margin.

## Verification Plan

### Manual Verification

- Verify hover effect on layer items.
- Check font sizes and spacing against visual preference.
- Confirm groups are visually distinct.
- Compare header height with other panels.
