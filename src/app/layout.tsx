import { classNames } from '~/config/classNames';
import { ssrClient } from '~/config/marketplace-sdk/ssr';
import '~/styles/globals.scss';

import { cn } from '$ui';
import { Layout } from './_layout';
import Providers from './_providers';
import '@0xsequence/marketplace-sdk/styles';
import type { Metadata } from 'next';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getInitialState, getMarketplaceConfig, config } = ssrClient();
  const { fontUrl, cssString, faviconUrl } = await getMarketplaceConfig();
  const initialState = await getInitialState();

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        {fontUrl ? <link href={fontUrl} rel="stylesheet" /> : null}
        <style>{cssString}</style>
      </head>
      <body className={cn(classNames.themeManager)}>
        <Providers sdkInitialState={initialState} sdkConfig={config}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

export const generateMetadata = async (): Promise<Metadata> => {
  const { getMarketplaceConfig } = ssrClient();
  const marketplaceConfig = await getMarketplaceConfig();
  return {
    title: {
      template: marketplaceConfig.titleTemplate ?? '%s',
      default: marketplaceConfig.title ?? '',
    },
    description: marketplaceConfig.shortDescription ?? '',
    manifest: marketplaceConfig.manifestUrl,
    twitter: {
      card: 'summary_large_image',
    },
    openGraph: {
      type: 'website',
      title: marketplaceConfig.title ?? '',
      description: marketplaceConfig.shortDescription ?? '',
      images: [
        {
          url: marketplaceConfig.ogImage ?? '',
          alt: marketplaceConfig.title,
        },
      ],
    },
    appleWebApp: {
      title: marketplaceConfig.title,
      statusBarStyle: 'default',
    },
  };
};

export const runtime = 'edge';
