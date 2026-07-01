// Resume Analyzer - AI-powered Resume Improvement Suggestions
// Analyzes resume sections and provides actionable improvement recommendations

import { ResumeData } from './resumeTypes';

// ============================================================================
// TYPES
// ============================================================================

export type ScoreLabel = 'excellent' | 'good' | 'average' | 'needs_improvement';

export interface SectionScore {
  name: string;
  score: number; // 0-10
  maxScore: number;
  feedback: string;
  suggestions: string[];
}

export interface ImprovementSuggestion {
  section: string;
  currentText: string;
  suggestedText: string;
  reason: string;
}

export interface QuickWin {
  id: string;
  title: string;
  description: string;
  impact: number;
  action: 'improve_summary' | 'add_linkedin' | 'add_github' | 'add_certifications' | 'add_achievements' | 'improve_projects' | 'improve_experience';
}

export interface ResumeAnalysis {
  // Overall Score
  overallScore: number;
  scoreLabel: ScoreLabel;

  // Section Scores
  sections: SectionScore[];

  // Strengths
  strengths: string[];

  // Areas to Improve
  improvements: string[];

  // Missing Information
  missingInfo: {
    item: string;
    importance: 'high' | 'medium' | 'low';
  }[];

  // AI Suggestions
  suggestions: ImprovementSuggestion[];

  // Quick Wins
  quickWins: QuickWin[];

  // Estimated Improvement
  estimatedScoreAfter: number;
  potentialImprovement: number;
}

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

function getScoreLabel(score: number): ScoreLabel {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'average';
  return 'needs_improvement';
}

function getScoreLabelDisplay(label: ScoreLabel): { text: string; color: string } {
  const labels = {
    excellent: { text: 'Excellent', color: 'text-green-400' },
    good: { text: 'Good', color: 'text-blue-400' },
    average: { text: 'Average', color: 'text-yellow-400' },
    needs_improvement: { text: 'Needs Improvement', color: 'text-red-400' },
  };
  return labels[label];
}

function analyzeProfessionalSummary(resumeData: ResumeData): SectionScore {
  const summary = resumeData.summary;
  let score = 0;
  const suggestions: string[] = [];
  let feedback = '';

  // Check length
  if (summary.length === 0) {
    score = 0;
    feedback = 'No professional summary found';
    suggestions.push('Add a professional summary (2-4 sentences) highlighting your key skills and career goals');
  } else if (summary.length < 50) {
    score = 3;
    feedback = 'Summary is too brief';
    suggestions.push('Expand your summary to include your key skills, experience, and career objectives');
  } else if (summary.length < 100) {
    score = 5;
    feedback = 'Summary could be more detailed';
    suggestions.push('Add more specific achievements and skills to your summary');
  } else if (summary.length < 300) {
    score = 8;
    feedback = 'Good summary length';
  } else {
    score = 7;
    feedback = 'Summary might be too long';
    suggestions.push('Consider condensing your summary to 2-4 impactful sentences');
  }

  // Check for action words
  const actionWords = ['developed', 'built', 'created', 'implemented', 'designed', 'led', 'achieved', 'delivered'];
  const hasActionWords = actionWords.some(word => summary.toLowerCase().includes(word));
  if (!hasActionWords && summary.length > 0) {
    score = Math.max(score - 1, 0);
    suggestions.push('Use action verbs like "developed", "built", or "achieved" to make your summary more impactful');
  }

  // Check for quantifiable achievements
  const hasNumbers = /\d+/.test(summary);
  if (!hasNumbers && summary.length > 0) {
    suggestions.push('Add quantifiable achievements (e.g., "improved performance by 40%")');
  }

  return {
    name: 'Professional Summary',
    score,
    maxScore: 10,
    feedback,
    suggestions,
  };
}

