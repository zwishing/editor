# Change: Remove SASS and Migrate to Tailwind CSS

## Why
The project is currently using mixed styling approaches: SASS/SCSS and Tailwind CSS. Removing SASS entirely will simplify the build process, reduce the bundle size, and provide a single, consistent way to handle styles using Tailwind CSS utility classes and Shadcn/UI components.

## What Changes
- Convert all `.scss` files to Tailwind CSS configurations and utility classes.
- Remove `sass` and related loaders from `package.json`.
- Update `index.jsx` to remove imports of `.scss` files.
- Refactor components that use CSS modules or global SCSS classes to use Tailwind utility classes.
- Standardize the design tokens from `_vars.scss` into the Tailwind configuration (e.g., custom colors, spacing, and fonts).

## Impact
- Affected specs: `ui-components`, `panel-layout`
- Affected code: Most UI components in `src/components/`, `src/styles/`, `package.json`, `index.jsx`
- Build Process: Removal of SASS compilation step in Vite.
