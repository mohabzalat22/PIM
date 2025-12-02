# Task: Migrate Team Frontend to Workspace Implementation

**Date**: December 1, 2025  
**Plan Reference**: [2025-12-01-migrate-team-frontend-to-workspace.md](../plans/2025-12-01-migrate-team-frontend-to-workspace.md)
**Status**: Pending Approval  
**Implementation Time**: ~140 minutes

## Task Overview

Migrate all frontend team-related components, interfaces, API calls, routes, and navigation to workspace terminology to match the completed backend workspace migration. This includes updating 12+ files and ensuring the frontend correctly connects to the new workspace API endpoints.

## Scope

### Files to Migrate (12+ files)
1. **Interfaces**: 4 files - team/workspace interfaces and filters
2. **API Layer**: 2 files - teams.ts → workspaces.ts, teamMembers.ts → workspaceMembers.ts  
3. **Services**: 2 files - team/workspace service layers
4. **Hooks**: 2 files - useTeams → useWorkspaces, useTeamMembers → useWorkspaceMembers
5. **Components**: 2 files - Team.tsx → Workspace.tsx, TeamMember.tsx → WorkspaceMember.tsx
6. **Navigation**: 2 files - Sidebar.tsx and App.tsx routing updates

### Key Changes
- Routes: `/teams` → `/workspaces`, `/team-members` → `/workspace-members`
- API: All endpoints updated to workspace terminology
- UI: All labels changed from "Team" to "Workspace"

---

## Checkpoints

### Phase 1: Interfaces & Types

#### Checkpoint 1.1: Create Workspace Interface ⏱️ 5 min
- [ ] Create `client/src/interfaces/workspace.interface.ts` based on `team.interface.ts`
- [ ] Update interface name: `Team` → `Workspace`
- [ ] Update property names: `teamMembers` → `members` (if present)
- [ ] Keep same structure but with workspace terminology
- [ ] Test interface exports

**Expected Changes:**
```typescript
// Before: team.interface.ts
export default interface Team {
  id: number;
  name: string;
  teamMembers?: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

// After: workspace.interface.ts  
export default interface Workspace {
  id: number;
  name: string;
  ownerId: number;
  members?: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}
```

---

#### Checkpoint 1.2: Create Workspace Member Interface ⏱️ 5 min
- [ ] Create `client/src/interfaces/workspaceMember.interface.ts` based on `teamMember.interface.ts`
- [ ] Update interface name: `TeamMember` → `WorkspaceMember`
- [ ] Update property names: `teamId` → `workspaceId`, `team` → `workspace`
- [ ] Update import references for related interfaces
- [ ] Test interface exports

---

#### Checkpoint 1.3: Create Filter Interfaces ⏱️ 5 min
- [ ] Create `client/src/interfaces/workspace/filters.interface.ts`
- [ ] Create `client/src/interfaces/workspaceMember/filters.interface.ts`
- [ ] Update filter properties: `teamId` → `workspaceId`
- [ ] Keep same filtering structure with workspace terminology
- [ ] Test interface exports

---

#### Checkpoint 1.4: Update Main Interface Exports ⏱️ 5 min
- [ ] Verify all new interfaces are properly exported
- [ ] Check for any TypeScript compilation errors
- [ ] Ensure proper import paths are working

---

### Phase 2: API Layer

#### Checkpoint 2.1: Create Workspace API ⏱️ 10 min
- [ ] Create `client/src/api/workspaces.ts` based on `teams.ts`
- [ ] Update API object name: `TeamApi` → `WorkspaceApi`
- [ ] Update all API endpoints: `/teams` → `/workspaces`
- [ ] Update import statements to use Workspace interfaces
- [ ] Update type annotations throughout
- [ ] Test API exports

**Expected Changes:**
```typescript
// Before: teams.ts
const response = await client.get("/teams", { params });

// After: workspaces.ts
const response = await client.get("/workspaces", { params });
```

---

#### Checkpoint 2.2: Create Workspace Member API ⏱️ 15 min
- [ ] Create `client/src/api/workspaceMembers.ts` based on `teamMembers.ts`
- [ ] Update API object name: `TeamMemberApi` → `WorkspaceMemberApi`
- [ ] Update all API endpoints: `/team-members` → `/workspace-members`
- [ ] Update specific endpoints: `/team/:teamId` → `/workspace/:workspaceId`
- [ ] Update import statements to use WorkspaceMember interfaces
- [ ] Update type annotations throughout
- [ ] Test API exports

---

### Phase 3: Services Layer

#### Checkpoint 3.1: Create Workspace Service ⏱️ 8 min
- [ ] Create `client/src/services/workspace.service.ts` based on `team.service.ts`
- [ ] Update service name: `TeamService` → `WorkspaceService`
- [ ] Update API import: `TeamApi` → `WorkspaceApi`
- [ ] Update all function calls to use WorkspaceApi methods
- [ ] Update type annotations to use Workspace interface
- [ ] Test service exports

