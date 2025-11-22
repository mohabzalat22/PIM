# Plan: Update User Table Backend Implementation

**Date**: November 22, 2025  
**Author**: GitHub Copilot  
**Status**: Pending Approval

## Overview
Update backend files (model, controller, routes, middleware) to support the modified User schema which now includes `clerkId` as a unique identifier.

## Schema Changes Detected
The User model in `schema.prisma` now includes:
- `clerkId`: String (unique) - Clerk authentication identifier
- `name`: String - User's name
- `email`: String (unique) - User's email
- Relations to `teamMembers`

## Required Changes

### 1. User Model (`src/models/userModel.js`)
**Changes needed:**
- Add `findByClerkId(clerkId)` function to query users by Clerk ID
- Ensure all existing functions handle the `clerkId` field appropriately

**Estimated effort**: Low  
**Files affected**: 1

### 2. Validation Middleware (`src/middlewares/validateUser.js`)
**Changes needed:**
- Update `userSchema` to include `clerkId` as a required field
- Add validation to ensure `clerkId` is unique during user creation
- Update `userUpdateSchema` to optionally accept `clerkId` updates
- Add validation to check `clerkId` uniqueness during updates

**Estimated effort**: Medium  
**Files affected**: 1

### 3. User Controller (`src/controllers/userController.js`)
**Changes needed:**
- Import new `findByClerkId` function
- Optionally add `getUserByClerkId` controller if needed for API routes
- Ensure existing controllers handle `clerkId` in request/response bodies

**Estimated effort**: Low  
**Files affected**: 1

### 4. User Routes (`src/routes/userRoute.js`)
**Changes needed:**
- Optionally add route for `GET /clerk/:clerkId` to fetch user by Clerk ID
- Ensure existing routes remain functional

**Estimated effort**: Low  
**Files affected**: 1

## Implementation Strategy

### Phase 1: Model Layer
1. Add `findByClerkId` function to userModel.js
2. Test database queries

### Phase 2: Validation Layer
1. Update Zod schemas to include `clerkId`
2. Add uniqueness validation for `clerkId`
3. Handle edge cases (clerk ID conflicts)

### Phase 3: Controller Layer
1. Import new model functions
2. Add new controller function (if needed)
3. Update existing controllers to handle `clerkId`

### Phase 4: Route Layer
1. Add new route for Clerk ID lookup (optional)
2. Test all endpoints

### Phase 5: Validation
1. Run ESLint: `npm run lint:fix`
2. Test all CRUD operations
3. Verify unique constraint handling

## Risk Assessment
- **Low Risk**: Adding new fields and functions
- **Medium Risk**: Validation changes might break existing flows
- **Mitigation**: Thorough testing of create/update operations

## Testing Checklist
- [ ] Create user with valid clerkId
- [ ] Attempt to create duplicate clerkId (should fail)
- [ ] Update user with new clerkId
- [ ] Attempt to update to existing clerkId (should fail)
- [ ] Fetch user by clerkId
- [ ] Verify all existing endpoints still work
- [ ] Run ESLint validation

## Dependencies
- Prisma Client must be regenerated after schema changes: `npx prisma generate`
- Database migration must be run: `npx prisma migrate dev`

## Rollback Plan
If issues occur:
1. Revert code changes via git
2. Roll back database migration if needed
3. Regenerate Prisma Client

## Success Criteria
- [ ] All User model functions handle `clerkId`
- [ ] Validation properly enforces `clerkId` uniqueness
- [ ] All CRUD operations work correctly
- [ ] ESLint passes with no errors
- [ ] Existing functionality remains intact
