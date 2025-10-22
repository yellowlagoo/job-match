/**
 * Application Constants
 *
 * Centralized constants used throughout the application.
 * Avoid magic numbers and strings - define them here.
 */

// ============================================================================
// FILE UPLOAD CONSTANTS
// ============================================================================

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
] as const;

export const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

// ============================================================================
// MATCHING ALGORITHM CONSTANTS
// ============================================================================

export const MIN_MATCH_SCORE = 0;
export const MAX_MATCH_SCORE = 100;
export const DEFAULT_MIN_MATCH_SCORE = 75; // Only notify for matches >= 75%

// Skill matching weights (must sum to 100)
export const SKILL_MATCH_WEIGHT = 40; // 40% - Matching skills
export const EXPERIENCE_WEIGHT = 25; // 25% - Relevant experience
export const EDUCATION_WEIGHT = 20; // 20% - Degree level, GPA
export const ELIGIBILITY_WEIGHT = 15; // 15% - Grad year, work auth

// ============================================================================
// NOTIFICATION CONSTANTS
// ============================================================================

export const NOTIFICATION_COOLDOWN_HOURS = 24; // Minimum time between notifications
export const MAX_JOBS_PER_NOTIFICATION = 10; // Max jobs to include in one email

// ============================================================================
// PAGINATION CONSTANTS
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============================================================================
// JOB SCRAPING CONSTANTS
// ============================================================================

export const JOB_SOURCES = {
  GITHUB: 'github',
  SIMPLIFY: 'simplify',
  LINKEDIN: 'linkedin',
  INDEED: 'indeed',
} as const;

export const JOB_SCRAPING_INTERVAL_HOURS = 24; // Run scraper daily
export const JOB_EXPIRY_DAYS = 90; // Mark jobs as inactive after 90 days

// ============================================================================
// DEGREE LEVEL DISPLAY NAMES
// ============================================================================

export const DEGREE_LEVEL_LABELS: Record<string, string> = {
  BACHELOR: "Bachelor's",
  MASTER: "Master's",
  PHD: 'PhD',
};

// ============================================================================
// WORK AUTHORIZATION DISPLAY NAMES
// ============================================================================

export const WORK_AUTH_LABELS: Record<string, string> = {
  US_CITIZEN: 'U.S. Citizen',
  GREEN_CARD: 'Green Card Holder',
  NEEDS_VISA: 'Requires Visa',
  NEEDS_SPONSORSHIP: 'Requires Sponsorship',
};

// ============================================================================
// MATCH STATUS DISPLAY NAMES
// ============================================================================

export const MATCH_STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  VIEWED: 'Viewed',
  APPLIED: 'Applied',
  DISMISSED: 'Dismissed',
};

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DASHBOARD: '/dashboard',
  MATCHES: '/matches',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.MATCHES,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
] as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ROUTES = {
  UPLOAD_RESUME: '/api/upload',
  MATCHES: '/api/matches',
  JOBS: '/api/jobs',
  PROFILE: '/api/profile',
  WEBHOOKS_CLERK: '/api/webhooks/clerk',
} as const;

// ============================================================================
// EXTERNAL URLS
// ============================================================================

export const EXTERNAL_URLS = {
  GITHUB_REPO: 'https://github.com/yourusername/internmatch',
  DOCUMENTATION: 'https://docs.internmatch.com',
  SUPPORT_EMAIL: 'support@internmatch.com',
} as const;

// ============================================================================
// VALIDATION REGEX PATTERNS
// ============================================================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  URL: /^https?:\/\/.+/,
  GPA: /^\d\.\d{1,2}$/,
} as const;

// ============================================================================
// SKILL CATEGORIES (for better matching)
// ============================================================================

export const SKILL_CATEGORIES = {
  LANGUAGES: [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
  ],
  FRONTEND: [
    'React',
    'Vue',
    'Angular',
    'Next.js',
    'Svelte',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'SASS',
  ],
  BACKEND: [
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Spring Boot',
    'ASP.NET',
    'Ruby on Rails',
  ],
  DATABASES: [
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'Cassandra',
    'DynamoDB',
    'SQL',
  ],
  CLOUD: ['AWS', 'Azure', 'GCP', 'Vercel', 'Heroku', 'DigitalOcean'],
  DEVOPS: [
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Jenkins',
    'GitHub Actions',
    'Terraform',
  ],
  TOOLS: ['Git', 'Linux', 'Bash', 'Vim', 'VS Code', 'IntelliJ IDEA'],
  DATA: [
    'Pandas',
    'NumPy',
    'TensorFlow',
    'PyTorch',
    'Scikit-learn',
    'Apache Spark',
  ],
} as const;

// Flattened list of all skills
export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

// ============================================================================
// TIME CONSTANTS
// ============================================================================

export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;
