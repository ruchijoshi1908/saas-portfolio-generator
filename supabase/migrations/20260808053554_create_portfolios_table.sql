/*
# Create portfolios table for public portfolio sharing

## Purpose
Stores generated portfolio data so each portfolio gets a unique, persistent public URL
that works across browsers and devices without requiring login.

## New Tables
- `portfolios`
  - `id` (uuid, primary key) — internal unique identifier
  - `slug` (text, unique, not null) — short URL-safe identifier used in /portfolio/:slug routes
  - `data` (jsonb, not null) — the full PortfolioData object (name, role, about, skills, projects, social links, etc.)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Indexes
- Unique index on `slug` for fast lookups and guaranteed uniqueness

## Security (RLS)
- RLS enabled on `portfolios`.
- This is a no-auth app (no sign-in screen), so policies use `TO anon, authenticated`.
- SELECT: anyone can read any portfolio (public sharing is the intended behavior).
- INSERT: anyone can create a new portfolio (the generator creates them anonymously).
- UPDATE: anyone can update a portfolio (allows re-saving / editing).
- DELETE: anyone can delete a portfolio (not exposed in UI but kept for completeness).

## Notes
1. The `slug` is generated client-side as a short random alphanumeric string (e.g. "abc123def456")
   and is guaranteed unique by the unique index. On collision, the client retries with a new slug.
2. Portfolio data is stored as JSONB to preserve the exact structure used by the frontend,
   so the public portfolio page renders identically to the in-app preview.
3. No `user_id` column — the app has no authentication and portfolios are intentionally public.
*/

CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS portfolios_slug_idx ON portfolios (slug);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- SELECT: anyone can view any portfolio (public sharing)
DROP POLICY IF EXISTS "anon_select_portfolios" ON portfolios;
CREATE POLICY "anon_select_portfolios" ON portfolios FOR SELECT
  TO anon, authenticated USING (true);

-- INSERT: anyone can create a new portfolio
DROP POLICY IF EXISTS "anon_insert_portfolios" ON portfolios;
CREATE POLICY "anon_insert_portfolios" ON portfolios FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- UPDATE: anyone can update a portfolio (re-save / edit)
DROP POLICY IF EXISTS "anon_update_portfolios" ON portfolios;
CREATE POLICY "anon_update_portfolios" ON portfolios FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- DELETE: anyone can delete a portfolio
DROP POLICY IF EXISTS "anon_delete_portfolios" ON portfolios;
CREATE POLICY "anon_delete_portfolios" ON portfolios FOR DELETE
  TO anon, authenticated USING (true);