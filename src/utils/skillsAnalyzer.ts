// Skills Analyzer - AI-powered Skills Analysis and Recommendations
// Analyzes user skills, identifies gaps, and provides learning recommendations

import { ResumeData } from './resumeTypes';

// ============================================================================
// TYPES
// ============================================================================

export type SkillsScoreLabel = 'excellent' | 'good' | 'average' | 'needs_improvement';

export interface SkillInfo {
  name: string;
  category: 'technical' | 'soft';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiency: number; // 0-100
  source: 'explicit' | 'inferred';
}

export interface MissingSkill {
  name: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  learningTime: string; // e.g., "2-4 weeks"
  learningResources: {
    title: string;
    platform: string;
  }[];
  priority: number; // 1-10, higher = learn first
}

export interface StrengthArea {
  name: string;
  score: number; // 0-100
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
}

export interface RecommendedLearning {
  skill: string;
  reason: string;
  estimatedTime: string;
  prerequisites: string[];
  order: number;
}

export interface CareerPathSkills {
  path: string;
  matchPercentage: number;
  topIndustrySkills: string[];
  averageSalary: string;
}

export interface SkillsAnalysis {
  // Overview
  totalSkills: number;
  technicalSkillsCount: number;
  softSkillsCount: number;

  // Skills Data
  technicalSkills: SkillInfo[];
  softSkills: SkillInfo[];

  // Missing Skills
  missingSkills: MissingSkill[];

  // Career Path
  careerPathSkills: CareerPathSkills;

  // Strength Areas
  strengthAreas: StrengthArea[];

  // Learning Recommendations
  recommendedLearning: RecommendedLearning[];

  // Overall Score
  overallScore: number;
  scoreLabel: SkillsScoreLabel;

  // Potential Score
  potentialScore: number;
}

// ============================================================================
// SKILL DEFINITIONS
// ============================================================================

const SOFT_SKILLS = [
  'communication', 'leadership', 'teamwork', 'problem solving', 'analytical', 'critical thinking',
  'time management', 'project management', 'agile', 'scrum', 'presentation', 'negotiation',
  'creativity', 'adaptability', 'collaboration', 'mentoring', 'public speaking', 'writing',
  'attention to detail', 'multitasking', 'organization', 'decision making', 'strategic planning',
];

const CAREER_PATHS_SKILLS: Record<string, { skills: string[]; salary: string }> = {
  'Frontend Developer': {
    skills: ['JavaScript', 'TypeScript', 'React', 'HTML/CSS', 'Git', 'Responsive Design', 'State Management', 'Testing', 'Accessibility', 'Performance Optimization'],
    salary: '$75,000 - $130,000',
  },
  'Backend Developer': {
    skills: ['Python', 'Node.js', 'Java', 'SQL', 'API Design', 'Docker', 'Cloud Services', 'Testing', 'Security', 'System Design'],
    salary: '$80,000 - $145,000',
  },
  'Full Stack Developer': {
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'API Design', 'Testing', 'Cloud Basics'],
    salary: '$85,000 - $150,000',
  },
  'Data Analyst/Scientist': {
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Pandas', 'NumPy', 'TensorFlow', 'Excel', 'Tableau'],
    salary: '$70,000 - $140,000',
  },
  'DevOps Engineer': {
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Python', 'Monitoring', 'Security', 'Scripting'],
    salary: '$90,000 - $160,000',
  },
  'Mobile Developer': {
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX', 'API Integration', 'Testing', 'App Store', 'Performance', 'Security'],
    salary: '$80,000 - $140,000',
  },
};

const LEARNING_TIMES: Record<string, string> = {
  // Beginner friendly
  'HTML': '1-2 weeks',
  'CSS': '2-3 weeks',
  'Git': '1-2 weeks',
  'JavaScript': '4-8 weeks',
  'Python': '4-8 weeks',
  'SQL': '2-4 weeks',
  // Intermediate
  'TypeScript': '2-4 weeks',
  'React': '4-8 weeks',
  'Node.js': '4-8 weeks',
  'Docker': '2-4 weeks',
  'AWS': '4-8 weeks',
  'Testing': '2-4 weeks',
  // Advanced
  'Kubernetes': '4-8 weeks',
  'System Design': '4-8 weeks',
  'Machine Learning': '8-16 weeks',
  'Security': '4-8 weeks',
};

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

