## ADDED Requirements
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
