'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ParsedResume } from '@/services/resume-parser';
import type { SkillsAnalysis } from '@/types/analysis';

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
  const [skillsAnalysis, setSkillsAnalysis] = useState<SkillsAnalysis | null>(
    null
  );
  const [showMatches, setShowMatches] = useState(false);
  const [error, setError] = useState<{
    message: string;
    details?: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (uploadedFile: File) => {
    console.log('[Upload] File selected:', {
      name: uploadedFile.name,
      size: uploadedFile.size,
      type: uploadedFile.type,
      sizeInMB: (uploadedFile.size / (1024 * 1024)).toFixed(2) + 'MB',
    });

    // Reset previous state
    setError(null);
    setParsedData(null);
    setSkillsAnalysis(null);
    setShowMatches(false);
    setIsParsing(true);

    // Client-side validation
    console.log('[Upload] Performing client-side validation...');

    if (!uploadedFile.type.includes('pdf')) {
      console.warn('[Upload] ❌ Validation failed: Invalid file type');
      setError({
        message: 'Invalid file type',
        details: 'Please upload a PDF file (.pdf)',
      });
      setIsParsing(false);
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      console.warn('[Upload] ❌ Validation failed: File too large');
      setError({
        message: 'File too large',
        details: `File must be under 10MB. Your file is ${(uploadedFile.size / (1024 * 1024)).toFixed(2)}MB`,
      });
      setIsParsing(false);
      return;
    }

    if (uploadedFile.size === 0) {
      console.warn('[Upload] ❌ Validation failed: Empty file');
      setError({
        message: 'Empty file',
        details: 'The selected file is empty. Please choose a valid PDF.',
      });
      setIsParsing(false);
      return;
    }

    console.log('[Upload] ✓ Client-side validation passed');

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      console.log('[Upload] Starting API call to /api/parse-resume');
      setUploadProgress('Uploading resume...');

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      console.log('[Upload] API response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      setUploadProgress('Processing response...');

      const data = await response.json();
      console.log('[Upload] API Response:', data);
      console.log('[Upload] Parsed Resume:', data.parsedResume);
      console.log('[Upload] Skills Analysis:', data.skillsAnalysis);

      if (response.ok) {
        console.log('[Upload] ✓ Upload successful');
        setUploadProgress('Parsing complete!');

        // Extract parsed resume and skills analysis from response
        if (data.parsedResume) {
          setParsedData(data.parsedResume);
          console.log('[Upload] ✓ Parsed resume data set');
        }

        if (data.skillsAnalysis) {
          setSkillsAnalysis(data.skillsAnalysis);
          console.log('[Upload] ✓ Skills analysis data set');
        }

        setTimeout(() => {
          setShowMatches(true);
          setUploadProgress('');
        }, 500);
      } else {
        // Handle error responses
        console.error('[Upload] ❌ API returned error:', data);
        setError({
          message: data.error || 'Upload failed',
          details:
            data.details || 'An unexpected error occurred. Please try again.',
        });
        setUploadProgress('');
      }
    } catch (error) {
      console.error('[Upload] ❌ Network or parsing error:', error);
      setError({
        message: 'Connection failed',
        details:
          error instanceof Error
            ? error.message
            : 'Could not connect to the server. Please check your connection and try again.',
      });
      setUploadProgress('');
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

              {/* Error Display */}
              {error && (
                <div className="border-2 border-red-500/20 bg-red-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-red-500">
                        {error.message}
                      </p>
                      {error.details && (
                        <p className="text-xs text-red-500/80">
                          {error.details}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-500/60 transition-colors hover:text-red-500"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {!parsedData ? (
                <label
                  htmlFor="resume-upload"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`block cursor-pointer border-2 border-dashed p-12 text-center transition-colors ${
                    isParsing
                      ? 'border-accent/50 bg-accent/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isParsing}
                  />
                  <div className="space-y-3">
                    {isParsing ? (
                      <svg
                        className="mx-auto h-8 w-8 animate-spin text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
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
                    )}
                    <div>
                      <p className="text-sm text-secondary">
                        {isParsing
                          ? uploadProgress || 'Parsing resume...'
                          : 'Drop your resume here or click to browse'}
                      </p>
                      <p className="text-tertiary mt-1 text-xs">
                        PDF only, max 10MB
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
                      {parsedData.name || 'Unknown Name'}
                    </h3>
                    <p className="text-sm text-secondary">
                      {parsedData.email || 'No email provided'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-tertiary text-xs">
                      {parsedData.degree || 'Not specified'}
                    </p>
                    <p className="text-tertiary text-xs">
                      {parsedData.graduationDate
                        ? `Graduating ${parsedData.graduationDate}`
                        : 'Graduation date not specified'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-tertiary text-xs font-medium uppercase tracking-wide">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills && parsedData.skills.length > 0 ? (
                      parsedData.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="border border-border bg-muted px-2 py-1 text-xs text-foreground"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills found
                      </p>
                    )}
                  </div>
                </div>

                {parsedData.experience && parsedData.experience.length > 0 && (
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

                {parsedData.projects && parsedData.projects.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-tertiary text-xs font-medium uppercase tracking-wide">
                      Projects
                    </p>
                    <div className="space-y-3">
                      {parsedData.projects.map((project, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {project.name}
                          </p>
                          <p className="text-sm text-secondary">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tech?.map((tech, j) => (
                              <span key={j} className="text-tertiary text-xs">
                                {tech}
                                {j < project.tech.length - 1 && ' •'}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills Analysis Display */}
            {skillsAnalysis && (
              <div className="animate-fade-in space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Skills Analysis
                  </h2>
                  <p className="text-sm text-secondary">
                    How your resume matches the target role
                  </p>
                </div>

                {/* Overall Fit Section */}
                {skillsAnalysis.overallFit && (
                  <div className="border border-border bg-accent/5 p-6">
                    <h3 className="text-tertiary mb-2 text-xs font-medium uppercase tracking-wide">
                      Overall Assessment
                    </h3>
                    <p className="text-sm text-secondary">
                      {skillsAnalysis.overallFit}
                    </p>
                  </div>
                )}

                {/* Aligned Skills Section */}
                {skillsAnalysis.alignedSkills &&
                  skillsAnalysis.alignedSkills.length > 0 && (
                    <div className="space-y-4 border border-border p-6">
                      <h3 className="text-tertiary text-xs font-medium uppercase tracking-wide">
                        Matching Skills ({skillsAnalysis.alignedSkills.length})
                      </h3>
                      <div className="space-y-3">
                        {skillsAnalysis.alignedSkills.map((skill, i) => (
                          <div
                            key={i}
                            className="border-success/50 bg-success/5 flex items-start justify-between gap-4 border-l-2 py-2 pl-4 pr-3"
                          >
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {skill.skill}
                                </span>
                                <span className="text-tertiary text-xs">
                                  from {skill.matchedFrom}
                                </span>
                              </div>
                              {skill.evidence && (
                                <p className="text-xs text-secondary">
                                  {skill.evidence}
                                </p>
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                skill.relevance === 'high'
                                  ? 'text-success'
                                  : skill.relevance === 'medium'
                                    ? 'text-accent'
                                    : 'text-muted-foreground'
                              }`}
                            >
                              {skill.relevance}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Missing Skills Section */}
                {skillsAnalysis.missingSkills &&
                  skillsAnalysis.missingSkills.length > 0 && (
                    <div className="space-y-4 border border-border p-6">
                      <h3 className="text-tertiary text-xs font-medium uppercase tracking-wide">
                        Skills to Develop ({skillsAnalysis.missingSkills.length}
                        )
                      </h3>
                      <div className="space-y-2">
                        {skillsAnalysis.missingSkills.map((skill, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-4 border-l-2 border-muted-foreground/30 bg-muted/30 py-2 pl-4 pr-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-foreground">
                                {skill.skill}
                              </span>
                              <span className="text-tertiary text-xs">
                                {skill.category}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                skill.priority === 'required'
                                  ? 'text-red-500'
                                  : skill.priority === 'preferred'
                                    ? 'text-accent'
                                    : 'text-muted-foreground'
                              }`}
                            >
                              {skill.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Strengths to Highlight Section */}
                {skillsAnalysis.strengthsToHighlight &&
                  skillsAnalysis.strengthsToHighlight.length > 0 && (
                    <div className="space-y-4 border border-border p-6">
                      <h3 className="text-tertiary text-xs font-medium uppercase tracking-wide">
                        Strengths to Highlight (
                        {skillsAnalysis.strengthsToHighlight.length})
                      </h3>
                      <div className="space-y-4">
                        {skillsAnalysis.strengthsToHighlight.map(
                          (strength, i) => (
                            <div key={i} className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground">
                                {strength.title}
                              </h4>
                              <p className="text-sm text-secondary">
                                {strength.description}
                              </p>
                              <div className="flex items-start gap-2 border-l-2 border-accent/50 bg-accent/5 py-1.5 pl-3">
                                <span className="text-xs font-medium text-accent">
                                  →
                                </span>
                                <p className="text-xs text-secondary">
                                  {strength.impact}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Improvement Suggestions Section */}
                {skillsAnalysis.improvementSuggestions &&
                  skillsAnalysis.improvementSuggestions.length > 0 && (
                    <div className="space-y-4 border border-border p-6">
                      <h3 className="text-tertiary text-xs font-medium uppercase tracking-wide">
                        Recommendations (
                        {skillsAnalysis.improvementSuggestions.length})
                      </h3>
                      <div className="space-y-4">
                        {skillsAnalysis.improvementSuggestions.map(
                          (suggestion, i) => (
                            <div
                              key={i}
                              className="space-y-2 border-l-2 border-accent/50 py-1 pl-4"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-medium ${
                                    suggestion.priority === 'high'
                                      ? 'text-red-500'
                                      : suggestion.priority === 'medium'
                                        ? 'text-accent'
                                        : 'text-muted-foreground'
                                  }`}
                                >
                                  {suggestion.priority.toUpperCase()}
                                </span>
                                <span className="text-tertiary text-xs">
                                  {suggestion.category}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                {suggestion.suggestion}
                              </p>
                              <p className="text-xs italic text-secondary">
                                {suggestion.rationale}
                              </p>
                            </div>
                          )
                        )}
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
