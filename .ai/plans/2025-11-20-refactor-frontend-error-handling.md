# Plan: Refactor Frontend Error Handling with AsyncWrapper Pattern

**Date Created**: 2025-11-20
**Status**: Planning
**Estimated Complexity**: Medium

## Overview
Refactor the Product.tsx component (and potentially other frontend components) to eliminate try-catch blocks and use a cleaner async wrapper pattern. Ensure real-time error messages from the backend are properly displayed to the user.

## Requirements
- Remove all try-catch blocks from Product.tsx
- Create a frontend async wrapper utility similar to backend's asyncWrapper
- Extract error messages from backend API responses
- Display backend error messages in toast notifications
- Ensure all async operations are properly wrapped
- Maintain consistent error handling across the application

## Affected Components

### Frontend
- [ ] Utilities: Create new async wrapper utility
- [ ] Components: Update Product.tsx to use async wrapper
- [ ] Services: Ensure ProductService properly propagates errors
- [ ] API Layer: Enhance apiClient to extract error messages
- [ ] Interfaces: Create ApiError interface for type safety

### Backend (for reference)
- Already implements asyncWrapper in routes
- errorHandler middleware provides structured error responses
- Error format: `{ success: false, statusCode: number, message: string, error?: object }`

## Dependencies
- Existing backend error handling structure (errorHandler.js)
- Axios for API calls
- Sonner for toast notifications
- TypeScript for type safety

## Implementation Strategy

### Phase 1: Create Frontend Utilities
1. Create `asyncWrapper.ts` utility in `client/src/lib/`
   - Accept async function and optional error handler
   - Catch errors and extract backend error messages
   - Return properly typed results
   
2. Create `ApiError` interface in `client/src/types/`
   - Define structure for API error responses
   - Include `success`, `statusCode`, `message`, `error` fields

### Phase 2: Enhance API Client
1. Update `apiClient.ts` response interceptor
   - Extract error message from backend response
   - Create structured error object
   - Preserve original error for debugging

### Phase 3: Refactor Product Component
1. Remove all try-catch blocks
2. Wrap async operations with asyncWrapper
3. Use extracted error messages in toast notifications
4. Simplify error handling logic

### Phase 4: Update Service Layer (if needed)
1. Ensure services properly propagate errors
2. Don't swallow errors with try-catch
3. Let errors bubble up to components

## Implementation Order
1. Create TypeScript interfaces (ApiError)
2. Create asyncWrapper utility
3. Enhance apiClient error interceptor
4. Refactor Product.tsx component
5. Test all error scenarios
6. Document pattern for future use

## Code Examples

### AsyncWrapper Utility (Proposed)
```typescript
// client/src/lib/asyncWrapper.ts
export const asyncWrapper = <T>(
  fn: () => Promise<T>,
  onError?: (error: ApiError) => void
): Promise<T | null> => {
  return fn().catch((error) => {
    const apiError = extractApiError(error);
    if (onError) {
      onError(apiError);
    } else {
      toast.error(apiError.message);
    }
    return null;
  });
};
```

### Usage in Component (Proposed)
```typescript
// Before (with try-catch)
const handleDeleteProduct = async (id: number) => {
  try {
    await ProductService.remove(id);
    await refetchProducts();
    toast.success("Product deleted successfully");
  } catch (err: unknown) {
    const error = err as Error;
    toast.error(`Failed to delete product: ${error.message}`);
  }
};

// After (with asyncWrapper)
const handleDeleteProduct = async (id: number) => {
  await asyncWrapper(
    async () => {
      await ProductService.remove(id);
      await refetchProducts();
      toast.success("Product deleted successfully");
    }
  );
};
```

## Potential Risks
1. **Risk**: Breaking existing error handling
   - **Mitigation**: Test all error scenarios thoroughly
   
2. **Risk**: Loss of error context in some cases
   - **Mitigation**: Preserve full error object for debugging
   
3. **Risk**: Inconsistent error handling across components
   - **Mitigation**: Document pattern and create reusable utility

## Success Criteria
- [ ] No try-catch blocks in Product.tsx
- [ ] Backend error messages displayed in toast notifications
- [ ] All async operations properly wrapped
- [ ] Type-safe error handling with TypeScript
- [ ] No regressions in existing functionality
- [ ] Error handling is cleaner and more maintainable
- [ ] Pattern is documented for future components

## Testing Plan
1. Test successful operations (create, update, delete)
2. Test validation errors (400 status)
3. Test not found errors (404 status)
4. Test duplicate errors (409 status)
5. Test server errors (500 status)
6. Test network errors
7. Verify toast messages show backend error messages

## Future Enhancements
- Apply pattern to other components (Category, Attribute, etc.)
- Create custom hooks for common patterns (useAsyncAction)
- Add error boundaries for React component errors
- Implement retry logic for network errors
- Add loading states integration with asyncWrapper

---

**Next Step**: Create task file with detailed checkpoints
