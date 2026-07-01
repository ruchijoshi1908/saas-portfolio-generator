// Resume Improvement Component
// Displays AI-powered resume analysis with actionable suggestions

import { useState, useEffect } from 'react';
import {
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Target,
  Copy,
  Check,
  Zap,
  Award,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Code2,
  FileSearch,
  X,
  ArrowDown,
} from 'lucide-react';
import { ResumeData } from '../utils/resumeTypes';
import { analyzeResume, getScoreLabelInfo, ResumeAnalysis, ImprovementSuggestion, QuickWin } from '../utils/resumeAnalyzer';

interface ResumeImprovementProps {
  resumeData: ResumeData;
  onBack: () => void;
  onContinue: () => void;
  onApplySuggestion?: (section: string, newText: string) => void;
  onNavigateToLinkedIn?: () => void;
  onNavigateToRoadmap?: () => void;
}

export default function ResumeImprovement({
  resumeData,
  onBack,
  onContinue,
  onApplySuggestion,
  onNavigateToLinkedIn,
  onNavigateToRoadmap,
}: ResumeImprovementProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const result = analyzeResume(resumeData);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  }, [resumeData]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSuggestion(id);
    setTimeout(() => setCopiedSuggestion(null), 2000);
  };

  const handleApplySuggestion = (suggestion: ImprovementSuggestion) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion.section, suggestion.suggestedText);
    }
    setAppliedSuggestions(prev => new Set([...prev, suggestion.section]));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSectionIcon = (sectionName: string) => {
    const icons: Record<string, any> = {
      'Professional Summary': FileText,
      'Skills': Code2,
      'Projects': Briefcase,
      'Experience': Briefcase,
      'Education': GraduationCap,
      'Grammar & Writing': FileSearch,
      'ATS Compatibility': Target,
    };
    return icons[sectionName] || FileText;
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
            <FileSearch className="absolute inset-0 m-auto w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Analyzing Your Resume</h2>
          <p className="text-neutral-500">Evaluating sections and generating suggestions...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Error analyzing resume. Please go back and try again.</p>
      </div>
    );
  }

  const scoreInfo = getScoreLabelInfo(analysis.scoreLabel);

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <FileSearch className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Resume Analysis</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Resume Improvement Report</h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            AI-powered analysis with actionable suggestions to strengthen your resume.
          </p>
        </div>

        {/* Score Overview */}
        <div className="card-premium p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Current Score */}
            <div className="text-center">
              <div className="relative w-36 h-36 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-neutral-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className={getScoreColor(analysis.overallScore)}
                    style={{
                      strokeDasharray: `${analysis.overallScore * 2.51} 251`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </span>
                  <span className="text-neutral-500 text-sm">/ 100</span>
                </div>
              </div>
              <span className={`text-lg font-semibold ${scoreInfo.color}`}>{scoreInfo.text}</span>
              <p className="text-neutral-500 text-sm mt-1">Current Resume Score</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2">
              <ArrowRight className="w-8 h-8 text-green-400 hidden md:block" />
              <ArrowDown className="w-8 h-8 text-green-400 md:hidden" />
              <span className="text-green-400 font-bold text-xl">+{analysis.potentialImprovement}</span>
            </div>

            {/* Estimated Score */}
            <div className="text-center">
              <div className="relative w-36 h-36 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-neutral-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#projectedGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: `${analysis.estimatedScoreAfter * 2.51} 251`,
                    }}
                  />
                  <defs>
                    <linearGradient id="projectedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-green-400">
                    {analysis.estimatedScoreAfter}
                  </span>
                  <span className="text-neutral-500 text-sm">/ 100</span>
                </div>
              </div>
              <span className="text-lg font-semibold text-green-400">Potential Score</span>
              <p className="text-neutral-500 text-sm mt-1">After applying suggestions</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Section Scores */}
          <div className="lg:col-span-1 space-y-6">
            {/* Section Analysis */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-6 flex items-center gap-2">
                <BarChartIcon className="w-5 h-5 text-primary-400" />
                Section Analysis
              </h3>
              <div className="space-y-4">
                {analysis.sections.map((section, i) => {
                  const Icon = getSectionIcon(section.name);
                  const percentage = (section.score / section.maxScore) * 100;

                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-300">{section.name}</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                          percentage >= 70 ? 'text-green-400' :
                          percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {section.score}/{section.maxScore}
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                            percentage >= 70 ? 'from-green-400 to-emerald-500' :
                            percentage >= 50 ? 'from-yellow-400 to-amber-500' :
                            'from-red-400 to-rose-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{section.feedback}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Information */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Missing Information
              </h3>
              <div className="space-y-2">
                {analysis.missingInfo.length > 0 ? (
                  analysis.missingInfo.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.importance === 'high' ? 'border-red-400' :
                        item.importance === 'medium' ? 'border-yellow-400' : 'border-neutral-600'
                      }`}>
                        <X className="w-3 h-3 text-neutral-600" />
                      </div>
                      <span className="text-sm text-neutral-300">{item.item}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ml-auto ${
                        item.importance === 'high' ? 'bg-red-500/10 text-red-400' :
                        item.importance === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-neutral-800 text-neutral-500'
                      }`}>
                        {item.importance}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm">All key sections are complete!</p>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column - AI Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Suggestions */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-400" />
                AI Improvement Suggestions
              </h3>
              <div className="space-y-4">
                {analysis.suggestions.length > 0 ? (
                  analysis.suggestions.map((suggestion, i) => {
                    const isExpanded = expandedSuggestion === suggestion.section;
                    const isApplied = appliedSuggestions.has(suggestion.section);

                    return (
                      <div
                        key={i}
                        className={`glass rounded-xl overflow-hidden transition-all ${
                          isApplied ? 'border-green-500/30' : ''
                        }`}
                      >
                        <button
                          onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.section)}
                          className="w-full p-4 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isApplied ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <Lightbulb className="w-4 h-4 text-accent-400" />
                              )}
                              <span className="font-medium text-neutral-200">{suggestion.section}</span>
                            </div>
                            <ArrowRight
                              className={`w-4 h-4 text-neutral-500 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3">
                            {/* Current Text */}
                            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                              <p className="text-xs text-red-400 mb-2">Current Text</p>
                              <p className="text-sm text-neutral-300">{suggestion.currentText}</p>
                            </div>

                            <div className="flex justify-center">
                              <ArrowDown className="w-4 h-4 text-green-400" />
                            </div>

                            {/* Suggested Text */}
                            <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                              <p className="text-xs text-green-400 mb-2">Suggested Text</p>
                              <p className="text-sm text-neutral-300">{suggestion.suggestedText}</p>
                            </div>

                            {/* Reason */}
                            <p className="text-xs text-neutral-500 italic">{suggestion.reason}</p>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCopy(suggestion.suggestedText, suggestion.section)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm transition-colors"
                              >
                                {copiedSuggestion === suggestion.section ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                                Copy
                              </button>
                              {!isApplied && (
                                <button
                                  onClick={() => handleApplySuggestion(suggestion)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 text-sm transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Apply
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <p className="text-neutral-400">Your resume looks great! No major suggestions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Strengths & Quick Wins */}
          <div className="lg:col-span-1 space-y-6">
            {/* Strengths */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Resume Strengths
              </h3>
              <div className="space-y-2">
                {analysis.strengths.map((strength, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-sm text-neutral-300">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas to Improve */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Areas to Improve
              </h3>
              <div className="space-y-2">
                {analysis.improvements.map((improvement, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Wins */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-400" />
                Quick Wins
              </h3>
              <div className="space-y-3">
                {analysis.quickWins.map((win) => (
                  <QuickWinCard key={win.id} win={win} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Integration CTAs */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="card-premium p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Linkedin className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-neutral-100 mb-2">Generate LinkedIn Profile</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Use your analyzed resume to create an optimized LinkedIn profile in seconds.
                </p>
                <button
                  onClick={onNavigateToLinkedIn}
                  className="btn-secondary bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                >
                  Generate Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          <div className="card-premium p-6 bg-gradient-to-r from-green-500/5 to-teal-500/5 border-green-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-neutral-100 mb-2">Get Career Roadmap</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Receive personalized next steps to improve your career readiness.
                </p>
                <button
                  onClick={onNavigateToRoadmap}
                  className="btn-secondary bg-green-500/10 hover:bg-green-500/20 text-green-400"
                >
                  View Roadmap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-neutral-800">
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </button>
          <button
            onClick={onContinue}
            className="btn-primary flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function QuickWinCard({ win }: { win: QuickWin }) {
  const getIcon = () => {
    switch (win.action) {
      case 'add_linkedin':
        return <Linkedin className="w-5 h-5 text-blue-400" />;
      case 'add_github':
        return <Github className="w-5 h-5 text-neutral-400" />;
      case 'add_certifications':
        return <Award className="w-5 h-5 text-yellow-400" />;
      case 'add_achievements':
        return <TrophyIcon className="w-5 h-5 text-amber-400" />;
      case 'improve_summary':
      case 'improve_projects':
      case 'improve_experience':
        return <Sparkles className="w-5 h-5 text-primary-400" />;
      default:
        return <Zap className="w-5 h-5 text-primary-400" />;
    }
  };

  return (
    <div className="p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-neutral-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-200">{win.title}</h4>
            <span className="text-xs text-green-400 font-medium">+{win.impact}</span>
          </div>
          <p className="text-xs text-neutral-500 truncate">{win.description}</p>
        </div>
      </div>
    </div>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
