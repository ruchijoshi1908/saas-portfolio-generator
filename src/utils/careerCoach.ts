// AI Career Coach - Personalized Roadmap Generator
// Generates career improvement plans based on resume and job readiness data

import { ResumeData } from './resumeTypes';
import { JobReadinessResult, calculateJobReadinessScore } from './jobReadinessScore';

// ============================================================================
// TYPES
// ============================================================================

export interface RoadmapAction {
  id: string;
  title: string;
  description: string;
  category: 'profile' | 'skills' | 'projects' | 'experience' | 'network';
  priority: 'high' | 'medium' | 'low';
  estimatedDays: number;
  completed: boolean;
  impact: number; // Score improvement potential
  resources?: {
    title: string;
    url?: string;
  }[];
}

export interface CareerPath {
  name: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  averageSalary: string;
  growthRate: string;
}

export interface CareerRoadmap {
  // Assessment
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  levelDescription: string;

  // Career Path
  recommendedPath: CareerPath;
  alternativePaths: CareerPath[];

  // Actions
  nextActions: RoadmapAction[];

  // Timeline
  estimatedWeeks: number;
  estimatedWeeksRange: { min: number; max: number };

  // Score Projection
  currentScore: number;
  projectedScoreAfter: number;
  scoreImprovement: number;

  // Motivation
  motivationalMessage: string;
  encouragementPoints: string[];

  // Progress
  actionsCompleted: number;
  totalActions: number;
  progressPercentage: number;
}

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

function determineCareerLevel(resumeData: ResumeData, scoreResult: JobReadinessResult): 'beginner' | 'intermediate' | 'advanced' {
  const { percentage } = scoreResult;

  // Experience-based factors
  const experienceYears = resumeData.workExperience.reduce((years, exp) => {
    const startYear = parseInt(exp.startDate.match(/\d{4}/)?.[0] || '2020');
    const endYear = exp.endDate.toLowerCase().includes('present')
      ? new Date().getFullYear()
      : parseInt(exp.endDate.match(/\d{4}/)?.[0] || String(startYear));
    return years + Math.max(0, endYear - startYear);
  }, 0);

  const projectCount = resumeData.projects.length;

  // Advanced level: high score + significant experience
  if (percentage >= 80 || (experienceYears >= 5 && projectCount >= 3)) {
    return 'advanced';
  }

  // Intermediate level: moderate score + some experience
  if (percentage >= 50 || (experienceYears >= 2 && projectCount >= 1)) {
    return 'intermediate';
  }

  // Beginner level: just starting out
  return 'beginner';
}

function getLevelDescription(level: 'beginner' | 'intermediate' | 'advanced'): string {
  const descriptions = {
    beginner: 'You\'re at the beginning of your tech journey. This is an exciting time to build foundational skills and discover your passion areas.',
    intermediate: 'You have a solid foundation and some real-world experience. Now it\'s time to specialize and build depth in your chosen field.',
    advanced: 'You\'re an experienced professional with strong skills. Focus on leadership, mentorship, and staying current with emerging technologies.',
  };
  return descriptions[level];
}

