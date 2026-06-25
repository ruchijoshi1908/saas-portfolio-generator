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
}

export function resumeToPortfolioData(resume: ResumeData): PortfolioData {
  return {
    profileImage: null,
    name: resume.fullName,
    role: resume.professionalTitle,
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
  };
}
