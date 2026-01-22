# Add Tailwind CSS and Shadcn UI

## Summary
Integrate Tailwind CSS into the existing SASS-based project and add the shadcn/ui Button component. The primary goal is to keep current pages visually unchanged while enabling new components to use Tailwind utilities.

## Problem
The project currently relies solely on SASS for styling. The user wants to leverage modern UI components from shadcn/ui which rely on Tailwind CSS.

## Solution
1.  Install and configure Tailwind CSS and PostCSS with preflight disabled to avoid global resets.
2.  Set up the necessary utility functions (`cn`) for shadcn/ui.
3.  Add the `Button` component from shadcn/ui.
4.  Ensure Tailwind utilities can be used without altering existing SASS-rendered pages.
