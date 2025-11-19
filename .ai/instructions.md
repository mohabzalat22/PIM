# XStore - Product Information Management (PIM) System

## Project Overview

XStore is a comprehensive Product Information Management (PIM) system built with a modern full-stack architecture. It's designed to manage products, categories, attributes, assets, and multi-store configurations with support for internationalization and flexible attribute systems similar to Magento's Entity-Attribute-Value (EAV) model.

---

## 🔄 AI Assistant Workflow & Rules

### **IMPORTANT**: Before implementing any feature or fix, you MUST follow these guidelines:

1. **📋 Implementation Rules** (`.ai/rules/implementation.md`)
   - Follow the 7-step structured workflow
   - Create a plan in `.ai/plans/` directory
   - Create a task with checkpoints in `.ai/tasks/` directory
   - **⚠️ STOP and request user validation before proceeding**
   - Only implement after receiving approval
   - Mark checkpoints as completed during implementation
   - Provide completion summary when done

2. **✅ Code Quality Workflow** (`.ai/workflow.md`)
   - Follow existing code patterns and conventions
   - Use ESLint validation before delivering results
   - Ensure all imports/exports are correct
   - Implement proper error handling (asyncWrapper pattern)
   - Use Zod for validation schemas
   - Run `npm run lint:fix` before completion

### Quick Workflow Reference

```
Request → Create Plan → Create Task → Get Approval ⚠️ → Implement → Mark Checkpoints → Complete
```

**Never skip the validation step. Always wait for user approval before implementation.**

---

## Tech Stack

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js v5
- **Database ORM**: Prisma with PostgreSQL
- **Validation**: Zod
- **Additional**: CORS enabled for cross-origin requests

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM v7
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables
- **Animations**: Framer Motion
- **Authentication**: Clerk
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: Lucide React

### Development Tools
- **Package Manager**: npm
- **Node Version**: Compatible with ES Modules and modern Node.js
- **TypeScript**: v5.9.3
- **Database Migrations**: Prisma Migrate
- **Seeding**: Custom factory pattern with Faker.js

## Architecture Patterns

### Backend Architecture (MVC Pattern)
```
src/
├── app.js                 # Main Express application & route registration
├── controllers/           # Request handlers & business logic
├── models/               # Prisma database queries & data access
├── routes/               # API endpoint definitions
├── middlewares/          # Validation & error handling
└── utils/                # Helper functions & utilities
```

### Frontend Architecture (Feature-Based)
```
client/src/
├── main.tsx              # Application entry point
├── App.tsx               # Route configuration
├── api/                  # HTTP client & API endpoints
├── services/             # Business logic layer
├── pages/                # Route components
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── context/              # React Context providers
├── interfaces/           # TypeScript interfaces
├── types/                # TypeScript types
├── lib/                  # Utility libraries
└── layout/               # Layout components
```

## Database Schema Design

### Core Entities

#### Products
- **ProductType**: SIMPLE, CONFIGURABLE, BUNDLE, VIRTUAL, DOWNLOADABLE
- Supports flexible attribute sets
- EAV pattern for dynamic attributes
- Multi-category assignment
- Asset management (images, videos, PDFs, manuals)

#### Attribute System
- **Attributes**: Flexible metadata with multiple data types (BOOLEAN, STRING, INT, DECIMAL, TEXT, JSON)
- **Attribute Sets**: Groups of attributes for different product types
- **Attribute Groups**: Organized sections within attribute sets
- **Input Types**: TEXT, SELECT, MULTISELECT, DATE, MEDIA
- **Scopes**: Global or per-store-view values

#### Store Management
- **Store**: Top-level store entity
- **StoreView**: Store variants with locale support
- **Locale**: Language/region configuration (unique per store view)

#### Category System
- Hierarchical structure (parent-child relationships)
- Translations per store view
- Many-to-many relationship with products

#### Assets
- Centralized asset storage (images, videos, documents)
- Position-based ordering
- Type categorization
- Reusable across multiple products

## API Design Patterns

### RESTful Endpoints
All endpoints follow REST conventions:
- `GET /api/{resource}` - List with pagination & filtering
- `GET /api/{resource}/:id` - Get single item
- `POST /api/{resource}` - Create new item
- `PUT /api/{resource}/:id` - Update existing item
- `DELETE /api/{resource}/:id` - Delete item

### Available Resources
- `/api/products`
- `/api/attributes`
- `/api/attribute-sets`
- `/api/attribute-groups`
- `/api/product-attributes`
- `/api/assets`
- `/api/product-assets`
- `/api/categories`
- `/api/category-translations`
- `/api/product-categories`
- `/api/stores`
- `/api/store-views`
- `/api/locales`

### Response Format
```javascript
// Success Response
{
  success: true,
  statusCode: 200,
  message: "Success message",
  data: {...},
  meta: {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10
  }
}

// Error Response
{
  success: false,
  statusCode: 4xx/5xx,
  message: "Error message",
  error: {...}
}
```

