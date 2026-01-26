## MODIFIED Requirements

### Requirement: Shadcn InputNumber compatibility

Block components MUST properly wrap shadcn compatible InputNumber components without layout shifts or style conflicts.

#### Scenario: Block wrapping InputNumber

- **Given** an `InputNumber` wrapped in `Block`
- **When** rendered
- **Then** the Block styling matches shadcn conventions
