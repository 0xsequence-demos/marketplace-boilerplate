'use client';

import { ToastProvider, Tooltip } from '$ui';
import { SequenceCheckoutProvider } from '@0xsequence/checkout';
import {
  type ConnectConfig,
  SequenceConnectProvider,
} from '@0xsequence/connect';
import { ThemeProvider } from '@0xsequence/design-system';
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

  const connectConfig: ConnectConfig = {
    projectAccessKey: sdkConfig.projectAccessKey,
    signIn: {
      projectName: marketplaceConfig.title,
    },
  };

  const wagmiConfig: Config = createWagmiConfig(
    marketplaceConfig,
    sdkConfig,
    !!sdkInitialState,
  );

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig} initialState={sdkInitialState?.wagmi}>
        <QueryClientProvider client={queryClient}>
          <SequenceConnectProvider config={connectConfig}>
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
          </SequenceConnectProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
