# Design: Tailwind & Shadcn Integration

## Architecture
- **Coexistence**: Tailwind CSS will be added as a separate styling layer. SASS files (`.scss`) will continue to work as is. Tailwind utilities will be available globally.
- **Safety First**: Tailwind preflight (global reset) will be disabled by default to avoid unintended changes to existing pages.
- **Configuration**:
    - `tailwind.config.js`: configured to scan `src/**/*.{js,jsx,ts,tsx}` and disable preflight via `corePlugins: { preflight: false }`.
    - `postcss.config.js`: handles tailwindcss and autoprefixer.
    - `src/styles/globals.css`: Entry point for Tailwind directives (`@tailwind base`, etc.) and CSS variables for shadcn theming.
- **Load Order**: Import Tailwind globals alongside the existing `index.scss` so utilities are available, but without reset-side effects.
- **Utils**: `src/lib/utils.ts` will house the `cn` helper (combining `clsx` and `tailwind-merge`), which is standard for shadcn.
- **Components**: New UI components will live in `src/components/ui/` (e.g., `src/components/ui/button.tsx`).

## Dependencies
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `tailwindcss-animate`
- `@radix-ui/react-slot` (for Button)

## Risks & Mitigations
- **Style Conflicts**: Tailwind's preflight (reset) can conflict with existing SASS styles.
    - *Mitigation*: Disable preflight by default to preserve existing UI, and rely on Tailwind utilities for new components only.
- **Build Setup**: Vite usually handles PostCSS automatically if the config file is present. No deep changes to `vite.config.ts` should be needed.
