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
    <div className="min-h-screen py-8 px-4 pt-20 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">All Systems Ready</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-neutral-100">Your Career Assets Are</span>{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Ready!</span>
          </h1>

          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Your portfolio has been generated successfully. Access all your AI-powered career tools below.
          </p>
        </div>

        {/* Primary Portfolio Card */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-emerald-500/20 p-8 md:p-10">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              {/* Icon & Status */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Globe className="w-12 h-12 text-emerald-400" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">Portfolio Generated Successfully</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-100 mb-2">
                  Your Professional Portfolio
                </h2>
                <p className="text-neutral-400 text-lg">
                  Your portfolio website is ready to view, edit, and share with employers and connections.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={onViewPortfolio}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Portfolio
                </button>
                <button
                  onClick={onEditPortfolio}
                  className="px-6 py-4 rounded-xl glass border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="px-6 py-4 rounded-xl glass border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
          <span className="text-neutral-500 text-sm font-medium">More Career Tools</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.filter(f => !f.isPrimary).map((feature) => (
            <button
              key={feature.id}
              onClick={feature.onClick}
              className="group relative overflow-hidden rounded-2xl glass border border-neutral-800 hover:border-neutral-700 p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-display font-semibold text-neutral-100 mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-sm mb-4 group-hover:text-neutral-300 transition-colors">
                  {feature.description}
                </p>

                {/* Action indicator */}
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-center mt-10">
          <p className="text-neutral-500 text-sm">
            Your portfolio is saved automatically. You can return to view or edit it anytime by clicking the Portfolio button in the navigation.
          </p>
        </div>
      </div>
    </div>
  );
}