---

#### Checkpoint 3.2: Create Workspace Member Service ⏱️ 7 min
- [ ] Create `client/src/services/workspaceMember.service.ts` based on `teamMember.service.ts`
- [ ] Update service name: `TeamMemberService` → `WorkspaceMemberService`
- [ ] Update API import: `TeamMemberApi` → `WorkspaceMemberApi`
- [ ] Update all function calls to use WorkspaceMemberApi methods
- [ ] Update type annotations to use WorkspaceMember interface
- [ ] Test service exports

---

### Phase 4: Custom Hooks

#### Checkpoint 4.1: Create Workspace Hook ⏱️ 8 min
- [ ] Create `client/src/hooks/useWorkspaces.ts` based on `useTeams.ts`
- [ ] Update hook name: `useTeams` → `useWorkspaces`
- [ ] Update service import: `TeamService` → `WorkspaceService`
- [ ] Update all service calls to WorkspaceService methods
- [ ] Update state variable names: `teams` → `workspaces`
- [ ] Update return value names for consistency
- [ ] Test hook exports

---

#### Checkpoint 4.2: Create Workspace Member Hook ⏱️ 7 min
- [ ] Create `client/src/hooks/useWorkspaceMembers.ts` based on `useTeamMembers.ts`
- [ ] Update hook name: `useTeamMembers` → `useWorkspaceMembers`
- [ ] Update service import: `TeamMemberService` → `WorkspaceMemberService`
- [ ] Update all service calls to WorkspaceMemberService methods
- [ ] Update filter property names: `teamId` → `workspaceId`
- [ ] Test hook exports

---

### Phase 5: Page Components

#### Checkpoint 5.1: Create Workspace Page ⏱️ 20 min
- [ ] Create `client/src/pages/Workspace.tsx` based on `Team.tsx`
- [ ] Update component name: `TeamPage` → `WorkspacePage`
- [ ] Update all imports to use workspace interfaces, hooks, services
- [ ] Update state variable names: `teams` → `workspaces`, `editingTeam` → `editingWorkspace`
- [ ] Update all UI text: "Team" → "Workspace", "Create Team" → "Create Workspace"
- [ ] Update function names: `handleCreateTeam` → `handleCreateWorkspace`
- [ ] Update API call references throughout component
- [ ] Test component renders without errors

**Expected Changes:**
```typescript
// Before: Team.tsx
const [teams, teamsLoading, teamsErrors, teamsTotalPages, refetchTeams] = useTeams(currentPage, limit, filters);

// After: Workspace.tsx
const [workspaces, workspacesLoading, workspacesErrors, workspacesTotalPages, refetchWorkspaces] = useWorkspaces(currentPage, limit, filters);
```

---

#### Checkpoint 5.2: Create Workspace Member Page ⏱️ 20 min
- [ ] Create `client/src/pages/WorkspaceMember.tsx` based on `TeamMember.tsx`
- [ ] Update component name: `TeamMemberPage` → `WorkspaceMemberPage`
- [ ] Update all imports to use workspace interfaces, hooks, services
- [ ] Update state variable names: `teamMembers` → `workspaceMembers`
- [ ] Update filter references: `teamId` → `workspaceId`, "Filter by Team" → "Filter by Workspace"
- [ ] Update all UI text: "Team Member" → "Workspace Member", "Add Team Member" → "Add Workspace Member"
- [ ] Update function names: `handleCreateMember` → `handleCreateWorkspaceMember`
- [ ] Update dropdown options: `teams` → `workspaces`
- [ ] Test component renders without errors

---

### Phase 6: Navigation & Routing

#### Checkpoint 6.1: Update Sidebar Navigation ⏱️ 10 min
- [ ] Update `client/src/components/app/Sidebar.tsx`
- [ ] Change menu section from "teams" to "workspaces" in menuItems object
- [ ] Update menu items:
  - "Teams" → "Workspaces"
  - "Members" → "Workspace Members"
- [ ] Update URLs: `/teams` → `/workspaces`, `/team-members` → `/workspace-members`
- [ ] Keep same icons or update if desired
- [ ] Test sidebar displays correctly

**Expected Changes:**
```typescript
// Before: Sidebar.tsx
teams: {
  label: "System",
  items: [
    { title: "Teams", url: "/teams", icon: Users },
    { title: "Members", url: "/team-members", icon: UserPlus }
  ]
}

// After: Sidebar.tsx  
workspaces: {
  label: "System",
  items: [
    { title: "Workspaces", url: "/workspaces", icon: Users },
    { title: "Workspace Members", url: "/workspace-members", icon: UserPlus }
  ]
}
```

---

