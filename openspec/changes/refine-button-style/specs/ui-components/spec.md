# Button Style Spec

## Requirements

### Requirement: InputButton Variant

`InputButton` MUST accept a `variant` prop that matches the Shadcn Button variants (e.g., "default", "destructive", "outline", "secondary", "ghost", "link").

### Requirement: Default Variant

If no variant is provided, `InputButton` MUST default to `"ghost"` (preserving backward compatibility).

### Requirement: Add Filter Button

The "Add filter" button in `FilterEditor` MUST use the `"outline"` variant.
