// Mock AI Resume Parser for CareerLaunch AI
// Simulates AI parsing with sample data extraction
// Ready for future OpenAI integration

import { ResumeData, emptyResumeData } from './resumeTypes';

// ============================================================================
// MOCK AI EXTRACTION - SAMPLE DATA
// ============================================================================

// Sample professional profiles for simulating AI extraction
const sampleProfiles = [
  {
    fullName: 'Sarah Chen',
    professionalTitle: 'Senior Software Engineer',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    githubUrl: 'https://github.com/sarahchen',
    portfolioUrl: 'https://sarahchen.dev',
    summary: 'Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Led development of enterprise applications serving millions of users.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'Git', 'Agile'],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2018',
        gpa: '3.9',
        location: 'Stanford, CA',
      },
      {
        institution: 'UC Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2012',
        endDate: '2016',
        gpa: '3.7',
        location: 'Berkeley, CA',
      },
    ],
    workExperience: [
      {
        company: 'TechCorp Inc.',
        title: 'Senior Software Engineer',
        startDate: 'Jan 2021',
        endDate: 'Present',
        location: 'San Francisco, CA',
        description: 'Leading development of cloud-native applications.',
        highlights: [
          'Architected microservices platform handling 10M+ daily requests',
          'Led team of 5 engineers on critical payment processing system',
          'Reduced infrastructure costs by 40% through optimization',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
        ],
      },
      {
        company: 'StartupXYZ',
        title: 'Software Engineer',
        startDate: 'Jun 2018',
        endDate: 'Dec 2020',
        location: 'Mountain View, CA',
        description: 'Full-stack development for B2B SaaS platform.',
        highlights: [
          'Built real-time collaboration features used by 50K+ users',
          'Developed REST APIs serving 5M requests/day',
          'Improved application performance by 45%',
        ],
      },
    ],
    projects: [
      {
        name: 'CloudDev Platform',
        description: 'Developer productivity platform with real-time code collaboration, integrated CI/CD, and deployment management.',
        technologies: ['React', 'Node.js', 'WebSocket', 'Docker', 'AWS'],
        url: 'https://github.com/sarahchen/clouddev',
      },
      {
        name: 'DataFlow Analytics',
        description: 'Real-time data visualization dashboard for business intelligence with custom charting library.',
        technologies: ['TypeScript', 'D3.js', 'Python', 'PostgreSQL'],
        url: 'https://github.com/sarahchen/dataflow',
      },
      {
        name: 'TaskMaster Pro',
        description: 'AI-powered task management application with natural language processing for task creation.',
        technologies: ['React', 'OpenAI API', 'Firebase', 'Tailwind CSS'],
        url: 'https://taskmaster-pro.com',
      },
    ],
    certifications: [
      { name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: '2023', credentialId: 'AWS-SAP-12345' },
      { name: 'Google Cloud Professional Developer', issuer: 'Google Cloud', date: '2022', credentialId: 'GCP-PD-67890' },
    ],
    achievements: [
      { title: 'Hackathon Winner', description: 'First place at TechCrunch Disrupt 2022', date: '2022' },
      { title: 'Open Source Contributor', description: '500+ contributions to major open source projects', date: '2023' },
    ],
    languages: ['English', 'Mandarin Chinese', 'Spanish'],
  },
  {
    fullName: 'Marcus Johnson',
    professionalTitle: 'Full Stack Developer',
    email: 'marcus.j@email.com',
    phone: '+1 (555) 987-6543',
    location: 'Austin, TX',
    linkedinUrl: 'https://linkedin.com/in/marcusjohnson',
    githubUrl: 'https://github.com/marcusdev',
    portfolioUrl: 'https://marcusdev.io',
    summary: 'Full stack developer passionate about creating intuitive user experiences and robust backend systems. Experienced in building e-commerce platforms, fintech applications, and real-time systems.',
    skills: ['JavaScript', 'React', 'Vue.js', 'Python', 'Django', 'MongoDB', 'Redis', 'Kubernetes', 'Linux', 'SQL'],
    education: [
      {
        institution: 'UT Austin',
        degree: 'Bachelor of Science',
        field: 'Software Engineering',
        startDate: '2015',
        endDate: '2019',
        location: 'Austin, TX',
      },
    ],
    workExperience: [
      {
        company: 'FinanceTech LLC',
        title: 'Full Stack Developer',
        startDate: 'Mar 2021',
        endDate: 'Present',
        location: 'Austin, TX',
        description: 'Developing fintech applications for payment processing.',
        highlights: [
          'Built payment processing system handling $50M monthly transactions',
          'Implemented fraud detection algorithms reducing chargebacks by 30%',
          'Led migration from legacy system to modern stack',
        ],
      },
      {
        company: 'E-Commerce Solutions',
        title: 'Frontend Developer',
        startDate: 'Aug 2019',
        endDate: 'Feb 2021',
        location: 'Austin, TX',
        description: 'Frontend development for enterprise e-commerce platform.',
        highlights: [
          'Redesigned checkout flow increasing conversion by 25%',
          'Implemented A/B testing framework',
          'Optimized page load times from 4s to 1.2s',
        ],
      },
    ],
    projects: [
      {
        name: 'FinanceTracker',
        description: 'Personal finance management app with budgeting, investment tracking, and AI-powered spending insights.',
        technologies: ['React', 'Python', 'TensorFlow', 'PostgreSQL'],
        url: 'https://github.com/marcusdev/financetracker',
      },
      {
        name: 'CodeCollab',
        description: 'Real-time code collaboration platform with video chat and shared whiteboard functionality.',
        technologies: ['Vue.js', 'Node.js', 'WebRTC', 'Socket.io'],
        url: 'https://codecollab.io',
      },
    ],
    certifications: [
      { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2023', credentialId: 'CKA-11111' },
    ],
    achievements: [
      { title: 'Tech Speaker', description: 'Speaker at React Conf 2023 on state management', date: '2023' },
    ],
    languages: ['English', 'Portuguese'],
  },
  {
    fullName: 'Emily Rodriguez',
    professionalTitle: 'UX Engineer',
    email: 'emily.r@email.com',
    phone: '+1 (555) 456-7890',
    location: 'New York, NY',
    linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
    githubUrl: 'https://github.com/emilyux',
    portfolioUrl: 'https://emilyux.design',
    summary: 'UX Engineer bridging the gap between design and development. Passionate about creating accessible, performant, and beautiful digital experiences. Skilled in both design thinking and front-end development.',
    skills: ['Figma', 'React', 'CSS/SASS', 'Motion Design', 'User Research', 'Accessibility', 'Tailwind CSS', 'Framer', 'Storybook', 'Design Systems'],
    education: [
      {
        institution: 'Parsons School of Design',
        degree: 'Master of Fine Arts',
        field: 'Design and Technology',
        startDate: '2017',
        endDate: '2019',
        location: 'New York, NY',
      },
      {
        institution: 'NYU',
        degree: 'Bachelor of Arts',
        field: 'Interactive Media',
        startDate: '2013',
        endDate: '2017',
        location: 'New York, NY',
      },
    ],
    workExperience: [
      {
        company: 'DesignStudio Pro',
        title: 'Senior UX Engineer',
        startDate: 'Jun 2021',
        endDate: 'Present',
        location: 'New York, NY',
        description: 'Leading design system development and UX engineering.',
        highlights: [
          'Created design system used by 200+ designers and developers',
          'Improved accessibility scores to 98% Lighthouse rating',
          'Reduced design-to-code handoff time by 50%',
        ],
      },
      {
        company: 'Creative Agency',
        title: 'Frontend Developer',
        startDate: 'Jan 2019',
        endDate: 'May 2021',
        location: 'New York, NY',
        description: 'Frontend development for high-profile client projects.',
        highlights: [
          'Developed award-winning website for Fortune 500 client',
          'Implemented advanced animations and interactions',
          'Mentored junior developers on best practices',
        ],
      },
    ],
    projects: [
      {
        name: 'DesignTokens System',
        description: 'Comprehensive design tokens library with automatic code generation for multiple platforms.',
        technologies: ['Figma', 'Style Dictionary', 'JSON', 'TypeScript'],
        url: 'https://github.com/emilyux/designtokens',
      },
      {
        name: 'Accessible UI Kit',
        description: 'WCAG-compliant React component library with built-in accessibility features.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Testing Library'],
        url: 'https://accessible-ui.kit',
      },
    ],
    certifications: [
      { name: 'Certified UX Professional', issuer: 'UXQB', date: '2022', credentialId: 'CUXP-22222' },
    ],
    achievements: [
      { title: 'Awwwards Site of the Day', description: 'Won Site of the Day for portfolio website redesign', date: '2023' },
      { title: 'Design Systems Contributor', description: 'Contributed to major design system open source projects', date: '2022' },
    ],
    languages: ['English', 'Spanish'],
  },
];

