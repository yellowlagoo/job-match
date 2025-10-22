import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { Resend } from 'resend';

const WaitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  graduationDate: z.string(),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = WaitlistSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.waitlist.create({
      data: {
        email: data.email,
        name: data.name,
        graduationDate: data.graduationDate,
      },
    });

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'InternMatch <onboarding@resend.dev>',
        to: data.email,
        subject: "You're on the InternMatch waitlist",
        text: `Hey ${data.name},\n\nThanks for joining! We'll email you when we launch.\n\nThe InternMatch Team`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0a0a0a; font-size: 24px; font-weight: 600; margin-bottom: 16px;">
              You're on the waitlist
            </h2>
            <p style="color: #525252; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
              Hey ${data.name},
            </p>
            <p style="color: #525252; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
              Thanks for joining the InternMatch waitlist! We'll email you when we launch.
            </p>
            <p style="color: #525252; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
              In the meantime, you can <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/demo" style="color: #0070f3; text-decoration: none;">try our demo</a> to see how it works.
            </p>
            <p style="color: #a3a3a3; font-size: 14px; line-height: 20px; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
              The InternMatch Team
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
