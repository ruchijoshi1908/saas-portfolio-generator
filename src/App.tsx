import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  User,
  Code2,
  FolderKanban,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Upload,
  X,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Zap,
  Shield,
  CheckCircle2,
  Globe,
  Trophy,
  Star,
  Clock,
  FileText,
  Target,
  TrendingUp,
  Map,
  Users,
  GraduationCap,
  Briefcase,
  Palette,
  RefreshCw,
  Award,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Play,
  BarChart3,
  Compass,
  FileSearch,
  MessageSquare,
} from 'lucide-react';
import ResumeUpload from './components/ResumeUpload';
import ResumeReview from './components/ResumeReview';
import JobReadinessScore from './components/JobReadinessScore';
import AICareerCoach from './components/AICareerCoach';
import LinkedInGenerator from './components/LinkedInGenerator';
import ResumeImprovement from './components/ResumeImprovement';
import SkillsAnalytics from './components/SkillsAnalytics';
import ResultsDashboard from './components/ResultsDashboard';
import PortfolioView from './components/PortfolioView';
import PublicPortfolio from './components/PublicPortfolio';
import { ResumeData, emptyResumeData, PortfolioData as PortfolioDataType } from './utils/resumeTypes';
import { savePortfolio, getPublicAppUrl } from './utils/supabase';

// Re-export for local use
type PortfolioData = PortfolioDataType;

interface Project {
  title: string;
  description: string;
  tech: string[];
  url: string;
  image?: string;
}

const emptyProject: Project = {
  title: '',
  description: '',
  tech: [],
  url: '',
  image: '',
};

// ============================================================================
// CAREERLAUNCH AI LANDING PAGE
// ============================================================================

interface LandingPageProps {
  onGetStarted: () => void;
  onViewExample: (data: PortfolioData) => void;
}

