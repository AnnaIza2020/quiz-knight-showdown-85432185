
# Contributing to Discord Game Show

Thank you for your interest in contributing to our Discord Game Show project! This document provides guidelines on how to contribute effectively.

## Adding New Types

1. **Location**: All types should be defined in the `src/types/` directory:
   - `game-types.ts` - Core game-related types
   - `round-settings.ts` - Types related to round configuration
   - `availability-types.ts` - Types for player availability calendar
   - Add new files for logically grouped types

2. **Exporting Types**:
   - Use `export type` for type definitions to avoid runtime overhead
   - Example: `export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe' | '';`
   - For interfaces: `export interface PlayerAvailability { ... }`

3. **Type Naming Conventions**:
   - Use PascalCase for interface and type names
   - Use descriptive names that clearly indicate the purpose
   - For enums, use UPPER_CASE for values

4. **Documentation**:
   - Add JSDoc comments for complex types
   - Specify required and optional fields clearly
   - Include example usage for non-trivial types

## Generating and Updating Database Types

We use Supabase for our database, and it's important to keep our TypeScript types in sync with the database schema:

1. **Installing Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Generating Types**:
   ```bash
   supabase gen types typescript --project-id jkkvxlojgxlmbypulvtu > src/lib/database.types.ts
   ```

3. **After Schema Changes**:
   - Run migrations using SQL files in `supabase/migrations/`
   - Regenerate types using the command above
   - Update any dependent interfaces or types in your codebase

4. **Using Generated Types**:
   ```typescript
   import { Database } from '@/lib/database.types';
   
   type Players = Database['public']['Tables']['players']['Row'];
   ```

## Writing Tests

### Testing Hooks

For testing React hooks, we use React Testing Library and jest:

1. **File Structure**:
   - Place hook tests in `src/hooks/__tests__/`
   - Name the test file the same as the hook file with `.test.ts` extension

2. **Example Hook Test**:
   ```typescript
   import { renderHook, act } from '@testing-library/react-hooks';
   import { useAvailability } from '../useAvailability';
   
   // Mock dependencies
   jest.mock('@/lib/supabase', () => ({
     supabase: {
       from: jest.fn().mockReturnThis(),
       select: jest.fn().mockResolvedValue({ data: [], error: null }),
       upsert: jest.fn().mockResolvedValue({ data: null, error: null })
     }
   }));
   
   describe('useAvailability', () => {
     test('should initialize with empty state', () => {
       const { result } = renderHook(() => useAvailability());
       
       expect(result.current.playerAvailability).toEqual([]);
       expect(result.current.isLoading).toBe(false);
       expect(result.current.error).toBeNull();
     });
   
     test('fetches availability data', async () => {
       // Test implementation
     });
   });
   ```

### Testing Context

For testing context providers:

1. **Create a Test Wrapper**:
   ```typescript
   const wrapper = ({ children }) => (
     <AvailabilityProvider>{children}</AvailabilityProvider>
   );
   
   const { result } = renderHook(() => useAvailabilityContext(), { wrapper });
   ```

2. **Test Provider Behavior**:
   - Test initial state
   - Test context updates
   - Test error handling

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- -t "useAvailability"

# Generate coverage report
npm test -- --coverage
```

## Code Organization Guidelines

1. **Component Organization**:
   - Keep components small and focused
   - Split large files into smaller ones
   - Group related components in subfolders

2. **Hook Organization**:
   - Move complex logic out of components into custom hooks
   - Structure: `src/hooks/useFeature/index.ts` with supporting files in same folder

3. **Context Organization**:
   - Split large context files:
     - `GameContext/index.tsx` - Main export
     - `GameContext/Provider.tsx` - Provider implementation
     - `GameContext/hooks.ts` - Custom hooks for context

4. **Code Quality Guidelines**:
   - Use TypeScript strictly (no `any` unless absolutely necessary)
   - Follow ESLint and Prettier rules
   - Document complex functions with JSDoc
   - Keep functions small and focused on a single responsibility

By following these guidelines, you'll help maintain a high-quality, maintainable codebase that's easier for all contributors to work with.
