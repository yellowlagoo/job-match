# InternMatch - AI-Powered Internship Matching Platform

> Automatically match CS students with relevant SWE internship opportunities using AI-powered resume parsing and smart matching algorithms.

## Overview

InternMatch is a production-ready MVP that helps computer science students find relevant software engineering internships. Once fully built the platform analyzes resumes, scrapes job postings daily, and sends email notifications only when new, high-quality matches are found. Currently it can analyze resumes and extract skills plus ways to strengthen skills / resume.

### Key Features

- **Resume Parsing**: AI-powered resume analysis using Groq / Claude
- **Smart Matching**: Skills-based matching algorithm with eligibility filtering
- **Daily Job Scraping**: Automated job discovery from GitHub internship repositories
- **Email Notifications**: Timely alerts for new matches (configurable threshold)
- **Dashboard**: Clean interface to view and manage matches
- **User Profiles**: Comprehensive profiles with skills, projects, and preferences

## Tech Stack

### Core Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Email**: [Resend](https://resend.com/) + [React Email](https://react.email/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)

### Development Tools

- **TypeScript**: Strict mode for type safety
- **ESLint**: Code linting with Next.js + TypeScript rules
- **Prettier**: Code formatting with Tailwind class sorting
- **Husky**: Git hooks for pre-commit linting
- **lint-staged**: Automatic formatting on commit

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** database (local or remote)
- **Clerk Account** (free tier available)
- **Resend Account** (free tier available)
- **OpenAI API Key** (for resume parsing)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/internmatch.git
cd internmatch
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/internmatch"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"

# OpenAI (for resume parsing)
OPENAI_API_KEY="sk-xxx"

# Resend (for emails)
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="InternMatch <onboarding@resend.dev>"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run db:generate

# Push database schema (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### Database Setup Options

#### Option 1: Local PostgreSQL with Docker

```bash
docker run --name internmatch-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=internmatch \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Option 2: Vercel Postgres

1. Create a Vercel project
2. Add Postgres storage in your dashboard
3. Copy the `DATABASE_URL` to your `.env` file

#### Option 3: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Get your connection string from Settings > Database
3. Add to `.env` as `DATABASE_URL`

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   └── features/           # Feature-specific components
│   ├── lib/                    # Utilities and shared logic
│   │   ├── db/                 # Database utilities
│   │   ├── validations/        # Zod schemas
│   │   └── utils.ts
│   ├── services/               # Business logic layer
│   └── types/                  # TypeScript types
├── prisma/                     # Database schema and migrations
├── scripts/                    # Standalone scripts
├── emails/                     # Email templates
└── tests/                      # Test files
```

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

### Database

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (dev)
npm run db:migrate   # Run migrations (production)
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

### Testing

```bash
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## Configuration

### Clerk Setup

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key and secret key to `.env`
4. Configure sign-in/sign-up URLs in your Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`

### Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Generate an API key
3. Verify your sending domain (or use `onboarding@resend.dev` for development)
4. Add credentials to `.env`

### OpenAI Setup

1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Generate an API key
3. Add to `.env`
4. Ensure you have credits in your account

## Architecture Decisions

### Why Next.js 14 App Router?

- **Server Components**: Better performance and SEO
- **Server Actions**: Simplified data mutations
- **Built-in API Routes**: No need for separate backend
- **File-based Routing**: Intuitive project structure

### Why Prisma?

- **Type Safety**: Auto-generated types from schema
- **Migrations**: Built-in migration system
- **Developer Experience**: Excellent tooling and Prisma Studio

### Why Clerk?

- **Fast Integration**: Pre-built components for auth
- **Security**: Industry-standard security practices
- **User Management**: Built-in user management dashboard
- **No Custom Auth Code**: Focus on features, not auth infrastructure

### Why Resend + React Email?

- **Developer Experience**: Write emails in React
- **Deliverability**: High delivery rates
- **Simple API**: Easy to integrate
- **Free Tier**: 100 emails/day for development

## Security Considerations

- All API routes validate authentication with Clerk
- Input validation on all endpoints using Zod
- SQL injection prevention via Prisma (parameterized queries)
- XSS protection via React (automatic escaping)
- CSRF protection via Next.js (built-in)
- Secure headers configured in `next.config.js`
- Environment variables for sensitive data
- File upload validation (type and size limits)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel automatically:

- Builds your Next.js application
- Runs type checking and linting
- Optimizes for production
- Provides SSL certificate
- Enables serverless functions

### Environment Variables for Production

Make sure to set all required environment variables in your Vercel dashboard:

- `DATABASE_URL` (use Vercel Postgres or Supabase)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (use your verified domain)
- `NEXT_PUBLIC_APP_URL` (your production URL)
- `NODE_ENV="production"`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## API Documentation

See [API.md](./API.md) for API endpoint documentation (to be populated as features are built).

## Roadmap

### MVP Features (Current Phase)

- [x] Project setup with Next.js 14
- [x] Database schema and Prisma setup
- [x] Authentication with Clerk
- [x] Basic UI components
- [ ] Resume upload and parsing
- [ ] User profile management
- [ ] Job scraping script
- [ ] Matching algorithm
- [ ] Email notifications
- [ ] Dashboard with match display

### Future Enhancements

- [ ] Advanced filtering and search
- [ ] Application tracking
- [ ] Interview preparation resources
- [ ] Mobile app (React Native)
- [ ] Company reviews and ratings
- [ ] Resume builder
- [ ] Cover letter generator
- [ ] Referral system

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Open an issue on GitHub
- Email: support@internmatch.com

---

**Built with** ❤️ **by the InternMatch team**
