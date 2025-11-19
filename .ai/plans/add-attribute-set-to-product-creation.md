# Plan: Add Attribute Set Assignment to Product Creation

## Objective
Add the ability to assign an attribute set when creating a new product in the Product.tsx page.

## Current State Analysis
- Product creation dialog currently only has SKU and Product Type fields
- Products can have an `attributeSetId` (optional relation in schema)
- No attribute set selection UI exists in the create dialog

## Proposed Changes

### 1. Frontend Changes (Product.tsx)
- Add `attributeSetId` field to formData state
- Add attribute set dropdown to create dialog
- Add attribute set dropdown to edit dialog
- Fetch attribute sets using a custom hook (similar to useCategories, useAttributes)
- Update create/update service calls to include attributeSetId

### 2. Dependencies Required
- Create `useAttributeSets` hook in `/client/src/hooks/useAttributeSets.ts`
- Ensure AttributeSet API and Service exist (need to verify)
- Use SelectType component for attribute set selection

### 3. UI/UX Considerations
- Attribute set should be optional (allow empty/null value)
- Show "No Attribute Set" or similar option
- Display attribute set in both create and edit dialogs
- Maintain consistency with existing form fields

## Implementation Steps
1. Verify AttributeSet API and Service exist
2. Create useAttributeSets hook if needed
3. Update Product.tsx component state to include attributeSetId
4. Add attribute set selection to create dialog
5. Add attribute set selection to edit dialog
6. Update create and edit handlers to include attributeSetId
7. Test the implementation

## Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/Product.tsx`
- `/home/mohab/Desktop/codebase/xstore/client/src/hooks/useAttributeSets.ts` (create if doesn't exist)

## Files to Verify/Check
- `/home/mohab/Desktop/codebase/xstore/client/src/api/attributeSet.ts`
- `/home/mohab/Desktop/codebase/xstore/client/src/services/attributeSet.service.ts`
- `/home/mohab/Desktop/codebase/xstore/client/src/interfaces/attributeSet.interface.ts`

## Risk Assessment
- Low risk: Adding optional field to existing forms
- No breaking changes expected
- Backwards compatible (attributeSetId is optional)

## Testing Approach
- Manual testing: Create product with and without attribute set
- Manual testing: Edit product to add/remove/change attribute set
- Verify data persists correctly in backend
- Check ESLint validation passes

---
**Created**: November 19, 2025
**Status**: Pending Approval
