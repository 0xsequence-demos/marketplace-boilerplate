import { DEFAULT_NETWORK } from '~/config/consts';
import { type MarketConfig } from '~/config/marketplace';
import { SUPPORTED_NETWORKS } from '~/config/networks/config';
import { env } from '~/env';

import { cookieStorage } from './wagmiCookieStorage';
import {
  type Wallet,
  getKitConnectWallets,
  sequence as sequenceWallet,
  coinbaseWallet,
  walletConnect,
  email,
  google,
  facebook,
  apple,
  twitch,
  type SequenceOptions,
  getDefaultWaasConnectors,
} from '@0xsequence/kit';
import { findNetworkConfig, allNetworks } from '@0xsequence/network';
import type { Chain, Transport } from 'viem';
import { createConfig, http } from 'wagmi';

const accessKey = env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY!;
const walletConnectProjectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
const waasConfigKey = env.NEXT_PUBLIC_WAAS_CONFIG_KEY!;
const googleClientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const walletType = env.NEXT_PUBLIC_WALLET_TYPE!;

export const createWagmiConfig = (marketConfig: MarketConfig) => {
  const chains = getChainConfigs(marketConfig);
  const transports = getTransportConfigs(chains);
  let connectors;

  if (walletType === "universal") {
    const sequenceWalletOptions = {
      defaultNetwork: DEFAULT_NETWORK,
      connect: {
        projectAccessKey: accessKey,
        app: marketConfig.title,
        settings: {
          bannerUrl: marketConfig.ogImage,
        },
      },
    };
  
    
    const wallets = getWalletConfigs(marketConfig, sequenceWalletOptions);
    const socialWallets = getSocialWalletConfigs(sequenceWalletOptions);
    connectors = getKitConnectWallets(accessKey, [
      ...socialWallets,
      ...wallets,
    ]);
  } else if (walletType === "waas") {
    connectors = getDefaultWaasConnectors({
      walletConnectProjectId,
      waasConfigKey,
      googleClientId,
      // Notice: AppleID will only work if deployed on https to support Apple redirects
      // appleClientId,
      // appleRedirectURI,
      appName: marketConfig.title,
      projectAccessKey: accessKey,
    });
  } else throw new Error("Invalid wallet type environment");

  return createConfig({
    connectors,
    chains,
    ssr: true,
    storage: cookieStorage,
    transports,
  });
};

function getChainConfigs(marketConfig: MarketConfig): [Chain, ...Chain[]] {
  const supportedChainIds = new Set(
    marketConfig.collections?.map((c) => c.chainId),
  );
  const chains = SUPPORTED_NETWORKS.map((n) => n.viemChainConfig).filter((c) =>
    supportedChainIds.has(c.id),
  ) as [Chain, ...Chain[]];
  if (!chains.length) {
    throw new Error('No supported networks found');
  }
  return chains;
}

function getTransportConfigs(
  chains: [Chain, ...Chain[]],
): Record<number, Transport> {
  return chains.reduce(
    (acc, chain) => {
      const network = findNetworkConfig(allNetworks, chain.id);
      if (network) acc[chain.id] = http(network.rpcUrl);
      return acc;
    },
    {} as Record<number, Transport>,
  );
}

function getWalletConfigs(
  marketConfig: MarketConfig,
  sequenceWalletOptions: SequenceOptions,
): Wallet[] {
  const walletConnectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  const walletObject = {
    sequence: sequenceWallet(sequenceWalletOptions),
    ...(walletConnectId
      ? { walletconnect: walletConnect({ projectId: walletConnectId }) }
      : {}),
    coinbase: coinbaseWallet({ appName: marketConfig.title }),
  } as const;

  const supportedWallets = marketConfig.walletOptions || [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return supportedWallets.length
    ? // @ts-expect-error -- Missing support for Ledger
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      supportedWallets.map((key) => walletObject[key]).filter(Boolean)
    : Object.values(walletObject);
}

function getSocialWalletConfigs(
  sequenceWalletOptions: SequenceOptions,
): Wallet[] {
  return [
    email(sequenceWalletOptions),
    facebook(sequenceWalletOptions),
    google(sequenceWalletOptions),
    apple(sequenceWalletOptions),
    twitch(sequenceWalletOptions),
  ] as const;
}
