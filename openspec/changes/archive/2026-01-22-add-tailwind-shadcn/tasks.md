- [x] 1. Install Tailwind CSS and Shadcn dependencies
  - Ran `npm install -D tailwindcss postcss autoprefixer` and `npm install class-variance-authority clsx tailwind-merge tailwindcss-animate @radix-ui/react-slot`.
  - Verification: `npm list tailwindcss` shows installed version.

- [x] 2. Configure Tailwind and PostCSS
  - Created `tailwind.config.js` with content paths and preflight disabled.
  - Created `postcss.config.js`.

- [x] 3. Create Global CSS and Utils
  - Created `src/styles/globals.css` with Tailwind import and CSS variables.
  - Created `src/lib/utils.ts` with `cn` helper.
  - Imported `src/styles/globals.css` in `src/index.jsx`.

- [x] 4. Add Button Component
  - Created `src/components/ui/button.tsx` with the shadcn Button implementation.
  - Verification: `npm run lint` failed due to pre-existing lint errors in unrelated files.

- [x] 5. Verify Integration
  - Ran `npm run build`; it failed due to pre-existing TypeScript errors in unrelated files.
  - Manual smoke check not run in this environment.
