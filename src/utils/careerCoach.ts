// AI Career Coach - Personalized Roadmap Generator
// Generates career improvement plans based on resume and job readiness data

import { ResumeData } from './resumeTypes';
import { JobReadinessResult, calculateJobReadinessScore } from './jobReadinessScore';

// ============================================================================
// TYPES
// ============================================================================

export interface LearningResource {
  title: string;
  platform: 'official' | 'freecodecamp' | 'coursera' | 'youtube' | 'other';
  url: string;
  isFree: boolean;
}

export interface RoadmapAction {
  id: string;
  title: string;
  description: string;
  category: 'profile' | 'skills' | 'projects' | 'experience' | 'network';
  priority: 'high' | 'medium' | 'low';
  estimatedDays: number;
  completed: boolean;
  impact: number; // Score improvement potential
  resources: LearningResource[];
}

export interface CareerPath {
  name: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  averageSalary: string;
  salaryRange: { entry: string; mid: string; senior: string };
  growthRate: string;
  industryDemand: 'very_high' | 'high' | 'medium' | 'growing';
  growthOutlook: string;
  keySkills: string[];
}

export interface CareerTip {
  title: string;
  content: string;
  category: 'interview' | 'networking' | 'skills' | 'portfolio' | 'general';
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
  potentialScoreIncrease: number; // Total possible from all actions

  // Motivation
  motivationalMessage: string;
  encouragementPoints: string[];

  // Progress
  actionsCompleted: number;
  totalActions: number;
  progressPercentage: number;
  completedImpactPoints: number; // Points earned from completed actions

  // Career Tips
  careerTip: CareerTip;
}

// ============================================================================
// HELPER DATA
// ============================================================================

const CAREER_TIPS: CareerTip[] = [
  {
    title: 'The Hidden Job Market',
    content: 'Up to 80% of jobs are never posted publicly. Build genuine relationships with people in your target companies - referrals increase your chances of getting an interview by 10x.',
    category: 'networking',
  },
  {
    title: 'The STAR Method for Interviews',
    content: 'When answering behavioral questions, use the STAR method: Situation (set the context), Task (describe your responsibility), Action (what you did), Result (the outcome with metrics).',
    category: 'interview',
  },
  {
    title: 'Continuous Learning Mindset',
    content: 'Technology evolves rapidly. Dedicate 30-60 minutes daily to learning something new. Follow tech blogs, take online courses, and build side projects to stay current.',
    category: 'skills',
  },
  {
    title: 'Portfolio Over Resume',
    content: 'A strong portfolio with 3-4 well-documented projects speaks louder than any resume. Employers want to see what you can build, not just what you claim to know.',
    category: 'portfolio',
  },
  {
    title: 'Salary Negotiation Timing',
    content: 'Never discuss salary until you have a job offer. Once they want you, you have leverage. Research market rates on levels.fyi and Glassdoor beforehand.',
    category: 'general',
  },
  {
    title: 'The Power of Specialization',
    content: 'While being a generalist has benefits, specialists often command higher salaries. Pick a niche you\'re passionate about and become known for it.',
    category: 'skills',
  },
  {
    title: 'Interview Prep Strategy',
    content: 'For every interview, research the company\'s tech stack, recent news, and products. Prepare 3-5 thoughtful questions that show you\'ve done your homework.',
    category: 'interview',
  },
  {
    title: 'Building Your Personal Brand',
    content: 'Share your learning journey on LinkedIn or Twitter. Write about problems you solved, projects you built, or interesting tech concepts. This builds credibility and attracts opportunities.',
    category: 'networking',
  },
];

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

