import { compareAddress } from '~/lib/utils/helpers';

import {
  polygon,
  arbitrum,
  avalanche,
  arbitrumNova,
  xai,
} from 'viem/chains';

export const SARDINE_SUPPORTED_COUNTRIES: string[] = [
  'AL',
  'AO',
  'AT',
  'BB',
  'BE',
  'BZ',
  'BJ',
  'BO',
  'BR',
  'BG',
  'KH',
  'KY',
  'CL',
  'CO',
  'KM',
  'CR',
  'HR',
  'CY',
  'CZ',
  'DK',
  'DM',
  'DO',
  'EC',
  'EG',
  'SV',
  'GQ',
  'EE',
  'FO',
  'FI',
  'FR',
  'GF',
  'DE',
  'GR',
  'GN',
  'GW',
  'GY',
  'HT',
  'HN',
  'HU',
  'IS',
  'ID',
  'IE',
  'IL',
  'IT',
  'JM',
  'JP',
  'KG',
  'LA',
  'LV',
  'LI',
  'LT',
  'LU',
  'MG',
  'MY',
  'MV',
  'MT',
  'MR',
  'MX',
  'MN',
  'MZ',
  'NL',
  'NO',
  'OM',
  'PA',
  'PY',
  'PE',
  'PH',
  'PL',
  'PT',
  'RO',
  'KN',
  'MF',
  'SA',
  'SC',
  'SG',
  'SK',
  'SI',
  'KR',
  'ES',
  'LK',
  'SE',
  'CH',
  'TZ',
  'TH',
  'TT',
  'TR',
  'AE',
  'GB',
  'US',
  'UY',
  'UZ',
  'VU',
  'VN'
]

const SARDINE_SUPPORTED_CURRENCIES: Record<number, string[]> = {
  [polygon.id]: [
    '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'
  ],
  [arbitrum.id]: [
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
  ],
  [arbitrumNova.id]: [
    '0x750ba8b76187092b0d1e87e28daaf484d1b5273b'
  ],
  [avalanche.id]: [
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E'
  ],
  [xai.id]: [
    '0x1E3769Bd5fB2e9e9e7D4ED8667c947661F9A82E3'
  ]
}

export const checkCurrencyValidity = (currencyAddress: string, chainId: number) => {
  const supportedCurrencies = SARDINE_SUPPORTED_CURRENCIES[chainId]
  const foundCurrency = supportedCurrencies?.find(c => compareAddress(c, currencyAddress)) 
  return !!foundCurrency
}

export const checkCountryCodeValidity = (countryCode: string) => SARDINE_SUPPORTED_COUNTRIES.includes(countryCode)
