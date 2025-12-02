# Plan: Migrate Team to Workspace Backend Implementation

**Date**: December 1, 2025
**Author**: GitHub Copilot
**Type**: Backend Migration
**Status**: Pending Approval

## Overview

Migrate all backend team-related files to workspace terminology to match the frontend changes and updated Prisma schema. This includes controllers, models, routes, validation middleware, and route registration.

## Context

The user has:
1. Changed the frontend team page to a workspace page
2. Updated the Prisma schema from Team/TeamMember to Workspace/WorkspaceMember models
3. Needs the backend API to be updated to match this new terminology

## Current State Analysis

### Database Schema (✅ Already Updated)
- ✅ `Team` model → `Workspace` model
- ✅ `TeamMember` model → `WorkspaceMember` model  
- ✅ Relations properly configured
- ✅ WorkspaceInvite model added

### Backend Files (🔄 Need Migration)
- 🔄 `src/controllers/teamController.js` → `workspaceController.js`
- 🔄 `src/controllers/teamMemberController.js` → `workspaceMemberController.js`
- 🔄 `src/models/teamModel.js` → `workspaceModel.js`
- 🔄 `src/models/teamMemberModel.js` → `workspaceMemberModel.js`
- 🔄 `src/routes/teamRoute.js` → `workspaceRoute.js`
- 🔄 `src/routes/teamMemberRoute.js` → `workspaceMemberRoute.js`
- 🔄 `src/middlewares/validateTeam.js` → `validateWorkspace.js`
- 🔄 `src/middlewares/validateTeamMember.js` → `validateWorkspaceMember.js`
- 🔄 `src/routes/app/appRouter.js` (update import and route registration)

### API Endpoints (🔄 Need Migration)
- 🔄 `/api/teams` → `/api/workspaces`
- 🔄 `/api/team-members` → `/api/workspace-members`
- 🔄 `/api/team-members/team/:teamId` → `/api/workspace-members/workspace/:workspaceId`
- 🔄 `/api/team-members/user/:userId` → `/api/workspace-members/user/:userId`

## Implementation Strategy

### Phase 1: Models (Data Access Layer)
1. **Migrate `teamModel.js` → `workspaceModel.js`**:
   - Update all Prisma model references from `team` to `workspace`
   - Update function names: `findAll`, `findById`, `create`, `update`, `deleteById`
   - Update include relations: `teamMembers` → `workspaceMembers`
   - Update filter parameters and search logic

2. **Migrate `teamMemberModel.js` → `workspaceMemberModel.js`**:
   - Update Prisma model references from `teamMember` to `workspaceMember`
   - Update function names: `findByTeam` → `findByWorkspace`, etc.
   - Update include relations: `team` → `workspace`
   - Update filter parameters: `teamId` → `workspaceId`

### Phase 2: Validation Middleware
1. **Migrate `validateTeam.js` → `validateWorkspace.js`**:
   - Update validation function names
   - Update error messages to reference "workspace" instead of "team"
   - Maintain same validation logic and Zod schemas

2. **Migrate `validateTeamMember.js` → `validateWorkspaceMember.js`**:
   - Update validation function names
   - Update field references: `teamId` → `workspaceId`
   - Update error messages to reference "workspace member" instead of "team member"

### Phase 3: Controllers (Business Logic)
1. **Migrate `teamController.js` → `workspaceController.js`**:
   - Update function names: `getTeams` → `getWorkspaces`, `getTeam` → `getWorkspace`, etc.
   - Update model imports and function calls
   - Update success/error messages to reference "workspace"
   - Update filter parameters: handle `workspaceId` instead of `teamId`

2. **Migrate `teamMemberController.js` → `workspaceMemberController.js`**:
   - Update function names: `getTeamMembers` → `getWorkspaceMembers`, `getMembersByTeam` → `getMembersByWorkspace`, etc.
   - Update model imports and function calls
   - Update parameter extraction: `teamId` → `workspaceId`
   - Update success/error messages

### Phase 4: Routes
1. **Migrate `teamRoute.js` → `workspaceRoute.js`**:
   - Update controller imports
   - Update validation middleware imports
   - Update route handler function names
   - Keep same route structure but update function references

2. **Migrate `teamMemberRoute.js` → `workspaceMemberRoute.js`**:
   - Update controller imports
   - Update validation middleware imports
   - Update route endpoints: `/team/:teamId` → `/workspace/:workspaceId`
   - Update route handler function names

### Phase 5: Route Registration
1. **Update `appRouter.js`**:
   - Update import statements to reference new workspace files
   - Update route registration: `/teams` → `/workspaces`, `/team-members` → `/workspace-members`

## File Renaming Strategy

### Step 1: Create new workspace files
- Copy existing team files with new workspace names
- Update all internal references and function names
- Update Prisma model references

### Step 2: Update route registration
- Update imports in appRouter.js
- Update route paths

### Step 3: Clean up old files
- Remove old team files after successful migration

## API Endpoint Changes

