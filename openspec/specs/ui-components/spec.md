# ui-components Specification

## Purpose
TBD - created by archiving change add-tailwind-shadcn. Update Purpose after archive.
## Requirements
### Requirement: Tailwind CSS Integration
The system MUST support Tailwind CSS utility classes in React components.

#### Scenario: Using Tailwind classes
Given the developer adds `className="bg-red-500"` to a component
When the application renders
Then the component background should be red

### Requirement: Preserve existing SASS-rendered UI
The system MUST keep existing pages visually unchanged when Tailwind CSS is introduced.

#### Scenario: Loading the app after Tailwind integration
Given the app loads with existing SASS styles
When Tailwind CSS is enabled
Then existing screens render without visual regressions

### Requirement: Shadcn Button Component
The system MUST provide a Button component styled with Tailwind CSS that supports variants.

#### Scenario: Rendering a Default Button
Given the developer imports `Button` from `src/components/ui/button`
When they render `<Button>Click me</Button>`
Then a button with default shadcn styling appears

#### Scenario: Rendering a Destructive Button
Given the developer uses `<Button variant="destructive">Delete</Button>`
When the button renders
Then it should have the destructive (red) styling

### Requirement: Shadcn InputNumber compatibility
The system MUST provide an InputNumber component implemented with shadcn/ui inputs while preserving the existing public API and behavior.

#### Scenario: Existing usage remains valid
Given a component renders `<InputNumber value={10} min={0} max={20} onChange={onChange} />`
When the application renders
Then the input renders correctly and `onChange` receives numeric values or `undefined` as before

#### Scenario: Range mode behavior
Given a component renders `<InputNumber value={5} min={0} max={10} allowRange rangeStep={1} onChange={onChange} />`
When the shadcn Slider is adjusted and the text input is edited
Then the component preserves the same range behavior and emits the same values as the previous implementation

### Requirement: Base input wrappers preserve legacy APIs
The system MUST provide shadcn-based implementations for base input components while preserving existing public props and behavior for `InputButton`, `InputCheckbox`, `InputSelect`, and `InputString`.

#### Scenario: InputButton attributes remain intact
- **WHEN** a consumer renders `InputButton` with `data-wd-key`, `aria-label`, `className`, `disabled`, `type`, and `title`
- **THEN** the underlying button receives the same attributes and the click handler fires as before

#### Scenario: InputString multi mode behavior
- **WHEN** a consumer renders `InputString` with `multi={true}` and uses `onInput` and `onChange`
- **THEN** the component renders a textarea and preserves the same input/change timing and values

#### Scenario: InputSelect change semantics
- **WHEN** a consumer renders `InputSelect` with `options` and changes the value
- **THEN** the component emits changes using the same deduped onChange behavior as before

#### Scenario: InputCheckbox toggle semantics
- **WHEN** a consumer clicks `InputCheckbox`
- **THEN** `onChange` is invoked with the inverted boolean value and default value remains `false`

### Requirement: Phase-1 shadcn primitives are available
The system MUST include shadcn primitives required for base input migration in `src/components/ui`.

#### Scenario: Importing shadcn primitives
- **WHEN** a developer imports `checkbox`, `native-select`, or `textarea` from `src/components/ui`
- **THEN** the components are available without additional setup


