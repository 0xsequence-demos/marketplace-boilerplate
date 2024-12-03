import { Logo } from '~/components/Logo';
import Link from 'next/link';
import { ssrClient } from '~/config/marketplace-sdk/ssr';

export async function HeaderLogo() {
  const { getMarketplaceConfig } = ssrClient();
  const marketplaceConfig = await getMarketplaceConfig();
  return (
    <Link
      prefetch={false}
      href="/"
      className="my-auto flex items-center text-xl font-bold text-foreground/90"
    >
      {!marketplaceConfig.logoUrl && marketplaceConfig.title ? (
        marketplaceConfig.title
      ) : (
        <Logo
          logoUrl={marketplaceConfig.logoUrl}
          className="h-[calc(var(--headerHeight)-10px)] md:max-h-full"
        />
      )}
    </Link>
  );
}