| Current Endpoint | New Endpoint | Controller Function |
|-----------------|--------------|-------------------|
| `GET /api/teams` | `GET /api/workspaces` | `getWorkspaces` |
| `GET /api/teams/:id` | `GET /api/workspaces/:id` | `getWorkspace` |
| `POST /api/teams` | `POST /api/workspaces` | `createWorkspace` |
| `PUT /api/teams/:id` | `PUT /api/workspaces/:id` | `updateWorkspace` |
| `DELETE /api/teams/:id` | `DELETE /api/workspaces/:id` | `deleteWorkspace` |
| `GET /api/team-members` | `GET /api/workspace-members` | `getWorkspaceMembers` |
| `GET /api/team-members/:id` | `GET /api/workspace-members/:id` | `getWorkspaceMember` |
| `GET /api/team-members/team/:teamId` | `GET /api/workspace-members/workspace/:workspaceId` | `getMembersByWorkspace` |
| `GET /api/team-members/user/:userId` | `GET /api/workspace-members/user/:userId` | `getWorkspacesByUser` |
| `POST /api/team-members` | `POST /api/workspace-members` | `createWorkspaceMember` |
| `PUT /api/team-members/:id` | `PUT /api/workspace-members/:id` | `updateWorkspaceMember` |
| `DELETE /api/team-members/:id` | `DELETE /api/workspace-members/:id` | `deleteWorkspaceMember` |

## Validation and Testing Strategy

### Pre-Implementation Validation
- ✅ Verify Prisma schema is correctly updated
- ✅ Verify frontend has been updated to use workspace terminology
- ✅ Verify database migrations are complete

### Post-Implementation Validation
- 🔄 Run ESLint to check code quality
- 🔄 Verify all imports/exports are correct
- 🔄 Test API endpoints manually or with existing tests
- 🔄 Ensure error handling follows existing patterns

## Risk Assessment

### Low Risk
- ✅ Schema is already updated and working
- ✅ Following existing code patterns and conventions
- ✅ No new functionality being added, just renaming

### Medium Risk
- ⚠️ Multiple files being renamed simultaneously
- ⚠️ Route endpoints changing (frontend needs to match)
- ⚠️ Import path updates across multiple files

### Mitigation Strategies
- 🛡️ Follow step-by-step implementation with checkpoints
- 🛡️ Update one file at a time and verify imports
- 🛡️ Run ESLint after each major change
- 🛡️ Keep backup of original files until migration confirmed working

## Success Criteria

1. ✅ All team-related backend files renamed to workspace equivalents
2. ✅ All function names updated to workspace terminology
3. ✅ All API endpoints updated to workspace paths
4. ✅ All Prisma model references updated correctly
5. ✅ Route registration updated in appRouter.js
6. ✅ ESLint validation passes
7. ✅ No import/export errors
8. ✅ Success/error messages reference workspace terminology

## Dependencies

### Prerequisites
- ✅ Prisma schema updated with Workspace and WorkspaceMember models
- ✅ Database migration completed
- ✅ Frontend updated to use workspace terminology

### Post-Implementation Requirements
- 🔄 Frontend API calls need to use new workspace endpoints
- 🔄 Any existing data needs to work with new API structure

## Implementation Notes

### Code Conventions to Follow
- Use existing error handling patterns with `asyncWrapper`
- Use existing response helpers: `res.success()`, `res.error()`, etc.
- Follow existing naming conventions for controllers and models
- Maintain consistent validation patterns with Zod
- Use proper JSDoc comments for functions

### Key Pattern Examples

```javascript
// Model function names
export const findAll = async (skip, limit, filters) => { /* ... */ };
export const findById = async (id) => { /* ... */ };
export const create = async (data) => { /* ... */ };
export const update = async (id, data) => { /* ... */ };
export const deleteById = async (id) => { /* ... */ };

// Controller function names  
export const getWorkspaces = async (req, res) => { /* ... */ };
export const getWorkspace = async (req, res) => { /* ... */ };
export const createWorkspace = async (req, res) => { /* ... */ };
export const updateWorkspace = async (req, res) => { /* ... */ };
export const deleteWorkspace = async (req, res) => { /* ... */ };

// Route registration
router.get("/", asyncWrapper(getWorkspaces));
router.get("/:id", asyncWrapper(getWorkspace));
router.post("/", validateWorkspaceCreation, asyncWrapper(createWorkspace));
```

## Estimated Time

- **Phase 1 (Models)**: 20 minutes
- **Phase 2 (Validation)**: 15 minutes  
- **Phase 3 (Controllers)**: 25 minutes
- **Phase 4 (Routes)**: 15 minutes
- **Phase 5 (Registration)**: 10 minutes
- **Validation & Testing**: 15 minutes

**Total Estimated Time**: ~100 minutes (1 hour 40 minutes)

---

## Reference Files

### Current Team Files (to be migrated)
- `src/controllers/teamController.js`
- `src/controllers/teamMemberController.js` 
- `src/models/teamModel.js`
- `src/models/teamMemberModel.js`
- `src/routes/teamRoute.js`
- `src/routes/teamMemberRoute.js`
- `src/middlewares/validateTeam.js`
- `src/middlewares/validateTeamMember.js`
- `src/routes/app/appRouter.js`

### Target Workspace Files (to be created)
- `src/controllers/workspaceController.js`
- `src/controllers/workspaceMemberController.js`
- `src/models/workspaceModel.js` 
- `src/models/workspaceMemberModel.js`
- `src/routes/workspaceRoute.js`
- `src/routes/workspaceMemberRoute.js`
- `src/middlewares/validateWorkspace.js`
- `src/middlewares/validateWorkspaceMember.js`
- `src/routes/app/appRouter.js` (updated)

### Example Patterns
- `src/controllers/productController.js` (for controller patterns)
- `src/models/productModel.js` (for model patterns)
- `src/routes/productRoute.js` (for route patterns)
- `src/middlewares/validateProduct.js` (for validation patterns)

---

**Status**: Ready for implementation after user approval
**Next Steps**: Create implementation task with detailed checkpoints