import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InternMatch - AI-Powered Internship Matching',
  description:
    'Automatically match with relevant software engineering internships based on your skills and experience.',
  keywords: [
    'internship',
    'software engineering',
    'job matching',
    'resume parser',
    'career',
  ],
  authors: [{ name: 'InternMatch Team' }],
  openGraph: {
    title: 'InternMatch - AI-Powered Internship Matching',
    description:
      'Find your perfect SWE internship with AI-powered matching and daily job updates.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
