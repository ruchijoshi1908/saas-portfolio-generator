import { useState, useRef, useEffect } from 'react';
import {
  User,
  Code2,
  FolderKanban,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowLeft,
  Rocket,
  Target,
  CheckCircle2,
  Download,

  Trophy,
  Clock,
  Award,
  Map,
  GraduationCap,
  Briefcase,
  Sparkles,
  ChevronDown,
  Image,
  Printer,
  FileText,
  Link2,
  Copy,
  Check,
  Eye,
  Share2,
  X,
} from 'lucide-react';
import type { PortfolioData } from '../utils/resumeTypes';

// ============================================================================
// INFERENCE HELPER
// ============================================================================

const inferTitleFromPortfolio = (data: PortfolioData): string => {
  if (data.role?.trim()) return data.role.trim();

  if (data.workExperience?.length > 0 && data.workExperience[0].title?.trim()) {
    return data.workExperience[0].title.trim();
  }

  const skillsLower = data.skills.map(s => s.toLowerCase());
  const projectsText = data.projects.map(p => `${p.title} ${p.description} ${p.tech.join(' ')}`).join(' ').toLowerCase();

  const isStudent = data.education?.some(e => {
    const endDate = e.endDate?.toLowerCase() || '';
    return endDate.includes('present') || endDate.includes('expected') || endDate.includes('candidate');
  }) || false;

  const isDataRelated = skillsLower.some(s =>
    ['python', 'r', 'sql', 'pandas', 'numpy', 'machine learning', 'data analysis', 'data science', 'tableau', 'power bi', 'analytics'].some(t => s.includes(t))
  ) || /data\s*(analyst|scientist|engineer)|machine\s*learning|analytics/.test(projectsText);

  const isFrontend = skillsLower.some(s =>
    ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'tailwind', 'frontend', 'next.js', 'svelte'].some(t => s.includes(t))
  ) || /frontend|web\s*developer|ui|ux/.test(projectsText);

  const isBackend = skillsLower.some(s =>
    ['node', 'express', 'django', 'flask', 'spring', 'java', 'golang', 'api', 'postgresql', 'mongodb', 'aws', 'docker', 'kubernetes'].some(t => s.includes(t))
  ) || /backend|server|api|microservice/.test(projectsText);

  const isFullStack = isFrontend && isBackend;

  const isMobile = skillsLower.some(s =>
    ['react native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'mobile'].some(t => s.includes(t))
  ) || /mobile\s*developer|app\s*developer/.test(projectsText);

  const isDevOps = skillsLower.some(s =>
    ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'terraform', 'devops'].some(t => s.includes(t))
  ) || /devops|sre|infrastructure/.test(projectsText);

  const isDesign = skillsLower.some(s =>
    ['figma', 'sketch', 'adobe xd', 'ui design', 'ux design', 'product design', 'graphic design'].some(t => s.includes(t))
  ) || /design|ui|ux/.test(projectsText);

  if (isStudent) {
    const field = data.education?.[0]?.field?.toLowerCase() || '';
    if (field.includes('computer science') || field.includes('software')) {
      if (isFullStack) return 'Aspiring Full Stack Developer';
      if (isFrontend) return 'Aspiring Frontend Developer';
      if (isBackend) return 'Aspiring Backend Developer';
      if (isDataRelated) return 'Aspiring Data Analyst';
      return 'Computer Science Student';
    }
    if (field.includes('data')) return 'Data Science Student';
    if (field.includes('information') || field.includes('it')) return 'Information Technology Student';
    if (isFullStack) return 'Aspiring Full Stack Developer';
    if (isFrontend) return 'Aspiring Frontend Developer';
    if (data.skills.length > 0) return 'Aspiring Software Developer';
    return 'Student';
  }

  if (isFullStack) return 'Full Stack Developer';
  if (isFrontend) return 'Frontend Developer';
  if (isBackend) return 'Backend Developer';
  if (isDataRelated) return 'Data Analyst';
  if (isMobile) return 'Mobile Developer';
  if (isDevOps) return 'DevOps Engineer';
  if (isDesign) return 'Product Designer';

  if (data.skills.length > 0) return 'Software Developer';
  return 'Professional';
};

// ============================================================================
// EXPORT DROPDOWN
// ============================================================================

