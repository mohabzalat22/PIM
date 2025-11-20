# Frontend Error Handling Pattern

This document describes the standard error handling pattern for the XStore frontend application.

## Overview

Instead of using try-catch blocks in component code, we use an `asyncWrapper` utility that:
- Automatically catches errors from async operations
- Extracts backend error messages from API responses
- Displays error messages in toast notifications
- Provides type-safe error handling with TypeScript

## Quick Start

### 1. Import the asyncWrapper

```typescript
import { asyncWrapper } from "@/utils/asyncWrapper";
```

### 2. Wrap Your Async Operations

**Before (with try-catch):**
```typescript
const handleDelete = async (id: number) => {
  try {
    await ProductService.remove(id);
    await refetchProducts();
    toast.success("Product deleted successfully");
  } catch (err: unknown) {
    const error = err as Error;
    toast.error(`Failed to delete product: ${error.message}`);
  }
};
```

**After (with asyncWrapper):**
```typescript
const handleDelete = async (id: number) => {
  await asyncWrapper(async () => {
    await ProductService.remove(id);
    await refetchProducts();
    toast.success("Product deleted successfully");
  });
};
```

## How It Works

### Backend Error Response Structure

The backend returns structured error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "This record already exists.",
  "error": {
    "name": "DuplicateError",
    "message": "The provided data conflicts with existing records"
  }
}
```

### Error Extraction

The `extractApiError` utility extracts the error message from:
- **Axios errors** (API responses) → Shows backend error message
- **Network errors** → Shows "Network error. Please check your connection."
- **Generic errors** → Shows error.message or fallback

### Automatic Toast Display

The `asyncWrapper` automatically:
1. Catches any errors thrown in the wrapped function
2. Extracts the error using `extractApiError`
3. Displays the error message in a toast notification
4. Returns `null` on error (so your code doesn't crash)

## Advanced Usage

### Custom Error Handling

If you need custom error handling instead of the default toast:

```typescript
const handleDelete = async (id: number) => {
  await asyncWrapper(
    async () => {
      await ProductService.remove(id);
      await refetchProducts();
      toast.success("Product deleted successfully");
    },
    (error) => {
      // Custom error handling
      console.error("Delete failed:", error);
      
      if (error.statusCode === 404) {
        toast.error("Product not found. It may have been deleted already.");
      } else {
        toast.error(`Failed to delete: ${error.message}`);
      }
    }
  );
};
```

### Type-Safe Error Objects

The error object passed to custom handlers is fully typed:

```typescript
interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error?: {
    name: string;
    message: string | object;
  };
}
```

## Benefits

✅ **Cleaner Code** - No try-catch blocks cluttering your components  
✅ **Real Backend Messages** - Users see actual error messages from the API  
✅ **Type Safety** - Full TypeScript support with proper interfaces  
✅ **Consistency** - Same pattern as backend asyncWrapper  
✅ **Maintainability** - Centralized error handling logic  
✅ **Flexibility** - Can override with custom error handlers when needed  

## Common Error Messages

Here are the typical backend error messages users will see:

| Scenario | Message |
|----------|---------|
| Duplicate SKU | "This record already exists." |
| Not Found | "Record not found." |
| Invalid Reference | "Referenced record does not exist." |
| Validation Error | "Invalid input data." |
| Network Error | "Network error. Please check your connection." |
| Server Error | "An unexpected error occurred." |

## Migration Guide

To migrate existing code to this pattern:

1. **Import asyncWrapper**
   ```typescript
   import { asyncWrapper } from "@/utils/asyncWrapper";
   ```

2. **Remove try-catch blocks**
   - Delete `try {` and `}` lines
   - Delete `catch (err: unknown) { ... }` blocks
   - Delete error type assertions like `const error = err as Error;`
   - Delete manual error toast messages

3. **Wrap with asyncWrapper**
   ```typescript
   // Wrap the entire async operation
   await asyncWrapper(async () => {
     // Your code here
   });
   ```

4. **Keep success toasts**
   - Success toasts stay inside the wrapper
   - They only show when the operation succeeds

## Files Reference

- **Types**: `client/src/types/api.types.ts`
- **Error Extractor**: `client/src/utils/errorExtractor.ts`
- **Async Wrapper**: `client/src/utils/asyncWrapper.ts`
- **Example Component**: `client/src/pages/Product.tsx`

## Future Enhancements

Potential improvements to consider:

- Create `useAsyncAction` hook that wraps asyncWrapper
- Add retry logic for network errors
- Add loading state management to asyncWrapper
- Create async wrapper for bulk operations (Promise.all)
- Add error boundaries for React component errors

---

**Last Updated**: 2025-11-20  
**Pattern Status**: ✅ Active (use in all new components)
