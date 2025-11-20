# Task: Implement AsyncWrapper Across All Pages

**Date**: November 20, 2025  
**Status**: Pending Approval  
**Related Plan**: `.ai/plans/asyncwrapper-implementation-plan.md`

## Task Overview

Implement `asyncWrapper` utility across 6 pages that currently lack consistent error handling and real-time user feedback for backend operations.

---

## Checkpoint 1: Asset.tsx ⬜

### Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/Asset.tsx`

### Changes Required

1. **Add Import** (Line ~44)
   ```typescript
   import { asyncWrapper } from "@/utils/asyncWrapper";
   ```

2. **Wrap handleCreateAsset** (Line ~145)
   - Current: Direct service call with try-catch
   - New: Wrap entire function body in asyncWrapper

3. **Wrap handleEditAsset** (Line ~158)
   - Current: Direct service call with try-catch
   - New: Wrap entire function body in asyncWrapper

4. **Wrap handleDeleteAsset** (Line ~174)
   - Current: Direct service call with try-catch
   - New: Wrap entire function body in asyncWrapper

5. **Add/Update Bulk Delete Handler**
   - Check if bulk delete exists
   - Wrap in asyncWrapper if exists
   - Follow Product.tsx pattern

### Verification
- [ ] Import added
- [ ] handleCreateAsset wrapped
- [ ] handleEditAsset wrapped
- [ ] handleDeleteAsset wrapped
- [ ] Bulk delete wrapped (if exists)
- [ ] Toast messages preserved
- [ ] Dialog state management preserved

---

## Checkpoint 2: Category.tsx ⬜

### Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/Category.tsx`

### Changes Required

1. **Add Import** (Line ~45)
   ```typescript
   import { asyncWrapper } from "@/utils/asyncWrapper";
   ```

2. **Wrap handleCreateCategory** (Line ~218)
   - Wrap complex category creation logic
   - Preserve translation creation
   - Maintain dialog state reset

3. **Wrap handleEditCategory** (Line ~261)
   - Wrap update and translation update logic
   - Preserve all existing functionality

4. **Wrap handleDeleteCategory** (Line ~309)
   - Simple delete operation
   - Maintain refetch logic

5. **Wrap confirmBulkDelete**
   - Find bulk delete confirmation handler
   - Wrap in asyncWrapper
   - Preserve selection clearing

### Verification
- [ ] Import added
- [ ] handleCreateCategory wrapped
- [ ] handleEditCategory wrapped
- [ ] handleDeleteCategory wrapped
- [ ] confirmBulkDelete wrapped
- [ ] Translation logic preserved
- [ ] Toast messages work correctly

---

## Checkpoint 3: AttributeGroup.tsx ⬜

### Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/AttributeGroup.tsx`

### Changes Required

1. **Add Import** (Line ~47)
   ```typescript
   import { asyncWrapper } from "@/utils/asyncWrapper";
   ```

2. **Wrap handleCreateGroup** (Line ~240)
   - Wrap creation logic
   - Preserve attribute assignment
   - Maintain state reset

3. **Wrap handleEditGroup** (Line ~282)
   - Wrap update logic
   - Preserve attribute updates
   - Handle complex group editing

4. **Wrap handleDeleteGroup** (Line ~347)
   - Simple delete operation

5. **Wrap confirmBulkDelete**
   - Wrap bulk delete handler
   - Follow Product.tsx pattern

6. **Wrap Attribute Removal Handler** (Line ~328)
   - If exists, wrap removeAttributeFromGroup calls

### Verification
- [ ] Import added
- [ ] handleCreateGroup wrapped
- [ ] handleEditGroup wrapped
- [ ] handleDeleteGroup wrapped
- [ ] confirmBulkDelete wrapped
- [ ] Attribute removal wrapped
- [ ] All state management preserved

---

## Checkpoint 4: AttributeSet.tsx ⬜

### Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/AttributeSet.tsx`

### Changes Required

1. **Add Import** (Line ~44)
   ```typescript
   import { asyncWrapper } from "@/utils/asyncWrapper";
   ```

2. **Wrap handleCreateAttributeSet** (Line ~231)
   - Wrap creation with attribute assignment
   - Preserve complex payload construction

3. **Wrap handleEditAttributeSet** (Line ~258)
   - Wrap update logic
   - Preserve attribute management

4. **Wrap handleDeleteAttributeSet** (Line ~299)
   - Simple delete operation

5. **Wrap confirmBulkDelete**
   - Wrap bulk delete handler

