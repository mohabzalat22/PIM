# Product Import/Export Feature - Implementation Plan

## Feature Overview
Add comprehensive import/export functionality for products with all related data (assets, categories, attributes, etc.) supporting JSON, XML, and CSV formats.

## Analysis

### Current State
- Products have multiple related entities through Prisma relationships
- No import/export functionality exists currently
- Frontend has product listing and detail views

### Related Entities to Export
1. **Direct Relations:**
   - ProductAsset → Asset (images, videos, etc.)
   - ProductCategory → Category → CategoryTranslation
   - ProductAttributeValue → Attribute, StoreView
   - AttributeSet → AttributeSetGroup → AttributeGroup

2. **Nested Relations:**
   - Asset details (url, type, etc.)
   - Category hierarchy and translations
   - Attribute metadata (type, scope, inputType)
   - Store view and locale information

##expected to see in the frontend export button to be able to export json ,xml,csv

### Technical Approach

#### Backend Implementation
1. **Export Endpoint** (`GET /api/products/export`)
   - Query products with all includes
   - Transform data to flatten nested relations
   - Support format parameter (json, xml, csv, yaml)
   - Stream large datasets

2. **Import Endpoint** (`POST /api/products/import`)
   - Validate file format
   - Parse uploaded file (json, xml, csv, yaml)
   - Validate data structure
   - Create/update products with relations
   - Handle conflicts (skip, update, or error)

#### Frontend Implementation
1. **Export UI Component**
   - Export button with format dropdown
   - Progress indicator for large exports
   - Download trigger

2. **Import UI Component**
   - File upload area
   - Format detection
   - Preview before import
   - Progress tracking
   - Error reporting

## File Changes Required

### Backend Files to Create/Modify
1. **New Files:**
   - `src/controllers/productExportController.js` - Export logic
   - `src/controllers/productImportController.js` - Import logic
   - `src/middlewares/validateProductImport.js` - Import validation
   - `src/utils/exportFormatter.js` - Format conversion (JSON, XML, CSV)
   - `src/utils/importParser.js` - Parse different formats

2. **Modified Files:**
   - `src/routes/productRoute.js` - Add export/import routes
   - `src/models/productModel.js` - Add method for complete product data

### Frontend Files to Create/Modify
1. **New Files:**
   - `client/src/components/ProductExport.tsx` - Export UI component
   - `client/src/components/ProductImport.tsx` - Import UI component
   - `client/src/services/productExport.service.ts` - Export service
   - `client/src/services/productImport.service.ts` - Import service
   - `client/src/api/productExport.ts` - Export API calls
   - `client/src/api/productImport.ts` - Import API calls

2. **Modified Files:**
   - `client/src/pages/Products.tsx` - Add export/import buttons

## Data Structure Example

### Export Format (JSON)
```json
{
  "products": [
    {
      "id": 1,
      "sku": "PROD-001",
      "name": "Product Name",
      "productType": "SIMPLE",
      "attributeSet": {
        "id": 1,
        "name": "Default"
      },
      "assets": [
        {
          "position": 1,
          "type": "image",
          "asset": {
            "url": "https://...",
            "type": "IMAGE"
          }
        }
      ],
      "categories": [
        {
          "category": {
            "id": 1,
            "name": "Electronics",
            "translations": [...]
          }
        }
      ],
      "attributes": [
        {
          "attribute": {
            "code": "color",
            "label": "Color"
          },
          "valueString": "Red",
          "storeView": null
        }
      ]
    }
  ]
}
```

## Implementation Phases

### Phase 1: Backend Export
1. Create export controller with full data query
2. Implement JSON formatter (native)
3. Implement XML formatter (using xml-js)
4. Implement CSV formatter (using fast-csv, flattened structure)
5. Implement YAML formatter (using js-yaml)
6. Add export route

### Phase 2: Backend Import
1. Create import controller
2. Implement JSON parser (native)
3. Implement XML parser (using xml-js)
4. Implement CSV parser (using fast-csv)
5. Implement YAML parser (using js-yaml)
6. Add validation middleware
7. Handle relation creation/updates

### Phase 3: Frontend Export
1. Create export component
2. Add format selector
3. Implement download functionality
4. Add to Products page

### Phase 4: Frontend Import
1. Create import component
2. Add file upload
3. Implement preview
4. Add progress tracking
5. Add error handling

## Security & Performance Considerations

### Security
- Validate file size limits (max 50MB)
- Sanitize uploaded data
- Require authentication
- Rate limiting on import endpoint

### Performance
- Stream large exports
- Batch import operations
- Add import queue for large files
- Implement pagination for exports

## Testing Strategy
- Test export with various data volumes
- Test import with valid/invalid data
- Test all three formats
- Test relation handling
- Test error scenarios

## Estimated Complexity
- **Backend Export**: Medium (nested relations, multiple formats)
- **Backend Import**: High (validation, relation handling, conflict resolution)
- **Frontend Export**: Low (simple UI + download)
- **Frontend Import**: Medium (file upload, preview, error handling)

## Dependencies
- **Backend**: 
  - `fast-csv` - CSV parsing and generation (efficient streaming support)
  - `xml-js` - Convert between XML and JSON (both directions)
  - `js-yaml` - YAML parsing and generation
  - `multer` - File upload middleware
- **Frontend**: 
  - `file-saver` - Trigger file downloads in browser
  - `papaparse` - CSV preview and client-side parsing

---

**Created**: December 3, 2025
**Status**: Pending Approval