function analyzeSkills(resumeData: ResumeData): SectionScore {
  const skills = resumeData.skills;
  let score = 0;
  const suggestions: string[] = [];
  let feedback = '';

  if (skills.length === 0) {
    score = 0;
    feedback = 'No skills listed';
    suggestions.push('Add technical skills relevant to your field');
    suggestions.push('Include both hard skills (programming languages, tools) and soft skills');
  } else if (skills.length < 5) {
    score = 4;
    feedback = 'Limited skills listed';
    suggestions.push('Add more relevant skills to demonstrate your expertise');
  } else if (skills.length < 10) {
    score = 7;
    feedback = 'Good range of skills';
    suggestions.push('Consider organizing skills by category (Technical, Tools, Soft Skills)');
  } else if (skills.length <= 15) {
    score = 9;
    feedback = 'Strong skills section';
  } else {
    score = 8;
    feedback = 'Comprehensive skills list';
    suggestions.push('Consider prioritizing your most relevant skills for the roles you\'re targeting');
  }

  // Check for in-demand skills
  const inDemandSkills = ['javascript', 'typescript', 'python', 'react', 'node', 'aws', 'docker', 'git', 'sql'];
  const hasInDemandSkills = skills.some(skill =>
    inDemandSkills.some(inDemand => skill.toLowerCase().includes(inDemand))
  );

  if (!hasInDemandSkills && skills.length > 0) {
    suggestions.push('Consider adding in-demand skills like JavaScript, Python, React, or cloud technologies');
  }

  return {
    name: 'Skills',
    score,
    maxScore: 10,
    feedback,
    suggestions,
  };
}

function analyzeProjects(resumeData: ResumeData): SectionScore {
  const projects = resumeData.projects;
  let score = 0;
  const suggestions: string[] = [];
  let feedback = '';

  if (projects.length === 0) {
    score = 0;
    feedback = 'No projects listed';
    suggestions.push('Add at least 2-3 projects to showcase your practical experience');
    suggestions.push('Include personal, academic, or professional projects');
  } else if (projects.length === 1) {
    score = 4;
    feedback = 'Only one project listed';
    suggestions.push('Add more projects to demonstrate breadth of experience');
  } else if (projects.length === 2) {
    score = 6;
    feedback = 'Good start with projects';
    suggestions.push('Consider adding a third project to strengthen your portfolio');
  } else {
    score = 8;
    feedback = 'Good number of projects';
  }

  // Check project descriptions
  const hasGoodDescriptions = projects.filter(p => p.description.length > 50).length;
  if (projects.length > 0 && hasGoodDescriptions < projects.length) {
    score = Math.max(score - 1, 0);
    suggestions.push('Add detailed descriptions to your projects including technologies used and outcomes');
  }

  // Check for technologies
  const hasTechnologies = projects.filter(p => p.technologies.length > 0).length;
  if (projects.length > 0 && hasTechnologies < projects.length) {
    suggestions.push('List the technologies used in each project');
  }

  // Check for URLs
  const hasUrls = projects.filter(p => p.url && p.url.length > 0).length;
  if (projects.length > 0 && hasUrls < projects.length) {
    suggestions.push('Add GitHub or live demo URLs to your projects');
  }

  return {
    name: 'Projects',
    score,
    maxScore: 10,
    feedback,
    suggestions,
  };
}

function analyzeExperience(resumeData: ResumeData): SectionScore {
  const experience = resumeData.workExperience;
  let score = 0;
  const suggestions: string[] = [];
  let feedback = '';

  if (experience.length === 0) {
    score = 2;
    feedback = 'No work experience listed';
    suggestions.push('Add internships, part-time jobs, or relevant volunteer experience');
    suggestions.push('Consider adding academic projects or freelance work');
  } else if (experience.length === 1) {
    score = 5;
    feedback = 'Limited experience listed';
    suggestions.push('Add more relevant experience if available');
  } else if (experience.length <= 3) {
    score = 7;
    feedback = 'Good experience section';
  } else {
    score = 8;
    feedback = 'Strong experience history';
  }

  // Check experience descriptions
  const hasGoodDescriptions = experience.filter(e => e.description.length > 30).length;
  if (experience.length > 0 && hasGoodDescriptions < experience.length) {
    score = Math.max(score - 1, 0);
    suggestions.push('Add detailed descriptions of your responsibilities and achievements');
  }

  // Check for achievements/highlights
  const hasHighlights = experience.filter(e => e.highlights && e.highlights.length > 0).length;
  if (experience.length > 0 && hasHighlights < experience.length) {
    suggestions.push('Add bullet points highlighting key achievements for each role');
  }

  // Check for quantifiable results
  const hasQuantifiableResults = experience.some(e =>
    /\d+%|\d+\s*(users|customers|projects|team)/i.test(e.description) ||
    (e.highlights && e.highlights.some(h => /\d+%|\d+\s*(users|customers|projects)/i.test(h)))
  );
  if (experience.length > 0 && !hasQuantifiableResults) {
    suggestions.push('Add quantifiable achievements (e.g., "increased sales by 25%", "led team of 5")');
  }

  return {
    name: 'Experience',
    score,
    maxScore: 10,
    feedback,
    suggestions,
  };
}