function getCareerTip(): CareerTip {
  return CAREER_TIPS[Math.floor(Math.random() * CAREER_TIPS.length)];
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
    salaryRange: { entry: '$60,000 - $80,000', mid: '$80,000 - $110,000', senior: '$110,000 - $150,000' },
    growthRate: '+25% (2023-2033)',
    industryDemand: 'very_high',
    growthOutlook: 'Excellent - Frontend development continues to evolve with new frameworks and tools',
    keySkills: ['JavaScript/TypeScript', 'React/Vue/Angular', 'CSS Frameworks', 'Git', 'Performance Optimization'],
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
    salaryRange: { entry: '$65,000 - $85,000', mid: '$90,000 - $120,000', senior: '$125,000 - $170,000' },
    growthRate: '+22% (2023-2033)',
    industryDemand: 'very_high',
    growthOutlook: 'Strong - Backend skills are essential for every tech company',
    keySkills: ['Python/Java/Node.js', 'Database Design', 'API Development', 'Cloud Services', 'Security'],
  });

  // Full Stack Developer
  const fullstackMatch = Math.round((frontendMatch + backendMatch) / 2);
  paths.push({
    name: 'Full Stack Developer',
    description: 'Build complete web applications from frontend to backend',
    matchPercentage: Math.min(100, fullstackMatch * 12 + (title.includes('full') ? 30 : 0)),
    requiredSkills: ['Frontend Framework', 'Backend Language', 'Databases', 'DevOps Basics', 'System Design'],
    averageSalary: '$85,000 - $150,000',
    salaryRange: { entry: '$65,000 - $90,000', mid: '$95,000 - $130,000', senior: '$140,000 - $180,000' },
    growthRate: '+27% (2023-2033)',
    industryDemand: 'very_high',
    growthOutlook: 'Excellent - Full stack developers are highly valued for their versatility',
    keySkills: ['Frontend + Backend', 'Database Management', 'DevOps Basics', 'System Design', 'Problem Solving'],
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
    salaryRange: { entry: '$55,000 - $75,000', mid: '$80,000 - $110,000', senior: '$120,000 - $160,000' },
    growthRate: '+35% (2023-2033)',
    industryDemand: 'high',
    growthOutlook: 'Very Strong - AI and data science are transforming every industry',
    keySkills: ['Python/R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
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
    salaryRange: { entry: '$70,000 - $95,000', mid: '$100,000 - $135,000', senior: '$140,000 - $185,000' },
    growthRate: '+21% (2023-2033)',
    industryDemand: 'high',
    growthOutlook: 'Strong - Cloud adoption continues to accelerate across industries',
    keySkills: ['Cloud Platforms', 'Docker/Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Monitoring'],
  });

  // Sort by match percentage
  paths.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    recommended: paths[0],
    alternatives: paths.slice(1, 3),
  };
}

