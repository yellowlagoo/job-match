import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { parseResume } from '@/services/resume-parser';
import { extractTextFromPDF } from '@/lib/pdf';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const text = await extractTextFromPDF(file);

    // Parse with Groq
    const parsed = await parseResume(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