### Pagination & Filtering
- Products support advanced filtering:
  - Search by SKU
  - Filter by product type
  - Filter by category
  - Filter by attribute values (EAV filtering)
  - Sort by multiple fields
  - Date range filtering for DATE type attributes

## Code Conventions

### Backend

#### File Naming
- Controllers: `{entity}Controller.js`
- Models: `{entity}Model.js`
- Routes: `{entity}Route.js`
- Middlewares: `validate{Entity}.js`

#### Code Style
- Use ES6+ features (async/await, arrow functions, destructuring)
- Use ES Modules (import/export)
- Consistent error handling with middleware
- Validation before database operations
- Use Prisma Client for all database operations

#### Validation Pattern
```javascript
// Zod schema definition
const schema = z.object({
  field: z.string().min(1, "Error message")
});

// Middleware validation
export const validateEntity = async (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.json(errorMessage("Validation failed", 500, result.error));
  }
  next();
};
```

#### Controller Pattern
```javascript
export const getEntities = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const [items, total] = await findAll(skip, limit);
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
  
  res.json(successMessage(items, 200, "Success message", meta));
};
```

### Frontend

#### File Naming
- Components: PascalCase (e.g., `ProductDetail.tsx`)
- Services: camelCase with `.service.ts` suffix
- APIs: camelCase with `.ts` suffix
- Interfaces: camelCase with `.interface.ts` suffix

#### Code Style
- TypeScript strict mode enabled
- Use functional components with hooks
- Props interfaces defined for all components
- Service layer pattern for API calls
- Consistent error handling

#### Service Pattern
```typescript
export const EntityService = {
  async getAll(page: number, limit: number, filters?: Filters) {
    return EntityApi.getAll(page, limit, filters);
  },
  async getById(id: number) {
    return EntityApi.getById(id.toString());
  },
  async create(payload: Partial<Entity>) {
    return EntityApi.create(payload);
  },
  async update(id: number, payload: Partial<Entity>) {
    return EntityApi.update(id.toString(), payload);
  },
  async remove(id: number) {
    return EntityApi.delete(id.toString());
  }
};
```

## Development Workflow

### Setup
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install

# Setup environment variables
# Create .env file with DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/xstore"


# Create .env file in client/ with Clerk credentials
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_key"

# Run Prisma migrations
npx prisma migrate dev

# Seed database
npm run seed
```

### Running the Application
```bash
# Terminal 1 - Backend (port 3000)
npm run dev