const LandingPage = ({ onGetStarted, onViewExample }: LandingPageProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Graduate, Stanford",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
      text: "CareerLaunch AI helped me create a professional portfolio in just 10 minutes. I landed my first developer interview within a week!",
    },
    {
      name: "Marcus Johnson",
      role: "UX Designer, Career Changer",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
      text: "As someone transitioning from marketing to design, this tool gave me the confidence to showcase my new skills professionally.",
    },
    {
      name: "Priya Patel",
      role: "Data Science Student, MIT",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
      text: "The AI-powered suggestions helped me highlight projects I didn't even realize were portfolio-worthy. Incredible platform!",
    },
  ];

  const faqs = [
    {
      q: "How does CareerLaunch AI work?",
      a: "Simply upload your resume or enter your information through our intuitive form, and our AI will instantly generate a professional portfolio, LinkedIn profile content, and career insights. No coding or design skills required.",
    },
    {
      q: "Is CareerLaunch AI free to use?",
      a: "Yes! Our core features including portfolio generator, LinkedIn profile generator, job readiness score, and career roadmap are completely free. We believe everyone deserves access to professional career tools.",
    },
    {
      q: "What can I generate with CareerLaunch AI?",
      a: "You can generate a professional portfolio website, optimized LinkedIn profile content (headlines, about sections, skills), get a job readiness score, and receive a personalized career roadmap with learning resources.",
    },
    {
      q: "How accurate is the job readiness score?",
      a: "Our AI analyzes multiple factors including skills, projects, experience, and online presence to calculate your readiness score. It's designed to give you actionable insights on improving your profile.",
    },
    {
      q: "Who is CareerLaunch AI for?",
      a: "We designed CareerLaunch AI for students, fresh graduates, internship seekers, developers, designers, and anyone looking to build a professional online presence quickly.",
    },
  ];

  const StepCard = ({ num, icon: Icon, title, desc }: { num: number; icon: any; title: string; desc: string }) => (
    <div className="relative">
      <div className="card-premium p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
            <span className="text-neutral-950 font-bold text-lg">{num}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-primary-400" />
              <h3 className="font-display font-semibold text-neutral-100">{title}</h3>
            </div>
            <p className="text-neutral-400 text-sm">{desc}</p>
          </div>
        </div>
      </div>
      {num < 5 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-primary-500/30 z-0" />
      )}
    </div>
  );

  const AudienceCard = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
    <div className="card-premium p-6 text-center group">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-accent-400" />
      </div>
      <h3 className="font-display font-semibold text-neutral-100 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm">{desc}</p>
    </div>
  );

  const BenefitCard = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
      <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary-400" />
      </div>
      <div>
        <h4 className="font-medium text-neutral-100 mb-1">{title}</h4>
        <p className="text-neutral-500 text-sm">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950">
      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Ambient light effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] animate-float" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px] animate-float-slow" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-neutral-950" />
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight text-neutral-100">CareerLaunch</span>
                <span className="text-primary-400 text-xs ml-1">AI</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden md:block text-neutral-400 hover:text-neutral-200 transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="hidden md:block text-neutral-400 hover:text-neutral-200 transition-colors text-sm">How It Works</a>
              <a href="#faq" className="hidden md:block text-neutral-400 hover:text-neutral-200 transition-colors text-sm">FAQ</a>
              <button
                onClick={onGetStarted}
                className="btn-primary text-sm flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-primary-500/20 animate-fade-in mb-8">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">6 AI Tools Available Now</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span className="text-sm text-neutral-400">Complete Career Toolkit</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-neutral-100 block">Turn Your Resume Into a</span>
            <span className="gradient-text text-shadow-glow block">Complete Professional Identity</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Generate a professional portfolio website, LinkedIn profile content, get your job readiness score, and receive a personalized career roadmap. Built for students, graduates, and job seekers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={onGetStarted}
              className="btn-primary flex items-center gap-3 text-base px-8 py-5"
            >
              <Rocket className="w-5 h-5" />
              Build My Professional Presence
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                onViewExample({
                  profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
                  name: 'Alexandra Chen',
                  role: 'Senior Product Designer',
                  about: 'Award-winning designer with 8+ years crafting digital experiences for Fortune 500 companies and innovative startups. Passionate about human-centered design, accessibility, and pushing creative boundaries.',
                  skills: ['Product Design', 'Design Systems', 'Figma', 'Prototyping', 'User Research', 'Framer', 'Webflow', 'Motion Design'],
                  projects: [
                    {
                      title: 'Atlas Design System',
                      description: 'Enterprise-grade design system serving 200+ designers. Reduced development time by 60%.',
                      tech: ['Figma', 'React', 'Storybook', 'TypeScript'],
                      url: 'https://github.com',
                      image: 'https://images.pexels.com/photos/17794896/pexels-photo-17794896.jpeg?auto=compress&cs=tinysrgb&w=600',
                    },
                    {
                      title: 'Nova Banking App',
                      description: 'Complete redesign of a neo-banking mobile application. 4.8 App Store rating.',
                      tech: ['Figma', 'Protopie', 'iOS', 'Android'],
                      url: 'https://github.com',
                      image: 'https://images.pexels.com/photos/838644/pexels-photo-838644.jpeg?auto=compress&cs=tinysrgb&w=600',
                    },
                    {
                      title: 'Meridian Dashboard',
                      description: 'Real-time analytics platform for e-commerce merchants. Featured in Awwwards.',
                      tech: ['Framer', 'Next.js', 'D3.js', 'Supabase'],
                      url: 'https://github.com',
                      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
                    },
                  ],
                  github: 'https://github.com',
                  linkedin: 'https://linkedin.com',
                  email: 'alex@example.com',
                  phone: '',
                  location: '',
                  workExperience: [],
                  education: [],
                  certifications: [],
                  achievements: [],
                });
              }}
              className="btn-outline flex items-center gap-2 text-base"
            >
              <Play className="w-5 h-5" />
              View Demo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-neutral-500 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-medium">Fast Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-medium">Professional Results</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-medium">Student Friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <Lightbulb className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-300">Features</span>
            </div>
            <h2 className="section-title text-neutral-100 mb-4">Everything You Need to Launch Your Career</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Comprehensive tools designed to help you stand out in today's competitive job market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "AI Portfolio Generator",
                desc: "Create a stunning, professional portfolio website in minutes. No coding required.",
                available: true,
              },
              {
                icon: Linkedin,
                title: "AI LinkedIn Profile Generator",
                desc: "Generate compelling headlines, about sections, and optimized profile content.",
                available: true,
              },
              {
                icon: FileText,
                title: "AI Resume Improvement",
                desc: "Get AI-powered suggestions, section analysis, and improvement recommendations.",
                available: true,
              },
              {
                icon: Target,
                title: "Job Readiness Score",
                desc: "Evaluate your career readiness and identify areas for improvement.",
                available: true,
              },
              {
                icon: Map,
                title: "AI Career Roadmap",
                desc: "Receive personalized next steps, learning resources, and actionable career guidance.",
                available: true,
              },
              {
                icon: BarChart3,
                title: "Skills Analytics",
                desc: "Understand skill levels, identify gaps, and get learning recommendations.",
                available: true,
              },
            ].map((feature, i) => (
              <div key={i} className={`card-premium p-8 relative group ${!feature.available ? 'opacity-70' : ''}`}>
                {!feature.available && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium">
                    Coming Soon
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl ${feature.available ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-neutral-800'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.available ? 'text-primary-400' : 'text-neutral-500'}`} />
                </div>
                <h3 className="text-xl font-display font-semibold text-neutral-100 mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                {feature.available && (
                  <button
                    onClick={onGetStarted}
                    className="mt-6 text-primary-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Try Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 lg:px-8 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
              <Play className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-accent-300">How It Works</span>
            </div>
            <h2 className="section-title text-neutral-100 mb-4">From Resume to Career-Ready in Minutes</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Our AI-powered platform transforms your information into professional assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StepCard num={1} icon={Upload} title="Enter Your Info" desc="Add your skills, projects, and experience details" />
            <StepCard num={2} icon={Sparkles} title="AI Analysis" desc="Our AI analyzes your skills and experience" />
            <StepCard num={3} icon={Globe} title="Generate Portfolio" desc="Instant professional portfolio website" />
            <StepCard num={4} icon={Linkedin} title="LinkedIn Content" desc="Optimized profile content ready to use" />
            <StepCard num={5} icon={TrendingUp} title="Career Insights" desc="Job readiness score and roadmap" />
          </div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <Users className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-300">Who Is It For</span>
            </div>
            <h2 className="section-title text-neutral-100 mb-4">Built for Career-Minded Individuals</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Whether you're just starting or making a change, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <AudienceCard icon={GraduationCap} title="Students" desc="Build your first professional presence" />
            <AudienceCard icon={Award} title="Fresh Graduates" desc="Stand out in the job market" />
            <AudienceCard icon={Briefcase} title="Internship Seekers" desc="Land competitive internships" />
            <AudienceCard icon={Code2} title="Developers" desc="Showcase your tech projects" />
            <AudienceCard icon={Palette} title="Designers" desc="Present your creative work" />
            <AudienceCard icon={RefreshCw} title="Career Changers" desc="Reposition your experience" />
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                <CheckCircle2 className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">Why Choose Us</span>
              </div>
              <h2 className="section-title text-neutral-100 mb-6">Why CareerLaunch AI?</h2>
              <p className="text-neutral-400 text-lg mb-8">
                We understand the challenges of breaking into today's competitive job market. Our platform is designed to give you every advantage.
              </p>

              <div className="space-y-2">
                <BenefitCard icon={Clock} title="Save Hours of Work" desc="What used to take days now takes minutes" />
                <BenefitCard icon={Rocket} title="Quick Setup" desc="Generate a professional presence in under 10 minutes" />
                <BenefitCard icon={TrendingUp} title="Improve Employability" desc="Present yourself like a seasoned professional" />
                <BenefitCard icon={Sparkles} title="AI-Powered" desc="Smart recommendations tailored to your career" />
                <BenefitCard icon={Star} title="Beginner Friendly" desc="No technical or design skills required" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-3xl blur-3xl" />
              <div className="relative card-premium p-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center mb-4">
                    <TrendingUp className="w-10 h-10 text-neutral-950" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-neutral-100 mb-2">All-In-One Platform</h3>
                  <p className="text-neutral-400">Your complete career toolkit</p>
                </div>

                <div className="space-y-4">
                  <div className="glass rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-neutral-400">Portfolio Ready</span>
                      <span className="text-sm text-primary-400 font-medium">Available</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full" />
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-neutral-400">LinkedIn Optimized</span>
                      <span className="text-sm text-primary-400 font-medium">Available</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full" />
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-neutral-400">Career Roadmap</span>
                      <span className="text-sm text-primary-400 font-medium">Available</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full" />
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 opacity-60">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-neutral-400">Resume Analyzed</span>
                      <span className="text-sm text-neutral-500 font-medium">Coming Soon</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-neutral-700 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
              <Map className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-accent-300">Roadmap</span>
            </div>
            <h2 className="section-title text-neutral-100 mb-4">What's Coming Next</h2>
            <p className="text-neutral-400 text-lg">
              We're building the complete career toolkit. Here's what's next on our roadmap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Linkedin, title: "LinkedIn Profile Generator", desc: "AI-optimized profile content", available: true },
              { icon: Compass, title: "Career Roadmap Generator", desc: "Personalized career guidance", available: true },
              { icon: FileSearch, title: "Resume Improvement", desc: "Smart analysis and suggestions", available: true },
              { icon: BarChart3, title: "Skills Analytics", desc: "Skill levels and gap analysis", available: true },
              { icon: Target, title: "ATS Resume Score", desc: "Beat applicant tracking systems", available: false },
              { icon: MessageSquare, title: "Interview Prep Assistant", desc: "Practice with AI feedback", available: false },
            ].map((item, i) => (
              <div key={i} className={`card-premium p-5 flex items-center gap-4 group ${!item.available ? 'opacity-60' : ''}`}>
                <div className={`w-12 h-12 rounded-xl ${item.available ? 'bg-green-500/10 border border-green-500/20' : 'bg-accent-500/10 border border-accent-500/20'} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                  <item.icon className={`w-6 h-6 ${item.available ? 'text-green-400' : 'text-accent-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-neutral-100">{item.title}</h3>
                  <p className="text-neutral-500 text-sm">{item.desc}</p>
                </div>
                {item.available && (
                  <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium">Available</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <MessageSquare className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-300">Testimonials</span>
            </div>
            <h2 className="section-title text-neutral-100 mb-4">What Our Users Say</h2>
            <p className="text-neutral-400 text-lg">
              Join thousands of students and professionals building their careers with us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div key={i} className="card-premium p-8">
                <div className="flex items-center gap-4 mb-6">
                  <img src={test.image} alt={test.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-display font-semibold text-neutral-100">{test.name}</h4>
                    <p className="text-neutral-500 text-sm">{test.role}</p>
                  </div>
                </div>
                <p className="text-neutral-300 leading-relaxed">"{test.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary-400 text-primary-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6">
              <Shield className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-accent-300">FAQ</span>
            </div>
            <h2 className="section-title text-neutral-100 mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-400 text-lg">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card-premium overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <h3 className="font-display font-semibold text-neutral-100 pr-8">{faq.q}</h3>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-primary-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-500 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-neutral-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8 bg-gradient-to-b from-neutral-900/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title gradient-text mb-6">Ready to Launch Your Career?</h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of students and professionals who are building their professional presence with CareerLaunch AI.
          </p>
          <button
            onClick={onGetStarted}
            className="btn-primary flex items-center gap-3 text-lg mx-auto"
          >
            <Rocket className="w-5 h-5" />
            Build My Professional Presence
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-neutral-950" />
                </div>
                <div>
                  <span className="font-display font-bold text-lg text-neutral-100">CareerLaunch</span>
                  <span className="text-primary-400 text-xs ml-1">AI</span>
                </div>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Helping students and professionals build their professional presence with AI-powered tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-neutral-500 hover:text-neutral-300 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-neutral-500 hover:text-neutral-300 transition-colors">How It Works</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-300 transition-colors">Portfolio Generator</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-300 transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 mb-4">Coming Soon</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-neutral-600">ATS Resume Score</span></li>
                <li><span className="text-neutral-600">Interview Prep</span></li>
                <li><span className="text-neutral-600">Cover Letter Generator</span></li>
                <li><span className="text-neutral-600">Job Matching</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="text-neutral-500 hover:text-neutral-300 transition-colors">FAQ</a></li>
                <li><span className="text-neutral-500">About</span></li>
                <li><span className="text-neutral-500">Blog</span></li>
                <li><span className="text-neutral-500">Contact</span></li>
              </ul>
            </div>
          </div>
          <div className="divider mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-600 text-sm">2024 CareerLaunch AI. All rights reserved.</p>
            <p className="text-neutral-600 text-sm">Built with care for career-minded individuals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// PORTFOLIO FORM (PRESERVED FUNCTIONALITY)
// ============================================================================

interface PortfolioFormProps {
  portfolioData: PortfolioData;
  setPortfolioData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  onBack: () => void;
  onSubmit: () => void;
}

const PortfolioForm = ({ portfolioData, setPortfolioData, onBack, onSubmit }: PortfolioFormProps) => {
  const [newSkill, setNewSkill] = useState('');
  const [newTech, setNewTech] = useState<{ [key: number]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFileRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioData((prev) => {
          const newProjects = [...prev.projects];
          newProjects[index] = { ...newProjects[index], image: reader.result as string };
          return { ...prev, projects: newProjects };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setPortfolioData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setPortfolioData((prev) => ({ ...prev, projects: [...prev.projects, emptyProject] }));
  };

  const removeProject = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    setPortfolioData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const addTechToProject = (projectIndex: number) => {
    const tech = newTech[projectIndex]?.trim();
    if (tech) {
      setPortfolioData((prev) => {
        const newProjects = [...prev.projects];
        newProjects[projectIndex] = {
          ...newProjects[projectIndex],
          tech: [...newProjects[projectIndex].tech, tech],
        };
        return { ...prev, projects: newProjects };
      });
      setNewTech((prev) => ({ ...prev, [projectIndex]: '' }));
    }
  };

  const removeTechFromProject = (projectIndex: number, techIndex: number) => {
    setPortfolioData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[projectIndex] = {
        ...newProjects[projectIndex],
        tech: newProjects[projectIndex].tech.filter((_, i) => i !== techIndex),
      };
      return { ...prev, projects: newProjects };
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-neutral-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors mb-8 group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <Rocket className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">CareerLaunch AI Portfolio Builder</span>
          </div>
          <h1 className="section-title gradient-text mb-4">Build Your Portfolio</h1>
          <p className="text-neutral-400 text-lg">Enter your details to generate a stunning professional portfolio</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
          {/* Profile Image & Basic Info */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <User className="w-6 h-6 text-neutral-950" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-neutral-100">Personal Information</h2>
                <p className="text-neutral-500 text-sm">Your professional identity</p>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 rounded-3xl glass border-2 border-dashed border-primary-500/30 flex items-center justify-center cursor-pointer hover:border-primary-400/50 transition-all group overflow-hidden shrink-0"
              >
                {portfolioData.profileImage ? (
                  <img src={portfolioData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-primary-400 mx-auto mb-3" />
                    <span className="text-sm text-neutral-500">Upload Photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex-1 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={portfolioData.name}
                    onChange={(e) => setPortfolioData((prev) => ({ ...prev, name: e.target.value }))}
                    className="input-styled"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Professional Role *</label>
                  <input
                    type="text"
                    placeholder="Senior Product Designer"
                    value={portfolioData.role}
                    onChange={(e) => setPortfolioData((prev) => ({ ...prev, role: e.target.value }))}
                    className="input-styled"
                    required
                  />
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">About Me *</label>
              <textarea
                placeholder="Tell visitors about yourself, your experience, and what drives you..."
                value={portfolioData.about}
                onChange={(e) => setPortfolioData((prev) => ({ ...prev, about: e.target.value }))}
                rows={4}
                className="input-styled resize-none"
                required
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-neutral-950" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-neutral-100">Skills & Expertise</h2>
                <p className="text-neutral-500 text-sm">Showcase your technical abilities</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Add a skill (e.g., React, Python...)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="input-styled flex-1"
              />
              <button type="button" onClick={addSkill} className="btn-secondary px-6">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {portfolioData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="tag flex items-center gap-2 group animate-scale-in"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="card-premium p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-neutral-950" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-semibold text-neutral-100">Projects</h2>
                  <p className="text-neutral-500 text-sm">Your best work</p>
                </div>
              </div>
              <button type="button" onClick={addProject} className="btn-secondary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>

            {portfolioData.projects.length === 0 && (
              <div className="text-center py-16 text-neutral-600">
                <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-1">No projects yet</p>
                <p className="text-sm">Click "Add Project" to showcase your work</p>
              </div>
            )}

            <div className="space-y-6">
              {portfolioData.projects.map((project, index) => (
                <div key={index} className="glass rounded-2xl p-6 animate-scale-in">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-lg font-display font-medium text-neutral-300">Project {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-neutral-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Project Image */}
                    <div
                      onClick={() => projectFileRefs.current[index]?.click()}
                      className="aspect-video rounded-2xl glass border-2 border-dashed border-accent-500/30 flex items-center justify-center cursor-pointer hover:border-accent-400/50 transition-all overflow-hidden group relative"
                    >
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <Upload className="w-10 h-10 text-accent-400 mx-auto mb-3" />
                          <span className="text-sm text-neutral-500">Project Image</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={(el) => (projectFileRefs.current[index] = el)}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProjectImageUpload(index, e)}
                      className="hidden"
                    />

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="input-styled"
                      />
                      <input
                        type="url"
                        placeholder="Project URL (https://...)"
                        value={project.url}
                        onChange={(e) => updateProject(index, 'url', e.target.value)}
                        className="input-styled"
                      />
                    </div>
                  </div>

                  <textarea
                    placeholder="Describe your project, its impact, and your role..."
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    rows={2}
                    className="input-styled resize-none mt-6"
                  />

                  {/* Tech Stack */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-neutral-400 mb-3">Tech Stack</label>
                    <div className="flex gap-3 mb-4">
                      <input
                        type="text"
                        placeholder="Add technology..."
                        value={newTech[index] || ''}
                        onChange={(e) => setNewTech((prev) => ({ ...prev, [index]: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechToProject(index))}
                        className="input-styled flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => addTechToProject(index)}
                        className="btn-secondary px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="tag-accent flex items-center gap-2 text-sm"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechFromProject(index, techIndex)}
                            className="opacity-60 hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-neutral-300" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-neutral-100">Social Links</h2>
                <p className="text-neutral-500 text-sm">Connect with your audience</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={portfolioData.github}
                  onChange={(e) => setPortfolioData((prev) => ({ ...prev, github: e.target.value }))}
                  className="input-styled"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={portfolioData.linkedin}
                  onChange={(e) => setPortfolioData((prev) => ({ ...prev, linkedin: e.target.value }))}
                  className="input-styled"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={portfolioData.email}
                  onChange={(e) => setPortfolioData((prev) => ({ ...prev, email: e.target.value }))}
                  className="input-styled"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-6 pb-8">
            <button type="submit" className="btn-primary flex items-center gap-3 text-lg px-10 py-5">
              <Sparkles className="w-5 h-5" />
              Generate My Portfolio
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

// Parse the browser URL for a public portfolio route (/portfolio/:slug)
function parsePublicSlug(): string | null {
  const path = window.location.pathname;
  const match = path.match(/^\/portfolio\/([a-z0-9]+)$/i);
  return match ? match[1] : null;
}

function App() {
  const [publicSlug, setPublicSlug] = useState<string | null>(() => parsePublicSlug());
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'review' | 'form' | 'portfolio' | 'score' | 'career-coach' | 'linkedin' | 'resume-improvement' | 'skills-analytics' | 'results-dashboard'>('landing');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    profileImage: null,
    name: '',
    role: '',
    about: '',
    skills: [],
    projects: [],
    github: '',
    linkedin: '',
    email: '',
    phone: '',
    location: '',
    workExperience: [],
    education: [],
    certifications: [],
    achievements: [],
  });
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [portfolioGenerated, setPortfolioGenerated] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [, setIsSavingPortfolio] = useState(false);

  // Persist the public slug across navigation so the share URL stays stable
  useEffect(() => {
    if (publicSlug) {
      setShareUrl(`${getPublicAppUrl()}/portfolio/${publicSlug}`);
    }
  }, [publicSlug]);

  // Save portfolio to the database and set the share URL
  const persistPortfolio = async (data: PortfolioData) => {
    setIsSavingPortfolio(true);
    try {
      const slug = await savePortfolio(data);
      setPublicSlug(slug);
      setShareUrl(`${getPublicAppUrl()}/portfolio/${slug}`);
    } catch (err) {
      console.error('Failed to save portfolio for sharing:', err);
    } finally {
      setIsSavingPortfolio(false);
    }
  };

  // Feature navigation items
  const featureNavItems = [
    { id: 'results-dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'score', label: 'Job Score', icon: Target },
    { id: 'career-coach', label: 'Roadmap', icon: Compass },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'resume-improvement', label: 'Resume', icon: FileText },
    { id: 'skills-analytics', label: 'Skills', icon: BarChart3 },
  ];

  // Navigation bar component for views other than landing
  const NavigationBar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 text-neutral-100 font-semibold hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-neutral-950" />
            </div>
            <span className="font-display hidden sm:inline">CareerLaunch AI</span>
          </button>

          {/* Feature Navigation Chips */}
          {portfolioGenerated && (
            <div className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1">
              {featureNavItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            {!portfolioGenerated && currentView !== 'landing' && (
              <button
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-neutral-300 hover:text-neutral-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Home</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Feature Navigation */}
      {portfolioGenerated && (
        <div className="md:hidden border-t border-neutral-800">
          <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
            {featureNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );

  // Determine if we should show the navigation bar
  const showNavBar = currentView !== 'landing' && currentView !== 'upload' && currentView !== 'portfolio';

  // Dynamic top padding based on nav height
  const getTopPadding = () => {
    if (!showNavBar) return '';
    // Mobile with feature nav: 2 nav bars, regular: 1 nav bar
    return portfolioGenerated ? 'pt-28 md:pt-20' : 'pt-20';
  };

  // Render the public portfolio view if the URL matches /portfolio/:slug
  if (publicSlug && currentView === 'landing') {
    return (
      <PublicPortfolio
        slug={publicSlug}
        onBackToHome={() => {
          setPublicSlug(null);
          window.history.pushState({}, '', '/');
          setCurrentView('landing');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {showNavBar && <NavigationBar />}

      <div className={getTopPadding()}>
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentView('upload')}
            onViewExample={(data) => {
              setPortfolioData(data);
              setPortfolioGenerated(true);
              setCurrentView('portfolio');
              persistPortfolio(data);
            }}
          />
        )}
        {currentView === 'upload' && (
          <ResumeUpload
            onResumeParsed={(data) => {
              setResumeData(data);
              setCurrentView('review');
          }}
          onManualEntry={() => setCurrentView('form')}
          onBack={() => setCurrentView('landing')}
        />
      )}
      {currentView === 'review' && (
        <ResumeReview
          resumeData={resumeData}
          onResumeDataChange={setResumeData}
          onGeneratePortfolio={(data) => {
            setPortfolioData(data);
            setPortfolioGenerated(true);
            setCurrentView('results-dashboard');
            persistPortfolio(data);
          }}
          onBack={() => setCurrentView('upload')}
        />
      )}
      {currentView === 'form' && (
        <PortfolioForm
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          onBack={() => setCurrentView('landing')}
          onSubmit={() => {
            setPortfolioGenerated(true);
            setCurrentView('portfolio');
            persistPortfolio(portfolioData);
          }}
        />
      )}
      {currentView === 'portfolio' && (
        <PortfolioView
          portfolioData={portfolioData}
          onEdit={() => setCurrentView('form')}
          onViewScore={() => setCurrentView('score')}
          onBackToDashboard={() => setCurrentView('results-dashboard')}
          shareUrl={shareUrl || undefined}
        />
      )}
      {currentView === 'results-dashboard' && (
        <ResultsDashboard
          onViewPortfolio={() => setCurrentView('portfolio')}
          onEditPortfolio={() => setCurrentView('form')}
          onViewScore={() => setCurrentView('score')}
          onViewLinkedIn={() => setCurrentView('linkedin')}
          onViewResumeImprovement={() => setCurrentView('resume-improvement')}
          onViewCareerRoadmap={() => setCurrentView('career-coach')}
          onViewSkillsAnalytics={() => setCurrentView('skills-analytics')}
          portfolioGenerated={portfolioGenerated}
        />
      )}
      {currentView === 'score' && (
        <JobReadinessScore
          resumeData={resumeData}
          portfolioGenerated={portfolioGenerated}
          onViewPortfolio={() => setCurrentView('portfolio')}
          onImproveProfile={() => setCurrentView('review')}
          onViewCareerCoach={() => setCurrentView('career-coach')}
          onViewLinkedIn={() => setCurrentView('linkedin')}
          onViewResumeImprovement={() => setCurrentView('resume-improvement')}
          onViewSkillsAnalytics={() => setCurrentView('skills-analytics')}
        />
      )}
      {currentView === 'career-coach' && (
        <AICareerCoach
          resumeData={resumeData}
          onViewScore={() => setCurrentView('score')}
          onImproveProfile={() => setCurrentView('review')}
        />
      )}
      {currentView === 'linkedin' && (
        <LinkedInGenerator
          resumeData={resumeData}
          onBack={() => setCurrentView('score')}
          onContinue={() => setCurrentView('score')}
        />
      )}
      {currentView === 'resume-improvement' && (
        <ResumeImprovement
          resumeData={resumeData}
          onBack={() => setCurrentView('score')}
          onContinue={() => setCurrentView('score')}
          onNavigateToLinkedIn={() => setCurrentView('linkedin')}
          onNavigateToRoadmap={() => setCurrentView('career-coach')}
        />
      )}
      {currentView === 'skills-analytics' && (
        <SkillsAnalytics
          resumeData={resumeData}
          onBack={() => setCurrentView('score')}
          onContinue={() => setCurrentView('score')}
          onNavigateToLinkedIn={() => setCurrentView('linkedin')}
          onNavigateToRoadmap={() => setCurrentView('career-coach')}
          onNavigateToResumeImprovement={() => setCurrentView('resume-improvement')}
        />
      )}
      </div>
    </div>
  );
}

export default App;