function recommendCareerPath(resumeData: ResumeData): { recommended: CareerPath; alternatives: CareerPath[] } {
  const skills = resumeData.skills.map(s => s.toLowerCase());
  const title = resumeData.professionalTitle.toLowerCase();

  // Analyze skills to determine best fit
  const paths: CareerPath[] = [];

  // Frontend Developer
  const frontendSkills = ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'tailwind', 'sass', 'figma', 'ui', 'ux'];
  const frontendMatch = skills.filter(s => frontendSkills.some(fs => s.includes(fs))).length;
  paths.push({
    name: 'Frontend Developer',
    description: 'Build beautiful, interactive user interfaces and web applications',
    matchPercentage: Math.min(100, Math.round((frontendMatch / 6) * 100) + (title.includes('frontend') || title.includes('ui') ? 25 : 0)),
    requiredSkills: ['React/Vue/Angular', 'TypeScript', 'CSS/SCSS', 'Git', 'Responsive Design'],
    averageSalary: '$75,000 - $130,000',
    growthRate: '+25% (2023-2033)',
  });

  // Backend Developer
  const backendSkills = ['node', 'python', 'java', 'sql', 'mongodb', 'postgresql', 'api', 'rest', 'graphql', 'docker', 'aws', 'redis'];
  const backendMatch = skills.filter(s => backendSkills.some(bs => s.includes(bs))).length;
  paths.push({
    name: 'Backend Developer',
    description: 'Design and build server-side applications and APIs',
    matchPercentage: Math.min(100, Math.round((backendMatch / 6) * 100) + (title.includes('backend') || title.includes('api') ? 25 : 0)),
    requiredSkills: ['Python/Java/Node.js', 'SQL/NoSQL Databases', 'REST APIs', 'Cloud Services', 'System Design'],
    averageSalary: '$80,000 - $145,000',
    growthRate: '+22% (2023-2033)',
  });

  // Full Stack Developer
  const fullstackMatch = Math.round((frontendMatch + backendMatch) / 2);
  paths.push({
    name: 'Full Stack Developer',
    description: 'Build complete web applications from frontend to backend',
    matchPercentage: Math.min(100, fullstackMatch * 12 + (title.includes('full') ? 30 : 0)),
    requiredSkills: ['Frontend Framework', 'Backend Language', 'Databases', 'DevOps Basics', 'System Design'],
    averageSalary: '$85,000 - $150,000',
    growthRate: '+27% (2023-2033)',
  });

  // Data Analyst/Scientist
  const dataSkills = ['python', 'sql', 'pandas', 'numpy', 'machine learning', 'tensorflow', 'pytorch', 'data', 'analytics', 'tableau', 'excel'];
  const dataMatch = skills.filter(s => dataSkills.some(ds => s.includes(ds))).length;
  paths.push({
    name: 'Data Analyst/Scientist',
    description: 'Transform data into insights and build predictive models',
    matchPercentage: Math.min(100, Math.round((dataMatch / 5) * 100) + (title.includes('data') ? 30 : 0)),
    requiredSkills: ['Python/R', 'SQL', 'Data Visualization', 'Statistics', 'Machine Learning'],
    averageSalary: '$70,000 - $140,000',
    growthRate: '+35% (2023-2033)',
  });

  // DevOps Engineer
  const devopsSkills = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'linux', 'terraform', 'ansible', 'jenkins'];
  const devopsMatch = skills.filter(s => devopsSkills.some(ds => s.includes(ds))).length;
  paths.push({
    name: 'DevOps Engineer',
    description: 'Build and maintain cloud infrastructure and deployment pipelines',
    matchPercentage: Math.min(100, Math.round((devopsMatch / 5) * 100) + (title.includes('devops') || title.includes('cloud') ? 30 : 0)),
    requiredSkills: ['Cloud Platforms', 'Docker/Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Monitoring'],
    averageSalary: '$90,000 - $160,000',
    growthRate: '+21% (2023-2033)',
  });

  // Sort by match percentage
  paths.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    recommended: paths[0],
    alternatives: paths.slice(1, 3),
  };
}

