import { useEffect, useRef, useState } from 'react';
import { getProxiedUrl } from '../services/iptvService';

declare global {
  interface Window {
    Hls: any;
    shaka: any;
  }
}

interface VideoPlayerProps {
  src: string;
  channelName?: string;
}

type PlayerType = 'native' | 'hls' | 'shaka';

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const shakaRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>('native');
  const [currentProxyIndex, setCurrentProxyIndex] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const logDebug = (message: string) => {
    console.log(`🔍 [VideoPlayer] ${message}`);
    setDebugInfo(message);
  };

  // Test URL connectivity first
  const testUrl = async (url: string): Promise<boolean> => {
    try {
      logDebug(`Testing URL connectivity: ${url.substring(0, 100)}...`);
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true; // no-cors always returns opaque response
    } catch (error) {
      logDebug(`URL test failed: ${error}`);
      return false;
    }
  };

  const loadWithNativePlayer = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      logDebug(`Trying Native HTML5 player...`);
      const video = videoRef.current;
      if (!video) {
        logDebug('❌ Native: Video element not available');
        resolve(false);
        return;
      }

      let resolved = false;
      const resolveOnce = (success: boolean, reason: string) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        logDebug(success ? `✅ Native: ${reason}` : `❌ Native: ${reason}`);
        resolve(success);
      };

      const cleanup = () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('loadeddata', onLoadedData);
        video.removeEventListener('error', onError);
        video.removeEventListener('loadstart', onLoadStart);
      };

      const onCanPlay = () => resolveOnce(true, 'Can play - video ready');
      const onLoadedData = () => resolveOnce(true, 'Data loaded');
      const onLoadStart = () => logDebug('Native: Load started');
      const onError = (e: any) => {
        const error = e.target?.error;
        let errorMsg = 'Unknown error';
        if (error) {
          switch (error.code) {
            case 1: errorMsg = 'MEDIA_ERR_ABORTED'; break;
            case 2: errorMsg = 'MEDIA_ERR_NETWORK'; break;
            case 3: errorMsg = 'MEDIA_ERR_DECODE'; break;
            case 4: errorMsg = 'MEDIA_ERR_SRC_NOT_SUPPORTED'; break;
          }
        }
        resolveOnce(false, `Error: ${errorMsg}`);
      };

      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('loadeddata', onLoadedData);
      video.addEventListener('error', onError);
      video.addEventListener('loadstart', onLoadStart);

      // Configure video element
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.src = url;
      video.load();

      // Timeout
      setTimeout(() => resolveOnce(false, 'Timeout after 15 seconds'), 15000);
    });
  };

  const loadWithHlsJs = async (url: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      logDebug(`Trying HLS.js player...`);
      const video = videoRef.current;
      if (!video) {
        logDebug('❌ HLS.js: Video element not available');
        resolve(false);
        return;
      }

      try {
        // Load HLS.js if not available
        if (!window.Hls) {
          logDebug('Loading HLS.js library...');
          await new Promise((res, rej) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.onload = res;
            script.onerror = rej;
            document.head.appendChild(script);
          });
        }

        if (!window.Hls.isSupported()) {
          logDebug('❌ HLS.js: Not supported in this browser');
          resolve(false);
          return;
        }

        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsRef.current = hls;
        let resolved = false;

        const resolveOnce = (success: boolean, reason: string) => {
          if (resolved) return;
          resolved = true;
          logDebug(success ? `✅ HLS.js: ${reason}` : `❌ HLS.js: ${reason}`);
          resolve(success);
        };

        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          resolveOnce(true, 'Manifest parsed successfully');
        });

        hls.on(window.Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            resolveOnce(false, `Fatal error: ${data.type}/${data.details}`);
          }
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        // Timeout
        setTimeout(() => resolveOnce(false, 'Timeout after 15 seconds'), 15000);

      } catch (error) {
        logDebug(`❌ HLS.js: Exception - ${error}`);
        resolve(false);
      }
    });
  };

  const loadWithShakaPlayer = async (url: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      logDebug(`Trying Shaka Player...`);
      const video = videoRef.current;
      if (!video || !window.shaka) {
        logDebug('❌ Shaka: Not available');
        resolve(false);
        return;
      }

      try {
        const player = new window.shaka.Player(video);
        shakaRef.current = player;

        player.configure({
          streaming: {
            retryParameters: {
              timeout: 30000,
              maxAttempts: 2,
              baseDelay: 1000
            }
          }
        });

        await player.load(url);
        logDebug('✅ Shaka: Loaded successfully');
        resolve(true);

      } catch (error) {
        logDebug(`❌ Shaka: Failed - ${error}`);
        resolve(false);
      }
    });
  };

  const tryLoadWithProxy = async (proxyIndex: number = 0): Promise<void> => {
    const players = [
      { type: 'native' as PlayerType, loader: loadWithNativePlayer },
      { type: 'hls' as PlayerType, loader: loadWithHlsJs },
      { type: 'shaka' as PlayerType, loader: loadWithShakaPlayer }
    ];

    logDebug(`Trying proxy ${proxyIndex} with ${players.length} players`);

    for (const playerConfig of players) {
      try {
        const proxiedUrl = getProxiedUrl(src, proxyIndex);
        logDebug(`${playerConfig.type} attempting: ${proxiedUrl.substring(0, 100)}...`);
        
        if (await playerConfig.loader(proxiedUrl)) {
          setCurrentPlayer(playerConfig.type);
          setCurrentProxyIndex(proxyIndex);
          setError(null);
          return;
        }
      } catch (error) {
        logDebug(`${playerConfig.type} failed: ${error}`);
      }
    }

    // Try next proxy
    if (proxyIndex < 3) {
      logDebug(`All players failed with proxy ${proxyIndex}, trying next...`);
      await tryLoadWithProxy(proxyIndex + 1);
    } else {
      throw new Error('All players and proxies failed');
    }
  };

  const initPlayer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      logDebug(`🚀 Starting load for: ${src.substring(0, 100)}...`);
      
      await tryLoadWithProxy(0);
      logDebug('✅ Player initialization completed successfully');
    } catch (error) {
      logDebug(`❌ All attempts failed: ${error}`);
      setError(`Failed to load stream: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanup = () => {
    try {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (shakaRef.current) {
        shakaRef.current.destroy();
        shakaRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.src = '';
        videoRef.current.load();
      }
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  };

  useEffect(() => {
    if (!src) return;
    
    cleanup();
    initPlayer();
    
    return cleanup;
  }, [src]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-lg mb-2">Carregando Stream...</div>
            <div className="text-sm text-gray-400">{debugInfo}</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-90">
          <div className="text-white text-center p-6">
            <div className="text-lg mb-4">❌ Erro ao Carregar</div>
            <div className="text-sm mb-4 text-gray-300">{error}</div>
            <div className="text-xs mb-4 text-gray-400">Debug: {debugInfo}</div>
            <button 
              onClick={initPlayer} 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-medium"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        className="w-full h-full"
        style={{ objectFit: 'contain' }}
      >
        Seu navegador não suporta o elemento de vídeo.
      </video>
      
      {!isLoading && !error && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded">
          {currentPlayer} | proxy {currentProxyIndex}
        </div>
      )}
      
      {debugInfo && !isLoading && !error && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded max-w-md">
          {debugInfo}
        </div>
      )}
    </div>
  );
};
