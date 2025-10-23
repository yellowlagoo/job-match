/**
 * Type definitions for skills analysis functionality
 * Used for comparing resume data against job listings
 */

/**
 * Represents a skill from the resume that aligns with job requirements
 */
export interface AlignedSkill {
  /** The skill name (e.g., "React", "Python", "Data Analysis") */
  skill: string;
  /** Where this skill was found on the resume */
  matchedFrom: 'resume' | 'experience' | 'projects' | 'education';
  /** How relevant this skill is to the job requirements */
  relevance: 'high' | 'medium' | 'low';
  /** Specific evidence from the resume (e.g., project name, company name) */
  evidence?: string;
}

/**
 * Represents a skill required by the job but missing from the resume
 */
export interface MissingSkill {
  /** The skill name that's missing */
  skill: string;
  /** How critical this skill is for the role */
  priority: 'required' | 'preferred' | 'nice-to-have';
  /** Category of the skill */
  category: 'technical' | 'soft' | 'domain';
}

/**
 * Represents a strength from the resume that should be highlighted
 */
export interface Strength {
  /** Brief title of the strength (e.g., "Full-Stack Development Experience") */
  title: string;
  /** Detailed description of what makes this a strength */
  description: string;
  /** Why this strength matters for the specific role */
  impact: string;
}

/**
 * Represents an actionable suggestion for improving the application
 */
export interface Suggestion {
  /** Category of the suggestion */
  category: 'skills' | 'projects' | 'experience' | 'education';
  /** How important this suggestion is */
  priority: 'high' | 'medium' | 'low';
  /** The specific, actionable recommendation */
  suggestion: string;
  /** Explanation of why this would strengthen the application */
  rationale: string;
}

/**
 * Complete skills analysis output comparing resume to job requirements
 */
export interface SkillsAnalysis {
  /** Skills that match between resume and job requirements */
  alignedSkills: AlignedSkill[];
  /** Skills required by the job but not found on resume */
  missingSkills: MissingSkill[];
  /** Top strengths to emphasize in the application */
  strengthsToHighlight: Strength[];
  /** Specific recommendations for improving the application */
  improvementSuggestions: Suggestion[];
  /** Brief narrative summary of overall candidate-role fit */
  overallFit: string;
}

/**
 * Input structure for job listing data
 */
export interface JobListing {
  /** Company name */
  company: string;
  /** Job title */
  title: string;
  /** Job location(s) */
  location: string;
  /** Full job description */
  description?: string;
  /** Job requirements/qualifications */
  requirements?: string;
  /** List of required skills */
  requiredSkills?: string[];
}
