/**
 * Skills Analysis Service
 * Compares resume data against job listings using Groq LLM for intelligent matching
 */

import Groq from 'groq-sdk';
import type { ParsedResume } from './resume-parser';
import type { SkillsAnalysis, JobListing } from '@/types/analysis';

// Initialize Groq client with API key validation
console.log('[SkillsAnalyzer] Initializing Groq SDK...');
if (!process.env.GROQ_API_KEY) {
  console.error(
    '[SkillsAnalyzer] CRITICAL: GROQ_API_KEY is not set in environment variables'
  );
  throw new Error('GROQ_API_KEY environment variable is required');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('[SkillsAnalyzer] ✓ Groq SDK initialized successfully');

/**
 * Validates that the resume data has required fields
 */
function validateResumeData(resume: ParsedResume): void {
  if (!resume) {
    throw new Error('Resume data is required');
  }

  if (!resume.skills || !Array.isArray(resume.skills)) {
    throw new Error('Resume must contain a skills array');
  }

  if (!resume.experience || !Array.isArray(resume.experience)) {
    throw new Error('Resume must contain an experience array');
  }

  if (!resume.projects || !Array.isArray(resume.projects)) {
    throw new Error('Resume must contain a projects array');
  }
}

/**
 * Validates that the job listing has required fields
 */
function validateJobData(job: JobListing): void {
  if (!job) {
    throw new Error('Job listing data is required');
  }

  if (!job.company || !job.title) {
    throw new Error('Job listing must have company and title');
  }

  // Description or requirements should be present for meaningful analysis
  if (
    !job.description &&
    !job.requirements &&
    (!job.requiredSkills || job.requiredSkills.length === 0)
  ) {
    throw new Error(
      'Job listing must have description, requirements, or required skills'
    );
  }
}

/**
 * Validates the structure of the AI response
 */
function validateAnalysisResponse(data: unknown): data is SkillsAnalysis {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const analysis = data as Record<string, unknown>;

  // Check required arrays exist
  if (!Array.isArray(analysis.alignedSkills)) return false;
  if (!Array.isArray(analysis.missingSkills)) return false;
  if (!Array.isArray(analysis.strengthsToHighlight)) return false;
  if (!Array.isArray(analysis.improvementSuggestions)) return false;
  if (typeof analysis.overallFit !== 'string') return false;

  return true;
}

/**
 * Normalizes and validates the analysis data from Groq
 */
function normalizeAnalysisData(rawData: unknown): SkillsAnalysis {
  console.log('[SkillsAnalyzer] Normalizing analysis data...');

  if (!validateAnalysisResponse(rawData)) {
    console.error(
      '[SkillsAnalyzer] Invalid analysis structure received:',
      rawData
    );
    throw new Error('Invalid analysis structure from Groq API');
  }

  const data = rawData as SkillsAnalysis;

  // Ensure arrays are not null/undefined and have reasonable limits
  const normalized: SkillsAnalysis = {
    alignedSkills: (data.alignedSkills || []).slice(0, 20), // Limit to top 20
    missingSkills: (data.missingSkills || []).slice(0, 15), // Limit to top 15
    strengthsToHighlight: (data.strengthsToHighlight || []).slice(0, 5), // Top 5 strengths
    improvementSuggestions: (data.improvementSuggestions || []).slice(0, 10), // Top 10 suggestions
    overallFit:
      data.overallFit || 'Unable to determine fit based on available data.',
  };

  console.log('[SkillsAnalyzer] ✓ Data normalized successfully');
  console.log('[SkillsAnalyzer] Stats:', {
    alignedSkills: normalized.alignedSkills.length,
    missingSkills: normalized.missingSkills.length,
    strengths: normalized.strengthsToHighlight.length,
    suggestions: normalized.improvementSuggestions.length,
  });

  return normalized;
}

/**
 * Builds the prompt for Groq to analyze skills
 */
function buildAnalysisPrompt(resume: ParsedResume, job: JobListing): string {
  // Prepare resume summary
  const resumeSummary = {
    name: resume.name,
    degree: resume.degree,
    graduationDate: resume.graduationDate,
    gpa: resume.gpa,
    skills: resume.skills,
    experience: resume.experience.map((exp) => ({
      company: exp.company,
      role: exp.role,
      duration: exp.duration,
    })),
    projects: resume.projects.map((proj) => ({
      name: proj.name,
      description: proj.description,
      technologies: proj.tech,
    })),
  };

  // Prepare job summary
  const jobSummary = {
    company: job.company,
    title: job.title,
    location: job.location,
    description: job.description || 'Not provided',
    requirements: job.requirements || 'Not provided',
    requiredSkills: job.requiredSkills || [],
  };

  const prompt = `You are an expert career advisor analyzing how well a candidate's resume matches a specific internship position.

**RESUME DATA:**
${JSON.stringify(resumeSummary, null, 2)}

**JOB LISTING:**
${JSON.stringify(jobSummary, null, 2)}

**YOUR TASK:**
Analyze this resume against the job listing and provide a comprehensive skills analysis. Be specific, actionable, and context-aware.

**ANALYSIS REQUIREMENTS:**

1. **Aligned Skills**: Identify skills from the resume that match job requirements. Use semantic matching (e.g., "React" matches "React.js", "Python" implies "scripting"). For each aligned skill:
   - Specify the exact skill name
   - Indicate where it appears (resume skills list, experience, projects, or education)
   - Rate relevance as high/medium/low
   - Provide specific evidence (e.g., "Used in Weather Dashboard project")

2. **Missing Skills**: List skills required by the job but not demonstrated on the resume. For each missing skill:
   - Classify priority: required (must-have), preferred (strongly desired), or nice-to-have
   - Categorize as: technical, soft, or domain knowledge

3. **Strengths to Highlight**: Identify 3-5 top strengths from the resume that are most relevant to THIS specific role:
   - Give each strength a clear title
   - Describe what makes it a strength
   - Explain WHY it matters for this particular role

4. **Improvement Suggestions**: Provide 3-7 specific, actionable recommendations. Each suggestion should:
   - Be concrete and implementable (e.g., "Build a React project using TypeScript" NOT "Learn more frameworks")
   - Explain the rationale (why this would strengthen the application)
   - Prioritize as high/medium/low
   - Categorize as: skills, projects, experience, or education

5. **Overall Fit**: Write a 2-3 sentence narrative summary of the candidate-role fit, highlighting their strongest alignment and biggest gap.

**IMPORTANT GUIDELINES:**
- Consider this is an internship role - value projects, coursework, and potential over extensive experience
- Understand skill synonyms and hierarchies (e.g., knowing React implies knowing JavaScript)
- Be encouraging but honest about gaps
- Make suggestions specific to the candidate's current level and background
- Focus on what would have the MOST impact for this specific application

**OUTPUT FORMAT:**
Respond with ONLY valid JSON matching this exact structure (no additional text):

{
  "alignedSkills": [
    {
      "skill": "string",
      "matchedFrom": "resume" | "experience" | "projects" | "education",
      "relevance": "high" | "medium" | "low",
      "evidence": "string (optional)"
    }
  ],
  "missingSkills": [
    {
      "skill": "string",
      "priority": "required" | "preferred" | "nice-to-have",
      "category": "technical" | "soft" | "domain"
    }
  ],
  "strengthsToHighlight": [
    {
      "title": "string",
      "description": "string",
      "impact": "string"
    }
  ],
  "improvementSuggestions": [
    {
      "category": "skills" | "projects" | "experience" | "education",
      "priority": "high" | "medium" | "low",
      "suggestion": "string",
      "rationale": "string"
    }
  ],
  "overallFit": "string (2-3 sentences)"
}`;

  return prompt;
}

/**
 * Main function to analyze skills using Groq LLM
 *
 * @param resume - Parsed resume data from the resume parser
 * @param job - Job listing data to compare against
 * @returns Structured skills analysis with aligned/missing skills, strengths, and suggestions
 *
 * @throws {Error} If validation fails, Groq API call fails, or response is invalid
 *
 * @example
 * ```typescript
 * const analysis = await analyzeSkills(parsedResume, jobListing);
 * console.log(analysis.alignedSkills); // Skills that match
 * console.log(analysis.improvementSuggestions); // What to improve
 * ```
 */
export async function analyzeSkills(
  resume: ParsedResume,
  job: JobListing
): Promise<SkillsAnalysis> {
  console.log(
    '[SkillsAnalyzer] ========== STARTING SKILLS ANALYSIS =========='
  );
  console.log('[SkillsAnalyzer] Candidate:', resume.name);
  console.log(
    '[SkillsAnalyzer] Target role:',
    `${job.title} at ${job.company}`
  );

  try {
    // Step 1: Validate inputs
    console.log('[SkillsAnalyzer] Step 1: Validating input data...');
    validateResumeData(resume);
    validateJobData(job);
    console.log('[SkillsAnalyzer] ✓ Input validation passed');

    // Step 2: Build prompt
    console.log('[SkillsAnalyzer] Step 2: Building analysis prompt...');
    const prompt = buildAnalysisPrompt(resume, job);
    const promptLength = prompt.length;
    console.log('[SkillsAnalyzer] ✓ Prompt built:', {
      length: promptLength,
      estimatedTokens: Math.ceil(promptLength / 4), // Rough estimate
    });

    // Step 3: Call Groq API
    console.log('[SkillsAnalyzer] Step 3: Calling Groq API...');
    const apiCallStartTime = Date.now();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert career advisor specializing in resume analysis and job matching. Provide detailed, actionable insights in valid JSON format only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2, // Slightly higher than parsing for more creative suggestions
    });

    const apiCallDuration = Date.now() - apiCallStartTime;
    console.log('[SkillsAnalyzer] ✓ Groq API call completed:', {
      duration: `${apiCallDuration}ms`,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0]?.finish_reason,
    });

    // Step 4: Extract and parse response
    console.log('[SkillsAnalyzer] Step 4: Parsing response...');
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No content in Groq API response');
    }

    console.log('[SkillsAnalyzer] Response length:', responseContent.length);

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('[SkillsAnalyzer] JSON parse error:', parseError);
      console.error(
        '[SkillsAnalyzer] Response content:',
        responseContent.slice(0, 500)
      );
      throw new Error('Failed to parse Groq response as JSON');
    }

    // Step 5: Validate and normalize
    console.log('[SkillsAnalyzer] Step 5: Validating response structure...');
    const analysis = normalizeAnalysisData(parsedData);

    console.log('[SkillsAnalyzer] ========== ANALYSIS COMPLETE ==========');
    console.log('[SkillsAnalyzer] Summary:', {
      alignedSkills: analysis.alignedSkills.length,
      missingSkills: analysis.missingSkills.length,
      strengths: analysis.strengthsToHighlight.length,
      suggestions: analysis.improvementSuggestions.length,
      fitSummaryLength: analysis.overallFit.length,
    });

    return analysis;
  } catch (error) {
    console.error('[SkillsAnalyzer] ========== ANALYSIS FAILED ==========');
    console.error('[SkillsAnalyzer] Error details:', error);

    if (error instanceof Error) {
      console.error('[SkillsAnalyzer] Error name:', error.name);
      console.error('[SkillsAnalyzer] Error message:', error.message);
      console.error('[SkillsAnalyzer] Error stack:', error.stack);
    }

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Skills analysis failed: ${error.message}`);
    }

    throw new Error('Skills analysis failed: Unknown error');
  }
}
