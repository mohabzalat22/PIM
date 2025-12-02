# Task: Migrate Team to Workspace Backend Implementation

**Date**: December 1, 2025  
**Plan Reference**: [2025-12-01-migrate-team-to-workspace-backend.md](../plans/2025-12-01-migrate-team-to-workspace-backend.md)
**Status**: Pending Approval  
**Implementation Time**: ~100 minutes

## Task Overview

Migrate all backend team-related files to workspace terminology to align with the updated Prisma schema and frontend changes. This includes renaming files, updating function names, and changing API endpoints from team/team-member to workspace/workspace-member.

## Scope

### Files to Migrate (8 files)
1. Models: `teamModel.js` → `workspaceModel.js`, `teamMemberModel.js` → `workspaceMemberModel.js`
2. Controllers: `teamController.js` → `workspaceController.js`, `teamMemberController.js` → `workspaceMemberController.js`
3. Routes: `teamRoute.js` → `workspaceRoute.js`, `teamMemberRoute.js` → `workspaceMemberRoute.js`
4. Validation: `validateTeam.js` → `validateWorkspace.js`, `validateTeamMember.js` → `validateWorkspaceMember.js`
5. Registration: Update `appRouter.js` with new imports and routes

### API Endpoints to Change
- `/api/teams` → `/api/workspaces`
- `/api/team-members` → `/api/workspace-members`

---

## Checkpoints

### Phase 1: Models (Data Access Layer)

#### Checkpoint 1.1: Create Workspace Model ⏱️ 10 min
- [ ] Create `src/models/workspaceModel.js` based on `teamModel.js`
- [ ] Update Prisma model reference: `prisma.team` → `prisma.workspace`
- [ ] Update function names: keep same pattern (`findAll`, `findById`, `create`, `update`, `deleteById`)
- [ ] Update include relations: `teamMembers` → `workspaceMembers` (or `members`)
- [ ] Update filter logic for workspace search and sorting
- [ ] Test imports and exports work correctly

**Expected Changes:**
```javascript
// Before: teamModel.js
const [teams, total] = await Promise.all([
  prisma.team.findMany({
    include: { teamMembers: true }
  }),
  prisma.team.count()
]);

// After: workspaceModel.js  
const [workspaces, total] = await Promise.all([
  prisma.workspace.findMany({
    include: { members: true }
  }),
  prisma.workspace.count()
]);
```

---

#### Checkpoint 1.2: Create Workspace Member Model ⏱️ 10 min
- [ ] Create `src/models/workspaceMemberModel.js` based on `teamMemberModel.js`
- [ ] Update Prisma model reference: `prisma.teamMember` → `prisma.workspaceMember`
- [ ] Update function names: `findByTeam` → `findByWorkspace`, `findByUser` → same
- [ ] Update include relations: `team` → `workspace`, `user` → same
- [ ] Update filter parameters: `teamId` → `workspaceId`
- [ ] Test imports and exports work correctly

**Expected Changes:**
```javascript
// Before: teamMemberModel.js
export const findByTeam = async (teamId) => {
  return await prisma.teamMember.findMany({
    where: { teamId },
    include: { user: true, team: true }
  });
};

// After: workspaceMemberModel.js
export const findByWorkspace = async (workspaceId) => {
  return await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: true, workspace: true }
  });
};
```

---

### Phase 2: Validation Middleware

#### Checkpoint 2.1: Create Workspace Validation ⏱️ 8 min
- [ ] Create `src/middlewares/validateWorkspace.js` based on `validateTeam.js`
- [ ] Update validation function names: `validateTeamCreation` → `validateWorkspaceCreation`
- [ ] Update error messages to reference "workspace" instead of "team"
- [ ] Keep same validation logic and Zod schemas
- [ ] Test middleware exports

---

