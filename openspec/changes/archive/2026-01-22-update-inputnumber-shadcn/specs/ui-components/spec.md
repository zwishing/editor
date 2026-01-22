## ADDED Requirements
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
