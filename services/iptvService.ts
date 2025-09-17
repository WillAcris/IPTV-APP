import type { Channel, EpgProgram } from '../types';
import { buildProxyUrl as createProxyUrl, DEFAULT_PROXY } from '../config/proxyConfig';

// Original data sources
const M3U_BASE_URL = 'https://raw.githubusercontent.com/ManoLimah/Manoteste/refs/heads/main/ManoTV.m3u';
const EPG_BASE_URL = 'https://github.com/rootcoder/epgtv/raw/refs/heads/main/guide.xml.gz';

// Export the proxy function for use in other components
export const getProxiedUrl = (url: string, proxyIndex?: number) => createProxyUrl(url, proxyIndex);

// Construct the final URLs with the improved proxy
const M3U_URL = createProxyUrl(M3U_BASE_URL);
const EPG_URL = createProxyUrl(EPG_BASE_URL);

// Keep the old PROXY_URL for backward compatibility
export const PROXY_URL = DEFAULT_PROXY.baseUrl;


/**
 * Fetches and parses a live M3U playlist.
 * @returns A promise that resolves to an array of Channel objects.
 */
export const getChannels = async (): Promise<Channel[]> => {
  const response = await fetchWithProxyFallback(M3U_BASE_URL);
  const m3uText = await response.text();

  // Normalize line endings and split lines
  const rawLines = m3uText.replace(/\r/g, '').split('\n');

  // Keep only lines that are not empty (but preserve comment lines like #EXTINF)
  const lines = rawLines.filter(line => line.trim() !== '');

  // Map of groups to channels and the order in which groups appear
  const groupsOrder: string[] = [];
  const groupsMap: Record<string, Channel[]> = {};

  /**
   * Validates and normalizes a stream URL
   * Only ignores MP4 streams as requested; otherwise be permissive.
   */
  const validateStreamUrl = (url: string): string | null => {
    try {
      const trimmedUrl = url.trim();
      if (!trimmedUrl || trimmedUrl.length < 8) return null;

      const lower = trimmedUrl.toLowerCase();
      // Ignore mp4 files explicitly
      if (lower.includes('.mp4')) return null;

      // Accept common protocols or anything containing :// to be permissive
      const allowedProtocols = ['http://', 'https://', 'rtmp://', 'rtmps://', 'udp://', 'rtsp://', 'mms://', 'rtp://'];
      const hasAllowedProtocol = allowedProtocols.some(p => lower.startsWith(p));
      if (hasAllowedProtocol || lower.includes('://')) return trimmedUrl;

      // As a last resort, accept URLs that look like relative paths or contain common streaming words
      if (lower.includes('m3u8') || lower.includes('playlist') || lower.includes('stream') || lower.includes('.ts')) {
        return trimmedUrl;
      }

      // Otherwise, reject
      return null;
    } catch {
      return null;
    }
  };

  /**
   * Checks if a channel should be ignored based on name or other criteria
   */
  const shouldIgnoreChannel = (name: string, url: string): boolean => {
    const nameLower = name.toLowerCase();
    
    // Ignore channels with specific keywords in the name
    const bannedKeywords = ['manotv', 'doações', 'doacoes', 'doacao', 'doação'];
    if (bannedKeywords.some(keyword => nameLower.includes(keyword))) {
      return true;
    }

    // Check if URL indicates no streaming source
    const noStreamingIndicators = [
      'sem fonte', 'no source', 'offline', 'indisponível', 'unavailable',
      'manutenção', 'maintenance', 'temporariamente fora', 'temporarily off'
    ];
    
    const urlLower = url.toLowerCase();
    const hasNoStreamingIndicator = noStreamingIndicators.some(indicator => 
      urlLower.includes(indicator)
    );

    return hasNoStreamingIndicator;
  };

  // Helper to parse attributes from an EXTINF/info line
  const getAttributeFromInfo = (infoLine: string, attr: string): string => {
    const regex = new RegExp(`${attr}="([^"]*)"`);
    const match = infoLine.match(regex);
    return match ? match[1] : '';
  };

  // Store channels temporarily to check for duplicates with valid streams
  const tempChannels: Array<{
    name: string;
    id: string;
    logo: string;
    group: string;
    url: string;
    hasValidStream: boolean;
  }> = [];

  // Iterate lines and find #EXTINF entries, then find the next non-comment line as URL
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('#EXTINF')) continue;

    const infoLine = line;

    // Find next line that is not a comment (does not start with '#')
    let urlLine: string | undefined;
    for (let j = i + 1; j < lines.length; j++) {
      const candidate = lines[j].trim();
      if (!candidate) continue;
      if (!candidate.startsWith('#')) {
        urlLine = candidate;
        break;
      }
    }

    const nameMatch = infoLine.match(/,(.*)/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unnamed Channel';
    const id = getAttributeFromInfo(infoLine, 'tvg-id');
    const logo = getAttributeFromInfo(infoLine, 'tvg-logo') || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    const group = getAttributeFromInfo(infoLine, 'group-title') || 'Uncategorized';

    if (!urlLine) {
      // No URL found for this entry - add to temp channels as "no source" to track it
      console.warn(`Channel "${name}" has no streaming URL - will be ignored unless valid source found later`);
      tempChannels.push({
        name,
        id: id || `${name.replace(/\s/g, '')}-${i}`,
        logo,
        group,
        url: '', // Empty URL indicates no source
        hasValidStream: false
      });
      continue;
    }

    // Check if channel should be ignored by name or explicit no-source indicators
    if (shouldIgnoreChannel(name, urlLine)) {
      console.warn(`Ignored channel "${name}" (reason: ManoTV or explicit no streaming source)`);
      continue;
    }

    const validatedUrl = validateStreamUrl(urlLine);
    const hasValidStream = validatedUrl !== null;
    
    if (!validatedUrl) {
      console.warn(`Invalid stream URL for channel "${name}" (url: ${urlLine})`);
      // Still add to temp channels in case there's a valid stream later for the same channel
      tempChannels.push({
        name,
        id: id || `${name.replace(/\s/g, '')}-${i}`,
        logo,
        group,
        url: urlLine,
        hasValidStream: false
      });
      continue;
    }

    tempChannels.push({
      name,
      id: id || `${name.replace(/\s/g, '')}-${i}`,
      logo,
      group,
      url: validatedUrl,
      hasValidStream: true
    });
  }

  // Process temp channels: prioritize channels with valid streams
  const channelNameMap = new Map<string, typeof tempChannels[0]>();
  
  // First pass: collect channels with valid streams
  for (const tempChannel of tempChannels) {
    if (tempChannel.hasValidStream) {
      const existingChannel = channelNameMap.get(tempChannel.name);
      if (!existingChannel || !existingChannel.hasValidStream) {
        channelNameMap.set(tempChannel.name, tempChannel);
        console.log(`Added channel "${tempChannel.name}" with valid stream: ${tempChannel.url}`);
      }
    }
  }

  // Second pass: ONLY add channels without streams if no valid alternative exists
  // This automatically ignores channels with empty URLs (no source) unless they get a valid source later
  for (const tempChannel of tempChannels) {
    if (!tempChannel.hasValidStream && !channelNameMap.has(tempChannel.name)) {
      // Skip channels with empty URLs (no source at all)
      if (tempChannel.url === '') {
        console.warn(`Channel "${tempChannel.name}" ignored - no streaming source found in playlist`);
        continue;
      }
      
      // Skip channels with explicit "no source" indicators
      const isNoSourceChannel = tempChannel.url.toLowerCase().includes('sem fonte') || 
                               tempChannel.url.toLowerCase().includes('no source') ||
                               tempChannel.url.toLowerCase().includes('offline');
      
      if (isNoSourceChannel) {
        console.warn(`Channel "${tempChannel.name}" ignored - explicitly marked as no source`);
        continue;
      }

      // For other invalid URLs, still ignore them (they don't have working streams)
      console.warn(`Channel "${tempChannel.name}" ignored - invalid stream URL: ${tempChannel.url}`);
    }
  }

  // Convert to final channel format and group
  for (const tempChannel of channelNameMap.values()) {
    if (!tempChannel.hasValidStream) {
      continue; // Skip channels without valid streams at this point
    }

    const channel: Channel = {
      id: tempChannel.id,
      name: tempChannel.name,
      url: tempChannel.url,
      logo: tempChannel.logo,
      group: tempChannel.group,
    };

    if (!groupsMap[channel.group]) {
      groupsMap[channel.group] = [];
      groupsOrder.push(channel.group);
    }
    groupsMap[channel.group].push(channel);
  }

  // Flatten groups in the order they appeared in the playlist
  const result: Channel[] = [];
  for (const grp of groupsOrder) {
    const items = groupsMap[grp] || [];
    console.log(`Group "${grp}": ${items.length} channels`);
    for (const ch of items) result.push(ch);
  }

  console.log(`Total channels loaded: ${result.length}`);
  return result;
};


