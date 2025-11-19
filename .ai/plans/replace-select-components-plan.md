# Implementation Plan: Replace Primitive Select Components

**Created**: November 19, 2025  
**Status**: Pending Approval  
**Priority**: Medium

## Overview
Replace all instances of shadcn primitive Select components with custom `SelectType` and `MultiSelectType` components throughout the application pages and components.

## Scope Analysis

### Files Affected (11 files)
Based on grep search, the following files use primitive select from shadcn:

**Pages (8 files):**
1. `/client/src/pages/Category.tsx`
2. `/client/src/pages/Asset.tsx`
3. `/client/src/pages/AttributeSet.tsx`
4. `/client/src/pages/Attribute.tsx`
5. `/client/src/pages/AttributeGroup.tsx`
6. `/client/src/pages/ProductAttributes.tsx`
7. `/client/src/pages/Product.tsx`
8. `/client/src/pages/StoreView.tsx`

**Components (3 files):**
1. `/client/src/components/app/ProductAttributeForm.tsx`
2. `/client/src/components/app/ProductCategoryForm.tsx`
3. `/client/src/components/app/ProductAssetForm.tsx`

## Implementation Strategy

### 1. Analysis Phase
- Read each file to understand the current select implementation
- Identify which selects should be single-select (`SelectType`)
- Identify which selects should be multi-select (`MultiSelectType`)
- Map the current props to the new component props

### 2. Component Mapping

**From Primitive Select to SelectType:**
```tsx
// Before
<Select value={value} onValueChange={handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>

// After
<SelectType
  initialValue={value}
  options={[{value: "1", name: "Option 1"}]}
  onValueChange={handleChange}
/>
```

### 3. Implementation Order
1. Start with form components (smaller, isolated)
2. Move to page components (larger, more complex)
3. Test after each file to ensure no breakage

### 4. Validation Steps
- Ensure all select functionalities work correctly
- Verify options are properly formatted
- Test value changes and form submissions
- Run ESLint validation
- Check for any TypeScript errors

## Expected Changes Per File

Each file will require:
- Import statement update (remove primitive select, add SelectType/MultiSelectType)
- Transform select markup to component props
- Format options array with `{value, name}` structure
- Update any value handling logic if needed

## Risk Assessment
- **Low Risk**: Custom components are already tested and working
- **Medium Risk**: Need to ensure all select use cases are covered
- **Mitigation**: Incremental implementation with testing after each change

## Testing Checklist
- [ ] All selects render properly
- [ ] Single selection works correctly
- [ ] Multi-selection works correctly (if applicable)
- [ ] Default/initial values are set correctly
- [ ] OnChange handlers fire correctly
- [ ] Form submissions include correct values
- [ ] ESLint validation passes
- [ ] TypeScript compilation succeeds
- [ ] No console errors in browser

## Success Criteria
- All primitive Select imports removed
- All selects using custom components
- No regression in functionality
- Code passes linting and type checking
- Clean git diff showing intentional changes only

## Estimated Effort
- Analysis: 15 minutes
- Implementation: 1-2 hours
- Testing: 30 minutes
- **Total**: ~2-3 hours
