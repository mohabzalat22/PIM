# Task: Implement User, Team, and TeamMember Entities

**Plan Reference**: `.ai/plans/2025-11-22-add-user-team-teammember-entities.md`
**Date Created**: 2025-11-22
**Status**: Pending Approval
**Assignee**: AI Assistant

---

## Task Overview

Implement complete backend support for User, Team, and TeamMember models including:
- Data access layer (models)
- Business logic (controllers)
- Input validation (middleware)
- API routes
- Integration with Express app

---

## Checkpoints

### Phase 1: Models (Data Access Layer)

#### Checkpoint 1.1: Create User Model
- [ ] Create `src/models/userModel.js`
- [ ] Implement `findAll(skip, limit)` with pagination
- [ ] Implement `findById(id)` with teamMembers relation
- [ ] Implement `findByEmail(email)` for uniqueness check
- [ ] Implement `create(data)`
- [ ] Implement `update(id, data)`
- [ ] Implement `remove(id)`
- [ ] Follow existing model patterns

**Estimated Time**: 15 minutes

---

#### Checkpoint 1.2: Create Team Model
- [ ] Create `src/models/teamModel.js`
- [ ] Implement `findAll(skip, limit)` with pagination
- [ ] Implement `findById(id)` with teamMembers relation
- [ ] Implement `findByName(name)` for uniqueness check
- [ ] Implement `create(data)`
- [ ] Implement `update(id, data)`
- [ ] Implement `remove(id)`
- [ ] Follow existing model patterns

**Estimated Time**: 15 minutes

---

#### Checkpoint 1.3: Create TeamMember Model
- [ ] Create `src/models/teamMemberModel.js`
- [ ] Implement `findAll(skip, limit)` with pagination
- [ ] Implement `findById(id)` with user and team relations
- [ ] Implement `findByTeam(teamId)` to get all members of a team
- [ ] Implement `findByUser(userId)` to get all teams for a user
- [ ] Implement `findByTeamAndUser(teamId, userId)` for duplicate check
- [ ] Implement `create(data)`
- [ ] Implement `update(id, data)` for role changes
- [ ] Implement `remove(id)`
- [ ] Follow existing model patterns

**Estimated Time**: 20 minutes

---

### Phase 2: Validation Middleware

#### Checkpoint 2.1: Create User Validation
- [ ] Create `src/middlewares/validateUser.js`
- [ ] Define Zod schema for user creation:
  - `name`: string, min 1 character, required
  - `email`: string, email format, required
- [ ] Implement `validateCreateUser` middleware
- [ ] Implement `validateUpdateUser` middleware (partial validation)
- [ ] Handle validation errors properly
- [ ] Export validators

**Estimated Time**: 10 minutes

---

#### Checkpoint 2.2: Create Team Validation
- [ ] Create `src/middlewares/validateTeam.js`
- [ ] Define Zod schema for team creation:
  - `name`: string, min 1 character, required
- [ ] Implement `validateCreateTeam` middleware
- [ ] Implement `validateUpdateTeam` middleware
- [ ] Handle validation errors properly
- [ ] Export validators

**Estimated Time**: 10 minutes

---

#### Checkpoint 2.3: Create TeamMember Validation
- [ ] Create `src/middlewares/validateTeamMember.js`
- [ ] Define Zod schema for team member creation:
  - `teamId`: number, required
  - `userId`: number, required
  - `role`: enum (OWNER, ADMIN, MEMBER), required
- [ ] Implement `validateCreateTeamMember` middleware
- [ ] Implement `validateUpdateTeamMember` middleware (for role updates)
- [ ] Handle validation errors properly
- [ ] Export validators

**Estimated Time**: 10 minutes

---

### Phase 3: Controllers (Business Logic)

#### Checkpoint 3.1: Create User Controller
- [ ] Create `src/controllers/userController.js`
- [ ] Implement `getUsers(req, res)` with pagination
- [ ] Implement `getUserById(req, res)` with teamMembers
- [ ] Implement `createUser(req, res)` with email uniqueness check
- [ ] Implement `updateUser(req, res)`
- [ ] Implement `deleteUser(req, res)`
- [ ] Use asyncWrapper for error handling
- [ ] Use successMessage/errorMessage helpers
- [ ] Handle Prisma unique constraint errors

**Estimated Time**: 20 minutes

---

#### Checkpoint 3.2: Create Team Controller
- [ ] Create `src/controllers/teamController.js`
- [ ] Implement `getTeams(req, res)` with pagination
- [ ] Implement `getTeamById(req, res)` with teamMembers
- [ ] Implement `createTeam(req, res)` with name uniqueness check
- [ ] Implement `updateTeam(req, res)`
- [ ] Implement `deleteTeam(req, res)`
- [ ] Use asyncWrapper for error handling
- [ ] Use successMessage/errorMessage helpers
- [ ] Handle Prisma unique constraint errors

