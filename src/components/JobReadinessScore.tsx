// Job Readiness Score Component
// Displays career readiness score with detailed breakdown

import { useEffect, useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  Compass,
  Linkedin,
  FileSearch,
  Brain,
} from 'lucide-react';
import { ResumeData } from '../utils/resumeTypes';
import {
  calculateJobReadinessScore,
  getGradeLabel,
  getStatusMessage,
} from '../utils/jobReadinessScore';

interface JobReadinessScoreProps {
  resumeData: ResumeData;
  portfolioGenerated?: boolean;
  onViewPortfolio?: () => void;
  onImproveProfile?: () => void;
  onViewCareerCoach?: () => void;
  onViewLinkedIn?: () => void;
  onViewResumeImprovement?: () => void;
  onViewSkillsAnalytics?: () => void;
}

export default function JobReadinessScore({
  resumeData,
  portfolioGenerated = false,
  onViewPortfolio,
  onViewCareerCoach,
  onViewLinkedIn,
  onViewResumeImprovement,
  onViewSkillsAnalytics,
}: JobReadinessScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const result = calculateJobReadinessScore(resumeData);

  // Animate score on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = result.percentage / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= result.percentage) {
        setAnimatedScore(result.percentage);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.percentage]);

  const getScoreBgColor = () => {
    if (result.percentage >= 85) return 'bg-green-500/10 border-green-500/30';
    if (result.percentage >= 70) return 'bg-blue-500/10 border-blue-500/30';
    if (result.percentage >= 50) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-orange-500/10 border-orange-500/30';
  };

  const getScoreRingColor = () => {
    if (result.percentage >= 85) return 'stroke-green-400';
    if (result.percentage >= 70) return 'stroke-blue-400';
    if (result.percentage >= 50) return 'stroke-yellow-400';
    return 'stroke-orange-400';
  };

  const getStatusIcon = () => {
    if (result.percentage >= 80) {
      return <Trophy className="w-6 h-6 text-green-400" />;
    } else if (result.percentage >= 60) {
      return <TrendingUp className="w-6 h-6 text-blue-400" />;
    } else if (result.percentage >= 40) {
      return <Target className="w-6 h-6 text-yellow-400" />;
    }
    return <AlertTriangle className="w-6 h-6 text-orange-400" />;
  };

  // SVG circle calculations for progress ring
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="min-h-screen py-8 px-4 pt-20 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
            <Trophy className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-accent-300">Job Readiness Score</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Your Career Readiness</h1>
          <p className="text-neutral-400 text-lg">
            Based on your resume and portfolio, here's your job market readiness score.
          </p>
        </div>

        {/* Main Score Card */}
        <div className={`card-premium p-10 mb-8 ${getScoreBgColor()}`}>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Score Ring */}
            <div className="relative">
              <svg className="w-56 h-56 transform -rotate-90">
                {/* Background ring */}
                <circle
                  cx="112"
                  cy="112"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-neutral-800"
                />
                {/* Progress ring */}
                <circle
                  cx="112"
                  cy="112"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className={getScoreRingColor()}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset,
                    transition: 'stroke-dashoffset 0.1s ease-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-display font-bold text-neutral-100">
                  {animatedScore}
                </span>
                <span className="text-neutral-500 text-lg">/ 100</span>
              </div>
            </div>

            {/* Status Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                {getStatusIcon()}
                <span className="text-2xl font-display font-bold text-neutral-100">
                  {getGradeLabel(result.grade)}
                </span>
              </div>

              <p className="text-neutral-400 text-lg mb-6">
                {getStatusMessage(result.status)}
              </p>

              {portfolioGenerated && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">Portfolio Generated</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {onViewResumeImprovement && (
                  <button onClick={onViewResumeImprovement} className="btn-primary flex items-center justify-center gap-2">
                    <FileSearch className="w-4 h-4" />
                    Improve My Resume
                  </button>
                )}
                {onViewSkillsAnalytics && (
                  <button onClick={onViewSkillsAnalytics} className="btn-secondary flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 text-white">
                    <Brain className="w-4 h-4" />
                    Skills Analytics
                  </button>
                )}
                {onViewPortfolio && (
                  <button onClick={onViewPortfolio} className="btn-secondary flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0">
                    <Trophy className="w-4 h-4" />
                    View Portfolio
                  </button>
                )}
                {onViewLinkedIn && (
                  <button onClick={onViewLinkedIn} className="btn-secondary flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                  </button>
                )}
                {onViewCareerCoach && (
                  <button onClick={onViewCareerCoach} className="btn-secondary flex items-center justify-center gap-2">
                    <Compass className="w-4 h-4" />
                    Career Roadmap
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-100">Strengths</h3>
            </div>
            {result.strengths.length > 0 ? (
              <ul className="space-y-3">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-500">
                Complete your profile to see your strengths!
              </p>
            )}
          </div>

          {/* Needs Improvement */}
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-100">Needs Improvement</h3>
            </div>
            {result.improvements.length > 0 ? (
              <ul className="space-y-3">
                {result.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-300">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-500">
                Great job! No major improvements needed right now.
              </p>
            )}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="card-premium p-6 mb-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-100">
                Score Breakdown
              </h3>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-neutral-500 transition-transform ${
                showDetails ? 'rotate-90' : ''
              }`}
            />
          </button>

          {showDetails && (
            <div className="mt-6 space-y-4">
              {result.categories.map((category, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-200">{category.name}</span>
                    <span className="text-neutral-400">
                      {category.score} / {category.maxScore}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        category.passed
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      }`}
                      style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.details.map((detail, j) => (
                      <span
                        key={j}
                        className={`px-2 py-1 rounded-lg text-xs ${
                          detail.toLowerCase().includes('excellent') ||
                          detail.toLowerCase().includes('great') ||
                          detail.toLowerCase().includes('connected')
                            ? 'bg-green-500/10 text-green-300'
                            : detail.toLowerCase().includes('good')
                            ? 'bg-blue-500/10 text-blue-300'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-accent-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-neutral-100">
              AI Recommendations
            </h3>
          </div>

          {result.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-300">
                  <Sparkles className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-neutral-400">Your profile is in great shape!</p>
              <p className="text-neutral-500 text-sm">
                Focus on networking and applying to jobs.
              </p>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm mb-4">
            Your score updates automatically as you improve your profile
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs">
              {result.totalScore} total points
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs">
              {result.strengths.length} strengths
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs">
              {result.improvements.length} improvements
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs">
              {result.recommendations.length} recommendations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export scoring function for use elsewhere
export { calculateJobReadinessScore } from '../utils/jobReadinessScore';
