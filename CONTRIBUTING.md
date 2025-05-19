
# Contributing Guide

## TypeScript & Types

### Adding New Types

1. Create or update type definition files in the `src/types/` directory
2. Export types using `export type { TypeName }`
3. Use clear interfaces and descriptive names
4. Add documentation comments for complex types

### Database Types

When adding or updating database tables:

1. After creating or updating a table in Supabase, regenerate the types:
   ```
   npx supabase gen types typescript --project-id <your-project-id> --schema public > src/integrations/supabase/types.ts
   ```
2. If working with tables not yet in the DB schema, use the `as any` type assertion temporarily:
   ```typescript
   await supabase.from('table_name' as any).select('*')
   ```

## Writing Tests

### Hook Tests

For testing hooks:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useYourHook } from './useYourHook';

test('should return initial values', () => {
  const { result } = renderHook(() => useYourHook());
  expect(result.current.value).toBe(initialValue);
});

test('should update value', () => {
  const { result } = renderHook(() => useYourHook());
  
  act(() => {
    result.current.setValue('new value');
  });
  
  expect(result.current.value).toBe('new value');
});
```

### Context Tests

For testing context providers:

```typescript
import { render, screen } from '@testing-library/react';
import { YourContext, YourContextProvider } from './YourContext';
import { useContext } from 'react';

const TestComponent = () => {
  const context = useContext(YourContext);
  return <div data-testid="test">{context.value}</div>;
};

test('provides expected context value', () => {
  render(
    <YourContextProvider>
      <TestComponent />
    </YourContextProvider>
  );
  
  expect(screen.getByTestId('test')).toHaveTextContent('expected value');
});
```

## Code Organization

1. **Keep files small and focused**:
   - Components should be under 200 lines
   - Break large components into smaller ones
   - Extract logic into custom hooks

2. **Folder structure**:
   - Group related components, hooks and utilities
   - Use index.ts files for cleaner imports
   - Prefer feature-based organization over technology-based

3. **File naming**:
   - Use PascalCase for component files (e.g., `PlayerCard.tsx`)
   - Use camelCase for utility and hook files (e.g., `useAvailability.ts`)

## Pre-commit & CI

This project uses:
1. **Husky** for pre-commit hooks
2. **lint-staged** for running checks on staged files
3. **ESLint** for code quality
4. **Prettier** for code formatting
5. **Jest** for unit tests

Before committing:
```
npm run lint
npm run build -- --noEmit
npm test
```

## Troubleshooting Common Errors

1. "Cannot find module" errors:
   - Make sure the import path is correct
   - Check if you're using @ import aliases correctly
   - Verify the file exists in the specified location

2. Type errors:
   - Ensure all props match their interface definitions
   - Check for null/undefined handling
   - Use optional chaining (`?.`) for potentially undefined values

3. Context errors:
   - Ensure components using context are wrapped in the provider
   - Check for circular imports between context files
