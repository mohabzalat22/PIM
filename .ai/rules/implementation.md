# Implementation Rules

This document defines the structured workflow for implementing features and fixes in the xstore project.

## Workflow Overview

```
1. Receive Request → 2. Create Plan → 3. Create Task → 4. Get Validation → 5. Implement → 6. Mark Checkpoints → 7. Complete
```

---

## Step 1: Understand & Analyze Request

When receiving a new feature request or bug fix:

1. **Analyze Requirements**
   - What is being requested?
   - Which parts of the system are affected?
   - Are there any dependencies or prerequisites?

2. **Identify Scope**
   - Backend changes (API routes, controllers, models)
   - Database changes (Prisma schema)
   - Validation changes (middleware)
   - Frontend changes (React components)

---

## Step 2: Create Implementation Plan

Create a new plan file in `.ai/plans/` directory.

### Plan File Naming Convention
```
YYYY-MM-DD-feature-name.md
```
Example: `2025-11-17-add-product-variants.md`

### Plan Template

```markdown
# Plan: [Feature/Fix Name]

**Date Created**: YYYY-MM-DD
**Status**: Planning
**Estimated Complexity**: Low | Medium | High

## Overview
Brief description of what needs to be implemented.

## Requirements
- Requirement 1
- Requirement 2
- Requirement 3

## Affected Components

### Backend
- [ ] Models: List affected models
- [ ] Controllers: List affected controllers
- [ ] Routes: List affected routes
- [ ] Middleware: List affected middleware
- [ ] Validation: List validation changes

### Database
- [ ] Schema changes needed
- [ ] Migration required
- [ ] Seed data updates

### Frontend (if applicable)
- [ ] Components: List affected components
- [ ] API calls: List new/modified API calls
- [ ] State management: Context/hooks changes

## Dependencies
- List any dependencies or prerequisites
- External packages needed
- Related features

## Implementation Strategy
1. Step-by-step approach
2. Order of implementation
3. Testing strategy

## Potential Risks
- Risk 1: Description and mitigation
- Risk 2: Description and mitigation

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

---

## Step 3: Create Task with Checkpoints

After creating the plan, create a task file in `.ai/tasks/` directory.

### Task File Naming Convention
```
YYYY-MM-DD-feature-name.md
```
Example: `2025-11-17-add-product-variants.md`

### Task Template

```markdown
# Task: [Feature/Fix Name]

**Date Created**: YYYY-MM-DD
**Status**: Pending Validation
**Related Plan**: [Link to plan file]
**Assigned**: AI Assistant

## Task Description
Clear description of what needs to be done.

## Checkpoints

### Phase 1: Preparation
- [ ] **CP1.1**: Review existing code patterns
- [ ] **CP1.2**: Identify all files to be modified
- [ ] **CP1.3**: Check for breaking changes

### Phase 2: Database & Schema (if applicable)
- [ ] **CP2.1**: Update Prisma schema
- [ ] **CP2.2**: Create migration
- [ ] **CP2.3**: Update seed file
- [ ] **CP2.4**: Test migration

### Phase 3: Backend Implementation
- [ ] **CP3.1**: Create/update models
- [ ] **CP3.2**: Create/update controllers
- [ ] **CP3.3**: Create/update validation middleware
- [ ] **CP3.4**: Create/update routes
- [ ] **CP3.5**: Register routes in app.js

### Phase 4: Code Quality
- [ ] **CP4.1**: Run ESLint validation
- [ ] **CP4.2**: Fix all linting errors
- [ ] **CP4.3**: Verify imports and exports
- [ ] **CP4.4**: Check error handling
- [ ] **CP4.5**: Remove console.logs

### Phase 5: Frontend Implementation (if applicable)
- [ ] **CP5.1**: Create/update types/interfaces
- [ ] **CP5.2**: Create/update API service functions
- [ ] **CP5.3**: Create/update components
- [ ] **CP5.4**: Update context/state if needed
- [ ] **CP5.5**: Test UI integration

### Phase 6: Testing & Validation
- [ ] **CP6.1**: Test all API endpoints
- [ ] **CP6.2**: Verify validation rules work
- [ ] **CP6.3**: Test error scenarios
- [ ] **CP6.4**: Check database operations
- [ ] **CP6.5**: Verify no regressions

### Phase 7: Documentation & Cleanup
- [ ] **CP7.1**: Update API documentation
- [ ] **CP7.2**: Add code comments where needed
- [ ] **CP7.3**: Update README if needed
- [ ] **CP7.4**: Clean up temporary files

## Files to Modify

### New Files
- `path/to/new/file1.js`
- `path/to/new/file2.js`

### Modified Files
- `path/to/existing/file1.js` - What changes
- `path/to/existing/file2.js` - What changes

## Validation Required

⚠️ **STOP - Requires User Validation**

Please review:
1. Are the checkpoints clear and complete?
2. Are all affected files identified?
3. Is the implementation approach correct?
4. Any missing requirements or concerns?

**Awaiting approval to proceed...**

---

## Implementation Notes
[Notes added during implementation]

