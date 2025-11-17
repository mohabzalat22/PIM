# JavaScript Implementation Workflow

This workflow ensures code quality and validation before delivering results for the xstore backend (Express.js API).

## Pre-Implementation Checklist

Before making any code changes:

1. **Understand Requirements**
   - Clarify the feature/bug being addressed
   - Identify affected files and components
   - Consider impact on existing functionality

2. **Review Context**
   - Check relevant models in `src/models/`
   - Review related controllers in `src/controllers/`
   - Examine middleware validators in `src/middlewares/`
   - Check routes in `src/routes/`
   - Review Prisma schema if database changes are needed

## Implementation Steps

### 1. Code Implementation

- Follow existing code patterns and conventions
- Use ES6 modules (import/export)
- Maintain consistent error handling patterns , exmaple asyncWrapper
- Follow RESTful API conventions
- Use Zod for validation schemas
- Implement proper async/await error handling

### 2. ESLint Setup and Validation

#### Install ESLint (if not already installed)

```bash
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import
```

#### Initialize ESLint Configuration

Create `.eslintrc.json` with recommended settings:

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-undef": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "arrow-parens": ["error", "always"],
    "no-var": "error",
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"]
  }
}
```

### 3. Run ESLint Validation

Before providing results, run:

```bash
# Shortcut
npm run dev
# Check specific file
npx eslint src/path/to/file.js

# Check all JavaScript files
npx eslint src/**/*.js

# Auto-fix issues where possible
npx eslint src/**/*.js --fix
```

### 4. Code Quality Checks

- **Syntax Validation**: Ensure no syntax errors
- **Linting**: All ESLint rules pass
- **Import/Export**: Verify all imports are correct
- **Error Handling**: All async functions have proper try-catch or error handling
- **Validation**: Middleware validators are in place for routes
- **Consistency**: Code follows existing patterns in the codebase

### 5. Testing Checklist

Before marking as complete:

- [ ] ESLint passes with no errors
- [ ] File imports are correct
- [ ] Prisma client usage is correct (if applicable)
- [ ] Validation middleware follows Zod patterns
- [ ] Error responses use errorHandler middleware
- [ ] Route registration follows existing patterns
- [ ] No console.log statements (use proper logging if needed)
- [ ] Async/await used correctly with error handling

## Standard Patterns

### Controller Pattern
```javascript
export const getItems = async (req, res, next) => {
  try {
    // Implementation
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
```

### Validation Pattern
```javascript
import { z } from "zod";

export const schema = z.object({
  field: z.string().min(1),
});

export const validateItem = (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
```

### Route Pattern
```javascript
import express from "express";
import { getItems, createItem } from "../controllers/itemController.js";
import { validateItem } from "../middlewares/validateItem.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", validateItem, createItem);

export default router;
```

## File Organization

- **Controllers** (`src/controllers/`): Business logic and request handling
- **Models** (`src/models/`): Prisma client operations and data access
- **Middlewares** (`src/middlewares/`): Validation, authentication, error handling
- **Routes** (`src/routes/`): API endpoint definitions
- **Utils** (`src/utils/`): Helper functions and utilities

## NPM Scripts to Add

Add these to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "validate": "npm run lint && echo 'Validation passed!'"
  }
}
```

## Workflow Summary

1. ✅ Understand requirements
2. ✅ Implement feature/fix following patterns
3. ✅ Run ESLint validation
4. ✅ Fix any linting issues
5. ✅ Verify imports and syntax
6. ✅ Test error handling
7. ✅ Provide result with validation confirmation

## Validation Command

Before delivering any JavaScript code changes, always run:

```bash
npx eslint src/**/*.js --fix && echo "✅ Validation passed"
```

If validation fails, fix all issues before providing the final result.
