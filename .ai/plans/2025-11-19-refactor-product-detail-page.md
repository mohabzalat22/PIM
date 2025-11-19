# Plan: Refactor ProductDetail.tsx Page

**Date Created**: 2025-11-19
**Status**: Planning
**Estimated Complexity**: Medium

## Overview
Refactor the ProductDetail.tsx page to improve code organization, reusability, and maintainability by:
1. Using existing components from `components/app` directory (DeleteConfirmDialog, EntityDialog)
2. Creating new reusable components for repeated UI patterns
3. Using API services instead of direct axios calls
4. Following project conventions and code quality standards

## Requirements
- Replace custom delete dialogs with existing `DeleteConfirmDialog` component
- Use existing `EntityDialog` for add/edit operations
- Extract repeated UI patterns into reusable components
- Ensure all API calls use service layer (already implemented)
- Maintain all existing functionality
- Follow TypeScript best practices

## Affected Components

### Frontend
- [x] Pages: `ProductDetail.tsx` (main file to refactor)
- [ ] New Components to Create:
  - `ProductOverviewCard.tsx` - Display product basic info
  - `ProductAttributeForm.tsx` - Form for adding product attributes
  - `ProductCategoryForm.tsx` - Form for adding categories
  - `ProductAssetForm.tsx` - Form for adding assets
  - `AttributeSetDisplay.tsx` - Display attribute set with groups
  - `ProductAttributesList.tsx` - Display product attributes table
  - `ProductCategoriesList.tsx` - Display product categories list
  - `ProductAssetsList.tsx` - Display product assets grid
  - `AssetViewerDialog.tsx` - View asset details
- [x] Components to Use:
  - `DeleteConfirmDialog` - For all delete confirmations
  - `EntityDialog` - For add/edit operations
  - `SelectType` - For dropdown selections
  - `SkeletonImage` - For asset loading
- [x] Services: Already using service layer (ProductService, AttributeService, etc.)

### Backend
- No backend changes needed

### Database
- No database changes needed

## Dependencies
- Existing components in `components/app`
- Existing UI components from shadcn/ui
- Existing service layer functions
- No new packages required

## Implementation Strategy
1. **Phase 1: Extract Form Components**
   - Create `ProductAttributeForm.tsx` for attribute addition form
   - Create `ProductCategoryForm.tsx` for category addition form
   - Create `ProductAssetForm.tsx` for asset addition form

2. **Phase 2: Extract Display Components**
   - Create `ProductOverviewCard.tsx` for basic product info display
   - Create `AttributeSetDisplay.tsx` for attribute set visualization
   - Create `ProductAttributesList.tsx` for attributes table
   - Create `ProductCategoriesList.tsx` for categories list
   - Create `ProductAssetsList.tsx` for assets grid
   - Create `AssetViewerDialog.tsx` for viewing asset details

3. **Phase 3: Replace Dialog Components**
   - Replace custom attribute delete dialogs with `DeleteConfirmDialog`
   - Replace custom category delete dialogs with `DeleteConfirmDialog`
   - Replace custom asset delete dialogs with `DeleteConfirmDialog`
   - Use `EntityDialog` for edit product form
   - Use `EntityDialog` for add attribute form
   - Use `EntityDialog` for add category form
   - Use `EntityDialog` for add asset form

4. **Phase 4: Refactor Main Component**
   - Update `ProductDetail.tsx` to use new components
   - Clean up state management
   - Simplify event handlers
   - Improve code readability

5. **Phase 5: Testing**
   - Test all CRUD operations (view, add, edit, delete)
   - Verify all dialogs work correctly
   - Check responsive design
   - Validate error handling

## Potential Risks
- **Risk 1**: Breaking existing functionality during refactoring
  - **Mitigation**: Test each component individually and incrementally integrate
- **Risk 2**: Type mismatches with new component props
  - **Mitigation**: Ensure all interfaces are properly defined and exported
- **Risk 3**: Missing edge cases in extracted components
  - **Mitigation**: Review original code carefully and handle all conditions

## Success Criteria
- [x] All existing functionality works as before
- [x] Code is more modular and reusable
- [x] Uses existing `DeleteConfirmDialog` and `EntityDialog` components
- [x] No direct axios usage (already using services)
- [x] All new components are in `components/app` directory
- [x] Follows TypeScript best practices
- [x] ESLint validation passes
- [x] Code is easier to read and maintain