// --- Proxy Retry Logic ---

/**
 * Attempts to fetch a URL with different proxy services as fallbacks
 * @param originalUrl The original URL to fetch
 * @param maxRetries Maximum number of proxy services to try
 * @returns Promise with the fetch response
 */
const fetchWithProxyFallback = async (originalUrl: string, maxRetries: number = 3): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let proxyIndex = 0; proxyIndex < maxRetries; proxyIndex++) {
    try {
      const proxiedUrl = createProxyUrl(originalUrl, proxyIndex);
      console.log(`Attempting to fetch ${originalUrl} using proxy ${proxyIndex}`);
      
      const response = await fetch(proxiedUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check if response is actually HTML (proxy failure)
      const contentType = response.headers.get('content-type') || '';
      const responseText = await response.clone().text();
      
      if (responseText.trim().toLowerCase().startsWith('<!doctype html') || 
          responseText.trim().toLowerCase().startsWith('<html')) {
        throw new Error('Proxy returned HTML instead of expected content');
      }
      
      console.log(`Successfully fetched ${originalUrl} using proxy ${proxyIndex}`);
      return response;
      
    } catch (error) {
      console.warn(`Proxy ${proxyIndex} failed for ${originalUrl}:`, error);
      lastError = error as Error;
      
      // Wait a bit before trying the next proxy
      if (proxyIndex < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  throw lastError || new Error('All proxy services failed');
};

// --- EPG Caching and Parsing ---

let epgCache: Document | null = null;

/**
 * Parses the EPG time string (YYYYMMDDHHmmss Z) into a simple HH:mm format.
 * @param timeStr The raw time string from the XMLTV file.
 * @returns A formatted time string (e.g., "14:30").
 */
const parseEpgTime = (timeStr: string | null): string => {
  if (!timeStr) return '';
  const hour = timeStr.substring(8, 10);
  const minute = timeStr.substring(10, 12);
  return `${hour}:${minute}`;
};

/**
 * Fetches the EPG XML file and parses it into a DOM object.
 * The result is cached in memory to avoid redundant network requests.
 * @returns A promise that resolves to the parsed XML Document.
 */
const fetchAndParseEpg = async (): Promise<Document> => {
  if (epgCache) {
    return epgCache;
  }

  const response = await fetchWithProxyFallback(EPG_BASE_URL);
  const xmlText = await response.text();
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const parserError = xmlDoc.querySelector("parsererror");
  if (parserError) {
    console.error("Failed to parse EPG XML:", parserError.textContent);
    console.error("Received content:", xmlText.substring(0, 500) + '...');
    throw new Error("Failed to parse EPG XML: Invalid XML format received");
  }

  epgCache = xmlDoc;
  return xmlDoc;
}

/**
 * Gets the program guide for a specific channel ID by querying the cached EPG data.
 * @param channelId The 'tvg-id' of the channel.
 * @returns A promise that resolves to an array of EpgProgram objects.
 */
export const getEpg = async (channelId: string, retryCount = 0): Promise<EpgProgram[]> => {
  if (!channelId) {
    return [];
  }

  try {
    const epgDoc = await fetchAndParseEpg();
    // Use the channel ID to find all corresponding program entries in the EPG document.
    const programmeNodes = epgDoc.querySelectorAll(`programme[channel="${channelId}"]`);

    const programs: EpgProgram[] = [];
    programmeNodes.forEach(node => {
      const title = node.querySelector('title')?.textContent || 'No Title';
      const description = node.querySelector('desc')?.textContent || 'No description available.';
      const startTime = parseEpgTime(node.getAttribute('start'));
      const endTime = parseEpgTime(node.getAttribute('stop'));

      programs.push({
        title,
        description,
        startTime,
        endTime,
      });
    });

    return programs;
  } catch (error) {
    console.error(`Error fetching or parsing EPG for channel ${channelId}:`, error);
    
    // Clear the cache and retry once if this is the first attempt
    if (retryCount === 0) {
      console.log('Clearing EPG cache and retrying...');
      epgCache = null;
      return getEpg(channelId, 1);
    }
    
    return []; // Return an empty array on error to prevent the UI from crashing.
  }
};