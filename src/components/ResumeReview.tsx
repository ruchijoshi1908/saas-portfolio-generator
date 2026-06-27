// Resume Review Component - Edit extracted resume data
// Part of CareerLaunch AI

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Code2,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Award,
  Trophy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  X,
  Plus,
} from 'lucide-react';
import { ResumeData, emptyEducation, resumeToPortfolioData, PortfolioData } from '../utils/resumeTypes';

interface ResumeReviewProps {
  resumeData: ResumeData;
  onResumeDataChange: (data: ResumeData) => void;
  onGeneratePortfolio: (portfolioData: PortfolioData) => void;
  onBack: () => void;
}

// Stable input component defined outside to prevent re-creation
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-styled"
      />
    </div>
  );
}

// Stable section header component
interface SectionHeaderProps {
  title: string;
  section: string;
  icon: any;
  count?: number;
  expanded: boolean;
  onToggle: (section: string) => void;
}

function SectionHeader({ title, section, icon: Icon, count, expanded, onToggle }: SectionHeaderProps) {
  return (
    <button
      onClick={() => onToggle(section)}
      className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-400" />
        </div>
        <h3 className="font-display font-semibold text-neutral-100">{title}</h3>
        {count !== undefined && count > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-xs">
            {count}
          </span>
        )}
      </div>
      {expanded ? (
        <ChevronUp className="w-5 h-5 text-neutral-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-neutral-500" />
      )}
    </button>
  );
}

