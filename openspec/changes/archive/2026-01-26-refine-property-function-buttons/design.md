# Design

## Layout Logic in Block.tsx

Currently, `Block.tsx` forces the Action container (where buttons live) to a fixed width of `64px`:

```tsx
"w-[64px] text-right": !props.inline && !props.wideMode
```

With 3 buttons (Expression, Data, Zoom), the width exceeds 64px, causing:

1.  Wrapping (if flex-wrap is allowed, breaking alignment).
2.  Overflow/Cutoff (if hidden).
3.  Visual overlap if the Input content doesn't respect the boundary.

**Solution**:
Change `w-[64px]` to `w-auto` and rely on Flexbox:

```tsx
// Label: shrink-0, w-auto
// Action: shrink-0, w-auto (sized by buttons)
// Content: flex-1, min-w-0 (takes remaining space)
```

This ensures buttons always fit.

## Tooltip Implementation

We will add `src/components/ui/tooltip.tsx` wrapping `@radix-ui/react-tooltip`.
`InputButton` will optionally accept a `tooltip` prop (or we wrap usage in `Tooltip`).
To keep `InputButton` generic, we can either:

1.  Add `tooltip` prop to `InputButton` which renders the wrapper.
2.  Wrap `InputButton` in `Tooltip` inside `_FunctionButtons.tsx`.

Approach 2 is cleaner for separation of concerns, but Approach 1 is easier for migration if `InputButton` is used widely. Given `InputButton` is a custom wrapper around `ui/button`, adding `tooltip` support directly makes sense for "Show tooltip on hover".
However, `InputButton` has a `title` prop. We can repurpose `title` to render a Tooltip if we want global upgrade, OR we can ignore `title` and add a specific `tooltipLabel` prop.
Given the instruction "display prompt text content", I will update `_FunctionButtons` to use `Tooltip` explicitly.

## Icon Style

`InputButton` currently uses:

```tsx
"h-auto px-[6px] py-[6px] text-[11px] font-normal rounded-full";
variant = "outline";
```

We will change this to `variant="ghost"`, remove `rounded-full`, and adjust padding to be minimal/square for icon-only look.
