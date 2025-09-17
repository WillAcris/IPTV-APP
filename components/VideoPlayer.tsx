import { useEffect, useRef, useState } from 'react';
import { getProxiedUrl } from '../services/iptvService';

// Make players available in the window scope
declare global {
  interface Window {
    shaka: any;
    Hls: any;
    videojs: any;
    Plyr: any;
  }
}

interface VideoPlayerProps {
  src: string;
  channelName?: string;
}

type PlayerType = 'native' | 'videojs' | 'hls' | 'plyr' | 'shaka';

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<any>(null);
  const videojsRef = useRef<any>(null);
  const plyrRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>('native');
  const [currentProxyIndex, setCurrentProxyIndex] = useState<number>(0);

  const loadWithNativePlayer = async (url: string): Promise<boolean> => {
    try {
      console.log('🎬 Trying native HTML5 player...');
      const video = videoRef.current;
      if (!video) return false;

      video.src = url;
      video.load();
      
      return new Promise((resolve) => {
        const onCanPlay = () => {
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          console.log('✅ Native player loaded successfully');
          resolve(true);
        };
        
        const onError = () => {
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          console.log('❌ Native player failed');
          resolve(false);
        };

        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('error', onError);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          resolve(false);
        }, 10000);
      });
    } catch {
      return false;
    }
  };

  const loadWithVideoJs = async (url: string): Promise<boolean> => {
    try {
      console.log('🎬 Trying Video.js player...');
      const video = videoRef.current;
      if (!video || !window.videojs) return false;

      // Ensure video has required attributes for Video.js
      video.setAttribute('data-setup', '{}');
      video.className = 'video-js vjs-default-skin';
      
      const player = window.videojs(video, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        responsive: true,
        html5: {
          vhs: {
            overrideNative: true
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        }
      });

      videojsRef.current = player;
      
      return new Promise((resolve) => {
        player.ready(() => {
          player.src({
            src: url,
            type: 'application/x-mpegURL'
          });
          
          player.one('loadstart', () => {
            console.log('✅ Video.js loaded successfully');
            resolve(true);
          });
          
          player.one('error', () => {
            console.log('❌ Video.js failed');
            resolve(false);
          });
          
          setTimeout(() => resolve(false), 10000);
        });
      });
    } catch {
      return false;
    }
  };

  const loadWithPlyr = async (url: string): Promise<boolean> => {
    try {
      console.log('🎬 Trying Plyr player...');
      const video = videoRef.current;
      if (!video) return false;

      // Load Plyr dynamically if not loaded
      if (!window.Plyr) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.plyr.io/3.7.8/plyr.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
          
          // Also load CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
          document.head.appendChild(link);
        });
      }

      // Load HLS.js for Plyr
      if (!window.Hls) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (window.Hls.isSupported()) {
        const hls = new window.Hls();
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);

        const player = new window.Plyr(video, {
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
        });
        
        plyrRef.current = player;
        
        return new Promise((resolve) => {
          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            console.log('✅ Plyr + HLS.js loaded successfully');
            resolve(true);
          });
          
          hls.on(window.Hls.Events.ERROR, () => {
            console.log('❌ Plyr + HLS.js failed');
            resolve(false);
          });
          
          setTimeout(() => resolve(false), 10000);
        });
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const loadWithHlsJs = async (url: string): Promise<boolean> => {
    try {
      console.log('🎬 Trying HLS.js player...');
      const video = videoRef.current;
      if (!video) return false;

      // Load HLS.js dynamically if not loaded
      if (!window.Hls) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        
        return new Promise((resolve) => {
          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            console.log('✅ HLS.js loaded successfully');
            resolve(true);
          });
          
          hls.on(window.Hls.Events.ERROR, (event: any, data: any) => {
            console.log('❌ HLS.js failed:', data);
            resolve(false);
          });
          
          setTimeout(() => resolve(false), 10000);
        });
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const loadWithShakaPlayer = async (url: string): Promise<boolean> => {
    try {
      console.log('🎬 Trying Shaka Player...');
      const video = videoRef.current;
      if (!video || !window.shaka) return false;

      const player = new window.shaka.Player(video);
      playerRef.current = player;
      
      player.configure({
        streaming: {
          retryParameters: {
            timeout: 30000,
            maxAttempts: 3,
            baseDelay: 1000,
            backoffFactor: 2,
            fuzzFactor: 0.5
          }
        }
      });

      await player.load(url);
      console.log('✅ Shaka Player loaded successfully');
      return true;
    } catch (error) {
      console.log('❌ Shaka Player failed:', error);
      return false;
    }
  };

  const tryLoadWithProxy = async (proxyIndex: number = 0): Promise<void> => {
    const players: Array<{type: PlayerType, loader: (url: string) => Promise<boolean>}> = [
      { type: 'native', loader: loadWithNativePlayer },
      { type: 'videojs', loader: loadWithVideoJs },
      { type: 'plyr', loader: loadWithPlyr },
      { type: 'hls', loader: loadWithHlsJs },
      { type: 'shaka', loader: loadWithShakaPlayer }
    ];

    for (const playerConfig of players) {
      try {
        console.log(`🔄 Trying ${playerConfig.type} with proxy ${proxyIndex}`);
        const proxiedUrl = getProxiedUrl(src, proxyIndex);
        
        if (await playerConfig.loader(proxiedUrl)) {
          setCurrentPlayer(playerConfig.type);
          setCurrentProxyIndex(proxyIndex);
          setError(null);
          return;
        }
      } catch (error) {
        console.warn(`❌ ${playerConfig.type} with proxy ${proxyIndex} failed:`, error);
      }
    }

    // Try next proxy
    if (proxyIndex < 3) {
      await tryLoadWithProxy(proxyIndex + 1);
    } else {
      throw new Error('All players and proxies failed');
    }
  };

  const initPlayer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`🚀 Loading source: ${src}`);
      
      await tryLoadWithProxy(0);
    } catch (error) {
      console.error('❌ All loading attempts failed:', error);
      setError(`Failed to load stream: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanup = () => {
    try {
      if (videojsRef.current) {
        videojsRef.current.dispose();
        videojsRef.current = null;
        console.log('🧹 Video.js cleaned up');
      }
      
      if (plyrRef.current) {
        plyrRef.current.destroy();
        plyrRef.current = null;
        console.log('🧹 Plyr cleaned up');
      }
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
        console.log('🧹 HLS.js cleaned up');
      }
      
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        console.log('🧹 Shaka Player cleaned up');
      }
      
      if (videoRef.current) {
        videoRef.current.src = '';
        videoRef.current.load();
      }
    } catch (error) {
      console.warn('⚠️ Cleanup error:', error);
    }
  };

  useEffect(() => {
    if (!src) return;
    
    cleanup();
    initPlayer();
    
    return cleanup;
  }, [src]);

  return (
    <div className="video-player-container relative w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div>Carregando stream...</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80">
          <div className="text-white text-center p-4">
            <div className="mb-4">❌ {error}</div>
            <button 
              onClick={initPlayer} 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        className="w-full h-full"
      />
      
      {!isLoading && !error && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {currentPlayer} | proxy {currentProxyIndex}
        </div>
      )}
    </div>
  );
};
