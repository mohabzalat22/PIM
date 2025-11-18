# Plan: Add Bulk Actions and Column Selector to Attribute Page

## Overview
Add bulk delete functionality and column visibility controls to the Attribute page, following the same pattern implemented in the Product page.

## Analysis
- **Current State**: Attribute page has basic CRUD operations without bulk actions or column customization
- **Target State**: Attribute page with bulk select, bulk delete, and column visibility control
- **Reference**: Product.tsx implementation (lines with bulk actions and column selector)

## Components Needed
1. **BulkActionBar** - Already exists, used in Product page
2. **ColumnSelector** - Already exists, used in Product page
3. **DeleteConfirmDialog** - Already exists, being used for single delete

## Changes Required

### 1. State Management
- Add `selectedAttributeIds` state (Set<number>)
- Add `showBulkDeleteDialog` state (boolean)
- Add `columns` state with Column[] type
- Define column configuration with locked/unlocked columns

### 2. Column Definition
Columns for Attribute table:
- checkbox (locked, visible)
- id (unlocked, visible)
- code (locked, visible)
- label (unlocked, visible)
- dataType (unlocked, visible)
- inputType (unlocked, visible)
- properties (unlocked, visible)
- values (unlocked, visible)
- created (unlocked, visible)
- actions (locked, visible)

### 3. Bulk Action Handlers
- `handleSelectAll(checked: boolean)` - Select/deselect all attributes on current page
- `handleSelectAttribute(attributeId: number, checked: boolean)` - Toggle individual selection
- `handleBulkDelete()` - Open confirmation dialog
- `confirmBulkDelete()` - Execute bulk delete operation
- `handleClearSelection()` - Clear all selections

### 4. Column Visibility Handlers
- `handleColumnChange(columnId: string, visible: boolean)` - Toggle column visibility
- `isColumnVisible(columnId: string)` - Check if column is visible

### 5. UI Updates
- Add ColumnSelector to page actions
- Add BulkActionBar below page header
- Add checkbox column to table
- Conditionally render columns based on visibility
- Add bulk delete confirmation dialog
- Update colSpan calculation

### 6. Side Effects
- Clear selections when page or filters change
- Maintain checkbox state consistency

## Implementation Steps
1. Import required components (BulkActionBar, ColumnSelector, Checkbox)
2. Add state variables for bulk actions and columns
3. Implement selection handlers
4. Implement column visibility handlers
5. Update table header with checkboxes and conditional columns
6. Update table rows with checkboxes and conditional columns
7. Add BulkActionBar component
8. Add ColumnSelector to page actions
9. Add bulk delete confirmation dialog
10. Add useEffect to clear selections on page/filter changes
11. Test all functionality

## Testing Checklist
- [ ] Select all checkbox works correctly
- [ ] Individual row selection works
- [ ] Bulk delete confirmation shows correct count
- [ ] Bulk delete executes successfully
- [ ] Selection clears after delete
- [ ] Selection clears on page change
- [ ] Column visibility toggles work
- [ ] Locked columns cannot be hidden
- [ ] Table layout adjusts to hidden columns
- [ ] colSpan updates correctly

## Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/Attribute.tsx`

## Dependencies
- BulkActionBar component (existing)
- ColumnSelector component (existing)
- Checkbox component from Radix UI (existing)
- Column interface/type (may need to define if not exists)

## Estimated Complexity
Medium - Following existing pattern from Product page

## Risks
- None significant, well-established pattern

---
**Created**: November 18, 2025
**Status**: Pending Approval