function analyzeEducation(resumeData: ResumeData): SectionScore {
  const education = resumeData.education;
  let score = 0;
  const suggestions: string[] = [];
  let feedback = '';

  if (education.length === 0) {
    score = 0;
    feedback = 'No education listed';
    suggestions.push('Add your educational background including degree, institution, and graduation date');
  } else if (education.length === 1) {
    score = 7;
    feedback = 'Education section present';
    suggestions.push('Consider adding relevant coursework, honors, or GPA if strong');
  } else {
    score = 8;
    feedback = 'Good education section';
  }

  // Check for complete education info
  const hasCompleteInfo = education.filter(e =>
    e.degree && e.institution && e.field
  ).length;
  if (education.length > 0 && hasCompleteInfo < education.length) {
    score = Math.max(score - 1, 0);
    suggestions.push('Ensure all education entries have degree, field of study, and institution');
  }

  // Check for GPA
  const hasGPA = education.some(e => e.gpa);
  if (education.length > 0 && !hasGPA) {
    suggestions.push('Add GPA if it\'s 3.5 or higher');
  }

  return {
    name: 'Education',
    score,
    maxScore: 10,
    feedback,
    suggestions,
  };
}

function analyzeGrammarAndWriting(resumeData: ResumeData): SectionScore {
  let score = 7; // Default to good score
  const suggestions: string[] = [];
  let feedback = 'Good grammar and writing style';

  // Check for common issues
  const allText = [
    resumeData.summary,
    ...resumeData.workExperience.map(e => e.description),
    ...resumeData.projects.map(p => p.description),
  ].join(' ');

  // Check for consistent capitalization
  const hasInconsistentCaps = /[A-Z]{2,}/.test(allText) && !/\b[A-Z]{2,}\b/.test(allText);
  if (hasInconsistentCaps) {
    score = Math.max(score - 1, 0);
    suggestions.push('Ensure consistent capitalization throughout');
  }

  // Check for proper sentence structure
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.trim().split(' ').length, 0) / Math.max(sentences.length, 1);

  if (avgSentenceLength > 25) {
    score = Math.max(score - 1, 0);
    suggestions.push('Consider using shorter, more concise sentences');
  }

  // Check for passive voice indicators
  const passiveIndicators = ['was developed', 'was created', 'was implemented', 'were built', 'were made'];
  const hasPassiveVoice = passiveIndicators.some(indicator => allText.toLowerCase().includes(indicator));
  if (hasPassiveVoice) {
    suggestions.push('Use active voice instead of passive voice for stronger impact');
  }

  // Check for first person pronouns
  const hasFirstPerson = /\b(I|I'm|I've|my|me)\b/i.test(allText);
  if (hasFirstPerson) {
    score = Math.max(score - 1, 0);
    suggestions.push('Avoid first-person pronouns (I, my, me) in resume descriptions');
  }

  return {
    name: 'Grammar & Writing',
    score,
    maxScore: 10,
    feedback,
    suggestions,
  };
}

