# Refactor LayerListItem and InputAutocomplete to Shadcn UI

## Goal
Refactor `LayerListItem` and `InputAutocomplete` components to use shadcn/ui components and Tailwind CSS.
Additionally, refactor internal or helper components used by these (specifically `IconAction` in `LayerListItem`) to also use Shadcn/Tailwind.

## Context
Use modern stack (shadcn/ui + Tailwind) while strictly maintaining existing API and behavior.

## Design

### LayerListItem
- **Components to Refactor**:
  - `LayerListItem` (Main container)
  - `IconAction` (Internal helper for action buttons)
  - `DraggableLabel` (Label and handle)
- **Changes**:
  - **Wrapper**: Replace `li.maputnik-layer-list-item` usage with Tailwind classes on `li`.
  - **Drag Handle**: Ensure `DraggableLabel` uses Tailwind.
  - **IconAction**: 
    - Convert from Class Component to Functional Component.
    - Render `Button` from shadcn/ui.
    - Map `props.action` to specific icons (Action -> Icon map matches existing).
    - Props: `variant="ghost"`, `size="icon"`.
    - Tooltip: Retain `title` prop on the Button.
    - classes: Replace BEM `maputnik-layer-list-icon-action*` with Tailwind.

### InputAutocomplete
- **Components to Refactor**:
  - `InputAutocomplete`
- **Changes**:
  - Use `Popover` (trigger + content) and `Command` (input + list).
  - **Combobox Pattern**: 
    - `PopoverTrigger` contains the `Input` (or a button looking like input, but we need text editing).
    - Actually for Autocomplete (free text allowed), standard Shadcn pattern is `Command` inside `Popover`, with a `CommandInput`.
    - **Crucial**: The `CommandInput` in shadcn usually filters the list. We need to capture the *value* of the input even if it doesn't match the list.
    - If `CommandInput` is restrictive, use a standard `Input` as the trigger anchor, and manually control the `Popover` open state, putting `CommandList` inside the popover.

## Risks
- `dnd-kit` styling interference.
- `IconAction` is used for "visual duplication" - ensure the copy icon still means "Duplicate".
- `InputAutocomplete` free text vs selection state synchronization.