function categorizeSkill(skill: string): 'technical' | 'soft' {
  const lowerSkill = skill.toLowerCase();

  // Check if it's a soft skill
  if (SOFT_SKILLS.some(s => lowerSkill.includes(s) || s.includes(lowerSkill))) {
    return 'soft';
  }

  // Default to technical
  return 'technical';
}

function estimateSkillLevel(skill: string, resumeData: ResumeData): { level: SkillInfo['level']; proficiency: number } {
  const lowerSkill = skill.toLowerCase();

  // Check if skill is explicitly listed
  const isExplicit = resumeData.skills.some(s => s.toLowerCase().includes(lowerSkill));

  // Check for project usage
  const projectUsage = resumeData.projects.filter(p =>
    p.technologies.some(t => t.toLowerCase().includes(lowerSkill))
  ).length;

  // Check for experience usage
  const experienceUsage = resumeData.workExperience.filter(e =>
    e.description.toLowerCase().includes(lowerSkill) ||
    e.title.toLowerCase().includes(lowerSkill)
  ).length;

  // Calculate proficiency
  let proficiency = isExplicit ? 40 : 0;
  proficiency += Math.min(projectUsage * 15, 30);
  proficiency += Math.min(experienceUsage * 10, 20);

  // Check for certifications
  const hasCert = resumeData.certifications.some(c =>
    c.name.toLowerCase().includes(lowerSkill)
  );
  if (hasCert) proficiency += 10;

  proficiency = Math.min(proficiency, 100);

  // Determine level
  let level: SkillInfo['level'];
  if (proficiency >= 80) level = 'expert';
  else if (proficiency >= 60) level = 'advanced';
  else if (proficiency >= 40) level = 'intermediate';
  else level = 'beginner';

  return { level, proficiency };
}

function analyzeTechnicalSkills(resumeData: ResumeData): SkillInfo[] {
  const skills: SkillInfo[] = [];

  resumeData.skills.forEach(skill => {
    if (categorizeSkill(skill) === 'technical') {
      const { level, proficiency } = estimateSkillLevel(skill, resumeData);
      skills.push({
        name: skill,
        category: 'technical',
        level,
        proficiency,
        source: 'explicit',
      });
    }
  });

  // Infer skills from projects
  resumeData.projects.forEach(project => {
    project.technologies.forEach(tech => {
      if (!skills.some(s => s.name.toLowerCase() === tech.toLowerCase())) {
        const { level, proficiency } = estimateSkillLevel(tech, resumeData);
        skills.push({
          name: tech,
          category: 'technical',
          level,
          proficiency,
          source: 'inferred',
        });
      }
    });
  });

  return skills;
}

function analyzeSoftSkills(resumeData: ResumeData): SkillInfo[] {
  const skills: SkillInfo[] = [];

  resumeData.skills.forEach(skill => {
    if (categorizeSkill(skill) === 'soft') {
      skills.push({
        name: skill,
        category: 'soft',
        level: 'intermediate',
        proficiency: 50,
        source: 'explicit',
      });
    }
  });

  // Add common soft skills if experience exists
  if (resumeData.workExperience.length > 0) {
    const commonSoftSkills = ['Problem Solving', 'Communication', 'Teamwork'];
    commonSoftSkills.forEach(skill => {
      if (!skills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
        skills.push({
          name: skill,
          category: 'soft',
          level: 'intermediate',
          proficiency: 45 + Math.random() * 20,
          source: 'inferred',
        });
      }
    });
  }

  return skills;
}

