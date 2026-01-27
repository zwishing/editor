# Refine Button Style

| ID                      | Status    | Category        |
| :---------------------- | :-------- | :-------------- |
| **refine-button-style** | **Draft** | **Enhancement** |

## Summary

Allow `InputButton` to support different variants (like "outline") and update the "Add filter" button to use the outline variant for better visibility and clear styling.

## Problem Statement

The "Add filter" button currently uses a manual border on a ghost button, which might be causing visual confusion ("appearing as a grey line").

## Goals

1.  Update `InputButton` to support `variant` prop.
2.  Use `variant="outline"` for "Add filter" button.
