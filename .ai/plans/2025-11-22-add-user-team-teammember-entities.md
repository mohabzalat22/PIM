# Plan: Add User, Team, and TeamMember Entities

**Date Created**: 2025-11-22
**Status**: Planning
**Estimated Complexity**: Medium

## Overview
Implement complete backend support for User, Team, and TeamMember models including models, controllers, routes, and validation middleware. These entities will enable team-based collaboration and user management in the XStore PIM system.

## Requirements
- Create User model with CRUD operations
- Create Team model with CRUD operations
- Create TeamMember model with CRUD operations and role management
- Implement validation for all entities
- Create RESTful API endpoints
- Support for role-based team membership (OWNER, ADMIN, MEMBER)
- Ensure unique constraints are enforced (email for User, name for Team, teamId+userId for TeamMember)

## Affected Components

### Backend
- [x] Models: userModel.js, teamModel.js, teamMemberModel.js
- [x] Controllers: userController.js, teamController.js, teamMemberController.js
- [x] Routes: userRoute.js, teamRoute.js, teamMemberRoute.js
- [x] Middleware: validateUser.js, validateTeam.js, validateTeamMember.js
- [x] Validation: Zod schemas for all entities

### Database
- [x] Schema changes completed (User, Team, TeamMember models exist)
- [ ] Migration required (will run prisma migrate dev)
- [ ] Seed data updates (optional - can add factory files)

### Frontend
- [ ] Not included in this implementation (backend only)

## Dependencies
- Prisma Client (already installed)
- Zod for validation (already installed)
- Express.js (already installed)
- Existing patterns from other models (Product, Category, etc.)

## Implementation Strategy

### Phase 1: Models (Data Access Layer)
1. Create `userModel.js` with:
   - findAll (with pagination)
   - findById
   - findByEmail
   - create
   - update
   - remove
   - Include teamMembers relation

2. Create `teamModel.js` with:
   - findAll (with pagination)
   - findById
   - findByName
   - create
   - update
   - remove
   - Include teamMembers relation

3. Create `teamMemberModel.js` with:
   - findAll (with pagination)
   - findById
   - findByTeam
   - findByUser
   - create
   - update (for role changes)
   - remove
   - Include user and team relations

### Phase 2: Validation Middleware
1. Create `validateUser.js` with Zod schemas:
   - name: required string, min 1 char
   - email: required string, email format

2. Create `validateTeam.js` with Zod schemas:
   - name: required string, min 1 char, unique

3. Create `validateTeamMember.js` with Zod schemas:
   - teamId: required integer
   - userId: required integer
   - role: required enum (OWNER, ADMIN, MEMBER)

### Phase 3: Controllers (Business Logic)
1. Create `userController.js` with:
   - getUsers (paginated, with teamMembers relation)
   - getUserById (with teamMembers relation)
   - createUser (check email uniqueness)
   - updateUser
   - deleteUser

2. Create `teamController.js` with:
   - getTeams (paginated, with teamMembers relation)
   - getTeamById (with teamMembers and users)
   - createTeam (check name uniqueness)
   - updateTeam
   - deleteTeam

3. Create `teamMemberController.js` with:
   - getTeamMembers (paginated, with user and team relations)
   - getTeamMemberById
   - createTeamMember (check unique constraint teamId+userId)
   - updateTeamMember (for role updates)
   - deleteTeamMember

### Phase 4: Routes
1. Create `userRoute.js`:
   - GET /api/users (list all users)
   - GET /api/users/:id (get single user)
   - POST /api/users (create user)
   - PUT /api/users/:id (update user)
   - DELETE /api/users/:id (delete user)

2. Create `teamRoute.js`:
   - GET /api/teams (list all teams)
   - GET /api/teams/:id (get single team)
   - POST /api/teams (create team)
   - PUT /api/teams/:id (update team)
   - DELETE /api/teams/:id (delete team)

3. Create `teamMemberRoute.js`:
   - GET /api/team-members (list all team members)
   - GET /api/team-members/:id (get single team member)
   - POST /api/team-members (create team member)
   - PUT /api/team-members/:id (update team member role)
   - DELETE /api/team-members/:id (delete team member)

### Phase 5: Integration
1. Register routes in `src/app.js`
2. Run Prisma migration
3. Test endpoints with sample data

## Potential Risks

- **Risk 1: Email Uniqueness Violation**
  - Mitigation: Validate email uniqueness in controller before creating user
  - Handle Prisma unique constraint errors gracefully

- **Risk 2: Team Name Uniqueness Violation**
  - Mitigation: Validate team name uniqueness in controller
  - Handle Prisma unique constraint errors

- **Risk 3: TeamMember Duplicate Assignment**
  - Mitigation: Check unique constraint (teamId, userId) before creating
  - Return meaningful error message if user already in team

- **Risk 4: Cascade Delete Behavior**
  - Mitigation: TeamMember has onDelete: Cascade for both Team and User
  - Document this behavior for users

## Success Criteria

- [ ] All models created and follow existing patterns
- [ ] All controllers implement CRUD operations
- [ ] All validation middleware uses Zod schemas
- [ ] All routes registered in app.js
- [ ] ESLint validation passes (npm run lint:fix)
- [ ] Prisma migration runs successfully
- [ ] Unique constraints enforced properly
- [ ] Relations (include) work correctly
- [ ] Error handling follows asyncWrapper pattern
- [ ] Response format follows standardized format (successMessage/errorMessage)
- [ ] All endpoints tested manually (can use Postman/curl)

## API Response Format

All endpoints will follow the standard format:

```javascript
// Success
{
  success: true,
  statusCode: 200,
  message: "Success message",
  data: {...},
  meta: { total, page, limit, totalPages } // for list endpoints
}

// Error
{
  success: false,
  statusCode: 4xx/5xx,
  message: "Error message",
  error: {...}
}
```

## Notes

- Follow existing code patterns from productController.js, categoryController.js
- Use asyncWrapper utility for error handling
- Use Prisma's include for relations
- Implement pagination for all list endpoints
- Validate input with Zod before database operations
- Handle Prisma errors (unique violations, foreign key constraints)
