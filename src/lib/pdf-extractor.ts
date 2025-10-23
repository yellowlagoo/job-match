/**
 * PDF Text Extraction Service - Production Grade
 *
 * Uses unpdf library for reliable text extraction in Next.js serverless environment.
 * This library works without worker files and is compatible with Next.js bundling.
 */

import { extractText } from 'unpdf';

/**
 * Validation result for PDF files
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates PDF file before processing
 *
 * @param file - File object to validate
 * @returns Validation result with error message if invalid
 */
export function validatePDFFile(file: File | null): ValidationResult {
  console.log('[Validator] Starting validation...');

  if (!file) {
    console.error('[Validator] No file provided');
    return {
      valid: false,
      error: 'No file provided. Please select a PDF file.',
    };
  }

  console.log('[Validator] File details:', {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: new Date(file.lastModified).toISOString(),
  });

  // Check file type
  if (file.type !== 'application/pdf') {
    console.error('[Validator] Invalid file type:', file.type);
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only PDF files are supported.`,
    };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.error('[Validator] File too large:', file.size, 'bytes');
    return {
      valid: false,
      error: `File too large (${sizeMB}MB). Maximum size is 10MB. Please compress your PDF.`,
    };
  }

  // Check minimum file size
  if (file.size < 100) {
    console.error('[Validator] File too small:', file.size, 'bytes');
    return {
      valid: false,
      error:
        'File appears to be empty or corrupted. Please try a different PDF.',
    };
  }

  console.log('[Validator] ✓ Validation passed');
  return { valid: true };
}

/**
 * Extracts text content from a PDF file
 *
 * @param file - PDF file to extract text from
 * @returns Promise resolving to extracted text
 * @throws Error if extraction fails with detailed message
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const startTime = Date.now();
  const context = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  };

  console.log('[PDF Extractor] ========== STARTING EXTRACTION ==========');
  console.log('[PDF Extractor] Context:', context);

  try {
    // Step 1: Convert File to ArrayBuffer
    console.log('[PDF Extractor] Step 1: Converting file to ArrayBuffer...');
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
      console.log(
        '[PDF Extractor] ✓ ArrayBuffer created:',
        arrayBuffer.byteLength,
        'bytes'
      );
    } catch (error) {
      console.error('[PDF Extractor] ArrayBuffer conversion failed:', error);
      throw new Error(
        `Failed to read PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('PDF file is empty or could not be read');
    }

    // Step 2: Extract text using unpdf
    console.log('[PDF Extractor] Step 2: Extracting text with unpdf...');
    let result: { totalPages: number; text: string };
    try {
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log(
        '[PDF Extractor] Uint8Array created:',
        uint8Array.length,
        'bytes'
      );

      // Use extractText with mergePages: true to get a single string
      result = await extractText(uint8Array, { mergePages: true });

      const extractionTime = Date.now() - startTime;
      console.log('[PDF Extractor] ✓ Text extracted in', extractionTime, 'ms');
      console.log('[PDF Extractor] Total pages:', result.totalPages);
      console.log('[PDF Extractor] Raw text length:', result.text?.length || 0);
    } catch (error) {
      console.error('[PDF Extractor] Text extraction failed:', error);
      if (error instanceof Error) {
        console.error('[PDF Extractor] Error name:', error.name);
        console.error('[PDF Extractor] Error message:', error.message);
        console.error('[PDF Extractor] Error stack:', error.stack);
      }
      throw new Error(
        `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    // Step 3: Validate extracted text
    console.log('[PDF Extractor] Step 3: Validating extracted text...');

    if (result.text === null || result.text === undefined) {
      throw new Error('Extraction returned null or undefined');
    }

    if (typeof result.text !== 'string') {
      throw new Error(
        `Extraction returned invalid type: ${typeof result.text}`
      );
    }

    const trimmedText = result.text.trim();
    console.log('[PDF Extractor] Trimmed text length:', trimmedText.length);
    console.log(
      '[PDF Extractor] Text preview (first 200 chars):',
      trimmedText.substring(0, 200)
    );

    if (trimmedText.length === 0) {
      throw new Error(
        'No text could be extracted from the PDF. ' +
          'This may be a scanned document or image-based PDF. ' +
          'Please ensure your resume is a text-based PDF.'
      );
    }

    if (trimmedText.length < 100) {
      console.warn(
        '[PDF Extractor] Text is very short:',
        trimmedText.length,
        'characters'
      );
      throw new Error(
        `Extracted text is too short (${trimmedText.length} characters). ` +
          'The PDF may be corrupted, image-based, or not contain sufficient text. ' +
          'Please try a different PDF.'
      );
    }

    const totalTime = Date.now() - startTime;
    console.log('[PDF Extractor] ========== EXTRACTION SUCCESSFUL ==========');
    console.log('[PDF Extractor] Total time:', totalTime, 'ms');
    console.log(
      '[PDF Extractor] Final text length:',
      trimmedText.length,
      'characters'
    );
    console.log(
      '[PDF Extractor] Characters per second:',
      Math.round(trimmedText.length / (totalTime / 1000))
    );

    return trimmedText;
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('[PDF Extractor] ========== EXTRACTION FAILED ==========');
    console.error('[PDF Extractor] Time until failure:', totalTime, 'ms');
    console.error('[PDF Extractor] Context:', context);
    console.error('[PDF Extractor] Error type:', error?.constructor?.name);
    console.error('[PDF Extractor] Error:', error);

    if (error instanceof Error) {
      console.error('[PDF Extractor] Error.name:', error.name);
      console.error('[PDF Extractor] Error.message:', error.message);
      console.error('[PDF Extractor] Error.stack:', error.stack);
    }

    console.error('[PDF Extractor] ========== END ERROR ==========');

    // Re-throw with user-friendly message
    if (error instanceof Error) {
      // If it's already a user-friendly error, keep it
      if (
        error.message.includes('scanned document') ||
        error.message.includes('too short') ||
        error.message.includes('corrupted') ||
        error.message.includes('No text could be extracted')
      ) {
        throw error;
      }

      // Otherwise wrap with generic message
      throw new Error(
        `PDF text extraction failed: ${error.message}. ` +
          'Please ensure your PDF is not corrupted and try again.'
      );
    }

    throw new Error(
      'PDF text extraction failed due to an unknown error. ' +
        'Please try a different PDF file.'
    );
  }
}

/**
 * Gets basic metadata about a PDF file without full extraction
 * Useful for validation and logging
 */
export async function getPDFMetadata(file: File): Promise<{
  name: string;
  size: number;
  type: string;
  sizeFormatted: string;
}> {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeFormatted: `${(file.size / 1024).toFixed(2)}KB`,
  };
}
