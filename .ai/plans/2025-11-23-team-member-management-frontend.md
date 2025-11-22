# Plan: Team & Member Management Frontend Implementation

**Date Created**: 2025-11-23
**Status**: Planning
**Estimated Complexity**: Medium

## Overview
Implement a complete frontend for Team and Member Management functionality, similar to the existing PIM entities (Stores, Products, etc.). The backend controllers, models, routes, and validation are already implemented. This task focuses on creating the frontend components, API integration, and UI pages.

## Requirements
- Create TypeScript interfaces for Team and TeamMember entities
- Implement API client functions for Teams and TeamMembers
- Create service layer for business logic
- Build Team management page with CRUD operations
- Build TeamMember management page with CRUD operations
- Follow existing patterns from Store, Product, and other entity pages
- Support pagination, filtering, and search
- Implement proper error handling
- Use existing UI components (Radix UI + Tailwind CSS)
- Maintain consistency with existing design patterns

## Affected Components

### Backend
- [x] Models: `teamModel.js`, `teamMemberModel.js` (Already exists)
- [x] Controllers: `teamController.js`, `teamMemberController.js` (Already exists)
- [x] Routes: `teamRoute.js`, `teamMemberRoute.js` (Already exists)
- [x] Middleware: `validateTeam.js`, `validateTeamMember.js` (Already exists)
- [x] Routes registered in `appRouter.js` (Already exists)

### Database
- [x] Schema: Team and TeamMember models (Already exists)
- [x] Migration: User-Team-TeamMember tables (Already exists)
- [x] Relations: Properly configured (Already exists)

### Frontend (To be implemented)
- [ ] Interfaces: 
  - `team.interface.ts`
  - `teamMember.interface.ts`
  - `team.filters.interface.ts`
  - `teamMember.filters.interface.ts`
- [ ] API clients:
  - `teams.ts`
  - `teamMembers.ts`
- [ ] Services:
  - `team.service.ts`
  - `teamMember.service.ts`
- [ ] Pages:
  - `Team.tsx` - Team management page
  - `TeamMember.tsx` - Team member management page
- [ ] Routes: Add routes in `App.tsx`

## Dependencies
- Existing UI components from `/client/src/components`
- Radix UI primitives
- Tailwind CSS
- Axios for HTTP requests
- React Router DOM for navigation
- Existing pattern from Store, Product, Attribute pages

## Implementation Strategy

### Phase 1: TypeScript Interfaces
1. Create `team.interface.ts` with Team type
2. Create `teamMember.interface.ts` with TeamMember and MemberRole enum
3. Create filter interfaces for both entities
4. Follow existing interface patterns

### Phase 2: API Layer
1. Create `teams.ts` API client with:
   - `getAll()` - with pagination and filters
   - `getById()`
   - `create()`
   - `update()`
   - `delete()`
2. Create `teamMembers.ts` API client with same methods plus:
   - `getMembersByTeam(teamId)`
   - `getTeamsByUser(userId)`

### Phase 3: Service Layer
1. Create `team.service.ts` wrapping Team API calls
2. Create `teamMember.service.ts` wrapping TeamMember API calls
3. Follow existing service patterns

### Phase 4: Team Page Component
1. Create `Team.tsx` page component
2. Implement:
   - Data table with teams list
   - Create new team dialog/form
   - Edit team dialog/form
   - Delete team functionality
   - Pagination controls
   - Search and filter
   - Column selector
   - Bulk actions (optional)
3. Follow patterns from `Store.tsx` or `Attribute.tsx`

### Phase 5: TeamMember Page Component
1. Create `TeamMember.tsx` page component
2. Implement:
   - Data table with team members list
   - Add member dialog/form (select team, user, role)
   - Edit member role
   - Remove member functionality
   - Filter by team
   - Pagination controls
3. Display user and team information in table

### Phase 6: Routing
1. Add routes in `App.tsx`:
   - `/teams` -> Team page
   - `/team-members` -> TeamMember page
2. Update navigation menu if needed

### Phase 7: Testing & Validation
1. Test all CRUD operations
2. Verify API integration
3. Check error handling
4. Test pagination and filtering
5. Run ESLint validation

## Potential Risks
- **Risk 1**: User and Team selection in TeamMember form
  - **Mitigation**: Create dropdowns fetching from `/users` and `/teams` endpoints
- **Risk 2**: MemberRole enum consistency between frontend and backend
  - **Mitigation**: Define enum type in interface matching Prisma schema (OWNER, ADMIN, MEMBER)
- **Risk 3**: Unique constraint handling (teamId + userId)
  - **Mitigation**: Show proper error messages when trying to add duplicate member

## Success Criteria
- [ ] TypeScript interfaces created and properly typed
- [ ] API client functions working correctly
- [ ] Service layer implemented
- [ ] Team management page fully functional
- [ ] TeamMember management page fully functional
- [ ] Routes added and navigation working
- [ ] All CRUD operations tested
- [ ] Error handling working properly
- [ ] ESLint validation passes
- [ ] UI consistent with existing pages
- [ ] Pagination and filtering working
- [ ] No console errors or warnings

## Reference Files
- Backend Controllers: `src/controllers/teamController.js`, `src/controllers/teamMemberController.js`
- Backend Models: `src/models/teamModel.js`, `src/models/teamMemberModel.js`
- Backend Routes: `src/routes/teamRoute.js`, `src/routes/teamMemberRoute.js`
- Prisma Schema: `prisma/schema.prisma` (Team, TeamMember models)
- Example Frontend: `client/src/pages/Store.tsx`, `client/src/pages/Attribute.tsx`
- Example API: `client/src/api/store.ts`
- Example Service: `client/src/services/store.service.ts`
- Example Interface: `client/src/interfaces/store.interface.ts`

## Notes
- Backend is complete and tested
- API endpoints available at `/api/teams` and `/api/team-members`
- Follow existing code conventions and patterns
- Use existing UI components for consistency
- Implement proper TypeScript typing throughout
