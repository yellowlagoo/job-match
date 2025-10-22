'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ParsedResume {
  name: string;
  email: string;
  graduationDate: string;
  degree: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    duration: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    tech: string[];
  }>;
  gpa: string | null;
}

interface Job {
  company: string;
  title: string;
  location: string;
  matchScore: number;
  reasons: string[];
  suggestions: string[];
  applyUrl: string;
}

const DEMO_JOBS: Job[] = [
  {
    company: 'Stripe',
    title: 'Software Engineer Intern',
    location: 'San Francisco, CA',
    matchScore: 94,
    reasons: [
      'Strong match for React, TypeScript, and Python requirements',
      'Your payment processing project aligns with their product',
      'Graduation timeline matches Summer 2025 intern period',
    ],
    suggestions: [
      'Emphasize your experience with payment integrations',
      'Highlight TypeScript proficiency in application',
    ],
    applyUrl: 'https://stripe.com/jobs',
  },
  {
    company: 'Linear',
    title: 'Frontend Engineering Intern',
    location: 'Remote',
    matchScore: 91,
    reasons: [
      'Excellent React and TypeScript skill alignment',
      'Your project management tool experience is relevant',
      'Remote position matches location preference',
    ],
    suggestions: [
      'Showcase attention to UI/UX details in portfolio',
      'Mention keyboard-first navigation implementations',
    ],
    applyUrl: 'https://linear.app/careers',
  },
  {
    company: 'Vercel',
    title: 'Developer Experience Intern',
    location: 'San Francisco, CA',
    matchScore: 89,
    reasons: [
      'Next.js project experience aligns perfectly',
      'Strong technical writing from your blog',
      'Active open source contributions show passion',
    ],
    suggestions: [
      'Highlight technical writing portfolio',
      'Mention contributions to developer tools',
    ],
    applyUrl: 'https://vercel.com/careers',
  },
  {
    company: 'Anthropic',
    title: 'Software Engineering Intern',
    location: 'San Francisco, CA',
    matchScore: 88,
    reasons: [
      'Python and TypeScript experience matches stack',
      'Your ML coursework aligns with product focus',
      'Strong CS fundamentals evident from projects',
    ],
    suggestions: [
      'Emphasize any AI/ML project experience',
      'Highlight systems programming knowledge',
    ],
    applyUrl: 'https://anthropic.com/careers',
  },
  {
    company: 'Figma',
    title: 'Software Engineer Intern',
    location: 'San Francisco, CA',
    matchScore: 86,
    reasons: [
      'Strong frontend skills with React',
      'Design tool project shows product thinking',
      'Collaborative project experience',
    ],
    suggestions: [
      'Show portfolio of UI work',
      'Mention performance optimization experience',
    ],
    applyUrl: 'https://figma.com/careers',
  },
  {
    company: 'Notion',
    title: 'Full Stack Engineer Intern',
    location: 'San Francisco, CA',
    matchScore: 84,
    reasons: [
      'Full stack experience with modern technologies',
      'Database design skills from projects',
      'User-centric product development focus',
    ],
    suggestions: [
      'Highlight real-time collaboration features you have built',
      'Discuss scalability considerations in projects',
    ],
    applyUrl: 'https://notion.so/careers',
  },
  {
    company: 'GitHub',
    title: 'Software Engineering Intern',
    location: 'Remote',
    matchScore: 82,
    reasons: [
      'Strong Git and version control knowledge',
      'Open source contributions demonstrate expertise',
      'Developer tools experience',
    ],
    suggestions: [
      'Link to your GitHub profile and contributions',
      'Discuss collaboration tool experience',
    ],
    applyUrl: 'https://github.com/careers',
  },
  {
    company: 'Shopify',
    title: 'Backend Engineering Intern',
    location: 'Remote',
    matchScore: 80,
    reasons: [
      'Backend development with Node.js and databases',
      'E-commerce project experience',
      'API design and implementation skills',
    ],
    suggestions: [
      'Emphasize scalability in your projects',
      'Mention experience with payment systems',
    ],
    applyUrl: 'https://shopify.com/careers',
  },
  {
    company: 'Databricks',
    title: 'Software Engineer Intern',
    location: 'San Francisco, CA',
    matchScore: 77,
    reasons: [
      'Python programming proficiency',
      'Data processing project experience',
      'Strong algorithmic problem-solving',
    ],
    suggestions: [
      'Highlight any big data or distributed systems work',
      'Mention SQL and database optimization',
    ],
    applyUrl: 'https://databricks.com/careers',
  },
  {
    company: 'Atlassian',
    title: 'Software Development Intern',
    location: 'San Francisco, CA',
    matchScore: 75,
    reasons: [
      'Full stack development capabilities',
      'Team collaboration tool experience',
      'Agile development methodology knowledge',
    ],
    suggestions: [
      'Discuss project management tool projects',
      'Mention experience working in development teams',
    ],
    applyUrl: 'https://atlassian.com/careers',
  },
];