## Completion Summary
[Summary added after completion]
```

---

## Step 4: Request User Validation

After creating the plan and task:

1. **Present to User**
   ```
   📋 Implementation Plan Created
   
   Plan: .ai/plans/YYYY-MM-DD-feature-name.md
   Task: .ai/tasks/YYYY-MM-DD-feature-name.md
   
   Please review the plan and task checkpoints.
   
   ⚠️ Waiting for your approval to proceed with implementation.
   
   Reply with:
   - "approved" or "proceed" to start implementation
   - "modify [details]" to request changes
   - "cancel" to stop
   ```

2. **Wait for Confirmation**
   - Do NOT proceed without user approval
   - Address any concerns or modifications requested
   - Update plan/task if needed

---

## Step 5: Implementation

Once approved, begin implementation following the checkpoints:

### Implementation Rules

1. **Follow Checkpoint Order**
   - Work through checkpoints sequentially
   - Mark each checkpoint as completed: `- [x]`
   - Add notes if deviating from plan

2. **After Each Phase**
   - Update task file with completed checkpoints
   - Note any issues or changes
   - Run validation if applicable

3. **Code Quality Standards**
   - Follow existing code patterns
   - Run ESLint: `npm run lint:fix`
   - Ensure all imports are correct
   - Add proper error handling
   - Use Zod for validation schemas

4. **Communication**
   - Report progress after each phase
   - Mention any blockers or issues
   - Ask for clarification if needed

---

## Step 6: Mark Checkpoints as Completed

As you complete each checkpoint:

1. **Update Task File**
   ```markdown
   - [x] **CP3.1**: Create/update models ✅ Completed
   - [x] **CP3.2**: Create/update controllers ✅ Completed
   - [ ] **CP3.3**: Create/update validation middleware (In Progress)
   ```

2. **Add Implementation Notes**
   ```markdown
   ## Implementation Notes
   
   ### Phase 3 - Backend Implementation
   - CP3.1: Created ProductVariantModel.js with findAll and create methods
   - CP3.2: Implemented productVariantController.js with CRUD operations
   - CP3.3: In progress - creating validation middleware
   ```

3. **Report Progress**
   ```
   ✅ Phase 3 - Backend Implementation (60% complete)
   
   Completed:
   - Models created and tested
   - Controllers implemented
   
   In Progress:
   - Validation middleware
   
   Next:
   - Routes registration
   - ESLint validation
   ```

---

## Step 7: Completion & Summary

When all checkpoints are complete:

1. **Final Validation**
   - [ ] All checkpoints marked complete
   - [ ] ESLint passes with no errors
   - [ ] No console.log statements remain
   - [ ] All files properly formatted
   - [ ] Error handling in place

2. **Update Task Status**
   ```markdown
   **Status**: ✅ Completed
   **Completion Date**: YYYY-MM-DD
   
   ## Completion Summary
   
   Successfully implemented [feature name].
   
   ### Changes Made:
   - Created 5 new files
   - Modified 3 existing files
   - Added database migration
   - Added validation middleware
   
   ### Files Changed:
   - src/models/productVariantModel.js (new)
   - src/controllers/productVariantController.js (new)
   - src/routes/productVariantRoute.js (new)
   - src/app.js (modified - registered new route)
   
   ### Testing:
   - All API endpoints tested
   - Validation rules verified
   - Error scenarios handled
   
   ### Notes:
   - No breaking changes
   - Backward compatible
   - Ready for production
   ```

3. **Update Plan Status**
   ```markdown
   **Status**: ✅ Completed
   **Completion Date**: YYYY-MM-DD
   ```

4. **Final Report to User**
   ```
   ✅ Implementation Complete!
   
   Task: [Feature Name]
   All checkpoints completed successfully.
   
   Summary:
   - X new files created
   - Y files modified
   - ESLint validation passed
   - No errors or warnings
   
   The feature is ready for testing and deployment.
   ```

---

## Quick Reference

### Command Checklist

Before starting any implementation:
```bash
# 1. Create plan file
touch .ai/plans/$(date +%Y-%m-%d)-feature-name.md

# 2. Create task file
touch .ai/tasks/$(date +%Y-%m-%d)-feature-name.md

# 3. After implementation, validate
npm run lint:fix
```

### Checkpoint Status Indicators

- `[ ]` - Not started
- `[~]` - In progress
- `[x]` - Completed
- `[!]` - Blocked/Issue

### Status Values

- **Planning** - Creating plan and task
- **Pending Validation** - Awaiting user approval
- **In Progress** - Implementation underway
- **Testing** - Implementation complete, testing
- **Completed** - All done
- **Blocked** - Cannot proceed
- **Cancelled** - Request cancelled

---

## Example Workflow

```
User: "Add support for product variants"

AI: 
1. Creates .ai/plans/2025-11-17-add-product-variants.md
2. Creates .ai/tasks/2025-11-17-add-product-variants.md with checkpoints
3. Presents plan and asks for validation

User: "approved"

AI:
4. Works through checkpoints phase by phase
5. Updates task file after each phase
6. Reports progress
7. Marks checkpoints as completed
8. Runs final validation
9. Updates task status to "Completed"
10. Provides completion summary

```

---

## Notes

- Always create plan BEFORE task
- Always get validation BEFORE implementation
- Always update checkpoints during implementation
- Always run ESLint before marking complete
- Always provide completion summary
- Never skip the validation step
- Never proceed without user approval
