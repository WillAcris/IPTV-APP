import { useEffect, useRef, useState } from 'react';
import { getProxiedUrl } from '../services/iptvService';

// Make Shaka Player and HLS.js available in the window scope
declare global {
  interface Window {
    shaka: any;
    Hls: any;
  }
}

interface VideoPlayerProps {
  src: string;
  channelName?: string;
}

type PlayerType = 'native' | 'hls' | 'shaka';

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<any>(null);
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
    
    const onError = (error: any) => {
        // Prevent error handling during loading process
        if (isLoadingRef.current) {
            return;
        }
        
        console.error('Shaka Player Error:', error.code, 'Object', error);
        
        // Enhanced error handling for common proxy-related issues
        if (error.code === 4000) {
            console.error('Manifest parsing failed - likely due to proxy issues or invalid stream format');
        } else if (error.code === 1001) {
            console.error('Network error - proxy might be failing or stream is unavailable');
        } else if (error.code === 3016) {
            console.error('Content is not supported - stream format might be incompatible');
        } else if (error.code === 6007) {
            console.error('Operation aborted - likely due to source change or component unmount');
        }
        
        // Log additional error details for better debugging
        if (error.detail) {
            console.error('Error details:', error.detail);
        }
        
        // Log the current proxy being used
        console.error(`Error occurred with proxy index: ${currentProxyIndexRef.current}`);
    };
    
    const tryLoadWithProxy = async (proxyIndex: number = 0): Promise<void> => {
        // Check if we should abort (component unmounting or src changed)
        if (!playerRef.current || !src) {
            throw new Error('Player or source not available');
        }
        
        try {
            const proxiedSrc = getProxiedUrl(src, proxyIndex);
            console.log(`Trying proxy ${proxyIndex}: ${proxiedSrc}`);
            
            // Validate the proxied URL
            if (!proxiedSrc || proxiedSrc.trim() === '') {
                throw new Error('Invalid proxied URL');
            }
            
            const loadPromise = player.load(proxiedSrc);
            const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Loading timeout after 15 seconds')), 15000)
            );
            
            await Promise.race([loadPromise, timeoutPromise]);
            console.log(`Successfully loaded with proxy ${proxyIndex}`);
            currentProxyIndexRef.current = proxyIndex;
        } catch (error) {
            console.warn(`Proxy ${proxyIndex} failed:`, error);
            
            // Try next proxy if available (max 4 proxies)
            if (proxyIndex < 3) {
                await tryLoadWithProxy(proxyIndex + 1);
            } else {
                throw new Error(`All proxy methods failed. Last error: ${error}`);
            }
        }
    };

    const initPlayer = async () => {
        try {
            isLoadingRef.current = true;
            console.log(`Initializing player for source: ${src}`);
            
            await player.attach(video);
            player.addEventListener('error', onError);
            
            // Try loading with different proxies
            await tryLoadWithProxy(0);
            console.log('The video has been loaded successfully!');
        } catch (e) {
            console.error('Failed to initialize player after all attempts:', e);
            onError(e);
        } finally {
            isLoadingRef.current = false;
        }
    };
    
    initPlayer();

    // Cleanup on component unmount or src change
    return () => {
      isLoadingRef.current = false;
      
      if (uiRef.current) {
        try {
          uiRef.current.destroy();
          console.log('Shaka Player UI destroyed.');
        } catch (e) {
          console.warn('Error destroying UI:', e);
        }
        uiRef.current = null;
      }
      
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          console.log('Shaka Player instance destroyed.');
        } catch (e) {
          console.warn('Error destroying player:', e);
        }
        playerRef.current = null;
      }
    };
  }, [src]); // Re-run effect when the 'src' prop changes

  return (
    <div 
        ref={containerRef}
        className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden"
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        playsInline
        // The poster can be used to show a logo or loading image
        // poster="//shaka-player-demo.appspot.com/assets/poster.jpg"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};