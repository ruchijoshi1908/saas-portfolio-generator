// Job Readiness Score Calculator for CareerLaunch AI
// Evaluates career readiness based on portfolio and resume data

import { ResumeData } from './resumeTypes';

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  passed: boolean;
  details: string[];
}

export interface JobReadinessResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: 'excellent' | 'good' | 'fair' | 'needs-work';
  status: 'ready' | 'almost-ready' | 'preparing' | 'just-started';
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  categories: ScoreCategory[];
}

const GRADE_THRESHOLDS = {
  excellent: 85,
  good: 70,
  fair: 50,
  'needs-work': 0,
};

const STATUS_THRESHOLDS = {
  ready: 80,
  'almost-ready': 60,
  preparing: 40,
  'just-started': 0,
};

/**
 * Calculate job readiness score from resume data
 */
export function calculateJobReadinessScore(resumeData: ResumeData): JobReadinessResult {
  const categories: ScoreCategory[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  // ========================================================================
  // 1. PROJECTS EVALUATION (Max 25 points)
  // ========================================================================
  const projectScore = evaluateProjects(resumeData.projects.length);
  categories.push(projectScore.category);
  strengths.push(...projectScore.strengths);
  improvements.push(...projectScore.improvements);
  recommendations.push(...projectScore.recommendations);

  // ========================================================================
  // 2. SKILLS EVALUATION (Max 20 points)
  // ========================================================================
  const skillsScore = evaluateSkills(resumeData.skills.length);
  categories.push(skillsScore.category);
  strengths.push(...skillsScore.strengths);
  improvements.push(...skillsScore.improvements);
  recommendations.push(...skillsScore.recommendations);

  // ========================================================================
  // 3. EXPERIENCE EVALUATION (Max 20 points)
  // ========================================================================
  const experienceScore = evaluateExperience(resumeData.workExperience);
  categories.push(experienceScore.category);
  strengths.push(...experienceScore.strengths);
  improvements.push(...experienceScore.improvements);
  recommendations.push(...experienceScore.recommendations);

  // ========================================================================
  // 4. EDUCATION EVALUATION (Max 10 points)
  // ========================================================================
  const educationScore = evaluateEducation(resumeData.education.length);
  categories.push(educationScore.category);
  strengths.push(...educationScore.strengths);
  improvements.push(...educationScore.improvements);
  recommendations.push(...educationScore.recommendations);

  // ========================================================================
  // 5. ONLINE PRESENCE EVALUATION (Max 15 points)
  // ========================================================================
  const presenceScore = evaluateOnlinePresence(resumeData);
  categories.push(presenceScore.category);
  strengths.push(...presenceScore.strengths);
  improvements.push(...presenceScore.improvements);
  recommendations.push(...presenceScore.recommendations);

  // ========================================================================
  // 6. CERTIFICATIONS EVALUATION (Max 10 points)
  // ========================================================================
  const certScore = evaluateCertifications(resumeData.certifications.length);
  categories.push(certScore.category);
  strengths.push(...certScore.strengths);
  improvements.push(...certScore.improvements);
  recommendations.push(...certScore.recommendations);

  // ========================================================================
  // CALCULATE TOTAL
  // ========================================================================
  const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
  const maxScore = categories.reduce((sum, cat) => sum + cat.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Determine grade
  let grade: 'excellent' | 'good' | 'fair' | 'needs-work';
  if (percentage >= GRADE_THRESHOLDS.excellent) grade = 'excellent';
  else if (percentage >= GRADE_THRESHOLDS.good) grade = 'good';
  else if (percentage >= GRADE_THRESHOLDS.fair) grade = 'fair';
  else grade = 'needs-work';

  // Determine status
  let status: 'ready' | 'almost-ready' | 'preparing' | 'just-started';
  if (percentage >= STATUS_THRESHOLDS.ready) status = 'ready';
  else if (percentage >= STATUS_THRESHOLDS['almost-ready']) status = 'almost-ready';
  else if (percentage >= STATUS_THRESHOLDS.preparing) status = 'preparing';
  else status = 'just-started';

  return {
    totalScore,
    maxScore,
    percentage,
    grade,
    status,
    strengths,
    improvements,
    recommendations,
    categories,
  };
}

// ============================================================================
// EVALUATION HELPERS
// ============================================================================

function evaluateProjects(count: number) {
  const category: ScoreCategory = {
    name: 'Projects',
    score: 0,
    maxScore: 25,
    weight: 25,
    passed: false,
    details: [],
  };
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  if (count >= 5) {
    category.score = 25;
    category.passed = true;
    strengths.push(`Impressive project portfolio with ${count} projects`);
    category.details.push(`${count} projects - Excellent`);
  } else if (count >= 3) {
    category.score = 20;
    category.passed = true;
    strengths.push(`Good number of projects (${count} total)`);
    category.details.push(`${count} projects - Good`);
    recommendations.push('Add 2 more projects to maximize your score');
  } else if (count >= 1) {
    category.score = 10;
    improvements.push('Only a few projects listed');
    category.details.push(`${count} project(s) - Needs more`);
    recommendations.push('Build 2-3 more projects showcasing different skills');
    recommendations.push('Consider adding a full-stack application project');
  } else {
    improvements.push('No projects listed');
    category.details.push('No projects - Critical');
    recommendations.push('Start building portfolio projects immediately');
    recommendations.push('Create a personal website, a web app, and a mobile-friendly project');
  }

  return { category, strengths, improvements, recommendations };
}

function evaluateSkills(count: number) {
  const category: ScoreCategory = {
    name: 'Skills',
    score: 0,
    maxScore: 20,
    weight: 20,
    passed: false,
    details: [],
  };
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  if (count >= 15) {
    category.score = 20;
    category.passed = true;
    strengths.push(`Comprehensive skills section with ${count} skills`);
    category.details.push(`${count} skills - Excellent`);
  } else if (count >= 10) {
    category.score = 16;
    category.passed = true;
    strengths.push(`Good variety of skills (${count} listed)`);
    category.details.push(`${count} skills - Good`);
    recommendations.push('Consider adding more specialized or emerging technologies');
  } else if (count >= 5) {
    category.score = 10;
    improvements.push('Limited skills listed');
    category.details.push(`${count} skills - Moderate`);
    recommendations.push('Add more relevant technical skills');
    recommendations.push('Include both frontend and backend technologies');
  } else {
    category.score = count * 2;
    improvements.push('Skills section needs significant improvement');
    category.details.push(`${count} skill(s) - Needs more`);
    recommendations.push('Build a comprehensive skills list with technologies you know');
    recommendations.push('Include programming languages, frameworks, tools, and soft skills');
  }

  return { category, strengths, improvements, recommendations };
}

function evaluateExperience(experience: ResumeData['workExperience']) {
  const category: ScoreCategory = {
    name: 'Experience',
    score: 0,
    maxScore: 20,
    weight: 20,
    passed: false,
    details: [],
  };
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  const count = experience.length;
  const hasCurrent = experience.some(e => e.endDate.toLowerCase().includes('present') || e.endDate.toLowerCase().includes('current'));
  const totalHighlights = experience.reduce((sum, e) => sum + e.highlights.length, 0);

  if (count >= 3 && hasCurrent && totalHighlights >= 6) {
    category.score = 20;
    category.passed = true;
    strengths.push('Strong work history with detailed descriptions');
    category.details.push(`${count} positions, currently employed - Excellent`);
  } else if (count >= 2 && totalHighlights >= 4) {
    category.score = 15;
    category.passed = true;
    strengths.push(`${count} positions with good detail`);
    category.details.push(`${count} positions - Good`);
    if (!hasCurrent) {
      improvements.push('No current position listed');
      recommendations.push('Add your current role or note your job-seeking status');
    }
  } else if (count >= 1) {
    category.score = 8;
    improvements.push('Limited work experience listed');
    category.details.push(`${count} position(s) - Needs more`);
    recommendations.push('Add more detail to your experience descriptions');
    recommendations.push('Include quantifiable achievements and metrics');
    if (totalHighlights < 3) {
      recommendations.push('Add bullet points highlighting your accomplishments');
    }
  } else {
    improvements.push('No work experience listed');
    category.details.push('No experience - Critical');
    recommendations.push('Add any internship, freelance, or volunteer experience');
    recommendations.push('Include academic projects as experience if entry-level');
  }

  return { category, strengths, improvements, recommendations };
}

function evaluateEducation(count: number) {
  const category: ScoreCategory = {
    name: 'Education',
    score: 0,
    maxScore: 10,
    weight: 10,
    passed: false,
    details: [],
  };
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  if (count >= 1) {
    category.score = 10;
    category.passed = true;
    strengths.push(`${count} education entr${count > 1 ? 'ies' : 'y'} listed`);
    category.details.push('Education completed - Great');
  } else {
    improvements.push('Education section is empty');
    category.details.push('No education - Missing');
    recommendations.push('Add your educational background');
    recommendations.push('Include degree, institution, and graduation year');
  }

  return { category, strengths, improvements, recommendations };
}

function evaluateOnlinePresence(data: ResumeData) {
  const category: ScoreCategory = {
    name: 'Online Presence',
    score: 0,
    maxScore: 15,
    weight: 15,
    passed: false,
    details: [],
  };
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  let score = 0;

  if (data.linkedinUrl) {
    score += 5;
    strengths.push('LinkedIn profile linked');
    category.details.push('LinkedIn - Connected');
  } else {
    improvements.push('LinkedIn profile missing');
    category.details.push('LinkedIn - Missing');
    recommendations.push('Add your LinkedIn profile URL');
    recommendations.push('Create a LinkedIn profile if you don\'t have one');
  }

  if (data.githubUrl) {
    score += 5;
    strengths.push('GitHub profile linked');
    category.details.push('GitHub - Connected');
  } else {
    improvements.push('GitHub profile missing');
    category.details.push('GitHub - Missing');
    recommendations.push('Add your GitHub profile to showcase your code');
    recommendations.push('Pin your best repositories on GitHub');
  }

  if (data.portfolioUrl) {
    score += 5;
    strengths.push('Personal portfolio website linked');
    category.details.push('Portfolio - Connected');
  } else {
    improvements.push('Personal website/portfolio missing');
    category.details.push('Portfolio - Missing');
    recommendations.push('Add a personal portfolio website');
    recommendations.push('Use our portfolio generator to create one!');
  }

  category.score = score;
  category.passed = score >= 10;

  return { category, strengths, improvements, recommendations };
}

function evaluateCertifications(count: number) {
  const category: ScoreCategory = {
    name: 'Certifications',
    score: 0,
    maxScore: 10,
    weight: 10,
    passed: false,
    details: [],
  };
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  if (count >= 3) {
    category.score = 10;
    category.passed = true;
    strengths.push(`${count} certifications - Shows commitment to learning`);
    category.details.push(`${count} certifications - Excellent`);
  } else if (count >= 1) {
    category.score = 6;
    category.passed = true;
    strengths.push(`${count} certification(s) listed`);
    category.details.push(`${count} certification(s) - Good`);
    recommendations.push('Consider adding industry-recognized certifications');
    recommendations.push('Cloud, security, or framework certifications boost visibility');
  } else {
    improvements.push('No certifications listed');
    category.details.push('No certifications - Missing');
    recommendations.push('Add relevant certifications (AWS, Google Cloud, React, etc.)');
    recommendations.push('Even beginner certifications show initiative');
  }

  return { category, strengths, improvements, recommendations };
}

/**
 * Get grade label for display
 */
export function getGradeLabel(grade: JobReadinessResult['grade']): string {
  const labels = {
    excellent: 'Excellent - Job Ready!',
    good: 'Good Start - Ready for Applications',
    fair: 'Fair - Needs Polish',
    'needs-work': 'Needs Work - Building Foundation',
  };
  return labels[grade];
}

/**
 * Get status message for display
 */
export function getStatusMessage(status: JobReadinessResult['status']): string {
  const messages = {
    ready: 'Your profile is ready for job applications!',
    'almost-ready': 'Almost there! A few improvements needed.',
    preparing: 'Good foundation. Keep building your profile.',
    'just-started': 'Just getting started. Lots of potential!',
  };
  return messages[status];
}
