'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [graduationDate, setGraduationDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, graduationDate }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail('');
        setName('');
        setGraduationDate('');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation - Fixed with blur */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold text-foreground">
            InternMatch
          </Link>
          <Link
            href="#waitlist"
            className="px-4 py-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            Join Waitlist
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-16">
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Find Internships You Actually Qualify For
            </h1>
            <p className="text-lg text-secondary md:text-xl">
              Stop wasting time on postings you don&apos;t qualify for. Upload
              your resume and see matches instantly.
            </p>
            <div className="flex justify-center pt-4">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 border border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                Try Demo
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
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y border-border bg-muted py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-2xl font-semibold text-foreground">
              How It Works
            </h2>
            <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
              {/* Step 1 */}
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center">
                  <svg
                    className="h-8 w-8 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Upload Resume
                </h3>
                <p className="text-sm text-secondary">
                  We parse your resume to understand your skills, experience,
                  and graduation timeline.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center">
                  <svg
                    className="h-8 w-8 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Get Matched
                </h3>
                <p className="text-sm text-secondary">
                  See relevant internships ranked by match score with
                  personalized application tips.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center">
                  <svg
                    className="h-8 w-8 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Apply Confidently
                </h3>
                <p className="text-sm text-secondary">
                  Know exactly why you&apos;re a good fit before you apply,
                  saving time and improving success rate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-md space-y-8">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold text-foreground">
                  Join the Waitlist
                </h2>
                <p className="text-secondary">
                  Be notified when we launch. No spam.
                </p>
              </div>

              {submitSuccess ? (
                <div className="border border-border bg-muted p-6 text-center">
                  <p className="text-sm font-medium text-foreground">
                    Thanks for joining! We&apos;ll email you when we launch.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="placeholder:text-tertiary w-full border border-border bg-white px-3 py-2 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="you@university.edu"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="placeholder:text-tertiary w-full border border-border bg-white px-3 py-2 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="graduation"
                      className="text-sm font-medium text-foreground"
                    >
                      Expected Graduation
                    </label>
                    <select
                      id="graduation"
                      required
                      value={graduationDate}
                      onChange={(e) => setGraduationDate(e.target.value)}
                      className="w-full border border-border bg-white px-3 py-2 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="">Select graduation date</option>
                      <option value="2025-05">May 2025</option>
                      <option value="2025-12">December 2025</option>
                      <option value="2026-05">May 2026</option>
                      <option value="2026-12">December 2026</option>
                      <option value="2027-05">May 2027</option>
                      <option value="2027-12">December 2027</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full border border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="text-tertiary flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} InternMatch. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