function MatchBadge({ score }: { score: number }) {
  if (score >= 90) {
    return (
      <span className="bg-success/10 text-success border-success/20 inline-flex items-center border px-2 py-1 text-xs font-medium">
        {score}% Match
      </span>
    );
  }
  if (score >= 80) {
    return (
      <span className="inline-flex items-center border border-accent/20 bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
        {score}% Match
      </span>
    );
  }
  return (
    <span className="inline-flex items-center border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {score}% Match
    </span>
  );
}

export default function DemoPage() {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [showMatches, setShowMatches] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (uploadedFile: File) => {
    setIsParsing(true);

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setParsedData(data);
        setTimeout(() => setShowMatches(true), 500);
      }
    } catch (error) {
      console.error('Parse error:', error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="text-tertiary text-xs font-medium uppercase tracking-wide">
              Demo
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-secondary transition-colors hover:text-foreground"
          >
            Back to Home
          </Link>
        </nav>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="space-y-12">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground">
                  Upload your resume
                </h1>
                <p className="text-sm text-secondary">
                  We&apos;ll parse your resume and show you relevant matches
                </p>
              </div>

              {!parsedData ? (
                <label
                  htmlFor="resume-upload"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="block cursor-pointer border-2 border-dashed border-border p-12 text-center transition-colors hover:border-muted-foreground"
                >
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="space-y-3">
                    <svg
                      className="mx-auto h-8 w-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-secondary">
                        {isParsing
                          ? 'Parsing resume...'
                          : 'Drop your resume here or click to browse'}
                      </p>
                      <p className="text-tertiary mt-1 text-xs">
                        PDF only, max 5MB
                      </p>
                    </div>
                  </div>
                </label>
              ) : null}
            </div>

            {/* Parsed Data Display */}
            {parsedData && (
              <div className="animate-fade-in space-y-6 border border-border p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      {parsedData.name}
                    </h3>
                    <p className="text-sm text-secondary">{parsedData.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-tertiary text-xs">{parsedData.degree}</p>
                    <p className="text-tertiary text-xs">
                      Graduating {parsedData.graduationDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-tertiary text-xs font-medium uppercase tracking-wide">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="border border-border bg-muted px-2 py-1 text-xs text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {parsedData.experience.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-tertiary text-xs font-medium uppercase tracking-wide">
                      Experience
                    </p>
                    <div className="space-y-2">
                      {parsedData.experience.map((exp, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-foreground">
                            {exp.role}
                          </span>{' '}
                          <span className="text-secondary">
                            at {exp.company}
                          </span>
                          <span className="text-tertiary">
                            {' '}
                            · {exp.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Matches Section */}
            {showMatches && (
              <div className="animate-fade-in space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Your Matches
                  </h2>
                  <p className="text-sm text-secondary">
                    {DEMO_JOBS.length} internships ranked by match score
                  </p>
                </div>

                <div className="space-y-4">
                  {DEMO_JOBS.map((job, i) => (
                    <div
                      key={i}
                      className="space-y-4 border border-border p-6 transition-colors hover:border-muted-foreground"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-foreground">
                            {job.company}
                          </h3>
                          <p className="text-sm text-secondary">{job.title}</p>
                        </div>
                        <MatchBadge score={job.matchScore} />
                      </div>

                      {/* Location */}
                      <p className="text-tertiary text-sm">{job.location}</p>

                      {/* Why you match */}
                      <div className="space-y-2">
                        <p className="text-tertiary text-xs font-medium uppercase tracking-wide">
                          Why you match
                        </p>
                        <ul className="space-y-1.5">
                          {job.reasons.map((reason, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm text-secondary"
                            >
                              <span className="text-success mt-0.5">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Suggestions */}
                      <div className="space-y-2">
                        <p className="text-tertiary text-xs font-medium uppercase tracking-wide">
                          What to highlight
                        </p>
                        <ul className="space-y-1.5">
                          {job.suggestions.map((suggestion, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm text-secondary"
                            >
                              <span className="text-muted-foreground">→</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action */}
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                      >
                        View Application
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
