import Groq from 'groq-sdk';

/**
 * Resume Parser Service
 * Uses Groq AI to extract structured data from resume text
 */

// Initialize Groq client with API key validation
console.log('[Parser] Initializing Groq SDK...');
if (!process.env.GROQ_API_KEY) {
  console.error(
    '[Parser] CRITICAL: GROQ_API_KEY is not set in environment variables'
  );
  throw new Error('GROQ_API_KEY environment variable is required');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('[Parser] ✓ Groq SDK initialized successfully');

export interface ParsedResume {
  name: string;
  email: string;
  graduationDate: string;
  degree: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    duration: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    tech: string[];
  }>;
  gpa: string | null;
}

/**
 * Parses resume text using Groq AI and returns structured data
 * @param resumeText - The extracted text from the resume PDF
 * @returns Structured resume data
 * @throws Error if API call fails or returns invalid data
 */
export async function parseResume(resumeText: string): Promise<ParsedResume> {
  console.log('[Parser] Starting resume parsing...');
  console.log('[Parser] Input text length:', resumeText.length, 'characters');
  console.log(
    '[Parser] Input text preview:',
    resumeText.substring(0, 150) + '...'
  );

  // Validate input
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text is empty');
  }

  if (resumeText.length < 50) {
    console.warn(
      '[Parser] ⚠️ Warning: Resume text is very short, may not contain enough information'
    );
  }

  try {
    console.log(
      '[Parser] Calling Groq API with model: llama-3.1-70b-versatile'
    );

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a resume parser. Extract information and return only valid JSON. If information is not found, use reasonable defaults: empty arrays for lists, null for optional fields, and "Not specified" for required text fields.',
        },
        {
          role: 'user',
          content: `Extract this data from the resume and return as JSON:
{
  "name": "full name",
  "email": "email address",
  "graduationDate": "YYYY-MM format or 'Not specified'",
  "degree": "Bachelor's or Master's or PhD or 'Not specified'",
  "skills": ["array", "of", "skills"],
  "experience": [{"company": "...", "role": "...", "duration": "..."}],
  "projects": [{"name": "...", "description": "...", "tech": ["..."]}],
  "gpa": "X.XX if mentioned, otherwise null"
}

Resume text:
${resumeText}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    console.log('[Parser] ✓ Groq API call completed');
    console.log('[Parser] Response metadata:', {
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0]?.finish_reason,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.error('[Parser] ❌ No content in Groq response');
      throw new Error('No content returned from Groq API');
    }

    console.log(
      '[Parser] Raw response content length:',
      content.length,
      'characters'
    );
    console.log(
      '[Parser] Raw response preview:',
      content.substring(0, 200) + '...'
    );

    console.log('[Parser] Parsing JSON response...');
    let parsed: ParsedResume;

    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('[Parser] ❌ Failed to parse JSON response:', parseError);
      console.error('[Parser] Invalid JSON content:', content);
      throw new Error('Failed to parse JSON response from Groq API');
    }

    console.log('[Parser] ✓ JSON parsed successfully');
    console.log(
      '[Parser] Parsed data structure:',
      JSON.stringify(parsed, null, 2)
    );

    // Validate parsed data structure
    console.log('[Parser] Validating parsed data structure...');

    if (!parsed.name) {
      console.warn('[Parser] ⚠️ Warning: name field is missing or empty');
      parsed.name = 'Not specified';
    }

    if (!parsed.email) {
      console.warn('[Parser] ⚠️ Warning: email field is missing or empty');
      parsed.email = 'Not specified';
    }

    if (!Array.isArray(parsed.skills)) {
      console.warn(
        '[Parser] ⚠️ Warning: skills is not an array, converting...'
      );
      parsed.skills = [];
    }

    if (!Array.isArray(parsed.experience)) {
      console.warn(
        '[Parser] ⚠️ Warning: experience is not an array, converting...'
      );
      parsed.experience = [];
    }

    if (!Array.isArray(parsed.projects)) {
      console.warn(
        '[Parser] ⚠️ Warning: projects is not an array, converting...'
      );
      parsed.projects = [];
    }

    console.log('[Parser] ✓ Data validation completed');
    console.log('[Parser] Final parsed resume:', {
      name: parsed.name,
      email: parsed.email,
      skillsCount: parsed.skills.length,
      experienceCount: parsed.experience.length,
      projectsCount: parsed.projects.length,
    });

    return parsed;
  } catch (error) {
    console.error('[Parser] ========== PARSING FAILED ==========');
    console.error('[Parser] Error details:', error);

    if (error instanceof Error) {
      console.error('[Parser] Error name:', error.name);
      console.error('[Parser] Error message:', error.message);
      console.error('[Parser] Error stack:', error.stack);
    }

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Groq API parsing failed: ${error.message}`);
    }

    throw new Error('Groq API parsing failed: Unknown error');
  }
}
