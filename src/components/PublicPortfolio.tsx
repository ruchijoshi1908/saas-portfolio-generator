import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Rocket } from 'lucide-react';
import PortfolioView from './PortfolioView';
import { loadPortfolio } from '../utils/supabase';
import type { PortfolioData } from '../utils/resumeTypes';

interface PublicPortfolioProps {
  slug: string;
  onBackToHome: () => void;
}

export default function PublicPortfolio({ slug, onBackToHome }: PublicPortfolioProps) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPortfolio() {
      try {
        setLoading(true);
        const data = await loadPortfolio(slug);
        if (cancelled) return;
        if (!data) {
          setError('Portfolio not found. The link may be invalid or the portfolio may have been removed.');
        } else {
          setPortfolioData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load portfolio. Please try again later.');
          console.error('Portfolio load error:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPortfolio();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-neutral-400 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 mb-3">Portfolio Not Found</h1>
          <p className="text-neutral-400 mb-8">{error || 'The portfolio you are looking for does not exist.'}</p>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Rocket className="w-4 h-4" />
            Go to CareerLaunch AI
          </button>
        </div>
      </div>
    );
  }

  return <PortfolioView portfolioData={portfolioData} isPublic />;
}