function analyzeATSCompatibility(resumeData: ResumeData): SectionScore {
  let score = 5;
  const suggestions: string[] = [];
  let feedback = 'Some ATS compatibility issues detected';

  // ATS-friendly sections
  const hasSkills = resumeData.skills.length > 0;
  const hasExperience = resumeData.workExperience.length > 0;
  const hasEducation = resumeData.education.length > 0;

  if (hasSkills && hasExperience && hasEducation) {
    score += 2;
    feedback = 'Good standard sections for ATS';
  } else {
    suggestions.push('Include standard sections: Skills, Experience, and Education for ATS compatibility');
  }

  // Check for contact information
  const hasEmail = resumeData.email.length > 0;
  const hasPhone = resumeData.phone.length > 0;
  const hasLocation = resumeData.location.length > 0;

  if (hasEmail && hasPhone && hasLocation) {
    score += 1;
  } else {
    if (!hasEmail) suggestions.push('Add email address for ATS and recruiters');
    if (!hasPhone) suggestions.push('Add phone number for easy contact');
    if (!hasLocation) suggestions.push('Add location/city for local job matching');
  }

  // Check for LinkedIn
  const hasLinkedIn = resumeData.linkedinUrl.length > 0;
  if (!hasLinkedIn) {
    suggestions.push('Add LinkedIn profile URL - many ATS systems look for this');
  } else {
    score += 1;
  }

  // Check for keywords
  const allText = [
    resumeData.summary,
    resumeData.professionalTitle,
    ...resumeData.skills,
    ...resumeData.workExperience.map(e => `${e.title} ${e.description}`),
  ].join(' ').toLowerCase();

  const commonKeywords = ['project', 'team', 'develop', 'design', 'implement', 'manage', 'analyze', 'create'];
  const keywordCount = commonKeywords.filter(keyword => allText.includes(keyword)).length;

  if (keywordCount >= 5) {
    score += 1;
  } else {
    suggestions.push('Include more industry keywords that match job descriptions');
  }

  return {
    name: 'ATS Compatibility',
    score: Math.min(score, 10),
    maxScore: 10,
    feedback,
    suggestions,
  };
}

// ============================================================================
// GENERATE AI SUGGESTIONS
// ============================================================================

function generateSummarySuggestion(resumeData: ResumeData): ImprovementSuggestion | null {
  const summary = resumeData.summary;

  if (summary.length === 0 || summary.length < 100) {
    const title = resumeData.professionalTitle || 'professional';
    const name = resumeData.fullName.split(' ')[0] || 'I';
    const topSkill = resumeData.skills[0] || 'technology';
    const secondSkill = resumeData.skills[1] || 'development';

    return {
      section: 'Professional Summary',
      currentText: summary || '(No summary provided)',
      suggestedText: `${name} is a motivated ${title} with expertise in ${topSkill} and ${secondSkill}. Passionate about delivering high-quality solutions and continuously learning new technologies. Seeking opportunities to contribute to innovative projects while growing professionally in a collaborative environment.`,
      reason: 'A professional summary should highlight your key skills, experience, and career objectives in 2-4 sentences.',
    };
  }

  return null;
}

function generateProjectSuggestions(resumeData: ResumeData): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  resumeData.projects.forEach((project, index) => {
    if (project.description.length < 50) {
      const techList = project.technologies.length > 0
        ? project.technologies.slice(0, 3).join(', ')
        : 'modern technologies';

      const improvedDescription = `Developed a ${project.name.toLowerCase()} using ${techList}. Implemented key features including user authentication, data management, and responsive design. The project demonstrates proficiency in software development best practices and delivers measurable improvements in user experience and performance.`;

      suggestions.push({
        section: `Project #${index + 1}: ${project.name}`,
        currentText: project.description || '(No description provided)',
        suggestedText: improvedDescription,
        reason: 'Project descriptions should include technologies used, your role, and measurable outcomes.',
      });
    }
  });

  return suggestions;
}

