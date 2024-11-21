import { env } from '~/env';

import { type SdkConfig } from '@0xsequence/marketplace-sdk';

const embeddedWallet = env.NEXT_PUBLIC_WAAS_CONFIG_KEY
  ? ({
      waasConfigKey: env.NEXT_PUBLIC_WAAS_CONFIG_KEY,
      googleClientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      appleClientId: env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      appleRedirectURI: env.NEXT_PUBLIC_APPLE_REDIRECT_URI,
    } satisfies NonNullable<SdkConfig['wallet']>['embedded'])
  : undefined;

export const config = {
  projectId: env.NEXT_PUBLIC_SEQUENCE_PROJECT_ID,
  projectAccessKey: env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
  wallet: {
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    embedded: embeddedWallet,
  },
} satisfies SdkConfig;
