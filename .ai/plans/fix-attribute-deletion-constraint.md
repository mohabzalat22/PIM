# Plan: Fix Attribute Deletion Foreign Key Constraint Error

## Problem
When trying to delete an Attribute, a foreign key constraint error occurs:
```
Foreign key constraint violated on the constraint: `AttributeSetGroupAttribute_attributeId_fkey`
```

## Root Cause Analysis
The `AttributeSetGroupAttribute` model has a relation to `Attribute` via `attributeId`, but there's no `onDelete` behavior specified. By default, Prisma uses `Restrict`, which prevents deletion when there are references.

Looking at the schema:
```prisma
model AttributeSetGroupAttribute {
  attributeId        Int
  attribute      Attribute  @relation(fields: [attributeId], references: [id])
  // Missing onDelete behavior - defaults to Restrict
}
```

## Solution Strategy
We need to add `onDelete: Cascade` to the attribute relation in `AttributeSetGroupAttribute` model. This will automatically delete all `AttributeSetGroupAttribute` records when an Attribute is deleted, which is the correct behavior since these are junction/mapping records.

Similarly, we should check other relations:
- `AttributeSetAttribute` - also has attribute relation (already missing onDelete)
- `ProductAttributeValue` - also has attribute relation (already missing onDelete)

## Implementation Steps

### 1. Update Prisma Schema
- Add `onDelete: Cascade` to `AttributeSetGroupAttribute.attribute` relation
- Add `onDelete: Cascade` to `AttributeSetAttribute.attribute` relation  
- Add `onDelete: Cascade` to `ProductAttributeValue.attribute` relation

### 2. Create and Apply Migration
- Run `npx prisma migrate dev --name fix_attribute_deletion_cascade`
- This will create the migration and apply it to the database

### 3. Test the Fix
- Try deleting an attribute that has references
- Verify that related records in junction tables are deleted automatically
- Verify that the delete operation succeeds

## Files to Modify
1. `prisma/schema.prisma` - Add onDelete behavior to Attribute relations

## Expected Outcome
- Attributes can be deleted without foreign key constraint errors
- Related records in `AttributeSetGroupAttribute`, `AttributeSetAttribute`, and `ProductAttributeValue` are automatically deleted when an Attribute is deleted
- No code changes needed in controllers or models

## Considerations
- This is a breaking change if there's existing code that relies on the Restrict behavior
- All related data will be permanently deleted when an Attribute is deleted
- Users should be warned before deleting attributes that have associated data

## Timeline
- Schema update: 2 minutes
- Migration: 1 minute  
- Testing: 5 minutes
- **Total: ~8 minutes**
