# Design: Refactor Independent Panels

## Architecture
- **Component Pattern**: Use Functional Components (`React.FC`) for all refactored panels.
- **Internationalization**: Use the `useTranslation` hook from `react-i18next`.
- **State Management**: Use `useState` for local component state (e.g., in `AddSource`).
- **Logic Encapsulation**: Move helper methods (like property change handlers) into `useCallback` or `useMemo` where appropriate to avoid unnecessary re-renders.

## Component Breakdown

### SettingsPanel
- Convert `SettingsPanelInternal` to `SettingsPanel`.
- Map `changeTransitionProperty`, `changeLightProperty`, etc., to `useCallback` functions.
- Pass `mapStyle`, `onStyleChanged`, and `onChangeMetadataProperty` as props.

### SourcesPanel
- Refactor `PublicSource` to a functional component.
- Refactor `ActiveModalSourcesTypeEditor` to a functional component.
- Refactor `AddSource` to a functional component, using `useState` for `mode`, `sourceId`, and `source`.
- Refactor `SourcesPanelInternal` to `SourcesPanel`.

## Validation Strategy
- **Manual Mapping**: Verify that every input field and its `onChange` handler is correctly mapped to the new functional implementation.
- **Linting**: Run `npm run lint` to ensure no regression in code quality.
