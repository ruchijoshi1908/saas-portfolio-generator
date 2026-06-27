// Resume Parser for CareerLaunch AI
// Extracts text from PDF resumes and parses into structured data

import * as pdfjsLib from 'pdfjs-dist';
import { ResumeData, emptyResumeData } from './resumeTypes';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.worker.min.js`;

// ============================================================================
// PDF TEXT EXTRACTION
// ============================================================================

/**
 * Extract raw text from a PDF file - preserving line structure
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Preserve line structure by tracking Y positions
    let lastY: number | null = null;
    let lineText = '';

    for (const item of textContent.items) {
      const textItem = item as { str: string; transform: number[] };
      const y = textItem.transform[5];

      if (lastY !== null && Math.abs(y - lastY) > 5) {
        // New line detected
        if (lineText.trim()) {
          fullText += lineText.trim() + '\n';
        }
        lineText = '';
      }

      lineText += textItem.str;
      lastY = y;
    }

    // Add last line of page
    if (lineText.trim()) {
      fullText += lineText.trim() + '\n';
    }

    fullText += '\n'; // Page separator
  }

  return fullText.trim();
}

// ============================================================================
// SECTION EXTRACTION HELPER
// ============================================================================

/**
 * Extract content of a specific section by looking for section headers
 */
function extractSection(text: string, sectionNames: string[]): string {
  const lines = text.split('\n');

  for (const sectionName of sectionNames) {
    // Case-insensitive section header match
    const sectionRegex = new RegExp(`^\\s*${sectionName.replace(/\s+/g, '\\s*')}\\s*:?$`, 'i');

    for (let i = 0; i < lines.length; i++) {
      if (sectionRegex.test(lines[i].trim())) {
        // Found section start - collect content until next section
        const nextSectionHeaders = [
          'summary', 'experience', 'education', 'skills', 'projects',
          'certifications', 'achievements', 'awards', 'publications',
          'languages', 'interests', 'objective', 'profile', 'about',
          'contact', 'references', 'work history', 'employment'
        ].filter(s => !sectionNames.map(n => n.toLowerCase()).includes(s));

        let sectionEnd = lines.length;

        for (let j = i + 1; j < lines.length; j++) {
          const line = lines[j].trim();
          if (!line) continue; // Skip empty lines

          // Check if this is a new section header
          for (const header of nextSectionHeaders) {
            const headerRegex = new RegExp(`^${header.replace(/\s+/g, '\\s*')}\\s*:?$`, 'i');
            if (headerRegex.test(line)) {
              sectionEnd = j;
              break;
            }
          }
          if (sectionEnd !== lines.length) break;
        }

        return lines.slice(i + 1, sectionEnd).join('\n').trim();
      }
    }
  }

  return '';
}

// ============================================================================
// INDIVIDUAL FIELD EXTRACTION
// ============================================================================

/**
 * Extract email - returns only the FIRST email found
 */
function extractEmail(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const match = text.match(emailRegex);
  return match ? match[0].trim() : '';
}

/**
 * Extract phone - returns only the FIRST phone found
 */
function extractPhone(text: string): string {
  const phonePatterns = [
    /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/,
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return '';
}

/**
 * Extract LinkedIn URL
 */
function extractLinkedInUrl(text: string): string {
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/i;
  const match = text.match(linkedinRegex);
  return match ? match[0].trim() : '';
}

/**
 * Extract GitHub URL
 */
function extractGitHubUrl(text: string): string {
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/i;
  const match = text.match(githubRegex);
  return match ? match[0].trim() : '';
}

/**
 * Extract portfolio URL (excluding social media)
 */
function extractPortfolioUrl(text: string): string {
  const urlRegex = /https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9-]*)?)/gi;
  const excludeDomains = ['linkedin.com', 'github.com', 'facebook.com', 'twitter.com', 'instagram.com', 'youtube.com'];

  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const domain = match[1]?.toLowerCase() || '';
    if (!excludeDomains.some(d => domain.includes(d))) {
      return match[0].trim();
    }
  }
  return '';
}

/**
 * Extract name from first few lines
 */
function extractName(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];

    // Skip contact info and common headers
    if (line.includes('@')) continue;
    if (line.toLowerCase().includes('linkedin.com')) continue;
    if (line.toLowerCase().includes('github.com')) continue;
    if (line.toLowerCase().startsWith('curriculum vitae')) continue;
    if (line.toLowerCase().startsWith('resume')) continue;
    if (line.length > 50) continue;

    // Check if it looks like a name (properly capitalized, no numbers)
    const words = line.split(/\s+/);
    if (words.length >= 1 && words.length <= 4) {
      const allProperCase = words.every(w => /^[A-Z][a-z-]+$/.test(w) || /^[A-Z]+$/.test(w));
      if (allProperCase) {
        return line;
      }
    }
  }

  // Fallback: return first non-contact line
  for (const line of lines) {
    if (!line.includes('@') && !line.includes('linkedin') && line.length < 50 && line.length > 2) {
      return line;
    }
  }

  return '';
}

/**
 * Extract location (City, State/Country pattern)
 */
function extractLocation(text: string): string {
  // Only search in first 20 lines (where contact info typically is)
  const headerText = text.split('\n').slice(0, 20).join('\n');

  // City, State abbreviation (e.g., "San Francisco, CA")
  const cityStatePattern = /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})\b/;
  let match = headerText.match(cityStatePattern);

  if (match) {
    const loc = match[1].trim();
    // Filter out false positives
    if (!loc.toLowerCase().includes('university') &&
        !loc.toLowerCase().includes('inc') &&
        loc.length < 30) {
      return loc;
    }
  }

  // City, State full name (e.g., "New York, New York")
  const cityStateFullPattern = /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-z]+)/;
  match = headerText.match(cityStateFullPattern);

  if (match) {
    const loc = match[1].trim();
    if (!loc.toLowerCase().includes('university') &&
        !loc.toLowerCase().includes('inc') &&
        loc.length < 35) {
      return loc;
    }
  }

  return '';
}

/**
 * Extract professional title
 */
function extractTitle(text: string): string {
  const titleKeywords = [
    'software engineer', 'software developer', 'full stack', 'fullstack',
    'frontend developer', 'frontend engineer', 'backend developer', 'backend engineer',
    'web developer', 'senior developer', 'junior developer', 'lead developer',
    'data scientist', 'data analyst', 'data engineer',
    'product manager', 'project manager', 'program manager',
    'ux designer', 'ui designer', 'ux/ui designer', 'product designer',
    'devops engineer', 'site reliability engineer', 'platform engineer',
    'mobile developer', 'ios developer', 'android developer',
    'machine learning engineer', 'ml engineer', 'ai engineer',
    'security engineer', 'cybersecurity', 'security analyst',
    'qa engineer', 'test engineer', 'quality assurance',
    'technical lead', 'engineering manager', 'architect', 'consultant'
  ];

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // Look in first 15 lines
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // Skip contact info
    if (line.includes('@') || line.includes('linkedin')) continue;

    // Check if line contains a title keyword
    for (const keyword of titleKeywords) {
      if (lineLower.includes(keyword)) {
        // Return the line, but trim it reasonably
        return line.length > 60 ? line.substring(0, 60) : line;
      }
    }
  }

  return '';
}

/**
 * Extract professional summary section ONLY
 */
function extractSummary(text: string): string {
  const summarySection = extractSection(text, [
    'summary', 'professional summary', 'profile', 'objective', 'about me'
  ]);

  if (summarySection) {
    // Return first paragraph, cleaned up
    const paragraphs = summarySection.split(/\n\n+/);
    if (paragraphs.length > 0) {
      return paragraphs[0].trim().substring(0, 500);
    }
    return summarySection.substring(0, 500);
  }

  return '';
}

/**
 * Extract skills as INDIVIDUAL items
 */
function extractSkills(text: string): string[] {
  const skills: string[] = [];

  // First try to find a Skills section
  const skillsSection = extractSection(text, [
    'skills', 'technical skills', 'technologies', 'competencies', 'expertise'
  ]);

  if (skillsSection) {
    // Split by common delimiters - commas, bullets, newlines
    const items = skillsSection
      .split(/[,\n•|]/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 40 && !s.includes(':'));

    for (const item of items) {
      const normalized = item.charAt(0).toUpperCase() + item.slice(1);
      if (!skills.some(s => s.toLowerCase() === normalized.toLowerCase())) {
        skills.push(normalized);
      }
    }
  }

  // If we found skills from a section, use those
  if (skills.length > 0) {
    return skills.slice(0, 20);
  }

  // Fallback: look for known skill keywords in text
  const knownSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust',
    'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'Sass',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'Next.js', 'Svelte', 'jQuery', 'Bootstrap', 'Tailwind', 'Redux', 'GraphQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
    'CI/CD', 'Terraform', 'Linux', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'Elasticsearch', 'Firebase', 'Figma', 'Jira', 'Agile', 'Scrum'
  ];

  for (const skill of knownSkills) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    }
  }

  return skills.slice(0, 15);
}

/**
 * Extract work experience entries
 */
function extractWorkExperience(text: string): ResumeData['workExperience'] {
  const experiences: ResumeData['workExperience'] = [];

  const expSection = extractSection(text, [
    'experience', 'work experience', 'professional experience', 'employment', 'work history'
  ]);

  if (!expSection) return experiences;

  // Date pattern: Month Year - Month Year or Month Year - Present
  const dateRangePattern = new RegExp(
    '((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?\\s*\\d{4})\\s*[-–—]+\\s*(Present|Current|Now|Today|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?\\s*\\d{4})',
    'gi'
  );

  const lines = expSection.split('\n').map(l => l.trim()).filter(l => l);
  let currentExp: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for date range to identify new job entry
    const dateMatch = line.match(dateRangePattern);

    if (dateMatch) {
      // Save previous experience
      if (currentExp && (currentExp.company || currentExp.title)) {
        experiences.push(currentExp);
      }

      const fullDateMatch = dateMatch[0];
      const startDate = dateMatch[1];
      const endDate = dateMatch[2];

      // Try to extract title and company
      let title = '';
      let company = '';

      // Text before date on same line
      const beforeDate = line.substring(0, line.indexOf(fullDateMatch)).trim();
      if (beforeDate) {
        // It might contain title or company
        const titleWords = ['engineer', 'developer', 'manager', 'designer', 'analyst', 'architect', 'consultant', 'lead', 'senior', 'junior'];
        const hasTitleWord = titleWords.some(w => beforeDate.toLowerCase().includes(w));

        if (hasTitleWord) {
          title = beforeDate.replace(/[|–—]/g, '').trim();
        } else {
          company = beforeDate.replace(/[|–—]/g, '').trim();
        }
      }

      // Check previous line for missing title/company
      if (i > 0) {
        const prevLine = lines[i - 1];
        if (!prevLine.match(dateRangePattern)) {
          const titleWords = ['engineer', 'developer', 'manager', 'designer', 'analyst', 'architect'];
          if (!title && titleWords.some(w => prevLine.toLowerCase().includes(w))) {
            title = prevLine;
          } else if (!company && prevLine.length < 50) {
            company = prevLine;
          }
        }
      }

      currentExp = {
        company,
        title,
        startDate,
        endDate,
        location: '',
        description: '',
        highlights: [],
      };
    } else if (currentExp) {
      // This line is content of the current job
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const highlight = line.replace(/^[•\-*]\s*/, '');
        if (highlight.length > 5) {
          currentExp.highlights.push(highlight);
        }
      } else if (!currentExp.title && /engineer|developer|manager|designer|analyst/i.test(line)) {
        currentExp.title = line;
      } else if (!currentExp.company && line.length < 50 && !line.startsWith('•')) {
        currentExp.company = line;
      }

      if (line.length > 20 && !currentExp.description) {
        currentExp.description = line;
      }
    }
  }

  // Save last experience
  if (currentExp && (currentExp.company || currentExp.title)) {
    experiences.push(currentExp);
  }

  return experiences.slice(0, 5);
}

/**
 * Extract education entries
 */
function extractEducation(text: string): ResumeData['education'] {
  const educationItems: ResumeData['education'] = [];

  const eduSection = extractSection(text, ['education', 'academic background']);

  if (!eduSection) return educationItems;

  const lines = eduSection.split('\n').map(l => l.trim()).filter(l => l);

  // Pattern for university names
  const uniPattern = /([A-Z][a-zA-Z\s&]+(?:University|College|Institute|School))/;
  // Pattern for degrees
  const degreePattern = /(Bachelor(?:'s)?|Master(?:'s)?|PhD|Doctorate|Associate|B\.S\.|B\.A\.|M\.S\.|M\.A\.|MBA|BSc|MSc)/i;
  // Pattern for years
  const yearPattern = /\b((?:19|20)\d{2})\b/g;

  let currentEdu: any = null;

  for (const line of lines) {
    const uniMatch = line.match(uniPattern);

    if (uniMatch) {
      // New education entry
      if (currentEdu && currentEdu.institution) {
        educationItems.push(currentEdu);
      }

      currentEdu = {
        institution: uniMatch[1].trim(),
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        location: '',
      };

      // Check rest of line for degree
      const remaining = line.replace(uniMatch[0], '');
      const degMatch = remaining.match(degreePattern);
      if (degMatch) {
        currentEdu.degree = degMatch[0];
      }

      // Check for year
      const yearMatch = remaining.match(yearPattern);
      if (yearMatch) {
        currentEdu.endDate = yearMatch[yearMatch.length - 1];
      }
    } else if (currentEdu) {
      // Additional info for current education
      if (!currentEdu.degree) {
        const degMatch = line.match(degreePattern);
        if (degMatch) {
          currentEdu.degree = degMatch[0];
          // Field of study
          const fieldPart = line.replace(degMatch[0], '').replace(/^(of|in)\s*/i, '').trim();
          if (fieldPart && fieldPart.length < 50) {
            currentEdu.field = fieldPart.split(/[,•]/)[0].trim();
          }
        }
      }

      // Check for year
      if (!currentEdu.endDate) {
        const yearMatch = line.match(yearPattern);
        if (yearMatch) {
          currentEdu.endDate = yearMatch[yearMatch.length - 1];
        }
      }
    }
  }

  // Save last education
  if (currentEdu && currentEdu.institution) {
    educationItems.push(currentEdu);
  }

  return educationItems.slice(0, 3);
}

/**
 * Extract projects
 */
function extractProjects(text: string): ResumeData['projects'] {
  const projects: ResumeData['projects'] = [];

  const projSection = extractSection(text, ['projects', 'personal projects', 'notable projects']);

  if (!projSection) return projects;

  const lines = projSection.split('\n').map(l => l.trim()).filter(l => l);

  let currentProject: any = null;

  for (const line of lines) {
    // Skip bullet lines - they'll be descriptions
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      if (currentProject) {
        const desc = line.replace(/^[•\-*]\s*/, '');
        if (desc.length > 5) {
          currentProject.description = (currentProject.description || '') + ' ' + desc;
        }
      }
      continue;
    }

    // New project starts with short line that's not a URL
    if (line.length < 60 && !line.startsWith('http')) {
      // Save previous project
      if (currentProject) {
        projects.push(currentProject);
      }

      currentProject = {
        name: line.replace(/[:|–—].*$/, '').trim(),
        description: '',
        technologies: [],
        url: '',
      };
    } else if (currentProject) {
      // Add description or URL
      if (line.includes('http') || line.includes('github.com')) {
        currentProject.url = line.split(/\s/)[0];
      } else if (line.length > 15) {
        currentProject.description = (currentProject.description || '') + ' ' + line;
      }
    }
  }

  // Save last project
  if (currentProject) {
    projects.push(currentProject);
  }

  return projects.slice(0, 5);
}

/**
 * Extract certifications
 */
function extractCertifications(text: string): ResumeData['certifications'] {
  const certifications: ResumeData['certifications'] = [];

  const certSection = extractSection(text, ['certifications', 'certificates', 'credentials']);

  if (!certSection) return certifications;

  const lines = certSection.split('\n').map(l => l.trim()).filter(l => l);

  for (const line of lines) {
    // Clean up bullet points
    const cleaned = line.replace(/^[•\-*]\s*/, '');

    if (cleaned.length > 2 && cleaned.length < 100) {
      // Split by delimiters to get name and possibly issuer
      const parts = cleaned.split(/[–—|]/).map(s => s.trim());

      certifications.push({
        name: parts[0] || cleaned,
        issuer: parts[1] || '',
        date: '',
        credentialId: '',
      });
    }
  }

  return certifications.slice(0, 5);
}

// ============================================================================
// MAIN PARSING FUNCTION
// ============================================================================

/**
 * Parse a resume PDF file and extract structured data
 */
export async function parseResume(file: File): Promise<ResumeData> {
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Currently only PDF files are supported. Please upload a PDF resume.');
  }

  // Validate file size
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit.');
  }

  let extractedText: string;

  try {
    // Extract text from PDF
    extractedText = await extractTextFromPDF(file);

    // LOG EXTRACTED TEXT
    console.log('================================================================================');
    console.log('EXTRACTED TEXT FROM PDF:');
    console.log('================================================================================');
    console.log(extractedText);
    console.log('================================================================================');

    if (!extractedText || extractedText.trim().length < 20) {
      throw new Error('Could not extract text from PDF. The file may be image-based or corrupted.');
    }
  } catch (error) {
    console.error('PDF extraction error:', error);
    if (error instanceof Error && error.message.includes('Could not extract')) {
      throw error;
    }
    throw new Error(`Failed to read PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    extractionConfidence: extractedText.length > 300 ? 'high' : extractedText.length > 100 ? 'medium' : 'low',
  };

  // LOG PARSED DATA
  console.log('================================================================================');
  console.log('PARSED RESUME DATA (JSON):');
  console.log('================================================================================');
  console.log(JSON.stringify(resumeData, null, 2));
  console.log('================================================================================');

  return resumeData;
}

export type { ResumeData };