**Estimated Time**: 20 minutes

---

#### Checkpoint 3.3: Create TeamMember Controller
- [ ] Create `src/controllers/teamMemberController.js`
- [ ] Implement `getTeamMembers(req, res)` with pagination
- [ ] Implement `getTeamMemberById(req, res)` with relations
- [ ] Implement `createTeamMember(req, res)` with duplicate check
- [ ] Implement `updateTeamMember(req, res)` for role changes
- [ ] Implement `deleteTeamMember(req, res)`
- [ ] Use asyncWrapper for error handling
- [ ] Use successMessage/errorMessage helpers
- [ ] Handle Prisma unique constraint errors

**Estimated Time**: 20 minutes

---

### Phase 4: Routes

#### Checkpoint 4.1: Create User Routes
- [ ] Create `src/routes/userRoute.js`
- [ ] Define GET `/api/users` route with controller
- [ ] Define GET `/api/users/:id` route with controller
- [ ] Define POST `/api/users` route with validation + controller
- [ ] Define PUT `/api/users/:id` route with validation + controller
- [ ] Define DELETE `/api/users/:id` route with controller
- [ ] Export router

**Estimated Time**: 10 minutes

---

#### Checkpoint 4.2: Create Team Routes
- [ ] Create `src/routes/teamRoute.js`
- [ ] Define GET `/api/teams` route with controller
- [ ] Define GET `/api/teams/:id` route with controller
- [ ] Define POST `/api/teams` route with validation + controller
- [ ] Define PUT `/api/teams/:id` route with validation + controller
- [ ] Define DELETE `/api/teams/:id` route with controller
- [ ] Export router

**Estimated Time**: 10 minutes

---

#### Checkpoint 4.3: Create TeamMember Routes
- [ ] Create `src/routes/teamMemberRoute.js`
- [ ] Define GET `/api/team-members` route with controller
- [ ] Define GET `/api/team-members/:id` route with controller
- [ ] Define POST `/api/team-members` route with validation + controller
- [ ] Define PUT `/api/team-members/:id` route with validation + controller
- [ ] Define DELETE `/api/team-members/:id` route with controller
- [ ] Export router

**Estimated Time**: 10 minutes

---

### Phase 5: Integration & Testing

#### Checkpoint 5.1: Register Routes in App
- [ ] Open `src/app.js`
- [ ] Import userRoute
- [ ] Import teamRoute
- [ ] Import teamMemberRoute
- [ ] Register routes with app.use()
- [ ] Follow existing route registration pattern

**Estimated Time**: 5 minutes

---

#### Checkpoint 5.2: Database Migration
- [ ] Run `npx prisma generate` to update Prisma Client
- [ ] Run `npx prisma migrate dev --name add_user_team_models` if needed
- [ ] Verify migration completed successfully

**Estimated Time**: 5 minutes

---

#### Checkpoint 5.3: Code Quality Validation
- [ ] Run `npm run lint:fix` to check ESLint
- [ ] Fix any linting errors
- [ ] Verify all imports/exports are correct
- [ ] Verify asyncWrapper is used in all controllers
- [ ] Verify Zod validation in all middleware

**Estimated Time**: 10 minutes

---

#### Checkpoint 5.4: Manual Testing (Optional)
- [ ] Test GET /api/users (empty list initially)
- [ ] Test POST /api/users (create user)
- [ ] Test GET /api/users/:id (get created user)
- [ ] Test PUT /api/users/:id (update user)
- [ ] Test DELETE /api/users/:id (delete user)
- [ ] Repeat for teams and team-members
- [ ] Test error cases (duplicate email, invalid data)

**Estimated Time**: 20 minutes

---

## Total Estimated Time
**3 hours** (including testing and validation)

---

## Dependencies

- Prisma Client must be installed
- Zod must be installed
- Express.js must be configured
- Database must be running
- Existing patterns from productModel, categoryController, etc.

---

## Completion Criteria

All checkpoints must be completed and marked with [x]. Additional requirements:

1. All ESLint checks pass
2. No console errors when running the server
3. All routes registered correctly
4. Database migration completed
5. Code follows existing patterns
6. Error handling implemented properly
7. Validation schemas work correctly
8. Relations (include) work in queries

---

## Notes

- Follow the exact patterns from existing controllers (productController.js)
- Use the same error handling approach (asyncWrapper)
- Use the same response format (successMessage/errorMessage)
- Keep code DRY and maintainable
- Comment complex logic where necessary

---

**Status**: ⏸️ Awaiting User Approval

**Next Step**: Once approved, begin implementation starting with Phase 1, Checkpoint 1.1