const ExportDropdown = ({ portfolioData }: { portfolioData: PortfolioData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadPDF = async () => {
    setExporting('pdf');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('portfolio-content');
      if (!element) return;

      element.classList.add('exporting');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });

      element.classList.remove('exporting');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = portfolioData.name?.replace(/\s+/g, '_') || 'Portfolio';
      pdf.save(`${fileName}_Portfolio.pdf`);

      setSuccess('PDF downloaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('PDF export failed:', error);
      window.print();
    }
    setExporting(null);
    setIsOpen(false);
  };

  const downloadPNG = async () => {
    setExporting('png');
    try {
      const html2canvas = (await import('html2canvas')).default;

      const element = document.getElementById('portfolio-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });

      const link = document.createElement('a');
      const fileName = portfolioData.name?.replace(/\s+/g, '_') || 'Portfolio';
      link.download = `${fileName}_Portfolio.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setSuccess('PNG downloaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('PNG export failed:', error);
    }
    setExporting(null);
    setIsOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {success && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm whitespace-nowrap animate-scale-in z-50">
          <CheckCircle2 className="w-4 h-4 inline mr-2" />
          {success}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-neutral-950 font-medium text-sm hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className="w-3 h-3 hidden sm:inline" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-neutral-700 overflow-hidden shadow-xl z-50 animate-scale-in">
          <button
            onClick={downloadPDF}
            disabled={exporting !== null}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-200 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-primary-400" />
            <span>{exporting === 'pdf' ? 'Generating...' : 'Download PDF'}</span>
          </button>
          <button
            onClick={downloadPNG}
            disabled={exporting !== null}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-200 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <Image className="w-4 h-4 text-accent-400" />
            <span>{exporting === 'png' ? 'Generating...' : 'Download PNG'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-200 hover:bg-white/5 transition-colors border-t border-neutral-700"
          >
            <Printer className="w-4 h-4 text-neutral-400" />
            <span>Print Portfolio</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SHARE PORTFOLIO SECTION
// ============================================================================

interface SharePortfolioProps {
  shareUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const SharePortfolio = ({ shareUrl, isOpen, onClose }: SharePortfolioProps) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select the input text
      inputRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const openPortfolio = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = () => {
    const name = encodeURIComponent('Check out my professional portfolio');
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${name}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const downloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('portfolio-content');
      if (!element) return;

      element.classList.add('exporting');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });
      element.classList.remove('exporting');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('My_Portfolio.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      window.print();
    }
  };

  const downloadPNG = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('portfolio-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = 'My_Portfolio.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg card-premium p-6 sm:p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg glass flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Success message */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Your portfolio is live! 🎉</span>
          </div>
          <p className="text-neutral-400 text-sm sm:text-base">
            Anyone with this link can view your portfolio.
          </p>
        </div>

        {/* URL input + copy */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => e.currentTarget.select()}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-neutral-900/60 border border-neutral-700 text-neutral-200 text-sm font-mono truncate focus:outline-none focus:border-primary-500/40 transition-colors"
            />
          </div>
          <button
            onClick={copyLink}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              copied
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:opacity-90'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Sharing options */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={openPortfolio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-neutral-700 hover:border-primary-500/30 text-neutral-200 hover:text-white text-sm font-medium transition-all"
          >
            <Eye className="w-4 h-4 text-primary-400" />
            Open Portfolio
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-neutral-700 hover:border-primary-500/30 text-neutral-200 hover:text-white text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4 text-primary-400" />
            Download PDF
          </button>
          <button
            onClick={downloadPNG}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-neutral-700 hover:border-primary-500/30 text-neutral-200 hover:text-white text-sm font-medium transition-all"
          >
            <Image className="w-4 h-4 text-primary-400" />
            Download PNG
          </button>
          <button
            onClick={shareToLinkedIn}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-neutral-700 hover:border-accent-500/30 text-neutral-200 hover:text-white text-sm font-medium transition-all"
          >
            <Linkedin className="w-4 h-4 text-accent-400" />
            Share to LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PORTFOLIO VIEW
// ============================================================================

export interface PortfolioViewProps {
  portfolioData: PortfolioData;
  onEdit?: () => void;
  onViewScore?: () => void;
  onBackToDashboard?: () => void;
  /** When provided, shows the Share Portfolio section with this URL */
  shareUrl?: string;
  /** When true, hides edit/nav controls (public view) */
  isPublic?: boolean;
}

export default function PortfolioView({
  portfolioData,
  onEdit,
  onViewScore,
  onBackToDashboard,
  shareUrl,
  isPublic: _isPublic,
}: PortfolioViewProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const displayRole = inferTitleFromPortfolio(portfolioData);

  const hasContactInfo = portfolioData.email || portfolioData.phone || portfolioData.location || portfolioData.github || portfolioData.linkedin;
  const hasAbout = portfolioData.about?.trim();
  const hasSkills = portfolioData.skills.length > 0;
  const hasProjects = portfolioData.projects.length > 0;
  const hasExperience = portfolioData.workExperience?.length > 0 && portfolioData.workExperience.some(e => e.company || e.title);
  const hasEducation = portfolioData.education?.length > 0 && portfolioData.education.some(e => e.institution || e.degree);
  const hasCertifications = portfolioData.certifications?.length > 0;
  const hasAchievements = portfolioData.achievements?.length > 0;

  return (
    <div className="min-h-screen relative bg-neutral-950">
      {/* Subtle grid */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Ambient lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[200px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[200px] animate-float-slow" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {onBackToDashboard && (
                <button onClick={onBackToDashboard} className="flex items-center gap-1 sm:gap-2 text-neutral-400 hover:text-neutral-200 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Dashboard</span>
                </button>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
              </div>
              <span className="font-display font-semibold text-sm sm:text-lg text-neutral-100 truncate max-w-[120px] sm:max-w-none">{portfolioData.name || 'Portfolio'}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {onViewScore && (
                <button onClick={onViewScore} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-primary-500/30 text-primary-400 text-sm hover:bg-primary-500/10 transition-colors">
                  <Target className="w-4 h-4" />
                  <span className="hidden md:inline">Job Score</span>
                </button>
              )}
              {onEdit && (
                <button onClick={onEdit} className="px-3 py-2 rounded-lg glass text-neutral-300 hover:text-neutral-100 text-sm transition-colors">
                  Edit
                </button>
              )}
              {shareUrl && (
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-neutral-950 font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              )}
              <ExportDropdown portfolioData={portfolioData} />
            </div>
          </div>
        </nav>

        {/* Portfolio Content */}
        <div id="portfolio-content">
          {/* Hero Section */}
          <section className="pt-28 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-6 sm:mb-10 animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-accent-500/30 rounded-full blur-3xl scale-150 animate-pulse-subtle" />
                {portfolioData.profileImage ? (
                  <img
                    src={portfolioData.profileImage}
                    alt={portfolioData.name}
                    className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full object-cover ring-4 ring-neutral-800/50 shadow-2xl animate-scale-in"
                  />
                ) : (
                  <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-2xl">
                    <User className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
                  </div>
                )}
              </div>

              {/* Name & Role */}
              {portfolioData.name && (
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-neutral-100 mb-3 sm:mb-5 animate-slide-up">
                  {portfolioData.name}
                </h1>
              )}
              <p className="text-lg sm:text-2xl md:text-3xl gradient-text font-display font-medium mb-4 sm:mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {displayRole}
              </p>

              {/* Contact Info */}
              {hasContactInfo && (
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  {portfolioData.location && (
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-neutral-300 text-sm">
                      <Map className="w-4 h-4 text-primary-400" />
                      <span>{portfolioData.location}</span>
                    </div>
                  )}
                  {portfolioData.email && (
                    <a href={`mailto:${portfolioData.email}`} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-neutral-300 text-sm hover:text-neutral-100 hover:bg-white/10 transition-colors">
                      <Mail className="w-4 h-4 text-primary-400" />
                      <span className="hidden sm:inline">{portfolioData.email}</span>
                      <span className="sm:hidden">Email</span>
                    </a>
                  )}
                  {portfolioData.phone && (
                    <a href={`tel:${portfolioData.phone}`} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-neutral-300 text-sm hover:text-neutral-100 hover:bg-white/10 transition-colors">
                      <Mail className="w-4 h-4 text-primary-400" />
                      <span className="hidden sm:inline">{portfolioData.phone}</span>
                      <span className="sm:hidden">Phone</span>
                    </a>
                  )}
                  {portfolioData.linkedin && (
                    <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-neutral-300 text-sm hover:text-accent-400 hover:bg-white/10 transition-colors">
                      <Linkedin className="w-4 h-4 text-accent-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {portfolioData.github && (
                    <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-neutral-300 text-sm hover:text-neutral-100 hover:bg-white/10 transition-colors">
                      <Github className="w-4 h-4 text-neutral-400" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {portfolioData.email && (
                  <a href={`mailto:${portfolioData.email}`} className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-sm hover:opacity-90 transition-opacity">
                    <Mail className="w-4 h-4" />
                    Contact Me
                  </a>
                )}
                {portfolioData.linkedin && (
                  <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl glass border border-white/10 text-neutral-200 font-medium text-sm hover:bg-white/10 transition-colors">
                    <Linkedin className="w-4 h-4" />
                    Connect
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* About Section */}
          {hasAbout && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="card-premium p-6 sm:p-10 lg:p-14 glow-gold animate-scale-in">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100">About Me</h2>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed">{portfolioData.about}</p>
                </div>
              </div>
            </section>
          )}

          {/* Skills Section */}
          {hasSkills && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent-500/10 border border-accent-500/20 mb-4 sm:mb-6">
                    <Code2 className="w-6 h-6 sm:w-7 sm:h-7 text-accent-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100">Skills & Technologies</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {portfolioData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 text-sm sm:text-base font-medium text-neutral-200 hover:border-primary-500/40 hover:bg-primary-500/20 transition-all cursor-default"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Projects Section */}
          {hasProjects && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-4 sm:mb-6">
                    <FolderKanban className="w-6 h-6 sm:w-7 sm:h-7 text-primary-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100">Featured Projects</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {portfolioData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="group card-premium overflow-hidden animate-scale-in hover:scale-[1.02] transition-all duration-500"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                            <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                      </div>

                      <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                        <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-100 group-hover:text-primary-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed line-clamp-2">{project.description}</p>

                        {project.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {project.tech.slice(0, 5).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tech.length > 5 && (
                              <span className="px-2 py-1 text-xs text-neutral-500">+{project.tech.length - 5}</span>
                            )}
                          </div>
                        )}

                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Project
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Experience Section */}
          {hasExperience && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-success-500/10 border border-success-500/20 mb-4 sm:mb-6">
                    <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-success-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100">Work Experience</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {portfolioData.workExperience.map((exp, index) => (
                    (exp.company || exp.title) && (
                      <div key={index} className="card-premium p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                          <div>
                            <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-100">{exp.title}</h3>
                            <p className="text-primary-400 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-sm text-neutral-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </div>
                        </div>
                        {exp.location && <p className="text-sm text-neutral-500 mb-3">{exp.location}</p>}
                        {exp.highlights?.length > 0 && (
                          <ul className="space-y-2">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-neutral-300">
                                <span className="text-primary-400 mt-1">•</span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Education Section */}
          {hasEducation && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4 sm:mb-6">
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100">Education</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {portfolioData.education.map((edu, index) => (
                    (edu.institution || edu.degree) && (
                      <div key={index} className="card-premium p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div>
                            <h3 className="text-lg sm:text-xl font-display font-bold text-neutral-100">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                            <p className="text-primary-400 font-medium">{edu.institution}</p>
                            {edu.location && <p className="text-sm text-neutral-500">{edu.location}</p>}
                          </div>
                          <div className="text-sm text-neutral-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </div>
                        </div>
                        {edu.gpa && <p className="mt-2 text-sm text-neutral-400">GPA: {edu.gpa}</p>}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {hasCertifications && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-4 sm:mb-6">
                    <Award className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100">Certifications</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {portfolioData.certifications.map((cert, index) => (
                    <div key={index} className="card-premium p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-100">{cert.name}</h3>
                        <p className="text-sm text-neutral-400">{cert.issuer}</p>
                        {cert.date && <p className="text-xs text-neutral-500 mt-1">{cert.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Achievements Section */}
          {hasAchievements && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 sm:mb-6">
                    <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100">Achievements</h2>
                </div>

                <div className="space-y-4">
                  {portfolioData.achievements.map((achievement, index) => (
                    <div key={index} className="card-premium p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-100">{achievement.title}</h3>
                        {achievement.description && <p className="text-sm text-neutral-400 mt-1">{achievement.description}</p>}
                        {achievement.date && <p className="text-xs text-neutral-500 mt-2">{achievement.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          {hasContactInfo && (
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="max-w-3xl mx-auto text-center">
                <div className="card-premium p-8 sm:p-10 lg:p-14 glow-gold animate-scale-in">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-100 mb-3 sm:mb-4">Let's Connect</h2>
                  <p className="text-neutral-400 text-base sm:text-lg mb-8 sm:mb-10">Interested in working together? I'd love to hear from you.</p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    {portfolioData.email && (
                      <a
                        href={`mailto:${portfolioData.email}`}
                        className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:opacity-90 transition-opacity"
                      >
                        <Mail className="w-5 h-5" />
                        Send Email
                      </a>
                    )}
                    {portfolioData.github && (
                      <a
                        href={portfolioData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-xl glass border border-white/10 text-neutral-200 hover:bg-white/10 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        GitHub
                      </a>
                    )}
                    {portfolioData.linkedin && (
                      <a
                        href={portfolioData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-xl glass border border-white/10 text-neutral-200 hover:bg-white/10 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5 bg-neutral-950">
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                </div>
                <span className="font-display font-semibold text-neutral-100">CareerLaunch AI</span>
              </div>
              <p className="text-neutral-500 text-sm mb-1">Generated using CareerLaunch AI</p>
              <p className="text-neutral-600 text-xs">Designed to help students and professionals build beautiful portfolios.</p>
            </div>
          </footer>
        </div>{/* End portfolio-content */}

        {/* Share Portfolio Modal */}
        {shareUrl && (
          <SharePortfolio
            shareUrl={shareUrl}
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
