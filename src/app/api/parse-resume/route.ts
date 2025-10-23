import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, validatePDFFile } from '@/lib/pdf-extractor';
import { parseResume } from '@/services/resume-parser';
import { ParsedResume } from '@/services/resume-parser';

/**
 * API Route: Parse Resume
 * Handles PDF upload, text extraction, and AI parsing
 *
 * Runtime Configuration:
 * - Force Node.js runtime (required for PDF processing)
 * - Disable static optimization to ensure server-side execution
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Generate unique request ID for log correlation
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * POST handler for resume parsing
 */
export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[API:${requestId}] ========== NEW REQUEST ==========`);
  console.log(`[API:${requestId}] Timestamp:`, timestamp);
  console.log(`[API:${requestId}] URL:`, req.url);
  console.log(`[API:${requestId}] Method:`, req.method);
  console.log(`[API:${requestId}] Runtime check:`, {
    nodeVersion: process.version,
    platform: process.platform,
    env: process.env.NODE_ENV,
  });

  try {
    // ==================== STEP 1: ENVIRONMENT VALIDATION ====================
    console.log(`[API:${requestId}] Step 1/5: Validating environment...`);
    if (!process.env.GROQ_API_KEY) {
      console.error(`[API:${requestId}] CRITICAL: GROQ_API_KEY is not set`);
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: 'AI service is not configured. Please contact support.',
          requestId,
          timestamp,
        },
        { status: 500 }
      );
    }
    console.log(`[API:${requestId}] ✓ Step 1 complete - Environment valid`);

    // ==================== STEP 2: PARSE FORMDATA ====================
    console.log(`[API:${requestId}] Step 2/5: Parsing FormData...`);
    let formData: FormData;
    try {
      formData = await req.formData();
      const formDataKeys = Array.from(formData.keys());
      console.log(`[API:${requestId}] FormData keys:`, formDataKeys);
    } catch (error) {
      console.error(`[API:${requestId}] Failed to parse FormData:`, error);
      throw new Error('Invalid request format');
    }

    const file = formData.get('resume') as File | null;
    console.log(`[API:${requestId}] File present:`, !!file);
    if (file) {
      console.log(`[API:${requestId}] File details:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      });
    }
    console.log(`[API:${requestId}] ✓ Step 2 complete - FormData parsed`);

    // ==================== STEP 3: VALIDATE FILE ====================
    console.log(`[API:${requestId}] Step 3/5: Validating file...`);
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      console.warn(`[API:${requestId}] Validation failed:`, validation.error);
      return NextResponse.json(
        {
          error: 'File validation failed',
          details: validation.error,
          requestId,
          timestamp,
        },
        { status: 400 }
      );
    }
    console.log(`[API:${requestId}] ✓ Step 3 complete - File validated`);

    // ==================== STEP 4: EXTRACT TEXT FROM PDF ====================
    console.log(`[API:${requestId}] Step 4/5: Extracting text from PDF...`);
    const extractionStartTime = Date.now();
    let extractedText: string;
    try {
      extractedText = await extractTextFromPDF(file!);
      const extractionTime = Date.now() - extractionStartTime;
      console.log(
        `[API:${requestId}] PDF extraction completed in ${extractionTime}ms`
      );
      console.log(
        `[API:${requestId}] Extracted text length: ${extractedText.length} characters`
      );
      console.log(
        `[API:${requestId}] Text preview:`,
        extractedText.substring(0, 150)
      );
    } catch (error) {
      console.error(`[API:${requestId}] PDF extraction failed:`, error);
      throw error; // Re-throw to outer catch
    }
    console.log(`[API:${requestId}] ✓ Step 4 complete - Text extracted`);

    // ==================== STEP 5: PARSE WITH GROQ AI ====================
    console.log(`[API:${requestId}] Step 5/5: Parsing with Groq AI...`);
    const parsingStartTime = Date.now();
    let parsedData: ParsedResume;
    try {
      parsedData = await parseResume(extractedText);
      const parsingTime = Date.now() - parsingStartTime;
      console.log(
        `[API:${requestId}] Groq parsing completed in ${parsingTime}ms`
      );
      console.log(`[API:${requestId}] Parsed name:`, parsedData.name);
      console.log(`[API:${requestId}] Parsed email:`, parsedData.email);
      console.log(
        `[API:${requestId}] Parsed skills count:`,
        parsedData.skills?.length || 0
      );
    } catch (error) {
      console.error(`[API:${requestId}] Groq parsing failed:`, error);
      throw error; // Re-throw to outer catch
    }
    console.log(`[API:${requestId}] ✓ Step 5 complete - Resume parsed`);

    // ==================== SUCCESS ====================
    const totalTime = Date.now() - startTime;
    console.log(`[API:${requestId}] ========== REQUEST SUCCESSFUL ==========`);
    console.log(`[API:${requestId}] Total time: ${totalTime}ms`);

    return NextResponse.json({
      ...parsedData,
      _meta: {
        requestId,
        processingTime: totalTime,
        timestamp,
      },
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;

    console.error(`[API:${requestId}] ========== REQUEST FAILED ==========`);
    console.error(`[API:${requestId}] Time until failure: ${totalTime}ms`);
    console.error(`[API:${requestId}] Error type:`, typeof error);
    console.error(
      `[API:${requestId}] Error constructor:`,
      error?.constructor?.name
    );
    console.error(
      `[API:${requestId}] Error instanceof Error:`,
      error instanceof Error
    );
    console.error(`[API:${requestId}] Error instance checks:`, {
      isError: error instanceof Error,
      hasMessage: 'message' in (error || {}),
      hasStack: 'stack' in (error || {}),
    });
    console.error(`[API:${requestId}] Full error:`, error);
    console.error(`[API:${requestId}] Error toString:`, String(error));

    if (error instanceof Error) {
      console.error(`[API:${requestId}] Error.name:`, error.name);
      console.error(`[API:${requestId}] Error.message:`, error.message);
      console.error(`[API:${requestId}] Error.stack:`, error.stack);
      console.error(`[API:${requestId}] Error.cause:`, error.cause);
    }

    console.error(`[API:${requestId}] ========== END ERROR ==========`);

    // Determine appropriate error message and status code
    let errorMessage = 'Failed to parse resume';
    let details = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;

    if (error instanceof Error) {
      // PDF-related errors
      if (error.message.includes('Invalid or corrupted PDF')) {
        errorMessage = 'Invalid PDF file';
        details =
          'The uploaded file appears to be corrupted or is not a valid PDF.';
        statusCode = 422;
      } else if (error.message.includes('password-protected')) {
        errorMessage = 'Password-protected PDF';
        details =
          'This PDF is password-protected. Please remove the password and upload again.';
        statusCode = 422;
      } else if (
        error.message.includes('no text') ||
        error.message.includes('No text could be extracted') ||
        error.message.includes('image-based') ||
        error.message.includes('scanned document')
      ) {
        errorMessage = 'Cannot extract text from PDF';
        details =
          'This appears to be a scanned or image-based PDF. Please upload a text-based PDF.';
        statusCode = 422;
      } else if (error.message.includes('too short')) {
        errorMessage = 'Insufficient text in PDF';
        details =
          'The PDF contains very little text. Please ensure you are uploading a complete resume.';
        statusCode = 422;
      } else if (error.message.includes('PDF')) {
        errorMessage = 'PDF processing failed';
        details = error.message;
        statusCode = 500;
      }
      // Groq API errors
      else if (
        error.message.includes('Groq') ||
        error.message.includes('API')
      ) {
        errorMessage = 'AI parsing failed';
        details = 'The AI service encountered an error. Please try again.';
        statusCode = 503;
      }
      // Timeout errors
      else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout';
        details = 'The request took too long. Please try with a smaller PDF.';
        statusCode = 504;
      } else {
        // Generic error - use the error message as details
        details = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details,
        requestId,
        timestamp,
      },
      { status: statusCode }
    );
  }
}
