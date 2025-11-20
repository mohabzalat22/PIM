# Task: Refactor All Pages with AsyncWrapper Pattern

**Date Created**: 2025-11-20
**Status**: In Progress 🚧
**Estimated Time**: 3-4 hours
**Complexity**: Medium-High

---

## 📋 Task Overview

Apply the async wrapper error handling pattern (already successfully implemented in Product.tsx) to all other page components. Remove all try-catch blocks and use asyncWrapper for consistent, clean error handling with real-time backend error messages.

---

## 🎯 Objectives

1. Remove all try-catch blocks from page components
2. Apply asyncWrapper pattern to all async operations
3. Import asyncWrapper utility in all affected pages
4. Ensure backend error messages are displayed properly
5. Maintain type safety throughout
6. Pass ESLint validation

---

## 📊 Analysis Summary

**Total try-catch blocks found**: 47 across 11 files

### Files to Refactor:
1. **Asset.tsx** - 3 try-catch blocks
2. **Attribute.tsx** - 4 try-catch blocks
3. **AttributeGroup.tsx** - 4 try-catch blocks
4. **AttributeSet.tsx** - 4 try-catch blocks
5. **Category.tsx** - 6 try-catch blocks
6. **Dashboard.tsx** - 1 try-catch block
7. **Locale.tsx** - 3 try-catch blocks
8. **ProductAttributes.tsx** - 4 try-catch blocks
9. **ProductDetail.tsx** - 11 try-catch blocks (most complex)
10. **Store.tsx** - 3 try-catch blocks
11. **StoreView.tsx** - 3 try-catch blocks

### Reference:
- ✅ **Product.tsx** - Already refactored (use as template)

---

## 📝 Checkpoints

### Phase 1: Simple CRUD Pages (3 try-catch each)

- [x] **1.1** Refactor `Asset.tsx`
  - Add asyncWrapper import ✅
  - Remove 3 try-catch blocks ✅
  - Wrap: handleCreate, handleUpdate, handleDelete ✅
  
- [x] **1.2** Refactor `Store.tsx`
  - Add asyncWrapper import ✅
  - Remove 3 try-catch blocks ✅
  - Wrap: handleCreate, handleUpdate, handleDelete ✅
  
- [x] **1.3** Refactor `Locale.tsx`
  - Add asyncWrapper import ✅
  - Remove 3 try-catch blocks ✅
  - Wrap: handleCreate, handleUpdate, handleDelete ✅
  
- [x] **1.4** Refactor `StoreView.tsx`
  - Add asyncWrapper import ✅
  - Remove 3 try-catch blocks ✅
  - Wrap: handleCreate, handleUpdate, handleDelete ✅

### Phase 2: Attribute-Related Pages (4 try-catch each)

- [x] **2.1** Refactor `Attribute.tsx`
  - Add asyncWrapper import ✅
  - Remove 4 try-catch blocks ✅
  - Wrap: handleCreate, handleUpdate, handleDelete, handleBulkDelete ✅
  
- [ ] **2.2** Refactor `AttributeGroup.tsx`
  - Add asyncWrapper import
  - Remove 4 try-catch blocks
  - Wrap all async operations
  
- [ ] **2.3** Refactor `AttributeSet.tsx`
  - Add asyncWrapper import
  - Remove 4 try-catch blocks
  - Wrap all async operations
  
- [ ] **2.4** Refactor `ProductAttributes.tsx`
  - Add asyncWrapper import
  - Remove 4 try-catch blocks
  - Wrap all async operations

### Phase 3: Complex Pages

- [ ] **3.1** Refactor `Category.tsx`
  - Add asyncWrapper import
  - Remove 6 try-catch blocks
  - Wrap all async operations (includes translations)
  
- [ ] **3.2** Refactor `ProductDetail.tsx`
  - Add asyncWrapper import
  - Remove 11 try-catch blocks (most complex)
  - Wrap all async operations
  - Handle nested try-catch blocks carefully

### Phase 4: Misc Pages

- [ ] **4.1** Refactor `Dashboard.tsx`
  - Add asyncWrapper import
  - Remove 1 try-catch block
  - Wrap async operation

### Phase 5: Validation & Testing

- [ ] **5.1** Run ESLint on all modified files
  - Check for any new errors
  - Verify no unused imports
  
- [ ] **5.2** Verify TypeScript compilation
  - No type errors
  - No `any` types introduced
  
- [ ] **5.3** Verify all try-catch blocks removed
  - Run grep search again
  - Ensure count is 0 (except Product.tsx which is already done)

---

## 🔧 Implementation Pattern

Based on the successful Product.tsx refactor:

### Step 1: Add Import (at top of file)
```typescript
import { asyncWrapper } from "@/utils/asyncWrapper";
```

### Step 2: Refactor Each Function

**Before:**
```typescript
const handleCreate = async () => {
  try {
    await Service.create(formData);
    await refetch();
    toast.success("Item created successfully");
    setShowDialog(false);
  } catch (err: unknown) {
    const error = err as Error;
    toast.error(`Failed to create: ${error.message}`);
  }
};
```

**After:**
```typescript
const handleCreate = async () => {
  await asyncWrapper(async () => {
    await Service.create(formData);
    await refetch();
    toast.success("Item created successfully");
    setShowDialog(false);
  });
};
```

### Step 3: Remove Error Type Assertions
- Remove all `const error = err as Error;` lines
- Remove all `catch (err: unknown)` blocks
- Backend errors will be automatically extracted and displayed

---

## ✅ Acceptance Criteria

- [ ] All 47 try-catch blocks removed from pages
- [ ] All async operations use asyncWrapper
- [ ] Backend error messages displayed in toast notifications
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No `any` type assertions
- [ ] All pages maintain existing functionality
- [ ] Consistent error handling across all pages

---

## 📝 Testing Checklist

For each refactored page, verify:
- [ ] Create operation works and shows backend errors
- [ ] Update operation works and shows backend errors
- [ ] Delete operation works and shows backend errors
- [ ] Success toasts still appear
- [ ] Error toasts show backend messages (not generic)

---

## 🔗 Related Files

- Plan: `.ai/plans/2025-11-20-refactor-all-pages-error-handling.md`
- Reference: `client/src/pages/Product.tsx` (already refactored)
- Utility: `client/src/utils/asyncWrapper.ts`
- Utility: `client/src/utils/errorExtractor.ts`
- Types: `client/src/types/api.types.ts`

---

**Status**: ⚠️ **Awaiting User Approval**

**Next Step**: User review and approval to proceed with implementation

