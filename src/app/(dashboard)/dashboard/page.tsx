import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your internship search.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            New Matches
          </h3>
          <p className="mt-2 text-3xl font-bold">0</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Matches waiting for review
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Matches
          </h3>
          <p className="mt-2 text-3xl font-bold">0</p>
          <p className="mt-1 text-xs text-muted-foreground">
            All time matches found
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Applications
          </h3>
          <p className="mt-2 text-3xl font-bold">0</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Jobs you&apos;ve applied to
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Upload Resume</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Upload your resume to start getting matched with internships
            </p>
            <Button>Upload Resume</Button>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">View Matches</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Check out your latest internship matches
            </p>
            <Button variant="outline">View Matches</Button>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="rounded-lg border bg-muted/50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Getting Started</h2>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              1
            </span>
            <div>
              <p className="font-medium">Upload your resume</p>
              <p className="text-sm text-muted-foreground">
                Our AI will parse your skills and experience
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              2
            </span>
            <div>
              <p className="font-medium">Set your preferences</p>
              <p className="text-sm text-muted-foreground">
                Tell us about your location preferences and work authorization
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              3
            </span>
            <div>
              <p className="font-medium">Receive matches</p>
              <p className="text-sm text-muted-foreground">
                Get email notifications when relevant internships are found
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
