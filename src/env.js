import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SEQUENCE_ACCESS_KEY: z.string(),
    NEXT_PUBLIC_SEQUENCE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_WAAS_CONFIG_KEY: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
    NEXT_PUBLIC_WALLET_TYPE: z.enum(["waas", "universal"]),
  },

  runtimeEnv: {
    NEXT_PUBLIC_SEQUENCE_ACCESS_KEY:
      process.env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
    NEXT_PUBLIC_SEQUENCE_PROJECT_ID:
      process.env.NEXT_PUBLIC_SEQUENCE_PROJECT_ID,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_WAAS_CONFIG_KEY:
      process.env.NEXT_PUBLIC_WAAS_CONFIG_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_WALLET_TYPE:
      process.env.NEXT_PUBLIC_WALLET_TYPE,
  },
  emptyStringAsUndefined: true,
});
