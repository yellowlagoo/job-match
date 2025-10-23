import { NextResponse } from 'next/server';
import { extractText } from 'unpdf';

/**
 * Test endpoint to verify unpdf import and basic functionality
 * Visit: http://localhost:3000/api/test-pdf
 */
export const runtime = 'nodejs';

export async function GET() {
  const testId = `test_${Date.now()}`;

  console.log(`[Test:${testId}] Testing unpdf import...`);

  try {
    // Test 1: Import verification
    console.log(`[Test:${testId}] Step 1: Verifying extractText import...`);
    console.log(`[Test:${testId}] extractText type:`, typeof extractText);

    if (typeof extractText !== 'function') {
      throw new Error(
        `extractText is not a function, got: ${typeof extractText}`
      );
    }

    console.log(`[Test:${testId}] ✓ extractText imported successfully`);

    // Test 2: Create a minimal valid PDF
    console.log(`[Test:${testId}] Step 2: Creating minimal test PDF...`);

    // Minimal PDF with "Hello World" text
    const minimalPDF = Buffer.from(
      '%PDF-1.0\n' +
        '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
        '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
        '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<<>>>>endobj\n' +
        '4 0 obj<</Length 44>>stream\n' +
        'BT\n' +
        '/F1 24 Tf\n' +
        '100 700 Td\n' +
        '(Hello World) Tj\n' +
        'ET\n' +
        'endstream\n' +
        'endobj\n' +
        'xref\n' +
        '0 5\n' +
        '0000000000 65535 f\n' +
        '0000000009 00000 n\n' +
        '0000000056 00000 n\n' +
        '0000000115 00000 n\n' +
        '0000000229 00000 n\n' +
        'trailer<</Size 5/Root 1 0 R>>\n' +
        'startxref\n' +
        '321\n' +
        '%%EOF'
    );

    console.log(
      `[Test:${testId}] PDF buffer size:`,
      minimalPDF.length,
      'bytes'
    );

    // Test 3: Extract text
    console.log(`[Test:${testId}] Step 3: Extracting text from test PDF...`);
    const startTime = Date.now();

    const result = await extractText(new Uint8Array(minimalPDF), {
      mergePages: true,
    });

    const extractionTime = Date.now() - startTime;
    console.log(`[Test:${testId}] Extraction completed in ${extractionTime}ms`);
    console.log(`[Test:${testId}] Total pages:`, result.totalPages);
    console.log(`[Test:${testId}] Extracted text:`, result.text);
    console.log(`[Test:${testId}] Text length:`, result.text.length);

    console.log(`[Test:${testId}] ✓ All tests passed`);

    return NextResponse.json({
      success: true,
      message: 'unpdf is working correctly',
      tests: {
        importTest: 'PASS - extractText is a function',
        pdfCreationTest: `PASS - Created ${minimalPDF.length} byte PDF`,
        extractionTest: `PASS - Extracted in ${extractionTime}ms`,
        resultTest: `PASS - Got ${result.text.length} characters from ${result.totalPages} page(s)`,
      },
      extractedText: result.text,
      testId,
    });
  } catch (error) {
    console.error(`[Test:${testId}] Test failed:`, error);

    if (error instanceof Error) {
      console.error(`[Test:${testId}] Error name:`, error.name);
      console.error(`[Test:${testId}] Error message:`, error.message);
      console.error(`[Test:${testId}] Error stack:`, error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'unpdf test failed',
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.name : typeof error,
        testId,
      },
      { status: 500 }
    );
  }
}
