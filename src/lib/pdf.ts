// @ts-expect-error - pdf-parse doesn't have proper TypeScript types
import pdf from 'pdf-parse';

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);
  return data.text;
}
