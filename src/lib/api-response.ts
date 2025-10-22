/**
 * API Response Helpers
 *
 * Standardized functions for creating consistent API responses across all endpoints.
 * All API routes should use these helpers to ensure uniform response structure.
 */

import { NextResponse } from 'next/server';
import type { ApiResponse, PaginatedResponse } from '@/types';
import { formatErrorResponse, AppError, ValidationError } from './errors';

/**
 * Create a successful API response
 *
 * @example
 * return successResponse({ user: { id: '123', name: 'Alice' } })
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create a created (201) response for resource creation
 *
 * @example
 * return createdResponse({ id: '123', name: 'New User' })
 */
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, 201);
}

/**
 * Create a no content (204) response
 * Used for successful DELETE or UPDATE operations with no response body
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Create an error response
 *
 * @example
 * return errorResponse(new NotFoundError('User', userId))
 */
export function errorResponse(error: unknown): NextResponse {
  const formattedError = formatErrorResponse(error);
  const status = error instanceof AppError ? error.statusCode : 500;

  return NextResponse.json(formattedError, { status });
}

/**
 * Create a paginated response
 *
 * @example
 * return paginatedResponse(users, 100, 20, 0)
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number
): NextResponse<ApiResponse<PaginatedResponse<T>>> {
  return successResponse({
    data,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + data.length < total,
    },
  });
}

/**
 * Wrapper for API route handlers to catch errors automatically
 * Use this to wrap all API route logic
 *
 * @example
 * export async function GET(request: Request) {
 *   return withErrorHandling(async () => {
 *     const data = await fetchData()
 *     return successResponse(data)
 *   })
 * }
 */
export async function withErrorHandling<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    // Log error for monitoring (in production, send to error tracking service)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }

    return errorResponse(error);
  }
}

/**
 * Validate request body against a Zod schema
 * Throws ValidationError if validation fails
 *
 * @example
 * const body = await validateRequestBody(request, CreateUserSchema)
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    // Import ValidationError locally to avoid circular dependency
    const { ValidationError } = await import('./errors');
    throw new ValidationError('Invalid request body', error);
  }
}

/**
 * Parse and validate URL search params against a Zod schema
 * Throws ValidationError if validation fails
 *
 * @example
 * const filters = validateSearchParams(request, JobFilterSchema)
 */
export function validateSearchParams<T>(
  request: Request,
  schema: { parse: (data: unknown) => T }
): T {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    // Convert string numbers to actual numbers for validation
    const parsedParams: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(params)) {
      // Try to parse as number if it looks like a number
      const numValue = Number(value);
      parsedParams[key] = isNaN(numValue) ? value : numValue;
    }

    return schema.parse(parsedParams);
  } catch (error) {
    throw new ValidationError('Invalid query parameters', error);
  }
}
