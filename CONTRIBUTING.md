# Contributing to InternMatch

Thank you for your interest in contributing to InternMatch! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Be respectful, collaborative, and constructive. We're all here to build something great together.

## Development Setup

See the [README.md](./README.md) for initial setup instructions.

## Development Workflow

### 1. Create a Branch

Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bugfix-name
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

Follow the code style guidelines below.

### 3. Test Your Changes

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build the project
npm run build
```

### 4. Commit Your Changes

We use conventional commits for clear commit history:

```bash
git commit -m "feat: add resume upload functionality"
git commit -m "fix: resolve auth redirect issue"
git commit -m "docs: update API documentation"
```

Commit types:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

The pre-commit hook will automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Fail if there are unfixable errors

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:

- Clear title describing the change
- Description of what changed and why
- Screenshots (if UI changes)
- Link to related issue (if applicable)

## Code Style Guidelines

### TypeScript

1. **Use TypeScript strict mode** - No `any` types
2. **Explicit return types** for exported functions
3. **Use type imports** when importing only types

```typescript
// ✅ Good
import type { User } from '@prisma/client';
import { formatDate } from '@/lib/utils';

export function getUserName(user: User): string {
  return user.name ?? 'Unknown';
}

// ❌ Bad
import { User } from '@prisma/client';

export function getUserName(user: any) {
  return user.name ?? 'Unknown';
}
```

### Components

1. **Use functional components** with TypeScript
2. **Prefer server components** unless client features needed
3. **Use 'use client'** directive only when necessary

```typescript
// ✅ Good - Server Component (default)
interface Props {
  userId: string;
}

export default async function UserProfile({ userId }: Props) {
  const user = await fetchUser(userId);
  return <div>{user.name}</div>;
}

// ✅ Good - Client Component (when needed)
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### File Naming

- **Components**: kebab-case (e.g., `user-profile.tsx`)
- **Utilities**: kebab-case (e.g., `api-response.ts`)
- **Types**: kebab-case (e.g., `database.ts`)
- **Pages**: Follow Next.js conventions

### Import Order

```typescript
// 1. React and Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// 3. Internal components
import { Button } from '@/components/ui/button';

// 4. Internal utilities
import { formatDate } from '@/lib/utils';

// 5. Types
import type { User } from '@/types';

// 6. Styles
import './styles.css';
```

### Error Handling

Always handle errors explicitly:

```typescript
// ✅ Good
try {
  const user = await fetchUser(id);
  return successResponse(user);
} catch (error) {
  if (error instanceof NotFoundError) {
    return errorResponse(error);
  }
  throw error; // Re-throw unexpected errors
}

// ❌ Bad
const user = await fetchUser(id); // Unhandled promise rejection
return user;
```

### Validation

Use Zod for all user inputs:

```typescript
// ✅ Good
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await validateRequestBody(request, CreateUserSchema);
  // body is fully typed and validated
}

// ❌ Bad
export async function POST(request: Request) {
  const body = await request.json(); // No validation or types
}
```

### Database Queries

1. **Use Prisma** for all database operations
2. **Use transactions** for multi-step operations
3. **Add indexes** for frequently queried fields

```typescript
// ✅ Good - Transaction for multi-step operation
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.userProfile.create({
    data: { userId: user.id, ...profileData },
  });
  return user;
});

// ❌ Bad - Separate operations (race condition risk)
const user = await prisma.user.create({ data: userData });
await prisma.userProfile.create({
  data: { userId: user.id, ...profileData },
});
```

### API Routes

1. **Use `withErrorHandling` wrapper**
2. **Validate all inputs**
3. **Return consistent response format**

```typescript
// ✅ Good
export async function GET(request: Request) {
  return withErrorHandling(async () => {
    const { userId } = auth();
    if (!userId) {
      throw new UnauthorizedError();
    }

    const matches = await getMatches(userId);
    return successResponse(matches);
  });
}

// ❌ Bad
export async function GET(request: Request) {
  const matches = await getMatches();
  return Response.json(matches); // No error handling, no auth check
}
```

### Comments and Documentation

1. **Use JSDoc** for exported functions
2. **Explain "why"** not "what"
3. **Add TODO comments** with context

```typescript
/**
 * Calculate match score between user profile and job posting
 *
 * @param profile - User's profile with skills and preferences
 * @param job - Job posting with requirements
 * @returns Score from 0-100, where 100 is perfect match
 */
export function calculateMatchScore(profile: UserProfile, job: Job): number {
  // Weight skills more heavily than other factors
  // TODO: Make weights configurable per user
  const skillScore = calculateSkillMatch(profile.skills, job.requiredSkills);
  return skillScore * 0.6 + otherFactors * 0.4;
}
```

## Testing Guidelines

### Unit Tests

Test pure functions and utilities:

```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-05-15');
    expect(formatDate(date)).toBe('May 15, 2025');
  });
});
```

### Integration Tests

Test API routes and database operations:

```typescript
// tests/integration/api/matches.test.ts
import { describe, it, expect } from 'vitest';

describe('GET /api/matches', () => {
  it('returns matches for authenticated user', async () => {
    // Test implementation
  });
});
```

### Test Coverage

- Aim for 80%+ coverage on utility functions
- Test all API routes
- Test complex business logic (matching algorithm)
- UI component tests are optional but encouraged

## Pull Request Guidelines

### PR Title

Use conventional commit format:

- `feat: add resume upload feature`
- `fix: resolve authentication redirect bug`
- `docs: update API documentation`

### PR Description

Include:

1. **What** - What changes were made
2. **Why** - Why these changes were necessary
3. **How** - How the changes were implemented
4. **Testing** - How to test the changes
5. **Screenshots** - For UI changes

### PR Checklist

Before submitting, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Added/updated tests for new features
- [ ] Updated documentation if needed
- [ ] No console.log statements (use console.error/warn if needed)
- [ ] No commented-out code
- [ ] Environment variables added to `.env.example` if needed

## Questions?

Feel free to open an issue for any questions about contributing!
