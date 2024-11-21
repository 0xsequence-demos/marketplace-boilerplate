await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@0xsequence/marketplace-sdk'],
};

export default config;
