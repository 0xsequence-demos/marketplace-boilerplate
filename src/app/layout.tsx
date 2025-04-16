import { classNames } from '~/config/classNames';
import { ssrClient } from '~/config/marketplace-sdk/ssr';
import '~/styles/globals.css';

import { cn } from '$ui';
import { Layout } from './_layout';
import Providers from './_providers';
import type { Metadata } from 'next';
import InjectBuilderCss from '~/styles/inject-builder-css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await ssrClient();
  const { fontUrl, cssString, faviconUrl } =
    await client.getMarketplaceConfig();
  const initialState = await client.getInitialState();

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />

        {faviconUrl ? (
          <>
            <link rel="icon" href={faviconUrl} />
            <link rel="shortcut icon" href={faviconUrl} />
          </>
        ) : null}
        {fontUrl ? <link href={fontUrl} rel="stylesheet" /> : null}
      </head>
      <body className={cn(classNames.themeManager)}>
        <InjectBuilderCss cssString={cssString}>
            <Providers sdkInitialState={initialState} sdkConfig={client.config}>
              <Layout>{children}</Layout>
            </Providers>
        </InjectBuilderCss>
      </body>
    </html>
  );
}

export const generateMetadata = async (): Promise<Metadata> => {
  const { getMarketplaceConfig } = await ssrClient();
  const marketplaceConfig = await getMarketplaceConfig();
  return {
    title: {
      template: marketplaceConfig.title ?? '%s',
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
