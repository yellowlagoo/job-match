import { NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-extractor';

/**
 * Test endpoint to verify PDF extraction pipeline
 * Visit: http://localhost:3000/api/test-extraction
 */
export const runtime = 'nodejs';

export async function GET() {
  const testId = `extraction_test_${Date.now()}`;

  console.log(`[ExtractionTest:${testId}] Testing PDF extraction pipeline...`);

  try {
    // Create a minimal valid PDF with enough text to pass validation
    console.log(`[ExtractionTest:${testId}] Creating test PDF...`);

    const pdfContent = Buffer.from(
      '%PDF-1.4\n' +
        '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
        '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
        '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n' +
        '4 0 obj<</Length 220>>stream\n' +
        'BT\n' +
        '/F1 12 Tf\n' +
        '50 750 Td\n' +
        '(John Doe Software Engineer) Tj\n' +
        '0 -15 Td\n' +
        '(Email: john@example.com Phone: 555-1234) Tj\n' +
        '0 -15 Td\n' +
        '(Skills: JavaScript TypeScript React Node.js) Tj\n' +
        '0 -15 Td\n' +
        '(Experience: 3 years software development) Tj\n' +
        'ET\n' +
        'endstream\n' +
        'endobj\n' +
        '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n' +
        'xref\n' +
        '0 6\n' +
        '0000000000 65535 f\n' +
        '0000000009 00000 n\n' +
        '0000000056 00000 n\n' +
        '0000000115 00000 n\n' +
        '0000000261 00000 n\n' +
        '0000000531 00000 n\n' +
        'trailer<</Size 6/Root 1 0 R>>\n' +
        'startxref\n' +
        '609\n' +
        '%%EOF'
    );

    // Convert Buffer to File
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const file = new File([blob], 'test-resume.pdf', {
      type: 'application/pdf',
    });

    console.log(`[ExtractionTest:${testId}] Test file created:`, {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Test extraction
    console.log(
      `[ExtractionTest:${testId}] Testing extractTextFromPDF function...`
    );
    const startTime = Date.now();

    const extractedText = await extractTextFromPDF(file);

    const extractionTime = Date.now() - startTime;
    console.log(
      `[ExtractionTest:${testId}] ✓ Extraction successful in ${extractionTime}ms`
    );

    return NextResponse.json({
      success: true,
      message: 'PDF extraction pipeline working',
      testFile: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      extraction: {
        textLength: extractedText.length,
        extractionTime: `${extractionTime}ms`,
        text: extractedText,
      },
      testId,
    });
  } catch (error) {
    console.error(`[ExtractionTest:${testId}] Extraction test failed:`, error);

    if (error instanceof Error) {
      console.error(`[ExtractionTest:${testId}] Error name:`, error.name);
      console.error(`[ExtractionTest:${testId}] Error message:`, error.message);
      console.error(`[ExtractionTest:${testId}] Error stack:`, error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'PDF extraction test failed',
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.name : typeof error,
        testId,
      },
      { status: 500 }
    );
  }
}