function generateExperienceSuggestions(resumeData: ResumeData): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  resumeData.workExperience.forEach((exp, index) => {
    if (exp.description.length < 30) {
      const title = exp.title;

      const improvedDescription = `Served as ${title} at ${exp.company}, contributing to key projects and initiatives. Collaborated with cross-functional teams to deliver high-impact solutions. Applied technical skills and problem-solving abilities to address complex business challenges and drive measurable results.`;

      suggestions.push({
        section: `Experience #${index + 1}: ${exp.title} at ${exp.company}`,
        currentText: exp.description || '(No description provided)',
        suggestedText: improvedDescription,
        reason: 'Experience descriptions should highlight responsibilities, skills used, and achievements with quantifiable results when possible.',
      });
    }
  });

  return suggestions;
}

// ============================================================================
// IDENTIFY STRENGTHS AND WEAKNESSES
// ============================================================================

function identifyStrengths(resumeData: ResumeData): string[] {
  const strengths: string[] = [];

  if (resumeData.skills.length >= 5) {
    strengths.push('Strong technical skills section');
  }

  if (resumeData.projects.length >= 2) {
    strengths.push('Good project experience');
  }

  if (resumeData.summary.length >= 100) {
    strengths.push('Well-written professional summary');
  }

  if (resumeData.education.length > 0) {
    strengths.push('Relevant education background');
  }

  if (resumeData.workExperience.length >= 2) {
    strengths.push('Solid work experience');
  }

  if (resumeData.githubUrl) {
    strengths.push('GitHub profile included');
  }

  if (resumeData.linkedinUrl) {
    strengths.push('LinkedIn profile included');
  }

  if (resumeData.certifications.length > 0) {
    strengths.push('Professional certifications');
  }

  if (resumeData.achievements.length > 0) {
    strengths.push('Notable achievements listed');
  }

  if (strengths.length === 0) {
    strengths.push('Resume provides basic information');
  }

  return strengths;
}

function identifyImprovements(resumeData: ResumeData): string[] {
  const improvements: string[] = [];

  if (!resumeData.linkedinUrl) {
    improvements.push('Add LinkedIn profile URL for professional networking');
  }

  if (!resumeData.githubUrl && resumeData.skills.some(s =>
    ['javascript', 'python', 'react', 'node', 'git', 'typescript'].some(tech =>
      s.toLowerCase().includes(tech)
    )
  )) {
    improvements.push('Add GitHub profile to showcase your code');
  }

  if (resumeData.summary.length < 100) {
    improvements.push('Expand your professional summary with key achievements');
  }

  if (resumeData.projects.length < 2) {
    improvements.push('Add more projects to demonstrate practical experience');
  }

  if (resumeData.certifications.length === 0) {
    improvements.push('Consider adding relevant certifications');
  }

  if (!resumeData.achievements || resumeData.achievements.length === 0) {
    improvements.push('Add achievements section to highlight accomplishments');
  }

  const hasQuantifiable = resumeData.workExperience.some(e =>
    /\d+%|\d+\s*(users|customers|projects|team)/i.test(e.description)
  );
  if (!hasQuantifiable && resumeData.workExperience.length > 0) {
    improvements.push('Include measurable achievements with numbers');
  }

  return improvements;
}

function identifyMissingInfo(resumeData: ResumeData): { item: string; importance: 'high' | 'medium' | 'low' }[] {
  const missing: { item: string; importance: 'high' | 'medium' | 'low' }[] = [];

  if (!resumeData.linkedinUrl) {
    missing.push({ item: 'LinkedIn URL', importance: 'high' });
  }

  if (!resumeData.githubUrl) {
    missing.push({ item: 'GitHub URL', importance: 'high' });
  }

  if (resumeData.summary.length === 0) {
    missing.push({ item: 'Professional Summary', importance: 'high' });
  }

  if (resumeData.certifications.length === 0) {
    missing.push({ item: 'Certifications', importance: 'medium' });
  }

  if (!resumeData.achievements || resumeData.achievements.length === 0) {
    missing.push({ item: 'Achievements', importance: 'medium' });
  }

  if (resumeData.projects.length === 0) {
    missing.push({ item: 'Projects', importance: 'high' });
  }

  if (!resumeData.portfolioUrl) {
    missing.push({ item: 'Portfolio Website', importance: 'low' });
  }

  return missing;
}