#### Checkpoint 6.2: Update App Routes ⏱️ 5 min
- [ ] Update `client/src/App.tsx`
- [ ] Update route paths: `/teams` → `/workspaces`, `/team-members` → `/workspace-members`
- [ ] Update component imports: `TeamPage` → `WorkspacePage`, `TeamMemberPage` → `WorkspaceMemberPage`
- [ ] Verify routes are still within SignedIn wrapper
- [ ] Test route navigation works

**Expected Changes:**
```typescript
// Before: App.tsx
<Route path="/teams" element={<TeamPage></TeamPage>}></Route>
<Route path="/team-members" element={<TeamMemberPage></TeamMemberPage>}></Route>

// After: App.tsx
<Route path="/workspaces" element={<WorkspacePage></WorkspacePage>}></Route>
<Route path="/workspace-members" element={<WorkspaceMemberPage></WorkspaceMemberPage>}></Route>
```

---

### Phase 7: Cleanup & Validation

#### Checkpoint 7.1: File Cleanup ⏱️ 5 min
- [ ] Remove old team-related files after confirming workspace files work:
  - `client/src/interfaces/team.interface.ts`
  - `client/src/interfaces/teamMember.interface.ts`
  - `client/src/interfaces/team/filters.interface.ts`
  - `client/src/interfaces/teamMember/filters.interface.ts`
  - `client/src/api/teams.ts`
  - `client/src/api/teamMembers.ts`
  - `client/src/services/team.service.ts`
  - `client/src/services/teamMember.service.ts`
  - `client/src/hooks/useTeams.ts`
  - `client/src/hooks/useTeamMembers.ts`
  - `client/src/pages/Team.tsx`
  - `client/src/pages/TeamMember.tsx`

---

#### Checkpoint 7.2: TypeScript Validation ⏱️ 5 min
- [ ] Run TypeScript check: `npm run build` or similar
- [ ] Fix any import/export issues found
- [ ] Verify no unused variables or imports remain
- [ ] Check all interface names and imports are consistent
- [ ] Ensure proper type definitions throughout

---

#### Checkpoint 7.3: Final Integration Test ⏱️ 10 min
- [ ] Start the development server (`npm run dev`)
- [ ] Navigate to `/workspaces` route
- [ ] Test workspace CRUD operations:
  - Create new workspace
  - List workspaces with pagination
  - Edit existing workspace
  - Delete workspace
- [ ] Navigate to `/workspace-members` route
- [ ] Test workspace member operations:
  - Add member to workspace
  - Filter by workspace
  - Update member role
  - Remove member
- [ ] Verify error handling displays correctly
- [ ] Check all labels and text display "Workspace" terminology

---

## Success Criteria

- [ ] All team files successfully migrated to workspace equivalents
- [ ] Sidebar navigation shows "Workspaces" and "Workspace Members"
- [ ] Routes work: `/workspaces` and `/workspace-members`
- [ ] All API calls connect to workspace endpoints correctly
- [ ] All UI text updated to workspace terminology
- [ ] TypeScript compilation passes with no errors
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Pagination and filtering function correctly
- [ ] Error handling works and displays appropriate workspace messages
- [ ] Navigation between pages works correctly

## Error Recovery Plan

If any checkpoint fails:
1. Revert the specific file that caused the issue
2. Fix the identified problem (usually import paths or interface names)
3. Re-run the checkpoint
4. Continue with remaining checkpoints

If multiple checkpoints fail:
1. Stop implementation
2. Revert all changes made in the task
3. Analyze root cause of failures (often interface naming or import paths)
4. Update plan if needed
5. Restart implementation

## Validation Commands

```bash
# Check TypeScript compilation
cd client && npm run build

# Start development server for testing
cd client && npm run dev

# Check for linting issues (optional)
cd client && npm run lint
```

## Testing Checklist

### Workspace Management
- [ ] Can access `/workspaces` route
- [ ] Can create new workspace
- [ ] Can view list of workspaces
- [ ] Can edit workspace name
- [ ] Can delete workspace
- [ ] Pagination works correctly
- [ ] Search/filtering works

### Workspace Members
- [ ] Can access `/workspace-members` route
- [ ] Can add user to workspace
- [ ] Can view workspace members list
- [ ] Can filter by workspace
- [ ] Can update member role
- [ ] Can remove member from workspace
- [ ] All dropdowns populate correctly

### Navigation
- [ ] Sidebar shows "Workspaces" and "Workspace Members"
- [ ] Clicking sidebar items navigates to correct routes
- [ ] Browser back/forward works correctly
- [ ] URLs display correct paths

### Error Handling
- [ ] API errors display appropriate messages
- [ ] Form validation works
- [ ] Loading states display correctly
- [ ] Empty states show appropriate messages

---

**Status**: Waiting for user approval to begin implementation
**Next Action**: Get user confirmation to proceed with checkpoint execution