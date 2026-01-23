# Design: Block Component Refactor

## Current Architecture
`Block` is a `label` element containing:
1. Label (text + doc toggle)
2. Action (optional)
3. Content (children)
4. Doc (collapsible)

It uses `maputnik-input-block` class and modifiers.

## Proposed Architecture
Replace with shadcn `Card` or a composed structure:

```tsx
<div className={cn("flex flex-col gap-2", className)}>
  <div className="flex justify-between items-center">
    <Label>{label}</Label>
    {action}
  </div>
  <div>{children}</div>
  {showDoc && <Doc />}
</div>
```

Or using `Card`:

```tsx
<Card className="border-none shadow-none">
  <CardHeader className="p-0 pb-2">
     <div className="flex justify-between">
       <CardTitle>{label}</CardTitle>
       {action}
     </div>
  </CardHeader>
  <CardContent className="p-0">
     {children}
  </CardContent>
</Card>
```

We need to decide if we want to keep the `label` element as the root. `label` is good for accessibility if it wraps an input, but `Block` wraps arbitrary content which might already have labels or be complex. If we change root from `label` to `div`, we must ensure `htmlFor` or nesting handles focus correctly.

## Styling
- Migrate `maputnik-input-block` styles to Tailwind classes where possible.
- Ensure `maputnik-input-block--wide` and `inline` modes are supported via Flex/Grid classes.
