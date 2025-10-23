/**
 * PDF Text Extraction using Mozilla PDF.js
 * This implementation is compatible with Next.js 14 App Router and serverless environments
 */

import * as pdfjsLib from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

// Configure PDF.js worker - disable worker for Node.js environment
if (typeof window === 'undefined') {
  // Server-side: disable worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

/**
 * Validates that the uploaded file is a valid PDF
 */
export function validatePDFFile(file: File): {
  valid: boolean;
  error?: string;
} {
  console.log('[PDF Validator] Validating file:', file.name);

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (
    file.type !== 'application/pdf' &&
    !file.name.toLowerCase().endsWith('.pdf')
  ) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type || 'unknown'}. Only PDF files are supported.`,
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 10MB.`,
    };
  }

  if (file.size < 100) {
    return { valid: false, error: 'File appears to be empty or corrupted' };
  }

  console.log('[PDF Validator] ✓ Validation passed');
  return { valid: true };
}

/**
 * Extracts text content from a PDF file using PDF.js
 * @param file - The PDF file to extract text from
 * @returns The extracted text content
 * @throws Error if extraction fails
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  console.log('[PDF Extractor] Starting extraction for:', file.name);
  console.log(
    '[PDF Extractor] File size:',
    (file.size / 1024).toFixed(2),
    'KB'
  );

  try {
    // Convert File to ArrayBuffer
    console.log('[PDF Extractor] Converting file to ArrayBuffer...');
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log('[PDF Extractor] Loading PDF document...');

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      standardFontDataUrl: undefined,
    });

    const pdfDocument = await loadingTask.promise;

    const numPages = pdfDocument.numPages;
    console.log(
      `[PDF Extractor] ✓ PDF loaded successfully. Pages: ${numPages}`
    );

    if (numPages === 0) {
      throw new Error('PDF has no pages');
    }

    if (numPages > 10) {
      console.warn(
        `[PDF Extractor] ⚠️ Warning: PDF has ${numPages} pages. This may take longer to process.`
      );
    }

    // Extract text from all pages
    const textPromises: Promise<string>[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      textPromises.push(extractPageText(pdfDocument, pageNum));
    }

    console.log(`[PDF Extractor] Extracting text from ${numPages} pages...`);
    const pagesText = await Promise.all(textPromises);

    // Combine all page text with page separators
    const fullText = pagesText.join('\n\n--- Page Break ---\n\n');

    console.log('[PDF Extractor] ✓ Text extraction completed');
    console.log('[PDF Extractor] Total characters extracted:', fullText.length);
    console.log(
      '[PDF Extractor] Text preview:',
      fullText.substring(0, 200).replace(/\n/g, ' ') + '...'
    );

    // Validate extracted text
    if (!fullText || fullText.trim().length === 0) {
      throw new Error(
        'No text could be extracted from this PDF. It may be image-based or scanned. Please use a text-based PDF.'
      );
    }

    if (fullText.length < 50) {
      throw new Error(
        'Extracted text is too short. The PDF may be mostly images or have no extractable text. Please use a text-based PDF.'
      );
    }

    // Clean up the document
    pdfDocument.destroy();

    return fullText;
  } catch (error) {
    console.error('[PDF Extractor] ❌ Extraction failed:', error);

    if (error instanceof Error) {
      // Handle specific PDF.js errors
      if (error.message.includes('Invalid PDF')) {
        throw new Error(
          'Invalid or corrupted PDF file. Please ensure the file is a valid PDF and try again.'
        );
      }

      if (error.message.includes('password')) {
        throw new Error(
          'This PDF is password-protected. Please remove the password and try again.'
        );
      }

      // Re-throw our custom errors
      if (
        error.message.includes('no text') ||
        error.message.includes('image-based') ||
        error.message.includes('too short')
      ) {
        throw error;
      }

      throw new Error(`PDF text extraction failed: ${error.message}`);
    }

    throw new Error('PDF text extraction failed: Unknown error');
  }
}

/**
 * Extracts text from a single PDF page
 * @param pdfDocument - The loaded PDF document
 * @param pageNum - The page number (1-indexed)
 * @returns The extracted text from the page
 */
async function extractPageText(
  pdfDocument: Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>,
  pageNum: number
): Promise<string> {
  try {
    console.log(`[PDF Extractor] Processing page ${pageNum}...`);

    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Extract text items and join them
    const textItems = textContent.items
      .filter((item): item is TextItem => 'str' in item)
      .map((item) => item.str);

    const pageText = textItems.join(' ');

    console.log(
      `[PDF Extractor] ✓ Page ${pageNum} extracted: ${pageText.length} characters`
    );

    return pageText;
  } catch (error) {
    console.error(
      `[PDF Extractor] ❌ Failed to extract page ${pageNum}:`,
      error
    );
    throw new Error(`Failed to extract text from page ${pageNum}`);
  }
}