6. **Wrap removeAttributeFromSet** (Line ~285)
   - Wrap attribute removal logic if exists

### Verification
- [ ] Import added
- [ ] handleCreateAttributeSet wrapped
- [ ] handleEditAttributeSet wrapped
- [ ] handleDeleteAttributeSet wrapped
- [ ] confirmBulkDelete wrapped
- [ ] Attribute removal wrapped
- [ ] Complex payload logic preserved

---

## Checkpoint 5: ProductDetail.tsx ⬜

### Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/ProductDetail.tsx`

### Changes Required

**Note**: This is the most complex file with multiple sections

1. **Add Import** (Line ~30)
   ```typescript
   import { asyncWrapper } from "@/utils/asyncWrapper";
   ```

2. **Wrap Product Basic Info Handlers**
   - Update SKU handler
   - Update type handler
   - Update attribute set handler
   - Delete product handler

3. **Wrap Product Attribute Handlers**
   - Create attribute value handler
   - Update attribute value handler
   - Delete attribute value handler

4. **Wrap Product Category Handlers**
   - Add category handler
   - Remove category handler

5. **Wrap Product Asset Handlers**
   - Add asset handler
   - Update asset position handler
   - Remove asset handler

### Verification
- [ ] Import added
- [ ] All basic info handlers wrapped
- [ ] All attribute handlers wrapped
- [ ] All category handlers wrapped
- [ ] All asset handlers wrapped
- [ ] Tab functionality preserved
- [ ] All forms work correctly

---

## Checkpoint 6: ProductAttributes.tsx ⬜

### Files to Modify
- `/home/mohab/Desktop/codebase/xstore/client/src/pages/ProductAttributes.tsx`

### Changes Required

1. **Add Import** (Line ~50)
   ```typescript
   import { asyncWrapper } from "@/utils/asyncWrapper";
   ```

2. **Wrap Create Handler**
   - Find and wrap attribute value creation

3. **Wrap Edit Handler**
   - Find and wrap attribute value update

4. **Wrap Delete Handler**
   - Find and wrap attribute value deletion

5. **Wrap Bulk Delete Handler**
   - If exists, wrap confirmBulkDelete

### Verification
- [ ] Import added
- [ ] Create handler wrapped
- [ ] Edit handler wrapped
- [ ] Delete handler wrapped
- [ ] Bulk delete wrapped (if exists)
- [ ] Filter logic preserved
- [ ] Navigation preserved

---

## Checkpoint 7: ESLint Validation ⬜

### Commands to Run

```bash
# From project root
npm run lint:fix
```

### Verification
- [ ] No ESLint errors
- [ ] No ESLint warnings (or only acceptable ones)
- [ ] All imports correct
- [ ] Formatting consistent

---

## Checkpoint 8: Testing ⬜

### Manual Testing Required

For each modified page:
1. **Create Operation**
   - Click create button
   - Fill form
   - Submit
   - Verify success toast
   - Verify data appears

2. **Update Operation**
   - Click edit on item
   - Modify data
   - Submit
   - Verify success toast
   - Verify data updated

3. **Delete Operation**
   - Click delete on item
   - Confirm
   - Verify success toast
   - Verify data removed

4. **Bulk Delete** (where applicable)
   - Select multiple items
   - Click bulk delete
   - Confirm
   - Verify success toast
   - Verify items removed

5. **Error Handling**
   - Try to create duplicate (if unique constraint)
   - Verify error toast appears
   - Verify meaningful error message

### Verification
- [ ] Asset.tsx tested
- [ ] Category.tsx tested
- [ ] AttributeGroup.tsx tested
- [ ] AttributeSet.tsx tested
- [ ] ProductDetail.tsx tested
- [ ] ProductAttributes.tsx tested

---

## Final Checklist ⬜

- [ ] All 6 pages have asyncWrapper import
- [ ] All async service calls wrapped
- [ ] All toast messages preserved
- [ ] All state management preserved
- [ ] No ESLint errors
- [ ] Pattern matches Product.tsx
- [ ] All tests passed
- [ ] No regression in existing functionality

---

## Notes

- Follow the exact pattern from Product.tsx
- Preserve all existing logic (toasts, state resets, refetch calls)
- Don't modify anything outside the async handlers
- Keep error messages consistent with existing ones
- Test thoroughly before marking complete

---

**Status**: ⚠️ **AWAITING USER APPROVAL** ⚠️

Do not proceed with implementation until user approves this task and plan.
