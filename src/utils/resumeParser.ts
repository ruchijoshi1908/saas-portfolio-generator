// Resume Parser for CareerLaunch AI
// Extracts text from PDF resumes and parses into structured data

import * as pdfjsLib from 'pdfjs-dist';
import { ResumeData, emptyResumeData } from './resumeTypes';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ============================================================================
// PDF TEXT EXTRACTION
// ============================================================================

/**
 * Extract raw text from a PDF file
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');

    fullText += pageText + '\n';
  }

  return fullText.trim();
}

// ============================================================================
// TEXT PARSING UTILITIES
// ============================================================================

/**
 * Extract email from text
 */
function extractEmail(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

/**
 * Extract phone number from text
 */
function extractPhone(text: string): string {
  const phonePatterns = [
    /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
    /\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return '';
}

/**
 * Extract LinkedIn URL from text
 */
function extractLinkedInUrl(text: string): string {
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/gi;
  const match = text.match(linkedinRegex);
  return match ? match[0] : '';
}

/**
 * Extract GitHub URL from text
 */
function extractGitHubUrl(text: string): string {
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/gi;
  const match = text.match(githubRegex);
  return match ? match[0] : '';
}

/**
 * Extract portfolio/website URL from text
 */
function extractPortfolioUrl(text: string): string {
  // Look for personal website URLs (exclude linkedin, github, facebook, twitter)
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
  const excludeDomains = ['linkedin.com', 'github.com', 'facebook.com', 'twitter.com', 'instagram.com'];

  const matches = text.match(urlRegex);
  if (matches) {
    for (const url of matches) {
      const domain = url.toLowerCase();
      if (!excludeDomains.some(d => domain.includes(d))) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
    }
  }
  return '';
}

/**
 * Extract name (usually first line or prominent text)
 */
function extractName(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // Name is often the first non-empty line, or line before contact info
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    // Check if line looks like a name (words, no numbers, reasonable length)
    if (line.length > 2 && line.length < 50 && /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(line)) {
      return line;
    }
  }

  // Fallback: first line if it's short enough
  if (lines.length > 0 && lines[0].length < 50) {
    return lines[0];
  }

  return '';
}

/**
 * Extract location/city from text
 */
function extractLocation(text: string): string {
  const locationPatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})/g,  // City, ST
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z][a-z]+)/g, // City, State
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Filter out common false positives like company locations in job descriptions
      const potentialLocation = match[0];
      if (!potentialLocation.toLowerCase().includes('university') &&
          !potentialLocation.toLowerCase().includes('inc') &&
          !potentialLocation.toLowerCase().includes('corp')) {
        return potentialLocation;
      }
    }
  }
  return '';
}

/**
 * Extract professional title/summary
 */
function extractTitle(text: string): string {
  const titleKeywords = [
    'software engineer', 'developer', 'frontend', 'backend', 'full stack',
    'designer', 'manager', 'analyst', 'engineer', 'architect', 'consultant',
    'specialist', 'lead', 'senior', 'junior', 'intern', 'director',
    'data scientist', 'product manager', 'project manager', 'devops',
    'ux', 'ui', 'mobile', 'web', 'qa', 'test', 'security'
  ];

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (line.length < 60 && titleKeywords.some(kw => lowerLine.includes(kw))) {
      // Likely a title line
      return line;
    }
  }

  return '';
}

/**
 * Extract skills from text
 */
function extractSkills(text: string): string[] {
  const skillKeywords = [
    // Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css',
    // Frameworks & Libraries
    'react', 'angular', 'vue', 'node.js', 'nodejs', 'express', 'django', 'flask',
    'spring', 'rails', 'asp.net', 'next.js', 'nextjs', 'svelte', 'jquery',
    'bootstrap', 'tailwind', 'sass', 'less', 'redux', 'mobx', 'graphql',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
    'gitlab', 'ci/cd', 'terraform', 'ansible', 'linux', 'unix', 'bash',
    // Databases
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'firebase',
    'supabase', 'oracle', 'sqlite', 'dynamodb', 'cassandra',
    // Tools
    'figma', 'sketch', 'photoshop', 'illustrator', 'xd', 'vs code', 'vim',
    'intellij', 'eclipse', 'jira', 'confluence', 'slack', 'notion',
    // Concepts
    'agile', 'scrum', 'rest api', 'microservices', 'machine learning', 'ai',
    'testing', 'tdd', 'bdd', 'oop', 'functional programming',
  ];

  const lowerText = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of skillKeywords) {
    if (lowerText.includes(skill.toLowerCase())) {
      // Capitalize properly
      const capitalized = skill.charAt(0).toUpperCase() + skill.slice(1);
      if (!foundSkills.includes(capitalized)) {
        foundSkills.push(capitalized);
      }
    }
  }

  // Also look for "Skills:" section and extract from there
  const skillsSectionMatch = text.match(/skills?:?\s*[\n:]\s*([\s\S]*?)(?=\n\n|\n[a-z]+:|$)/i);
  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[1];
    // Split by common delimiters
    const items = skillsText.split(/[,•|]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
    for (const item of items) {
      if (!foundSkills.some(s => s.toLowerCase() === item.toLowerCase())) {
        foundSkills.push(item);
      }
    }
  }

  return foundSkills.slice(0, 15); // Limit to 15 skills
}

