import StorefrontChrome from '@/components/storefront/StorefrontChrome';
import { getSettings } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  // Settings power the announcement bar + footer contact info. If the API is
  // unreachable, fall back to null — StorefrontChrome uses the static
  // hardcoded values in that case.
  const settings: SiteSettings | null = await getSettings().catch(() => null);

  return <StorefrontChrome settings={settings}>{children}</StorefrontChrome>;
}
