# Design

## Visual Style

### General Typography

- **Requirement**: "All font sizes are a bit small, can be larger."
- **Base Size**: Increase global base font size for the panel components from ~11/12px to 14px (`text-sm`).
- **Scope**: Applies to layer items, group headers, panel headers, and action icons.

### Layer List Items

- **Typography**: Increase from 12px to 14px (text-sm) for better readability.
- **Spacing**: Increase padding from `p-0.5` to `py-1.5 px-2` or similar.
- **Hover**: Subtle lighter background `hover:bg-accent/40` or `hover:bg-slate-100`/`dark:hover:bg-slate-800`.
- **Dividers**: Remove. Spacing and hover states will provide separation.

### Layer Groups

- **Prominence**: Bold font weight or slightly darker text color.
- **Icon**: Ensure folder icon matches size.

### Header

- **Consistency**: Match `p-4` and `text-lg` or `text-xl` usage from `SourcesPanel`.

## Component Structure

No structural changes to logic, only CSS classes and layout adjustments.
