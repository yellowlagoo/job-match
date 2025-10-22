import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">InternMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Find Your Perfect
              <span className="text-primary"> SWE Internship</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Upload your resume and get matched with relevant internship
              opportunities daily. No more endless scrolling through job boards.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg">Start Matching</Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 text-4xl">📄</div>
                <h3 className="mb-2 text-xl font-semibold">Upload Resume</h3>
                <p className="text-muted-foreground">
                  Our AI parses your resume to understand your skills,
                  experience, and preferences.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 text-4xl">🤖</div>
                <h3 className="mb-2 text-xl font-semibold">Smart Matching</h3>
                <p className="text-muted-foreground">
                  We analyze thousands of internship postings and match you with
                  opportunities that fit your profile.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 text-4xl">📧</div>
                <h3 className="mb-2 text-xl font-semibold">Get Notified</h3>
                <p className="text-muted-foreground">
                  Receive email notifications when new relevant matches are
                  found. Apply with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">
                  1000+
                </div>
                <p className="text-muted-foreground">Active Job Listings</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">95%</div>
                <p className="text-muted-foreground">Match Accuracy</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">24/7</div>
                <p className="text-muted-foreground">Automated Scraping</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-24 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Find Your Next Internship?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join hundreds of students who have found their dream internships
              with InternMatch.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} InternMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
