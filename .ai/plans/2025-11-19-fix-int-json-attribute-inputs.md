# Plan: Fix INT and JSON Attribute Input Fields

**Date Created**: 2025-11-19
**Status**: Planning
**Estimated Complexity**: Low

## Overview
Fix the Add Attribute dialog in ProductDetail.tsx to properly display input fields for INT and JSON data types. Currently, when selecting an attribute with these types, no input field appears for entering the value.

## Requirements
- Display input field for INTEGER data type attributes
- Display textarea field for JSON data type attributes
- Properly parse and validate JSON input
- Ensure INT values are converted to numbers before submission
- Reset form including new valueJson field

## Affected Components

### Frontend
- [x] Components: `ProductDetail.tsx` (Add Attribute dialog section)
- [x] State management: Add `valueJson` to `attributeFormData` state
- [x] Form handling: Update `handleAddAttribute` to handle JSON type
- [x] Form reset: Include `valueJson: ''` in form reset

### Backend
- [ ] No backend changes needed (already supports INT and JSON types)

### Database
- [ ] No schema changes needed (valueInt and valueJson columns already exist)

## Dependencies
- None - all required infrastructure is already in place

## Implementation Strategy

1. **Update State** (Line ~148)
   - Add `valueJson: ''` to `attributeFormData` state initialization

2. **Update Input Rendering** (Lines ~780-860)
   - The INTEGER case already exists but may need verification
   - Add a new case for 'JSON' data type with textarea input
   - Include JSON validation hint in the UI

3. **Update handleAddAttribute** (Lines ~256-305)
   - The INTEGER case already exists but verify it's working correctly
   - Add case for 'JSON' type to parse and validate JSON string
   - Handle JSON parsing errors gracefully with user-friendly messages

4. **Update Form Reset** (Line ~295)
   - Add `valueJson: ''` to the reset object in handleAddAttribute

5. **Testing**
   - Test adding INT attributes with positive, negative, and zero values
   - Test adding JSON attributes with valid JSON objects and arrays
   - Test JSON validation with invalid JSON to ensure proper error handling
   - Verify form resets properly after successful submission

## Potential Risks
- **Risk 1**: Invalid JSON input causing errors
  - Mitigation: Add try-catch with JSON.parse() and show validation error to user
  
- **Risk 2**: Type mismatch when sending to backend
  - Mitigation: Ensure valueJson is sent as parsed JSON object, not string

## Success Criteria
- [x] INT attribute input field appears when selecting INTEGER type attribute
- [x] JSON attribute textarea appears when selecting JSON type attribute
- [x] Valid JSON strings are successfully parsed and saved
- [x] Invalid JSON strings show user-friendly error message
- [x] Form resets properly including new valueJson field
- [x] ESLint validation passes with no errors
