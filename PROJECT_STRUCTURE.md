# InternMatch Project Structure

This document explains the folder structure and organization of the InternMatch codebase.

## Root Directory

```
/
├── src/                        # Application source code
├── prisma/                     # Database schema and migrations
├── scripts/                    # Standalone scripts (e.g., Python scrapers)
├── emails/                     # React Email templates
├── tests/                      # Test files
├── public/                     # Static assets
└── [config files]              # Configuration files (next.config, tsconfig, etc.)
```

## `/src` Directory Structure

### `/src/app` - Next.js 14 App Router

The app directory uses Next.js 14's App Router architecture with route groups.

```
app/
├── (auth)/                     # Route group for authentication pages
│   ├── sign-in/                # Sign in page (/sign-in)
│   └── sign-up/                # Sign up page (/sign-up)
├── (dashboard)/                # Route group for authenticated pages
│   ├── dashboard/              # Main dashboard (/dashboard)
│   ├── matches/                # Matches page (/matches)
│   ├── profile/                # Profile settings (/profile)
│   └── layout.tsx              # Dashboard layout (with sidebar, auth check)
├── api/                        # API routes
│   ├── webhooks/               # Webhook handlers (e.g., Clerk)
│   ├── matches/                # Match-related endpoints
│   ├── jobs/                   # Job-related endpoints
│   └── upload/                 # File upload endpoints
├── layout.tsx                  # Root layout (providers, fonts, metadata)
└── page.tsx                    # Landing page (/)
```

**Route Groups** (folders with parentheses):

- `(auth)`: Contains public authentication pages
- `(dashboard)`: Contains protected pages that require authentication
- Route groups don't affect the URL structure but allow shared layouts

### `/src/components` - React Components

```
components/
├── ui/                         # Reusable UI primitives
│   ├── button.tsx              # Button component
│   ├── card.tsx                # Card component
│   ├── input.tsx               # Input component
│   ├── dropdown-menu.tsx       # Dropdown menu component
│   └── ...                     # Other shadcn/ui components
└── features/                   # Feature-specific components
    ├── job-card.tsx            # Job listing card
    ├── match-score.tsx         # Match score display
    ├── resume-upload.tsx       # Resume upload component
    └── ...                     # Other feature components
```

**Organization Philosophy**:

- `ui/`: Generic, reusable components with no business logic
- `features/`: Domain-specific components with business logic

### `/src/lib` - Utilities and Shared Logic

```
lib/
├── db/                         # Database utilities
│   └── client.ts               # Prisma client singleton
├── validations/                # Zod schemas
│   ├── user.ts                 # User validation schemas
│   ├── job.ts                  # Job validation schemas
│   └── match.ts                # Match validation schemas
├── utils.ts                    # General utility functions (cn, formatters, etc.)
├── constants.ts                # App-wide constants
├── api-response.ts             # Standardized API response helpers
└── errors.ts                   # Custom error classes
```

**Key Files**:

- `db/client.ts`: Singleton pattern for Prisma to prevent connection issues
- `validations/`: Co-located Zod schemas for runtime validation
- `utils.ts`: Common utilities like `cn()` for className merging

### `/src/services` - Business Logic Layer

```
services/
├── resume-parser.ts            # Resume parsing logic (OpenAI integration)
├── matching-engine.ts          # Job matching algorithm
├── job-scraper.ts              # Job scraping orchestration
├── email-service.ts            # Email sending logic (Resend)
└── notification-service.ts     # Notification management
```

**Purpose**: Services contain pure business logic separate from API routes and components. They can be easily tested and reused across the application.

### `/src/types` - TypeScript Type Definitions

```
types/
├── index.ts                    # Main type exports
├── database.ts                 # Database-related types (Prisma extensions)
├── api.ts                      # API request/response types
└── domain.ts                   # Domain model types
```

**Type Strategy**:

- Co-locate Zod schemas with types for consistency
- Use `Prisma.UserGetPayload<...>` for database types
- Define strict API contracts with interfaces

## `/prisma` Directory

```
prisma/
├── schema.prisma               # Database schema definition
├── migrations/                 # Database migration files (auto-generated)
└── seed.ts                     # Database seeding script
```

## `/scripts` Directory

Standalone scripts that run outside the Next.js application.

```
scripts/
├── scrape-jobs.py              # Python job scraping script
└── run-matching.ts             # Manual matching script (for cron jobs)
```

## `/emails` Directory

React Email templates for transactional emails.

```
emails/
├── match-notification.tsx      # New matches notification email
├── welcome.tsx                 # Welcome email
└── components/                 # Shared email components
```

## `/tests` Directory

Test files organized by feature or module.

```
tests/
├── unit/                       # Unit tests
│   ├── services/               # Service tests
│   └── utils/                  # Utility function tests
├── integration/                # Integration tests
│   └── api/                    # API route tests
└── setup.ts                    # Test setup and configuration
```

## Configuration Files

### TypeScript Configuration

- `tsconfig.json`: Strict TypeScript configuration with path aliases

### ESLint & Prettier

- `.eslintrc.json`: ESLint rules (extends Next.js + TypeScript recommended)
- `.prettierrc`: Prettier formatting rules with Tailwind plugin

### Git

- `.gitignore`: Excludes node_modules, .env, build outputs, etc.
- `.husky/`: Git hooks (pre-commit runs lint-staged)

### Next.js

- `next.config.mjs`: Next.js configuration with security headers

### Package Management

- `package.json`: Dependencies and scripts

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `JobCard.tsx`) - Using kebab-case for consistency with Next.js conventions
- **Utilities/Services**: kebab-case (e.g., `api-response.ts`, `resume-parser.ts`)
- **Types**: kebab-case (e.g., `database.ts`)

### Code

- **Components**: PascalCase (e.g., `JobCard`)
- **Functions**: camelCase (e.g., `parseResume`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)

## Import Aliases

Use the `@/` prefix for absolute imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db/client';
import type { UserProfile } from '@/types';

// ❌ Avoid
import { Button } from '../../../components/ui/button';
```

## Best Practices

### Component Organization

1. Imports (React, Next.js, third-party, local)
2. Type definitions
3. Component definition
4. Exports

### File Size

- Keep files under 300 lines
- Extract large components into smaller pieces
- Split large services into multiple files

### Separation of Concerns

- **Components**: UI rendering only
- **Services**: Business logic
- **API Routes**: Request/response handling, call services
- **Utilities**: Pure helper functions

### Testing

- Co-locate test files with source files using `.test.ts` or `.spec.ts`
- Integration tests go in `/tests/integration`
- Mock external dependencies (Prisma, APIs)

## Future Considerations

As the application grows, consider:

- Moving to a monorepo structure (if adding mobile app)
- Adding a `/hooks` directory for custom React hooks
- Creating a `/contexts` directory for React Context providers
- Implementing a `/middleware` directory for custom Next.js middleware