function generateQuickWins(resumeData: ResumeData): QuickWin[] {
  const quickWins: QuickWin[] = [];

  if (resumeData.summary.length < 100) {
    quickWins.push({
      id: 'improve-summary',
      title: 'Improve Professional Summary',
      description: 'Get AI suggestions for a more impactful summary',
      impact: 10,
      action: 'improve_summary',
    });
  }

  if (!resumeData.linkedinUrl) {
    quickWins.push({
      id: 'add-linkedin',
      title: 'Add LinkedIn Profile',
      description: 'Include your LinkedIn URL for better visibility',
      impact: 8,
      action: 'add_linkedin',
    });
  }

  if (!resumeData.githubUrl) {
    quickWins.push({
      id: 'add-github',
      title: 'Add GitHub Profile',
      description: 'Showcase your code and contributions',
      impact: 8,
      action: 'add_github',
    });
  }

  if (resumeData.certifications.length === 0) {
    quickWins.push({
      id: 'add-certs',
      title: 'Add Certifications',
      description: 'Add relevant certifications to boost credibility',
      impact: 6,
      action: 'add_certifications',
    });
  }

  if (!resumeData.achievements || resumeData.achievements.length === 0) {
    quickWins.push({
      id: 'add-achievements',
      title: 'Add Achievements',
      description: 'Highlight your accomplishments and awards',
      impact: 5,
      action: 'add_achievements',
    });
  }

  if (resumeData.projects.some(p => p.description.length < 50)) {
    quickWins.push({
      id: 'improve-projects',
      title: 'Improve Project Descriptions',
      description: 'Get AI suggestions for better project write-ups',
      impact: 7,
      action: 'improve_projects',
    });
  }

  return quickWins.slice(0, 5);
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function analyzeResume(resumeData: ResumeData): ResumeAnalysis {
  // Analyze each section
  const summaryScore = analyzeProfessionalSummary(resumeData);
  const skillsScore = analyzeSkills(resumeData);
  const projectsScore = analyzeProjects(resumeData);
  const experienceScore = analyzeExperience(resumeData);
  const educationScore = analyzeEducation(resumeData);
  const grammarScore = analyzeGrammarAndWriting(resumeData);
  const atsScore = analyzeATSCompatibility(resumeData);

  const sections = [
    summaryScore,
    skillsScore,
    projectsScore,
    experienceScore,
    educationScore,
    grammarScore,
    atsScore,
  ];

  // Calculate overall score (weighted average)
  const weights = [0.15, 0.15, 0.15, 0.15, 0.1, 0.1, 0.2]; // ATS is weighted higher
  const weightedScore = sections.reduce((sum, section, i) =>
    sum + (section.score * weights[i] * 10), 0
  );
  const overallScore = Math.round(weightedScore);
  const scoreLabel = getScoreLabel(overallScore);

  // Generate suggestions
  const suggestions: ImprovementSuggestion[] = [];

  const summarySuggestion = generateSummarySuggestion(resumeData);
  if (summarySuggestion) suggestions.push(summarySuggestion);

  suggestions.push(...generateProjectSuggestions(resumeData));
  suggestions.push(...generateExperienceSuggestions(resumeData));

  // Identify strengths and weaknesses
  const strengths = identifyStrengths(resumeData);
  const improvements = identifyImprovements(resumeData);
  const missingInfo = identifyMissingInfo(resumeData);

  // Generate quick wins
  const quickWins = generateQuickWins(resumeData);

  // Estimate potential improvement
  const potentialImprovement = quickWins.reduce((sum, win) => sum + win.impact, 0);
  const estimatedScoreAfter = Math.min(100, overallScore + potentialImprovement);

  return {
    overallScore,
    scoreLabel,
    sections,
    strengths,
    improvements,
    missingInfo,
    suggestions,
    quickWins,
    estimatedScoreAfter,
    potentialImprovement,
  };
}

export function getScoreLabelInfo(label: ScoreLabel): { text: string; color: string } {
  return getScoreLabelDisplay(label);
}
