/*
# Lock public portfolio records after creation

1. Purpose
- Keep generated portfolios publicly readable without allowing arbitrary visitors to modify or delete them.
- The current application has no sign-in screen, so it cannot safely identify an owner for database edits.

2. Modified table
- `public.portfolios`
- Existing rows and columns are preserved.

3. Security changes
- Keep public SELECT access so shared links work without login.
- Keep public INSERT access so anonymous generation can save a new portfolio.
- Revoke UPDATE and DELETE table privileges from `anon` and `authenticated`.
- Remove the corresponding UPDATE and DELETE policies.

4. Important notes
- The existing in-app Edit screen remains a local editing flow and does not overwrite a published public record.
- Owner-controlled persistence would require adding authentication and an owner-scoped update path in a separate feature.
*/

DROP POLICY IF EXISTS "anon_update_portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "anon_delete_portfolios" ON public.portfolios;

REVOKE UPDATE, DELETE ON TABLE public.portfolios FROM anon, authenticated;
