// Resume data types for CareerLaunch AI

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  location?: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface Achievement {
  title: string;
  description: string;
  date?: string;
}

export interface ResumeData {
  // Personal Info
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;

  // Summary
  summary: string;

  // Skills
  skills: string[];

  // Sections
  education: Education[];
  workExperience: WorkExperience[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
  certifications: Certification[];
  achievements: Achievement[];

  // Languages
  languages: string[];

  // Metadata
  rawText: string;
  extractionConfidence: 'high' | 'medium' | 'low';
}

export const emptyResumeData: ResumeData = {
  fullName: '',
  professionalTitle: '',
  email: '',
  phone: '',
  location: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  summary: '',
  skills: [],
  education: [],
  workExperience: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  rawText: '',
  extractionConfidence: 'low',
};

export const emptyEducation: Education = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
  location: '',
};

export const emptyWorkExperience: WorkExperience = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  location: '',
  description: '',
  highlights: [],
};

// Convert ResumeData to PortfolioData format
export interface PortfolioData {
  profileImage: string | null;
  name: string;
  role: string;
  about: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    tech: string[];
    url: string;
    image?: string;
  }[];
  github: string;
  linkedin: string;
  email: string;
  phone: string;
  location: string;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
}

/**
 * Infers a professional title from resume data when not explicitly provided
 */
export function inferProfessionalTitle(resume: ResumeData): string {
  // 1. Use explicit professional title if available
  if (resume.professionalTitle?.trim()) {
    return resume.professionalTitle.trim();
  }

  // 2. Check most recent work experience
  if (resume.workExperience.length > 0) {
    const recentJob = resume.workExperience[0];
    if (recentJob.title?.trim()) {
      return recentJob.title.trim();
    }
  }

  // 3. Infer from education, skills, and projects
  const skillsLower = resume.skills.map(s => s.toLowerCase());
  const allText = [
    resume.education.map(e => `${e.degree} ${e.field}`).join(' '),
    resume.skills.join(' '),
    resume.projects.map(p => `${p.name} ${p.description} ${p.technologies.join(' ')}`).join(' '),
  ].join(' ').toLowerCase();

  // Detect area of expertise
  const isDataRelated = skillsLower.some(s =>
    ['python', 'r', 'sql', 'pandas', 'numpy', 'scikit', 'tensorflow', 'pytorch', 'machine learning', 'data analysis', 'data science', 'tableau', 'power bi'].some(t => s.includes(t))
  ) || /data\s*(analyst|scientist|engineer)|machine\s*learning|analytics/.test(allText);

  const isFrontend = skillsLower.some(s =>
    ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'tailwind', 'frontend', 'next.js', 'svelte'].some(t => s.includes(t))
  ) || /frontend|web\s*developer|ui|ux/.test(allText);

  const isBackend = skillsLower.some(s =>
    ['node', 'express', 'django', 'flask', 'spring', 'java', 'golang', 'rust', 'api', 'postgresql', 'mongodb', 'aws', 'docker', 'kubernetes'].some(t => s.includes(t))
  ) || /backend|server|api|microservice/.test(allText);

  const isFullStack = isFrontend && isBackend;

  const isMobile = skillsLower.some(s =>
    ['react native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'mobile'].some(t => s.includes(t))
  ) || /mobile\s*developer|app\s*developer/.test(allText);

  const isDevOps = skillsLower.some(s =>
    ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'terraform', 'ansible', 'devops'].some(t => s.includes(t))
  ) || /devops|sre|infrastructure/.test(allText);

  // Check if student
  const isStudent = resume.education.some(e => {
    const endDate = e.endDate?.toLowerCase() || '';
    const currentYear = new Date().getFullYear();
    return endDate.includes('present') ||
           endDate.includes('expected') ||
           (endDate && parseInt(endDate.match(/\d{4}/)?.[0] || '0') >= currentYear);
  });

  // Generate title
  if (isStudent) {
    const field = resume.education[0]?.field || '';
    const degree = resume.education[0]?.degree?.toLowerCase() || '';

    if (field.toLowerCase().includes('computer science') || field.toLowerCase().includes('software')) {
      if (isFullStack) return 'Aspiring Full Stack Developer';
      if (isFrontend) return 'Aspiring Frontend Developer';
      if (isBackend) return 'Aspiring Backend Developer';
      if (isDataRelated) return 'Aspiring Data Analyst';
      if (isMobile) return 'Aspiring Mobile Developer';
      if (isDevOps) return 'Aspiring DevOps Engineer';
      return 'Computer Science Student';
    }

    if (field.toLowerCase().includes('data') || isDataRelated) {
      return 'Data Science Student';
    }

    if (field.toLowerCase().includes('information') || field.toLowerCase().includes('it')) {
      return 'Information Technology Student';
    }

    if (isFullStack) return 'Aspiring Full Stack Developer';
    if (isFrontend) return 'Aspiring Frontend Developer';
    if (isBackend) return 'Aspiring Backend Developer';
    if (isDataRelated) return 'Aspiring Data Analyst';
    if (isMobile) return 'Aspiring Mobile Developer';
    if (isDevOps) return 'Aspiring DevOps Engineer';

    if (field) return `${field} Student`;
    if (degree.includes('bachelor')) return 'Undergraduate Student';
    if (degree.includes('master')) return 'Graduate Student';
    if (degree.includes('phd') || degree.includes('doctor')) return 'PhD Candidate';

    return 'Aspiring Software Developer';
  }

  // Not a student - generate professional title
  if (isFullStack) return 'Full Stack Developer';
  if (isFrontend) return 'Frontend Developer';
  if (isBackend) return 'Backend Developer';
  if (isDataRelated) return 'Data Analyst';
  if (isMobile) return 'Mobile Developer';
  if (isDevOps) return 'DevOps Engineer';

  // Generic fallback
  if (resume.skills.length > 0) return 'Software Developer';
  return 'Professional';
}

export function resumeToPortfolioData(resume: ResumeData): PortfolioData {
  return {
    profileImage: null,
    name: resume.fullName,
    role: inferProfessionalTitle(resume),
    about: resume.summary,
    skills: resume.skills,
    projects: resume.projects.map(p => ({
      title: p.name,
      description: p.description,
      tech: p.technologies,
      url: p.url || '',
    })),
    github: resume.githubUrl,
    linkedin: resume.linkedinUrl,
    email: resume.email,
    phone: resume.phone,
    location: resume.location,
    workExperience: resume.workExperience,
    education: resume.education,
    certifications: resume.certifications,
    achievements: resume.achievements,
  };
}