function generateNextActions(resumeData: ResumeData, scoreResult: JobReadinessResult, level: 'beginner' | 'intermediate' | 'advanced'): RoadmapAction[] {
  const actions: RoadmapAction[] = [];
  let actionId = 1;

  // Priority based on score improvements
  const { improvements } = scoreResult;

  // 1. LinkedIn Profile (High Impact, Quick Win)
  if (!resumeData.linkedinUrl || improvements.some(i => i.toLowerCase().includes('linkedin'))) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Optimize your LinkedIn profile',
      description: 'Add a professional photo, craft a compelling headline, and write a summary that highlights your unique value.',
      category: 'network',
      priority: 'high',
      estimatedDays: 2,
      completed: false,
      impact: 5,
      resources: [
        { title: 'LinkedIn Profile Optimization Guide', url: '#' },
        { title: 'Tech Professional Headline Examples', url: '#' },
      ],
    });
  }

  // 2. GitHub Profile
  if (!resumeData.githubUrl || improvements.some(i => i.toLowerCase().includes('github'))) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Build your GitHub presence',
      description: 'Create repositories for your projects, add README files, and pin your best work. Show clean code and documentation.',
      category: 'profile',
      priority: 'high',
      estimatedDays: 3,
      completed: false,
      impact: 5,
      resources: [
        { title: 'GitHub Profile README Guide', url: '#' },
        { title: 'How to Write Great READMEs', url: '#' },
      ],
    });
  }

  // 3. Portfolio Projects
  if (resumeData.projects.length < 3) {
    const projectNum = resumeData.projects.length + 1;
    const skillToUse = resumeData.skills[0] || 'React';
    actions.push({
      id: `action-${actionId++}`,
      title: `Build project #${projectNum}: ${skillToUse} application`,
      description: `Create a ${(level === 'beginner') ? 'simple' : 'complex'} ${skillToUse} project that showcases your abilities. Include tests and documentation.`,
      category: 'projects',
      priority: resumeData.projects.length === 0 ? 'high' : 'medium',
      estimatedDays: level === 'beginner' ? 5 : 10,
      completed: false,
      impact: 15,
      resources: [
        { title: 'Project Ideas for Developers', url: '#' },
        { title: `${skillToUse} Tutorial Series`, url: '#' },
      ],
    });
  }

  // 4. Skills Enhancement
  const missingSkills = getMissingSkills(resumeData, level);
  if (missingSkills.length > 0) {
    actions.push({
      id: `action-${actionId++}`,
      title: `Learn ${missingSkills[0]}`,
      description: `Add ${missingSkills[0]} to your skillset. This is a highly requested skill that will boost your employability.`,
      category: 'skills',
      priority: resumeData.skills.length < 5 ? 'high' : 'medium',
      estimatedDays: 7,
      completed: false,
      impact: 8,
      resources: [
        { title: `${missingSkills[0]} Free Course`, url: '#' },
        { title: `${missingSkills[0]} Documentation`, url: '#' },
      ],
    });
  }

  // 5. Certifications
  if (resumeData.certifications.length < 2 && level !== 'advanced') {
    const recommendedCert = getRecommendedCertification(resumeData);
    actions.push({
      id: `action-${actionId++}`,
      title: `Earn ${recommendedCert}`,
      description: `This certification validates your skills and shows commitment to professional development.`,
      category: 'skills',
      priority: resumeData.certifications.length === 0 ? 'medium' : 'low',
      estimatedDays: 14,
      completed: false,
      impact: 6,
      resources: [
        { title: `${recommendedCert} Exam Guide`, url: '#' },
        { title: 'Practice Tests & Resources', url: '#' },
      ],
    });
  }

  // 6. Experience / Projects Enhancement
  if (resumeData.workExperience.length === 0) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Gain practical experience',
      description: 'Look for internships, freelance projects, or volunteer opportunities. Even small projects count!',
      category: 'experience',
      priority: 'high',
      estimatedDays: 21,
      completed: false,
      impact: 12,
      resources: [
        { title: 'Internship Matching Platforms', url: '#' },
        { title: 'Freelance Job Sites', url: '#' },
        { title: 'Open Source Projects to Contribute', url: '#' },
      ],
    });
  }

  // 7. Improve Project Descriptions
  if (resumeData.projects.some(p => p.description.length < 50)) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Enhance project descriptions',
      description: 'Add technical details, challenges faced, and solutions implemented. Quantify results where possible.',
      category: 'projects',
      priority: 'medium',
      estimatedDays: 2,
      completed: false,
      impact: 5,
      resources: [
        { title: 'How to Write Compelling Project Descriptions', url: '#' },
      ],
    });
  }

  // 8. Personal Portfolio Website
  if (!resumeData.portfolioUrl) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Create a personal portfolio website',
      description: 'Build a stunning portfolio website to showcase your projects, skills, and personality.',
      category: 'profile',
      priority: resumeData.projects.length > 0 ? 'high' : 'medium',
      estimatedDays: 4,
      completed: false,
      impact: 5,
      resources: [
        { title: 'Portfolio Website Templates', url: '#' },
        { title: 'Deploy for Free on Vercel/Netlify', url: '#' },
      ],
    });
  }

  // 9. Education (for beginners)
  if (resumeData.education.length === 0 && level === 'beginner') {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Consider formal education or bootcamps',
      description: 'A degree or coding bootcamp can provide structure and credibility. Research options that fit your goals.',
      category: 'skills',
      priority: 'low',
      estimatedDays: 30,
      completed: false,
      impact: 10,
      resources: [
        { title: 'Top Coding Bootcamps', url: '#' },
        { title: 'Online CS Degree Programs', url: '#' },
      ],
    });
  }

  // 10. Network & Community
  actions.push({
    id: `action-${actionId++}`,
    title: 'Join developer communities',
    description: 'Connect with other developers, attend meetups, and participate in online communities.',
    category: 'network',
    priority: 'low',
    estimatedDays: 3,
    completed: false,
    impact: 3,
    resources: [
      { title: 'Tech Discord Servers', url: '#' },
      { title: 'Local Meetup Groups', url: '#' },
    ],
  });

  // Limit to top 5-7 actions based on priority
  actions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.impact - a.impact;
  });

  return actions.slice(0, 7);
}

function getMissingSkills(resumeData: ResumeData, level: 'beginner' | 'intermediate' | 'advanced'): string[] {
  const coreSkills = {
    beginner: ['Git', 'HTML/CSS', 'JavaScript', 'React', 'Basic SQL', 'Problem Solving'],
    intermediate: ['TypeScript', 'Node.js', 'Testing', 'Docker', 'API Design', 'System Design'],
    advanced: ['Kubernetes', 'Cloud Architecture', 'Leadership', 'Mentoring', 'CI/CD Pipelines', 'Performance Optimization'],
  };

  const userSkills = resumeData.skills.map(s => s.toLowerCase());
  const required = coreSkills[level];

  return required.filter(skill => !userSkills.some(us => us.includes(skill.toLowerCase())));
}

