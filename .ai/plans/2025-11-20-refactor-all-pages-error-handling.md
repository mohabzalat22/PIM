# Plan: Refactor All Pages with AsyncWrapper Pattern

**Date Created**: 2025-11-20
**Status**: Planning
**Estimated Complexity**: Medium-High

## Overview
Apply the async wrapper error handling pattern (already implemented in Product.tsx) to all other page components that use try-catch blocks. This ensures consistent error handling across the entire application with real-time backend error messages.

## Requirements
- Identify all pages with try-catch blocks
- Remove all try-catch blocks from page components
- Apply asyncWrapper pattern to all async operations
- Import asyncWrapper utility in all affected pages
- Ensure backend error messages are displayed properly
- Maintain type safety throughout

## Affected Components

### Frontend Pages (Based on #file:pages)
- [ ] Asset.tsx
- [ ] Attribute.tsx
- [ ] AttributeGroup.tsx
- [ ] AttributeSet.tsx
- [ ] Category.tsx
- [ ] Locale.tsx
- [ ] ProductAttributes.tsx
- [ ] ProductDetail.tsx
- [ ] Store.tsx
- [ ] StoreView.tsx

### Pages NOT Affected (No async operations or already simple)
- Dashboard.tsx (likely no CRUD operations)
- Home.tsx (likely no CRUD operations)
- NotFound.tsx (static page)
- Settings.tsx (needs investigation)
- SignInPage.tsx (Clerk handles auth)
- SignUpPage.tsx (Clerk handles auth)

### Reference Implementation
- ✅ Product.tsx (already refactored - use as template)

## Dependencies
- Existing asyncWrapper utility (`client/src/utils/asyncWrapper.ts`)
- Existing errorExtractor utility (`client/src/utils/errorExtractor.ts`)
- Existing ApiError types (`client/src/types/api.types.ts`)

## Implementation Strategy

### Phase 1: Analysis
1. Search for try-catch blocks in all page files
2. Identify async operations in each page
3. Categorize pages by complexity

### Phase 2: Refactor Pages (by Priority)
1. **Simple CRUD Pages** (similar to Product.tsx):
   - Asset.tsx
   - Attribute.tsx
   - AttributeGroup.tsx
   - Locale.tsx
   - Store.tsx
   - StoreView.tsx

2. **Complex CRUD Pages**:
   - AttributeSet.tsx (has nested operations)
   - Category.tsx (has translations)
   - ProductAttributes.tsx (EAV operations)
   
3. **Detail Pages**:
   - ProductDetail.tsx (multiple async operations)

### Phase 3: Testing & Validation
1. Run ESLint on all modified files
2. Verify TypeScript compilation
3. Document changes

## Implementation Pattern (from Product.tsx)

### Step 1: Add Import
```typescript
import { asyncWrapper } from "@/utils/asyncWrapper";
```

### Step 2: Refactor Functions
```typescript
// Before
const handleCreate = async () => {
  try {
    await Service.create(data);
    await refetch();
    toast.success("Created successfully");
  } catch (err: unknown) {
    const error = err as Error;
    toast.error(`Failed: ${error.message}`);
  }
};

// After
const handleCreate = async () => {
  await asyncWrapper(async () => {
    await Service.create(data);
    await refetch();
    toast.success("Created successfully");
  });
};
```

## Success Criteria
- [ ] All try-catch blocks removed from page components
- [ ] All async operations wrapped with asyncWrapper
- [ ] Backend error messages displayed in toast notifications
- [ ] No TypeScript or ESLint errors
- [ ] Consistent error handling across all pages
- [ ] Pattern documented and reusable

## Potential Risks
1. **Risk**: Some pages may have complex error handling logic
   - **Mitigation**: Use custom error handler parameter in asyncWrapper
   
2. **Risk**: Breaking existing functionality
   - **Mitigation**: Test each page after refactoring
   
3. **Risk**: Missing some try-catch blocks
   - **Mitigation**: Use grep to search for all occurrences

## Testing Plan
1. Search for all try-catch blocks: `grep -r "try {" client/src/pages/`
2. Refactor each page one by one
3. Run ESLint after each file
4. Verify no compilation errors
5. Mark completed in task file

---

**Next Step**: Create task file with detailed checkpoints for each page
