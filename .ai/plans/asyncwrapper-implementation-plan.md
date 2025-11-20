# AsyncWrapper Implementation Plan

**Date**: November 20, 2025  
**Author**: GitHub Copilot  
**Status**: Pending Approval

## Overview

This plan outlines the implementation of `asyncWrapper` utility across all pages in the XStore PIM system to ensure consistent error handling and real-time backend response feedback to users.

## Current State Analysis

### Pages Already Using AsyncWrapper ✅
- **Product.tsx** - Complete implementation
- **Attribute.tsx** - Complete implementation  
- **Store.tsx** - Complete implementation
- **StoreView.tsx** - Complete implementation
- **Locale.tsx** - Complete implementation

### Pages Missing AsyncWrapper ❌
- **Asset.tsx** - Needs implementation
- **Category.tsx** - Needs implementation
- **AttributeGroup.tsx** - Needs implementation
- **AttributeSet.tsx** - Needs implementation
- **ProductDetail.tsx** - Needs implementation
- **ProductAttributes.tsx** - Needs implementation

## Implementation Strategy

### 1. What is AsyncWrapper?

The `asyncWrapper` utility is used to:
- Catch and handle async errors consistently
- Show loading states during async operations
- Display success/error toasts to users
- Provide real-time feedback for backend operations

### 2. Pattern to Follow

Based on **Product.tsx** implementation:

```typescript
// Import the utility
import { asyncWrapper } from "@/utils/asyncWrapper";

// Wrap async service calls
const handleCreateEntity = async () => {
  await asyncWrapper(async () => {
    await EntityService.create(formData);
    await refetchEntities();
    toast.success("Entity created successfully");
    setShowCreateDialog(false);
    resetFormData();
  });
};

const handleEditEntity = async () => {
  if (!editingEntity) return;

  await asyncWrapper(async () => {
    await EntityService.update(editingEntity.id, formData);
    await refetchEntities();
    toast.success("Entity updated successfully");
    setShowEditDialog(false);
    resetFormData();
  });
};

const handleDeleteEntity = async (id: number) => {
  await asyncWrapper(async () => {
    await EntityService.remove(id);
    await refetchEntities();
    toast.success("Entity deleted successfully");
  });
};

const handleBulkDelete = async () => {
  await asyncWrapper(async () => {
    const deletePromises = Array.from(selectedIds).map((id) =>
      EntityService.remove(id)
    );
    await Promise.all(deletePromises);
    await refetchEntities();
    const count = selectedIds.size;
    setSelectedIds(new Set());
    toast.success(`Successfully deleted ${count} item${count > 1 ? "s" : ""}`);
  });
};
```

### 3. Changes Required Per File

#### Asset.tsx
- Add import: `import { asyncWrapper } from "@/utils/asyncWrapper";`
- Wrap handlers: `handleCreateAsset`, `handleEditAsset`, `handleDeleteAsset`
- Add bulk delete handler if not present

#### Category.tsx
- Add import: `import { asyncWrapper } from "@/utils/asyncWrapper";`
- Wrap handlers: `handleCreateCategory`, `handleEditCategory`, `handleDeleteCategory`
- Wrap bulk delete handler: `confirmBulkDelete`

#### AttributeGroup.tsx
- Add import: `import { asyncWrapper } from "@/utils/asyncWrapper";`
- Wrap handlers: `handleCreateGroup`, `handleEditGroup`, `handleDeleteGroup`
- Wrap bulk delete handler: `confirmBulkDelete`
- Wrap attribute removal handler if present

#### AttributeSet.tsx
- Add import: `import { asyncWrapper } from "@/utils/asyncWrapper";`
- Wrap handlers: `handleCreateAttributeSet`, `handleEditAttributeSet`, `handleDeleteAttributeSet`
- Wrap bulk delete handler: `confirmBulkDelete`
- Wrap attribute removal handler if present

#### ProductDetail.tsx
- Add import: `import { asyncWrapper } from "@/utils/asyncWrapper";`
- Wrap all async service calls throughout the component
- This file is complex with multiple tabs and operations

#### ProductAttributes.tsx
- Add import: `import { asyncWrapper } from "@/utils/asyncWrapper";`
- Wrap handlers: `handleCreate`, `handleEdit`, `handleDelete`
- Wrap bulk delete handler if present

## Benefits

1. **Consistent Error Handling**: All async operations will handle errors uniformly
2. **User Feedback**: Users get immediate toast notifications for success/failure
3. **Better UX**: Loading states are managed automatically
4. **Maintainability**: Centralized error handling logic
5. **Developer Experience**: Less boilerplate code for error handling

## Testing Approach

After implementation:
1. Test create operations for each entity
2. Test update operations for each entity
3. Test delete operations for each entity
4. Test bulk delete operations where applicable
5. Verify error toasts appear on failures
6. Verify success toasts appear on success
7. Verify loading states work correctly

## Code Quality

- Run `npm run lint:fix` after all changes
- Ensure all imports are correct
- Follow existing code patterns in Product.tsx
- Maintain consistent formatting

## Rollback Plan

If issues arise:
- Each file can be reverted independently
- Git commits will be made per file for easy rollback
- Original error handling logic is being replaced, so rollback is straightforward

## Timeline

1. Create plan and task - 5 minutes
2. Get user approval - Awaiting
3. Implement per file - 10-15 minutes each
4. Testing - 20 minutes
5. ESLint validation - 5 minutes

**Total estimated time**: 2-3 hours

## Success Criteria

- [ ] All identified pages use asyncWrapper
- [ ] All async operations wrapped correctly
- [ ] Toast notifications work for all operations
- [ ] No ESLint errors
- [ ] Pattern matches Product.tsx implementation
- [ ] All existing functionality preserved

---

**Next Steps**: Create detailed task file with checkpoints, then request user approval.
