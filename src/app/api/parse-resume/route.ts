import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { parseResume } from '@/services/resume-parser';
import { extractTextFromPDF, validatePDFFile } from '@/lib/pdf-extractor';

/**
 * API Route: Parse Resume
 * Handles PDF upload, text extraction, and AI parsing
 *
 * Runtime Configuration:
 * - Force Node.js runtime (required for PDF.js canvas operations)
 * - Disable static optimization to ensure server-side execution
 */
export const runtime = 'nodejs'; // Force Node.js runtime
export const dynamic = 'force-dynamic'; // Disable static optimization
export const maxDuration = 60; // Maximum execution time: 60 seconds

/**
 * POST handler for resume parsing
 */
export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(
    `\n[API ${timestamp}] ========== NEW RESUME PARSE REQUEST ==========`
  );

  try {
    // ==================== ENVIRONMENT VALIDATION ====================
    console.log('[API] Validating environment configuration...');
    if (!process.env.GROQ_API_KEY) {
      console.error(
        '[API] CRITICAL: GROQ_API_KEY is not set in environment variables'
      );
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: 'AI service is not configured. Please contact support.',
          timestamp,
        },
        { status: 500 }
      );
    }
    console.log('[API] ✓ Environment configuration valid');

    // ==================== FORMDATA PARSING ====================
    console.log('[API] Parsing FormData from request...');
    const formData = await req.formData();
    const formDataKeys = Array.from(formData.keys());
    console.log('[API] FormData keys received:', formDataKeys);

    const file = formData.get('resume') as File | null;

    // ==================== FILE VALIDATION ====================
    console.log('[API] Validating uploaded file...');

    if (!file) {
      console.warn('[API] ❌ Validation failed: No file in FormData');
      return NextResponse.json(
        {
          error: 'No file provided',
          details: 'Please select a PDF file to upload.',
          timestamp,
        },
        { status: 400 }
      );
    }

    console.log('[API] File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
    });

    // Use comprehensive validation function
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      console.warn('[API] ❌ Validation failed:', validation.error);
      return NextResponse.json(
        {
          error: 'File validation failed',
          details: validation.error,
          timestamp,
        },
        { status: 400 }
      );
    }

    console.log('[API] ✓ File validation passed');

    // ==================== PDF TEXT EXTRACTION ====================
    console.log('[API] Starting PDF text extraction...');
    const startExtraction = Date.now();

    const text = await extractTextFromPDF(file);

    const extractionTime = Date.now() - startExtraction;
    console.log(`[API] ✓ PDF extraction completed in ${extractionTime}ms`);
    console.log(`[API] Extracted text length: ${text.length} characters`);

    if (text.length < 50) {
      console.warn(
        '[API] ⚠️ Warning: Extracted text is very short. May not contain enough information.'
      );
    }

    // ==================== AI PARSING WITH GROQ ====================
    console.log('[API] Starting Groq AI parsing...');
    const startParsing = Date.now();

    const parsed = await parseResume(text);

    const parsingTime = Date.now() - startParsing;
    console.log(`[API] ✓ Groq parsing completed in ${parsingTime}ms`);
    console.log('[API] Parsed resume data:', JSON.stringify(parsed, null, 2));

    // ==================== RESPONSE VALIDATION ====================
    console.log('[API] Validating parsed data...');

    if (!parsed.name || !parsed.email) {
      console.warn('[API] ⚠️ Warning: Incomplete data - missing name or email');
      console.warn('[API] Parsed data:', parsed);
    }

    const totalTime = Date.now() - new Date(timestamp).getTime();
    console.log(
      `[API] ========== REQUEST COMPLETED SUCCESSFULLY (${totalTime}ms) ==========\n`
    );

    return NextResponse.json({
      ...parsed,
      _meta: {
        processingTime: totalTime,
        extractionTime,
        parsingTime,
        timestamp,
      },
    });
  } catch (error) {
    console.error(`[API] ========== REQUEST FAILED ==========`);
    console.error('[API] Error details:', error);

    if (error instanceof Error) {
      console.error('[API] Error name:', error.name);
      console.error('[API] Error message:', error.message);
      console.error('[API] Error stack:', error.stack);
    }

    // Provide specific error messages based on error type
    let userMessage = 'Failed to parse resume';
    let details = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;

    if (error instanceof Error) {
      // PDF-related errors
      if (error.message.includes('Invalid or corrupted PDF')) {
        userMessage = 'Invalid PDF file';
        details =
          'The uploaded file appears to be corrupted or is not a valid PDF. Please try re-saving your resume as a PDF.';
        statusCode = 422;
      } else if (error.message.includes('password-protected')) {
        userMessage = 'Password-protected PDF';
        details =
          'This PDF is password-protected. Please remove the password and upload again.';
        statusCode = 422;
      } else if (
        error.message.includes('no text') ||
        error.message.includes('image-based')
      ) {
        userMessage = 'Cannot extract text from PDF';
        details =
          'This appears to be a scanned or image-based PDF with no extractable text. Please upload a text-based PDF or use OCR to convert your document.';
        statusCode = 422;
      } else if (error.message.includes('too short')) {
        userMessage = 'Insufficient text in PDF';
        details =
          'The PDF contains very little text. Please ensure you are uploading a complete resume.';
        statusCode = 422;
      } else if (error.message.includes('PDF')) {
        userMessage = 'PDF processing failed';
        details = error.message;
        statusCode = 500;
      }
      // Groq API errors
      else if (
        error.message.includes('Groq') ||
        error.message.includes('API')
      ) {
        userMessage = 'AI parsing failed';
        details =
          'The AI service encountered an error while analyzing your resume. Please try again.';
        statusCode = 503;
      }
      // Timeout errors
      else if (error.message.includes('timeout')) {
        userMessage = 'Request timeout';
        details =
          'The request took too long to process. Please try with a smaller or simpler PDF.';
        statusCode = 504;
      }
    }

    console.error(`[API] ========== END ERROR ==========\n`);

    return NextResponse.json(
      {
        error: userMessage,
        details,
        timestamp,
      },
      { status: statusCode }
    );
  }
}
