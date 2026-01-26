# Design

## Layout Structure

```
+---------------------------+
| Header (Match LayerList)  |
| border-b (Light Gray)     |
+---------------------------+
| Content Area (Scrollable) |
|                           |
| [Style Tab Content]       |
|  - Accordion Groups       |
|                           |
| OR                        |
|                           |
| [Data Tab Content]        |
|  - Filter Editor          |
|                           |
+---------------------------+
| Tabs List (Fixed Bottom)  |
| [Style] [Data] [JSON]     |
+---------------------------+
```

## Styling

- **Menu**: `bg-popover` + `text-popover-foreground` + `border` + `shadow-md`.
- **Divider**: `border-border` (light gray).
- **Margins**:
  - Panel padding: `0` (internal scroll).
  - Item padding: Match `LayerListItem` visual density (`px-2`/`px-3`).
- **Typography**: `text-sm` base. Groups `font-semibold`.

## Tabs Logic

- **Style**: Includes `layer` (ID), `properties` (Layout/Paint groups).
- **Data**: Includes `filter` group.
- **JSON**: Includes `jsoneditor` group.
- **Source**: Note `LayerEditor` hides source group for background layers in some cases. Ensure logic is preserved in Tabs.
