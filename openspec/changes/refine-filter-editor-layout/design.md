# Design: Refine Filter Editor Layout

## User Interface Design

### Filter Row Layout

The `SingleFilterEditor` component will be updated to use a Flexbox layout.

- **Container**: `display: flex`, `align-items: center`, `gap: 8px` (0.5rem).
- **Field (Property)**: `flex: 2`, `min-width: 0`.
- **Condition (Operator)**: `flex: 1`, `min-width: 0`.
- **Value (Args)**: `flex: 2`, `min-width: 0`.

This ensures that the inputs stretch to fill the available width and align horizontally.

## Technical Implementation

### CSS / Tailwind Classes

Modify `src/components/SingleFilterEditor.tsx`:

```tsx
<div className="maputnik-filter-editor-single flex items-center gap-2 w-full">
  <div className="maputnik-filter-editor-property flex-[2] min-w-0">
    {/* InputAutocomplete */}
  </div>
  <div className="maputnik-filter-editor-operator flex-1 min-w-[80px]">
    {/* InputSelect */}
  </div>
  {filterArgs.length > 0 && (
    <div className="maputnik-filter-editor-args flex-[2] min-w-0">
      {/* InputString */}
    </div>
  )}
</div>
```

We will keep the `maputnik-*` classes for backward compatibility (if any external css references them, though unlikely in this project structure) or for reference, but apply utility classes for layout.
