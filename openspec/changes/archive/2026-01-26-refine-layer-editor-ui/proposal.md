# Refine Layer Editor UI

## Why

The Layer Editor UI currently suffers from several visual and usability issues:

- **Inconsistent Styling**: Margins, padding, and font sizes do not match the Layer List panel, creating a disjointed experience.
- **Visual Clutter**: Double borders and "black lines" degrade the aesthetic quality.
- **Transparency Issues**: The settings menu appears transparent, making it hard to read.
- **Navigation**: Scrolling through a long list of properties is inefficient. Grouping properties into Tabs (Style, Data, JSON) will improve usability.

## What Changes

### 1. Visual Polish

- **Headers & Dividers**: Remove extra borders (specifically the "black line"). Ensure all headers and dividers use a consistent light gray color (`border-panel-border`).
- **Margins & Padding**: Align `LayerEditor` margins and padding with `LayerList` (e.g., `px-3` or `px-4`, `text-sm`).
- **Font Sizes**: Standardize all text to match Layer List.

### 2. Menu Fix

- Ensure the "More Options" menu in the header is opaque (fix likely transparency or invalid color variable).

### 3. Tabs Layout

- Refactor the `LayerEditor` main content to use a Tabbed interface (`shadcn/ui/tabs`).
- **Tabs**:
  - **Style**: Default tab. Contains all property groups (Layer, Layout, Paint, etc.) _excluding_ Filter and JSON.
  - **Data**: Contains only the "Filter" editor.
  - **JSON**: Contains only the "JSON Editor".
- **Position**: Tabs component fixed at the bottom (or top? User said "Bottom fixed"? "在底部固定一个Tab"). Wait, "在底部固定一个Tab" means fixed at the CHANGE.
  - Let's re-read: "在底部固定一个Tab... 分三个：样式、数据、json". "Fixed at the bottom".
  - So standard Tabs, but the _Tabs List_ is likely fixed at the bottom of the panel? Or the Tabs Content is above and the Switcher is at the bottom?
  - "Fixed at the bottom": implies the Tab triggers are at the bottom.
  - Implementation: Flex column, Content grows, TabsList at the bottom.

## User Review Required

- Confirm "Tabs at the bottom" layout preference.

## Verification Plan

### Manual Verification

- **Menu**: Open the "More Options" menu -> Must be opaque.
- **Borders**: Check header/content boundary -> Single light gray line.
- **Tabs**: Switch between Style, Data, JSON -> Correct content shown in each. Tab bar fixed at bottom.
- **Margins**: Visually compare Layer List and Layer Editor side-by-side.