/**
 * Extract work experience
 */
function extractWorkExperience(text: string): ResumeData['workExperience'] {
  const experiences: ResumeData['workExperience'] = [];

  // Look for experience section
  const expSectionMatch = text.match(/(?:work\s*)?experience:?\s*[\n]([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications?|achievements?|$))/i);

  const expText = expSectionMatch ? expSectionMatch[1] : text;

  // Look for date patterns and extract around them
  const datePattern = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})\s*[\|\–—-]*\s*(?:Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})/gi;

  const lines = expText.split('\n');
  let currentExp: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if line contains a date pattern (likely a job)
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      // Save previous experience
      if (currentExp && currentExp.company) {
        experiences.push(currentExp);
      }

      // Start new experience
      const dateStr = dateMatch[0];
      const dateParts = dateStr.split(/[\|\–—-]/).map(s => s.trim());

      // Try to extract company and title from lines before/around date
      let companyLine = '';
      let titleLine = '';

      // Look at current line and previous lines
      const contextLine = i > 0 ? lines[i-1].trim() : '';
      if (contextLine && !contextLine.match(datePattern)) {
        // Check if it's a title or company
        if (/engineer|developer|manager|designer|analyst|architect/i.test(contextLine)) {
          titleLine = contextLine;
          companyLine = i > 1 ? lines[i-2].trim() : '';
        } else {
          companyLine = contextLine;
        }
      }

      currentExp = {
        company: companyLine || '',
        title: titleLine || line.replace(dateStr, '').replace(/[\|\–—-]/g, '').trim(),
        startDate: dateParts[0] || '',
        endDate: dateParts[1] || dateParts[0] || '',
        location: '',
        description: '',
        highlights: [],
      };
    } else if (currentExp) {
      // Add description/highlights
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        currentExp.highlights.push(line.replace(/^[•\-*]\s*/, ''));
      } else if (line.length > 10 && !currentExp.description) {
        currentExp.description = line;
      }
    }
  }

  // Save last experience
  if (currentExp && currentExp.company) {
    experiences.push(currentExp);
  }

  return experiences.slice(0, 5); // Limit to 5 experiences
}

/**
 * Extract education
 */
function extractEducation(text: string): ResumeData['education'] {
  const educationItems: ResumeData['education'] = [];

  // Look for education section
  const eduPattern = /education:?\s*[\n]([\s\S]*?)(?=\n\s*(?:experience|skills|projects|certifications?|achievements?|$))/i;
  const eduMatch = text.match(eduPattern);

  if (!eduMatch) return educationItems;

  const eduText = eduMatch[1];

  // Look for university/college names and degrees
  const universityPattern = /([A-Z][a-zA-Z\s&]+(?:University|College|Institute|School))\s*[\n,]?\s*([^\n]*)/g;

  let match;
  while ((match = universityPattern.exec(eduText)) !== null) {
    const institution = match[1].trim();
    const degreeInfo = match[2].trim();

    // Extract degree type
    const degreeTypes = ['Bachelor', 'Master', 'PhD', 'Doctor', 'Associate', 'B.S.', 'B.A.', 'M.S.', 'M.A.', 'MBA'];
    let degree = '';
    for (const dt of degreeTypes) {
      if (degreeInfo.toLowerCase().includes(dt.toLowerCase())) {
        degree = dt;
        break;
      }
    }

    // Extract year
    const yearMatch = degreeInfo.match(/\b(19|20)\d{2}\b/);
    const years = yearMatch ? yearMatch[0] : '';

    educationItems.push({
      institution,
      degree: degree || degreeInfo.split(',')[0] || '',
      field: degreeInfo.replace(/^(Bachelor|Master|PhD|Doctor|Associate|B\.S\.|B\.A\.|M\.S\.|M\.A\.|MBA)\s*(of\s*)?(Science|Arts|Engineering|Business|Technology)?\s*(in\s*)?/i, '').split(',')[0].trim(),
      startDate: years ? String(parseInt(years) - 4) : '',
      endDate: years || '',
      gpa: '',
      location: '',
    });
  }

  return educationItems.slice(0, 3); // Limit to 3 education entries
}

/**
 * Extract projects
 */
