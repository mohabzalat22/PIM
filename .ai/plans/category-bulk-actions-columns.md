# Plan: Add Bulk Actions and Column Visibility to Category Page

**Created**: November 18, 2025
**Status**: Pending Approval
**Type**: Feature Enhancement

## Overview
Add bulk action capabilities and column visibility controls to the Category page, mirroring the functionality implemented in the Product page.

## Problem Statement
The Category page currently lacks:
- Bulk selection and deletion capabilities
- Column visibility controls (show/hide columns)
- Bulk action bar for managing multiple categories at once

## Proposed Solution
Implement the same pattern used in Product.tsx:
1. Add checkbox column for selecting categories
2. Add bulk action bar showing selected count
3. Add bulk delete functionality with confirmation
4. Add column selector component to toggle column visibility
5. Ensure selections are cleared when page/filters change

## Technical Approach

### 1. State Management
- Add `selectedCategoryIds` state (Set<number>)
- Add `showBulkDeleteDialog` state (boolean)
- Add `columns` state array with column definitions

### 2. Column Configuration
Define columns with visibility and lock status:
- checkbox (visible, locked)
- id (visible, unlocked)
- name (visible, locked)
- slug (visible, unlocked)
- parent (visible, unlocked)
- subcategories (visible, unlocked)
- products (visible, unlocked)
- created (visible, unlocked)
- actions (visible, locked)

### 3. Components to Add
- Import `Checkbox` component
- Import `BulkActionBar` component
- Import `ColumnSelector` component
- Add bulk delete confirmation dialog

### 4. Functions to Implement
- `handleSelectAll()` - Select/deselect all categories on current page
- `handleSelectCategory()` - Toggle individual category selection
- `handleBulkDelete()` - Show bulk delete confirmation dialog
- `confirmBulkDelete()` - Execute bulk deletion
- `handleClearSelection()` - Clear all selections
- `handleColumnChange()` - Toggle column visibility
- `isColumnVisible()` - Check if column should be shown

### 5. UI Changes
- Add ColumnSelector to PageLayout actions
- Add checkbox column to table header and rows
- Add BulkActionBar above filters
- Conditionally render columns based on visibility state
- Update colSpan dynamically based on visible columns

## Files to Modify
1. `/home/mohab/Desktop/codebase/xstore/client/src/pages/Category.tsx`
   - Add imports for Checkbox, BulkActionBar, ColumnSelector
   - Add state management for bulk actions and columns
   - Add bulk action handlers
   - Update table structure with checkboxes and conditional columns
   - Add bulk delete confirmation dialog

## Dependencies
- Existing components: `@/components/ui/checkbox`, `@/components/app/BulkActionBar`, `@/components/app/ColumnSelector`
- CategoryService.remove() method for bulk deletion

## Testing Considerations
- Test select all functionality
- Test individual selection
- Test bulk delete with multiple categories
- Test column visibility toggle
- Test clearing selections on page change
- Ensure UI is responsive with different column combinations

## Rollback Plan
If issues arise, the changes are contained to Category.tsx and can be reverted by:
1. Removing new imports
2. Removing bulk action state and handlers
3. Removing column visibility state
4. Restoring original table structure

## Success Criteria
✅ Users can select multiple categories via checkboxes
✅ Bulk action bar appears when categories are selected
✅ Users can delete multiple categories at once with confirmation
✅ Users can show/hide table columns via ColumnSelector
✅ Selections clear when page or filters change
✅ Code follows existing patterns from Product.tsx
✅ ESLint validation passes

## Estimated Effort
- Implementation: ~30 minutes
- Testing: ~15 minutes
- Total: ~45 minutes

## Notes
- Follow exact same pattern as Product.tsx for consistency
- Maintain existing functionality (filters, pagination, CRUD operations)
- Keep locked columns (checkbox, name, actions) always visible
