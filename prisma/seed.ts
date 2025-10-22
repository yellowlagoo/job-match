/**
 * Database Seed Script
 * Run with: npm run db:seed
 *
 * This script populates the database with sample data for development.
 * DO NOT run this in production.
 */

import { PrismaClient, DegreeLevel, WorkAuthorization } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data
  console.log('Cleaning up existing data...');
  await prisma.match.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.job.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  console.log('Creating sample users...');
  const user1 = await prisma.user.create({
    data: {
      clerkId: 'user_seed_1',
      email: 'student1@example.com',
      name: 'Alice Johnson',
      profile: {
        create: {
          graduationDate: new Date('2025-05-15'),
          degreeLevel: DegreeLevel.BACHELOR,
          gpa: 3.75,
          major: 'Computer Science',
          university: 'Stanford University',
          skills: ['Python', 'React', 'TypeScript', 'Node.js', 'SQL', 'Git'],
          workAuthorization: WorkAuthorization.US_CITIZEN,
          locationPreferences: ['Remote', 'San Francisco', 'New York'],
          minMatchScore: 70,
          projects: [
            {
              name: 'AI Resume Parser',
              description:
                'Built a resume parsing service using OpenAI GPT-4 and Next.js',
              techStack: ['Next.js', 'TypeScript', 'OpenAI', 'Prisma'],
              url: 'https://github.com/alice/resume-parser',
            },
            {
              name: 'Real-time Chat App',
              description:
                'WebSocket-based chat application with React and Node.js',
              techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
            },
          ],
          experience: [
            {
              company: 'Tech Startup Inc',
              role: 'Software Engineering Intern',
              durationMonths: 3,
              description:
                'Developed React components and RESTful APIs for customer dashboard',
            },
          ],
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      clerkId: 'user_seed_2',
      email: 'student2@example.com',
      name: 'Bob Chen',
      profile: {
        create: {
          graduationDate: new Date('2026-05-15'),
          degreeLevel: DegreeLevel.MASTER,
          gpa: 3.9,
          major: 'Computer Science',
          university: 'MIT',
          skills: [
            'Java',
            'Spring Boot',
            'Kubernetes',
            'Docker',
            'AWS',
            'PostgreSQL',
          ],
          workAuthorization: WorkAuthorization.NEEDS_SPONSORSHIP,
          locationPreferences: ['Remote', 'Boston', 'Seattle'],
          minMatchScore: 80,
          projects: [
            {
              name: 'Microservices Platform',
              description:
                'Built a scalable microservices platform with Kubernetes',
              techStack: [
                'Java',
                'Spring Boot',
                'Kubernetes',
                'Docker',
                'PostgreSQL',
              ],
            },
          ],
          experience: [],
        },
      },
    },
  });

  // Create sample jobs
  console.log('Creating sample jobs...');
  const job1 = await prisma.job.create({
    data: {
      company: 'Google',
      title: 'Software Engineering Intern, Summer 2025',
      location: ['Mountain View, CA', 'New York, NY', 'Seattle, WA'],
      description:
        'Join Google as a Software Engineering Intern and work on products used by billions of users. You will write code, design systems, and collaborate with experienced engineers.',
      requirements:
        'Currently pursuing a BS, MS, or PhD in Computer Science or related field. Graduating in 2025 or 2026. Strong coding skills in one or more of: Python, Java, C++, JavaScript. Knowledge of data structures and algorithms.',
      applyUrl: 'https://careers.google.com/jobs/12345',
      source: 'github',
      sourceId: 'google-swe-2025',
      postedDate: new Date('2024-10-01'),
      requiredGradYear: 2025,
      degreeRequirement: DegreeLevel.BACHELOR,
      sponsorshipAvailable: true,
      requiredSkills: ['Python', 'Java', 'C++', 'JavaScript'],
      isActive: true,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      company: 'Meta',
      title: 'Software Engineer Intern (Frontend)',
      location: ['Menlo Park, CA', 'Remote'],
      description:
        'Build the future of social technology at Meta. Work on React-based applications that connect billions of people worldwide.',
      requirements:
        "Currently pursuing a Bachelor's or Master's degree in Computer Science. Strong knowledge of React, TypeScript, and modern web technologies. Graduating in 2025.",
      applyUrl: 'https://www.metacareers.com/jobs/12345',
      source: 'github',
      sourceId: 'meta-frontend-2025',
      postedDate: new Date('2024-10-05'),
      requiredGradYear: 2025,
      degreeRequirement: DegreeLevel.BACHELOR,
      sponsorshipAvailable: true,
      requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
      isActive: true,
    },
  });

  // @ts-expect-error - Unused variable kept for seeding purposes
  const _job3 = await prisma.job.create({
    data: {
      company: 'Amazon',
      title: 'Software Development Engineer Intern',
      location: ['Seattle, WA', 'Austin, TX', 'Remote'],
      description:
        'Amazon is looking for innovative software engineers to join our team. Work on AWS, Alexa, or other cutting-edge products.',
      requirements:
        'Pursuing a BS/MS in Computer Science or related field. Strong programming skills in Java, Python, or C++. Knowledge of databases and system design. US work authorization required.',
      applyUrl: 'https://amazon.jobs/en/jobs/12345',
      source: 'github',
      sourceId: 'amazon-sde-2025',
      postedDate: new Date('2024-10-10'),
      applicationDeadline: new Date('2024-12-31'),
      requiredGradYear: 2025,
      degreeRequirement: DegreeLevel.BACHELOR,
      sponsorshipAvailable: false,
      requiredSkills: ['Java', 'Python', 'C++', 'AWS', 'SQL'],
      isActive: true,
    },
  });

  // Create sample matches
  console.log('Creating sample matches...');
  await prisma.match.create({
    data: {
      userId: user1.id,
      jobId: job1.id,
      matchScore: 85,
      matchingSkills: ['Python', 'JavaScript'],
      suggestions:
        'Highlight your AI Resume Parser project and experience with React. Mention your GPA (3.75) and expected graduation date.',
      status: 'NEW',
      notificationSent: false,
    },
  });

  await prisma.match.create({
    data: {
      userId: user1.id,
      jobId: job2.id,
      matchScore: 92,
      matchingSkills: ['React', 'TypeScript', 'JavaScript'],
      suggestions:
        'Emphasize your React projects and TypeScript experience. Your Real-time Chat App is a great talking point.',
      status: 'VIEWED',
      notificationSent: true,
      viewedAt: new Date(),
    },
  });

  await prisma.match.create({
    data: {
      userId: user2.id,
      jobId: job1.id,
      matchScore: 78,
      matchingSkills: ['Java'],
      suggestions:
        "Highlight your strong GPA (3.9) and Master's program at MIT. Mention your Kubernetes and AWS experience.",
      status: 'NEW',
      notificationSent: false,
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log(`Created ${2} users with profiles`);
  console.log(`Created ${3} jobs`);
  console.log(`Created ${3} matches`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
