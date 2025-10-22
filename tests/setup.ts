/**
 * Vitest Test Setup File
 *
 * This file runs before each test suite.
 * Use it to configure global test utilities and mocks.
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(() => ({
    userId: 'test-user-id',
    sessionId: 'test-session-id',
  })),
  currentUser: vi.fn(() =>
    Promise.resolve({
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    })
  ),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => 'UserButton',
  SignIn: () => 'SignIn',
  SignUp: () => 'SignUp',
}));

// Mock environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_xxx';
process.env.CLERK_SECRET_KEY = 'sk_test_xxx';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
