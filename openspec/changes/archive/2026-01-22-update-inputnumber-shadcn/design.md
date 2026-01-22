# Design: InputNumber using shadcn/ui

## Context
InputNumber is used across multiple editor forms and has established props and interaction behavior, including an optional range slider mode. We must keep API and behavior identical while adopting shadcn/ui components.

## Decisions
- Use the shadcn/ui `Input` component for the text input portion to align with the new UI component system.
- Use the shadcn/ui `Slider` component for range mode, while preserving the existing public API and emitted values.
- Keep existing class names and `data-wd-key` attributes to avoid breaking CSS selectors and tests.

## Risks / Trade-offs
- Using shadcn Slider means we must map its array-based value API to the existing `InputNumber` single-value API. This adds an adapter layer but keeps the external API stable.

## Open Questions
- None. The default choice prioritizes compatibility with current usage.
