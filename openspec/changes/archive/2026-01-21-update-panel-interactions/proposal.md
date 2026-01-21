# Change: Improve panel interactions and layer group affordance

## Why
The code editor panel currently does not scroll within its editor surface, select inputs feel laggy when applying changes, and layer group headers lack a clear group affordance.

## What Changes
- Enable vertical scrolling within the code editor panel surface.
- Reduce perceived delay when applying select input changes so UI updates are immediate.
- Add a folder icon before layer group titles in the layer list.

## Impact
- Affected specs: panel-layout
- Affected code: src/components/CodeEditor.tsx, src/components/LayerListGroup.tsx, src/components/InputSelect.tsx, src/styles/_layout.scss, src/styles/_layer.scss
