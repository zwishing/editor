# Refactor Map Components & Optimize Layer Editor

## Why
`MapMaplibreGl.tsx` is currently implemented as a class component with complex manual lifecycle management (`shouldComponentUpdate`, `componentDidUpdate`), making it fragile and hard to maintain. `LayerEditor.tsx` suffers from performance issues due to expensive render cycles and unstable object references causing unnecessary re-renders of children.

## What Changes

### MapMaplibreGl Refactoring
- **Convert to Functional Component**: Rewrite `MapMaplibreGl` using React Hooks (`useEffect`, `useRef`, `useCallback`).
- **Custom Hooks Extraction**:
    - `useMapInstance`: Manage MapLibre GL map instance creation and cleanup.
    - `useMapControl`: Manage controls like Geocoder, ZoomControl, NavigationControl.
    - `useMapInspect`: Manage MaplibreInspect logic.
- **Maintain Feature Parity**: Ensure all existing functionality (map rendering, inspecting, geocoding, zooming) works exactly as before.

### LayerEditor Optimization
- **Performance Optimization**:
    - Memoize `items` object and context values to prevent child re-renders.
    - Memoize expensive calculations like `layoutGroups` and `getLayoutForType`.
- **Component Splitting**:
    - Split `renderGroupType` into smaller sub-components (`LayerEditorPaint`, `LayerEditorLayout`, `LayerEditorFilter`, `LayerEditorProperty`).

## Design Decisions
- **Map Hooks**: Use a context or just custom hooks? Given the complexity, custom hooks used within the main component seems sufficient for now without over-engineering a Context if state doesn't need to be shared widely outside the map component itself (though passing map instance might be useful, we'll keep it scoped for now).
- **LayerEditor**: Use `React.memo` for the sub-components to enforce re-rendering only when props change.

## Verification Plan
### Automated Tests
- Run existing Cypress tests to ensure no regressions in map interaction or layer editing:
  `npm run test`
- Run unit tests:
  `npm run test-unit`

### Manual Verification
- **Map Interaction**: Verify panning, zooming, and inspect mode (hovering/clicking features) works.
- **Layer Editing**: Verify changing layer properties updates the map style and doesn't cause UI lag.
