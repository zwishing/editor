# Design: Standardize Theme Tokens

## Architecture

The styling system will rely on **CSS Variables** defined in `src/globals.css` and exposed via **Tailwind CSS** configuration.

### Token Layering

1.  **Primitive Layer**: Raw HSL values.
    - `--brand-base`: The core brand color (Green).
    - `--slate-50` ... `--slate-900`: Neutral scale.
2.  **Semantic Layer**: Intent-based names.
    - `--primary`: Main action color.
    - `--destructive`: Error/Delete color.
    - `--muted`: De-emphasized content.
3.  **Component Layer**: Specific component contexts (optional, avoid if possible).
    - `--panel-bg`: Background for the editor panels.
    - `--panel-surface`: Card/Container background.
    - `--panel-border`: Border color for panels.

### Implementation Strategy

- **Colors**: Use `hsl(var(--...))` format to allow opacity modifiers in Tailwind.
- **Typography**: Use Tailwind's `font-*` and `text-*` classes. Map `font-family` to the variables.
- **Spacing**: Adhere to Tailwind's default spacing scale (4px grid), aliasing Maputnik specifics if needed.

### Migration Path

1.  Define the full set of tokens in `globals.css`.
2.  Update `tailwind.config.js` to ensure all tokens are available as utilities.
3.  Audit `src/components` for `.maputnik-*` classes and replace them with Tailwind utilities using the new tokens.
4.  Remove legacy CSS rules from `globals.css` once unused.