function identifyMissingSkills(userSkills: SkillInfo[], careerPath: string): MissingSkill[] {
  const pathSkills = CAREER_PATHS_SKILLS[careerPath]?.skills || [];
  const userSkillNames = userSkills.map(s => s.name.toLowerCase());

  const missing: MissingSkill[] = [];

  pathSkills.forEach((skill, index) => {
    if (!userSkillNames.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s))) {
      const importance: MissingSkill['importance'] = index < 3 ? 'critical' : index < 6 ? 'high' : index < 8 ? 'medium' : 'low';

      const learningTime = LEARNING_TIMES[skill] || '2-4 weeks';

      missing.push({
        name: skill,
        importance,
        learningTime,
        learningResources: [
          { title: `${skill} Documentation`, platform: 'Official' },
          { title: `${skill} Course`, platform: 'freeCodeCamp' },
          { title: `${skill} Tutorial`, platform: 'YouTube' },
        ],
        priority: 10 - index,
      });
    }
  });

  return missing.sort((a, b) => b.priority - a.priority);
}

function determineBestCareerPath(resumeData: ResumeData): CareerPathSkills {
  const skills = resumeData.skills.map(s => s.toLowerCase());
  const title = resumeData.professionalTitle.toLowerCase();

  let bestMatch = 'Full Stack Developer';
  let bestScore = 0;

  Object.entries(CAREER_PATHS_SKILLS).forEach(([path, data]) => {
    const matchCount = data.skills.filter(skill =>
      skills.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s))
    ).length;
    const matchPercentage = Math.round((matchCount / data.skills.length) * 100);

    let bonus = 0;
    if (title.includes(path.toLowerCase().split('/')[0])) bonus = 25;

    const totalScore = matchPercentage + bonus;
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMatch = path;
    }
  });

  return {
    path: bestMatch,
    matchPercentage: Math.min(bestScore, 100),
    topIndustrySkills: CAREER_PATHS_SKILLS[bestMatch]?.skills || [],
    averageSalary: CAREER_PATHS_SKILLS[bestMatch]?.salary || '$70,000 - $120,000',
  };
}

function calculateStrengthAreas(resumeData: ResumeData, technicalSkills: SkillInfo[]): StrengthArea[] {
  const areas: StrengthArea[] = [];

  // Frontend Development
  const frontendSkills = ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'sass'];
  const frontendScore = calculateAreaScore(technicalSkills, frontendSkills);
  areas.push({
    name: 'Frontend Development',
    score: frontendScore,
    level: getLevelFromScore(frontendScore),
    description: frontendScore >= 60 ? 'Strong foundation in UI/UX development' : 'Building frontend skills',
  });

  // Backend Development
  const backendSkills = ['node', 'python', 'java', 'sql', 'api', 'express', 'django', 'postgresql', 'mongodb'];
  const backendScore = calculateAreaScore(technicalSkills, backendSkills);
  areas.push({
    name: 'Backend Development',
    score: backendScore,
    level: getLevelFromScore(backendScore),
    description: backendScore >= 60 ? 'Solid backend and API development skills' : 'Developing server-side expertise',
  });

  // Problem Solving
  const problemSolvingScore = Math.min(
    (resumeData.projects.length * 15) + (resumeData.workExperience.length * 10) + 20,
    100
  );
  areas.push({
    name: 'Problem Solving',
    score: problemSolvingScore,
    level: getLevelFromScore(problemSolvingScore),
    description: problemSolvingScore >= 60 ? 'Demonstrated ability to tackle challenges' : 'Growing problem-solving abilities',
  });

  // Communication
  const communicationScore = Math.min(
    (resumeData.summary.length > 50 ? 30 : 15) +
    (resumeData.workExperience.length * 10) +
    20,
    80
  );
  areas.push({
    name: 'Communication',
    score: communicationScore,
    level: getLevelFromScore(communicationScore),
    description: communicationScore >= 60 ? 'Effective written communication' : 'Developing communication skills',
  });

  // Database Knowledge
  const dbSkills = ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'supabase'];
  const dbScore = calculateAreaScore(technicalSkills, dbSkills);
  areas.push({
    name: 'Database Knowledge',
    score: dbScore,
    level: getLevelFromScore(dbScore),
    description: dbScore >= 60 ? 'Proficient with data storage solutions' : 'Learning database technologies',
  });

  return areas;
}

function calculateAreaScore(skills: SkillInfo[], areaKeywords: string[]): number {
  let score = 0;
  skills.forEach(skill => {
    if (areaKeywords.some(keyword =>
      skill.name.toLowerCase().includes(keyword) || keyword.includes(skill.name.toLowerCase())
    )) {
      score += skill.proficiency * 0.2;
    }
  });
  return Math.min(Math.round(score), 100);
}

