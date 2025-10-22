# InternMatch API Documentation

This document describes the API endpoints for the InternMatch platform.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All protected endpoints require authentication via Clerk. Include the session token in requests:

```bash
curl -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  https://your-domain.com/api/matches
```

Next.js API routes automatically handle authentication via Clerk middleware.

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion/update)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## API Endpoints

### User Profile

#### Get User Profile

```http
GET /api/profile
```

Returns the authenticated user's profile.

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "graduationDate": "2025-05-15T00:00:00.000Z",
    "degreeLevel": "BACHELOR",
    "gpa": 3.75,
    "major": "Computer Science",
    "university": "Stanford University",
    "skills": ["Python", "React", "TypeScript"],
    "workAuthorization": "US_CITIZEN",
    "locationPreferences": ["Remote", "San Francisco"],
    "minMatchScore": 75,
    "notificationsPaused": false
  }
}
```

#### Create/Update User Profile

```http
POST /api/profile
PUT /api/profile
```

**Request Body**

```json
{
  "graduationDate": "2025-05-15",
  "degreeLevel": "BACHELOR",
  "gpa": 3.75,
  "major": "Computer Science",
  "university": "Stanford University",
  "skills": ["Python", "React", "TypeScript"],
  "workAuthorization": "US_CITIZEN",
  "locationPreferences": ["Remote", "San Francisco"],
  "minMatchScore": 75
}
```

**Response**

```json
{
  "success": true,
  "data": {
    // Updated profile data
  }
}
```

### Matches

#### Get Matches

```http
GET /api/matches?status=NEW&limit=20&offset=0
```

**Query Parameters**

- `status` (optional): Filter by status (`NEW`, `VIEWED`, `APPLIED`, `DISMISSED`)
- `minScore` (optional): Minimum match score (0-100)
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "userId": "uuid",
        "jobId": "uuid",
        "matchScore": 85,
        "matchingSkills": ["Python", "React"],
        "suggestions": "Highlight your AI projects...",
        "status": "NEW",
        "createdAt": "2024-10-22T00:00:00.000Z",
        "job": {
          "id": "uuid",
          "company": "Google",
          "title": "Software Engineering Intern",
          "location": ["Mountain View, CA"],
          "applyUrl": "https://..."
        }
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### Update Match Status

```http
PATCH /api/matches/:id
```

**Request Body**

```json
{
  "status": "VIEWED" // or "APPLIED", "DISMISSED"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "VIEWED",
    "viewedAt": "2024-10-22T00:00:00.000Z"
  }
}
```

### Jobs

#### Get Jobs

```http
GET /api/jobs?company=Google&limit=20&offset=0
```

**Query Parameters**

- `company` (optional): Filter by company name
- `requiredGradYear` (optional): Filter by graduation year
- `isActive` (optional): Filter by active status
- `search` (optional): Search in title/description
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "company": "Google",
        "title": "Software Engineering Intern",
        "location": ["Mountain View, CA"],
        "description": "...",
        "requirements": "...",
        "applyUrl": "https://...",
        "postedDate": "2024-10-01T00:00:00.000Z",
        "requiredGradYear": 2025
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### Resume Upload

#### Upload Resume

```http
POST /api/upload
```

**Request**

Multipart form data with:

- `file`: PDF or DOCX file (max 5MB)

**Response**

```json
{
  "success": true,
  "data": {
    "resumeUrl": "https://...",
    "parsedData": {
      "skills": ["Python", "React"],
      "graduationDate": "2025-05-15",
      "degreeLevel": "BACHELOR",
      "gpa": 3.75
    }
  }
}
```

### Webhooks

#### Clerk Webhook

```http
POST /api/webhooks/clerk
```

Handles Clerk events (user created, updated, deleted). This endpoint is automatically called by Clerk.

**Events Handled**

- `user.created` - Create user in database
- `user.updated` - Update user in database
- `user.deleted` - Delete user from database

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:

- Upstash Redis for distributed rate limiting
- `@upstash/ratelimit` package
- Rate limits per endpoint (e.g., 100 requests/minute)

## Error Codes

| Code                  | Description                              |
| --------------------- | ---------------------------------------- |
| `VALIDATION_ERROR`    | Request body or params failed validation |
| `UNAUTHORIZED`        | User not authenticated                   |
| `FORBIDDEN`           | User not authorized for this resource    |
| `NOT_FOUND`           | Resource not found                       |
| `CONFLICT`            | Resource already exists                  |
| `RATE_LIMIT_EXCEEDED` | Too many requests                        |
| `FILE_TOO_LARGE`      | Uploaded file exceeds size limit         |
| `INVALID_FILE_TYPE`   | Uploaded file type not allowed           |
| `INTERNAL_ERROR`      | Unexpected server error                  |

## Example Usage

### JavaScript/TypeScript

```typescript
async function getMatches() {
  const response = await fetch('/api/matches', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  const data = await response.json();
  return data.data;
}
```

### cURL

```bash
# Get matches
curl -X GET "http://localhost:3000/api/matches?limit=10"

# Update match status
curl -X PATCH "http://localhost:3000/api/matches/uuid" \
  -H "Content-Type: application/json" \
  -d '{"status": "VIEWED"}'

# Upload resume
curl -X POST "http://localhost:3000/api/upload" \
  -F "file=@resume.pdf"
```

## Future Endpoints

The following endpoints are planned for future releases:

- `POST /api/notifications/pause` - Pause notifications
- `POST /api/notifications/resume` - Resume notifications
- `GET /api/stats` - Get user statistics
- `POST /api/feedback` - Submit feedback on matches

---

**Note**: This API is under active development. Breaking changes may occur before v1.0.
