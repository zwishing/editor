# Proposal: Refactor Modals to Shadcn/UI Dialog

## Why
The current modal system uses `react-aria-modal`, which is a legacy dependency and difficult to customize with Tailwind CSS. By migrating to Shadcn/UI `Dialog` (Radix UI), we gain:
1.  **Tailwind Compatibility**: Easier styling and consistent appearance with other modernized components.
2.  **Modern React Patterns**: Converting class components to functional components using Hooks (e.g., `useTranslation`).
3.  **Improved Accessibility**: Radix UI provides robust focus management and ARIA compliant behavior out of the box.

## Design
We will refactor the base `Modal.tsx` to wrap Shadcn/UI's `Dialog`. This allows us to keep the existing API (`isOpen`, `title`, `onOpenToggle`) while swapping the underlying implementation. Individual modals will then be converted to functional components.

## What Changes
1.  **Infrastructure**: Refactor `src/components/modals/Modal.tsx` to use Shadcn/UI `Dialog`.
2.  **Conversion**: Convert all 10 specialized modals from class components to functional components.
3.  **HOC Removal**: Replace `withTranslation` HOC with `useTranslation` hook in all modal components.
4.  **Styling**: Migrate legacy SCSS classes to Tailwind CSS utility classes.

## Impact
- **Accessibility**: Improved focus trapping and screen reader support.
- **Bundle Size**: Removal of `react-aria-modal` and potentially `classnames`.
- **Maintenance**: Unified styling via Tailwind CSS.

## Scenarios
- User opens the style settings modal via the toolbar.
- User closes a modal using the keyboard (Escape).
- User scrolls through a long modal (e.g., Sources) on a small screen.
