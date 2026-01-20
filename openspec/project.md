# Project Context

## Purpose
Maputnik is a free, open visual editor for MapLibre GL styles, aimed at developers and map designers to build and refine style JSON in a browser-focused UI.

## Tech Stack
- TypeScript, React, Vite (ESM)
- MapLibre GL JS and MapLibre style spec
- Sass/SCSS styling, i18next for localization
- Cypress for E2E tests, Vitest for unit tests

## Project Conventions

### Code Style
- TypeScript + React (TSX) with ESLint and Stylelint
- Follow existing patterns in `src/` and keep UI text i18n-ready per `src/locales/README.md`

### Architecture Patterns
- Single-page React app built with Vite
- Map rendering and style editing via MapLibre GL JS and style-spec utilities

### Testing Strategy
- E2E tests with Cypress (requires a running dev server; xvfb for headless CI)
- Unit tests with Vitest as needed
- Linting via `npm run lint` and `npm run lint-css`

### Git Workflow
- Update `CHANGELOG.md` for any PRs (keep unreleased notes under the "main" header)
- Release flow uses a version bump PR and automated GitHub release

## Domain Context
- The editor targets MapLibre GL style JSON (sources, layers, paint/layout properties)
- Map previews are rendered with MapLibre GL JS; styles can be edited live

## Important Constraints
- Avoid Mapbox trademarks in UI or documentation
- Support current active Node.js LTS and newer

## External Dependencies
- MapLibre GL JS and MapLibre style-spec libraries
- OpenLayers (`ol`, `ol-mapbox-style`), PMTiles, and `maputnik-design` assets
