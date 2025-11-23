# Plan: Product Workflow Implementation

**Date Created**: 2025-11-23  
**Status**: Planning  
**Estimated Complexity**: Medium

## Overview

Implement a product workflow system with 5 status stages (DRAFT → ENRICHMENT → VALIDATION → APPROVAL → PUBLISHING) and user assignment capabilities. This will enable tracking products through their lifecycle from initial creation to final publishing.

## Requirements

- Add workflow status enum with 5 stages: DRAFT, ENRICHMENT, VALIDATION, APPROVAL, PUBLISHING
- Add status field to Product model (defaults to DRAFT)
- Add assignedTo field to Product model (optional user assignment)
- Update backend API to support status filtering and user assignment
- Update frontend to display status badges and allow status transitions
- Add user assignment dropdown in product detail page
- Add status filter in product list page

## Affected Components

### Backend

- [x] **Models**: `src/models/productModel.js` - Add status and assignedTo filtering
- [x] **Controllers**: `src/controllers/productController.js` - Support status in filters
- [x] **Routes**: No changes needed (existing routes support new fields)
- [x] **Middleware**: `src/middlewares/validateProduct.js` - Add status and assignedTo validation

### Database

- [x] **Schema changes**: Add ProductStatus enum and fields to Product model
- [x] **Migration required**: Yes - add status and assignedTo fields
- [x] **Seed data updates**: Update product factory to include status field

### Frontend

- [x] **Interfaces**: `client/src/interfaces/product.interface.ts` - Add status and assignedTo
- [x] **API calls**: No changes needed (existing API supports new fields)
- [x] **Components**: 
  - `client/src/pages/Product.tsx` - Add status filter and column
  - `client/src/pages/ProductDetail.tsx` - Add status transition controls and user assignment
- [x] **State management**: No changes needed

## Dependencies

- Existing User model (already exists in schema)
- No external packages needed
- Related to existing product management features

## Implementation Strategy

### Phase 1: Database Schema (Backend)
1. Add ProductStatus enum to Prisma schema
2. Add `status` field to Product model (default: DRAFT)
3. Add `assignedTo` field to Product model (optional relation to User)
4. Create and run migration
5. Update seed file to include status field

### Phase 2: Backend Implementation
1. Update `productModel.js` to support status filtering
2. Update `productController.js` to handle status in query params
3. Update validation middleware to validate status and assignedTo fields
4. Test API endpoints with new fields

### Phase 3: Frontend Implementation
1. Update product interface with status and assignedTo fields
2. Add status column to product list table
3. Add status filter dropdown in filter panel
4. Update ProductDetail page:
   - Add status badge display
   - Add status transition dropdown/buttons
   - Add user assignment dropdown
5. Test UI integration

### Phase 4: Testing
1. Test status filtering in product list
2. Test status transitions in product detail
3. Test user assignment functionality
4. Verify database constraints and defaults

## Potential Risks

- **Risk 1**: Status transitions might need validation rules (e.g., can't skip from DRAFT to PUBLISHING)
  - **Mitigation**: Start with simple implementation, add validation rules later if needed
  
- **Risk 2**: User assignment requires User data to be available
  - **Mitigation**: User model already exists, just need to fetch users for dropdown

## Success Criteria

- [x] Database schema updated with status and assignedTo fields
- [x] Products default to DRAFT status when created
- [x] Product list page shows status column and filter
- [x] Product detail page allows status transitions
- [x] Product detail page allows user assignment
- [x] All existing functionality remains working
- [x] ESLint validation passes
