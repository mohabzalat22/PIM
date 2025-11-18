# Task: Add Bulk Actions and Column Visibility to Category Page

**Created**: November 18, 2025
**Status**: Pending Approval
**Plan**: `.ai/plans/category-bulk-actions-columns.md`

## Task Overview
Implement bulk selection, bulk delete, and column visibility controls for the Category page following the Product.tsx pattern.

## Checkpoints

### ✅ Checkpoint 1: Add Required Imports
- [ ] Import Checkbox component from @/components/ui/checkbox
- [ ] Import BulkActionBar from @/components/app/BulkActionBar
- [ ] Import ColumnSelector and Column type from @/components/app/ColumnSelector

**Estimated Time**: 2 minutes

---

### ✅ Checkpoint 2: Add State Management
- [ ] Add selectedCategoryIds state (Set<number>)
- [ ] Add showBulkDeleteDialog state (boolean)
- [ ] Add columns state with 9 column definitions
- [ ] Add useEffect to clear selections on page/filter changes

**Estimated Time**: 5 minutes

---

### ✅ Checkpoint 3: Implement Bulk Action Handlers
- [ ] Create handleSelectAll function
- [ ] Create handleSelectCategory function
- [ ] Create handleBulkDelete function
- [ ] Create confirmBulkDelete function
- [ ] Create handleClearSelection function

**Estimated Time**: 8 minutes

---

### ✅ Checkpoint 4: Implement Column Visibility Handlers
- [ ] Create handleColumnChange function
- [ ] Create isColumnVisible function

**Estimated Time**: 3 minutes

---

### ✅ Checkpoint 5: Update UI - PageLayout Actions
- [ ] Add ColumnSelector component before "Add Category" button
- [ ] Pass columns and handleColumnChange to ColumnSelector

**Estimated Time**: 2 minutes

---

### ✅ Checkpoint 6: Update UI - Add BulkActionBar
- [ ] Add BulkActionBar component above FilterPanel
- [ ] Pass selectedCount, onDelete, onClearSelection props

**Estimated Time**: 2 minutes

---

### ✅ Checkpoint 7: Update UI - Table Header
- [ ] Add conditional checkbox TableHead with select all checkbox
- [ ] Make all other TableHead elements conditional based on isColumnVisible
- [ ] Ensure checkbox, name, and actions are always visible (locked columns)

**Estimated Time**: 5 minutes

---

### ✅ Checkpoint 8: Update UI - Table Rows
- [ ] Add conditional checkbox TableCell with individual selection
- [ ] Make all other TableCell elements conditional based on isColumnVisible
- [ ] Update category mapping to include checkbox handling

**Estimated Time**: 5 minutes

---

### ✅ Checkpoint 9: Update UI - Dynamic colSpan
- [ ] Update DataTable colSpan to dynamically count visible columns
- [ ] Use `columns.filter(col => col.visible).length`

**Estimated Time**: 2 minutes

---

### ✅ Checkpoint 10: Add Bulk Delete Confirmation Dialog
- [ ] Add DeleteConfirmDialog for bulk delete
- [ ] Configure open state, title, description, and onConfirm handler
- [ ] Show count of selected categories in description

**Estimated Time**: 3 minutes

---

### ✅ Checkpoint 11: Code Quality & Validation
- [ ] Run ESLint validation with `npm run lint:fix`
- [ ] Verify no TypeScript errors
- [ ] Ensure all imports are used
- [ ] Check code formatting consistency

**Estimated Time**: 3 minutes

---

### ✅ Checkpoint 12: Testing & Verification
- [ ] Test select all checkbox functionality
- [ ] Test individual category selection
- [ ] Test bulk delete with confirmation
- [ ] Test column visibility toggle
- [ ] Verify selections clear on page change
- [ ] Verify selections clear on filter change
- [ ] Test with different column visibility combinations

**Estimated Time**: 10 minutes

---

## Total Estimated Time: ~50 minutes

## Implementation Notes
- Follow exact pattern from Product.tsx for consistency
- Maintain all existing functionality (filters, pagination, dialogs)
- Locked columns: checkbox, name, actions (always visible)
- Clear selections whenever currentPage or filters change

## Completion Criteria
All checkpoints must be marked complete with ✅ before task is considered done.
Code must pass ESLint validation.
All functionality must be tested and working.

## Blockers
None identified.

## Questions for User
None at this time.

---

**Waiting for user approval to proceed with implementation.**
