# Plan: Fix Middlewares to Use Response Handler

## Goal
Replace all util message functions (`errorMessage`, `successMessage`) with the pre-implemented response handler middleware methods in all validation middleware files.

## Current State
- All validation middlewares in `/src/middlewares/` currently use `errorMessage()` from `../utils/message.js`
- Response helper middleware exists with standardized methods: `res.error()`, `res.badRequest()`, `res.notFound()`, etc.

## Proposed Changes

### Files to Modify
1. `validateProduct.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
2. `validateAttribute.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
3. `validateAttributeSet.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
4. `validateCategory.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
5. `validateCategoryTranslation.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
6. `validateLocale.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
7. `validateStore.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
8. `validateStoreView.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
9. `validateAsset.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
10. `validateProductAsset.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
11. `validateProductAttribute.js` - Replace errorMessage with res.error/res.notFound/res.badRequest
12. `validateProductCategory.js` - Replace errorMessage with res.error/res.notFound/res.badRequest

### Mapping Strategy
- `errorMessage(msg, 500, error)` → `res.error(msg, 500, error)`
- `errorMessage(msg, 404)` → `res.notFound(msg)`
- `errorMessage(msg, 400)` → `res.badRequest(msg)`
- `errorMessage(msg, 409)` → `res.error(msg, 409)`
- `errorMessage(msg)` (no status) → `res.error(msg, 500)`

### Steps
1. Remove import statement for `errorMessage` from each file
2. Replace all `res.json(errorMessage(...))` calls with appropriate `res.*()` methods
3. Maintain the same message text and error details
4. Ensure status codes match the original implementation

## Benefits
- Consistent response format across all endpoints
- Better separation of concerns
- Cleaner code without utility imports
- Leverages middleware pattern correctly

## Risk Assessment
- **Low Risk**: Only changing how responses are sent, not the logic
- All response formats remain the same
- No database or business logic changes

## Testing Plan
1. Verify all middlewares compile without errors
2. Test validation scenarios to ensure proper error responses
3. Check that HTTP status codes are correct
