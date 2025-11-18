# Implementation Plan: Add Bulk Actions and Column Visibility to AttributeSet Page

**Date**: November 18, 2025  
**Feature**: Bulk Actions & Column Visibility for AttributeSet Page  
**Reference Files**: 
- Source Pattern: `client/src/pages/Product.tsx`
- Target File: `client/src/pages/AttributeSet.tsx`

## Overview
Add bulk delete functionality and column visibility controls to the AttributeSet page, following the same pattern implemented in the Product page.

## Requirements Analysis

### 1. Bulk Actions
- Add checkbox column for row selection
- Implement "Select All" functionality
- Show BulkActionBar when items are selected
- Support bulk delete with confirmation dialog
- Clear selections on page/filter changes

### 2. Column Visibility
- Add ColumnSelector component to page actions
- Define column configuration with visibility and locked states
- Implement conditional column rendering
- Persist column visibility state

## Technical Approach

### State Management
```typescript
// Bulk actions state
const [selectedAttributeSetIds, setSelectedAttributeSetIds] = useState<Set<number>>(new Set());
const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState<boolean>(false);

// Column visibility state
const [columns, setColumns] = useState<Column[]>([
  { id: "checkbox", label: "Select", visible: true, locked: true },
  { id: "id", label: "ID", visible: true, locked: false },
  { id: "code", label: "Code", visible: true, locked: true },
  { id: "label", label: "Label", visible: true, locked: false },
  { id: "productType", label: "Product Type", visible: true, locked: false },
  { id: "default", label: "Default", visible: true, locked: false },
  { id: "groups", label: "Groups", visible: true, locked: false },
  { id: "attributes", label: "Attributes", visible: true, locked: false },
  { id: "created", label: "Created", visible: true, locked: false },
  { id: "actions", label: "Actions", visible: true, locked: true },
]);
```

### Handlers to Implement
1. `handleSelectAll(checked: boolean)` - Select/deselect all items on current page
2. `handleSelectAttributeSet(id: number, checked: boolean)` - Toggle individual selection
3. `handleBulkDelete()` - Open confirmation dialog
4. `confirmBulkDelete()` - Execute bulk delete
5. `handleClearSelection()` - Clear all selections
6. `handleColumnChange(columnId: string, visible: boolean)` - Toggle column visibility
7. `isColumnVisible(columnId: string)` - Check if column is visible

### Components to Add
- `<ColumnSelector />` in page actions
- `<BulkActionBar />` below page header
- `<Checkbox />` in table header and rows
- `<DeleteConfirmDialog />` for bulk delete confirmation

### Effects to Add
```typescript
// Clear selections when page or filters change
useEffect(() => {
  setSelectedAttributeSetIds(new Set());
}, [currentPage, filters]);
```

## Implementation Steps

1. **Add State Variables**
   - Bulk actions: selectedAttributeSetIds, showBulkDeleteDialog
   - Column visibility: columns array

2. **Add Handler Functions**
   - Bulk selection handlers
   - Bulk delete handlers
   - Column visibility handlers

3. **Update Page Actions**
   - Add ColumnSelector component

4. **Add BulkActionBar**
   - Position below PageLayout title/actions

5. **Update Table Structure**
   - Add checkbox column header
   - Add checkbox in each row
   - Wrap existing columns with visibility checks

6. **Add Bulk Delete Dialog**
   - DeleteConfirmDialog for bulk operations

7. **Add useEffect for Selection Clearing**
   - Clear selections on page/filter changes

## Files to Modify
- `client/src/pages/AttributeSet.tsx` - Main implementation

## Dependencies
- Existing components: BulkActionBar, ColumnSelector, DeleteConfirmDialog, Checkbox
- Existing services: AttributeSetService
- Existing hooks: useAttributeSets

## Testing Considerations
- Test select all functionality
- Test individual selection
- Test bulk delete with multiple items
- Test column visibility toggle
- Test selection clearing on page change
- Test selection clearing on filter change
- Verify locked columns cannot be hidden

## Code Quality
- Follow existing TypeScript patterns
- Maintain consistent error handling with toast notifications
- Use async/await for API calls
- Run `npm run lint:fix` before completion

## Success Criteria
- ✅ Users can select multiple attribute sets via checkboxes
- ✅ Users can select/deselect all items on current page
- ✅ BulkActionBar shows selected count and actions
- ✅ Bulk delete works with confirmation
- ✅ Selections clear on page/filter changes
- ✅ Users can show/hide table columns
- ✅ Locked columns (checkbox, code, actions) cannot be hidden
- ✅ All functionality matches Product page pattern
- ✅ Code passes ESLint validation
