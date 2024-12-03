// This file is used to make an dummy overwrite for cross-fetch.
// cross-fetch detects the cloudflare-pages env as a browser and globally replaces fetch with
// XMLHttpRequest, which is not supported in cloudflare pages. See package.json for the override.
// eslint-disable-next-line import/no-anonymous-default-export
export default {};
