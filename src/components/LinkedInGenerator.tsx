// LinkedIn Profile Generator Component
// Generates professional LinkedIn profile content from resume data

import { useState, useCallback, useEffect } from 'react';
import {
  Linkedin,
  User,
  FileText,
  Briefcase,
  FolderKanban,
  Code2,
  GraduationCap,
  Award,
  Network,
  Copy,
  Check,
  RefreshCw,
  Edit2,
  CheckCircle2,
  Target,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BarChart3,
} from 'lucide-react';
import {
  LinkedInProfile,
  LinkedInStrengthScore,
  generateLinkedInProfile,
} from '../utils/linkedinGenerator';
import { ResumeData } from '../utils/resumeTypes';

// ============================================================================
// TAB CONFIGURATION
// ============================================================================

type TabType = 'headline' | 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'networking';

interface TabConfig {
  id: TabType;
  label: string;
  icon: any;
}

const tabs: TabConfig[] = [
  { id: 'headline', label: 'Headline', icon: User },
  { id: 'about', label: 'About', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'networking', label: 'Networking', icon: Network },
];

// ============================================================================
// EDITABLE CONTENT COMPONENT
// ============================================================================

interface EditableContentProps {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

function EditableContent({ content, onContentChange, placeholder, multiline = false }: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onContentChange(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditing ? (
        <div className="space-y-3">
          {multiline ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder={placeholder}
              rows={8}
              className="input-styled resize-none w-full"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder={placeholder}
              className="input-styled w-full"
              autoFocus
            />
          )}
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Save
            </button>
            <button onClick={handleCancel} className="btn-secondary px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="group relative">
          <div className={`${multiline ? 'whitespace-pre-wrap' : ''} text-neutral-300 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 min-h-[60px]`}>
            {content || <span className="text-neutral-600 italic">{placeholder}</span>}
          </div>
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 transition-colors"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STRENGTH SCORE COMPONENT
// ============================================================================

interface StrengthScoreProps {
  score: LinkedInStrengthScore;
}

function StrengthScore({ score }: StrengthScoreProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreStroke = (value: number) => {
    if (value >= 80) return '#4ade80';
    if (value >= 60) return '#facc15';
    return '#f87171';
  };

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-accent-400" />
          </div>
          <h3 className="font-display font-semibold text-neutral-100">LinkedIn Profile Strength</h3>
        </div>
        <div className={`text-4xl font-bold ${getScoreColor(score.overallScore)}`}>
          {score.overallScore}/100
        </div>
      </div>

      {/* Overall Progress Ring */}
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-neutral-800"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={getScoreStroke(score.overallScore)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score.overallScore * 2.51} 251`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score.overallScore)}`}>
              {score.overallScore}%
            </span>
            <span className="text-neutral-500 text-xs">Complete</span>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Headline', score: score.headlineScore },
          { label: 'About', score: score.aboutScore },
          { label: 'Experience', score: score.experienceScore },
          { label: 'Skills', score: score.skillsScore },
          { label: 'Education', score: score.educationScore },
        ].map((category) => (
          <div key={category.label} className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(category.score)}`}>
              {category.score}%
            </div>
            <div className="text-neutral-500 text-xs">{category.label}</div>
          </div>
        ))}
      </div>

      {/* Missing Sections */}
      {score.missingSections.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Missing Sections</span>
          </div>
          <ul className="text-sm text-neutral-400 space-y-1">
            {score.missingSections.map((section, i) => (
              <li key={i}>• {section}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Suggestions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span>AI Suggestions</span>
        </div>
        {score.suggestions.map((suggestion, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface LinkedInGeneratorProps {
  resumeData: ResumeData;
  onBack: () => void;
  onContinue: () => void;
}

export default function LinkedInGenerator({
  resumeData,
  onBack,
  onContinue,
}: LinkedInGeneratorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('headline');
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [strengthScore, setStrengthScore] = useState<LinkedInStrengthScore | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [regeneratingTab, setRegeneratingTab] = useState<TabType | null>(null);

  // Generate profile on mount
  useEffect(() => {
    generateProfile();
  }, []);

  const generateProfile = useCallback(() => {
    setIsGenerating(true);
    // Simulate generation delay for UX
    setTimeout(() => {
      const result = generateLinkedInProfile(resumeData);
      setProfile(result.profile);
      setStrengthScore(result.strengthScore);
      setIsGenerating(false);
    }, 1500);
  }, [resumeData]);

  const regenerateSection = useCallback((tab: TabType) => {
    setRegeneratingTab(tab);
    setTimeout(() => {
      // Regenerate just this section
      const result = generateLinkedInProfile(resumeData);
      setProfile(result.profile);
      setStrengthScore(result.strengthScore);
      setRegeneratingTab(null);
    }, 800);
  }, [resumeData]);

  const updateProfileField = useCallback((field: keyof LinkedInProfile, value: any) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
            <Linkedin className="absolute inset-0 m-auto w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Generating Your LinkedIn Profile</h2>
          <p className="text-neutral-500">Analyzing your resume and creating optimized content...</p>
        </div>
      </div>
    );
  }

  if (!profile || !strengthScore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Error generating profile. Please go back and try again.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    const isRegenerating = regeneratingTab === activeTab;

    if (isRegenerating) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case 'headline':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">LinkedIn Headline</label>
              <EditableContent
                content={profile.headline}
                onContentChange={(v) => updateProfileField('headline', v)}
                placeholder="Your LinkedIn headline..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">LinkedIn Banner Text</label>
              <EditableContent
                content={profile.bannerText}
                onContentChange={(v) => updateProfileField('bannerText', v)}
                placeholder="Banner text suggestion..."
              />
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">About Section</label>
              <p className="text-neutral-500 text-xs mb-3">Recommended: 200-300 characters</p>
              <EditableContent
                content={profile.about}
                onContentChange={(v) => updateProfileField('about', v)}
                placeholder="Write a compelling About section..."
                multiline
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            {profile.experience.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No work experience found in resume.</p>
            ) : (
              profile.experience.map((exp, index) => (
                <div key={index} className="glass rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-neutral-100 text-lg">{exp.title}</h4>
                      <p className="text-neutral-400">{exp.company}</p>
                      <p className="text-neutral-600 text-sm">{exp.dateRange}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-neutral-400 mb-2">Description</label>
                    <EditableContent
                      content={exp.description}
                      onContentChange={(v) => {
                        const newExp = [...profile.experience];
                        newExp[index] = { ...exp, description: v };
                        updateProfileField('experience', newExp);
                      }}
                      placeholder="Job description..."
                      multiline
                    />
                  </div>
                  {exp.achievements.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-2">Key Achievements</label>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-neutral-300 text-sm flex items-start gap-2">
                            <span className="text-primary-400">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            {profile.projects.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No projects found in resume.</p>
            ) : (
              profile.projects.map((project, index) => (
                <div key={index} className="glass rounded-xl p-6">
                  <h4 className="font-medium text-neutral-100 text-lg mb-2">{project.name}</h4>
                  <EditableContent
                    content={project.description}
                    onContentChange={(v) => {
                      const newProjects = [...profile.projects];
                      newProjects[index] = { ...project, description: v };
                      updateProfileField('projects', newProjects);
                    }}
                    placeholder="Project description..."
                    multiline
                  />
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-accent-500/10 text-accent-300 text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h4 className="font-medium text-neutral-100 mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary-400" />
                  Technical Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.technical.map((skill, i) => (
                    <span key={i} className="px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass rounded-xl p-6">
                <h4 className="font-medium text-neutral-100 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent-400" />
                  Soft Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.soft.map((skill, i) => (
                    <span key={i} className="px-3 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-300 text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="font-medium text-neutral-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Recruiter Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.keywords.map((keyword, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            {profile.education.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No education found in resume.</p>
            ) : (
              profile.education.map((edu, index) => (
                <div key={index} className="glass rounded-xl p-6">
                  <h4 className="font-medium text-neutral-100 text-lg">{edu.school}</h4>
                  <p className="text-neutral-400">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className="text-neutral-600 text-sm mb-4">{edu.dateRange}</p>
                  <EditableContent
                    content={edu.description}
                    onContentChange={(v) => {
                      const newEdu = [...profile.education];
                      newEdu[index] = { ...edu, description: v };
                      updateProfileField('education', newEdu);
                    }}
                    placeholder="Education description..."
                    multiline
                  />
                </div>
              ))
            )}
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            {profile.certifications.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No certifications found in resume.</p>
            ) : (
              profile.certifications.map((cert, index) => (
                <div key={index} className="glass rounded-xl p-6">
                  <h4 className="font-medium text-neutral-100 text-lg">{cert.name}</h4>
                  <p className="text-neutral-400">{cert.issuer}</p>
                  <p className="text-neutral-600 text-sm mb-4">{cert.date}</p>
                  <EditableContent
                    content={cert.description}
                    onContentChange={(v) => {
                      const newCerts = [...profile.certifications];
                      newCerts[index] = { ...cert, description: v };
                      updateProfileField('certifications', newCerts);
                    }}
                    placeholder="Certification description..."
                    multiline
                  />
                </div>
              ))
            )}
          </div>
        );

      case 'networking':
        return (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h4 className="font-medium text-neutral-100 mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-primary-400" />
                Connection Request Message
              </h4>
              <p className="text-neutral-500 text-xs mb-3">Use this message when sending connection requests</p>
              <EditableContent
                content={profile.connectionMessage}
                onContentChange={(v) => updateProfileField('connectionMessage', v)}
                placeholder="Write a personalized connection message..."
                multiline
              />
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="font-medium text-neutral-100 mb-4">Networking Tips</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Personalize each connection request with the person's name</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Mention mutual connections or shared interests when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Keep messages under 300 characters for better readability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Follow up with a thank you message after connecting</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Linkedin className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">LinkedIn Profile Generator</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Your Optimized LinkedIn Profile</h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            AI-generated content tailored for maximum recruiter visibility. Edit, copy, and paste directly into your LinkedIn profile.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Strength Score */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <StrengthScore score={strengthScore} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="card-premium p-2 mb-6">
              <div className="flex flex-wrap gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="card-premium p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.icon && (
                    (() => {
                      const Icon = tabs.find(t => t.id === activeTab)!.icon;
                      return <Icon className="w-5 h-5 text-primary-400" />;
                    })()
                  )}
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <button
                  onClick={() => regenerateSection(activeTab)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors"
                  title="Regenerate this section"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>
              </div>
              {renderTabContent()}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <button
                onClick={onContinue}
                className="btn-primary flex items-center gap-3 px-8 py-4"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