export default function ResumeReview({
  resumeData,
  onResumeDataChange,
  onGeneratePortfolio,
  onBack,
}: ResumeReviewProps) {
  // Use local state for form fields to prevent focus loss during typing
  const [localData, setLocalData] = useState<ResumeData>(resumeData);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    contact: true,
    skills: true,
    education: true,
    experience: true,
    projects: true,
    certifications: false,
    achievements: false,
  });

  // Sync local data when resumeData prop changes (e.g., after new upload)
  const prevResumeDataRef = useRef(resumeData);
  useEffect(() => {
    // Only update if the reference changed (new upload), not on every keystroke
    if (prevResumeDataRef.current !== resumeData) {
      setLocalData(resumeData);
      prevResumeDataRef.current = resumeData;
    }
  }, [resumeData]);

  // Debounced sync back to parent
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateLocalField = useCallback((field: keyof ResumeData, value: any) => {
    setLocalData(prev => {
      const newData = { ...prev, [field]: value };

      // Debounce sync to parent - only sync after 300ms of no typing
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        onResumeDataChange(newData);
      }, 300);

      return newData;
    });
  }, [onResumeDataChange]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const addEducation = useCallback(() => {
    setLocalData(prev => {
      const newData = {
        ...prev,
        education: [...prev.education, { ...emptyEducation }],
      };
      onResumeDataChange(newData);
      return newData;
    });
  }, [onResumeDataChange]);

  const updateEducation = useCallback((index: number, field: string, value: string) => {
    setLocalData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      const newData = { ...prev, education: newEducation };
      onResumeDataChange(newData);
      return newData;
    });
  }, [onResumeDataChange]);

  const removeEducation = useCallback((index: number) => {
    setLocalData(prev => {
      const newData = {
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      };
      onResumeDataChange(newData);
      return newData;
    });
  }, [onResumeDataChange]);

  const addSkill = useCallback((skill: string) => {
    if (skill.trim() && !localData.skills.includes(skill.trim())) {
      setLocalData(prev => {
        const newData = {
          ...prev,
          skills: [...prev.skills, skill.trim()],
        };
        onResumeDataChange(newData);
        return newData;
      });
    }
  }, [localData.skills, onResumeDataChange]);

  const removeSkill = useCallback((index: number) => {
    setLocalData(prev => {
      const newData = {
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index),
      };
      onResumeDataChange(newData);
      return newData;
    });
  }, [onResumeDataChange]);

  const handleGenerate = useCallback(() => {
    // Sync final data before generating
    onResumeDataChange(localData);
    const portfolioData = resumeToPortfolioData(localData);
    onGeneratePortfolio(portfolioData);
  }, [localData, onResumeDataChange, onGeneratePortfolio]);

  const getCompletionPercentage = useCallback(() => {
    let filled = 0;
    let total = 0;

    if (localData.fullName) filled++;
    total++;
    if (localData.professionalTitle) filled++;
    total++;
    if (localData.email) filled++;
    total++;
    if (localData.summary) filled++;
    total++;
    if (localData.skills.length > 0) filled++;
    total++;
    if (localData.education.length > 0) filled++;
    total++;
    if (localData.workExperience.length > 0) filled++;
    total++;

    return Math.round((filled / total) * 100);
  }, [localData]);

  const completion = getCompletionPercentage();

  return (
    <div className="min-h-screen py-8 px-4 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
            <Edit2 className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-accent-300">Review & Edit</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Review Your Information</h1>
          <p className="text-neutral-400 text-lg">
            Our AI extracted the information below. Make any necessary edits before generating your portfolio.
          </p>

          {/* Confidence Banner */}
          <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            localData.extractionConfidence === 'high' ? 'bg-green-500/10 border border-green-500/20' :
            localData.extractionConfidence === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/20' :
            'bg-red-500/10 border border-red-500/20'
          }`}>
            {localData.extractionConfidence === 'high' ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-sm">
              {localData.extractionConfidence === 'high' ? 'High confidence extraction' :
               localData.extractionConfidence === 'medium' ? 'Medium confidence - please verify' :
               'Low confidence - please review carefully'}
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="card-premium p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-400 text-sm">Profile Completion</span>
            <span className="text-primary-400 font-semibold">{completion}%</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="card-premium overflow-hidden mb-6">
          <SectionHeader
            title="Personal Information"
            section="personal"
            icon={User}
            expanded={expandedSections.personal}
            onToggle={toggleSection}
          />
          {expandedSections.personal && (
            <div className="p-5 pt-0 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  value={localData.fullName}
                  onChange={(v) => updateLocalField('fullName', v)}
                  placeholder="John Doe"
                />
                <InputField
                  label="Professional Title"
                  value={localData.professionalTitle}
                  onChange={(v) => updateLocalField('professionalTitle', v)}
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Professional Summary</label>
                <textarea
                  value={localData.summary}
                  onChange={(e) => updateLocalField('summary', e.target.value)}
                  placeholder="Brief professional summary..."
                  rows={4}
                  className="input-styled resize-none"
                />
              </div>
              <InputField
                label="Location"
                value={localData.location}
                onChange={(v) => updateLocalField('location', v)}
                placeholder="San Francisco, CA"
              />
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="card-premium overflow-hidden mb-6">
          <SectionHeader
            title="Contact Information"
            section="contact"
            icon={Mail}
            expanded={expandedSections.contact}
            onToggle={toggleSection}
          />
          {expandedSections.contact && (
            <div className="p-5 pt-0 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  label="Email"
                  value={localData.email}
                  onChange={(v) => updateLocalField('email', v)}
                  placeholder="john@example.com"
                  type="email"
                />
                <InputField
                  label="Phone"
                  value={localData.phone}
                  onChange={(v) => updateLocalField('phone', v)}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <InputField
                  label="LinkedIn"
                  value={localData.linkedinUrl}
                  onChange={(v) => updateLocalField('linkedinUrl', v)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
                <InputField
                  label="GitHub"
                  value={localData.githubUrl}
                  onChange={(v) => updateLocalField('githubUrl', v)}
                  placeholder="https://github.com/johndoe"
                />
                <InputField
                  label="Portfolio"
                  value={localData.portfolioUrl}
                  onChange={(v) => updateLocalField('portfolioUrl', v)}
                  placeholder="https://johndoe.com"
                />
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="card-premium overflow-hidden mb-6">
          <SectionHeader
            title="Skills"
            section="skills"
            icon={Code2}
            count={localData.skills.length}
            expanded={expandedSections.skills}
            onToggle={toggleSection}
          />
          {expandedSections.skills && (
            <div className="p-5 pt-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {localData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 flex items-center gap-2 group"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  className="input-styled flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    if (input) {
                      addSkill(input.value);
                      input.value = '';
                    }
                  }}
                  className="btn-secondary px-4"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="card-premium overflow-hidden mb-6">
          <SectionHeader
            title="Education"
            section="education"
            icon={GraduationCap}
            count={localData.education.length}
            expanded={expandedSections.education}
            onToggle={toggleSection}
          />
          {expandedSections.education && (
            <div className="p-5 pt-0 space-y-4">
              {localData.education.map((edu, index) => (
                <div key={index} className="glass rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-neutral-300">Education {index + 1}</h4>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-neutral-600 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="University Name"
                      className="input-styled"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree (e.g., Bachelor of Science)"
                      className="input-styled"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      placeholder="Field of Study"
                      className="input-styled"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                        placeholder="Start Date"
                        className="input-styled flex-1"
                      />
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                        placeholder="End Date"
                        className="input-styled flex-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="btn-secondary w-full flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
          )}
        </div>

        {/* Work Experience */}
        <div className="card-premium overflow-hidden mb-6">
          <SectionHeader
            title="Work Experience"
            section="experience"
            icon={Briefcase}
            count={localData.workExperience.length}
            expanded={expandedSections.experience}
            onToggle={toggleSection}
          />
          {expandedSections.experience && (
            <div className="p-5 pt-0">
              <p className="text-neutral-500 text-sm">
                {localData.workExperience.length} position(s) extracted
              </p>
              {localData.workExperience.map((exp, index) => (
                <div key={index} className="glass rounded-xl p-5 mt-4">
                  <h4 className="font-medium text-neutral-300">{exp.title || 'Untitled Position'}</h4>
                  <p className="text-neutral-500 text-sm">{exp.company}</p>
                  <p className="text-neutral-600 text-xs">{exp.startDate} - {exp.endDate}</p>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="text-neutral-400 text-sm flex items-start gap-2">
                          <span className="text-primary-400">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="card-premium overflow-hidden mb-6">
          <SectionHeader
            title="Projects"
            section="projects"
            icon={FolderKanban}
            count={localData.projects.length}
            expanded={expandedSections.projects}
            onToggle={toggleSection}
          />
          {expandedSections.projects && (
            <div className="p-5 pt-0 space-y-4">
              {localData.projects.map((project, index) => (
                <div key={index} className="glass rounded-xl p-5">
                  <h4 className="font-medium text-neutral-300">{project.name || 'Untitled Project'}</h4>
                  <p className="text-neutral-500 text-sm mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 rounded-lg bg-accent-500/10 text-accent-300 text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        {localData.certifications.length > 0 && (
          <div className="card-premium overflow-hidden mb-6">
            <SectionHeader
              title="Certifications"
              section="certifications"
              icon={Award}
              count={localData.certifications.length}
              expanded={expandedSections.certifications}
              onToggle={toggleSection}
            />
            {expandedSections.certifications && (
              <div className="p-5 pt-0">
                {localData.certifications.map((cert, index) => (
                  <div key={index} className="glass rounded-xl p-4 mb-2">
                    <h4 className="font-medium text-neutral-300">{cert.name}</h4>
                    <p className="text-neutral-500 text-sm">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Achievements */}
        {localData.achievements.length > 0 && (
          <div className="card-premium overflow-hidden mb-6">
            <SectionHeader
              title="Achievements"
              section="achievements"
              icon={Trophy}
              count={localData.achievements.length}
              expanded={expandedSections.achievements}
              onToggle={toggleSection}
            />
            {expandedSections.achievements && (
              <div className="p-5 pt-0">
                {localData.achievements.map((achievement, index) => (
                  <div key={index} className="glass rounded-xl p-4 mb-2">
                    <h4 className="font-medium text-neutral-300">{achievement.title}</h4>
                    <p className="text-neutral-500 text-sm">{achievement.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center pt-8 pb-8">
          <button
            onClick={handleGenerate}
            className="btn-primary flex items-center gap-3 text-lg px-10 py-5"
          >
            <Sparkles className="w-5 h-5" />
            Generate My Portfolio
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
