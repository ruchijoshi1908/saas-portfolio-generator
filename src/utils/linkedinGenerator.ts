// LinkedIn Profile Generator for CareerLaunch AI
// Generates professional LinkedIn profile content from resume data

import { ResumeData } from './resumeTypes';

// ============================================================================
// LINKEDIN PROFILE TYPES
// ============================================================================

export interface LinkedInProfile {
  headline: string;
  about: string;
  experience: LinkedInExperience[];
  projects: LinkedInProject[];
  skills: {
    technical: string[];
    soft: string[];
  };
  education: LinkedInEducation[];
  certifications: LinkedInCertification[];
  keywords: string[];
  bannerText: string;
  connectionMessage: string;
}

export interface LinkedInExperience {
  title: string;
  company: string;
  dateRange: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface LinkedInProject {
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface LinkedInEducation {
  school: string;
  degree: string;
  field: string;
  dateRange: string;
  description: string;
}

export interface LinkedInCertification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  description: string;
}

export interface LinkedInStrengthScore {
  overallScore: number;
  headlineScore: number;
  aboutScore: number;
  experienceScore: number;
  skillsScore: number;
  educationScore: number;
  missingSections: string[];
  suggestions: string[];
}

// ============================================================================
// CONTENT GENERATION HELPERS
// ============================================================================

const actionVerbs = [
  'Developed', 'Implemented', 'Designed', 'Led', 'Built', 'Engineered', 'Architected',
  'Optimized', 'Streamlined', 'Transformed', 'Delivered', 'Created', 'Automated',
  'Spearheaded', 'Drove', 'Established', 'Improved', 'Reduced', 'Increased', 'Launched'
];

const impactPhrases = [
  'resulting in significant efficiency gains',
  'improving team productivity',
  'reducing operational costs',
  'enhancing user experience',
  'increasing customer satisfaction',
  'accelerating time-to-market',
  'driving business growth',
  'enabling scalable solutions'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================================
// GENERATION FUNCTIONS
// ============================================================================

function generateHeadline(resume: ResumeData): string {
  const title = resume.professionalTitle || 'Professional';

  const headlines = [
    `${title} | Delivering Impactful Solutions | ${resume.skills.slice(0, 2).join(' & ') || 'Innovator'}`,
    `${title} Driving Digital Transformation | ${resume.skills[0] || 'Tech'} Expert`,
    `${title} | Building the Future with ${resume.skills.slice(0, 2).join(', ') || 'Technology'}`,
    `${title} | Passionate About ${resume.skills[0] || 'Innovation'} & ${resume.skills[1] || 'Excellence'}`,
    `${resume.location ? `${resume.location} | ` : ''}${title} | ${resume.skills.slice(0, 3).join(' | ') || 'Problem Solver'}`,
  ];

  return headlines[Math.floor(Math.random() * headlines.length)];
}

function generateAbout(resume: ResumeData): string {
  const title = resume.professionalTitle || 'professional';
  const name = resume.fullName || 'I';
  const yearsExp = resume.workExperience.length > 0 ?
    `${resume.workExperience.length}+ years of` : 'extensive';

  const paragraphs: string[] = [];

  // Opening
  const openings = [
    `As a passionate ${title}, ${name} brings ${yearsExp} experience in delivering innovative solutions that drive business results. With expertise in ${resume.skills.slice(0, 3).join(', ') || 'technology'}, I thrive on tackling complex challenges and transforming ideas into impactful products.`,
    `${name} is a results-driven ${title} with a proven track record of ${yearsExp} excellence in the ${resume.skills[0] || 'technology'} space. Committed to continuous learning and innovation, I leverage my expertise in ${resume.skills.slice(0, 3).join(', ') || 'modern technologies'} to deliver solutions that exceed expectations.`,
  ];
  paragraphs.push(openings[Math.floor(Math.random() * openings.length)]);

  // Middle - experience/skills
  if (resume.workExperience.length > 0) {
    const expHighlight = resume.workExperience[0];
    const middle = `Throughout my career at organizations like ${expHighlight.company || 'leading companies'}, I've ${getRandomItem(actionVerbs).toLowerCase()} key initiatives that ${getRandomItem(impactPhrases)}. My approach combines technical excellence with strategic thinking, ensuring that every project delivers measurable value.`;
    paragraphs.push(middle);
  }

  // Skills highlight
  if (resume.skills.length > 0) {
    const skillsPara = `My technical toolkit includes ${resume.skills.slice(0, 5).join(', ')}, allowing me to architect and implement solutions across the full development lifecycle. I'm particularly passionate about ${resume.skills[0] || 'emerging technologies'} and their potential to transform industries.`;
    paragraphs.push(skillsPara);
  }

  // Closing
  const closings = [
    `I'm always open to connecting with fellow professionals and exploring new opportunities. Let's discuss how we can create impactful solutions together.`,
    `Feel free to reach out if you'd like to discuss ${resume.skills[0] || 'technology'}, potential collaborations, or the latest industry trends. I believe in the power of networking and knowledge sharing.`,
  ];
  paragraphs.push(closings[Math.floor(Math.random() * closings.length)]);

  return paragraphs.join('\n\n');
}

function generateExperienceDescriptions(resume: ResumeData): LinkedInExperience[] {
  return resume.workExperience.map((exp) => {
    const achievements = exp.highlights.length > 0 ? exp.highlights :
      generateDefaultAchievements(exp, resume.skills);

    const descriptions = [
      `${getRandomItem(actionVerbs)} comprehensive solutions as ${exp.title} at ${exp.company}, ${getRandomItem(impactPhrases)}. Led cross-functional initiatives and drove technical excellence across multiple projects.`,
      `Served as ${exp.title} at ${exp.company}, where I ${getRandomItem(actionVerbs).toLowerCase()} innovative solutions leveraging ${resume.skills.slice(0, 3).join(', ') || 'modern technologies'}. Collaborated with stakeholders to deliver impactful results.`,
    ];

    return {
      title: exp.title,
      company: exp.company,
      dateRange: `${exp.startDate} - ${exp.endDate}`,
      location: exp.location || resume.location,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      achievements: achievements.slice(0, 5),
    };
  });
}

function generateDefaultAchievements(_exp: any, skills: string[]): string[] {
  const techWord = skills[0] || 'technology';
  return [
    `${getRandomItem(actionVerbs)} ${techWord}-based solutions that improved team efficiency by 30%`,
    `Collaborated with cross-functional teams to deliver ${skills[1] || 'innovative'} projects on time`,
    `Implemented best practices for ${skills[0] || 'development'} workflows`,
    `Contributed to technical documentation and knowledge sharing initiatives`,
  ];
}

function generateProjectDescriptions(resume: ResumeData): LinkedInProject[] {
  const projects: LinkedInProject[] = resume.projects.map((project) => {
    const techList = project.technologies.length > 0 ? project.technologies : resume.skills.slice(0, 3);

    return {
      name: project.name,
      description: project.description || `A ${techList[0] || 'technology'} project showcasing expertise in ${techList.slice(0, 2).join(' and ')}. Implemented key features and delivered measurable results.`,
      technologies: techList,
      url: project.url || '',
    };
  });

  // If no projects, generate one based on skills
  if (projects.length === 0 && resume.skills.length > 0) {
    projects.push({
      name: 'Personal Portfolio Project',
      description: `Developed a comprehensive project showcasing ${resume.skills.slice(0, 3).join(', ')} skills. Focused on best practices, clean code, and maintainable architecture.`,
      technologies: resume.skills.slice(0, 5),
      url: resume.portfolioUrl || '',
    });
  }

  return projects;
}

function categorizeSkills(skills: string[], workExperienceLength: number): { technical: string[]; soft: string[] } {
  const technicalKeywords = [
    'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
    'node', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'mongodb', 'postgresql',
    'graphql', 'rest', 'html', 'css', 'figma', 'api', 'cloud', 'agile', 'scrum'
  ];

  const technical: string[] = [];
  const soft: string[] = [];

  skills.forEach(skill => {
    const isTechnical = technicalKeywords.some(keyword =>
      skill.toLowerCase().includes(keyword)
    );

    if (isTechnical) {
      technical.push(skill);
    } else {
      soft.push(skill);
    }
  });

  // Add relevant soft skills based on experience
  if (soft.length < 3 && workExperienceLength > 0) {
    soft.push('Leadership', 'Problem Solving', 'Team Collaboration');
  }
  if (soft.length < 5) {
    soft.push('Communication', 'Project Management');
  }

  return { technical, soft: [...new Set(soft)] };
}

function generateEducationSection(resume: ResumeData): LinkedInEducation[] {
  return resume.education.map(edu => {
    const description = `${edu.degree} in ${edu.field || 'relevant field'} with focus on academic excellence and practical application of skills.`;

    return {
      school: edu.institution,
      degree: edu.degree,
      field: edu.field,
      dateRange: `${edu.startDate} - ${edu.endDate}`,
      description,
    };
  });
}

function generateCertificationDescriptions(resume: ResumeData): LinkedInCertification[] {
  return resume.certifications.map(cert => ({
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date,
    credentialId: cert.credentialId || '',
    description: `Earned ${cert.name} certification, demonstrating expertise and commitment to professional development.`,
  }));
}

function generateKeywords(resume: ResumeData): string[] {
  const keywords = new Set<string>();

  // From skills
  resume.skills.forEach(skill => keywords.add(skill));

  // From titles
  if (resume.professionalTitle) {
    keywords.add(resume.professionalTitle);
    resume.professionalTitle.split(' ').forEach(word => {
      if (word.length > 3) keywords.add(word);
    });
  }

  // From technologies
  resume.projects.forEach(p => {
    p.technologies.forEach(t => keywords.add(t));
  });

  // Industry keywords
  const industryKeywords = ['Software Development', 'Engineering', 'Product Development',
    'Agile', 'Full Stack', 'Backend', 'Frontend', 'Cloud Computing', 'DevOps'];
  industryKeywords.forEach(k => keywords.add(k));

  return Array.from(keywords).slice(0, 20);
}

function generateBannerText(resume: ResumeData): string {
  const titles = [
    'Building Tomorrow\'s Solutions Today',
    'Innovate. Build. Deliver.',
    'Turning Ideas into Impact',
    'Engineering Excellence',
    'Creating Digital Experiences',
    'Tech Passionate | Solution Focused',
    'Where Innovation Meets Execution',
  ];

  if (resume.professionalTitle.toLowerCase().includes('engineer')) {
    return titles[Math.floor(Math.random() * titles.length)];
  }
  if (resume.professionalTitle.toLowerCase().includes('designer')) {
    return 'Designing Experiences | Creating Impact';
  }
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateConnectionMessage(resume: ResumeData): string {
  const title = resume.professionalTitle || 'professional';

  const messages = [
    `Hi [Name], I came across your profile and was impressed by your work. I'm a ${title} looking to expand my network. Let's connect and share insights!`,
    `Hello [Name], I'd love to connect with fellow professionals. I'm a ${title} with experience in ${resume.skills.slice(0, 2).join(' and ') || 'technology'}. Looking forward to exchanging ideas!`,
    `Hi [Name], connecting with like-minded professionals is always valuable. I work as a ${title} and would love to be part of your network.`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================================================
// STRENGTH SCORING
// ============================================================================

function calculateStrengthScore(profile: LinkedInProfile): LinkedInStrengthScore {
  let headlineScore = 0;
  let aboutScore = 0;
  let experienceScore = 0;
  let skillsScore = 0;
  let educationScore = 0;
  const missingSections: string[] = [];
  const suggestions: string[] = [];

  // Headline score
  if (profile.headline.length > 0) headlineScore += 30;
  if (profile.headline.includes('|')) headlineScore += 20;
  if (profile.headline.length > 50) headlineScore += 20;
  if (/[A-Z][a-z]+\s[A-Z][a-z]+/.test(profile.headline)) headlineScore += 30;
  if (headlineScore < 50) suggestions.push('Add more keywords and your value proposition to your headline');

  // About score
  if (profile.about.length > 100) aboutScore += 30;
  if (profile.about.length > 200) aboutScore += 20;
  if (profile.about.length > 300) aboutScore += 20;
  if (profile.about.includes('\n\n')) aboutScore += 30;
  if (aboutScore < 60) suggestions.push('Expand your About section to include achievements, skills, and career highlights');

  // Experience score
  experienceScore = Math.min(100, profile.experience.length * 30);
  if (experienceScore < 60) suggestions.push('Add detailed experience with achievements and quantifiable results');

  // Skills score
  const totalSkills = profile.skills.technical.length + profile.skills.soft.length;
  skillsScore = Math.min(100, totalSkills * 8);
  if (skillsScore < 60) suggestions.push('Add more relevant skills (aim for at least 10-15)');

  // Education score
  educationScore = Math.min(100, profile.education.length * 50);
  if (educationScore < 50) suggestions.push('Add your educational background');

  // Missing sections
  if (profile.experience.length === 0) missingSections.push('Work Experience');
  if (profile.education.length === 0) missingSections.push('Education');
  if (profile.skills.technical.length === 0) missingSections.push('Technical Skills');
  if (profile.skills.soft.length === 0) missingSections.push('Soft Skills');
  if (profile.certifications.length === 0) missingSections.push('Certifications (optional)');

  const overallScore = Math.round(
    (headlineScore * 0.2 + aboutScore * 0.25 + experienceScore * 0.25 + skillsScore * 0.2 + educationScore * 0.1)
  );

  return {
    overallScore,
    headlineScore,
    aboutScore,
    experienceScore,
    skillsScore,
    educationScore,
    missingSections,
    suggestions: suggestions.length > 0 ? suggestions : ['Your profile is well-optimized! Keep regularly updating your achievements'],
  };
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function generateLinkedInProfile(resume: ResumeData): {
  profile: LinkedInProfile;
  strengthScore: LinkedInStrengthScore;
} {
  const profile: LinkedInProfile = {
    headline: generateHeadline(resume),
    about: generateAbout(resume),
    experience: generateExperienceDescriptions(resume),
    projects: generateProjectDescriptions(resume),
    skills: categorizeSkills(resume.skills, resume.workExperience.length),
    education: generateEducationSection(resume),
    certifications: generateCertificationDescriptions(resume),
    keywords: generateKeywords(resume),
    bannerText: generateBannerText(resume),
    connectionMessage: generateConnectionMessage(resume),
  };

  const strengthScore = calculateStrengthScore(profile);

  return { profile, strengthScore };
}
