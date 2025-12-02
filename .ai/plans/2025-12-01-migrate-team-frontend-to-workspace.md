# Plan: Migrate Team Frontend to Workspace Implementation

**Date**: December 1, 2025
**Author**: GitHub Copilot
**Type**: Frontend Migration
**Status**: Pending Approval

## Overview

Migrate all frontend team-related components, API calls, routes, and interfaces to workspace terminology to match the completed backend workspace migration and updated Prisma schema.

## Context

The backend has been successfully migrated from team to workspace:
- ✅ API endpoints changed: `/api/teams` → `/api/workspaces`, `/api/team-members` → `/api/workspace-members`
- ✅ All backend models, controllers, routes updated
- ✅ Prisma schema updated to Workspace/WorkspaceMember models

The frontend still uses team terminology and needs to be updated to match.

## Current State Analysis

### Frontend Files (🔄 Need Migration)
- 🔄 `client/src/components/app/Sidebar.tsx` (navigation menu)
- 🔄 `client/src/App.tsx` (routes)
- 🔄 `client/src/api/teams.ts` → `workspaces.ts`
- 🔄 `client/src/api/teamMembers.ts` → `workspaceMembers.ts`
- 🔄 `client/src/services/team.service.ts` → `workspace.service.ts`
- 🔄 `client/src/services/teamMember.service.ts` → `workspaceMember.service.ts`
- 🔄 `client/src/interfaces/team.interface.ts` → `workspace.interface.ts`
- 🔄 `client/src/interfaces/teamMember.interface.ts` → `workspaceMember.interface.ts`
- 🔄 `client/src/interfaces/team/filters.interface.ts` → `workspace/filters.interface.ts`
- 🔄 `client/src/interfaces/teamMember/filters.interface.ts` → `workspaceMember/filters.interface.ts`
- 🔄 `client/src/pages/Team.tsx` → `Workspace.tsx`
- 🔄 `client/src/pages/TeamMember.tsx` → `WorkspaceMember.tsx`
- 🔄 `client/src/hooks/useTeams.ts` → `useWorkspaces.ts`
- 🔄 `client/src/hooks/useTeamMembers.ts` → `useWorkspaceMembers.ts`

### Routes & Navigation (🔄 Need Migration)
- 🔄 `/teams` → `/workspaces`
- 🔄 `/team-members` → `/workspace-members`
- 🔄 Sidebar navigation: "Teams" → "Workspaces", "Members" → "Workspace Members"

## Implementation Strategy

### Phase 1: Interfaces & Types
1. **Migrate team interfaces**:
   - `team.interface.ts` → `workspace.interface.ts`
   - Update interface name: `Team` → `Workspace`
   - Update property names: `teamMembers` → `members` (if present)

2. **Migrate team member interfaces**:
   - `teamMember.interface.ts` → `workspaceMember.interface.ts`
   - Update interface name: `TeamMember` → `WorkspaceMember`
   - Update property names: `teamId` → `workspaceId`, `team` → `workspace`

3. **Migrate filter interfaces**:
   - `team/filters.interface.ts` → `workspace/filters.interface.ts`
   - `teamMember/filters.interface.ts` → `workspaceMember/filters.interface.ts`
   - Update filter property names: `teamId` → `workspaceId`

### Phase 2: API Layer
1. **Migrate Teams API**:
   - `teams.ts` → `workspaces.ts`
   - Update API endpoints: `/teams` → `/workspaces`
   - Update function names: `TeamApi` → `WorkspaceApi`

2. **Migrate TeamMembers API**:
   - `teamMembers.ts` → `workspaceMembers.ts`
   - Update API endpoints: `/team-members` → `/workspace-members`
   - Update endpoint paths: `/team/:teamId` → `/workspace/:workspaceId`
   - Update function names: `TeamMemberApi` → `WorkspaceMemberApi`

### Phase 3: Services Layer
1. **Migrate team service**:
   - `team.service.ts` → `workspace.service.ts`
   - Update service name: `TeamService` → `WorkspaceService`
   - Update API imports to use WorkspaceApi

2. **Migrate team member service**:
   - `teamMember.service.ts` → `workspaceMember.service.ts`
   - Update service name: `TeamMemberService` → `WorkspaceMemberService`
   - Update API imports to use WorkspaceMemberApi

### Phase 4: Custom Hooks
1. **Migrate useTeams hook**:
   - `useTeams.ts` → `useWorkspaces.ts`
   - Update hook name: `useTeams` → `useWorkspaces`
   - Update service calls to WorkspaceService

