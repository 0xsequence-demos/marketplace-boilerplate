import { getNetworkConfig } from '~/lib/queries/clients';

import { useQuery } from '@tanstack/react-query';

export const useCountryCode = () =>
  useQuery({
    queryKey: ['useCountryCode'],
    queryFn: async () => {
      const config = getNetworkConfig(137);
      const res = await fetch(`${config.sequenceApiUrl}/cdn-cgi/trace`);
      const data = await res.text();
      const locationIndex = data.indexOf('loc=');
      const countryCodeIndexStart = locationIndex + 4;
      const countryCode = data.slice(
        countryCodeIndexStart,
        countryCodeIndexStart + 2,
      );
      return countryCode;
    },
    staleTime: 6 * 60 * 60 * 1000,
  });
