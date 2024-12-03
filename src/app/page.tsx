import { ssrClient } from '~/config/marketplace-sdk/ssr';
import { BigLeftBanner } from './_landing/layouts/BigLeftBanner';
import { DefaultLayout } from './_landing/layouts/DefaultLayout';
import { FloatingBanner } from './_landing/layouts/FloatingHeader';

const LandingPage = async () => {
  const marketplaceConfig = await ssrClient().getMarketplaceConfig();

  switch (marketplaceConfig.landingPageLayout) {
    case 'floating_header': {
      return <FloatingBanner {...marketplaceConfig} />;
    }
    case 'big_left_banner': {
      return <BigLeftBanner {...marketplaceConfig} />;
    }
    case 'default': {
      return <DefaultLayout {...marketplaceConfig} />;
    }
  }
};

export default LandingPage;

export const runtime = 'edge';