function getRecommendedCertification(resumeData: ResumeData): string {
  const skills = resumeData.skills.map(s => s.toLowerCase());

  if (skills.some(s => s.includes('aws') || s.includes('cloud'))) {
    return 'AWS Solutions Architect';
  }
  if (skills.some(s => s.includes('azure'))) {
    return 'Azure Developer Associate';
  }
  if (skills.some(s => s.includes('kubernetes') || s.includes('docker'))) {
    return 'Certified Kubernetes Administrator';
  }
  if (skills.some(s => s.includes('react') || s.includes('frontend'))) {
    return 'Meta Frontend Developer Certificate';
  }
  if (skills.some(s => s.includes('python') || s.includes('data'))) {
    return 'Google Data Analytics Certificate';
  }

  return 'Google Cloud Digital Leader';
}

function calculateTimeline(actions: RoadmapAction[]): { min: number; max: number; total: number } {
  const totalDays = actions.reduce((sum, a) => sum + a.estimatedDays, 0);
  const minWeeks = Math.ceil(totalDays / 7);
  const maxWeeks = Math.ceil(totalDays / 5); // Assuming 5 productive days per week

  return {
    min: minWeeks,
    max: maxWeeks,
    total: totalDays,
  };
}

function calculateProjectedScore(currentScore: number, actions: RoadmapAction[]): number {
  const maxPossibleImprovement = actions.reduce((sum, a) => sum + a.impact, 0);
  const realisticImprovement = Math.round(maxPossibleImprovement * 0.7); // 70% achievement rate
  return Math.min(100, currentScore + realisticImprovement);
}

function generateMotivationalMessage(score: number): string {
  if (score >= 80) {
    return "You're closer than you think! Your profile is already impressive. Fine-tuning the remaining areas will make you unstoppable in the job market.";
  }
  if (score >= 60) {
    return "You're closer than you think. Completing these steps can significantly strengthen your profile and open doors to exciting opportunities.";
  }
  if (score >= 40) {
    return "You have a solid foundation to build upon. With focused effort on these recommendations, you can transform your profile in just a few weeks.";
  }
  return "Everyone starts somewhere, and you've already taken the first step! Follow this roadmap, and you'll see dramatic improvements in your job readiness.";
}

function getEncouragementPoints(projectedScore: number, currentScore: number): string[] {
  const points: string[] = [];
  const improvement = projectedScore - currentScore;

  if (improvement >= 20) {
    points.push(`Potential ${improvement}+ point increase in your Job Readiness Score`);
  }
  if (improvement >= 10) {
    points.push('Could move up to the next grade level');
  }
  points.push('Strengthened portfolio and online presence');
  points.push('Increased confidence in interviews');
  points.push('Better positioning for salary negotiations');
  points.push('Expanded professional network');

  return points.slice(0, 4);
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function generateCareerRoadmap(resumeData: ResumeData): CareerRoadmap {
  // Calculate current job readiness score
  const scoreResult = calculateJobReadinessScore(resumeData);

  // Determine career level
  const currentLevel = determineCareerLevel(resumeData, scoreResult);

  // Get level description
  const levelDescription = getLevelDescription(currentLevel);

  // Get recommended career path
  const { recommended: recommendedPath, alternatives: alternativePaths } = recommendCareerPath(resumeData);

  // Generate next actions
  const nextActions = generateNextActions(resumeData, scoreResult, currentLevel);

  // Calculate timeline
  const timeline = calculateTimeline(nextActions);
  const estimatedWeeks = timeline.min;

  // Calculate projected score
  const projectedScoreAfter = calculateProjectedScore(scoreResult.percentage, nextActions);
  const scoreImprovement = projectedScoreAfter - scoreResult.percentage;

  // Generate motivation
  const motivationalMessage = generateMotivationalMessage(scoreResult.percentage);
  const encouragementPoints = getEncouragementPoints(projectedScoreAfter, scoreResult.percentage);

  return {
    currentLevel,
    levelDescription,
    recommendedPath,
    alternativePaths,
    nextActions,
    estimatedWeeks,
    estimatedWeeksRange: { min: timeline.min, max: timeline.max },
    currentScore: scoreResult.percentage,
    projectedScoreAfter,
    scoreImprovement,
    motivationalMessage,
    encouragementPoints,
    actionsCompleted: 0,
    totalActions: nextActions.length,
    progressPercentage: 0,
  };
}
