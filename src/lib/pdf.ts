/**
 * PDF text extraction utility using pdf-parse
 * Uses dynamic import to handle CommonJS module compatibility with Next.js
 */

// Type definition for pdf-parse module
interface PDFData {
  text: string;
  numpages: number;
  numrender: number;
  info: Record<string, unknown>;
  metadata: Record<string, unknown> | null;
  version: string;
}

type PDFParseFunction = (buffer: Buffer) => Promise<PDFData>;

export async function extractTextFromPDF(file: File): Promise<string> {
  console.log(
    '[PDF] Starting extraction for file:',
    file.name,
    'Size:',
    file.size,
    'bytes'
  );

  try {
    // Dynamic import to handle CommonJS module in Next.js ESM environment
    // pdf-parse is a CommonJS module that doesn't have proper ESM default export
    // We use a type assertion here because pdf-parse doesn't provide TypeScript types
    const pdfParseModule = await import('pdf-parse');
    // @ts-expect-error - pdf-parse exports as CommonJS and doesn't have proper type definitions
    const pdfParse = pdfParseModule.default as PDFParseFunction;

    console.log('[PDF] Converting file to buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('[PDF] Parsing PDF with pdf-parse...');
    const data = await pdfParse(buffer);

    const extractedText = data.text;
    console.log(
      '[PDF] Successfully extracted text. Length:',
      extractedText.length,
      'characters'
    );
    console.log('[PDF] Text preview:', extractedText.substring(0, 200) + '...');

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error(
        'PDF appears to be empty or contains no extractable text'
      );
    }

    return extractedText;
  } catch (error) {
    console.error('[PDF] Extraction failed:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
    throw new Error('Failed to extract text from PDF: Unknown error');
  }
}