2. **Migrate useTeamMembers hook**:
   - `useTeamMembers.ts` → `useWorkspaceMembers.ts`
   - Update hook name: `useTeamMembers` → `useWorkspaceMembers`
   - Update service calls to WorkspaceMemberService

### Phase 5: Page Components
1. **Migrate Team page**:
   - `Team.tsx` → `Workspace.tsx`
   - Update component name: `TeamPage` → `WorkspacePage`
   - Update all text/labels: "Team" → "Workspace"
   - Update API calls and state variable names
   - Update imports to use workspace interfaces and hooks

2. **Migrate TeamMember page**:
   - `TeamMember.tsx` → `WorkspaceMember.tsx`
   - Update component name: `TeamMemberPage` → `WorkspaceMemberPage`
   - Update all text/labels: "Team Member" → "Workspace Member"
   - Update filter references: "teamId" → "workspaceId"
   - Update imports to use workspace interfaces and hooks

### Phase 6: Navigation & Routing
1. **Update Sidebar**:
   - Change "Teams" → "Workspaces"
   - Change "Members" → "Workspace Members"
   - Update URLs: `/teams` → `/workspaces`, `/team-members` → `/workspace-members`

2. **Update App routes**:
   - Change route paths: `/teams` → `/workspaces`, `/team-members` → `/workspace-members`
   - Update component imports: `TeamPage` → `WorkspacePage`, `TeamMemberPage` → `WorkspaceMemberPage`

### Phase 7: Cleanup
1. **Remove old team files**:
   - Remove all old team-related files after workspace files are working
   - Clean up any unused imports

## File Mapping

### Files to Create/Rename

| Current File | New File | Changes |
|-------------|----------|---------|
| `interfaces/team.interface.ts` | `interfaces/workspace.interface.ts` | `Team` → `Workspace` interface |
| `interfaces/teamMember.interface.ts` | `interfaces/workspaceMember.interface.ts` | `TeamMember` → `WorkspaceMember`, `teamId` → `workspaceId` |
| `interfaces/team/filters.interface.ts` | `interfaces/workspace/filters.interface.ts` | Filter types renamed |
| `interfaces/teamMember/filters.interface.ts` | `interfaces/workspaceMember/filters.interface.ts` | `teamId` → `workspaceId` in filters |
| `api/teams.ts` | `api/workspaces.ts` | API endpoints updated |
| `api/teamMembers.ts` | `api/workspaceMembers.ts` | API endpoints and paths updated |
| `services/team.service.ts` | `services/workspace.service.ts` | Service name and imports updated |
| `services/teamMember.service.ts` | `services/workspaceMember.service.ts` | Service name and imports updated |
| `hooks/useTeams.ts` | `hooks/useWorkspaces.ts` | Hook name and service calls updated |
| `hooks/useTeamMembers.ts` | `hooks/useWorkspaceMembers.ts` | Hook name and service calls updated |
| `pages/Team.tsx` | `pages/Workspace.tsx` | Component name, labels, and logic updated |
| `pages/TeamMember.tsx` | `pages/WorkspaceMember.tsx` | Component name, labels, and logic updated |

### Files to Update (In-Place)

| File | Changes Required |
|------|------------------|
| `components/app/Sidebar.tsx` | Update menu items: "Teams" → "Workspaces", URLs updated |
| `App.tsx` | Update route paths and component imports |

## API Endpoint Changes

| Current Frontend Call | New Frontend Call | Backend Endpoint |
|----------------------|-------------------|------------------|
| `client.get("/teams")` | `client.get("/workspaces")` | `GET /api/workspaces` |
| `client.get("/teams/:id")` | `client.get("/workspaces/:id")` | `GET /api/workspaces/:id` |
| `client.post("/teams")` | `client.post("/workspaces")` | `POST /api/workspaces` |
| `client.put("/teams/:id")` | `client.put("/workspaces/:id")` | `PUT /api/workspaces/:id` |
| `client.delete("/teams/:id")` | `client.delete("/workspaces/:id")` | `DELETE /api/workspaces/:id` |
| `client.get("/team-members")` | `client.get("/workspace-members")` | `GET /api/workspace-members` |
| `client.get("/team-members/team/:teamId")` | `client.get("/workspace-members/workspace/:workspaceId")` | `GET /api/workspace-members/workspace/:workspaceId` |
| `client.get("/team-members/user/:userId")` | `client.get("/workspace-members/user/:userId")` | `GET /api/workspace-members/user/:userId` |

## UI Text Changes

