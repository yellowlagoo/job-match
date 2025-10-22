/**
 * Core Type Definitions
 *
 * This file contains all TypeScript types and Zod schemas for the application.
 * Types are co-located with their Zod schemas for consistency and DRY principle.
 */

import { z } from 'zod';
import type { User, UserProfile, Match, Job } from '@prisma/client';

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ============================================================================
// USER TYPES & SCHEMAS
// ============================================================================

export const UserProfileProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Project description is required'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  url: z.string().url().optional(),
});

export const UserProfileExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  durationMonths: z.number().int().positive('Duration must be positive'),
  description: z.string().optional(),
});

export const CreateUserProfileSchema = z.object({
  graduationDate: z.coerce.date(),
  degreeLevel: z.enum(['BACHELOR', 'MASTER', 'PHD']),
  gpa: z.number().min(0).max(4.0).optional(),
  major: z.string().optional(),
  university: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  projects: z.array(UserProfileProjectSchema).default([]),
  experience: z.array(UserProfileExperienceSchema).default([]),
  workAuthorization: z.enum([
    'US_CITIZEN',
    'GREEN_CARD',
    'NEEDS_VISA',
    'NEEDS_SPONSORSHIP',
  ]),
  locationPreferences: z.array(z.string()).default([]),
  minMatchScore: z.number().int().min(0).max(100).default(75),
});

export const UpdateUserProfileSchema = CreateUserProfileSchema.partial();

export type UserProfileProject = z.infer<typeof UserProfileProjectSchema>;
export type UserProfileExperience = z.infer<typeof UserProfileExperienceSchema>;
export type CreateUserProfile = z.infer<typeof CreateUserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;

// Prisma-based types for full user objects
export type UserWithProfile = User & {
  profile: UserProfile | null;
};

// ============================================================================
// JOB TYPES & SCHEMAS
// ============================================================================

export const CreateJobSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.array(z.string()).min(1, 'At least one location is required'),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.string().min(1, 'Job requirements are required'),
  applyUrl: z.string().url('Valid application URL is required'),
  source: z.string().min(1, 'Source is required'),
  sourceId: z.string().min(1, 'Source ID is required'),
  postedDate: z.coerce.date(),
  applicationDeadline: z.coerce.date().optional(),
  requiredGradYear: z.number().int().min(2024).max(2030).optional(),
  degreeRequirement: z.enum(['BACHELOR', 'MASTER', 'PHD']).optional(),
  sponsorshipAvailable: z.boolean().optional(),
  requiredSkills: z.array(z.string()).default([]),
});

export const UpdateJobSchema = CreateJobSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const JobFilterSchema = z.object({
  company: z.string().optional(),
  requiredGradYear: z.number().int().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(), // Search in title/description
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type CreateJob = z.infer<typeof CreateJobSchema>;
export type UpdateJob = z.infer<typeof UpdateJobSchema>;
export type JobFilter = z.infer<typeof JobFilterSchema>;

// ============================================================================
// MATCH TYPES & SCHEMAS
// ============================================================================

export const CreateMatchSchema = z.object({
  userId: z.string().uuid(),
  jobId: z.string().uuid(),
  matchScore: z.number().int().min(0).max(100),
  matchingSkills: z.array(z.string()),
  suggestions: z.string(),
});

export const UpdateMatchStatusSchema = z.object({
  status: z.enum(['NEW', 'VIEWED', 'APPLIED', 'DISMISSED']),
});

export const MatchFilterSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['NEW', 'VIEWED', 'APPLIED', 'DISMISSED']).optional(),
  minScore: z.number().int().min(0).max(100).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type CreateMatch = z.infer<typeof CreateMatchSchema>;
export type UpdateMatchStatus = z.infer<typeof UpdateMatchStatusSchema>;
export type MatchFilter = z.infer<typeof MatchFilterSchema>;

// Prisma-based type for matches with job details
export type MatchWithJob = Match & {
  job: Job;
};

// ============================================================================
// RESUME PARSING TYPES
// ============================================================================

export const ParsedResumeSchema = z.object({
  skills: z.array(z.string()),
  graduationDate: z.coerce.date().optional(),
  degreeLevel: z.enum(['BACHELOR', 'MASTER', 'PHD']).optional(),
  gpa: z.number().min(0).max(4.0).optional(),
  major: z.string().optional(),
  university: z.string().optional(),
  projects: z.array(UserProfileProjectSchema).default([]),
  experience: z.array(UserProfileExperienceSchema).default([]),
  workAuthorization: z
    .enum(['US_CITIZEN', 'GREEN_CARD', 'NEEDS_VISA', 'NEEDS_SPONSORSHIP'])
    .optional(),
});

export type ParsedResume = z.infer<typeof ParsedResumeSchema>;

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSizeInMB: z.number().default(5),
  allowedTypes: z.array(z.string()).default(['application/pdf']),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;

export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword'];
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export const NotificationPreferencesSchema = z.object({
  notificationsPaused: z.boolean(),
  minMatchScore: z.number().int().min(0).max(100),
});

export type NotificationPreferences = z.infer<
  typeof NotificationPreferencesSchema
>;

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;
