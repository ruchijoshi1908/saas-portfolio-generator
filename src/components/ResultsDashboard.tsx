// Results Dashboard Component
// Central hub showing all generated career assets after portfolio creation

import {
  Globe,
  Pencil,
  Download,
  Target,
  Linkedin,
  FileSearch,
  Compass,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ResultsDashboardProps {
  onViewPortfolio: () => void;
  onEditPortfolio: () => void;
  onViewScore: () => void;
  onViewLinkedIn: () => void;
  onViewResumeImprovement: () => void;
  onViewCareerRoadmap: () => void;
  onViewSkillsAnalytics: () => void;
  portfolioGenerated: boolean;
}

// Feature Navigation Component - used across all feature pages
export const FeatureNav = ({ currentView, onNavigate }: { currentView: string; onNavigate: (view: string) => void }) => {
  const features = [
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'score', label: 'Job Score', icon: Target },
    { id: 'career-coach', label: 'Roadmap', icon: Compass },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'resume-improvement', label: 'Resume', icon: FileSearch },
    { id: 'skills-analytics', label: 'Skills', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 sm:relative sm:border-t-0 sm:bg-transparent sm:backdrop-blur-none">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2 sm:py-0 scrollbar-hide">
          {features.map((feature) => {
            const isActive = currentView === feature.id;
            return (
              <button
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg whitespace-nowrap transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                <feature.icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{feature.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function ResultsDashboard({
  onViewPortfolio,
  onEditPortfolio,
  onViewScore,
  onViewLinkedIn,
  onViewResumeImprovement,
  onViewCareerRoadmap,
  onViewSkillsAnalytics,
  portfolioGenerated,
}: ResultsDashboardProps) {
  const features = [
    {
      id: 'portfolio',
      title: 'Your Portfolio',
      description: 'Your professional portfolio website is ready to view and share.',
      icon: Globe,
      isPrimary: true,
      actions: [
        { label: 'View Portfolio', icon: ExternalLink, onClick: onViewPortfolio, primary: true },
        { label: 'Edit Portfolio', icon: Pencil, onClick: onEditPortfolio },
        { label: 'Download', icon: Download, onClick: () => {} },
      ],
      status: portfolioGenerated ? 'ready' : 'pending',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'score',
      title: 'Job Readiness Score',
      description: 'Evaluate your career readiness and identify areas for improvement.',
      icon: Target,
      isPrimary: false,
      onClick: onViewScore,
      status: 'available',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Profile Generator',
      description: 'Generate optimized LinkedIn content from your resume.',
      icon: Linkedin,
      isPrimary: false,
      onClick: onViewLinkedIn,
      status: 'available',
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'resume',
      title: 'Resume Improvement',
      description: 'Get AI suggestions to enhance your resume sections.',
      icon: FileSearch,
      isPrimary: false,
      onClick: onViewResumeImprovement,
      status: 'available',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 'roadmap',
      title: 'Career Roadmap',
      description: 'Receive personalized career guidance and action steps.',
      icon: Compass,
      isPrimary: false,
      onClick: onViewCareerRoadmap,
      status: 'available',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 'skills',
      title: 'Skills Analytics',
      description: 'Analyze skill levels, identify gaps, and get learning recommendations.',
      icon: BarChart3,
      isPrimary: false,
      onClick: onViewSkillsAnalytics,
      status: 'available',
      gradient: 'from-purple-500 to-violet-600',
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 pt-20 pb-20 sm:pb-8 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 sm:mb-8">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">All Systems Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4">
            <span className="text-neutral-100">Your Career Assets Are</span>{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Ready!</span>
          </h1>

          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            Your portfolio has been generated successfully. Access all your AI-powered career tools below.
          </p>
        </div>

        {/* Feature Navigation Bar */}
        <div className="mb-8 hidden sm:block">
          <div className="glass rounded-2xl p-2 border border-neutral-800">
            <div className="flex items-center gap-2 overflow-x-auto">
              {features.filter(f => !f.isPrimary).map((feature) => (
                <button
                  key={feature.id}
                  onClick={feature.onClick}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-white/5 transition-all text-sm font-medium whitespace-nowrap"
                >
                  <feature.icon className="w-4 h-4" />
                  <span>{feature.title.replace(' Generator', '').replace(' Analytics', '')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Portfolio Card */}
        <div className="mb-8 sm:mb-10">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-emerald-500/20 p-6 sm:p-8 md:p-10">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
              {/* Icon & Status */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 sm:mb-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs sm:text-sm font-medium">Portfolio Generated Successfully</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-neutral-100 mb-1 sm:mb-2">
                  Your Professional Portfolio
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base lg:text-lg">
                  Your portfolio website is ready to view, edit, and share with employers and connections.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={onViewPortfolio}
                  className="flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-semibold text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  View Portfolio
                </button>
                <button
                  onClick={onEditPortfolio}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl glass border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-medium text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-4 mb-6 hidden">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
          <span className="text-neutral-500 text-sm font-medium">More Career Tools</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {features.filter(f => !f.isPrimary).map((feature) => (
            <button
              key={feature.id}
              onClick={feature.onClick}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl glass border border-neutral-800 hover:border-neutral-700 p-4 sm:p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base lg:text-lg font-display font-semibold text-neutral-100 mb-1 sm:mb-2 group-hover:text-white transition-colors">
                  {feature.title.replace(' Generator', '').replace(' Analytics', '')}
                </h3>

                {/* Description - hidden on small screens */}
                <p className="text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4 group-hover:text-neutral-300 transition-colors hidden sm:line-clamp-2">
                  {feature.description}
                </p>

                {/* Action indicator */}
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 sm:mt-10">
          <p className="text-neutral-500 text-xs sm:text-sm">
            Your portfolio is saved automatically. Tap any tool above to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
