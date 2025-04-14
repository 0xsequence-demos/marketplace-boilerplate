import { config } from './config';
import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

export const ssrClient = async () => {
  const headersList = await headers();

  return createSSRClient({
    cookie: headersList.get('cookie') || '',
    queryClient: new QueryClient(),
    config: {
      ...config,
    },
  });
};
