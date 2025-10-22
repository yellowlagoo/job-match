import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

export async function parseResume(resumeText: string): Promise<ParsedResume> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are a resume parser. Extract information and return only valid JSON.',
      },
      {
        role: 'user',
        content: `Extract this data from the resume and return as JSON:
{
  "name": "full name",
  "email": "email address",
  "graduationDate": "YYYY-MM format",
  "degree": "Bachelor's or Master's or PhD",
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

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from Groq');
  }

  return JSON.parse(content);
}
