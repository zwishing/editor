- [x] 1. Audit current InputNumber usage
  - Confirmed usage across InputSpec, FieldNumber, FieldMinZoom/MaxZoom, InputArray, InputDynamicArray, and _DataProperty/_ZoomProperty.

- [x] 2. Add shadcn Input and Slider components if missing
  - Added `src/components/ui/input.tsx` and `src/components/ui/slider.tsx`.
  - Installed `@radix-ui/react-slider` dependency.

- [x] 3. Rebuild InputNumber to use shadcn Input and Slider
  - Preserved `InputNumberProps`, `data-wd-key` attributes, and range/text behaviors.
  - Adapted Slider array values to the existing single-number API.

- [x] 4. Validate behavior
  - Ran `npm run build`; it failed due to pre-existing TypeScript errors in unrelated files.
  - Manual smoke check not run in this environment.