### Page Titles & Labels
- "Teams" → "Workspaces"
- "Team Management" → "Workspace Management"  
- "Create New Team" → "Create New Workspace"
- "Edit Team" → "Edit Workspace"
- "Delete Team" → "Delete Workspace"
- "Team Members" → "Workspace Members"
- "Add Team Member" → "Add Workspace Member"
- "Filter by Team" → "Filter by Workspace"

### Messages & Tooltips
- "Team created successfully" → "Workspace created successfully"
- "Team updated successfully" → "Workspace updated successfully"
- "Team deleted successfully" → "Workspace deleted successfully"
- "No teams found" → "No workspaces found"
- "Team member created successfully" → "Workspace member created successfully"

## Implementation Notes

### Code Conventions to Follow
- Keep same component structure and patterns
- Maintain TypeScript strict typing
- Use same validation and error handling patterns
- Follow existing naming conventions (PascalCase for components, camelCase for functions)
- Keep same styling and UI patterns

### Key Pattern Examples

```typescript
// Interface naming
interface Workspace {
  id: number;
  name: string;
  ownerId: number;
  members?: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceMember {
  id: number;
  workspaceId: number;
  userId: number;
  role: MemberRole;
  workspace?: Workspace;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// API calls
const WorkspaceApi = {
  getAll: (page, limit, filters) => client.get("/workspaces", { params }),
  getById: (id) => client.get(`/workspaces/${id}`),
  create: (payload) => client.post("/workspaces", payload)
};

// Service layer
export const WorkspaceService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return WorkspaceApi.getAll(page, limit, filters);
  }
};

// Component naming
export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  // ...
}
```

## Risk Assessment

### Low Risk
- ✅ Backend is already complete and tested
- ✅ Following existing patterns and conventions
- ✅ No new functionality being added, just renaming

### Medium Risk
- ⚠️ Multiple files being created/updated simultaneously
- ⚠️ Import dependencies need to be updated correctly
- ⚠️ All references to team terminology need to be found

### Mitigation Strategies
- 🛡️ Follow step-by-step implementation with checkpoints
- 🛡️ Update one layer at a time (interfaces → API → services → components)
- 🛡️ Test API connections after each major change
- 🛡️ Keep backups of working team files until migration confirmed working

## Success Criteria

1. ✅ All team-related frontend files renamed/updated to workspace equivalents
2. ✅ All API calls updated to workspace endpoints
3. ✅ All routes updated to workspace paths (/workspaces, /workspace-members)
4. ✅ Sidebar navigation shows "Workspaces" and "Workspace Members"
5. ✅ All UI text updated to workspace terminology
6. ✅ TypeScript types properly defined and imported
7. ✅ No import/export errors
8. ✅ Frontend connects successfully to backend workspace APIs
9. ✅ All CRUD operations work correctly

## Dependencies

### Prerequisites
- ✅ Backend workspace migration completed
- ✅ Backend API endpoints working correctly
- ✅ Database schema updated and migrations complete

### Testing Strategy
- 🔄 Test API connections to workspace endpoints
- 🔄 Test all CRUD operations (Create, Read, Update, Delete)
- 🔄 Verify navigation works correctly
- 🔄 Test pagination and filtering functionality
- 🔄 Ensure error handling displays correctly

## Estimated Time

- **Phase 1 (Interfaces)**: 20 minutes
- **Phase 2 (API Layer)**: 25 minutes
- **Phase 3 (Services)**: 15 minutes
- **Phase 4 (Hooks)**: 15 minutes
- **Phase 5 (Components)**: 40 minutes
- **Phase 6 (Navigation)**: 15 minutes
- **Phase 7 (Cleanup)**: 10 minutes

**Total Estimated Time**: ~140 minutes (2 hours 20 minutes)

---

## Reference Files

### Current Team Files (to be migrated)
- `client/src/components/app/Sidebar.tsx`
- `client/src/App.tsx`
- `client/src/api/teams.ts`
- `client/src/api/teamMembers.ts`
- `client/src/services/team.service.ts`
- `client/src/services/teamMember.service.ts`
- `client/src/interfaces/team.interface.ts`
- `client/src/interfaces/teamMember.interface.ts`
- `client/src/pages/Team.tsx`
- `client/src/pages/TeamMember.tsx`
- `client/src/hooks/useTeams.ts`
- `client/src/hooks/useTeamMembers.ts`

### Backend Reference (✅ Completed)
- Backend workspace API: `GET/POST/PUT/DELETE /api/workspaces`
- Backend workspace members API: `GET/POST/PUT/DELETE /api/workspace-members`
- All backend files successfully migrated and tested

---

**Status**: Ready for implementation after user approval
**Next Steps**: Create implementation task with detailed checkpoints