# Standardize Theme Tokens

| ID                           | Status    | Category     |
| :--------------------------- | :-------- | :----------- |
| **standardize-theme-tokens** | **Draft** | **Refactor** |

## Summary

Centralize and standardize all styling tokens (colors, fonts, sizes) into `globals.css` and expose them via Tailwind classes to ensure visual consistency and ease of theming.

## Problem Statement

Currently, styles are scattered across legacy CSS classes (`.maputnik-*`), Shadcn tokens, and hardcoded values. Changing a theme color (like the recent "purple to green" switch) is difficult because some components rely on ad-hoc colors or legacy variables.

## Goals

1.  **Centralize Tokens**: Define all colors, fonts, and spacing in `globals.css` using CSS variables.
2.  **Standardize Usage**: Establish clear semantic names for tokens (e.g., `--color-panel-active` vs `--accent`).
3.  **Migration**: Update legacy components to use these standard tokens via Tailwind utility classes.
4.  **Documentation**: Create a clear spec for available tokens.