#### Checkpoint 2.2: Create Workspace Member Validation ⏱️ 7 min
- [ ] Create `src/middlewares/validateWorkspaceMember.js` based on `validateTeamMember.js`
- [ ] Update validation function names: `validateTeamMemberCreation` → `validateWorkspaceMemberCreation`
- [ ] Update field references: `teamId` → `workspaceId` in validation schemas
- [ ] Update error messages to reference "workspace member" instead of "team member"
- [ ] Test middleware exports

---

### Phase 3: Controllers (Business Logic)

#### Checkpoint 3.1: Create Workspace Controller ⏱️ 15 min
- [ ] Create `src/controllers/workspaceController.js` based on `teamController.js`
- [ ] Update import statement to use workspace model
- [ ] Update function names: `getTeams` → `getWorkspaces`, `getTeam` → `getWorkspace`, etc.
- [ ] Update model function calls to use workspace model methods
- [ ] Update success/error messages to reference "workspace"
- [ ] Update filter parameter handling if needed
- [ ] Test controller exports

**Expected Changes:**
```javascript
// Before: teamController.js
import { findAll, findById, create, update, deleteById } from "../models/teamModel.js";

export const getTeams = async (req, res) => {
  const [teams, total] = (await findAll(skip, limit, filters)) ?? [];
  res.success(teams, "Teams retrieved successfully", meta);
};

// After: workspaceController.js
import { findAll, findById, create, update, deleteById } from "../models/workspaceModel.js";

export const getWorkspaces = async (req, res) => {
  const [workspaces, total] = (await findAll(skip, limit, filters)) ?? [];
  res.success(workspaces, "Workspaces retrieved successfully", meta);
};
```

---

#### Checkpoint 3.2: Create Workspace Member Controller ⏱️ 10 min
- [ ] Create `src/controllers/workspaceMemberController.js` based on `teamMemberController.js`
- [ ] Update import statement to use workspace member model
- [ ] Update function names: `getTeamMembers` → `getWorkspaceMembers`, `getMembersByTeam` → `getMembersByWorkspace`, etc.
- [ ] Update parameter extraction: `req.params.teamId` → `req.params.workspaceId`
- [ ] Update model function calls to use workspace member model methods
- [ ] Update success/error messages to reference "workspace"
- [ ] Test controller exports

---

### Phase 4: Routes

#### Checkpoint 4.1: Create Workspace Route ⏱️ 8 min
- [ ] Create `src/routes/workspaceRoute.js` based on `teamRoute.js`
- [ ] Update controller imports to use workspace controller
- [ ] Update validation middleware imports to use workspace validation
- [ ] Update route handler function names in route definitions
- [ ] Keep same route structure (`/`, `/:id`, etc.)
- [ ] Test route exports

**Expected Changes:**
```javascript
// Before: teamRoute.js
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam } from "../controllers/teamController.js";
import { validateTeamCreation, validateTeamUpdate } from "../middlewares/validateTeam.js";

router.get("/", asyncWrapper(getTeams));
router.post("/", validateTeamCreation, asyncWrapper(createTeam));

// After: workspaceRoute.js
import { getWorkspaces, getWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } from "../controllers/workspaceController.js";
import { validateWorkspaceCreation, validateWorkspaceUpdate } from "../middlewares/validateWorkspace.js";

router.get("/", asyncWrapper(getWorkspaces));
router.post("/", validateWorkspaceCreation, asyncWrapper(createWorkspace));
```

---

#### Checkpoint 4.2: Create Workspace Member Route ⏱️ 7 min
- [ ] Create `src/routes/workspaceMemberRoute.js` based on `teamMemberRoute.js`
- [ ] Update controller imports to use workspace member controller
- [ ] Update validation middleware imports to use workspace member validation
- [ ] Update route endpoints: `/team/:teamId` → `/workspace/:workspaceId`
- [ ] Update route handler function names in route definitions
- [ ] Test route exports

---

### Phase 5: Route Registration & Integration

