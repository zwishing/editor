# Refine Layer List UI v2

## Goal Description

Address further UI refinements requested by the user for the Layer List and Layer Editor components.
Key improvements:

- Remove residual black border on expanded layer groups.
- Widen the Layer List panel.
- Ensure visibility (eye) icon persists when a layer is hidden.
- Adjust Layer List Header height, alignment, and add a divider line.
- Match Single Layer Settings header height/style to Layer List.

## User Review Required

None.

## Proposed Changes

### Visual Style

#### [MODIFY] [AppLayout.tsx](file:///Users/zhang/code/editor/src/components/AppLayout.tsx)

- Increase `w-layout-list` default width or allow configuration.

#### [MODIFY] [LayerList.tsx](file:///Users/zhang/code/editor/src/components/LayerList.tsx)

- Update header styling: `p-3`, `h-12` (or similar fixed height), vertical alignment.
- Add divider line between header and content.

#### [MODIFY] [LayerListItem.tsx](file:///Users/zhang/code/editor/src/components/LayerListItem.tsx)

- Update `IconAction` logic to always render "show/hide" icon if visibility is hidden.

#### [MODIFY] [LayerEditor.tsx](file:///Users/zhang/code/editor/src/components/LayerEditor.tsx)

- Update header styling to match `LayerList` header (height, font size, padding).

#### [MODIFY] [LayerListGroup.tsx](file:///Users/zhang/code/editor/src/components/LayerListGroup.tsx)

- Check for and remove any bottom border on expanded/collapsed states.

## Verification Plan

### Manual Verification

- Verify Layer List is wider.
- Check "eye-off" icon is visible when layer is hidden (mouse out).
- Verify header heights match between Layer List and Layer Editor.
- Check for removal of black line in groups.