function extractProjects(text: string): ResumeData['projects'] {
  const projects: ResumeData['projects'] = [];

  // Look for projects section
  const projectPattern = /projects?:?\s*[\n]([\s\S]*?)(?=\n\s*(?:experience|education|skills|certifications?|achievements?|$))/i;
  const projectMatch = text.match(projectPattern);

  if (!projectMatch) return projects;

  const projText = projectMatch[1];
  const lines = projText.split('\n').map(l => l.trim()).filter(l => l);

  let currentProject: any = null;

  for (const line of lines) {
    // Skip bullet points that are part of descriptions
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      if (currentProject) {
        currentProject.description += ' ' + line.replace(/^[•\-*]\s*/, '');
      }
      continue;
    }

    // New project likely starts with a name/title
    if (line.length < 60 && !line.startsWith('http')) {
      // Save previous project
      if (currentProject) {
        projects.push(currentProject);
      }

      currentProject = {
        name: line.replace(/[:|\–—-].*$/, '').trim(),
        description: '',
        technologies: [],
        url: '',
      };

      // Check for tech stack mentions in the line
      const techKeywords = ['React', 'Vue', 'Angular', 'Node', 'Python', 'Java', 'TypeScript', 'JavaScript', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'];
      for (const tech of techKeywords) {
        if (line.toLowerCase().includes(tech.toLowerCase())) {
          currentProject.technologies.push(tech);
        }
      }
    } else if (currentProject) {
      // Description or URL
      if (line.includes('http') || line.includes('github.com')) {
        currentProject.url = line;
      } else if (line.length > 20) {
        currentProject.description = line;
      }
    }
  }

  // Save last project
  if (currentProject) {
    projects.push(currentProject);
  }

  return projects.slice(0, 5); // Limit to 5 projects
}

/**
 * Extract certifications
 */
function extractCertifications(text: string): ResumeData['certifications'] {
  const certifications: ResumeData['certifications'] = [];

  // Look for certifications section
  const certPattern = /certifications?:?\s*[\n]([\s\S]*?)(?=\n\s*(?:experience|education|skills|projects|achievements?|$))/i;
  const certMatch = text.match(certPattern);

  if (!certMatch) return certifications;

  const certText = certMatch[1];
  const lines = certText.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    // Skip empty or bullet-only lines
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      const certName = line.replace(/^[•\-*]\s*/, '');
      if (certName.length > 2) {
        certifications.push({
          name: certName.split(/[–—-]/)[0].trim(),
          issuer: '',
          date: '',
          credentialId: '',
        });
      }
    } else if (line.length > 3 && line.length < 100) {
      certifications.push({
        name: line.split(/[–—-]/)[0].trim(),
        issuer: '',
        date: '',
        credentialId: '',
      });
    }
  }

  return certifications.slice(0, 5); // Limit to 5 certifications
}

/**
 * Extract summary/objective
 */
function extractSummary(text: string): string {
  // Look for summary/objective section
  const summaryPattern = /(?:summary|objective|profile|about):?\s*[\n]([\s\S]*?)(?=\n\s*(?:experience|education|skills|projects))/i;
  const match = text.match(summaryPattern);

  if (match) {
    return match[1].trim().substring(0, 500); // Limit to 500 chars
  }

  // Fallback: first substantial paragraph
  const paragraphs = text.split('\n\n').filter(p => p.length > 50);
  if (paragraphs.length > 0) {
    return paragraphs[0].trim().substring(0, 500);
  }

  return '';
}

// ============================================================================
// MAIN PARSING FUNCTION
// ============================================================================

/**
 * Parse a resume file and extract structured data
 *
 * @param file - The uploaded resume file (PDF or DOCX)
 * @returns Promise<ResumeData> - Extracted resume data
 */
export async function parseResume(file: File): Promise<ResumeData> {
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

  // Only support PDF for now (DOCX requires additional library)
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Currently only PDF files are supported. Please upload a PDF resume.');
  }

  let extractedText: string;

  try {
    // Extract text from PDF
    extractedText = await extractTextFromPDF(file);

    // LOG THE EXTRACTED TEXT TO CONSOLE FOR VERIFICATION
    console.log('='.repeat(80));
    console.log('EXTRACTED RESUME TEXT:');
    console.log('='.repeat(80));
    console.log(extractedText);
    console.log('='.repeat(80));

    if (!extractedText || extractedText.trim().length < 20) {
      throw new Error('Could not extract text from PDF. The PDF may be image-based or corrupted.');
    }

  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to read PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the PDF is text-based and not password protected.`);
  }

  // Parse extracted text into structured data
  const resumeData: ResumeData = {
    ...emptyResumeData,
    fullName: extractName(extractedText),
    professionalTitle: extractTitle(extractedText),
    email: extractEmail(extractedText),
    phone: extractPhone(extractedText),
    location: extractLocation(extractedText),
    linkedinUrl: extractLinkedInUrl(extractedText),
    githubUrl: extractGitHubUrl(extractedText),
    portfolioUrl: extractPortfolioUrl(extractedText),
    summary: extractSummary(extractedText),
    skills: extractSkills(extractedText),
    education: extractEducation(extractedText),
    workExperience: extractWorkExperience(extractedText),
    projects: extractProjects(extractedText),
    certifications: extractCertifications(extractedText),
    achievements: [],
    languages: [],
    rawText: extractedText,
    extractionConfidence: extractedText.length > 500 ? 'high' : extractedText.length > 200 ? 'medium' : 'low',
  };

  // LOG PARSED DATA FOR VERIFICATION
  console.log('='.repeat(80));
  console.log('PARSED RESUME DATA:');
  console.log('='.repeat(80));
  console.log(JSON.stringify(resumeData, null, 2));
  console.log('='.repeat(80));

  return resumeData;
}

// Export types for external use
export type { ResumeData };
