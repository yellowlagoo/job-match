import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link
              href="/dashboard"
              className="mr-6 flex items-center space-x-2"
            >
              <span className="text-xl font-bold text-primary">
                InternMatch
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80"
              >
                Dashboard
              </Link>
              <Link
                href="/matches"
                className="transition-colors hover:text-foreground/80"
              >
                Matches
              </Link>
              <Link
                href="/profile"
                className="transition-colors hover:text-foreground/80"
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, Prisma, and Clerk. &copy;{' '}
            {new Date().getFullYear()} InternMatch.
          </p>
        </div>
      </footer>
    </div>
  );
}