# Terminal 2 - Frontend (port 5173)
cd client && npm run dev
```

### Database Operations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Key Features & Implementation Details

### 1. EAV (Entity-Attribute-Value) System
The product attribute system uses EAV pattern:
- Attributes can be added dynamically without schema changes
- Values stored in type-specific columns (`valueString`, `valueInt`, `valueDecimal`, `valueText`, `valueBoolean`, `valueJson`)
- Supports global and store-view scoped values
- Complex filtering with attribute-based queries

### 2. Multi-Store Support
- Store → StoreView → Locale hierarchy
- Category translations per store view
- Attribute values can be scoped to store views
- Each store view has a unique locale

### 3. Attribute Sets
Similar to Magento's approach:
- Products assigned to attribute sets
- Attribute sets contain groups
- Groups organize attributes logically
- Can be product-type specific
- Default attribute sets available

### 4. Asset Management
- Centralized asset storage
- Multiple assets per product
- Position-based ordering
- Type categorization (image, video, pdf, manual)
- Reusable across products

### 5. Authentication
- Clerk integration for user management
- Protected routes with `<SignedIn>` wrapper
- Public routes: `/`, `/sign-in`, `/sign-up`
- All dashboard routes require authentication

## Important Implementation Notes

### Backend

1. **Error Handling**: Use `asyncWrapper` utility to catch async errors
2. **Validation**: Always validate input before database operations
3. **Unique Constraints**: Check for unique violations (SKU, codes, etc.)
4. **Relations**: Use Prisma's `include` to load related data
5. **Pagination**: Always implement pagination for list endpoints
6. **CORS**: Frontend runs on port 5173, backend on port 3000

### Frontend

1. **API Client**: Centralized axios instance in `apiClient.ts`
2. **Type Safety**: Define interfaces for all API responses
3. **Error Handling**: Consistent error handling in services
4. **Routing**: Protected routes check authentication status
5. **Theme**: Custom theme provider with light/dark mode support
6. **UI Components**: Use Radix UI + Tailwind for consistent design

### Database

1. **OnDelete Behavior**:
   - `SetNull`: Optional relations (e.g., attributeSet on Product)
   - `Cascade`: Dependent data (e.g., AttributeGroup deletes with AttributeSet)
   - Default: Restrict deletion if references exist

2. **Unique Constraints**: Composite unique constraints prevent duplicates:
   - `[productId, assetId, type]` in ProductAsset
   - `[categoryId, storeViewId]` in CategoryTranslation
   - `[productId, categoryId]` in ProductCategory
   - `[attributeSetId, attributeId]` in AttributeSetAttribute

3. **Timestamps**: All models have `createdAt` and `updatedAt` (auto-managed)

## Common Tasks & Examples

### Adding a New Entity

1. **Create Prisma Model** in `schema.prisma`
2. **Run Migration**: `npx prisma migrate dev --name add_entity`
3. **Create Factory** in `prisma/factories/` for seeding
4. **Create Backend Files**:
   - Model: `src/models/entityModel.js`
   - Controller: `src/controllers/entityController.js`
   - Route: `src/routes/entityRoute.js`
   - Middleware: `src/middlewares/validateEntity.js`
5. **Register Route** in `src/app.js`
6. **Create Frontend Files**:
   - Interface: `client/src/interfaces/entity.interface.ts`
   - API: `client/src/api/entity.ts`
   - Service: `client/src/services/entity.service.ts`
   - Page: `client/src/pages/Entity.tsx`
7. **Add Route** in `client/src/App.tsx`

### Querying with Relations
```javascript
// Include related data
const product = await prisma.product.findUnique({
  where: { id },
  include: {
    productAssets: {
      include: { asset: true }
    },
    productCategories: {
      include: { category: true }
    },
    productAttributeValues: {
      include: { attribute: true, storeView: true }
    },
    attributeSet: {
      include: {
        groups: true,
        setAttributes: { include: { attribute: true } }
      }
    }
  }
});
```

### Complex Filtering Example
```javascript
// Filter products by attributes
const products = await prisma.product.findMany({
  where: {
    productAttributeValues: {
      some: {
        attributeId: attributeId,
        valueString: { contains: searchTerm }
      }
    }
  }
});
```

## Testing Strategy

Currently, the project uses manual testing. For future implementation:
- Unit tests for utilities and helpers
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test database setup with factories

## Deployment Considerations

1. **Environment Variables**: Set up production env vars
2. **Database**: Use connection pooling for PostgreSQL
3. **Build**: Run `npm run build` for frontend
4. **Static Files**: Serve frontend build from backend
5. **CORS**: Update CORS settings for production domains
6. **Migrations**: Run migrations before deployment
7. **Seeding**: Don't run seed in production

## Performance Optimization

1. **Database**:
   - Add indexes on frequently queried fields
   - Use `select` to limit returned fields
   - Implement cursor-based pagination for large datasets
   - Use database connection pooling

2. **Frontend**:
   - Lazy load routes and heavy components
   - Implement virtual scrolling for large lists
   - Cache API responses where appropriate
   - Optimize images and assets

## Troubleshooting

### Common Issues

1. **Prisma Client Out of Sync**: Run `npx prisma generate`
2. **Migration Conflicts**: Reset with `npx prisma migrate reset`
3. **Port Already in Use**: Kill process or change port
4. **CORS Errors**: Check origin in `app.js` matches frontend URL
5. **Clerk Authentication**: Verify PUBLISHABLE_KEY is set correctly

## Future Enhancements

- [ ] Bulk product import/export
- [ ] Advanced product search with Elasticsearch
- [ ] Product variants (configurable products)
- [ ] Media gallery with image optimization
- [ ] Attribute validation rules
- [ ] Product relationships (related, upsell, cross-sell)
- [ ] Inventory management
- [ ] Price management per store view
- [ ] Product reviews and ratings
- [ ] Workflow and approval system
- [ ] Audit logs and change history
- [ ] REST API documentation (Swagger/OpenAPI)
- [ ] GraphQL API option
- [ ] Webhooks for external integrations

## Resources & Documentation

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **Radix UI**: https://www.radix-ui.com
- **Tailwind CSS**: https://tailwindcss.com
- **Clerk Docs**: https://clerk.com/docs
- **Zod Validation**: https://zod.dev

---

## 📚 AI Assistant Reference Files

When working on this project, always consult these files:

### Workflow & Rules
- **`.ai/workflow.md`** - JavaScript implementation workflow with ESLint validation
- **`.ai/rules/implementation.md`** - Complete implementation rules and workflow steps
- **`.ai/plans/`** - Directory for implementation plans (create before implementing)
- **`.ai/tasks/`** - Directory for tasks with checkpoints (create before implementing)

### Implementation Process
1. Read `.ai/rules/` for the complete workflow
2. Follow `.ai/workflow.md` for code quality standards
3. Create plan and task files before starting
4. Request user validation before implementation
5. Update checkpoints as you progress
6. Run ESLint validation before completion

### Key Reminders
- ⚠️ **Always create a plan and task before implementing**
- ⚠️ **Always request user approval before proceeding**
- ✅ **Always run `npm run lint:fix` before marking complete**
- ✅ **Always update task checkpoints during implementation**
- ✅ **Always provide a completion summary**

---

**Last Updated**: November 17, 2025  
**Author**: moh@b  
**License**: MIT
