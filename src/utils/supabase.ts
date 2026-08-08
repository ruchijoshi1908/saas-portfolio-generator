import { createClient } from '@supabase/supabase-js';
import type { PortfolioData } from './resumeTypes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * The public origin used to build shareable portfolio URLs.
 */
export function getPublicAppUrl(): string {
  const envUrl = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined;
  return (envUrl || 'https://saas-portfolio-gener-syu1.bolt.host').replace(/\/$/, '');
}

/**
 * Generate a short URL-safe slug (12 chars, lowercase alphanumeric).
 */
export function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 12; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

/**
 * Save a portfolio to the database. Retries with a new slug on collision.
 * Returns the slug of the saved portfolio.
 */
export async function savePortfolio(data: PortfolioData): Promise<string> {
  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const slug = generateSlug();
    const { error } = await supabase
      .from('portfolios')
      .insert({ slug, data });

    if (!error) return slug;

    // 23505 = unique_violation — collision, retry with a new slug
    if (error.code !== '23505') {
      throw error;
    }
  }
  throw new Error('Failed to generate a unique portfolio slug after multiple attempts.');
}

/**
 * Load a portfolio by its slug. Returns null if not found.
 */
export async function loadPortfolio(slug: string): Promise<PortfolioData | null> {
  const { data, error } = await supabase
    .from('portfolios')
    .select('data')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return (data?.data as PortfolioData) ?? null;
}
