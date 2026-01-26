# Adopt Standard Shadcn Combobox for InputAutocomplete

## Goal
Refactor `InputAutocomplete` to use standard Shadcn/Radix components (`Popover`, `Command`, `Input`), avoiding external dependencies like `downshift` or `@base-ui/react`.

## Feasibility Analysis
The user verified that the standard Radix/Shadcn ecosystem capabilities are sufficient ("Radix UI has this component... same"). We will leverage the existing `popover` and `command` components.

## Design: Input-Driven Combobox
To match the "Input Autocomplete" requirement (Input field that persists free text + Suggestions list):

### Composition
- **Root**: `div.relative`
- **Input**: Shadcn `Input` component.
  - Acts as the source of truth for text.
  - Handles `onChange` directly for free text.
  - Focus opens the Popover.
- **Dropdown**: `Popover` (headless/manual anchor) or just a `div` styled as Popover?
  - **Better**: Use `Command` primitive *just for the list*.
  - Render a `div` (absolute positioned) mimicking `PopoverContent` styles.
  - Inside: `Command` -> `CommandList` -> `CommandGroup` -> `CommandItem`.
  - **Why?**: `Popover` requires a Trigger. Anchoring a Popover to an Input while also using `Command` for navigation can be tricky if `Command` is split.
  - **Alternative**: Use `Command` as the root wrapper?
    - `Command`
      - `CommandInput` (Styled to look like standard Input)
      - `CommandList` (Absolute positioned / floating)
  - **Decision**: Use **Hybrid Approach**: 
    - `Command` as root (provides context).
    - `CommandInput` as the text field.
    - `CommandList` wrapped in a `div` (absolute) that appears when focused/typing.
    - Use `shouldFilter={false}` on `Command` to allow us to control the list items manually (based on fuzzy matching or API) and allow the input to contain values not in the list.

### Free Text Handling
- `CommandInput` updates internal state.
- We bind `value` to our component state.
- On `blur`, we commit the value.
- On `CommandItem` select, we commit the item value.

## Tasks
1. Remove `downshift`.
2. Refactor `InputAutocomplete.tsx` using `Command`, `CommandInput`, `CommandList`, `CommandItem`.
3. Style `CommandInput` to match standard `Input` (border, ring, etc.).
4. Implement "Free Text" logic (controlled value).

## Risks
- `cmdk` handling of "value not in list" (it generally allows it in the input, but selection state might be weird).
- Styling `CommandInput` to look exactly like `Input`.
