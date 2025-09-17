/**
 * Proxy configuration for CORS bypass
 * Multiple proxy services as fallbacks for better reliability
 */

export interface ProxyConfig {
  name: string;
  baseUrl: string;
  buildUrl: (originalUrl: string) => string;
}

export const PROXY_CONFIGS: ProxyConfig[] = [
  {
    name: 'AllOrigins',
    baseUrl: 'https://api.allorigins.win/raw?url=',
    buildUrl: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  },
  {
    name: 'CodeTabs',
    baseUrl: 'https://api.codetabs.com/v1/proxy?quest=',
    buildUrl: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${url}`
  },
  {
    name: 'CORS Anywhere (Heroku)',
    baseUrl: 'https://cors-anywhere.herokuapp.com/',
    buildUrl: (url: string) => `https://cors-anywhere.herokuapp.com/${url}`
  }
];

// Default proxy configuration
export const DEFAULT_PROXY = PROXY_CONFIGS[0];

/**
 * Builds a proxied URL with fallback support
 * @param originalUrl The original URL to proxy
 * @param proxyIndex Index of the proxy to use (defaults to 0)
 * @returns The proxied URL
 */
export const buildProxyUrl = (originalUrl: string, proxyIndex: number = 0): string => {
  const proxy = PROXY_CONFIGS[proxyIndex] || DEFAULT_PROXY;
  return proxy.buildUrl(originalUrl);
};

/**
 * Get available proxy configurations
 * @returns Array of available proxy configurations
 */
export const getAvailableProxies = (): ProxyConfig[] => {
  return [...PROXY_CONFIGS];
};
