import { useState, useRef } from 'react';
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
  Download,
  Globe,
  Trophy,
  ArrowUpRight,
  Star,
  FileText,
  Target,
  TrendingUp,
  Map,
  Users,
  GraduationCap,
  Briefcase,
  Palette,
  RefreshCw,
  Clock,
  Award,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Play,
  BarChart3,
  Compass,
  FileSearch,
  MessageSquare,
  Phone,
  Image,
  Printer,
} from 'lucide-react';
import ResumeUpload from './components/ResumeUpload';
import ResumeReview from './components/ResumeReview';
import JobReadinessScore from './components/JobReadinessScore';
import AICareerCoach from './components/AICareerCoach';
import LinkedInGenerator from './components/LinkedInGenerator';
import ResumeImprovement from './components/ResumeImprovement';
import SkillsAnalytics from './components/SkillsAnalytics';
import ResultsDashboard from './components/ResultsDashboard';
import { ResumeData, emptyResumeData, inferProfessionalTitle, PortfolioData as PortfolioDataType, Education, WorkExperience, Certification, Achievement } from './utils/resumeTypes';

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
// PORTFOLIO VIEW (PREMIUM PORTFOLIO PAGE)
// ============================================================================

interface PortfolioProps {
  portfolioData: PortfolioData;
  onEdit: () => void;
  onViewScore?: () => void;
  onBackToDashboard?: () => void;
}

/**
 * Infers a professional title from portfolio data when role is empty
 */
const inferTitleFromPortfolio = (data: PortfolioData): string => {
  if (data.role?.trim()) return data.role.trim();

  // Check work experience for title
  if (data.workExperience?.length > 0 && data.workExperience[0].title?.trim()) {
    return data.workExperience[0].title.trim();
  }

  const skillsLower = data.skills.map(s => s.toLowerCase());
  const projectsText = data.projects.map(p => `${p.title} ${p.description} ${p.tech.join(' ')}`).join(' ').toLowerCase();
  const educationText = data.education?.map(e => `${e.degree} ${e.field}`).join(' ').toLowerCase() || '';

  // Detect if student
  const isStudent = data.education?.some(e => {
    const endDate = e.endDate?.toLowerCase() || '';
    return endDate.includes('present') || endDate.includes('expected') || endDate.includes('candidate');
  }) || false;

  // Detect area of expertise
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

  // Generate student titles
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

  // Generate professional titles
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

// Export dropdown component
const ExportDropdown = ({ portfolioData }: { portfolioData: PortfolioData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

      // Add export class for better PDF rendering
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
      // Fallback to print
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
      {/* Success notification */}
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

// Icon component for contact info
const ContactIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    location: <Map className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    github: <Github className="w-4 h-4" />,
  };
  return <span className="text-primary-400">{icons[type]}</span>;
};

const Portfolio = ({ portfolioData, onEdit, onViewScore, onBackToDashboard }: PortfolioProps) => {
  const displayRole = inferTitleFromPortfolio(portfolioData);

  // Check if any contact info exists
  const hasContactInfo = portfolioData.email || portfolioData.phone || portfolioData.location || portfolioData.github || portfolioData.linkedin;

  // Check if sections have content
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
            <button onClick={onEdit} className="px-3 py-2 rounded-lg glass text-neutral-300 hover:text-neutral-100 text-sm transition-colors">
              Edit
            </button>
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
                  <Phone className="w-4 h-4 text-primary-400" />
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
    </div>
  </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
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
          }}
        />
      )}
      {currentView === 'portfolio' && (
        <Portfolio
          portfolioData={portfolioData}
          onEdit={() => setCurrentView('form')}
          onViewScore={() => setCurrentView('score')}
          onBackToDashboard={() => setCurrentView('results-dashboard')}
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
