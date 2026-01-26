# Design System: Maputnik Pro

## Overview
A professional, modern design system tailored for a complex developer tool. It prioritizes readability, information density, and aesthetic polish using Tailwind CSS.

## Typography
### Headings
**Font:** Space Grotesk
**Characteristics:** Modern, technical feel, high legibility.
**Usage:** Section headers, modal titles.

### Body / UI
**Font:** DM Sans (or Inter as fallback)
**Characteristics:** Clean, neutral, excellent for small sizes.
**Usage:** Labels, inputs, buttons, tooltips.

### Monospace (Code/Data)
**Font:** JetBrains Mono
**Characteristics:** Ligatures, clear distinction of characters.
**Usage:** JSON editor, value inputs, layer IDs.

## Color Palette
### Neutral (Slate)
- Background: `bg-slate-50` (Light) / `bg-slate-950` (Dark)
- Surface: `bg-white` / `bg-slate-900`
- Border: `border-slate-200` / `border-slate-800`
- Text (Primary): `text-slate-900` / `text-slate-50`
- Text (Secondary): `text-slate-500` / `text-slate-400`

### Primary (Indigo/Blue)
- Action: `bg-indigo-600`
- Hover: `bg-indigo-700`
- Ring/Focus: `ring-indigo-500`

### Status
- Success: Emerald
- Warning: Amber
- Error: Rose

## Layout & Components
### Global
- **Spacing:** Use 4px grid (`p-4`, `m-2`).
- **Radius:** `rounded-lg` for large containers, `rounded-md` for inputs/buttons.
- **Shadows:** Soft, diffused shadows (`shadow-sm`, `shadow-lg` for modals).

### Interaction
- **Cursor:** `cursor-pointer` on all interactive elements.
- **Transitions:** `transition-all duration-200 ease-in-out` for hover states.
- **Feedback:** Clear focus rings (`ring-2 ring-offset-2`).

## Requirements Checklist
- [ ] No emojis as icons (Use Lucide/Heroicons)
- [ ] Consistent icon sizing (w-5 h-5)
- [ ] Dark mode support first-class
- [ ] Accessible contrast ratios (4.5:1 min)
- [ ] Responsive container queries for panels