function createLearningResources(skill: string): LearningResource[] {
  const resourceMap: Record<string, LearningResource[]> = {
    'React': [
      { title: 'React Official Documentation', platform: 'official', url: 'https://react.dev', isFree: true },
      { title: 'freeCodeCamp React Course', platform: 'freecodecamp', url: 'https://freecodecamp.org/learn', isFree: true },
      { title: 'React - The Complete Guide (Coursera)', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      { title: 'React Tutorial for Beginners', platform: 'youtube', url: 'https://youtube.com', isFree: true },
    ],
    'Python': [
      { title: 'Python Official Documentation', platform: 'official', url: 'https://docs.python.org', isFree: true },
      { title: 'freeCodeCamp Python Course', platform: 'freecodecamp', url: 'https://freecodecamp.org/learn', isFree: true },
      { title: 'Python for Everybody (Coursera)', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      { title: 'Python Programming Tutorials', platform: 'youtube', url: 'https://youtube.com', isFree: true },
    ],
    'JavaScript': [
      { title: 'MDN JavaScript Guide', platform: 'official', url: 'https://developer.mozilla.org', isFree: true },
      { title: 'freeCodeCamp JavaScript', platform: 'freecodecamp', url: 'https://freecodecamp.org/learn', isFree: true },
      { title: 'JavaScript Algorithms (Coursera)', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      { title: 'JavaScript Crash Course', platform: 'youtube', url: 'https://youtube.com', isFree: true },
    ],
    'TypeScript': [
      { title: 'TypeScript Official Handbook', platform: 'official', url: 'https://typescriptlang.org', isFree: true },
      { title: 'freeCodeCamp TypeScript', platform: 'freecodecamp', url: 'https://freecodecamp.org/learn', isFree: true },
      { title: 'TypeScript Course', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      { title: 'TypeScript for Beginners', platform: 'youtube', url: 'https://youtube.com', isFree: true },
    ],
    'Docker': [
      { title: 'Docker Official Documentation', platform: 'official', url: 'https://docs.docker.com', isFree: true },
      { title: 'Docker for Beginners', platform: 'youtube', url: 'https://youtube.com', isFree: true },
      { title: 'Docker & Kubernetes Course', platform: 'coursera', url: 'https://coursera.org', isFree: false },
    ],
    'AWS': [
      { title: 'AWS Official Training', platform: 'official', url: 'https://aws.amazon.com/training', isFree: true },
      { title: 'AWS Tutorial for Beginners', platform: 'youtube', url: 'https://youtube.com', isFree: true },
      { title: 'AWS Cloud Practitioner', platform: 'coursera', url: 'https://coursera.org', isFree: false },
    ],
    'Git': [
      { title: 'Git Official Documentation', platform: 'official', url: 'https://git-scm.com/doc', isFree: true },
      { title: 'freeCodeCamp Git Course', platform: 'freecodecamp', url: 'https://freecodecamp.org/learn', isFree: true },
      { title: 'Git & GitHub Crash Course', platform: 'youtube', url: 'https://youtube.com', isFree: true },
    ],
  };

  return resourceMap[skill] || [
    { title: `${skill} Official Documentation`, platform: 'official', url: '#', isFree: true },
    { title: `Learn ${skill} on freeCodeCamp`, platform: 'freecodecamp', url: 'https://freecodecamp.org/learn', isFree: true },
    { title: `${skill} Course on Coursera`, platform: 'coursera', url: 'https://coursera.org', isFree: false },
    { title: `${skill} Tutorial on YouTube`, platform: 'youtube', url: 'https://youtube.com', isFree: true },
  ];
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
      title: 'Create an optimized LinkedIn profile',
      description: 'Add a professional photo, craft a compelling headline with keywords, and write a summary that highlights your unique value proposition.',
      category: 'network',
      priority: 'high',
      estimatedDays: 2,
      completed: false,
      impact: 6,
      resources: [
        { title: 'LinkedIn Official Guide', platform: 'official', url: 'https://linkedin.com/help', isFree: true },
        { title: 'LinkedIn Optimization Tutorial', platform: 'youtube', url: 'https://youtube.com', isFree: true },
        { title: 'Career Development Course', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      ],
    });
  }

  // 2. GitHub Profile
  if (!resumeData.githubUrl || improvements.some(i => i.toLowerCase().includes('github'))) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Build a standout GitHub profile',
      description: 'Create repositories for your projects, write clear README files, pin your best work, and show consistent activity with meaningful commits.',
      category: 'profile',
      priority: 'high',
      estimatedDays: 3,
      completed: false,
      impact: 4,
      resources: [
        { title: 'GitHub Docs', platform: 'official', url: 'https://docs.github.com', isFree: true },
        { title: 'GitHub Profile README Guide', platform: 'freecodecamp', url: 'https://freecodecamp.org', isFree: true },
        { title: 'Git & GitHub Course', platform: 'coursera', url: 'https://coursera.org', isFree: false },
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
      description: `Create a ${(level === 'beginner') ? 'simple' : 'complex'} ${skillToUse} project with full documentation, tests, and deployment. Include README, live demo, and code comments.`,
      category: 'projects',
      priority: resumeData.projects.length === 0 ? 'high' : 'medium',
      estimatedDays: level === 'beginner' ? 5 : 10,
      completed: false,
      impact: 8,
      resources: createLearningResources(skillToUse),
    });
  }

  // 4. Skills Enhancement
  const missingSkills = getMissingSkills(resumeData, level);
  if (missingSkills.length > 0) {
    actions.push({
      id: `action-${actionId++}`,
      title: `Learn ${missingSkills[0]}`,
      description: `${missingSkills[0]} is a highly requested skill in the industry. Master the fundamentals through hands-on practice and build a small project to showcase your knowledge.`,
      category: 'skills',
      priority: resumeData.skills.length < 5 ? 'high' : 'medium',
      estimatedDays: 7,
      completed: false,
      impact: 5,
      resources: createLearningResources(missingSkills[0]),
    });
  }

  // 5. Certifications
  if (resumeData.certifications.length < 2 && level !== 'advanced') {
    const recommendedCert = getRecommendedCertification(resumeData);
    actions.push({
      id: `action-${actionId++}`,
      title: `Earn ${recommendedCert}`,
      description: `This certification validates your skills and demonstrates commitment to professional development. It boosts credibility with employers significantly.`,
      category: 'skills',
      priority: resumeData.certifications.length === 0 ? 'medium' : 'low',
      estimatedDays: 14,
      completed: false,
      impact: 6,
      resources: [
        { title: 'Official Certification Guide', platform: 'official', url: '#', isFree: true },
        { title: 'freeCodeCamp Prep Course', platform: 'freecodecamp', url: 'https://freecodecamp.org', isFree: true },
        { title: 'Certification Prep (Coursera)', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      ],
    });
  }

  // 6. Experience / Projects Enhancement
  if (resumeData.workExperience.length === 0) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Gain practical experience',
      description: 'Look for internships, contribute to open source, or take on freelance projects. Real-world experience is invaluable and highly valued by employers.',
      category: 'experience',
      priority: 'high',
      estimatedDays: 21,
      completed: false,
      impact: 12,
      resources: [
        { title: 'Open Source Projects Guide', platform: 'official', url: 'https://github.com/topics', isFree: true },
        { title: 'How to Contribute to Open Source', platform: 'freecodecamp', url: 'https://freecodecamp.org', isFree: true },
        { title: 'Interview Preparation', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      ],
    });
  }

  // 7. Improve Project Descriptions
  if (resumeData.projects.some(p => p.description.length < 50)) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Enhance project descriptions',
      description: 'Add technical details, explain challenges faced, describe your solutions, and quantify results where possible. Make your projects shine!',
      category: 'projects',
      priority: 'medium',
      estimatedDays: 2,
      completed: false,
      impact: 4,
      resources: [
        { title: 'Technical Writing Guide', platform: 'official', url: '#', isFree: true },
        { title: 'How to Document Projects', platform: 'youtube', url: 'https://youtube.com', isFree: true },
      ],
    });
  }

  // 8. Personal Portfolio Website
  if (!resumeData.portfolioUrl) {
    actions.push({
      id: `action-${actionId++}`,
      title: 'Create a personal portfolio website',
      description: 'Build a stunning portfolio website to showcase your projects, skills, and professional story. Deploy it for free on Vercel or Netlify.',
      category: 'profile',
      priority: resumeData.projects.length > 0 ? 'high' : 'medium',
      estimatedDays: 4,
      completed: false,
      impact: 5,
      resources: [
        { title: 'Portfolio Templates', platform: 'official', url: 'https://vercel.com/templates', isFree: true },
        { title: 'Build a Portfolio (freeCodeCamp)', platform: 'freecodecamp', url: 'https://freecodecamp.org', isFree: true },
        { title: 'Web Development Course', platform: 'coursera', url: 'https://coursera.org', isFree: false },
      ],
    });
  }

  // 9. Network & Community
  actions.push({
    id: `action-${actionId++}`,
    title: 'Join developer communities',
    description: 'Connect with other developers, attend virtual or local meetups, participate in Discord communities, and engage on Twitter/X tech circles.',
    category: 'network',
    priority: 'low',
    estimatedDays: 3,
    completed: false,
    impact: 3,
    resources: [
      { title: 'Tech Discord Servers List', platform: 'official', url: '#', isFree: true },
      { title: 'Meetup.com Tech Groups', platform: 'official', url: 'https://meetup.com', isFree: true },
      { title: 'Networking for Developers', platform: 'youtube', url: 'https://youtube.com', isFree: true },
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
  const potentialScoreIncrease = nextActions.reduce((sum, a) => sum + a.impact, 0);

  // Generate motivation
  const motivationalMessage = generateMotivationalMessage(scoreResult.percentage);
  const encouragementPoints = getEncouragementPoints(projectedScoreAfter, scoreResult.percentage);

  // Get random career tip
  const careerTip = getCareerTip();

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
    potentialScoreIncrease,
    motivationalMessage,
    encouragementPoints,
    actionsCompleted: 0,
    totalActions: nextActions.length,
    progressPercentage: 0,
    completedImpactPoints: 0,
    careerTip,
  };
}
