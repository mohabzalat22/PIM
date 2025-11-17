# Plan: Add Bulk Actions and Column Selection to Products Table

**Date Created**: 2025-11-17
**Status**: Planning
**Estimated Complexity**: Medium

## Overview
Add bulk action capabilities (delete, export, etc.) and a column visibility selector to the Products table in `Product.tsx`. This will improve user experience by allowing batch operations and customizable table views.

## Requirements
- Multi-select checkboxes for product rows
- Bulk action toolbar (appears when products are selected)
- Bulk delete functionality
- Column visibility selector (show/hide table columns)
- Persist column preferences (optional - can use localStorage)
- Maintain existing filtering and pagination functionality

## Affected Components

### Backend
- [x] No backend changes required (will use existing DELETE endpoint)

### Database
- [x] No database changes required

### Frontend
- [ ] Components: `Product.tsx` - main component update
- [ ] Components: New reusable components needed:
  - `BulkActionBar.tsx` - toolbar for bulk operations
  - `ColumnSelector.tsx` - dropdown for column visibility
- [ ] State management: Add state for:
  - Selected product IDs
  - Visible columns configuration
- [ ] API calls: Use existing `ProductService.remove()` for bulk delete

## Dependencies
- Existing UI components from shadcn/ui:
  - Checkbox component
  - Toolbar/Button components
  - Dropdown/Popover components
- Lucide React icons for bulk action icons

## Implementation Strategy

1. **Create Reusable Components** (Phases 1-2)
   - Create `BulkActionBar.tsx` component
   - Create `ColumnSelector.tsx` component

2. **Update Product.tsx** (Phase 3)
   - Add state for selected items and column visibility
   - Add checkbox column to table
   - Integrate BulkActionBar component
   - Integrate ColumnSelector component
   - Implement bulk delete handler
   - Update table header to conditionally render columns

3. **Testing** (Phase 4)
   - Test selection/deselection
   - Test bulk delete
   - Test column visibility toggle
   - Verify pagination works with selections
   - Verify filters work with selections

## Potential Risks
- **Risk 1**: Performance with large number of selected items
  - Mitigation: Use Set for O(1) lookups, limit bulk operations to current page or add confirmation
  
- **Risk 2**: State management complexity
  - Mitigation: Clear selections on page change/filter change
  
- **Risk 3**: UX confusion with selections across pages
  - Mitigation: Clear selections when changing pages or show warning

## Success Criteria
- [x] Users can select multiple products via checkboxes
- [x] Bulk action bar appears when items are selected
- [x] Users can delete multiple products at once with confirmation
- [x] Users can show/hide table columns
- [x] Column preferences persist during session
- [x] Existing functionality (filters, pagination, CRUD) still works
- [x] Code follows existing patterns and passes ESLint
