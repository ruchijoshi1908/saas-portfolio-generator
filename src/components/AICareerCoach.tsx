// AI Career Coach Component
// Displays personalized career roadmap with timeline and checklist

import { useState, useEffect } from 'react';
import {
  Compass,
  Map,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Code2,
  Users,
  FolderKanban,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Award,
  BarChart3,
  ExternalLink,
  Rocket,
  ArrowDown,
  PartyPopper,
  DollarSign,
  Building2,
  TrendingUp as TrendingUpIcon,
  BookOpen,
  Video,
  Globe,
} from 'lucide-react';
import { ResumeData } from '../utils/resumeTypes';
import { generateCareerRoadmap, CareerRoadmap, RoadmapAction, LearningResource } from '../utils/careerCoach';

interface AICareerCoachProps {
  resumeData: ResumeData;
  onViewScore?: () => void;
  onImproveProfile?: () => void;
}

const categoryIcons: Record<RoadmapAction['category'], any> = {
  profile: Star,
  skills: Code2,
  projects: FolderKanban,
  experience: Briefcase,
  network: Users,
};

const categoryColors: Record<RoadmapAction['category'], string> = {
  profile: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  skills: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  projects: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
  experience: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  network: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const priorityConfig: Record<RoadmapAction['priority'], { label: string; color: string; bgColor: string }> = {
  high: { label: 'High Priority', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' },
  medium: { label: 'Medium Priority', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/30' },
  low: { label: 'Low Priority', color: 'text-neutral-400', bgColor: 'bg-neutral-800 border-neutral-700' },
};

const levelBadgeColors: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  intermediate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  advanced: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

const industryDemandConfig: Record<string, { label: string; color: string }> = {
  very_high: { label: 'Very High Demand', color: 'text-green-400 bg-green-500/10' },
  high: { label: 'High Demand', color: 'text-emerald-400 bg-emerald-500/10' },
  medium: { label: 'Medium Demand', color: 'text-yellow-400 bg-yellow-500/10' },
  growing: { label: 'Growing Demand', color: 'text-blue-400 bg-blue-500/10' },
};

const platformIcons: Record<LearningResource['platform'], any> = {
  official: BookOpen,
  freecodecamp: Code2,
  coursera: Globe,
  youtube: Video,
  other: ExternalLink,
};

const platformColors: Record<LearningResource['platform'], string> = {
  official: 'text-blue-400 bg-blue-500/10',
  freecodecamp: 'text-green-400 bg-green-500/10',
  coursera: 'text-purple-400 bg-purple-500/10',
  youtube: 'text-red-400 bg-red-500/10',
  other: 'text-neutral-400 bg-neutral-800',
};

export default function AICareerCoach({ resumeData, onViewScore, onImproveProfile }: AICareerCoachProps) {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const generated = generateCareerRoadmap(resumeData);
    setRoadmap(generated);
  }, [resumeData]);

  // Check if all tasks are completed
  useEffect(() => {
    if (roadmap && roadmap.actionsCompleted === roadmap.totalActions && roadmap.totalActions > 0) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [roadmap?.actionsCompleted, roadmap?.totalActions]);

  if (!roadmap) return null;

  const toggleAction = (id: string) => {
    setExpandedAction(prev => (prev === id ? null : id));
  };

  const toggleActionComplete = (id: string) => {
    if (!roadmap) return;
    const action = roadmap.nextActions.find(a => a.id === id);
    if (!action) return;

    const updatedActions = roadmap.nextActions.map(a =>
      a.id === id ? { ...a, completed: !a.completed } : a
    );
    const completed = updatedActions.filter(a => a.completed).length;
    const progress = Math.round((completed / updatedActions.length) * 100);
    const completedImpact = updatedActions
      .filter(a => a.completed)
      .reduce((sum, a) => sum + a.impact, 0);

    setRoadmap({
      ...roadmap,
      nextActions: updatedActions,
      actionsCompleted: completed,
      progressPercentage: progress,
      completedImpactPoints: completedImpact,
    });
  };

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
          {onViewScore && (
            <button
              onClick={onViewScore}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Score
            </button>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
            <Compass className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-accent-300">AI Career Coach</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Your Career Roadmap</h1>
          <p className="text-neutral-400 text-lg">
            A personalized plan to advance your career and boost your Job Readiness Score.
          </p>
        </div>

        {/* Completion State */}
        {isCompleted && (
          <div className="card-premium p-8 mb-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-green-400 mb-3">Congratulations! You've completed your roadmap!</h2>
            <p className="text-neutral-300 mb-4">All recommended actions have been completed. Here's your progress:</p>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">{roadmap.currentScore + roadmap.completedImpactPoints}</div>
                <div className="text-sm text-neutral-500">Final Score</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">+{roadmap.completedImpactPoints}</div>
                <div className="text-sm text-neutral-500">Points Gained</div>
              </div>
            </div>
            <p className="text-neutral-400 text-lg">
              You're now ready to start applying for internships and jobs. Your profile has been significantly strengthened!
            </p>
          </div>
        )}

        {/* Current Level & Recommended Path */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current Level */}
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-neutral-100">Current Career Level</h3>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 ${levelBadgeColors[roadmap.currentLevel]}`}>
              <Zap className="w-4 h-4" />
              <span className="font-semibold capitalize">{roadmap.currentLevel}</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {roadmap.levelDescription}
            </p>
          </div>

          {/* Recommended Path */}
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                <Compass className="w-5 h-5 text-accent-400" />
              </div>
              <h3 className="font-display font-semibold text-neutral-100">Recommended Path</h3>
            </div>
            <h4 className="text-xl font-display font-bold text-neutral-100 mb-2">
              {roadmap.recommendedPath.name}
            </h4>
            <p className="text-neutral-400 text-sm mb-4">{roadmap.recommendedPath.description}</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-xs font-medium">
                {roadmap.recommendedPath.matchPercentage}% match
              </span>
              <span className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-xs">
                {roadmap.recommendedPath.averageSalary}
              </span>
            </div>
          </div>
        </div>

        {/* Career Path Details */}
        <div className="card-premium p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-display font-semibold text-neutral-100">Career Path Details: {roadmap.recommendedPath.name}</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Salary Range */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Salary Range</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Entry</span>
                  <span className="text-neutral-300">{roadmap.recommendedPath.salaryRange.entry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Mid</span>
                  <span className="text-neutral-300">{roadmap.recommendedPath.salaryRange.mid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Senior</span>
                  <span className="text-neutral-300">{roadmap.recommendedPath.salaryRange.senior}</span>
                </div>
              </div>
            </div>

            {/* Key Skills */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4 text-primary-400" />
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Key Skills</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {roadmap.recommendedPath.keySkills.slice(0, 4).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Industry Demand */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Industry Demand</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${industryDemandConfig[roadmap.recommendedPath.industryDemand].color}`}>
                {industryDemandConfig[roadmap.recommendedPath.industryDemand].label}
              </span>
            </div>

            {/* Growth Outlook */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUpIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Growth Outlook</span>
              </div>
              <p className="text-sm text-neutral-300">{roadmap.recommendedPath.growthRate}</p>
              <p className="text-xs text-neutral-500 mt-1">{roadmap.recommendedPath.growthOutlook}</p>
            </div>
          </div>
        </div>

        {/* Alternative Paths */}
        {roadmap.alternativePaths.length > 0 && (
          <div className="card-premium overflow-hidden mb-8">
            <button
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                  <Map className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-neutral-100">Alternative Career Paths</h3>
                  <p className="text-neutral-500 text-sm">Explore other directions</p>
                </div>
              </div>
              {showAlternatives ? (
                <ChevronUp className="w-5 h-5 text-neutral-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              )}
            </button>
            {showAlternatives && (
              <div className="p-6 pt-0 space-y-4">
                {roadmap.alternativePaths.map((path, i) => (
                  <div key={i} className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-neutral-200 mb-1">{path.name}</h4>
                      <p className="text-neutral-500 text-sm">{path.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {path.requiredSkills.map((skill, j) => (
                          <span key={j} className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="px-3 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-sm font-medium">
                        {path.matchPercentage}% match
                      </span>
                      <p className="text-neutral-500 text-xs mt-2">{path.averageSalary}</p>
                      <p className="text-emerald-400 text-xs">{path.growthRate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Score Projection */}
        <div className="card-premium p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-display font-semibold text-neutral-100">Score Projection</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            {/* Current Score */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center mb-2">
                <span className="text-3xl font-display font-bold text-neutral-300">{roadmap.currentScore}</span>
              </div>
              <span className="text-neutral-500 text-sm">Current</span>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-green-400 hidden sm:block" />
              <ArrowDown className="w-6 h-6 text-green-400 sm:hidden" />
              <span className="text-green-400 font-semibold text-sm">+{roadmap.potentialScoreIncrease}</span>
            </div>

            {/* Projected Score */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-2">
                <span className="text-3xl font-display font-bold text-green-400">{roadmap.projectedScoreAfter}</span>
              </div>
              <span className="text-neutral-500 text-sm">Projected</span>
            </div>
          </div>

          <div className="h-3 bg-neutral-800 rounded-full overflow-hidden mb-4">
            <div className="h-full flex rounded-full overflow-hidden">
              <div
                className="bg-neutral-600 transition-all duration-500"
                style={{ width: `${roadmap.currentScore}%` }}
              />
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100 - roadmap.currentScore, roadmap.potentialScoreIncrease)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-400 text-sm">
              Estimated timeline: <strong className="text-neutral-200">{roadmap.estimatedWeeksRange.min}–{roadmap.estimatedWeeksRange.max} weeks</strong>
            </span>
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="card-premium p-6 mb-8 bg-gradient-to-r from-primary-500/5 to-accent-500/5 border-primary-500/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <p className="text-neutral-200 text-lg font-medium mb-3">{roadmap.motivationalMessage}</p>
              <ul className="space-y-2">
                {roadmap.encouragementPoints.map((point, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="card-premium p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-neutral-100">Your Progress</h3>
                <p className="text-neutral-500 text-sm">{roadmap.actionsCompleted} of {roadmap.totalActions} actions completed</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-primary-400 font-semibold text-lg">{roadmap.progressPercentage}%</span>
              {roadmap.completedImpactPoints > 0 && (
                <p className="text-green-400 text-xs">+{roadmap.completedImpactPoints} pts</p>
              )}
            </div>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-500"
              style={{ width: `${roadmap.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Next Actions - Timeline Layout */}
        <div className="card-premium p-6 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-neutral-100">Next Recommended Actions</h3>
              <p className="text-neutral-500 text-sm">Complete these to boost your career readiness</p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-neutral-800" />

            <div className="space-y-6">
              {roadmap.nextActions.map((action, index) => {
                const CategoryIcon = categoryIcons[action.category];
                const isExpanded = expandedAction === action.id;
                const priority = priorityConfig[action.priority];

                return (
                  <div key={action.id} className="relative flex gap-5">
                    {/* Timeline Node */}
                    <div className="relative z-10">
                      <button
                        onClick={() => toggleActionComplete(action.id)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          action.completed
                            ? 'bg-green-500/20 border border-green-500/30'
                            : 'bg-neutral-800 border border-neutral-700 hover:border-primary-500/30'
                        }`}
                      >
                        {action.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <span className="text-neutral-400 font-semibold">{index + 1}</span>
                        )}
                      </button>
                    </div>

                    {/* Action Card */}
                    <div className={`flex-1 glass rounded-xl p-5 transition-all ${action.completed ? 'opacity-60' : ''}`}>
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleAction(action.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${categoryColors[action.category]}`}>
                              <CategoryIcon className="w-3 h-3 inline mr-1" />
                              {action.category}
                            </span>
                            <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                              {priority.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-neutral-500">
                              <Clock className="w-3 h-3" />
                              ~{action.estimatedDays} days
                            </span>
                            <span className="flex items-center gap-1 text-primary-400 font-semibold">
                              <TrendingUp className="w-3 h-3" />
                              +{action.impact}
                            </span>
                          </div>
                        </div>

                        <h4 className={`font-display font-semibold mb-2 ${action.completed ? 'line-through text-neutral-500' : 'text-neutral-100'}`}>
                          {action.title}
                        </h4>
                        <p className="text-neutral-400 text-sm">{action.description}</p>
                      </div>

                      {/* Expanded Resources */}
                      {isExpanded && action.resources && action.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-neutral-800">
                          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-3">Learning Resources</p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {action.resources.map((resource, j) => {
                              const PlatformIcon = platformIcons[resource.platform];
                              return (
                                <a
                                  key={j}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${platformColors[resource.platform]} hover:opacity-80`}
                                >
                                  <PlatformIcon className="w-4 h-4" />
                                  <span className="truncate">{resource.title}</span>
                                  {resource.isFree && (
                                    <span className="text-xs px-1 py-0.5 rounded bg-green-500/20 text-green-400">Free</span>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Expand indicator */}
                      <div className="mt-3 flex justify-center">
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Required Skills for Recommended Path */}
        <div className="card-premium p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-neutral-100">Skills for {roadmap.recommendedPath.name}</h3>
              <p className="text-neutral-500 text-sm">Key skills employers look for</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {roadmap.recommendedPath.requiredSkills.map((skill, i) => {
              const hasSkill = resumeData.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
              return (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    hasSkill
                      ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                      : 'bg-neutral-800 border border-neutral-700 text-neutral-400'
                  }`}
                >
                  {hasSkill ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Career Tip */}
        <div className="card-premium p-6 mb-8 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">Career Tip</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-xs capitalize">
                  {roadmap.careerTip.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">{roadmap.careerTip.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{roadmap.careerTip.content}</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 pb-8">
          {onImproveProfile && (
            <button onClick={onImproveProfile} className="btn-secondary flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Update My Profile
            </button>
          )}
          {onViewScore && (
            <button onClick={onViewScore} className="btn-outline flex items-center justify-center gap-2">
              <Award className="w-4 h-4" />
              View Job Readiness Score
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
