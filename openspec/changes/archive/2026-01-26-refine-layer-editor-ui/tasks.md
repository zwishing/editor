# Tasks

- [x] refactor(ui): update LayerEditor header
  - Remove double border
  - Ensure menu background is opaque (use `bg-popover` or `bg-white`)
  - Match padding/margins with LayerList
- [x] refactor(ui): update LayerEditorGroup styles
  - Remove top border from groups (to avoid double lines)
  - Match margins/padding with LayerList
  - Update font size to `text-sm`
- [x] feat(ui): add Tabs component
  - Add `src/components/ui/tabs.tsx` (using shadcn primitive)
- [x] refactor(layout): implement Tabs in LayerEditor
  - Layout: Content top, TabsList fixed bottom
  - Tab: **Style** (General, Layout, Paint groups)
  - Tab: **Data** (Filter group)
  - Tab: **JSON** (JSON Editor)
  - Default to **Style** tab
