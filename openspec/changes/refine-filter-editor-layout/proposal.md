# Refine Filter Editor Layout

| ID                              | Status    | Category        |
| :------------------------------ | :-------- | :-------------- |
| **refine-filter-editor-layout** | **Draft** | **Enhancement** |

## Summary

Refine the layout of the Filter Editor in the Layer Settings panel to display the Field, Condition, and Value input boxes on a single line.

## Problem Statement

Currently, the filter editor inputs ("Field", "Condition", "Value") may stack or take up unnecessary vertical space, or simply are not aligned in a single row as desired for a compact and clean UI.

## Goals

1.  Ensure "Field", "Condition", and "Value" inputs are displayed on a single horizontal line.
2.  Use standard spacing between inputs.
3.  Maintain usability and aesthetics.

## Non-Goals

- Changing the functionality of the filter editor.
- Refactoring the entire `FilterEditor` component logic.
