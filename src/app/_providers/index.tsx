'use client';

import { ToastProvider, Tooltip } from '$ui';
import { ThemeProvider } from '@0xsequence/design-system';

import { type KitConfig, KitProvider } from '@0xsequence/kit';
import { KitCheckoutProvider } from "@0xsequence/kit-checkout";
import {
  type MarketplaceConfig,
  type SdkConfig,
} from '@0xsequence/marketplace-sdk';
import {
  createWagmiConfig,
  getQueryClient,
  marketplaceConfigOptions,
  MarketplaceProvider,
  ModalProvider,
} from '@0xsequence/marketplace-sdk/react';

import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type State, WagmiProvider } from 'wagmi';

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

  const kitConfig: KitConfig = {
    projectAccessKey: sdkConfig.projectAccessKey,
    signIn: {
      projectName: marketplaceConfig.title,
    },
  };

  const wagmiConfig = createWagmiConfig(
    marketplaceConfig,
    sdkConfig,
    !!sdkInitialState,
  );

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig} initialState={sdkInitialState?.wagmi}>
        <QueryClientProvider client={queryClient}>
          <KitProvider config={kitConfig}>
            <KitCheckoutProvider>
              <Tooltip.Provider>
                <MarketplaceProvider config={sdkConfig}>
                  {children}
                  <ReactQueryDevtools initialIsOpen={false} />
                  <ModalProvider />
                </MarketplaceProvider>
                <ToastProvider />
              </Tooltip.Provider>
            </KitCheckoutProvider>
          </KitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
