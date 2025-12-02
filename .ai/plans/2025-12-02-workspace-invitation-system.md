# Plan: Workspace Invitation System

**Date Created**: 2025-12-02
**Status**: Planning
**Estimated Complexity**: High

## Overview
Implement a complete workspace invitation system where workspace owners can send invitation links to users with specific roles (ADMIN/MEMBER). The system will handle token generation, email invitations, link validation, user signup/signin, subscription checks, and automatic workspace membership assignment.

## Requirements
- Workspace owners can generate invitation links with role assignment (ADMIN/MEMBER)
- Invitation links contain secure tokens that encode workspace and role information
- Tokens have expiration dates and can only be used once
- System validates invitation tokens before processing
- Auto-detect if invited user already exists (auto sign-in) or needs to sign up
- Check owner's subscription status before activating membership
- Prevent expired or invalid invitations from being accepted
- Redirect users to workspace dashboard after successful acceptance
- Store invitation history in database (WorkspaceInvite model already exists)

## Affected Components

### Backend
- [x] Models: 
  - `workspaceInviteModel.js` - Create/validate/mark-used invitations
  - `workspaceModel.js` - May need updates for membership checks
  - `subscriptionModel.js` - Check subscription validity
  
- [x] Controllers:
  - `workspaceInviteController.js` - Handle invitation CRUD and validation
  - `workspaceMemberController.js` - Handle accepting invitations and creating memberships
  
- [x] Routes:
  - `workspaceInviteRoute.js` - POST /create, GET /validate/:token, POST /accept
  - Update `workspaceRoute.js` if needed
  
- [x] Middleware:
  - `validateWorkspaceInvite.js` - Validate invitation creation/acceptance
  - `authMiddleware.js` - May need updates for Clerk integration
  
- [x] Validation:
  - Zod schemas for invitation creation (email, role, workspaceId)
  - Token validation schema
  - Acceptance validation (token, userId from Clerk)

### Database
- [x] Schema changes needed: None - WorkspaceInvite model already exists
- [x] Migration required: No
- [x] Seed data updates: Consider adding sample invitations for testing

### Frontend
- [x] Components:
  - `InviteMemberDialog.tsx` - Modal for workspace owners to send invitations
  - `AcceptInvitation.tsx` - Page for processing invitation acceptance
  
- [x] API calls:
  - `workspaceInvite.ts` - API client for invitation endpoints
  
- [x] State management:
  - May use React Router for redirect after acceptance
  - Toast notifications for success/error states
  
- [x] Routing:
  - `/workspace/:workspaceName/invite` - Public route for accepting invitations
  - Protected routes in workspace dashboard

## Dependencies
- Existing WorkspaceInvite, Workspace, WorkspaceMember, User, Subscription models
- Clerk for authentication (clerkId in User model)
- JWT or crypto for secure token generation
- Email service for sending invitation links (future enhancement)
- Date utilities for expiration checks

## Implementation Strategy

### Phase 1: Backend - Token & Invitation Management
1. Create workspaceInviteModel.js with:
   - `createInvitation(workspaceId, email, role, expiresInHours)` - Generate token and save
   - `findInvitationByToken(token)` - Retrieve invitation details
   - `validateInvitation(token)` - Check if token is valid, not expired, not used
   - `markInvitationAsUsed(token, userId)` - Mark token as consumed
   
2. Create token utility in utils/:
   - Generate secure tokens (crypto.randomBytes or JWT)
   - Include workspace ID and role in token
   
3. Create workspaceInviteController.js:
   - `createInvitation` - Owner creates invitation link
   - `validateToken` - Check if token is valid (for frontend to verify before signup)
   - `acceptInvitation` - Process invitation acceptance

### Phase 2: Backend - Validation & Security
1. Create validateWorkspaceInvite.js middleware:
   - Validate invitation creation request
   - Validate token format and presence
   
2. Add subscription check utility:
   - Check if owner's subscription is active and not expired
   - Verify subscription allows adding more members

### Phase 3: Backend - Membership Assignment
1. Update/create workspaceMemberModel.js:
   - `createMembership(workspaceId, userId, role)` - Add user to workspace
   - `checkExistingMembership(workspaceId, userId)` - Prevent duplicate memberships
   
2. Implement acceptance flow in controller:
   - Validate token
   - Check subscription status
   - Check if user already member
   - Create membership
   - Mark invitation as used
   - Return success with workspace details

### Phase 4: Frontend - Invitation UI
1. Create InviteMemberDialog component:
   - Form with email input and role selector
   - Generate invitation link button
   - Copy link to clipboard functionality
   - Display generated link
   
2. Create invitation service:
   - API calls for creating invitations
   - Generate shareable link URL

### Phase 5: Frontend - Acceptance Flow
1. Create AcceptInvitation page (`/workspace/invite`):
   - Extract token from URL query params
   - Validate token on mount
   - Check if user is signed in (Clerk)
   - If signed in: auto-accept invitation
   - If not signed in: redirect to sign-up with token in URL
   
2. Handle post-signup redirect:
   - After Clerk signup, redirect back to acceptance page
   - Process invitation acceptance
   - Redirect to workspace dashboard

### Phase 6: Frontend - Routing & Integration
1. Add public route for invitation acceptance
2. Update workspace dashboard to show members
3. Add invite button for workspace owners
4. Handle success/error states with toasts

## Potential Risks
- **Risk 1: Token Security** - Tokens must be cryptographically secure and unpredictable
  - Mitigation: Use crypto.randomBytes(32) or signed JWTs
  
- **Risk 2: Race Conditions** - Multiple users using same token simultaneously
  - Mitigation: Database transaction for checking and marking token as used
  
- **Risk 3: Expired Subscriptions** - Owner's subscription expires after invitation sent
  - Mitigation: Check subscription status at acceptance time, not creation time
  
- **Risk 4: Email Validation** - Invalid or malicious email addresses
  - Mitigation: Use Zod email validation, consider email verification
  
- **Risk 5: Clerk Integration** - Handling existing vs new users
  - Mitigation: Use Clerk's user existence check API if available

## Success Criteria
- [x] Workspace owners can generate invitation links with role selection
- [x] Invitation links contain secure, time-limited tokens
- [x] Tokens are validated for expiration and single-use
- [x] System detects if invited user exists and handles appropriately
- [x] Subscription status checked before membership activation
- [x] Users successfully added to workspace with correct role
- [x] Invalid/expired invitations are rejected with clear error messages
- [x] Frontend provides smooth UX for invitation flow
- [x] All endpoints follow standard response format
- [x] ESLint validation passes with no errors
