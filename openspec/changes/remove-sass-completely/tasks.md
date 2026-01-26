## 1. Preparation
- [ ] 1.1 Map SASS variables from `_vars.scss` to `tailwind.config.js` or `globals.css`
- [ ] 1.2 Identify all components using global SASS classes

## 2. Global Styles Migration
- [ ] 2.1 Migrate `_reset.scss` and `_base.scss` to `globals.css`
- [ ] 2.2 Migrate utility classes and scrollbars to `globals.css` using `@theme` or `@layer`

## 3. Component Styling Migration
- [ ] 3.1 Migrate `SmallError.scss` to inline Tailwind or `globals.css`
- [ ] 3.2 Migrate Layout styles (`_layout.scss`, `_toolbar.scss`, `_modal.scss`) to Tailwind + Shadcn/UI
- [ ] 3.3 Migrate Editor styles (`_filtereditor.scss`, `_layer.scss`, `_input.scss`) to Tailwind
- [ ] 3.4 Migrate Map and Popup styles (`_map.scss`, `_popup.scss`, `_zoomproperty.scss`)

## 4. Cleanup and Verification
- [ ] 4.1 Remove all `.scss` file imports from `src/index.jsx` and components
- [ ] 4.2 Delete all `.scss` files
- [ ] 4.3 Uninstall `sass`, `stylelint-config-recommended-scss`, and `stylelint-scss`
- [ ] 4.4 Run `npm run lint` and verify build success
- [ ] 4.5 Manually verify UI remains visually consistent
