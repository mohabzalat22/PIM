# Task: Fix Middlewares to Use Response Handler

**Status**: Completed  
**Created**: November 20, 2025  
**Completed**: November 20, 2025  
**Plan**: `.ai/plans/fix-middlewares-response-handler.md`

## Objective
Update all validation middleware files to use the pre-implemented response handler middleware instead of util message functions.

## Checkpoints

### Phase 1: Product Related Middlewares
- [x] **1.1** Update `validateProduct.js` - Remove errorMessage import and replace all calls
- [x] **1.2** Update `validateProductAsset.js` - Remove errorMessage import and replace all calls
- [x] **1.3** Update `validateProductAttribute.js` - Remove errorMessage import and replace all calls
- [x] **1.4** Update `validateProductCategory.js` - Remove errorMessage import and replace all calls

### Phase 2: Attribute Related Middlewares
- [x] **2.1** Update `validateAttribute.js` - Remove errorMessage import and replace all calls
- [x] **2.2** Update `validateAttributeSet.js` - Remove errorMessage import and replace all calls

### Phase 3: Category Related Middlewares
- [x] **3.1** Update `validateCategory.js` - Remove errorMessage import and replace all calls
- [x] **3.2** Update `validateCategoryTranslation.js` - Remove errorMessage import and replace all calls

### Phase 4: Store Related Middlewares
- [x] **4.1** Update `validateStore.js` - Remove errorMessage import and replace all calls
- [x] **4.2** Update `validateStoreView.js` - Remove errorMessage import and replace all calls
- [x] **4.3** Update `validateLocale.js` - Remove errorMessage import and replace all calls

### Phase 5: Asset Middleware
- [x] **5.1** Update `validateAsset.js` - Remove errorMessage import and replace all calls

### Phase 6: Verification
- [x] **6.1** Verify all files compile without import errors
- [x] **6.2** Check that all response methods are correctly mapped
- [x] **6.3** Ensure consistent status codes across all validations

## Implementation Notes

### Response Method Mapping
```javascript
// OLD
res.json(errorMessage("message", 500, error))
// NEW
res.error("message", 500, error)

// OLD
res.json(errorMessage("message", 404))
// NEW
res.notFound("message")

// OLD
res.json(errorMessage("message", 400))
// NEW
res.badRequest("message")

// OLD
res.json(errorMessage("message", 409))
// NEW
res.error("message", 409)

// OLD
res.json(errorMessage("message"))
// NEW
res.error("message", 500)
```

### Files to Update
1. validateProduct.js
2. validateProductAsset.js
3. validateProductAttribute.js
4. validateProductCategory.js
5. validateAttribute.js
6. validateAttributeSet.js
7. validateCategory.js
8. validateCategoryTranslation.js
9. validateStore.js
10. validateStoreView.js
11. validateLocale.js
12. validateAsset.js

## Completion Criteria
- [x] All errorMessage imports removed
- [x] All res.json(errorMessage(...)) calls replaced with res.* methods
- [x] No compilation errors
- [x] Response formats remain consistent
- [x] Status codes preserved

## Summary

Successfully updated all 12 validation middleware files to use the pre-implemented response handler middleware instead of util message functions. All `errorMessage` imports have been removed and all error responses now use the appropriate response helper methods:

- `res.error(msg, statusCode, error)` - For general errors (500) and conflicts (409)
- `res.notFound(msg)` - For 404 Not Found errors
- `res.badRequest(msg, error)` - For 400 Bad Request errors

All files have been successfully updated and are ready for use.
