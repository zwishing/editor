# SingleFilterEditor Spec

## Requirements

### Requirement: Layout

The `SingleFilterEditor` MUST display its children (property, operator, args) in a single horizontal line.

### Requirement: Spacing

There MUST be consistent spacing (gap) between the input fields.

### Requirement: Responsiveness

The input fields MUST adjust their width to fit the container without breaking to a new line if possible, or handle overflow gracefully (though typical usage assumes enough width).

## API

No API changes. The internal DOM structure modification is purely for layout.
