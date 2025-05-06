import { env } from '~/env';

import type { SdkConfig } from '@0xsequence/marketplace-sdk';

export const config = {
  projectId: env.NEXT_PUBLIC_SEQUENCE_PROJECT_ID,
  projectAccessKey: env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
  walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
} satisfies SdkConfig;
