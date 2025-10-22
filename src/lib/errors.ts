/**
 * Custom Error Classes
 *
 * Defines structured error types for consistent error handling across the application.
 * Each error class includes an HTTP status code for API responses.
 */

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - Client sent invalid data
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
    if (details) {
      (this as { details?: unknown }).details = details;
    }
  }
}

/**
 * 401 Unauthorized - User is not authenticated
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 403 Forbidden - User is authenticated but lacks permissions
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 404 Not Found - Requested resource does not exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', identifier?: string | number) {
    const message = identifier
      ? `${resource} with ID '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * 409 Conflict - Request conflicts with current state (e.g., duplicate)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * 500 Internal Server Error - Unexpected server error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred') {
    super(message, 500, 'INTERNAL_ERROR', false);
  }
}

/**
 * 503 Service Unavailable - External service is down
 */
export class ServiceUnavailableError extends AppError {
  constructor(
    service: string,
    message: string = `${service} is currently unavailable`
  ) {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * File-related errors
 */
export class FileUploadError extends AppError {
  constructor(message: string = 'File upload failed') {
    super(message, 400, 'FILE_UPLOAD_ERROR');
  }
}

export class FileSizeError extends AppError {
  constructor(maxSizeMB: number) {
    super(
      `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      400,
      'FILE_TOO_LARGE'
    );
  }
}

export class FileTypeError extends AppError {
  constructor(allowedTypes: string[]) {
    super(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      400,
      'INVALID_FILE_TYPE'
    );
  }
}

/**
 * Database-related errors
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR', false);
  }
}

/**
 * Type guard to check if an error is an operational error
 */
export function isOperationalError(error: unknown): error is AppError {
  return error instanceof AppError && error.isOperational;
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        ...(error.isOperational &&
          'details' in error && { details: error.details }),
      },
    };
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production') {
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
    };
  }

  // In development, include the full error message
  return {
    success: false,
    error: {
      message: getErrorMessage(error),
      code: 'INTERNAL_ERROR',
    },
  };
}