// ============================================================================
// SIMULATED PARSING FUNCTIONS
// ============================================================================

/**
 * Simulates AI parsing of a resume file
 * In production, this would call OpenAI API or similar
 *
 * @param file - The uploaded file (simulated)
 * @returns Promise<ResumeData> - Extracted resume data
 */
export async function parseResume(file: File): Promise<ResumeData> {
  // Simulate network delay for parsing
  const parseDelay = 1500 + Math.random() * 1000;

  await new Promise(resolve => setTimeout(resolve, parseDelay));

  // Validate file type
  const validExtensions = ['.pdf', '.docx', '.doc'];
  const hasValidExtension = validExtensions.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!hasValidExtension) {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }

  // Validate file size
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit. Please upload a smaller file.');
  }

  // For now, return random sample profile
  // In production, this would send the file to an AI API
  const randomProfile = sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];

  // Determine confidence based on simulated extraction quality
  const confidence: 'high' | 'medium' | 'low' = Math.random() > 0.3 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';

  return {
    ...emptyResumeData,
    fullName: randomProfile.fullName,
    professionalTitle: randomProfile.professionalTitle,
    email: randomProfile.email,
    phone: randomProfile.phone,
    location: randomProfile.location,
    linkedinUrl: randomProfile.linkedinUrl,
    githubUrl: randomProfile.githubUrl,
    portfolioUrl: randomProfile.portfolioUrl,
    summary: randomProfile.summary,
    skills: randomProfile.skills,
    education: randomProfile.education,
    workExperience: randomProfile.workExperience,
    projects: randomProfile.projects,
    certifications: randomProfile.certifications,
    achievements: randomProfile.achievements,
    languages: randomProfile.languages,
    rawText: `[Simulated extracted text from ${file.name}]`,
    extractionConfidence: confidence,
  };
}

/**
 * Future: Integrate with OpenAI API for actual resume parsing
 *
 * Example integration:
 * async function parseResumeWithAI(file: File): Promise<ResumeData> {
 *   const formData = new FormData();
 *   formData.append('file', file);
 *
 *   const response = await fetch('/api/parse-resume', {
 *     method: 'POST',
 *     body: formData,
 *   });
 *
 *   return await response.json();
 * }
 */

// Export types for external use
export type { ResumeData };