function getLevelFromScore(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (score >= 80) return 'expert';
  if (score >= 60) return 'advanced';
  if (score >= 40) return 'intermediate';
  return 'beginner';
}

function generateLearningRecommendations(missingSkills: MissingSkill[]): RecommendedLearning[] {
  return missingSkills.slice(0, 6).map((skill, index) => ({
    skill: skill.name,
    reason: skill.importance === 'critical'
      ? 'Essential for your career path'
      : skill.importance === 'high'
      ? 'Highly valued in the industry'
      : 'Will expand your skillset',
    estimatedTime: skill.learningTime,
    prerequisites: index === 0 ? [] : missingSkills.slice(0, index).map(s => s.name).filter(() => Math.random() > 0.5),
    order: index + 1,
  }));
}

function calculateOverallScore(
  technicalSkills: SkillInfo[],
  softSkills: SkillInfo[],
  strengthAreas: StrengthArea[]
): number {
  // Weight: technical skills (40%), soft skills (20%), strength areas (40%)
  const technicalAvg = technicalSkills.length > 0
    ? technicalSkills.reduce((sum, s) => sum + s.proficiency, 0) / technicalSkills.length
    : 0;

  const softAvg = softSkills.length > 0
    ? softSkills.reduce((sum, s) => sum + s.proficiency, 0) / softSkills.length
    : 0;

  const strengthAvg = strengthAreas.length > 0
    ? strengthAreas.reduce((sum, a) => sum + a.score, 0) / strengthAreas.length
    : 0;

  // Bonus for number of skills
  const countBonus = Math.min((technicalSkills.length + softSkills.length) * 2, 20);

  const score = Math.round(
    (technicalAvg * 0.4) +
    (softAvg * 0.2) +
    (strengthAvg * 0.4) +
    countBonus
  );

  return Math.min(score, 100);
}

function getScoreLabel(score: number): SkillsScoreLabel {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'average';
  return 'needs_improvement';
}

function getScoreLabelDisplay(label: SkillsScoreLabel): { text: string; color: string } {
  const labels = {
    excellent: { text: 'Excellent', color: 'text-green-400' },
    good: { text: 'Good', color: 'text-blue-400' },
    average: { text: 'Average', color: 'text-yellow-400' },
    needs_improvement: { text: 'Needs Improvement', color: 'text-red-400' },
  };
  return labels[label];
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function analyzeSkills(resumeData: ResumeData): SkillsAnalysis {
  // Analyze skills
  const technicalSkills = analyzeTechnicalSkills(resumeData);
  const softSkills = analyzeSoftSkills(resumeData);

  // Determine career path
  const careerPathSkills = determineBestCareerPath(resumeData);

  // Identify missing skills
  const missingSkills = identifyMissingSkills(technicalSkills, careerPathSkills.path);

  // Calculate strength areas
  const strengthAreas = calculateStrengthAreas(resumeData, technicalSkills);

  // Generate learning recommendations
  const recommendedLearning = generateLearningRecommendations(missingSkills);

  // Calculate overall score
  const overallScore = calculateOverallScore(technicalSkills, softSkills, strengthAreas);
  const scoreLabel = getScoreLabel(overallScore);

  // Calculate potential score (if missing skills were added)
  const potentialImprovement = missingSkills.slice(0, 3).reduce((sum, skill) => {
    return sum + (skill.importance === 'critical' ? 8 : skill.importance === 'high' ? 5 : 3);
  }, 0);
  const potentialScore = Math.min(overallScore + potentialImprovement, 100);

  return {
    totalSkills: technicalSkills.length + softSkills.length,
    technicalSkillsCount: technicalSkills.length,
    softSkillsCount: softSkills.length,
    technicalSkills,
    softSkills,
    missingSkills,
    careerPathSkills,
    strengthAreas,
    recommendedLearning,
    overallScore,
    scoreLabel,
    potentialScore,
  };
}

export function getSkillsScoreLabelInfo(label: SkillsScoreLabel): { text: string; color: string } {
  return getScoreLabelDisplay(label);
}