#### Checkpoint 5.1: Update App Router ⏱️ 10 min
- [ ] Update `src/routes/app/appRouter.js` imports
- [ ] Change import: `teamRoutes` → `workspaceRoutes` from `workspaceRoute.js`
- [ ] Change import: `teamMemberRoutes` → `workspaceMemberRoutes` from `workspaceMemberRoute.js`
- [ ] Update route registration: `router.use('/teams', teamRoutes)` → `router.use('/workspaces', workspaceRoutes)`
- [ ] Update route registration: `router.use('/team-members', teamMemberRoutes)` → `router.use('/workspace-members', workspaceMemberRoutes)`
- [ ] Update comments to reference workspace instead of team
- [ ] Test app starts without import errors

**Expected Changes:**
```javascript
// Before
import teamRoutes from "../../routes/teamRoute.js";
import teamMemberRoutes from "../../routes/teamMemberRoute.js";
// User and Team related routes
router.use(`/teams`, teamRoutes);
router.use(`/team-members`, teamMemberRoutes);

// After  
import workspaceRoutes from "../../routes/workspaceRoute.js";
import workspaceMemberRoutes from "../../routes/workspaceMemberRoute.js";
// User and Workspace related routes
router.use(`/workspaces`, workspaceRoutes);
router.use(`/workspace-members`, workspaceMemberRoutes);
```

---

### Phase 6: Cleanup & Validation

#### Checkpoint 6.1: File Cleanup ⏱️ 5 min
- [ ] Remove old team files after confirming new workspace files work:
  - `src/controllers/teamController.js`
  - `src/controllers/teamMemberController.js`
  - `src/models/teamModel.js`
  - `src/models/teamMemberModel.js`
  - `src/routes/teamRoute.js`
  - `src/routes/teamMemberRoute.js`
  - `src/middlewares/validateTeam.js`
  - `src/middlewares/validateTeamMember.js`

---

#### Checkpoint 6.2: ESLint Validation ⏱️ 10 min
- [ ] Run `npm run lint:fix` to check for any linting errors
- [ ] Fix any import/export issues found
- [ ] Verify no unused variables or imports remain
- [ ] Check all function names follow consistent naming patterns
- [ ] Verify proper error handling patterns are maintained

---

#### Checkpoint 6.3: Final Integration Test ⏱️ 10 min
- [ ] Start the development server (`npm run dev`)
- [ ] Verify no import errors on startup
- [ ] Test basic API endpoints work:
  - `GET /api/workspaces` (should return workspaces)
  - `GET /api/workspace-members` (should return workspace members)
- [ ] Check error handling works correctly
- [ ] Verify response formats match existing patterns

---

## Success Criteria

- [ ] All team files successfully renamed to workspace equivalents
- [ ] All function names updated to workspace terminology
- [ ] All API endpoints changed from team to workspace paths
- [ ] All Prisma model references updated (team → workspace, teamMember → workspaceMember)
- [ ] Route registration updated in appRouter.js
- [ ] ESLint validation passes with no errors
- [ ] No import/export errors
- [ ] Success/error messages reference workspace terminology
- [ ] Application starts successfully
- [ ] API endpoints respond correctly

## Error Recovery Plan

If any checkpoint fails:
1. Revert the specific file that caused the issue
2. Fix the identified problem
3. Re-run the checkpoint
4. Continue with remaining checkpoints

If multiple checkpoints fail:
1. Stop implementation
2. Revert all changes made in the task
3. Analyze root cause of failures
4. Update plan if needed
5. Restart implementation

## Validation Commands

```bash
# Check for import errors and linting issues
npm run lint:fix

# Start development server to test integration
npm run dev

# Test API endpoints (if curl/Postman available)
curl -X GET http://localhost:3000/api/workspaces
curl -X GET http://localhost:3000/api/workspace-members
```

## Notes

- Follow existing code patterns and conventions
- Use asyncWrapper for all route handlers
- Maintain consistent error handling with res.success() and res.error()
- Keep JSDoc comments updated with new terminology
- Ensure all validation schemas remain functionally identical
- Test each checkpoint before moving to the next phase

---

**Status**: Waiting for user approval to begin implementation
**Next Action**: Get user confirmation to proceed with checkpoint execution