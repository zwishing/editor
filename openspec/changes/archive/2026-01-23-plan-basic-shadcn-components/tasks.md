## 1. Discovery
- [x] 1.1 Inventory usages of `InputButton`, `InputCheckbox`, `InputSelect`, `InputString`, `InputUrl`, `Fieldset` across `src/`.
- [x] 1.2 Document current prop contracts and behavior (events, defaults, data attributes).

## 2. Add shadcn primitives
- [x] 2.1 Add shadcn `checkbox`, `native-select`, and `textarea` components to `src/components/ui/`.
- [x] 2.2 Verify required Radix dependencies are present and aligned.

## 3. Base component replacements (phase 1)
- [x] 3.1 Update `InputButton` to wrap `ui/button` while preserving props/attributes.
- [x] 3.2 Update `InputCheckbox` to wrap `ui/checkbox` and preserve boolean toggle semantics.
- [x] 3.3 Update `InputSelect` to wrap `ui/native-select` and preserve deduped change behavior.
- [x] 3.4 Update `InputString` to wrap `ui/input` and `ui/textarea` while keeping onInput/onChange timing.
- [x] 3.5 Ensure `InputUrl` behavior remains unchanged (validation and error rendering).

## 4. Validation
- [x] 4.1 Run `npm run lint`.
- [x] 4.2 Run `npm run build`.
- [x] 4.3 Update `CHANGELOG.md` with a short note under "main".

## Discovery Notes
- Usage samples:
  - `InputButton`: `src/components/GlobalStatePanel.tsx`, `src/components/SourcesPanel.tsx`, `src/components/_ZoomProperty.tsx`
  - `InputCheckbox`: wrapped by `src/components/FieldCheckbox.tsx`
  - `InputSelect`: wrapped by `src/components/FieldSelect.tsx` and used in `src/components/_ZoomProperty.tsx`
  - `InputString`: wrapped by `src/components/FieldString.tsx`, used by `src/components/InputUrl.tsx`
  - `InputUrl`: used in `src/components/FieldUrl.tsx`
- Prop/behavior expectations:
  - `InputButton`: forwards `data-wd-key`, `aria-label`, `className`, `disabled`, `type`, `id`, `title`, `style`, and `onClick`.
  - `InputCheckbox`: default `value=false`, toggles boolean on click/change via `onChange`.
  - `InputSelect`: dedupes emitted values with `lastEmittedValue`, supports `options` as `[value,label][]` or `string[]`, fires on `change` and `input`.
  - `InputString`: supports `multi` (textarea), `onInput` on each keystroke, `onChange` on blur or Enter, preserves `spellCheck` default logic.
