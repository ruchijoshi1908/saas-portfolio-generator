// Skills Analytics Component
// Displays comprehensive skills analysis with gap identification and learning recommendations

import { useState, useEffect } from 'react';
import {
  Code2,
  Brain,
  Target,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BarChart3,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  Zap,
  Compass,
  Linkedin,
  FileSearch,
  Users,
} from 'lucide-react';
import { ResumeData } from '../utils/resumeTypes';
import { analyzeSkills, getSkillsScoreLabelInfo, SkillsAnalysis } from '../utils/skillsAnalyzer';

interface SkillsAnalyticsProps {
  resumeData: ResumeData;
  onBack: () => void;
  onContinue: () => void;
  onNavigateToLinkedIn?: () => void;
  onNavigateToRoadmap?: () => void;
  onNavigateToResumeImprovement?: () => void;
}

export default function SkillsAnalytics({
  resumeData,
  onBack,
  onContinue,
  onNavigateToLinkedIn,
  onNavigateToRoadmap,
  onNavigateToResumeImprovement,
}: SkillsAnalyticsProps) {
  const [analysis, setAnalysis] = useState<SkillsAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'gap' | 'learning'>('overview');

  useEffect(() => {
    setTimeout(() => {
      const result = analyzeSkills(resumeData);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1200);
  }, [resumeData]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-green-400';
      case 'advanced': return 'text-blue-400';
      case 'intermediate': return 'text-yellow-400';
      default: return 'text-neutral-400';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-500/10 border-green-500/20';
      case 'advanced': return 'bg-blue-500/10 border-blue-500/20';
      case 'intermediate': return 'bg-yellow-500/10 border-yellow-500/20';
      default: return 'bg-neutral-800 border-neutral-700';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
            <Brain className="absolute inset-0 m-auto w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Analyzing Your Skills</h2>
          <p className="text-neutral-500">Evaluating skill levels and identifying gaps...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Error analyzing skills. Please go back and try again.</p>
      </div>
    );
  }

  const scoreInfo = getSkillsScoreLabelInfo(analysis.scoreLabel);

  return (
    <div className="min-h-screen py-8 px-4 pt-20 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px]" />
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
            <Brain className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Skills Analytics</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Your Skills Profile</h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Comprehensive analysis of your technical and soft skills with personalized recommendations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-xl p-1 flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'gap', label: 'Gap Analysis', icon: Target },
              { id: 'learning', label: 'Learning Path', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="card-premium p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-neutral-800" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        style={{ strokeDasharray: `${analysis.overallScore * 2.51} 251` }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-primary-400">{analysis.overallScore}</span>
                      <span className="text-neutral-500 text-xs">/ 100</span>
                    </div>
                  </div>
                  <span className={`text-lg font-semibold ${scoreInfo.color}`}>{scoreInfo.text}</span>
                  <p className="text-neutral-500 text-sm mt-1">Overall Skills Score</p>
                </div>

                {/* Skills Count */}
                <div className="flex flex-col justify-center space-y-4">
                  <div className="glass rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neutral-100">{analysis.technicalSkillsCount}</div>
                      <div className="text-sm text-neutral-500">Technical Skills</div>
                    </div>
                  </div>
                  <div className="glass rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neutral-100">{analysis.softSkillsCount}</div>
                      <div className="text-sm text-neutral-500">Soft Skills</div>
                    </div>
                  </div>
                </div>

                {/* Potential Score */}
                <div className="text-center">
                  <div className="glass rounded-xl p-6">
                    <div className="text-4xl font-bold text-green-400 mb-2">{analysis.potentialScore}</div>
                    <div className="text-sm text-neutral-500 mb-4">Potential Score</div>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{analysis.potentialScore - analysis.overallScore} with learning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Technical Skills */}
              <div className="card-premium p-6">
                <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary-400" />
                  Technical Skills
                </h3>
                {analysis.technicalSkills.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {analysis.technicalSkills.map((skill, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-neutral-300">{skill.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getLevelBg(skill.level)} ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-400 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm">No technical skills detected. Add skills to your resume!</p>
                )}
              </div>

              {/* Soft Skills */}
              <div className="card-premium p-6">
                <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-400" />
                  Soft Skills
                </h3>
                {analysis.softSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.softSkills.map((skill, i) => (
                      <span
                        key={i}
                        className={`px-3 py-2 rounded-lg text-sm border ${getLevelBg(skill.level)} ${getLevelColor(skill.level)}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm">No soft skills detected. Consider adding communication, teamwork, etc.</p>
                )}
              </div>
            </div>

            {/* Strength Meters */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-400" />
                Strength Areas
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {analysis.strengthAreas.map((area, i) => (
                  <div key={i} className="glass rounded-xl p-4 text-center group hover:scale-105 transition-transform">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-neutral-800" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className={area.score >= 60 ? 'text-green-400' : area.score >= 40 ? 'text-yellow-400' : 'text-red-400'}
                          style={{ strokeDasharray: `${area.score * 2.51} 251` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-neutral-100">{area.score}</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-neutral-200 mb-1">{area.name}</h4>
                    <span className={`text-xs ${getLevelColor(area.level)}`}>{area.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gap Analysis Tab */}
        {activeTab === 'gap' && (
          <div className="space-y-6">
            {/* Career Path */}
            <div className="card-premium p-6 bg-gradient-to-r from-primary-500/5 to-accent-500/5 border-primary-500/10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                  <Compass className="w-7 h-7 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-neutral-100 mb-1">
                    Recommended Path: {analysis.careerPathSkills.path}
                  </h3>
                  <p className="text-neutral-400 mb-4">Based on your current skills, this path is the best match for your profile.</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary-400" />
                      <span className="text-sm text-neutral-300">{analysis.careerPathSkills.matchPercentage}% match</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-accent-400" />
                      <span className="text-sm text-neutral-300">{analysis.careerPathSkills.averageSalary}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Analysis Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Skills */}
              <div className="card-premium p-6">
                <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Your Current Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.technicalSkills.slice(0, 15).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {analysis.technicalSkills.length > 15 && (
                    <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 text-sm">
                      +{analysis.technicalSkills.length - 15} more
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card-premium p-6">
                <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Missing Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.slice(0, 10).map((skill, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-lg border text-sm ${getImportanceColor(skill.importance)}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Industry Skills */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-400" />
                Top Industry Skills for {analysis.careerPathSkills.path}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {analysis.careerPathSkills.topIndustrySkills.map((skill, i) => {
                  const hasSkill = analysis.technicalSkills.some(s =>
                    s.name.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <div
                      key={i}
                      className={`glass rounded-xl p-4 text-center ${hasSkill ? 'border-green-500/20' : 'border-dashed border-neutral-700'}`}
                    >
                      {hasSkill && <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-2" />}
                      <span className={`text-sm ${hasSkill ? 'text-green-300' : 'text-neutral-400'}`}>
                        {skill}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Skills Detail */}
            <div className="card-premium p-6">
              <h3 className="font-display font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Skills You Should Learn
              </h3>
              <div className="space-y-3">
                {analysis.missingSkills.slice(0, 5).map((skill, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      skill.importance === 'critical' ? 'bg-red-500/10 text-red-400' :
                      skill.importance === 'high' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      <span className="font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-neutral-200">{skill.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${getImportanceColor(skill.importance)}`}>
                          {skill.importance}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Estimated learning time: <span className="text-neutral-300">{skill.learningTime}</span>
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-neutral-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Learning Path Tab */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            {/* Learning Path Header */}
            <div className="card-premium p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-neutral-950" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-neutral-100">Recommended Learning Order</h3>
                  <p className="text-neutral-400">Learn these skills in order for maximum impact</p>
                </div>
              </div>

              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-green-500" />

                <div className="space-y-4">
                  {analysis.recommendedLearning.map((rec, i) => (
                    <div key={i} className="relative flex gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center z-10 ${
                        i === 0 ? 'bg-primary-500/20 border border-primary-500/30' :
                        i < 3 ? 'bg-accent-500/20 border border-accent-500/30' :
                        'bg-neutral-800 border border-neutral-700'
                      }`}>
                        <span className={`font-bold ${
                          i === 0 ? 'text-primary-400' :
                          i < 3 ? 'text-accent-400' : 'text-neutral-400'
                        }`}>{rec.order}</span>
                      </div>
                      <div className="flex-1 glass rounded-xl p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <h4 className="text-lg font-semibold text-neutral-100">{rec.skill}</h4>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-sm text-neutral-500">
                              <Clock className="w-4 h-4" />
                              {rec.estimatedTime}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              i === 0 ? 'bg-primary-500/10 text-primary-400' :
                              'bg-accent-500/10 text-accent-400'
                            }`}>
                              Priority #{rec.order}
                            </span>
                          </div>
                        </div>
                        <p className="text-neutral-400 text-sm mb-3">{rec.reason}</p>
                        {rec.prerequisites.length > 0 && (
                          <div className="text-xs text-neutral-500">
                            Prerequisites: {rec.prerequisites.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card-premium p-6 text-center">
                <Zap className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-neutral-100">{analysis.missingSkills.length}</div>
                <div className="text-sm text-neutral-500">Skills to Learn</div>
              </div>
              <div className="card-premium p-6 text-center">
                <Clock className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-neutral-100">
                  {analysis.missingSkills.reduce((sum, s) => {
                    const weeks = parseInt(s.learningTime.match(/\d+/)?.[0] || '2');
                    return sum + weeks;
                  }, 0)} weeks
                </div>
                <div className="text-sm text-neutral-500">Est. Total Time</div>
              </div>
              <div className="card-premium p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-400">+{analysis.potentialScore - analysis.overallScore}</div>
                <div className="text-sm text-neutral-500">Potential Score Gain</div>
              </div>
            </div>
          </div>
        )}

        {/* Integration CTAs */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {onNavigateToResumeImprovement && (
            <div className="card-premium p-5 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/10 hover:scale-105 transition-transform cursor-pointer" onClick={onNavigateToResumeImprovement}>
              <div className="flex items-center gap-3">
                <FileSearch className="w-8 h-8 text-amber-400" />
                <div>
                  <h4 className="font-semibold text-neutral-100">Resume Improvement</h4>
                  <p className="text-sm text-neutral-500">Enhance your resume</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-500 ml-auto" />
              </div>
            </div>
          )}
          {onNavigateToLinkedIn && (
            <div className="card-premium p-5 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/10 hover:scale-105 transition-transform cursor-pointer" onClick={onNavigateToLinkedIn}>
              <div className="flex items-center gap-3">
                <Linkedin className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-neutral-100">LinkedIn Profile</h4>
                  <p className="text-sm text-neutral-500">Generate profile content</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-500 ml-auto" />
              </div>
            </div>
          )}
          {onNavigateToRoadmap && (
            <div className="card-premium p-5 bg-gradient-to-r from-green-500/5 to-teal-500/5 border-green-500/10 hover:scale-105 transition-transform cursor-pointer" onClick={onNavigateToRoadmap}>
              <div className="flex items-center gap-3">
                <Compass className="w-8 h-8 text-green-400" />
                <div>
                  <h4 className="font-semibold text-neutral-100">Career Roadmap</h4>
                  <p className="text-sm text-neutral-500">View your action plan</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-500 ml-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-neutral-800">
          <button onClick={onBack} className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button onClick={onContinue} className="btn-primary flex items-center gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
