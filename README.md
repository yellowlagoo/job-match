# JobMatch - AI-Powered Internship Matching Platform

> Automatically match CS students with relevant SWE internship opportunities using AI-powered resume parsing and smart matching algorithms.

## Overview

JobMatch is a production-ready MVP that helps computer science students find relevant software engineering internships. Once fully built the platform analyzes resumes, scrapes job postings daily, and sends email notifications only when new, high-quality matches are found. Currently it can analyze resumes and extract skills plus ways to strengthen skills / resume.

### Key Features

- **Resume Parsing**: AI-powered resume analysis using Groq - built
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
