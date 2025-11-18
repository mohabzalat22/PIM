# Plan: Add Bulk Actions and Column Selection to Attribute Group Page

**Date Created**: 2025-11-18
**Status**: Planning
**Estimated Complexity**: Low

## Overview
Add bulk action capabilities (bulk delete) and column visibility controls to the AttributeGroup.tsx page, following the same pattern implemented in Product.tsx.

## Requirements
- Add column selection dropdown to show/hide columns
- Add bulk selection checkboxes for attribute groups
- Implement bulk delete functionality with confirmation dialog
- Add bulk action bar showing selected count
- Clear selections when page/filters change
- Follow exact UI/UX patterns from Product.tsx

## Affected Components

### Backend
- No backend changes required (existing delete endpoint will be used)

### Database
- No database changes required

### Frontend
- [x] Components: AttributeGroup.tsx
- [x] Reuse existing components:
  - ColumnSelector
  - BulkActionBar
  - DeleteConfirmDialog
  - Checkbox
- [x] State management: Add local state for selections and columns

## Dependencies
- Existing components from Product.tsx implementation
- No new packages needed
- Reuse existing UI components (Checkbox, DropdownMenu, etc.)

## Implementation Strategy
1. Add column visibility state and configuration
2. Add ColumnSelector component to page actions
3. Add checkbox column to table header and rows
4. Implement bulk selection logic (select all, individual select)
5. Add BulkActionBar component
6. Add bulk delete confirmation dialog
7. Add handlers for bulk delete operation
8. Clear selections on page/filter changes
9. Update table header cells to respect column visibility
10. Update table rows to respect column visibility

## Potential Risks
- None - This is a proven pattern already implemented in Product.tsx
- Low risk since no backend or database changes required

## Success Criteria
- [x] Users can show/hide columns using ColumnSelector
- [x] Users can select individual attribute groups via checkboxes
- [x] Users can select all attribute groups on current page
- [x] Selected count displays in BulkActionBar
- [x] Bulk delete works with confirmation dialog
- [x] Selections clear when page or filters change
- [x] UI matches Product.tsx implementation
- [x] Code follows existing patterns and conventions
- [x] ESLint validation passes
