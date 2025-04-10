'use client';

import { ToastProvider, Tooltip } from '$ui';
import { createConfig, SequenceConnect } from '@0xsequence/connect';
import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import type { SdkConfig } from '@0xsequence/marketplace-sdk';
import {
  MarketplaceProvider,
  ModalProvider,
  createWagmiConfig,
  getQueryClient,
  marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type Config, type State, WagmiProvider } from 'wagmi';
import { env } from '~/env';
import { ThemeProvider } from '@0xsequence/design-system';

const queryClient = getQueryClient();

interface ProvidersProps {
  sdkInitialState?: { wagmi?: State };
  sdkConfig: SdkConfig;
  children: React.ReactNode;
}

export default function Providers({
  sdkInitialState,
  sdkConfig,
  children,
}: ProvidersProps) {
  enableReactComponents();

  const { data: marketplaceConfig } = useQuery(
    marketplaceConfigOptions(sdkConfig),
    queryClient,
  );

  if (!marketplaceConfig) {
    return null; //TODO
  }

  const config = createConfig('waas', {
    appName: 'Sequence Marketplace',
    projectAccessKey: env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
    waasConfigKey: env.NEXT_PUBLIC_WAAS_CONFIG_KEY!,
    google: {
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    },
    apple: {
      clientId: 'com.horizon.sequence.waas',
      redirectURI: window.location.origin + window.location.pathname
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
  const wagmiConfig:Config = createWagmiConfig(
    marketplaceConfig,
    sdkConfig,
    !!sdkInitialState,
  );

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig} initialState={sdkInitialState?.wagmi}>
        <QueryClientProvider client={queryClient}>
          <SequenceConnect config={config}>
            <SequenceCheckoutProvider>
              <Tooltip.Provider>
                <MarketplaceProvider config={sdkConfig}>
                  {children}
                  <ReactQueryDevtools initialIsOpen={false} />
                  <ModalProvider />
                </MarketplaceProvider>
                <ToastProvider />
              </Tooltip.Provider>
            </SequenceCheckoutProvider>
          </SequenceConnect>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
