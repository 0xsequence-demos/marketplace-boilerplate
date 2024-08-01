'use client';

import { useState } from 'react';

import { type MarketConfig } from '~/config/marketplace';
import { createWagmiConfig } from '~/config/networks/wagmi';
import { env } from '~/env';
import { getQueryClient } from '~/lib/queries/getQueryClient';
import { marketConfig$ } from '~/lib/stores/marketConfig';

import { ToastProvider, Tooltip } from '$ui';
import { AccountEvents } from './accountEvents';
import { KitProvider, type KitConfig } from '@0xsequence/kit';
import { KitCheckoutProvider } from '@0xsequence/kit-checkout';
import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { useMount } from '@legendapp/state/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WagmiProvider, type State } from 'wagmi';

const queryClient = getQueryClient();

export default function Providers({
  marketConfig,
  children,
  wagmiInitState,
}: {
  wagmiInitState: State | undefined;
  marketConfig: MarketConfig;
  children: React.ReactNode;
}) {
  enableReactComponents();

  useMount(() => {
    marketConfig$.set(marketConfig);
  });

  const kitConfig = {
    defaultTheme: 'dark',
    projectAccessKey: env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
    signIn: {
      projectName: marketConfig.title,
    },
  } satisfies KitConfig;

  const [wagmiConfig] = useState(createWagmiConfig(marketConfig));

  return (
    <WagmiProvider config={wagmiConfig} initialState={wagmiInitState}>
      <QueryClientProvider client={queryClient}>
        <KitProvider config={kitConfig}>
          <KitCheckoutProvider>
            <QueryClientProvider client={queryClient}>
              <Tooltip.Provider>
                {children}
                <ToastProvider />
              </Tooltip.Provider>
              <AccountEvents wagmiConfig={wagmiConfig} />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </KitCheckoutProvider>
        </KitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
